/**
 * AnimationManager - Comprehensive error handling and performance monitoring for GSAP animations
 * Provides fallbacks, FPS monitoring, memory tracking, and debugging utilities
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ResponsivePerformanceMonitor,
  AccessibilityManager,
  getDeviceInfo,
  getResponsiveAnimationConfig,
  prefersReducedMotion,
  type PerformanceMetrics,
} from "./theme-consistency";

export interface AnimationError {
  type: "gsap_load" | "animation_fail" | "performance" | "memory" | "timeout";
  message: string;
  element?: HTMLElement;
  timestamp: number;
  stack?: string;
}

export interface PerformanceThresholds {
  minFPS: number;
  maxMemoryMB: number;
  maxAnimationDuration: number;
  maxConcurrentAnimations: number;
}

export interface AnimationManagerConfig {
  enableFallbacks: boolean;
  enablePerformanceMonitoring: boolean;
  enableMemoryTracking: boolean;
  enableDebugMode: boolean;
  performanceThresholds: PerformanceThresholds;
  fallbackDuration: number;
}

/**
 * AnimationManager class with comprehensive error handling and performance monitoring
 */
export class AnimationManager {
  private static instance: AnimationManager;
  private config: AnimationManagerConfig;
  private errors: AnimationError[] = [];
  private performanceMonitor: ResponsivePerformanceMonitor;
  private accessibilityManager: AccessibilityManager;
  private isInitialized = false;
  private activeAnimations = new Set<gsap.core.Animation>();
  private memoryUsage = 0;
  private lastMemoryCheck = 0;
  private performanceAdjustments = 0;
  private fallbackMode = false;
  private debugMode = false;

  // Performance tracking
  private frameCount = 0;
  private lastFrameTime = 0;
  private currentFPS = 60;
  private fpsHistory: number[] = [];
  private memoryHistory: number[] = [];

  // Error tracking
  private errorCallbacks: Array<(error: AnimationError) => void> = [];
  private performanceCallbacks: Array<(metrics: PerformanceMetrics) => void> =
    [];

  private constructor(config?: Partial<AnimationManagerConfig>) {
    this.config = {
      enableFallbacks: true,
      enablePerformanceMonitoring: true,
      enableMemoryTracking: true,
      enableDebugMode: false,
      performanceThresholds: {
        minFPS: 30,
        maxMemoryMB: 100,
        maxAnimationDuration: 5000,
        maxConcurrentAnimations: 8,
      },
      fallbackDuration: 300,
      ...config,
    };

    this.performanceMonitor = ResponsivePerformanceMonitor.getInstance();
    this.accessibilityManager = AccessibilityManager.getInstance();
    this.debugMode = this.config.enableDebugMode;

    this.initialize();
  }

