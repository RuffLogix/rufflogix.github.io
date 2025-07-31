/**
 * Theme consistency utilities for maintaining consistent styling across all pages
 */

export interface ThemeConfig {
  colors: {
    primary: string;
    accent: string;
    accentHover: string;
    background: string;
    text: string;
    textMuted: string;
    card: string;
    border: string;
  };
  timing: {
    fast: number;
    medium: number;
    slow: number;
  };
  easing: {
    default: string;
    bounce: string;
    smooth: string;
  };
  animation: {
    offset: string;
    staggerDelay: number;
  };
}

export interface PageTheme {
  background: string;
  textColor: string;
  accentColor: string;
  cardBackground: string;
  borderColor: string;
}

/**
 * Get the current theme configuration from CSS custom properties
 */
export function getThemeConfig(): ThemeConfig {
  const root = document.documentElement;
  const getProperty = (property: string) =>
    getComputedStyle(root).getPropertyValue(property).trim();

  return {
    colors: {
      primary: getProperty("--color-primary"),
      accent: getProperty("--color-accent"),
      accentHover: getProperty("--color-accent-hover"),
      background: getProperty("--color-background"),
      text: getProperty("--color-text"),
      textMuted: getProperty("--color-text-muted"),
      card: getProperty("--color-card"),
      border: getProperty("--color-border"),
    },
    timing: {
      fast: parseFloat(getProperty("--timing-fast")),
      medium: parseFloat(getProperty("--timing-medium")),
      slow: parseFloat(getProperty("--timing-slow")),
    },
    easing: {
      default: getProperty("--easing-default"),
      bounce: getProperty("--easing-bounce"),
      smooth: getProperty("--easing-smooth"),
    },
    animation: {
      offset: getProperty("--animation-offset"),
      staggerDelay: parseFloat(getProperty("--stagger-delay")),
    },
  };
}

/**
 * Apply consistent theme to a page
 */
export function applyPageTheme(theme?: Partial<PageTheme>): void {
  const root = document.documentElement;
  const config = getThemeConfig();

  const pageTheme: PageTheme = {
    background: theme?.background || config.colors.background,
    textColor: theme?.textColor || config.colors.text,
    accentColor: theme?.accentColor || config.colors.accent,
    cardBackground: theme?.cardBackground || config.colors.card,
    borderColor: theme?.borderColor || config.colors.border,
    ...theme,
  };

  // Apply theme to document body
  document.body.style.backgroundColor = pageTheme.background;
  document.body.style.color = pageTheme.textColor;
}

/**
 * Create consistent card styling
 */
export function getCardStyles(): Record<string, string> {
  const config = getThemeConfig();

  return {
    backgroundColor: config.colors.card,
    borderColor: config.colors.border,
    color: config.colors.text,
    transition: `all ${config.timing.medium}s ${config.easing.default}`,
  };
}

/**
 * Create consistent button styling
 */
export function getButtonStyles(
  variant: "primary" | "secondary" = "primary",
): Record<string, string> {
  const config = getThemeConfig();

  const baseStyles = {
    transition: `all ${config.timing.fast}s ${config.easing.default}`,
    borderRadius: "0.375rem", // rounded-md
    padding: "0.5rem 1rem",
    fontWeight: "500",
  };

  if (variant === "primary") {
    return {
      ...baseStyles,
      backgroundColor: config.colors.accent,
      color: config.colors.text,
    };
  }

  return {
    ...baseStyles,
    backgroundColor: "transparent",
    color: config.colors.accent,
    border: `1px solid ${config.colors.accent}`,
  };
}

/**
 * Get hover styles for buttons
 */
export function getButtonHoverStyles(
  variant: "primary" | "secondary" = "primary",
): Record<string, string> {
  const config = getThemeConfig();

  if (variant === "primary") {
    return {
      backgroundColor: config.colors.accentHover,
    };
  }

  return {
    backgroundColor: config.colors.accent,
    color: config.colors.text,
  };
}

