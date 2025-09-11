import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimationManager } from "./scroll-animations";
import { animationManager, AnimationManager } from "./animation-manager";
import {
  getDeviceInfo,
  getResponsiveAnimationConfig,
  ResponsivePerformanceMonitor,
  TouchInteractionManager,
  AccessibilityManager,
  prefersReducedMotion,
  prefersHighContrast,
} from "./theme-consistency";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// GSAP configuration for Astro client-side hydration
export class GSAPManager {
  private static instance: GSAPManager;
  private initialized = false;
  private responsivePerformanceMonitor: ResponsivePerformanceMonitor;
  private touchManager: TouchInteractionManager;
  private accessibilityManager: AccessibilityManager;
  private deviceInfo = getDeviceInfo();
  private responsiveConfig = getResponsiveAnimationConfig();

  private constructor() {
    this.responsivePerformanceMonitor =
      ResponsivePerformanceMonitor.getInstance();
    this.touchManager = TouchInteractionManager.getInstance();
    this.accessibilityManager = AccessibilityManager.getInstance();
  }

  public static getInstance(): GSAPManager {
    if (!GSAPManager.instance) {
      GSAPManager.instance = new GSAPManager();
    }
    return GSAPManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize GSAP with performance optimizations
      console.log("Initializing GSAP with performance optimizations");

      // Initialize AnimationManager for error handling and performance monitoring
      const animManager = AnimationManager.getInstance({
        enableDebugMode: true,
        enablePerformanceMonitoring: true,
        enableMemoryTracking: true,
        performanceThresholds: {
          minFPS: this.deviceInfo.isLowEndDevice ? 20 : 30,
          maxMemoryMB: this.deviceInfo.isLowEndDevice ? 50 : 100,
          maxAnimationDuration: 5000,
          maxConcurrentAnimations: this.deviceInfo.isLowEndDevice ? 4 : 8,
        },
      });

      // Set up error handling callbacks
      animManager.onError((error) => {
        console.warn(`Animation error (${error.type}):`, error.message);

        // Apply fallbacks for critical errors
        if (error.type === "gsap_load" || error.type === "animation_fail") {
          this.enableFallbackAnimations();
        }
      });

      // Set up performance monitoring callbacks
      animManager.onPerformanceChange((metrics) => {
        if (metrics.fps < 20) {
          console.warn(
            `Very low FPS detected: ${metrics.fps}fps - applying emergency optimizations`
          );
          this.applyEmergencyOptimizations();
        }

        if (metrics.memoryUsage > 150) {
          console.warn(
            `High memory usage: ${metrics.memoryUsage.toFixed(
              1
            )}MB - triggering cleanup`
          );
          this.performEmergencyCleanup();
        }
      });

      // Set responsive GSAP defaults with performance optimizations
      gsap.defaults({
        duration: this.responsiveConfig.duration.medium,
        ease: "power2.out",
        force3D: this.responsiveConfig.enableGPUAcceleration,
        // Performance optimizations
        lazy: false, // Disable lazy rendering for better performance
        autoCSS: true, // Enable automatic CSS property detection
      });

      // Enable GPU acceleration for animation-ready elements
      if (this.responsiveConfig.enableGPUAcceleration) {
        this.enableGPUAcceleration();
      }

      // Configure responsive ScrollTrigger defaults with performance optimizations
      const triggerOffset = this.deviceInfo.isMobile
        ? 0.7
        : this.deviceInfo.isTablet
        ? 0.6
        : 0.5;

      ScrollTrigger.defaults({
        toggleActions: "play none none reverse",
        start: `top ${(1 - triggerOffset) * 100}%`,
        end: "bottom 20%",
        // Performance optimizations
        refreshPriority: -1, // Lower priority for better performance
        anticipatePin: 1, // Anticipate pinning for smoother animations
      });

      // Set up responsive performance monitoring
      this.setupResponsiveMonitoring();

      // Set up accessibility features
      this.setupAccessibilityIntegration();

      // Enable ScrollTrigger refresh on resize with optimized debouncing
      let resizeTimeout: number;
      ScrollTrigger.addEventListener("refresh", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(() => {
          console.log("ScrollTrigger refreshed for responsive layout");
          this.updateResponsiveSettings();
          // Clean up off-screen animations to free memory
          this.cleanupOffScreenAnimations();
        }, 150);
      });

