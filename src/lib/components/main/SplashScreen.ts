import { writable } from 'svelte/store';

interface SplashScreenState {
	isLoading: boolean;
	progress: number;
}

const initialState: SplashScreenState = {
	isLoading: true,
	progress: 0
};

// Helper function to validate progress values
function validateProgress(progress: number): number {
	if (isNaN(progress) || !isFinite(progress) || progress < 0) {
		return 0;
	}
	if (progress > 100) {
		return 100;
	}
	return progress;
}

export const splashScreenState = writable<SplashScreenState>(initialState);

// Override the update function to always validate progress
const originalUpdate = splashScreenState.update;
splashScreenState.update = (updater) => {
	return originalUpdate((state) => {
		const newState = updater(state);
		return {
			...newState,
			progress: validateProgress(newState.progress)
		};
	});
};

export class SplashScreenManager {
	private static instance: SplashScreenManager;
	private animationFrame: number | null = null;
	private startTime = 0;
	private readonly minDuration = 900; // Minimum 0.9 second
	private readonly maxDuration = 1800; // Maximum 1.8 seconds
	private isComplete = false;
	private authComplete = false;

	static getInstance(): SplashScreenManager {
		if (!SplashScreenManager.instance) {
			SplashScreenManager.instance = new SplashScreenManager();
		}
		return SplashScreenManager.instance;
	}

	/**
	 * Start the loading animation
	 */
	startLoading(): void {
		this.stop();
		this.isComplete = false;
		this.authComplete = false;
		this.startTime = Date.now();

		// Validate start time
		if (!this.startTime || this.startTime <= 0) {
			this.startTime = Date.now();
		}

		splashScreenState.set({
			isLoading: true,
			progress: 0
		});

		// Small delay to ensure everything is initialized
		setTimeout(() => {
			this.animate();
		}, 10);
	}

	/**
	 * Mark authentication as complete
	 */
	setAuthComplete(): void {
		this.authComplete = true;
		this.checkForCompletion();
	}

	/**
	 * Force completion (for timeout or manual override)
	 */
	complete(): void {
		this.isComplete = true;
		this.finishAnimation();
	}

	/**
	 * Stop all animations and timers
	 */
	stop(): void {
		if (this.animationFrame !== null) {
			cancelAnimationFrame(this.animationFrame);
			this.animationFrame = null;
		}
	}

	/**
	 * Reset to initial state
	 */
	reset(): void {
		this.stop();
		this.isComplete = false;
		this.authComplete = false;
		this.startTime = 0;
		splashScreenState.set({
			...initialState,
			progress: validateProgress(initialState.progress)
		});
	}

	/**
	 * Main animation loop
	 */
	private animate(): void {
		const elapsed = Date.now() - this.startTime;

		// Validate elapsed time to prevent NaN values
		if (!elapsed || elapsed < 0 || !this.minDuration || this.minDuration <= 0) {
			// Fallback to safe values
			splashScreenState.update((state) => ({
				...state,
				progress: 0
			}));
			this.animationFrame = requestAnimationFrame(() => this.animate());
			return;
		}

		// Calculate base progress (0-90% based on time)
		let progress = Math.min((elapsed / this.minDuration) * 90, 90);

		// If auth is complete, allow progress to reach 95%
		if (this.authComplete) {
			progress = Math.min((elapsed / this.minDuration) * 95, 95);
		}

		// Validate progress value before updating
		if (isNaN(progress) || !isFinite(progress)) {
			progress = 0;
		}

		// Ensure progress is within valid range
		progress = Math.max(0, Math.min(100, progress));

		// Update progress
		splashScreenState.update((state) => ({
			...state,
			progress
		}));

		// Check if we can complete
		if (elapsed >= this.minDuration && this.authComplete && !this.isComplete) {
			this.isComplete = true;
			this.finishAnimation();
			return;
		}

		// Force complete if taking too long
		if (elapsed >= this.maxDuration && !this.isComplete) {
			this.authComplete = true; // Force auth complete
			this.isComplete = true;
			this.finishAnimation();
			return;
		}

		// Continue animation
		this.animationFrame = requestAnimationFrame(() => this.animate());
	}

	/**
	 * Check if conditions are met for completion
	 */
	private checkForCompletion(): void {
		const elapsed = this.startTime ? Date.now() - this.startTime : 0;
		const minTimeReached = elapsed >= this.minDuration;

		if (minTimeReached && this.authComplete && !this.isComplete) {
			this.isComplete = true;
			// Small delay to show 95% briefly before completion
			setTimeout(() => {
				this.finishAnimation();
			}, 200);
		}
	}

	/**
	 * Animate to 100% and hide splash screen
	 */
	private finishAnimation(): void {
		this.stop();

		// Quick animation to 100%
		let currentProgress = 95;
		const finishStep = () => {
			currentProgress += 2;

			// Validate currentProgress to prevent NaN
			if (isNaN(currentProgress) || !isFinite(currentProgress)) {
				currentProgress = 100;
			}

			if (currentProgress >= 100) {
				// Complete the loading
				splashScreenState.set({
					isLoading: false,
					progress: validateProgress(100)
				});
				return;
			}

			// Ensure progress is within valid range
			const safeProgress = Math.max(0, Math.min(100, currentProgress));

			splashScreenState.update((state) => ({
				...state,
				progress: safeProgress
			}));

			this.animationFrame = requestAnimationFrame(finishStep);
		};

		this.animationFrame = requestAnimationFrame(finishStep);
	}
}

export const splashScreen = SplashScreenManager.getInstance();