/**
 * Get consistent animation timing for GSAP
 */
export function getAnimationTiming(): {
  fast: number;
  medium: number;
  slow: number;
} {
  const config = getThemeConfig();
  return config.timing;
}

/**
 * Get consistent easing functions for GSAP
 */
export function getAnimationEasing(): {
  default: string;
  bounce: string;
  smooth: string;
} {
  const config = getThemeConfig();
  return config.easing;
}

/**
 * Apply consistent hover effects to an element
 */
export function applyHoverEffect(
  element: HTMLElement,
  options?: {
    scale?: number;
    duration?: number;
    easing?: string;
  },
): void {
  const config = getThemeConfig();
  const {
    scale = 1.02,
    duration = config.timing.fast,
    easing = config.easing.default,
  } = options || {};

  element.style.transition = `transform ${duration}s ${easing}`;

  element.addEventListener("mouseenter", () => {
    element.style.transform = `scale(${scale})`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "scale(1)";
  });
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia("(prefers-contrast: high)").matches;
}

/**
 * Check if user prefers reduced data
 */
export function prefersReducedData(): boolean {
  return window.matchMedia("(prefers-reduced-data: reduce)").matches;
}

/**
 * Get animation duration based on user preferences
 */
export function getResponsiveAnimationDuration(baseDuration: number): number {
  return prefersReducedMotion() ? 0.01 : baseDuration;
}

/**
 * Accessibility utilities for animations
 */
export class AccessibilityManager {
  private static instance: AccessibilityManager;
  private reducedMotionEnabled = false;
  private highContrastEnabled = false;
  private keyboardNavigationActive = false;
  private screenReaderActive = false;
  private focusedElement: HTMLElement | null = null;

  private constructor() {
    this.setupAccessibilityListeners();
    this.detectScreenReader();
  }

