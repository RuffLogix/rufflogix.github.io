import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	getAnimationTiming,
	getAnimationEasing,
	prefersReducedMotion,
	prefersHighContrast,
	prefersReducedData,
	getResponsiveAnimationDuration,
	getDeviceInfo,
	getResponsiveAnimationConfig,
	getViewportAnimationSettings,
	TouchInteractionManager,
	ResponsivePerformanceMonitor,
	AccessibilityManager,
	type PerformanceMetrics,
} from "./theme-consistency";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export type AnimationType =
	| "hero-sequence"
	| "project-cards"
	| "timeline-items"
	| "certificate-grid"
	| "section-headers"
	| "fadeIn"
	| "slideUp"
	| "slideLeft"
	| "slideRight"
	| "stagger"
	| "scale";

export interface AnimationConfig {
	trigger: string | HTMLElement;
	start?: string;
	end?: string;
	scrub?: boolean;
	animation: gsap.core.Timeline;
	markers?: boolean;
	toggleActions?: string;
	threshold?: number;
}

export interface ScrollTriggerConfig {
	trigger: string | HTMLElement;
	start?: string;
	end?: string;
	scrub?: boolean;
	markers?: boolean;
	toggleActions?: string;
	onEnter?: () => void;
	onLeave?: () => void;
	onEnterBack?: () => void;
	onLeaveBack?: () => void;
}

export interface AnimationDefinition {
	name: AnimationType;
	selector: string;
	timeline: () => gsap.core.Timeline;
	scrollTrigger?: ScrollTriggerConfig;
}

/**
 * Animation Timeline Factory
 * Creates reusable animation timelines with consistent timing and easing
 */
export class AnimationTimelineFactory {
	private timing = getAnimationTiming();
	private easing = getAnimationEasing();
	private responsiveConfig = getResponsiveAnimationConfig();
	private viewportSettings = getViewportAnimationSettings();
	private touchManager = TouchInteractionManager.getInstance();
	private performanceMonitor = ResponsivePerformanceMonitor.getInstance();
	private accessibilityManager = AccessibilityManager.getInstance();

	/**
	 * Create a fade-in animation timeline
	 */
	public createFadeInTimeline(
		elements: string | HTMLElement | HTMLElement[],
		options?: {
			duration?: number;
			delay?: number;
			stagger?: number;
			ease?: string;
		}
	): gsap.core.Timeline {
		const {
			duration = this.responsiveConfig.duration.medium,
			delay = 0,
			stagger = this.responsiveConfig.stagger.medium,
			ease = this.easing.default,
		} = options || {};

		const tl = gsap.timeline();
		const responsiveDuration = getResponsiveAnimationDuration(duration);
		const responsiveDelay = getResponsiveAnimationDuration(delay);
		const responsiveStagger = prefersReducedMotion() ? 0 : stagger;

		// Performance monitoring
		this.performanceMonitor.incrementAnimationCount();

		// Set initial state with accessibility considerations
		if (!prefersReducedMotion()) {
			gsap.set(elements, {
				opacity: 0,
				// Add GPU acceleration if enabled
				...(this.responsiveConfig.enableGPUAcceleration && {
					force3D: true,
					backfaceVisibility: "hidden",
				}),
			});

			// Set up accessibility attributes for screen readers
			if (this.accessibilityManager.isScreenReaderActive()) {
				const elementArray = Array.isArray(elements) ? elements : [elements];
				elementArray.forEach((el) => {
					if (el instanceof HTMLElement) {
						el.setAttribute("aria-hidden", "true");
						this.accessibilityManager.makeKeyboardNavigable(el);
					}
				});
			}
		} else {
			// Ensure content is immediately visible for reduced motion users
			gsap.set(elements, {
				opacity: 1,
				clearProps: "transform",
			});
		}

		// Adjust animation based on touch scrolling
		const adjustedDuration = this.touchManager.isFastScroll()
			? responsiveDuration * 0.5
			: responsiveDuration;

		tl.to(elements, {
			opacity: 1,
			duration: adjustedDuration,
			ease,
			delay: responsiveDelay,
			stagger: responsiveStagger,
			onStart: () => {
				// Announce animation start for screen readers
				if (this.accessibilityManager.isScreenReaderActive()) {
					this.accessibilityManager.createAnimationAnnouncement(
						"Content is loading",
						"polite"
					);
				}
			},
			onComplete: () => {
				this.performanceMonitor.decrementAnimationCount();

				// Update accessibility attributes when animation completes
				if (this.accessibilityManager.isScreenReaderActive()) {
					const elementArray = Array.isArray(elements) ? elements : [elements];
					elementArray.forEach((el) => {
						if (el instanceof HTMLElement) {
							el.setAttribute("aria-hidden", "false");
							el.classList.add("animate-in");
						}
					});
					this.accessibilityManager.createAnimationAnnouncement(
						"Content loaded",
						"polite"
					);
				}
			},
		});

		return tl;
	}

