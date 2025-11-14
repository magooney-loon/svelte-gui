<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { FileIcons, NavigationIcons } from '$lib/components/icons';
	import { disableUserScroll } from '$lib/utils';
	import type { LoadedDocSection, DocHeader } from '../types';

	interface Props {
		sections: LoadedDocSection[];
		groupedSections: Record<string, LoadedDocSection[]>;
		sortedCategories: string[];
		selectedSectionId: string;
		onSectionSelect: (section: LoadedDocSection) => void;
		isOpen?: boolean;
		onToggle?: () => void;
		showFooter?: boolean;
		selectedSection?: LoadedDocSection | null;
		isMobile?: boolean;
	}

	let {
		sections,
		groupedSections,
		sortedCategories,
		selectedSectionId,
		onSectionSelect,
		isOpen = true,
		onToggle,
		showFooter = false,
		selectedSection,
		isMobile = false
	}: Props = $props();

	// State for expandable sections - initialize with smart defaults
	const initExpandedSections = () => {
		const expanded: Record<string, boolean> = {};

		// Always expand first category by default
		if (sortedCategories.length > 0) {
			expanded[sortedCategories[0]] = true;
		}

		// Also expand the category containing the currently selected section
		if (selectedSectionId && sections.length > 0) {
			const currentSection = sections.find((s) => s.id === selectedSectionId);
			if (currentSection) {
				expanded[currentSection.category] = true;
			}
		}

		return expanded;
	};

	let expandedSections = $state<Record<string, boolean>>(initExpandedSections());

	// Update expanded sections when selected section changes (but only once initialized)
	$effect(() => {
		if (selectedSectionId && sections.length > 0) {
			const currentSection = sections.find((s) => s.id === selectedSectionId);
			if (currentSection && !expandedSections[currentSection.category]) {
				expandedSections[currentSection.category] = true;
			}
		}
	});

	function handleSectionClick(section: LoadedDocSection) {
		onSectionSelect(section);
	}

	function handleHeaderClick(header: DocHeader) {
		// Disable user scrolling during smooth scroll animation
		disableUserScroll(650);
		// Scroll to the header element
		const element = document.getElementById(header.anchor);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	function toggleSection(category: string) {
		expandedSections = { ...expandedSections, [category]: !expandedSections[category] };
	}

	function handleCategoryKeydown(event: KeyboardEvent, category: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleSection(category);
		}
	}

	function getCategoryTitle(category: string) {
		return category.charAt(0).toUpperCase() + category.slice(1);
	}

	function getCategoryIcon(category: string) {
		// Get icon from first section in category
		const firstSection = groupedSections[category]?.[0];
		return firstSection?.icon || '📄';
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onToggle?.();
		}
	}

	function handleBackdropKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && e.target === e.currentTarget) {
			onToggle?.();
		}
	}

	function handleEscapeKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onToggle?.();
		}
	}
</script>

<svelte:window onkeydown={handleEscapeKey} />