  public static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager();
    }
    return AccessibilityManager.instance;
  }

  private setupAccessibilityListeners(): void {
    // Monitor reduced motion preference changes
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    this.reducedMotionEnabled = reducedMotionQuery.matches;

    reducedMotionQuery.addEventListener("change", (e) => {
      this.reducedMotionEnabled = e.matches;
      this.updateAccessibilityClasses();
      console.log(
        `Reduced motion preference changed: ${
          e.matches ? "enabled" : "disabled"
        }`,
      );
    });

    // Monitor high contrast preference changes
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
    this.highContrastEnabled = highContrastQuery.matches;

    highContrastQuery.addEventListener("change", (e) => {
      this.highContrastEnabled = e.matches;
      this.updateAccessibilityClasses();
      console.log(
        `High contrast preference changed: ${
          e.matches ? "enabled" : "disabled"
        }`,
      );
    });

    // Detect keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        this.keyboardNavigationActive = true;
        document.body.classList.add("keyboard-navigation-active");
      }
    });

    document.addEventListener("mousedown", () => {
      this.keyboardNavigationActive = false;
      document.body.classList.remove("keyboard-navigation-active");
    });

    // Track focus for screen reader compatibility
    document.addEventListener("focusin", (e) => {
      this.focusedElement = e.target as HTMLElement;
      this.announceAnimationState(this.focusedElement);
    });

    document.addEventListener("focusout", () => {
      this.focusedElement = null;
    });
  }

  private detectScreenReader(): void {
    // Detect common screen readers
    const userAgent = navigator.userAgent.toLowerCase();
    const screenReaderPatterns = [
      "nvda",
      "jaws",
      "dragon",
      "zoomtext",
      "magic",
      "supernova",
      "narrator",
      "voiceover",
      "talkback",
      "orca",
    ];

    this.screenReaderActive = screenReaderPatterns.some((pattern) =>
      userAgent.includes(pattern),
    );

    // Alternative detection method using accessibility API
    if (!this.screenReaderActive && "speechSynthesis" in window) {
      // Check if speech synthesis is being used (potential screen reader)
      this.screenReaderActive = window.speechSynthesis.getVoices().length > 0;
    }

    if (this.screenReaderActive) {
      document.body.classList.add("screen-reader-active");
      console.log("Screen reader detected - optimizing for accessibility");
    }
  }

  private updateAccessibilityClasses(): void {
    const body = document.body;

    // Apply reduced motion class
    if (this.reducedMotionEnabled) {
      body.classList.add("reduced-motion-enabled");
    } else {
      body.classList.remove("reduced-motion-enabled");
    }

    // Apply high contrast class
    if (this.highContrastEnabled) {
      body.classList.add("high-contrast-enabled");
    } else {
      body.classList.remove("high-contrast-enabled");
    }
  }

  private announceAnimationState(element: HTMLElement): void {
    if (!this.screenReaderActive || !element) return;

    // Check if element is animated
    const isAnimated =
      element.classList.contains("animate-ready") ||
      element.classList.contains("animate-in");

    if (isAnimated) {
      // Ensure element is properly labeled for screen readers
      if (
        !element.getAttribute("aria-label") &&
        !element.getAttribute("aria-labelledby")
      ) {
        const textContent = element.textContent?.trim();
        if (textContent) {
          element.setAttribute("aria-label", textContent);
        }
      }

      // Announce when animation completes
      if (element.classList.contains("animate-in")) {
        element.setAttribute("aria-live", "polite");
        element.setAttribute("aria-atomic", "true");
      }
    }
  }

  public isReducedMotionEnabled(): boolean {
    return this.reducedMotionEnabled;
  }

  public isHighContrastEnabled(): boolean {
    return this.highContrastEnabled;
  }

  public isKeyboardNavigationActive(): boolean {
    return this.keyboardNavigationActive;
  }

  public isScreenReaderActive(): boolean {
    return this.screenReaderActive;
  }

  public getFocusedElement(): HTMLElement | null {
    return this.focusedElement;
  }

  /**
   * Make an element keyboard navigable
   */
  public makeKeyboardNavigable(
    element: HTMLElement,
    options?: {
      role?: string;
      label?: string;
      description?: string;
    },
  ): void {
    const { role, label, description } = options || {};

    // Add keyboard navigation class
    element.classList.add("keyboard-navigable");

    // Make focusable if not already
    if (
      !element.hasAttribute("tabindex") &&
      !element.matches("a, button, input, select, textarea")
    ) {
      element.setAttribute("tabindex", "0");
    }

    // Add ARIA attributes
    if (role) {
      element.setAttribute("role", role);
    }

    if (label) {
      element.setAttribute("aria-label", label);
    }

    if (description) {
      element.setAttribute("aria-describedby", description);
    }

    // Ensure proper focus handling during animations
    element.addEventListener("animationstart", () => {
      if (element === this.focusedElement) {
        element.setAttribute("aria-live", "polite");
      }
    });

    element.addEventListener("animationend", () => {
      element.removeAttribute("aria-live");
    });
  }

  /**
   * Create accessible animation announcements
   */
  public createAnimationAnnouncement(
    message: string,
    priority: "polite" | "assertive" = "polite",
  ): void {
    if (!this.screenReaderActive) return;

    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Ensure focus is maintained during animations
   */
  public maintainFocusDuringAnimation(element: HTMLElement): void {
    if (!this.keyboardNavigationActive) return;

    const originalTabIndex = element.getAttribute("tabindex");
    const originalOutline = element.style.outline;

    // Ensure element remains focusable during animation
    element.addEventListener("animationstart", () => {
      if (element === this.focusedElement) {
        element.style.outline = "2px solid var(--color-accent)";
        element.style.outlineOffset = "2px";
        element.style.zIndex = "10";
      }
    });

    element.addEventListener("animationend", () => {
      if (originalOutline) {
        element.style.outline = originalOutline;
      } else {
        element.style.removeProperty("outline");
      }
      element.style.removeProperty("outline-offset");
      element.style.removeProperty("z-index");
    });
  }

  /**
   * Create skip navigation links
   */
  public createSkipLinks(targets: Array<{ id: string; label: string }>): void {
    const skipContainer = document.createElement("div");
    skipContainer.className = "skip-links";
    skipContainer.setAttribute("aria-label", "Skip navigation links");

    targets.forEach(({ id, label }) => {
      const skipLink = document.createElement("a");
      skipLink.href = `#${id}`;
      skipLink.className = "skip-to-content";
      skipLink.textContent = `Skip to ${label}`;

      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });

      skipContainer.appendChild(skipLink);
    });

    document.body.insertBefore(skipContainer, document.body.firstChild);
  }
}

