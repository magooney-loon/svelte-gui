<script lang="ts">
	import { browser } from '$app/environment';
	import { slide } from 'svelte/transition';
	import { quintOut, backOut } from 'svelte/easing';
	import { StatusIcons, NavigationIcons } from '$lib/components/icons';
	import { toastState, dismiss } from '$lib/utils';

	const toasts = $derived(toastState.toasts);

	const typeStyles = {
		error: {
			container:
				'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 shadow-md border border-red-200 dark:border-red-800/50',
			icon: 'text-red-500 dark:text-red-400',
			message: 'text-gray-700 dark:text-gray-200',
			button:
				'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md',
			actionButton:
				'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
		},
		warning: {
			container:
				'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 shadow-md border border-amber-200 dark:border-amber-800/50',
			icon: 'text-amber-500 dark:text-amber-400',
			message: 'text-gray-700 dark:text-gray-200',
			button:
				'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md',
			actionButton:
				'bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
		},
		info: {
			container:
				'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 shadow-md border border-blue-200 dark:border-blue-800/50',
			icon: 'text-blue-500 dark:text-blue-400',
			message: 'text-gray-700 dark:text-gray-200',
			button:
				'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md',
			actionButton:
				'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
		},
		success: {
			container:
				'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 shadow-md border border-green-200 dark:border-green-800/50',
			icon: 'text-green-500 dark:text-green-400',
			message: 'text-gray-700 dark:text-gray-200',
			button:
				'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md',
			actionButton:
				'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
		}
	};

	// Icon mapping for different toast types
	const iconMap = {
		error: 'error',
		warning: 'warning',
		info: 'info',
		success: 'success'
	} as const;

	function handleDismiss(toastId: string) {
		dismiss(toastId);
	}

	function handleActionClick(toastId: string, action: () => void) {
		action();
		dismiss(toastId);
	}
</script>

<!-- Toast Container -->
{#if browser && toasts.length > 0}
	<div
		class="pointer-events-none fixed right-4 bottom-4 left-4 z-900 flex flex-col gap-2 sm:left-auto sm:w-80"
	>
		{#each toasts as toastItem, index (toastItem.id)}
			{@const styles = typeStyles[toastItem.type]}
			{@const iconName = iconMap[toastItem.type]}
			<div
				class="pointer-events-auto"
				in:slide={{ duration: 400, easing: backOut, delay: index * 100 }}
				out:slide={{ duration: 300, easing: quintOut }}
			>
				<div
					class="rounded-md p-3 {styles.container} {toastItem.class || ''}"
					role="alert"
					aria-live="polite"
				>
					<div class="flex items-start gap-2.5">
						<!-- Icon -->
						<div class="mt-0.5 shrink-0">
							<span class="text-sm {styles.icon}">
								<StatusIcons name={iconName} />
							</span>
						</div>

						<!-- Content -->
						<div class="min-w-0 flex-1">
							<p class="text-sm {styles.message} leading-5">
								{toastItem.message}
							</p>

							<!-- Action Button -->
							{#if toastItem.action}
								<div class="mt-2">
									<button
										onclick={() => handleActionClick(toastItem.id, toastItem.action!.onClick)}
										class="inline-flex items-center rounded px-2 py-1 text-xs font-medium transition-colors {styles.actionButton}"
									>
										{toastItem.action.label}
									</button>
								</div>
							{/if}
						</div>

						<!-- Dismiss Button -->
						{#if toastItem.dismissible}
							<button
								onclick={() => handleDismiss(toastItem.id)}
								class="shrink-0 p-1 transition-colors {styles.button} mt-0.5"
								aria-label="Dismiss notification"
							>
								<NavigationIcons name="close" size="h-3.5 w-3.5" />
							</button>
						{/if}
					</div>

					<!-- Progress Bar (shown for all toasts) -->
					<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
						<div
							class="progress-bar h-full origin-left rounded-full"
							class:bg-red-400={toastItem.type === 'error'}
							class:bg-amber-400={toastItem.type === 'warning'}
							class:bg-blue-400={toastItem.type === 'info'}
							class:bg-green-400={toastItem.type === 'success'}
							class:opacity-100={toastItem.duration > 0}
							class:opacity-30={toastItem.duration === 0}
							class:static={toastItem.duration === 0}
							style="--toast-duration: {toastItem.duration}ms"
						></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	@keyframes toast-progress {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}

	.progress-bar {
		animation: toast-progress var(--toast-duration, 5000ms) linear forwards;
		animation-play-state: running;
	}

	.progress-bar.static {
		animation-play-state: paused;
		transform: scaleX(1);
	}

	/* Enhanced hover effects */
	[role='alert'] {
		transform-origin: bottom;
		animation: toast-enter 0.3s ease-out;
	}

	@keyframes toast-enter {
		0% {
			opacity: 0;
			transform: translateY(100%) scale(0.95);
		}
		100% {
			opacity: 1;
			transform: translateY(0%) scale(1);
		}
	}

	/* Focus styles for accessibility */
	button:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.8);
		outline-offset: 2px;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		[role='alert'] {
			margin-left: 0;
			margin-right: 0;
		}
	}

	/* Reduce motion for accessibility */
	@media (prefers-reduced-motion: reduce) {
		[role='alert'] {
			animation: none;
		}

		.toast-progress {
			animation: none !important;
		}
	}
</style>