	/**
	 * Create a slide-up animation timeline
	 */
	public createSlideUpTimeline(
		elements: string | HTMLElement | HTMLElement[],
		options?: {
			duration?: number;
			delay?: number;
			stagger?: number;
			distance?: number;
			ease?: string;
		}
	): gsap.core.Timeline {
		const {
			duration = this.responsiveConfig.duration.medium,
			delay = 0,
			stagger = this.responsiveConfig.stagger.medium,
			distance = this.responsiveConfig.distance.medium,
			ease = this.easing.default,
		} = options || {};

		const tl = gsap.timeline();
		const responsiveDuration = getResponsiveAnimationDuration(duration);
		const responsiveDelay = getResponsiveAnimationDuration(delay);
		const responsiveStagger = prefersReducedMotion() ? 0 : stagger;
		const responsiveDistance =
			this.viewportSettings.animationDistance || distance;

		// Performance monitoring
		this.performanceMonitor.incrementAnimationCount();

		// Set initial state
		if (!prefersReducedMotion()) {
			gsap.set(elements, {
				opacity: 0,
				y: responsiveDistance,
				// Add GPU acceleration if enabled
				...(this.responsiveConfig.enableGPUAcceleration && {
					force3D: true,
					backfaceVisibility: "hidden",
				}),
			});
		}

		// Adjust animation based on touch scrolling
		const adjustedDuration = this.touchManager.isFastScroll()
			? responsiveDuration * 0.5
			: responsiveDuration;

		tl.to(elements, {
			opacity: 1,
			y: 0,
			duration: adjustedDuration,
			ease,
			delay: responsiveDelay,
			stagger: responsiveStagger,
			onComplete: () => {
				this.performanceMonitor.decrementAnimationCount();
			},
		});

		return tl;
	}

	/**
	 * Create a slide-left animation timeline
	 */
	public createSlideLeftTimeline(
		elements: string | HTMLElement | HTMLElement[],
		options?: {
			duration?: number;
			delay?: number;
			stagger?: number;
			distance?: number;
			ease?: string;
		}
	): gsap.core.Timeline {
		const {
			duration = this.responsiveConfig.duration.medium,
			delay = 0,
			stagger = this.responsiveConfig.stagger.medium,
			distance = this.responsiveConfig.distance.medium,
			ease = this.easing.default,
		} = options || {};

		const tl = gsap.timeline();
		const responsiveDuration = getResponsiveAnimationDuration(duration);
		const responsiveDelay = getResponsiveAnimationDuration(delay);
		const responsiveStagger = prefersReducedMotion() ? 0 : stagger;
		const responsiveDistance =
			this.viewportSettings.animationDistance || distance;

		// Performance monitoring
		this.performanceMonitor.incrementAnimationCount();

		// Set initial state
		if (!prefersReducedMotion()) {
			gsap.set(elements, {
				opacity: 0,
				x: responsiveDistance,
				// Add GPU acceleration if enabled
				...(this.responsiveConfig.enableGPUAcceleration && {
					force3D: true,
					backfaceVisibility: "hidden",
				}),
			});
		}

		// Adjust animation based on touch scrolling
		const adjustedDuration = this.touchManager.isFastScroll()
			? responsiveDuration * 0.5
			: responsiveDuration;

		tl.to(elements, {
			opacity: 1,
			x: 0,
			duration: adjustedDuration,
			ease,
			delay: responsiveDelay,
			stagger: responsiveStagger,
			onComplete: () => {
				this.performanceMonitor.decrementAnimationCount();
			},
		});

		return tl;
	}

	/**
	 * Create a slide-right animation timeline
	 */
	public createSlideRightTimeline(
		elements: string | HTMLElement | HTMLElement[],
		options?: {
			duration?: number;
			delay?: number;
			stagger?: number;
			distance?: number;
			ease?: string;
		}
	): gsap.core.Timeline {
		const {
			duration = this.responsiveConfig.duration.medium,
			delay = 0,
			stagger = this.responsiveConfig.stagger.medium,
			distance = this.responsiveConfig.distance.medium,
			ease = this.easing.default,
		} = options || {};

		const tl = gsap.timeline();
		const responsiveDuration = getResponsiveAnimationDuration(duration);
		const responsiveDelay = getResponsiveAnimationDuration(delay);
		const responsiveStagger = prefersReducedMotion() ? 0 : stagger;
		const responsiveDistance =
			this.viewportSettings.animationDistance || distance;

		// Performance monitoring
		this.performanceMonitor.incrementAnimationCount();

		// Set initial state
		if (!prefersReducedMotion()) {
			gsap.set(elements, {
				opacity: 0,
				x: -responsiveDistance,
				// Add GPU acceleration if enabled
				...(this.responsiveConfig.enableGPUAcceleration && {
					force3D: true,
					backfaceVisibility: "hidden",
				}),
			});
		}

		// Adjust animation based on touch scrolling
		const adjustedDuration = this.touchManager.isFastScroll()
			? responsiveDuration * 0.5
			: responsiveDuration;

		tl.to(elements, {
			opacity: 1,
			x: 0,
			duration: adjustedDuration,
			ease,
			delay: responsiveDelay,
			stagger: responsiveStagger,
			onComplete: () => {
				this.performanceMonitor.decrementAnimationCount();
			},
		});

		return tl;
	}

