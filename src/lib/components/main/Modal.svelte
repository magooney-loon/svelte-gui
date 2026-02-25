<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Snippet } from 'svelte';
	import { ModalLogic, type ModalState } from './Modal.js';

	interface Props {
		open?: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		closeable?: boolean;
		onclose?: () => void;
		children?: Snippet;
		footer?: Snippet;
	}

	let {
		open = false,
		title = '',
		size = 'md',
		closeable = true,
		onclose,
		children,
		footer
	}: Props = $props();

	const logic = untrack(() => new ModalLogic({ open, title, size, closeable, onclose }));
	let state = $state<ModalState>(logic.getState());

	logic.onStateUpdate((newState) => {
		state = newState;
	});

	$effect(() => {
		logic.updateProps({ open, title, size, closeable, onclose });
	});

	onMount(() => {
		return () => {
			logic.cleanup();
		};
	});
</script>

<svelte:window onkeydown={logic.getKeydownHandler()} />

{#if state.open}
	<!-- Pure overlay modal - no body scroll interference -->
	<div
		class="min-h-100dvh fixed inset-0 z-9999 flex items-center justify-center bg-black/80 p-2 sm:p-4"
		in:fade={{ duration: 250, easing: quintOut }}
		out:fade={{ duration: 200 }}
		style="height: 100dvh; overflow-y: auto;"
	>
		<!-- Modal Container -->
		<div
			class="relative w-full {logic.getSizeClass()} my-4 max-h-[calc(100dvh-2rem)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			in:fly={{ y: 32, duration: 300, easing: quintOut }}
			out:fly={{ y: 8, duration: 250, easing: quintOut }}
		>
			<!-- Header -->
			{#if state.title || state.closeable}
				<div
					class="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-800"
				>
					{#if state.title}
						<h2 class="text-base font-semibold text-gray-900 sm:text-lg dark:text-gray-100">
							{state.title}
						</h2>
					{:else}
						<div></div>
					{/if}

					{#if state.closeable}
						<button
							onclick={() => logic.close()}
							class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:p-2 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
							aria-label="Close modal"
						>
							<svg
								class="h-5 w-5 sm:h-4 sm:w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								></path>
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			<!-- Content -->
			<div class="max-h-[calc(100dvh-9rem)] overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
				{@render children?.()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div
					class="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-800 dark:bg-gray-800/50"
				>
					{@render footer?.()}
				</div>
			{/if}
		</div>
	</div>
{/if}
