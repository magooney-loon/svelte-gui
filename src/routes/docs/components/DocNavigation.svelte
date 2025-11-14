<script lang="ts">
	import { NavigationIcons } from '$lib/components/icons';
	import { disableUserScroll } from '$lib/utils';
	import type { LoadedDocSection } from '../types';

	interface Props {
		sections: LoadedDocSection[];
		currentSectionId: string;
		onSectionSelect: (section: LoadedDocSection) => void;
		class?: string;
	}

	let { sections, currentSectionId, onSectionSelect, class: className = '' }: Props = $props();

	// Find current section index
	let currentIndex = $derived(() => {
		return sections.findIndex((section) => section.id === currentSectionId);
	});

	// Get previous section
	let previousSection = $derived(() => {
		const prevIndex = currentIndex() - 1;
		return prevIndex >= 0 ? sections[prevIndex] : null;
	});

	// Get next section
	let nextSection = $derived(() => {
		const nextIndex = currentIndex() + 1;
		return nextIndex < sections.length ? sections[nextIndex] : null;
	});

	// Handle navigation
	function navigateTo(section: LoadedDocSection | null) {
		if (section) {
			onSectionSelect(section);
			// Disable user scrolling during smooth scroll animation
			disableUserScroll(650);
			// Add slight delay before scrolling to top for smoother transition
			setTimeout(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}, 150);
		}
	}

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (event.target !== document.body) return; // Only handle if no input is focused

		switch (event.key) {
			case 'ArrowLeft':
				if (previousSection()) {
					event.preventDefault();
					navigateTo(previousSection());
				}
				break;
			case 'ArrowRight':
				if (nextSection()) {
					event.preventDefault();
					navigateTo(nextSection());
				}
				break;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if previousSection() || nextSection()}
	<div class="border-t border-gray-200 dark:border-gray-700 {className}">
		<div class="mx-auto max-w-4xl px-6 py-8 lg:px-8">
			<!-- Desktop Layout (hidden on mobile) -->
			<div class="hidden sm:flex sm:items-center sm:justify-between">
				<!-- Previous Section -->
				{#if previousSection()}
					<button
						onclick={() => navigateTo(previousSection())}
						class="group flex flex-1 cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 bg-white/50 p-4 text-left transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600"
					>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/50 transition-colors group-hover:bg-gray-200 dark:bg-gray-700/50 dark:group-hover:bg-gray-600"
						>
							<NavigationIcons
								name="chevron-left"
								class="h-5 w-5 text-gray-600 dark:text-gray-300"
							/>
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Previous</p>
							<p
								class="flex items-center space-x-2 text-base font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
							>
								<span>{previousSection()?.icon}</span>
								<span class="truncate">{previousSection()?.title}</span>
							</p>
						</div>
					</button>
				{:else}
					<div class="flex-1"></div>
				{/if}

				<!-- Spacer -->
				<div class="mx-4">
					<div class="h-px w-12 bg-gray-200 dark:bg-gray-700"></div>
				</div>

				<!-- Next Section -->
				{#if nextSection()}
					<button
						onclick={() => navigateTo(nextSection())}
						class="group flex flex-1 cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 bg-white/50 p-4 text-right transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600"
					>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Next</p>
							<p
								class="flex items-center justify-end space-x-2 text-base font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
							>
								<span class="truncate">{nextSection()?.title}</span>
								<span>{nextSection()?.icon}</span>
							</p>
						</div>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/50 transition-colors group-hover:bg-gray-200 dark:bg-gray-700/50 dark:group-hover:bg-gray-600"
						>
							<NavigationIcons
								name="chevron-right"
								class="h-5 w-5 text-gray-600 dark:text-gray-300"
							/>
						</div>
					</button>
				{:else}
					<div class="flex-1"></div>
				{/if}
			</div>

			<!-- Mobile Layout (only on small screens) -->
			<div class="space-y-3 sm:hidden">
				{#if previousSection()}
					<button
						onclick={() => navigateTo(previousSection())}
						class="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
					>
						<div class="flex items-center space-x-3">
							<NavigationIcons
								name="chevron-left"
								class="h-5 w-5 text-gray-500 dark:text-gray-400"
							/>
							<div class="text-left">
								<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Previous</p>
								<p
									class="flex items-center space-x-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
								>
									<span>{previousSection()?.icon}</span>
									<span class="truncate">{previousSection()?.title}</span>
								</p>
							</div>
						</div>
					</button>
				{/if}

				{#if nextSection()}
					<button
						onclick={() => navigateTo(nextSection())}
						class="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
					>
						<div class="flex items-center space-x-3">
							<NavigationIcons
								name="chevron-right"
								class="h-5 w-5 text-gray-500 dark:text-gray-400"
							/>
							<div class="text-left">
								<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Next</p>
								<p
									class="flex items-center space-x-2 text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
								>
									<span>{nextSection()?.icon}</span>
									<span class="truncate">{nextSection()?.title}</span>
								</p>
							</div>
						</div>
					</button>
				{/if}
			</div>

			<!-- Progress indicator -->
			{#if sections.length > 1}
				<div class="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
					<div class="mb-2 flex items-center justify-center space-x-2">
						<div class="max-w-xs flex-1 text-center">
							<span class="text-xs font-medium text-gray-500 dark:text-gray-400">
								{currentIndex() + 1} of {sections.length}
							</span>
							<div class="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
								<div
									class="h-full rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-500"
									style="width: {((currentIndex() + 1) / sections.length) * 100}%"
								></div>
							</div>
						</div>
					</div>
					<p class="text-center text-xs text-gray-500 dark:text-gray-400">
						Use ← → arrow keys to navigate
					</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