/**
 * Device and viewport detection utilities
 */
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  isLowEndDevice: boolean;
  connectionSpeed: "slow" | "fast" | "unknown";
}

/**
 * Get current device information
 */
export function getDeviceInfo(): DeviceInfo {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const devicePixelRatio = window.devicePixelRatio || 1;

  // Device type detection
  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
  const isDesktop = viewportWidth >= 1024;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Performance detection
  const isLowEndDevice = detectLowEndDevice();
  const connectionSpeed = detectConnectionSpeed();

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    viewportWidth,
    viewportHeight,
    devicePixelRatio,
    isLowEndDevice,
    connectionSpeed,
  };
}

/**
 * Detect if device is low-end based on various factors
 */
function detectLowEndDevice(): boolean {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 1;
  if (cores <= 2) return true;

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory;
  if (memory && memory <= 2) return true;

  // Check device pixel ratio (high DPR can impact performance)
  const dpr = window.devicePixelRatio || 1;
  if (dpr > 2) return true;

  // Check user agent for known low-end devices
  const userAgent = navigator.userAgent.toLowerCase();
  const lowEndPatterns = [
    "android 4",
    "android 5",
    "android 6",
    "iphone 5",
    "iphone 6",
    "ipad 2",
    "ipad 3",
    "ipad 4",
  ];

  return lowEndPatterns.some((pattern) => userAgent.includes(pattern));
}

/**
 * Detect connection speed
 */
function detectConnectionSpeed(): "slow" | "fast" | "unknown" {
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!connection) return "unknown";

  // Check effective connection type
  if (connection.effectiveType) {
    const slowTypes = ["slow-2g", "2g", "3g"];
    return slowTypes.includes(connection.effectiveType) ? "slow" : "fast";
  }

  // Fallback to downlink speed
  if (connection.downlink) {
    return connection.downlink < 1.5 ? "slow" : "fast";
  }

  return "unknown";
}

/**
 * Get responsive animation configuration based on device capabilities
 */
export function getResponsiveAnimationConfig(): {
  duration: {
    fast: number;
    medium: number;
    slow: number;
  };
  stagger: {
    fast: number;
    medium: number;
    slow: number;
  };
  distance: {
    small: number;
    medium: number;
    large: number;
  };
  quality: "low" | "medium" | "high";
  enableGPUAcceleration: boolean;
  maxConcurrentAnimations: number;
} {
  const deviceInfo = getDeviceInfo();
  const baseConfig = getThemeConfig();

  // Adjust configuration based on device capabilities
  let durationMultiplier = 1;
  let staggerMultiplier = 1;
  let distanceMultiplier = 1;
  let quality: "low" | "medium" | "high" = "high";
  let enableGPUAcceleration = true;
  let maxConcurrentAnimations = 10;

  // Mobile optimizations
  if (deviceInfo.isMobile) {
    durationMultiplier = 0.8; // Faster animations on mobile
    staggerMultiplier = 0.7; // Reduced stagger delays
    distanceMultiplier = 0.7; // Smaller animation distances
    maxConcurrentAnimations = 6;
  }

  // Low-end device optimizations
  if (deviceInfo.isLowEndDevice) {
    durationMultiplier *= 0.6; // Much faster animations
    staggerMultiplier *= 0.5; // Minimal stagger
    distanceMultiplier *= 0.5; // Smaller distances
    quality = "low";
    maxConcurrentAnimations = 3;
  }

  // Slow connection optimizations
  if (deviceInfo.connectionSpeed === "slow") {
    durationMultiplier *= 0.7;
    quality = quality === "high" ? "medium" : "low";
    maxConcurrentAnimations = Math.min(maxConcurrentAnimations, 4);
  }

  // Disable GPU acceleration on very low-end devices
  if (deviceInfo.isLowEndDevice && deviceInfo.connectionSpeed === "slow") {
    enableGPUAcceleration = false;
  }

  return {
    duration: {
      fast: baseConfig.timing.fast * durationMultiplier,
      medium: baseConfig.timing.medium * durationMultiplier,
      slow: baseConfig.timing.slow * durationMultiplier,
    },
    stagger: {
      fast: 0.05 * staggerMultiplier,
      medium: 0.1 * staggerMultiplier,
      slow: 0.2 * staggerMultiplier,
    },
    distance: {
      small: 20 * distanceMultiplier,
      medium: 50 * distanceMultiplier,
      large: 100 * distanceMultiplier,
    },
    quality,
    enableGPUAcceleration,
    maxConcurrentAnimations,
  };
}