	/**
	 * Create a scale animation timeline
	 */
	public createScaleTimeline(
		elements: string | HTMLElement | HTMLElement[],
		options?: {
			duration?: number;
			delay?: number;
			stagger?: number;
			fromScale?: number;
			toScale?: number;
			ease?: string;
		}
	): gsap.core.Timeline {
		const {
			duration = this.responsiveConfig.duration.medium,
			delay = 0,
			stagger = this.responsiveConfig.stagger.medium,
			fromScale = 0.8,
			toScale = 1,
			ease = this.easing.bounce,
		} = options || {};

		const tl = gsap.timeline();
		const responsiveDuration = getResponsiveAnimationDuration(duration);
		const responsiveDelay = getResponsiveAnimationDuration(delay);
		const responsiveStagger = prefersReducedMotion() ? 0 : stagger;

		// Performance monitoring
		this.performanceMonitor.incrementAnimationCount();

		// Set initial state
		if (!prefersReducedMotion()) {
			gsap.set(elements, {
				opacity: 0,
				scale: fromScale,
				// Add GPU acceleration if enabled
				...(this.responsiveConfig.enableGPUAcceleration && {
					force3D: true,
					backfaceVisibility: "hidden",
				}),
			});
		}

		// Adjust animation based on touch scrolling and performance
		const adjustedDuration = this.touchManager.isFastScroll()
			? responsiveDuration * 0.5
			: responsiveDuration;

		// Use simpler easing on low-end devices
		const adjustedEase =
			this.responsiveConfig.quality === "low" ? this.easing.default : ease;

		tl.to(elements, {
			opacity: 1,
			scale: toScale,
			duration: adjustedDuration,
			ease: adjustedEase,
			delay: responsiveDelay,
			stagger: responsiveStagger,
			onComplete: () => {
				this.performanceMonitor.decrementAnimationCount();
			},
		});

		return tl;
	}

	/**
	 * Create a stagger animation timeline for multiple elements
	 */
	public createStaggerTimeline(
		elements: string | HTMLElement[],
		animationType:
			| "fadeIn"
			| "slideUp"
			| "slideLeft"
			| "slideRight"
			| "scale" = "slideUp",
		options?: {
			duration?: number;
			delay?: number;
			stagger?: number;
			distance?: number;
			ease?: string;
		}
	): gsap.core.Timeline {
		const {
			duration = this.timing.medium,
			delay = 0,
			stagger = 0.1,
			distance = 50,
			ease = this.easing.default,
		} = options || {};

		switch (animationType) {
			case "fadeIn":
				return this.createFadeInTimeline(elements, {
					duration,
					delay,
					stagger,
					ease,
				});
			case "slideUp":
				return this.createSlideUpTimeline(elements, {
					duration,
					delay,
					stagger,
					distance,
					ease,
				});
			case "slideLeft":
				return this.createSlideLeftTimeline(elements, {
					duration,
					delay,
					stagger,
					distance,
					ease,
				});
			case "slideRight":
				return this.createSlideRightTimeline(elements, {
					duration,
					delay,
					stagger,
					distance,
					ease,
				});
			case "scale":
				return this.createScaleTimeline(elements, {
					duration,
					delay,
					stagger,
					ease,
				});
			default:
				return this.createSlideUpTimeline(elements, {
					duration,
					delay,
					stagger,
					distance,
					ease,
				});
		}
	}
}

/**
 * Performance Monitor for animations
 */
export class AnimationPerformanceMonitor {
	private static instance: AnimationPerformanceMonitor;
	private frameCount = 0;
	private lastTime = 0;
	private fps = 60;
	private isMonitoring = false;
	private performanceCallbacks: Array<(fps: number) => void> = [];

	private constructor() {}

