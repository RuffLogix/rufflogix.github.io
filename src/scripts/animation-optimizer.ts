// Performance-optimized animation utilities
import { gsap } from "gsap";

export class AnimationOptimizer {
	private static instance: AnimationOptimizer;
	private observers: Map<string, IntersectionObserver> = new Map();
	private animatedElements: WeakSet<Element> = new WeakSet();
	private rafId: number | null = null;
	private pendingAnimations: Array<() => void> = [];

	public static getInstance(): AnimationOptimizer {
		if (!AnimationOptimizer.instance) {
			AnimationOptimizer.instance = new AnimationOptimizer();
		}
		return AnimationOptimizer.instance;
	}

	/**
	 * Create optimized scroll-triggered animations with Intersection Observer
	 */
	public createScrollAnimation(
		selector: string,
		animation: gsap.TweenVars,
		options?: {
			threshold?: number;
			rootMargin?: string;
			once?: boolean;
			stagger?: number;
		}
	): void {
		const {
			threshold = 0.1,
			rootMargin = "0px 0px -10% 0px",
			once = true,
			stagger = 0.1,
		} = options || {};

		const elements = document.querySelectorAll(selector);
		if (!elements.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visibleEntries = entries.filter((entry) => entry.isIntersecting);

				if (visibleEntries.length > 0) {
					this.batchAnimations(() => {
						if (stagger > 0) {
							gsap.fromTo(
								visibleEntries.map((entry) => entry.target),
								{ opacity: 0, y: 30 },
								{
									...animation,
									opacity: 1,
									y: 0,
									stagger: stagger,
									ease: "power2.out",
								}
							);
						} else {
							visibleEntries.forEach((entry) => {
								if (!this.animatedElements.has(entry.target)) {
									gsap.fromTo(
										entry.target,
										{ opacity: 0, y: 30 },
										{
											...animation,
											opacity: 1,
											y: 0,
										}
									);
									this.animatedElements.add(entry.target);
								}
							});
						}

						if (once) {
							visibleEntries.forEach((entry) =>
								observer.unobserve(entry.target)
							);
						}
					});
				}
			},
			{ threshold, rootMargin }
		);

		elements.forEach((element) => observer.observe(element));
		this.observers.set(selector, observer);
	}

	/**
	 * Batch multiple animations together for better performance
	 */
	private batchAnimations(callback: () => void): void {
		this.pendingAnimations.push(callback);

		if (this.rafId === null) {
			this.rafId = requestAnimationFrame(() => {
				this.pendingAnimations.forEach((animation) => animation());
				this.pendingAnimations = [];
				this.rafId = null;
			});
		}
	}

	/**
	 * Create optimized hover animations
	 */
	public createHoverAnimation(
		selector: string,
		hoverIn: gsap.TweenVars,
		hoverOut: gsap.TweenVars
	): void {
		const elements = document.querySelectorAll(selector);

		elements.forEach((element) => {
			const hoverInTween = gsap.to(element, { ...hoverIn, paused: true });
			const hoverOutTween = gsap.to(element, { ...hoverOut, paused: true });

			element.addEventListener("mouseenter", () => {
				hoverOutTween.pause();
				hoverInTween.restart();
			});

			element.addEventListener("mouseleave", () => {
				hoverInTween.pause();
				hoverOutTween.restart();
			});
		});
	}

	/**
	 * Optimize animations for low-end devices
	 */
	public optimizeForDevice(): void {
		const isLowEndDevice = this.detectLowEndDevice();

		if (isLowEndDevice) {
			// Reduce animation complexity
			gsap.globalTimeline.timeScale(1.5); // Speed up animations
			gsap.defaults({ duration: 0.3, ease: "none" }); // Simplify easing

			// Disable expensive effects
			document.documentElement.style.setProperty(
				"--disable-complex-animations",
				"1"
			);
		}
	}

	/**
	 * Detect low-end devices based on hardware capabilities
	 */
	private detectLowEndDevice(): boolean {
		// Check for hardware concurrency
		if (
			"hardwareConcurrency" in navigator &&
			navigator.hardwareConcurrency <= 2
		) {
			return true;
		}

		// Check for memory (if available)
		if ("memory" in performance && (performance as any).memory) {
			const memory = (performance as any).memory;
			if (memory.totalJSHeapSize && memory.totalJSHeapSize < 50 * 1024 * 1024) {
				// Less than 50MB
				return true;
			}
		}

		// Check connection speed
		if ("connection" in navigator) {
			const connection = (navigator as any).connection;
			if (
				connection &&
				(connection.effectiveType === "slow-2g" ||
					connection.effectiveType === "2g")
			) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Cleanup observers when component unmounts
	 */
	public cleanup(): void {
		this.observers.forEach((observer) => observer.disconnect());
		this.observers.clear();

		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
	}

	/**
	 * Preload animations for better perceived performance
	 */
	public preloadAnimations(selectors: string[]): void {
		selectors.forEach((selector) => {
			const elements = document.querySelectorAll(selector);
			elements.forEach((element) => {
				// Create invisible timeline to preload
				const tl = gsap.timeline({ paused: true });
				tl.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.01 });
				tl.kill(); // Immediately kill to free memory
			});
		});
	}
}

// Utility functions for animation optimization
export const createOptimizedTimeline = (
	options?: gsap.TimelineVars
): gsap.core.Timeline => {
	return gsap.timeline({
		...options,
		onComplete: () => {
			// Auto-cleanup completed timelines
			if (options?.onComplete) options.onComplete();
		},
	});
};

export const createOptimizedTween = (
	targets: gsap.TweenTarget,
	vars: gsap.TweenVars
): gsap.core.Tween => {
	return gsap.to(targets, {
		...vars,
		// Enable GPU acceleration by default
		force3D: true,
		// Optimize for performance
		lazy: false,
	});
};