      // Set up optimized scroll handling with debouncing
      this.setupOptimizedScrollHandling();

      // Initialize page-specific animations
      this.initializePageAnimations();

      this.initialized = true;
      console.log(
        `GSAP initialized successfully for ${
          this.deviceInfo.isMobile
            ? "mobile"
            : this.deviceInfo.isTablet
            ? "tablet"
            : "desktop"
        } device`
      );
    } catch (error) {
      console.error("Failed to initialize GSAP:", error);
      throw error;
    }
  }

  public cleanup(): void {
    if (this.initialized) {
      // Cleanup AnimationManager
      animationManager.cleanup();

      // Stop responsive monitoring
      this.responsivePerformanceMonitor.stopMonitoring();

      // Clean up GSAP
      ScrollTrigger.killAll();
      gsap.killTweensOf("*");

      // Remove device classes
      const body = document.body;
      body.classList.remove(
        "device-mobile",
        "device-tablet",
        "device-desktop",
        "touch-device",
        "low-end-device",
        "animation-quality-low",
        "animation-quality-medium",
        "animation-quality-high",
        "memory-optimized",
        "slow-connection"
      );

      this.initialized = false;
      console.log("GSAP and responsive monitoring cleaned up");
    }
  }

  /**
   * Enable GPU acceleration for animation elements
   */
  private enableGPUAcceleration(): void {
    const animationElements = document.querySelectorAll(
      ".animate-ready, .animate-scale, .animate-slide-up"
    );
    animationElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        // Use transform3d to trigger hardware acceleration
        element.style.transform = element.style.transform
          ? `${element.style.transform} translateZ(0)`
          : "translateZ(0)";

        // Additional GPU acceleration properties
        element.style.backfaceVisibility = "hidden";
        element.style.willChange = "transform, opacity";
      }
    });
    console.log(
      `GPU acceleration enabled for ${animationElements.length} elements`
    );
  }

  /**
   * Set up optimized scroll handling with debouncing
   */
  private setupOptimizedScrollHandling(): void {
    let scrollTimeout: number;
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const direction = scrollY > (this as any).lastScrollY ? "down" : "up";
          (this as any).lastScrollY = scrollY;

          // Handle scroll-based optimizations
          if (direction === "down" && scrollY > 1000) {
            // User has scrolled significantly - can cleanup off-screen animations
            this.cleanupOffScreenAnimations();
          }

          isScrolling = false;
        });
        isScrolling = true;
      }

      // Debounced scroll end detection
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        // Scroll ended - can perform cleanup
        this.optimizeMemoryUsage();
      }, 150);
    };

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    (this as any).lastScrollY = window.scrollY;
  }

  /**
   * Clean up off-screen animations to free memory
   */
  private cleanupOffScreenAnimations(): void {
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Find elements that are far off-screen
    const animatedElements = document.querySelectorAll(
      ".animate-ready, .animate-in"
    );
    let cleanedCount = 0;

    animatedElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;

        // If element is more than 2 viewport heights away, cleanup its animations
        if (Math.abs(elementTop - scrollY) > viewportHeight * 2) {
          gsap.killTweensOf(element);
          // Reset will-change to auto to free GPU memory
          element.style.willChange = "auto";
          cleanedCount++;
        }
      }
    });

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} off-screen animations`);
    }
  }

  /**
   * Optimize memory usage by cleaning up unused resources
   */
  private optimizeMemoryUsage(): void {
    // Clear completed animations
    const completedElements = document.querySelectorAll(".animate-in");
    completedElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        // Reset will-change for completed animations
        element.style.willChange = "auto";
      }
    });

    // Force garbage collection if available (development only)
    if (
      typeof window !== "undefined" &&
      (window as any).gc &&
      process.env.NODE_ENV === "development"
    ) {
      (window as any).gc();
    }
  }

  /**
   * Enable fallback animations when GSAP fails
   */
  private enableFallbackAnimations(): void {
    const body = document.body;
    body.classList.add("animation-fallback-mode");

    // Apply CSS fallback styles
    const style = document.createElement("style");
    style.textContent = `
      .animation-fallback-mode .animate-ready,
      .animation-fallback-mode .animate-fade,
      .animation-fallback-mode .animate-slide-up,
      .animation-fallback-mode .animate-slide-down,
      .animation-fallback-mode .animate-slide-left,
      .animation-fallback-mode .animate-slide-right,
      .animation-fallback-mode .animate-scale,
      .animation-fallback-mode .animate-rotate {
        opacity: 1 !important;
        transform: none !important;
        transition: all 0.3s ease-out !important;
      }
    `;
    document.head.appendChild(style);

    console.log("Fallback animations enabled");
  }

  /**
   * Apply emergency performance optimizations
   */
  private applyEmergencyOptimizations(): void {
    const body = document.body;

    // Disable all non-essential animations
    body.classList.add("emergency-performance-mode");

    // Speed up all animations
    gsap.globalTimeline.timeScale(3);

    // Disable GPU acceleration
    body.classList.add("disable-gpu-acceleration");

    // Apply emergency CSS
    const style = document.createElement("style");
    style.textContent = `
      .emergency-performance-mode * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      .disable-gpu-acceleration * {
        transform: translateZ(0) !important;
        will-change: auto !important;
      }
    `;
    document.head.appendChild(style);

    console.warn("Emergency performance optimizations applied");

    // Reset after 5 seconds
    setTimeout(() => {
      gsap.globalTimeline.timeScale(1);
      body.classList.remove("emergency-performance-mode");
    }, 5000);
  }

  /**
   * Perform emergency memory cleanup
   */
  private performEmergencyCleanup(): void {
    // Kill all non-essential animations
    gsap.killTweensOf("*");

    // Clear ScrollTrigger cache
    ScrollTrigger.clearMatchMedia();
    ScrollTrigger.refresh();

    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }

    // Clear any cached elements
    const cachedElements = document.querySelectorAll("[data-gsap-cache]");
    cachedElements.forEach((el) => {
      el.removeAttribute("data-gsap-cache");
    });

    console.warn("Emergency memory cleanup performed");
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Set up responsive performance monitoring
   */
  private setupResponsiveMonitoring(): void {
    // Start performance monitoring
    this.responsivePerformanceMonitor.startMonitoring();

    // Monitor performance and adjust animations
    this.responsivePerformanceMonitor.addPerformanceCallback((metrics) => {
      if (metrics.shouldThrottle) {
        // Apply performance optimizations
        this.applyPerformanceOptimizations();
      }
    });

    // Monitor touch interactions
    this.touchManager.addScrollVelocityCallback((velocity) => {
      if (velocity > 3) {
        // Fast scrolling detected - speed up animations
        gsap.globalTimeline.timeScale(2);
        setTimeout(() => {
          gsap.globalTimeline.timeScale(1);
        }, 500);
      }
    });

    // Apply device-specific CSS classes
    this.applyDeviceClasses();
  }

  /**
   * Apply performance optimizations based on device capabilities
   */
  private applyPerformanceOptimizations(): void {
    const body = document.body;

    if (this.responsiveConfig.quality === "low") {
      body.classList.add("animation-quality-low");
      body.classList.remove(
        "animation-quality-medium",
        "animation-quality-high"
      );
    } else if (this.responsiveConfig.quality === "medium") {
      body.classList.add("animation-quality-medium");
      body.classList.remove("animation-quality-low", "animation-quality-high");
    } else {
      body.classList.add("animation-quality-high");
      body.classList.remove(
        "animation-quality-low",
        "animation-quality-medium"
      );
    }

    // Apply memory optimization if needed
    if (this.deviceInfo.isLowEndDevice) {
      body.classList.add("memory-optimized");
    }

    // Apply connection-based optimizations
    if (this.deviceInfo.connectionSpeed === "slow") {
      body.classList.add("slow-connection");
    }
  }

  /**
   * Apply device-specific CSS classes
   */
  private applyDeviceClasses(): void {
    const body = document.body;

    // Device type classes
    if (this.deviceInfo.isMobile) {
      body.classList.add("device-mobile");
    } else if (this.deviceInfo.isTablet) {
      body.classList.add("device-tablet");
    } else {
      body.classList.add("device-desktop");
    }

    // Touch device class
    if (this.deviceInfo.isTouchDevice) {
      body.classList.add("touch-device");
    }

    // Low-end device class
    if (this.deviceInfo.isLowEndDevice) {
      body.classList.add("low-end-device");
    }

    // Accessibility classes
    if (prefersReducedMotion()) {
      body.classList.add("reduced-motion-enabled");
    }

    if (prefersHighContrast()) {
      body.classList.add("high-contrast-enabled");
    }

    if (this.accessibilityManager.isScreenReaderActive()) {
      body.classList.add("screen-reader-active");
    }
  }

  /**
   * Set up accessibility integration with GSAP
   */
  private setupAccessibilityIntegration(): void {
    // Disable animations if reduced motion is preferred
    if (prefersReducedMotion()) {
      gsap.globalTimeline.timeScale(0.01);
      console.log("Reduced motion detected - animations minimized");
    }

    // Set up accessibility event listeners
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    reducedMotionQuery.addEventListener("change", (e) => {
      if (e.matches) {
        gsap.globalTimeline.timeScale(0.01);
        this.makeAllContentAccessible();
        console.log("Reduced motion enabled - animations disabled");
      } else {
        gsap.globalTimeline.timeScale(1);
        console.log("Reduced motion disabled - animations restored");
      }
    });

    // Handle high contrast mode
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
    highContrastQuery.addEventListener("change", (e) => {
      if (e.matches) {
        this.makeAllContentAccessible();
        document.body.classList.add("high-contrast-enabled");
        console.log("High contrast mode enabled");
      } else {
        document.body.classList.remove("high-contrast-enabled");
        console.log("High contrast mode disabled");
      }
    });

    // Set up keyboard controls for animations
    document.addEventListener("keydown", (e) => {
      // Only handle if user is using keyboard navigation
      if (!this.accessibilityManager.isKeyboardNavigationActive()) return;

      switch (e.key) {
        case "Escape":
          gsap.globalTimeline.pause();
          this.accessibilityManager.createAnimationAnnouncement(
            "Animations paused. Press Enter to resume.",
            "assertive"
          );
          break;
        case "Enter":
          if (gsap.globalTimeline.paused()) {
            gsap.globalTimeline.resume();
            this.accessibilityManager.createAnimationAnnouncement(
              "Animations resumed",
              "polite"
            );
          }
          break;
        case " ": // Spacebar
          e.preventDefault();
          if (gsap.globalTimeline.paused()) {
            gsap.globalTimeline.resume();
          } else {
            gsap.globalTimeline.pause();
          }
          break;
      }
    });

    console.log("Accessibility integration initialized");
  }

  /**
   * Make all animated content immediately accessible
   */
  private makeAllContentAccessible(): void {
    const animatedElements = document.querySelectorAll(
      ".animate-ready, .animate-fade, .animate-slide-up, .animate-slide-down, " +
        ".animate-slide-left, .animate-slide-right, .animate-scale, .animate-rotate"
    );

    animatedElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        // Make content immediately visible
        gsap.set(element, {
          opacity: 1,
          clearProps: "transform",
        });

        // Update accessibility attributes
        element.setAttribute("aria-hidden", "false");
        element.classList.add("animate-in");

        // Ensure keyboard navigation
        this.accessibilityManager.makeKeyboardNavigable(element);
      }
    });

    console.log("All animated content made immediately accessible");
  }

  /**
   * Update responsive settings when viewport changes
   */
  private updateResponsiveSettings(): void {
    this.deviceInfo = getDeviceInfo();
    this.responsiveConfig = getResponsiveAnimationConfig();

    // Update GSAP defaults
    gsap.defaults({
      duration: this.responsiveConfig.duration.medium,
      force3D: this.responsiveConfig.enableGPUAcceleration,
    });

    // Reapply device classes
    this.applyDeviceClasses();
    this.applyPerformanceOptimizations();
  }

  private initializePageAnimations(): void {
    // Get responsive stagger and threshold values
    const staggerDelay = this.deviceInfo.isMobile
      ? 0.1
      : this.deviceInfo.isTablet
      ? 0.15
      : 0.2;
    const threshold = this.deviceInfo.isMobile
      ? 0.7
      : this.deviceInfo.isTablet
      ? 0.6
      : 0.5;

    // Initialize project cards animation if on projects page
    const projectCards = document.querySelectorAll(".project-card");
    if (projectCards.length > 0) {
      console.log(
        `Initializing project cards animation for ${
          this.deviceInfo.isMobile
            ? "mobile"
            : this.deviceInfo.isTablet
            ? "tablet"
            : "desktop"
        }`
      );
      scrollAnimationManager.createProjectCardsAnimation(".project-card", {
        stagger: staggerDelay,
        threshold: threshold,
        enablePerformanceMonitoring: !this.deviceInfo.isLowEndDevice,
      });
    }

    // Initialize hero sequence if on homepage
    const heroSection = document.querySelector("#hero-section");
    if (heroSection) {
      console.log(
        `Initializing hero sequence animation for ${
          this.deviceInfo.isMobile
            ? "mobile"
            : this.deviceInfo.isTablet
            ? "tablet"
            : "desktop"
        }`
      );
      scrollAnimationManager.createScrollTriggeredHeroSequence(
        "#hero-section",
        {
          name: ".hero-name",
          role: ".hero-role",
          description: ".hero-description",
          image: ".hero-image",
          social: ".hero-social",
        },
        {
          threshold: threshold,
          staggerDelay: staggerDelay * 0.5,
          enablePerformanceMonitoring: !this.deviceInfo.isLowEndDevice,
        }
      );
    }

    // Initialize about page timeline animations
    const educationTimeline = document.querySelector(
      '[data-animation="education-timeline"]'
    );
    const experienceTimeline = document.querySelector(
      '[data-animation="experience-timeline"]'
    );
    const techStackHeader = document.querySelector(
      '[data-animation="techstack-header"]'
    );
    const techStackMarquee = document.querySelector(
      '[data-animation="techstack-marquee"]'
    );
    const achievementsCard = document.querySelector(
      '[data-animation="achievements-card"]'
    );
    const achievementsHeader = document.querySelector(
      '[data-animation="achievements-header"]'
    );

    if (
      educationTimeline ||
      experienceTimeline ||
      techStackHeader ||
      techStackMarquee ||
      achievementsCard ||
      achievementsHeader
    ) {
      console.log(
        `Initializing about page timeline animations for ${
          this.deviceInfo.isMobile
            ? "mobile"
            : this.deviceInfo.isTablet
            ? "tablet"
            : "desktop"
        }`
      );
      scrollAnimationManager.createAboutPageTimelineAnimations();
    }

    // Initialize certificate grid animation if on about page
    const certificatesGrid = document.querySelector(
      '[data-animation="certificates-grid"]'
    );
    if (certificatesGrid) {
      console.log(
        `Initializing certificate grid animation for ${
          this.deviceInfo.isMobile
            ? "mobile"
            : this.deviceInfo.isTablet
            ? "tablet"
            : "desktop"
        }`
      );
      scrollAnimationManager.createCertificateGridAnimation(
        ".certificate-card",
        {
          stagger: staggerDelay * 0.75,
          threshold: threshold,
        }
      );
    }

    // Initialize certificates header animation if on about page
    const certificatesHeader = document.querySelector(
      '[data-animation="certificates-header"]'
    );
    if (certificatesHeader) {
      console.log("Initializing certificates header animation");
      scrollAnimationManager.createSectionHeaderAnimation(
        '[data-animation="certificates-header"]',
        {
          threshold: threshold,
          animationType: "fadeIn",
        }
      );
    }

    // Log device-specific initialization info
    console.log("Device Info:", {
      type: this.deviceInfo.isMobile
        ? "mobile"
        : this.deviceInfo.isTablet
        ? "tablet"
        : "desktop",
      isTouch: this.deviceInfo.isTouchDevice,
      isLowEnd: this.deviceInfo.isLowEndDevice,
      connection: this.deviceInfo.connectionSpeed,
      quality: this.responsiveConfig.quality,
      maxAnimations: this.responsiveConfig.maxConcurrentAnimations,
    });
  }
}

// Auto-initialize when script loads in browser
if (typeof window !== "undefined") {
  const manager = GSAPManager.getInstance();

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      manager.initialize();
    });
  } else {
    manager.initialize();
  }

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    manager.cleanup();
  });
}

export { gsap, ScrollTrigger };