	public static getInstance(): AnimationPerformanceMonitor {
		if (!AnimationPerformanceMonitor.instance) {
			AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
		}
		return AnimationPerformanceMonitor.instance;
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

	public addPerformanceCallback(callback: (fps: number) => void): void {
		this.performanceCallbacks.push(callback);
	}

	public getCurrentFPS(): number {
		return this.fps;
	}

	private monitorFrame = (): void => {
		if (!this.isMonitoring) return;

		this.frameCount++;
		const currentTime = performance.now();

		if (currentTime >= this.lastTime + 1000) {
			this.fps = Math.round(
				(this.frameCount * 1000) / (currentTime - this.lastTime)
			);
			this.frameCount = 0;
			this.lastTime = currentTime;

			// Notify callbacks
			this.performanceCallbacks.forEach((callback) => callback(this.fps));

			// Log performance warnings
			if (this.fps < 30) {
				console.warn(
					`Low FPS detected: ${this.fps}fps - Consider reducing animation complexity`
				);
			}
		}

		requestAnimationFrame(this.monitorFrame);
	};
}

/**
 * Scroll Animation Manager
 * Manages ScrollTrigger instances and provides utility functions
 */
export class ScrollAnimationManager {
	private static instance: ScrollAnimationManager;
	private timelineFactory: AnimationTimelineFactory;
	private activeScrollTriggers: ScrollTrigger[] = [];
	private performanceMonitor: AnimationPerformanceMonitor;
	private responsivePerformanceMonitor: ResponsivePerformanceMonitor;
	private touchManager: TouchInteractionManager;
	private accessibilityManager: AccessibilityManager;
	private responsiveConfig = getResponsiveAnimationConfig();
	private viewportSettings = getViewportAnimationSettings();

	private constructor() {
		this.timelineFactory = new AnimationTimelineFactory();
		this.performanceMonitor = AnimationPerformanceMonitor.getInstance();
		this.responsivePerformanceMonitor =
			ResponsivePerformanceMonitor.getInstance();
		this.touchManager = TouchInteractionManager.getInstance();
		this.accessibilityManager = AccessibilityManager.getInstance();

		// Set up responsive performance monitoring
		this.setupResponsiveMonitoring();

		// Set up accessibility features
		this.setupAccessibilityFeatures();
	}

	public static getInstance(): ScrollAnimationManager {
		if (!ScrollAnimationManager.instance) {
			ScrollAnimationManager.instance = new ScrollAnimationManager();
		}
		return ScrollAnimationManager.instance;
	}

	/**
	 * Set up responsive performance monitoring
	 */
	private setupResponsiveMonitoring(): void {
		// Monitor performance and adjust animations accordingly
		this.responsivePerformanceMonitor.addPerformanceCallback(
			(metrics: PerformanceMetrics) => {
				if (metrics.shouldThrottle) {
					// Reduce animation quality and speed up existing animations
					gsap.globalTimeline.timeScale(1.5);
					console.log(
						"Performance throttling activated - speeding up animations"
					);
				} else if (metrics.fps > 50) {
					// Restore normal animation speed
					gsap.globalTimeline.timeScale(1);
				}
			}
		);

		// Monitor touch scroll velocity and adjust animations
		this.touchManager.addScrollVelocityCallback((velocity: number) => {
			if (velocity > 3) {
				// Very fast scrolling - complete animations immediately
				this.activeScrollTriggers.forEach((trigger) => {
					const animation = (trigger as any).animation;
					if (
						animation &&
						animation.progress() > 0 &&
						animation.progress() < 1
					) {
						animation.progress(1);
					}
				});
			}
		});

		// Handle viewport resize
		window.addEventListener("resize", this.handleViewportResize.bind(this));
	}

	/**
	 * Handle viewport resize and update responsive settings
	 */
	private handleViewportResize(): void {
		// Update responsive configuration
		this.responsiveConfig = getResponsiveAnimationConfig();
		this.viewportSettings = getViewportAnimationSettings();

		// Refresh ScrollTrigger to recalculate positions
		ScrollTrigger.refresh();

		console.log("Viewport resized - updated responsive animation settings");
	}

	/**
	 * Set up accessibility features for animations
	 */
	private setupAccessibilityFeatures(): void {
		// Create skip navigation links
		// this.accessibilityManager.createSkipLinks([
		//   { id: "main-content", label: "main content" },
		//   { id: "hero-section", label: "hero section" },
		//   { id: "projects-section", label: "projects" },
		//   { id: "about-section", label: "about" },
		//   { id: "contact-section", label: "contact" },
		// ]);

		// Handle reduced motion preference changes
		const reducedMotionQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		);
		reducedMotionQuery.addEventListener("change", (e) => {
			if (e.matches) {
				// Disable all active animations
				this.disableAllAnimations();
				console.log("Reduced motion enabled - animations disabled");
			} else {
				// Re-enable animations
				this.enableAllAnimations();
				console.log("Reduced motion disabled - animations enabled");
			}
		});

		// Handle high contrast preference changes
		const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
		highContrastQuery.addEventListener("change", (e) => {
			if (e.matches) {
				document.body.classList.add("high-contrast-mode");
				// Ensure all animated content is immediately visible
				this.makeAllContentVisible();
				console.log("High contrast mode enabled");
			} else {
				document.body.classList.remove("high-contrast-mode");
				console.log("High contrast mode disabled");
			}
		});