/**
 * Get viewport-specific animation settings
 */
export function getViewportAnimationSettings(): {
  triggerOffset: number;
  animationDistance: number;
  staggerDelay: number;
  enableParallax: boolean;
} {
  const deviceInfo = getDeviceInfo();

  if (deviceInfo.isMobile) {
    return {
      triggerOffset: 0.7, // Trigger animations earlier on mobile
      animationDistance: 30, // Smaller animation distances
      staggerDelay: 0.08, // Faster stagger
      enableParallax: false, // Disable parallax on mobile
    };
  }

  if (deviceInfo.isTablet) {
    return {
      triggerOffset: 0.6,
      animationDistance: 40,
      staggerDelay: 0.1,
      enableParallax: true,
    };
  }

  // Desktop
  return {
    triggerOffset: 0.5,
    animationDistance: 50,
    staggerDelay: 0.15,
    enableParallax: true,
  };
}

/**
 * Touch interaction utilities
 */
export class TouchInteractionManager {
  private static instance: TouchInteractionManager;
  private touchStartTime = 0;
  private touchStartY = 0;
  private isScrolling = false;
  private scrollVelocity = 0;
  private lastScrollTime = 0;
  private callbacks: Array<(velocity: number) => void> = [];

  private constructor() {
    this.setupTouchListeners();
  }

  public static getInstance(): TouchInteractionManager {
    if (!TouchInteractionManager.instance) {
      TouchInteractionManager.instance = new TouchInteractionManager();
    }
    return TouchInteractionManager.instance;
  }

  private setupTouchListeners(): void {
    let lastTouchY = 0;
    let lastTouchTime = 0;

    document.addEventListener(
      "touchstart",
      (e) => {
        this.touchStartTime = Date.now();
        this.touchStartY = e.touches[0].clientY;
        lastTouchY = e.touches[0].clientY;
        lastTouchTime = Date.now();
        this.isScrolling = false;
      },
      { passive: true },
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        const currentY = e.touches[0].clientY;
        const currentTime = Date.now();
        const deltaY = currentY - lastTouchY;
        const deltaTime = currentTime - lastTouchTime;

        if (deltaTime > 0) {
          this.scrollVelocity = Math.abs(deltaY / deltaTime);
          this.isScrolling = true;
          this.lastScrollTime = currentTime;

          // Notify callbacks about scroll velocity
          this.callbacks.forEach((callback) => callback(this.scrollVelocity));
        }

        lastTouchY = currentY;
        lastTouchTime = currentTime;
      },
      { passive: true },
    );