  public static getInstance(
    config?: Partial<AnimationManagerConfig>
  ): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager(config);
    }
    return AnimationManager.instance;
  }

  /**
   * Initialize the AnimationManager with error handling
   */
  private async initialize(): Promise<void> {
    try {
      // Check if GSAP is available
      if (typeof gsap === "undefined") {
        throw new Error("GSAP library not loaded");
      }

      // Set up global error handling for GSAP
      this.setupGSAPErrorHandling();

      // Initialize performance monitoring
      if (this.config.enablePerformanceMonitoring) {
        this.startPerformanceMonitoring();
      }

      // Initialize memory tracking
      if (this.config.enableMemoryTracking) {
        this.startMemoryTracking();
      }

      // Set up page unload cleanup
      this.setupCleanupHandlers();

      // Set up responsive performance callbacks
      this.setupResponsiveCallbacks();

      this.isInitialized = true;
      this.logDebug("AnimationManager initialized successfully");
    } catch (error) {
      this.handleError({
        type: "gsap_load",
        message: `Failed to initialize AnimationManager: ${
          error instanceof Error ? error.message : String(error)
        }`,
        timestamp: Date.now(),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Enable fallback mode
      this.enableFallbackMode();
    }
  }

  /**
   * Set up GSAP-specific error handling
   */
  private setupGSAPErrorHandling(): void {
    // Override GSAP's default error handling
    const originalGSAPError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(" ");
      if (message.includes("GSAP") || message.includes("ScrollTrigger")) {
        this.handleError({
          type: "animation_fail",
          message: `GSAP Error: ${message}`,
          timestamp: Date.now(),
        });
      }
      originalGSAPError.apply(console, args);
    };

    // Set up GSAP timeline error callbacks
    gsap.globalTimeline.eventCallback("onComplete", () => {
      this.logDebug("Global timeline completed");
    });

    // Monitor for failed animations
    const originalTo = gsap.to;
    gsap.to = (targets: any, vars: any) => {
      try {
        const animation = originalTo.call(gsap, targets, vars);

        // Track active animations
        this.activeAnimations.add(animation);

        // Set up completion callback to remove from tracking
        animation.eventCallback("onComplete", () => {
          this.activeAnimations.delete(animation);
        });

        // Set up error callback
        animation.eventCallback("onInterrupt", () => {
          this.activeAnimations.delete(animation);
          this.logDebug("Animation interrupted");
        });

        return animation;
      } catch (error) {
        this.handleError({
          type: "animation_fail",
          message: `Failed to create GSAP animation: ${
            error instanceof Error ? error.message : String(error)
          }`,
          timestamp: Date.now(),
          stack: error instanceof Error ? error.stack : undefined,
        });

        // Return fallback animation
        return this.createFallbackAnimation(targets, vars);
      }
    };
  }

  /**
   * Start FPS monitoring and automatic performance adjustments
   */
  private startPerformanceMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const monitorFrame = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        this.currentFPS = Math.round(
          (frameCount * 1000) / (currentTime - lastTime)
        );
        this.fpsHistory.push(this.currentFPS);

        // Keep only last 10 FPS readings
        if (this.fpsHistory.length > 10) {
          this.fpsHistory.shift();
        }

        frameCount = 0;
        lastTime = currentTime;

        // Check performance thresholds
        this.checkPerformanceThresholds();

        // Notify performance callbacks
        this.notifyPerformanceCallbacks();
      }

      if (this.config.enablePerformanceMonitoring) {
        requestAnimationFrame(monitorFrame);
      }
    };

    requestAnimationFrame(monitorFrame);
    this.logDebug("Performance monitoring started");
  }

  /**
   * Start memory usage tracking
   */
  private startMemoryTracking(): void {
    const trackMemory = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        this.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
        this.memoryHistory.push(this.memoryUsage);

        // Keep only last 10 memory readings
        if (this.memoryHistory.length > 10) {
          this.memoryHistory.shift();
        }

        // Check memory thresholds
        if (this.memoryUsage > this.config.performanceThresholds.maxMemoryMB) {
          this.handleError({
            type: "memory",
            message: `High memory usage detected: ${this.memoryUsage.toFixed(
              1
            )}MB`,
            timestamp: Date.now(),
          });

          // Trigger memory cleanup
          this.performMemoryCleanup();
        }
      }

      this.lastMemoryCheck = Date.now();
    };

    // Track memory every 5 seconds
    setInterval(trackMemory, 5000);
    trackMemory(); // Initial check

    this.logDebug("Memory tracking started");
  }

  /**
   * Check performance thresholds and apply automatic adjustments
   */
  private checkPerformanceThresholds(): void {
    const { minFPS, maxConcurrentAnimations } =
      this.config.performanceThresholds;

    // Check FPS threshold
    if (this.currentFPS < minFPS) {
      this.handleError({
        type: "performance",
        message: `Low FPS detected: ${this.currentFPS}fps (threshold: ${minFPS}fps)`,
        timestamp: Date.now(),
      });

      this.applyPerformanceOptimizations();
    }

    // Check concurrent animations
    if (this.activeAnimations.size > maxConcurrentAnimations) {
      this.handleError({
        type: "performance",
        message: `Too many concurrent animations: ${this.activeAnimations.size} (max: ${maxConcurrentAnimations})`,
        timestamp: Date.now(),
      });

      this.throttleAnimations();
    }
  }

  /**
   * Apply performance optimizations when thresholds are exceeded
   */
  private applyPerformanceOptimizations(): void {
    this.performanceAdjustments++;

    // Speed up existing animations
    gsap.globalTimeline.timeScale(1.5);

    // Reduce animation quality
    const deviceInfo = getDeviceInfo();
    if (!deviceInfo.isLowEndDevice) {
      document.body.classList.add("animation-quality-low");
      document.body.classList.remove(
        "animation-quality-medium",
        "animation-quality-high"
      );
    }

    // Disable GPU acceleration if performance is very poor
    if (this.currentFPS < 15) {
      document.body.classList.add("disable-gpu-acceleration");
    }

    this.logDebug(
      `Applied performance optimization #${this.performanceAdjustments}`
    );

    // Reset timeline scale after a delay
    setTimeout(() => {
      gsap.globalTimeline.timeScale(1);
    }, 2000);
  }

  /**
   * Throttle animations by completing some immediately
   */
  private throttleAnimations(): void {
    let completed = 0;
    const maxToComplete = Math.floor(this.activeAnimations.size * 0.3);

    for (const animation of this.activeAnimations) {
      if (completed >= maxToComplete) break;

      if (animation.progress() > 0.1 && animation.progress() < 0.9) {
        animation.progress(1);
        completed++;
      }
    }

    this.logDebug(`Throttled ${completed} animations`);
  }

  /**
   * Perform memory cleanup
   */
  private performMemoryCleanup(): void {
    // Kill completed animations
    this.activeAnimations.forEach((animation) => {
      if (animation.progress() === 1) {
        animation.kill();
        this.activeAnimations.delete(animation);
      }
    });

    // Clear GSAP cache
    gsap.killTweensOf("*");

    // Refresh ScrollTrigger to clean up unused instances
    ScrollTrigger.refresh();

    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }

    this.logDebug("Memory cleanup performed");
  }

  /**
   * Set up cleanup handlers for page unload
   */
  private setupCleanupHandlers(): void {
    const cleanup = () => {
      this.cleanup();
    };

    window.addEventListener("beforeunload", cleanup);
    window.addEventListener("pagehide", cleanup);

    // Also cleanup on visibility change (mobile)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.pauseAllAnimations();
      } else {
        this.resumeAllAnimations();
      }
    });
  }

  /**
   * Set up responsive performance callbacks
   */
  private setupResponsiveCallbacks(): void {
    this.performanceMonitor.addPerformanceCallback(
      (metrics: PerformanceMetrics) => {
        if (metrics.shouldThrottle && !this.fallbackMode) {
          this.applyPerformanceOptimizations();
        }
      }
    );
  }

  /**
   * Create fallback CSS animation when GSAP fails
   */
  private createFallbackAnimation(targets: any, vars: any): gsap.core.Tween {
    this.logDebug("Creating fallback animation");

    // Apply immediate CSS transition
    const elements = gsap.utils.toArray(targets) as HTMLElement[];
    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.transition = `all ${this.config.fallbackDuration}ms ease-out`;

        // Apply basic transformations
        if (vars.opacity !== undefined) {
          element.style.opacity = String(vars.opacity);
        }
        if (vars.x !== undefined) {
          element.style.transform = `translateX(${vars.x}px)`;
        }
        if (vars.y !== undefined) {
          element.style.transform = `translateY(${vars.y}px)`;
        }
        if (vars.scale !== undefined) {
          element.style.transform = `scale(${vars.scale})`;
        }
      }
    });

    // Return a mock tween object
    return {
      progress: () => 1,
      kill: () => {},
      eventCallback: () => {},
    } as any;
  }

  /**
   * Enable fallback mode with CSS transitions
   */
  private enableFallbackMode(): void {
    this.fallbackMode = true;
    document.body.classList.add("animation-fallback-mode");

    // Make all animated content immediately visible
    const animatedElements = document.querySelectorAll(
      ".animate-ready, .animate-fade, .animate-slide-up, .animate-slide-down, " +
        ".animate-slide-left, .animate-slide-right, .animate-scale, .animate-rotate"
    );

    animatedElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.opacity = "1";
        element.style.transform = "none";
        element.style.transition = `all ${this.config.fallbackDuration}ms ease-out`;
      }
    });

    this.logDebug("Fallback mode enabled");
  }

  /**
   * Handle animation errors
   */
  private handleError(error: AnimationError): void {
    this.errors.push(error);

    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors.shift();
    }

    // Log error with appropriate level
    if (error.type === "performance" || error.type === "memory") {
      console.warn(`AnimationManager ${error.type}:`, error.message);
    } else {
      console.error(`AnimationManager ${error.type}:`, error.message);
    }

    // Notify error callbacks
    this.errorCallbacks.forEach((callback) => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error("Error in error callback:", callbackError);
      }
    });

    // Enable fallback mode for critical errors
    if (error.type === "gsap_load" && this.config.enableFallbacks) {
      this.enableFallbackMode();
    }
  }

  /**
   * Notify performance callbacks
   */
  private notifyPerformanceCallbacks(): void {
    const metrics: PerformanceMetrics = {
      fps: this.currentFPS,
      memoryUsage: this.memoryUsage,
      animationCount: this.activeAnimations.size,
      shouldThrottle:
        this.currentFPS < this.config.performanceThresholds.minFPS,
    };

    this.performanceCallbacks.forEach((callback) => {
      try {
        callback(metrics);
      } catch (error) {
        console.error("Error in performance callback:", error);
      }
    });
  }

  /**
   * Debug logging
   */
  private logDebug(message: string): void {
    if (this.debugMode) {
      console.log(`[AnimationManager] ${message}`);
    }
  }

  // Public API methods

  /**
   * Add error callback
   */
  public onError(callback: (error: AnimationError) => void): void {
    this.errorCallbacks.push(callback);
  }

  /**
   * Add performance callback
   */
  public onPerformanceChange(
    callback: (metrics: PerformanceMetrics) => void
  ): void {
    this.performanceCallbacks.push(callback);
  }

  /**
   * Get current performance metrics
   */
  public getPerformanceMetrics(): PerformanceMetrics & {
    fpsHistory: number[];
    memoryHistory: number[];
    errorCount: number;
    performanceAdjustments: number;
  } {
    return {
      fps: this.currentFPS,
      memoryUsage: this.memoryUsage,
      animationCount: this.activeAnimations.size,
      shouldThrottle:
        this.currentFPS < this.config.performanceThresholds.minFPS,
      fpsHistory: [...this.fpsHistory],
      memoryHistory: [...this.memoryHistory],
      errorCount: this.errors.length,
      performanceAdjustments: this.performanceAdjustments,
    };
  }

  /**
   * Get recent errors
   */
  public getErrors(): AnimationError[] {
    return [...this.errors];
  }

  /**
   * Clear error history
   */
  public clearErrors(): void {
    this.errors = [];
  }

  /**
   * Pause all animations
   */
  public pauseAllAnimations(): void {
    gsap.globalTimeline.pause();
    this.logDebug("All animations paused");
  }

  /**
   * Resume all animations
   */
  public resumeAllAnimations(): void {
    gsap.globalTimeline.resume();
    this.logDebug("All animations resumed");
  }

  /**
   * Enable debug mode
   */
  public enableDebugMode(): void {
    this.debugMode = true;
    this.config.enableDebugMode = true;
    console.log("AnimationManager debug mode enabled");
  }

  /**
   * Disable debug mode
   */
  public disableDebugMode(): void {
    this.debugMode = false;
    this.config.enableDebugMode = false;
  }

  /**
   * Force performance optimization
   */
  public optimizePerformance(): void {
    this.applyPerformanceOptimizations();
    this.performMemoryCleanup();
  }

  /**
   * Check if fallback mode is active
   */
  public isFallbackMode(): boolean {
    return this.fallbackMode;
  }

  /**
   * Get active animation count
   */
  public getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }

  /**
   * Cleanup all resources
   */
  public cleanup(): void {
    // Stop monitoring
    this.config.enablePerformanceMonitoring = false;
    this.config.enableMemoryTracking = false;

    // Kill all animations
    this.activeAnimations.forEach((animation) => {
      animation.kill();
    });
    this.activeAnimations.clear();

    // Kill all GSAP animations and ScrollTriggers
    gsap.killTweensOf("*");
    ScrollTrigger.killAll();

    // Clear callbacks
    this.errorCallbacks = [];
    this.performanceCallbacks = [];

    // Clear histories
    this.fpsHistory = [];
    this.memoryHistory = [];
    this.errors = [];

    this.logDebug("AnimationManager cleanup completed");
  }
}

// Export singleton instance
export const animationManager = AnimationManager.getInstance();

// Auto-initialize when script loads
if (typeof window !== "undefined") {
  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      animationManager.enableDebugMode();
    });
  } else {
    animationManager.enableDebugMode();
  }
}