		// Set up keyboard navigation support
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				// Pause all animations on Escape key
				this.pauseAllAnimations();
			} else if (e.key === "Enter" || e.key === " ") {
				// Resume animations on Enter or Space
				this.resumeAllAnimations();
			}
		});

		console.log("Accessibility features initialized");
	}

	/**
	 * Disable all active animations
	 */
	private disableAllAnimations(): void {
		// Kill all GSAP animations
		gsap.killTweensOf("*");

		// Kill all ScrollTriggers
		this.activeScrollTriggers.forEach((trigger) => {
			trigger.kill();
		});

		// Make all content immediately visible
		this.makeAllContentVisible();
	}

	/**
	 * Enable all animations (used when reduced motion is turned off)
	 */
	private enableAllAnimations(): void {
		// Refresh ScrollTrigger to recreate animations
		ScrollTrigger.refresh();

		// Reinitialize page animations if needed
		// This would typically be called from the main initialization
		console.log(
			"Animations re-enabled - consider reinitializing page animations"
		);
	}

	/**
	 * Make all animated content immediately visible
	 */
	private makeAllContentVisible(): void {
		const animatedElements = document.querySelectorAll(
			".animate-ready, .animate-fade, .animate-slide-up, .animate-slide-down, " +
				".animate-slide-left, .animate-slide-right, .animate-scale, .animate-rotate"
		);

		animatedElements.forEach((element) => {
			if (element instanceof HTMLElement) {
				element.style.opacity = "1";
				element.style.transform = "none";
				element.style.visibility = "visible";
				element.setAttribute("aria-hidden", "false");
				element.classList.add("animate-in");
			}
		});
	}

	/**
	 * Pause all active animations
	 */
	private pauseAllAnimations(): void {
		gsap.globalTimeline.pause();
		this.accessibilityManager.createAnimationAnnouncement(
			"Animations paused",
			"assertive"
		);
	}

	/**
	 * Resume all active animations
	 */
	private resumeAllAnimations(): void {
		gsap.globalTimeline.resume();
		this.accessibilityManager.createAnimationAnnouncement(
			"Animations resumed",
			"polite"
		);
	}

	/**
	 * Create and register a scroll-triggered animation
	 */
	public createScrollAnimation(config: AnimationConfig): ScrollTrigger {
		// Use responsive trigger offset
		const defaultStart = `top ${
			(1 - this.viewportSettings.triggerOffset) * 100
		}%`;

		const scrollTrigger = ScrollTrigger.create({
			trigger: config.trigger,
			start: config.start || defaultStart,
			end: config.end || "bottom 20%",
			scrub: config.scrub || false,
			markers: config.markers || false,
			toggleActions: config.toggleActions || "play none none reverse",
			animation: config.animation,
			// Add responsive callbacks
			onEnter: () => {
				this.responsivePerformanceMonitor.startMonitoring();
				if (config.animation) {
					config.animation.play();
				}
			},
			onLeave: () => {
				// Handle fast scrolling completion
				if (this.touchManager.isFastScroll() && config.animation) {
					config.animation.progress(1);
				}
			},
			onEnterBack: () => {
				this.responsivePerformanceMonitor.startMonitoring();
				if (config.animation) {
					config.animation.play();
				}
			},
			onLeaveBack: () => {
				if (config.animation) {
					config.animation.reverse();
				}
				this.responsivePerformanceMonitor.stopMonitoring();
			},
		});

		this.activeScrollTriggers.push(scrollTrigger);
		return scrollTrigger;
	}

	/**
	 * Create a scroll animation with custom timeline
	 */
	public createCustomScrollAnimation(
		trigger: string | HTMLElement,
		timelineCreator: () => gsap.core.Timeline,
		options?: {
			start?: string;
			end?: string;
			scrub?: boolean;
			markers?: boolean;
			toggleActions?: string;
		}
	): ScrollTrigger {
		const timeline = timelineCreator();

		return this.createScrollAnimation({
			trigger,
			animation: timeline,
			...options,
		});
	}

	/**
	 * Get the timeline factory instance
	 */
	public getTimelineFactory(): AnimationTimelineFactory {
		return this.timelineFactory;
	}

	/**
	 * Create a hero sequence animation
	 */
	public createHeroSequence(
		selectors: {
			name: string;
			role: string;
			description: string;
			image: string;
			social: string;
		},
		options?: {
			staggerDelay?: number;
		}
	): gsap.core.Timeline {
		const { staggerDelay = 0.2 } = options || {};
		const tl = gsap.timeline();
		const timing = getAnimationTiming();
		const easing = getAnimationEasing();

		// Name fade-in
		tl.add(
			this.timelineFactory.createFadeInTimeline(selectors.name, {
				duration: timing.slow,
				ease: easing.default,
			})
		);

		// Role badges slide from left
		tl.add(
			this.timelineFactory.createSlideLeftTimeline(selectors.role, {
				duration: timing.medium,
				stagger: 0.1,
			}),
			`-=${timing.medium * 0.5}`
		);

		// Description reveal
		tl.add(
			this.timelineFactory.createFadeInTimeline(selectors.description, {
				duration: timing.medium,
			}),
			`-=${timing.fast}`
		);

		// Profile image scale with bounce
		tl.add(
			this.timelineFactory.createScaleTimeline(selectors.image, {
				duration: timing.medium,
				ease: easing.bounce,
			}),
			`-=${timing.medium * 0.7}`
		);

		// Social icons staggered
		tl.add(
			this.timelineFactory.createStaggerTimeline(selectors.social, "scale", {
				stagger: 0.15,
				duration: timing.fast,
			}),
			`-=${timing.fast}`
		);

		return tl;
	}

	/**
	 * Create scroll-triggered hero sequence animation with performance monitoring
	 */
	public createScrollTriggeredHeroSequence(
		trigger: string | HTMLElement,
		selectors: {
			name: string;
			role: string;
			description: string;
			image: string;
			social: string;
		},
		options?: {
			staggerDelay?: number;
			threshold?: number;
			enablePerformanceMonitoring?: boolean;
		}
	): ScrollTrigger {
		const {
			staggerDelay = 0.2,
			threshold = 0.5,
			enablePerformanceMonitoring = true,
		} = options || {};

		// Create the hero timeline
		const heroTimeline = this.createHeroSequence(selectors, { staggerDelay });

		// Set up performance monitoring if enabled
		if (enablePerformanceMonitoring) {
			this.performanceMonitor.addPerformanceCallback((fps) => {
				if (fps < 30) {
					// Reduce animation quality for better performance
					gsap.globalTimeline.timeScale(1.5); // Speed up animations
				} else if (fps > 50) {
					gsap.globalTimeline.timeScale(1); // Normal speed
				}
			});
		}

		// Create ScrollTrigger with smooth completion for fast scrolling
		const scrollTrigger = ScrollTrigger.create({
			trigger,
			start: `top ${(1 - threshold) * 100}%`,
			end: "bottom 20%",
			toggleActions: "play none none reverse",
			onEnter: () => {
				if (enablePerformanceMonitoring) {
					this.performanceMonitor.startMonitoring();
				}
				heroTimeline.play();
			},
			onLeave: () => {
				// Ensure smooth completion even with fast scrolling
				if (heroTimeline.progress() > 0 && heroTimeline.progress() < 1) {
					heroTimeline.progress(1);
				}
			},
			onEnterBack: () => {
				if (enablePerformanceMonitoring) {
					this.performanceMonitor.startMonitoring();
				}
				heroTimeline.play();
			},
			onLeaveBack: () => {
				// Smooth reverse completion
				if (heroTimeline.progress() > 0) {
					heroTimeline.reverse();
				}
				if (enablePerformanceMonitoring) {
					this.performanceMonitor.stopMonitoring();
				}
			},
			onUpdate: (self) => {
				// Handle fast scrolling by ensuring animation completion
				if (self.direction === 1 && self.progress > 0.8) {
					if (heroTimeline.progress() < 1) {
						heroTimeline.progress(1);
					}
				} else if (self.direction === -1 && self.progress < 0.2) {
					if (heroTimeline.progress() > 0) {
						heroTimeline.progress(0);
					}
				}
			},
		});

		this.activeScrollTriggers.push(scrollTrigger);
		return scrollTrigger;
	}

	/**
	 * Create project cards animation with slide-up and fade-in effects
	 */
	public createProjectCardsAnimation(
		selector: string,
		options?: {
			stagger?: number;
			threshold?: number;
			enablePerformanceMonitoring?: boolean;
		}
	): ScrollTrigger {
		const {
			stagger = 0.2,
			threshold = 0.3,
			enablePerformanceMonitoring = true,
		} = options || {};

		// Create the slide-up timeline with fade-in effects
		const timeline = this.timelineFactory.createSlideUpTimeline(selector, {
			stagger,
			duration: this.timelineFactory["timing"].medium,
			distance: 50,
			ease: this.timelineFactory["easing"].default,
		});

		// Set up performance monitoring if enabled
		if (enablePerformanceMonitoring) {
			this.performanceMonitor.addPerformanceCallback((fps) => {
				if (fps < 30) {
					// Reduce animation quality for better performance
					timeline.timeScale(1.5); // Speed up animations
				} else if (fps > 50) {
					timeline.timeScale(1); // Normal speed
				}
			});
		}

		// Create ScrollTrigger with 30% visibility threshold
		const scrollTrigger = ScrollTrigger.create({
			trigger: selector,
			start: `top ${(1 - threshold) * 100}%`,
			end: "bottom 20%",
			toggleActions: "play none none reverse",
			onEnter: () => {
				if (enablePerformanceMonitoring) {
					this.performanceMonitor.startMonitoring();
				}
				timeline.play();
			},
			onLeave: () => {
				// Ensure smooth completion even with fast scrolling
				if (timeline.progress() > 0 && timeline.progress() < 1) {
					timeline.progress(1);
				}
			},
			onEnterBack: () => {
				if (enablePerformanceMonitoring) {
					this.performanceMonitor.startMonitoring();
				}
				timeline.play();
			},
			onLeaveBack: () => {
				// Smooth reverse completion
				if (timeline.progress() > 0) {
					timeline.reverse();
				}
				if (enablePerformanceMonitoring) {
					this.performanceMonitor.stopMonitoring();
				}
			},
			onUpdate: (self) => {
				// Handle fast scrolling by ensuring animation completion
				if (self.direction === 1 && self.progress > 0.8) {
					if (timeline.progress() < 1) {
						timeline.progress(1);
					}
				} else if (self.direction === -1 && self.progress < 0.2) {
					if (timeline.progress() > 0) {
						timeline.progress(0);
					}
				}
			},
		});

		this.activeScrollTriggers.push(scrollTrigger);
		return scrollTrigger;
	}

	/**
	 * Create timeline items animation for about page
	 */
	public createTimelineAnimation(
		selectors: {
			dots: string;
			cards: string;
		},
		options?: {
			threshold?: number;
		}
	): ScrollTrigger[] {
		const { threshold = 0.4 } = options || {};
		const scrollTriggers: ScrollTrigger[] = [];

		// Timeline dots sequential reveal with 0.1s stagger
		const dotsTimeline = this.timelineFactory.createStaggerTimeline(
			selectors.dots,
			"scale",
			{
				stagger: 0.1,
				duration: this.timelineFactory["timing"].fast,
			}
		);

		scrollTriggers.push(
			this.createScrollAnimation({
				trigger: selectors.dots,
				start: `top ${(1 - threshold) * 100}%`,
				animation: dotsTimeline,
				toggleActions: "play none none reverse",
			})
		);

		// Timeline cards slide from right with fade effects
		const cardsTimeline = this.timelineFactory.createStaggerTimeline(
			selectors.cards,
			"slideRight",
			{
				stagger: 0.15,
				duration: this.timelineFactory["timing"].medium,
				distance: 100,
			}
		);

		scrollTriggers.push(
			this.createScrollAnimation({
				trigger: selectors.cards,
				start: `top ${(1 - threshold) * 100}%`,
				animation: cardsTimeline,
				toggleActions: "play none none reverse",
			})
		);

		return scrollTriggers;
	}

	/**
	 * Create section header reveal animations
	 */
	public createSectionHeaderAnimation(
		selector: string,
		options?: {
			threshold?: number;
			animationType?: "fadeIn" | "slideUp" | "slideLeft";
		}
	): ScrollTrigger {
		const { threshold = 0.4, animationType = "fadeIn" } = options || {};

		let timeline: gsap.core.Timeline;

		switch (animationType) {
			case "slideUp":
				timeline = this.timelineFactory.createSlideUpTimeline(selector, {
					duration: this.timelineFactory["timing"].medium,
					distance: 30,
				});
				break;
			case "slideLeft":
				timeline = this.timelineFactory.createSlideLeftTimeline(selector, {
					duration: this.timelineFactory["timing"].medium,
					distance: 50,
				});
				break;
			default:
				timeline = this.timelineFactory.createFadeInTimeline(selector, {
					duration: this.timelineFactory["timing"].medium,
				});
		}

		const scrollTrigger = this.createScrollAnimation({
			trigger: selector,
			start: `top ${(1 - threshold) * 100}%`,
			animation: timeline,
			toggleActions: "play none none reverse",
		});

		return scrollTrigger;
	}

	/**
	 * Create complete about page timeline animations
	 */
	public createAboutPageTimelineAnimations(): ScrollTrigger[] {
		const scrollTriggers: ScrollTrigger[] = [];

		// Education section header
		const educationHeader = this.createSectionHeaderAnimation(
			'[data-animation="education-header"]',
			{
				threshold: 0.4,
				animationType: "fadeIn",
			}
		);
		scrollTriggers.push(educationHeader);

		// Education timeline elements
		const educationTimeline = this.createTimelineAnimation(
			{
				dots: '[data-animation="education-timeline"] .timeline-dot',
				cards: '[data-animation="education-timeline"] .timeline-card',
			},
			{ threshold: 0.4 }
		);
		scrollTriggers.push(...educationTimeline);

		// Experience section header
		const experienceHeader = this.createSectionHeaderAnimation(
			'[data-animation="experience-header"]',
			{
				threshold: 0.4,
				animationType: "fadeIn",
			}
		);
		scrollTriggers.push(experienceHeader);

		// CV button animation
		const cvButton = this.createSectionHeaderAnimation(
			'[data-animation="cv-button"]',
			{
				threshold: 0.4,
				animationType: "slideUp",
			}
		);
		scrollTriggers.push(cvButton);

		// Experience timeline elements
		const experienceTimeline = this.createTimelineAnimation(
			{
				dots: '[data-animation="experience-timeline"] .timeline-dot',
				cards: '[data-animation="experience-timeline"] .timeline-card',
			},
			{ threshold: 0.4 }
		);
		scrollTriggers.push(...experienceTimeline);

		// Tech Stack section header
		const techStackHeader = this.createSectionHeaderAnimation(
			'[data-animation="techstack-header"]',
			{
				threshold: 0.4,
				animationType: "fadeIn",
			}
		);
		scrollTriggers.push(techStackHeader);

		// Tech Stack marquee animation
		const techStackMarquee = this.createSectionHeaderAnimation(
			'[data-animation="techstack-marquee"]',
			{
				threshold: 0.3,
				animationType: "fadeIn",
			}
		);
		scrollTriggers.push(techStackMarquee);

		// Achievements section header
		const achievementsHeader = this.createSectionHeaderAnimation(
			'[data-animation="achievements-header"]',
			{
				threshold: 0.4,
				animationType: "fadeIn",
			}
		);
		scrollTriggers.push(achievementsHeader);

		// Achievements card
		const achievementsTimeline = this.timelineFactory.createSlideUpTimeline(
			'[data-animation="achievements-card"]',
			{
				duration: this.timelineFactory["timing"].medium,
			}
		);
		const achievementsCard = this.createScrollAnimation({
			trigger: '[data-animation="achievements-card"]',
			start: "top 70%",
			animation: achievementsTimeline,
		});
		scrollTriggers.push(achievementsCard);

		return scrollTriggers;
	}

	/**
	 * Create certificate grid animation
	 */
	public createCertificateGridAnimation(
		selector: string,
		options?: {
			stagger?: number;
			threshold?: number;
		}
	): ScrollTrigger {
		const { stagger = 0.15, threshold = 0.3 } = options || {};

		const timeline = this.timelineFactory.createStaggerTimeline(
			selector,
			"slideUp",
			{
				stagger,
				duration: this.timelineFactory["timing"].medium,
			}
		);

		return this.createScrollAnimation({
			trigger: selector,
			start: `top ${(1 - threshold) * 100}%`,
			animation: timeline,
		});
	}

	/**
	 * Cleanup all active ScrollTriggers
	 */
	public cleanup(): void {
		this.activeScrollTriggers.forEach((trigger) => trigger.kill());
		this.activeScrollTriggers = [];
		ScrollTrigger.killAll();
	}

	/**
	 * Refresh all ScrollTriggers (useful after layout changes)
	 */
	public refresh(): void {
		ScrollTrigger.refresh();
	}

	/**
	 * Get performance monitor instance
	 */
	public getPerformanceMonitor(): AnimationPerformanceMonitor {
		return this.performanceMonitor;
	}

	/**
	 * Enable debug mode for ScrollTrigger
	 */
	public enableDebugMode(): void {
		ScrollTrigger.defaults({
			markers: true,
		});
	}

	/**
	 * Disable debug mode for ScrollTrigger
	 */
	public disableDebugMode(): void {
		ScrollTrigger.defaults({
			markers: false,
		});
	}

	/**
	 * Batch create multiple scroll animations
	 */
	public batchCreate(configs: AnimationConfig[]): ScrollTrigger[] {
		return ScrollTrigger.batch(
			configs.map((config) => config.trigger),
			{
				onEnter: (elements) => {
					configs.forEach((config, index) => {
						if (elements[index]) {
							config.animation.play();
						}
					});
				},
				onLeave: (elements) => {
					configs.forEach((config, index) => {
						if (elements[index]) {
							config.animation.reverse();
						}
					});
				},
				onEnterBack: (elements) => {
					configs.forEach((config, index) => {
						if (elements[index]) {
							config.animation.play();
						}
					});
				},
				onLeaveBack: (elements) => {
					configs.forEach((config, index) => {
						if (elements[index]) {
							config.animation.reverse();
						}
					});
				},
			}
		);
	}
}

// Export factory and manager instances
export const animationFactory = new AnimationTimelineFactory();
export const scrollAnimationManager = ScrollAnimationManager.getInstance();

// Utility functions for common animation patterns
export function createFadeIn(
	elements: string | HTMLElement | HTMLElement[],
	options?: any
) {
	return animationFactory.createFadeInTimeline(elements, options);
}

export function createSlideUp(
	elements: string | HTMLElement | HTMLElement[],
	options?: any
) {
	return animationFactory.createSlideUpTimeline(elements, options);
}

export function createStagger(
	elements: string | HTMLElement[],
	type?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale",
	options?: any
) {
	return animationFactory.createStaggerTimeline(elements, type, options);
}

export function createScrollTrigger(
	trigger: string | HTMLElement,
	timeline: gsap.core.Timeline,
	options?: any
) {
	return scrollAnimationManager.createScrollAnimation({
		trigger,
		animation: timeline,
		...options,
	});
}