    document.addEventListener(
      "touchend",
      () => {
        // Gradually reduce scroll velocity
        const fadeVelocity = () => {
          if (this.scrollVelocity > 0.1) {
            this.scrollVelocity *= 0.95;
            requestAnimationFrame(fadeVelocity);
          } else {
            this.scrollVelocity = 0;
            this.isScrolling = false;
          }
        };

        setTimeout(fadeVelocity, 100);
      },
      { passive: true },
    );
  }

  public addScrollVelocityCallback(callback: (velocity: number) => void): void {
    this.callbacks.push(callback);
  }

  public getScrollVelocity(): number {
    return this.scrollVelocity;
  }

  public isCurrentlyScrolling(): boolean {
    return this.isScrolling;
  }

  public isFastScroll(): boolean {
    return this.scrollVelocity > 2; // Threshold for fast scrolling
  }
}

/**
 * Performance monitoring and optimization
 */
export class ResponsivePerformanceMonitor {
  private static instance: ResponsivePerformanceMonitor;
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private isMonitoring = false;
  private performanceCallbacks: Array<(metrics: PerformanceMetrics) => void> =
    [];
  private memoryUsage = 0;
  private animationCount = 0;
  private maxAnimations: number;

  private constructor() {
    const config = getResponsiveAnimationConfig();
    this.maxAnimations = config.maxConcurrentAnimations;
  }

  public static getInstance(): ResponsivePerformanceMonitor {
    if (!ResponsivePerformanceMonitor.instance) {
      ResponsivePerformanceMonitor.instance =
        new ResponsivePerformanceMonitor();
    }
    return ResponsivePerformanceMonitor.instance;
  }

  public startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.monitorFrame();
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
  }

  public addPerformanceCallback(
    callback: (metrics: PerformanceMetrics) => void,
  ): void {
    this.performanceCallbacks.push(callback);
  }

  public incrementAnimationCount(): void {
    this.animationCount++;
  }

  public decrementAnimationCount(): void {
    this.animationCount = Math.max(0, this.animationCount - 1);
  }

  public shouldThrottleAnimations(): boolean {
    return this.animationCount >= this.maxAnimations || this.fps < 30;
  }

  public getOptimalAnimationSettings(): {
    duration: number;
    stagger: number;
    quality: "low" | "medium" | "high";
  } {
    const config = getResponsiveAnimationConfig();

    if (this.fps < 20) {
      return {
        duration: config.duration.fast,
        stagger: config.stagger.fast,
        quality: "low",
      };
    } else if (this.fps < 40) {
      return {
        duration: config.duration.medium,
        stagger: config.stagger.medium,
        quality: "medium",
      };
    }

    return {
      duration: config.duration.slow,
      stagger: config.stagger.slow,
      quality: "high",
    };
  }

  private monitorFrame = (): void => {
    if (!this.isMonitoring) return;

    this.frameCount++;
    const currentTime = performance.now();

    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round(
        (this.frameCount * 1000) / (currentTime - this.lastTime),
      );
      this.frameCount = 0;
      this.lastTime = currentTime;

      // Update memory usage if available
      if ((performance as any).memory) {
        this.memoryUsage =
          (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
      }

      const metrics: PerformanceMetrics = {
        fps: this.fps,
        memoryUsage: this.memoryUsage,
        animationCount: this.animationCount,
        shouldThrottle: this.shouldThrottleAnimations(),
      };

      // Notify callbacks
      this.performanceCallbacks.forEach((callback) => callback(metrics));

      // Log performance warnings
      if (this.fps < 30) {
        console.warn(
          `Low FPS detected: ${this.fps}fps - Throttling animations`,
        );
      }

      if (this.memoryUsage > 100) {
        console.warn(`High memory usage: ${this.memoryUsage.toFixed(1)}MB`);
      }
    }

    requestAnimationFrame(this.monitorFrame);
  };
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  animationCount: number;
  shouldThrottle: boolean;
}
/**
 * Accessibility validation and testing utilities
 */
export class AccessibilityValidator {
  private static instance: AccessibilityValidator;
  private accessibilityManager: AccessibilityManager;

  private constructor() {
    this.accessibilityManager = AccessibilityManager.getInstance();
  }