{#if isMobile}
	<!-- Mobile Overlay -->
	{#if isOpen}
		<div
			class="fixed inset-0 z-50 cursor-pointer bg-black/50"
			onclick={handleBackdropClick}
			onkeydown={handleBackdropKeydown}
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-label="Documentation sidebar"
			transition:slide={{ duration: 250, axis: 'x', easing: quintOut }}
		>
			<!-- Mobile Sidebar Panel -->
			<div
				class="fixed inset-y-0 left-0 flex w-100 max-w-[100vw] flex-col bg-white/80 shadow-xl dark:bg-gray-900/80"
				role="document"
				transition:slide={{ duration: 250, axis: 'x', easing: quintOut }}
			>
				<!-- Mobile Header -->
				<div
					class="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700"
				>
					<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Documentation</h2>
					<button
						onclick={onToggle}
						class="cursor-pointer touch-manipulation rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 active:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-300 dark:active:bg-gray-700"
						aria-label="Close sidebar"
					>
						<NavigationIcons name="close" size="h-6 w-6" />
					</button>
				</div>

				<!-- Mobile Navigation -->
				<nav
					class="flex-1 touch-pan-y overflow-y-auto overscroll-contain px-4 py-4"
					style="height: calc(100dvh - 8rem); -webkit-overflow-scrolling: touch; scroll-behavior: smooth; overscroll-behavior-y: contain;"
				>
					<div class="space-y-4">
						{#each sortedCategories as category (category)}
							{@const categorySections = groupedSections[category] || []}
							{@const isExpanded = expandedSections[category] ?? category === sortedCategories[0]}

							<div>
								<!-- Category Header - Clickable -->
								<button
									onclick={() => toggleSection(category)}
									onkeydown={(e) => handleCategoryKeydown(e, category)}
									class="mb-3 flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none active:bg-gray-100 dark:hover:bg-gray-800 dark:focus:ring-blue-400 dark:active:bg-gray-700"
									aria-expanded={isExpanded}
									aria-controls="category-{category}"
								>
									<div class="flex items-center">
										<span class="mr-2 text-lg">{getCategoryIcon(category)}</span>
										<h3
											class="text-sm font-semibold tracking-wide text-gray-900 uppercase dark:text-gray-100"
										>
											{getCategoryTitle(category)}
										</h3>
									</div>
									<NavigationIcons
										name="chevron-right"
										size="h-4 w-4"
										class="text-gray-500 transition-transform duration-200 {isExpanded
											? 'rotate-90'
											: ''} dark:text-gray-400"
									/>
								</button>

								<!-- Category Items - Expandable -->
								{#if isExpanded}
									<ul class="space-y-1" id="category-{category}" role="group">
										{#each categorySections as section (section.id)}
											<li>
												<!-- Main Section Button -->
												<button
													onclick={() => handleSectionClick(section)}
													class="flex w-full cursor-pointer touch-manipulation items-center rounded-lg px-3 py-3 text-left text-sm transition-colors {selectedSectionId ===
													section.id
														? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
														: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:active:bg-gray-700'}"
												>
													<span class="mr-3 text-base">{section.icon}</span>
													<span class="flex-1 truncate font-medium">{section.title}</span>
													{#if selectedSectionId === section.id}
														<div
															class="ml-2 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"
														></div>
													{/if}
												</button>

												<!-- Headers Sub-navigation -->
												{#if selectedSectionId === section.id && section.headers && section.headers.length > 0}
													<ul
														class="mt-2 ml-6 space-y-1 border-l border-gray-200 pl-4 dark:border-gray-700"
													>
														{#each section.headers.filter((h) => h.level <= 3) as header (header.id)}
															<li>
																<button
																	onclick={() => handleHeaderClick(header)}
																	class="flex w-full cursor-pointer items-center rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white {header.level ===
																	1
																		? 'font-semibold text-gray-800 dark:text-gray-200'
																		: header.level === 2
																			? 'font-medium text-gray-700 dark:text-gray-300'
																			: 'text-gray-600 dark:text-gray-400'}"
																	style="padding-left: {(header.level - 1) * 0.5}rem"
																>
																	<span class="mr-2 text-xs opacity-60">
																		{'#'.repeat(header.level)}
																	</span>
																	<span class="truncate">{header.title}</span>
																</button>
															</li>
														{/each}
													</ul>
												{/if}
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/each}
					</div>
				</nav>

				<!-- Mobile Footer -->
				{#if showFooter}
					<div class="shrink-0 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
						<div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
							<div class="flex items-center">
								<FileIcons name="document" class="mr-1.5 h-3.5 w-3.5" />
								<span>{sections.length} docs</span>
							</div>
							{#if selectedSection}
								<div class="flex items-center">
									<span class="mr-1 text-sm">{selectedSection.icon}</span>
									<span class="max-w-32 truncate font-medium">{selectedSection.title}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{:else}
	<!-- Desktop Sidebar -->
	<div
		class="sticky top-0 flex h-[calc(100dvh)] w-80 flex-col border-r border-gray-200 bg-gray-100/20 dark:border-gray-700 dark:bg-gray-900/20"
	>
		<!-- Desktop Header -->
		<div class="shrink-0 border-b border-gray-200 p-[1.1em] dark:border-gray-700">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Documentation</h2>
		</div>

		<!-- Desktop Navigation -->
		<nav class="flex-1 overflow-y-auto px-4 py-6" style="scroll-behavior: smooth;">
			<div class="space-y-6">
				{#each sortedCategories as category (category)}
					{@const categorySections = groupedSections[category] || []}
					{@const isExpanded = expandedSections[category] ?? category === sortedCategories[0]}

					<div>
						<!-- Category Header - Clickable -->
						<button
							onclick={() => toggleSection(category)}
							onkeydown={(e) => handleCategoryKeydown(e, category)}
							class="mb-3 flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 text-left transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none active:bg-gray-100 dark:hover:bg-gray-800 dark:focus:ring-blue-400 dark:active:bg-gray-700"
							aria-expanded={isExpanded}
							aria-controls="category-{category}-desktop"
						>
							<div class="flex items-center">
								<span class="mr-2 text-lg">{getCategoryIcon(category)}</span>
								<h3
									class="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400"
								>
									{getCategoryTitle(category)}
								</h3>
							</div>
							<NavigationIcons
								name="chevron-right"
								size="h-3.5 w-3.5"
								class="text-gray-400 transition-transform duration-200 {isExpanded
									? 'rotate-90'
									: ''} dark:text-gray-500"
							/>
						</button>

						<!-- Category Items - Expandable -->
						{#if isExpanded}
							<ul class="space-y-1" id="category-{category}-desktop" role="group">
								{#each categorySections as section (section.id)}
									<li>
										<!-- Main Section Button -->
										<button
											onclick={() => handleSectionClick(section)}
											class="group flex w-full cursor-pointer touch-manipulation items-center rounded-md px-3 py-2 text-left text-sm transition-colors {selectedSectionId ===
											section.id
												? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
												: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:active:bg-gray-700'}"
										>
											<span class="mr-3 text-base opacity-75 group-hover:opacity-100"
												>{section.icon}</span
											>
											<span class="flex-1 truncate font-medium">{section.title}</span>
											{#if selectedSectionId === section.id}
												<div
													class="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
												></div>
											{/if}
										</button>

										<!-- Headers Sub-navigation -->
										{#if selectedSectionId === section.id && section.headers && section.headers.length > 0}
											<ul
												class="mt-1 ml-6 space-y-0.5 border-l border-gray-200 pl-3 dark:border-gray-700"
											>
												{#each section.headers.filter((h) => h.level <= 3) as header (header.id)}
													<li>
														<button
															onclick={() => handleHeaderClick(header)}
															class="flex w-full cursor-pointer items-center rounded px-2 py-1 text-left text-xs transition-colors hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white {header.level ===
															1
																? 'font-semibold text-gray-700 dark:text-gray-300'
																: header.level === 2
																	? 'font-medium text-gray-600 dark:text-gray-400'
																	: 'text-gray-500 dark:text-gray-500'}"
															style="padding-left: {(header.level - 1) * 0.375}rem"
														>
															<span class="mr-1.5 text-xs opacity-50">
																{'#'.repeat(header.level)}
															</span>
															<span class="truncate">{header.title}</span>
														</button>
													</li>
												{/each}
											</ul>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</div>
		</nav>

		<!-- Desktop Footer -->
		{#if showFooter}
			<div class="shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
				<div class="space-y-3 text-xs text-gray-500 dark:text-gray-400">
					<!-- Combined Stats and Current Section -->
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<div class="flex items-center">
								<FileIcons name="document" class="mr-2 h-4 w-4" />
								<span>{sections.length} sections</span>
							</div>
							<div class="flex items-center space-x-1.5">
								<span class="text-xs">
									{new Date().toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="flex space-x-4 border-t border-gray-200 pt-3 dark:border-gray-700">
						<button
							class="flex touch-manipulation items-center text-left transition-colors hover:text-gray-700 dark:hover:text-gray-300"
							disabled
							title="Coming soon"
						>
							<span class="mr-2">📝</span>
							<span class="opacity-75">Report an issue</span>
						</button>
						<button
							class="flex touch-manipulation items-center text-left transition-colors hover:text-gray-700 dark:hover:text-gray-300"
							disabled
							title="Coming soon"
						>
							<span class="mr-2">✏️</span>
							<span class="opacity-75">Edit this page</span>
						</button>
					</div>
				</div>
			</div>
		{:else}
			<!-- Minimal Footer -->
			<div class="shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
				<div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
					<FileIcons name="document" class="mr-2 h-4 w-4" />
					<span>{sections.length} sections available</span>
				</div>
			</div>
		{/if}
	</div>
{/if}