  public static getInstance(): AccessibilityValidator {
    if (!AccessibilityValidator.instance) {
      AccessibilityValidator.instance = new AccessibilityValidator();
    }
    return AccessibilityValidator.instance;
  }

  /**
   * Validate accessibility of animated elements
   */
  public validateAccessibility(): {
    issues: Array<{
      element: HTMLElement;
      issue: string;
      severity: "error" | "warning";
    }>;
    score: number;
  } {
    const issues: Array<{
      element: HTMLElement;
      issue: string;
      severity: "error" | "warning";
    }> = [];

    // Check for animated elements without proper ARIA attributes
    const animatedElements = document.querySelectorAll(
      ".animate-ready, .animate-fade, .animate-slide-up, .animate-slide-down, " +
        ".animate-slide-left, .animate-slide-right, .animate-scale, .animate-rotate",
    );

    animatedElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        // Check for missing aria-hidden attribute
        if (!element.hasAttribute("aria-hidden")) {
          issues.push({
            element,
            issue: "Animated element missing aria-hidden attribute",
            severity: "warning",
          });
        }

        // Check for missing keyboard accessibility
        if (
          !element.hasAttribute("tabindex") &&
          !element.matches("a, button, input, select, textarea") &&
          !element.classList.contains("keyboard-navigable")
        ) {
          issues.push({
            element,
            issue: "Animated element not keyboard accessible",
            severity: "error",
          });
        }

        // Check for missing labels on interactive elements
        if (
          element.matches("button, a") &&
          !element.getAttribute("aria-label") &&
          !element.getAttribute("aria-labelledby") &&
          !element.textContent?.trim()
        ) {
          issues.push({
            element,
            issue: "Interactive animated element missing accessible label",
            severity: "error",
          });
        }
      }
    });

    // Check for missing skip links
    const skipLinks = document.querySelectorAll(".skip-to-content");
    if (skipLinks.length === 0) {
      issues.push({
        element: document.body,
        issue: "No skip navigation links found",
        severity: "error",
      });
    }

    // Calculate accessibility score
    const totalElements = animatedElements.length;
    const errorCount = issues.filter(
      (issue) => issue.severity === "error",
    ).length;
    const warningCount = issues.filter(
      (issue) => issue.severity === "warning",
    ).length;

    const score = Math.max(0, 100 - errorCount * 10 - warningCount * 5);

    return { issues, score };
  }

  /**
   * Test keyboard navigation
   */
  public async testKeyboardNavigation(): Promise<{
    passed: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];
    let passed = true;

    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), .keyboard-navigable',
    );

    // Test if all focusable elements can receive focus
    focusableElements.forEach((element, index) => {
      if (element instanceof HTMLElement) {
        element.focus();
        if (document.activeElement !== element) {
          passed = false;
          issues.push(`Element at index ${index} cannot receive focus`);
        }
      }
    });

    // Test tab order
    const tabOrder: HTMLElement[] = [];
    let currentElement =
      (document.querySelector('[tabindex="0"]') as HTMLElement) ||
      (document.querySelector("a, button, input") as HTMLElement);

    if (currentElement) {
      currentElement.focus();
      tabOrder.push(currentElement);

      // Simulate tab navigation
      for (let i = 0; i < Math.min(focusableElements.length, 20); i++) {
        const tabEvent = new KeyboardEvent("keydown", { key: "Tab" });
        document.dispatchEvent(tabEvent);

        await new Promise((resolve) => setTimeout(resolve, 10));

        if (
          document.activeElement &&
          document.activeElement !== currentElement
        ) {
          currentElement = document.activeElement as HTMLElement;
          tabOrder.push(currentElement);
        }
      }
    }

    if (tabOrder.length < focusableElements.length / 2) {
      passed = false;
      issues.push("Tab navigation may not be working correctly");
    }

    return { passed, issues };
  }

  /**
   * Test screen reader compatibility
   */
  public testScreenReaderCompatibility(): {
    passed: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    let passed = true;

    // Check for proper ARIA labels
    const interactiveElements = document.querySelectorAll(
      "button, a, input, select, textarea",
    );
    interactiveElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const hasLabel =
          element.getAttribute("aria-label") ||
          element.getAttribute("aria-labelledby") ||
          element.textContent?.trim() ||
          (element as HTMLInputElement).placeholder;

        if (!hasLabel) {
          passed = false;
          issues.push(
            `Interactive element missing accessible label: ${element.tagName}`,
          );
        }
      }
    });

    // Check for proper heading structure
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let lastLevel = 0;
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > lastLevel + 1) {
        passed = false;
        issues.push(
          `Heading level skip detected: ${heading.tagName} after h${lastLevel}`,
        );
      }
      lastLevel = level;
    });

    // Check for alt text on images
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.getAttribute("alt") && !img.getAttribute("aria-label")) {
        passed = false;
        issues.push("Image missing alt text");
      }
    });

    return { passed, issues };
  }

  /**
   * Create accessibility status indicator
   */
  public createAccessibilityStatusIndicator(): void {
    const statusIndicator = document.createElement("div");
    statusIndicator.className = "accessibility-status";
    statusIndicator.setAttribute("aria-live", "polite");
    statusIndicator.setAttribute("aria-atomic", "true");

    const updateStatus = () => {
      const statuses = [];

      if (this.accessibilityManager.isReducedMotionEnabled()) {
        statuses.push("Reduced motion enabled");
        statusIndicator.classList.add("reduced-motion");
      }

      if (this.accessibilityManager.isHighContrastEnabled()) {
        statuses.push("High contrast enabled");
        statusIndicator.classList.add("high-contrast");
      }

      if (this.accessibilityManager.isScreenReaderActive()) {
        statuses.push("Screen reader detected");
        statusIndicator.classList.add("screen-reader");
      }

      if (statuses.length > 0) {
        statusIndicator.textContent = statuses.join(", ");
        statusIndicator.classList.add("visible");
      } else {
        statusIndicator.classList.remove("visible");
      }
    };

    // Update status initially and on changes
    updateStatus();

    // Listen for preference changes
    window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .addEventListener("change", updateStatus);
    window
      .matchMedia("(prefers-contrast: high)")
      .addEventListener("change", updateStatus);

    document.body.appendChild(statusIndicator);
  }

  /**
   * Run comprehensive accessibility audit
   */
  public async runAccessibilityAudit(): Promise<{
    overallScore: number;
    animationAccessibility: ReturnType<typeof this.validateAccessibility>;
    keyboardNavigation: Awaited<ReturnType<typeof this.testKeyboardNavigation>>;
    screenReaderCompatibility: ReturnType<
      typeof this.testScreenReaderCompatibility
    >;
    recommendations: string[];
  }> {
    const animationAccessibility = this.validateAccessibility();
    const keyboardNavigation = await this.testKeyboardNavigation();
    const screenReaderCompatibility = this.testScreenReaderCompatibility();

    const recommendations: string[] = [];

    // Generate recommendations based on issues
    if (!keyboardNavigation.passed) {
      recommendations.push(
        "Improve keyboard navigation by ensuring all interactive elements are focusable",
      );
    }

    if (!screenReaderCompatibility.passed) {
      recommendations.push(
        "Add proper ARIA labels and semantic markup for screen readers",
      );
    }

    if (animationAccessibility.score < 80) {
      recommendations.push(
        "Improve animation accessibility by adding proper ARIA attributes",
      );
    }

    if (this.accessibilityManager.isReducedMotionEnabled()) {
      recommendations.push(
        "User has reduced motion enabled - ensure all content is immediately visible",
      );
    }

    // Calculate overall score
    const scores = [
      animationAccessibility.score,
      keyboardNavigation.passed ? 100 : 50,
      screenReaderCompatibility.passed ? 100 : 50,
    ];
    const overallScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;

    return {
      overallScore,
      animationAccessibility,
      keyboardNavigation,
      screenReaderCompatibility,
      recommendations,
    };
  }
}
