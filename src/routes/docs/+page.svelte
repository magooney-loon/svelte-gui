<script lang="ts">
	import { APP_NAME, startViewTransition, disableUserScroll } from '$lib/utils';
	import { untrack } from 'svelte';
	import { EmptyState } from '$lib/components/partials';
	import { StatusIcons, NavigationIcons } from '$lib/components/icons';
	import DocSidebar from './components/DocSidebar.svelte';
	import DocContent from './components/DocContent.svelte';
	import DocSearchModal from './components/DocSearchModal.svelte';
	import type { LoadedDocSection } from './types';

	interface Props {
		data: {
			sections: LoadedDocSection[];
			groupedSections?: Record<string, LoadedDocSection[]>;
			sortedCategories?: string[];
			selectedSection?: LoadedDocSection;
			error?: string;
		};
	}

	let { data }: Props = $props();

	// UI State using Svelte 5 runes
	let selectedSection = $state<LoadedDocSection | null>(
		untrack(() => data.selectedSection || data.sections?.[0] || null)
	);
	let sidebarOpen = $state(false);
	let searchOpen = $state(false);

	// Derived values
	const currentContent = $derived(selectedSection?.content || '');
	const hasError = $derived(!!data.error);
	const isEmpty = $derived(!data.sections || data.sections.length === 0);

	// Create loadedContent map for search modal
	const loadedContent = $derived(
		data.sections?.reduce(
			(acc, section) => {
				acc[section.id] = section.content;
				return acc;
			},
			{} as Record<string, string>
		) || {}
	);

	// Actions
	async function selectSection(section: LoadedDocSection) {
		if (selectedSection?.id === section.id) return;

		await startViewTransition(async () => {
			selectedSection = section;
			// Close sidebar on mobile
			if (typeof window !== 'undefined' && window.innerWidth < 1024) {
				sidebarOpen = false;
			}
		});

		// Disable user scrolling during smooth scroll animation
		disableUserScroll(800);

		// Scroll to top when section changes - use multiple strategies
		setTimeout(() => {
			// Strategy 1: Try to scroll the window first (most reliable)
			window.scrollTo({ top: 0, behavior: 'smooth' });

			// Strategy 2: Try multiple scroll targets for better compatibility
			const contentArea =
				document.querySelector('main .mx-auto.max-w-4xl') ||
				document.querySelector('main') ||
				document.querySelector('.docs-page');

			if (contentArea) {
				contentArea.scrollTo({ top: 0, behavior: 'smooth' });
			}

			// Strategy 3: Also try scrolling any potentially scrollable containers
			const scrollTargets = [
				document.querySelector('main'),
				document.querySelector('.docs-page'),
				document.querySelector('main .mx-auto.max-w-4xl'),
				document.body,
				document.documentElement
			];

			scrollTargets.forEach((target) => {
				if (target && target.scrollTo) {
					target.scrollTo({ top: 0, behavior: 'smooth' });
				} else if (target) {
					target.scrollTop = 0;
				}
			});
		}, 200);
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function openSidebar() {
		sidebarOpen = true;
	}

	function openSearch() {
		searchOpen = true;
	}

	function closeSearch() {
		searchOpen = false;
	}

	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
			event.preventDefault();
			openSearch();
		}
	}

	// Empty state configurations
	const errorDescription = $derived(data.error || 'Failed to load documentation.');
	const emptyStates = {
		error: {
			title: 'Documentation Error',
			get description() {
				return errorDescription;
			},
			icon: 'error' as const,
			iconBg: 'bg-red-50 dark:bg-red-900/20',
			iconColor: 'text-red-600 dark:text-red-400',
			action: {
				text: 'Refresh Page',
				onclick: () => window.location.reload(),
				variant: 'primary' as const,
				color: 'red' as const
			}
		},
		empty: {
			title: 'No Documentation Available',
			description: 'Documentation sections are not configured yet.',
			icon: 'info' as const,
			iconBg: 'bg-gray-100 dark:bg-gray-800',
			iconColor: 'text-gray-400',
			action: undefined
		}
	};
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>Documentation - {APP_NAME}</title>
	<meta name="description" content="Complete documentation for {APP_NAME}" />
</svelte:head>

<!-- Search Modal -->
{#if data.sections}
	<DocSearchModal
		sections={data.sections}
		open={searchOpen}
		onClose={closeSearch}
		onSectionSelect={(section) => selectSection(section as LoadedDocSection)}
		{loadedContent}
	/>
{/if}

{#if hasError || isEmpty}
	<!-- Error or Empty State -->
	{@const stateConfig = hasError ? emptyStates.error : emptyStates.empty}
	<div class="flex min-h-screen items-center justify-center px-4">
		<EmptyState
			title={stateConfig.title}
			description={stateConfig.description}
			size="lg"
			primaryAction={stateConfig.action || undefined}
		>
			{#snippet iconSnippet()}
				<div class="mx-auto mb-6 h-16 w-16 rounded-full p-4 {stateConfig.iconBg}">
					<StatusIcons name={stateConfig.icon} size="h-8 w-8" class={stateConfig.iconColor} />
				</div>
			{/snippet}
		</EmptyState>
	</div>
{:else}
	<!-- Documentation Interface -->
	<div class="docs-page select-text lg:flex lg:min-h-[calc(100dvh-8rem)]">
		<!-- Desktop Sidebar -->
		<div class="hidden lg:block lg:w-80 lg:shrink-0">
			<DocSidebar
				sections={data.sections}
				groupedSections={data.groupedSections || {}}
				sortedCategories={data.sortedCategories || []}
				selectedSectionId={selectedSection?.id || ''}
				onSectionSelect={(section) => selectSection(section as LoadedDocSection)}
				isOpen={true}
				onToggle={toggleSidebar}
				showFooter={true}
				{selectedSection}
				isMobile={false}
			/>
		</div>

		<!-- Mobile Sidebar -->
		<DocSidebar
			sections={data.sections}
			groupedSections={data.groupedSections || {}}
			sortedCategories={data.sortedCategories || []}
			selectedSectionId={selectedSection?.id || ''}
			onSectionSelect={(section) => selectSection(section as LoadedDocSection)}
			isOpen={sidebarOpen}
			onToggle={toggleSidebar}
			showFooter={true}
			{selectedSection}
			isMobile={true}
		/>

		<!-- Main Content Area -->
		<div class="flex min-w-0 flex-1 flex-col">
			<!-- Header -->
			<header class="docs-header">
				<!-- Mobile menu button -->
				<button onclick={openSidebar} class="docs-menu-btn lg:hidden" aria-label="Open sidebar">
					<NavigationIcons name="menu" size="h-6 w-6" />
				</button>

				<!-- Title -->
				<div class="docs-title-container">
					{#if selectedSection}
						<div class="docs-title-content">
							<span class="text-lg">{selectedSection.icon}</span>
							<h1 class="docs-title">{selectedSection.title}</h1>
						</div>
					{:else}
						<h1 class="docs-title">Documentation</h1>
					{/if}
				</div>

				<!-- Search button -->
				<button onclick={openSearch} class="docs-search-btn" title="Search documentation">
					<NavigationIcons name="search" size="h-4 w-4" />
					<kbd class="docs-search-kbd">⌘K</kbd>
				</button>
			</header>

			<!-- Content -->
			<main class="flex-1">
				<DocContent
					section={selectedSection}
					content={currentContent}
					loading={false}
					onMenuToggle={toggleSidebar}
					showOnlyContent={true}
					sections={data.sections}
					onSectionSelect={(section) => selectSection(section as LoadedDocSection)}
				/>
			</main>
		</div>
	</div>
{/if}

<style>
	/* Header styles */
	.docs-header {
		position: sticky;
		top: 0;
		z-index: 30;
		border-bottom: 1px solid rgb(229 231 235);
		background: linear-gradient(to bottom, rgb(255 255 255 / 0.95), rgb(255 255 255 / 0.8));
		backdrop-filter: blur(8px);
		display: flex;
		height: 4rem;
		align-items: center;
		justify-content: space-between;
		padding: 0 1rem;
	}

	@media (min-width: 1024px) {
		.docs-header {
			padding: 0 1.5rem;
		}
	}

	:global([data-theme='dark']) .docs-header {
		border-bottom-color: rgb(55 65 81);
		background: linear-gradient(to bottom, rgb(17 24 39 / 0.95), rgb(17 24 39 / 0.8));
	}

	.docs-menu-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: 0.5rem;
		color: rgb(107 114 128);
		transition: all 0.2s;
		cursor: pointer;
	}

	@media (min-width: 1024px) {
		.docs-menu-btn {
			display: none !important;
		}
	}

	.docs-menu-btn:hover {
		background-color: rgb(243 244 246);
		color: rgb(75 85 99);
	}

	:global([data-theme='dark']) .docs-menu-btn {
		color: rgb(156 163 175);
	}

	:global([data-theme='dark']) .docs-menu-btn:hover {
		background-color: rgb(31 41 55);
		color: rgb(209 213 219);
	}

	.docs-title-container {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	@media (min-width: 1024px) {
		.docs-title-container {
			margin-left: 1rem;
			justify-content: flex-start;
		}
	}

	.docs-title-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.docs-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: rgb(17 24 39);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	:global([data-theme='dark']) .docs-title {
		color: rgb(255 255 255);
	}

	.docs-search-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		color: rgb(107 114 128);
		transition: all 0.2s;
		cursor: pointer;
	}

	.docs-search-btn:hover {
		background-color: rgb(243 244 246);
		color: rgb(75 85 99);
	}

	:global([data-theme='dark']) .docs-search-btn {
		color: rgb(156 163 175);
	}

	:global([data-theme='dark']) .docs-search-btn:hover {
		background-color: rgb(31 41 55);
		color: rgb(209 213 219);
	}

	.docs-search-kbd {
		display: none;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		border: 1px solid rgb(209 213 219);
		background-color: rgb(229 231 235);
		font-family: ui-monospace, SFMono-Regular, 'Liberation Mono', Consolas, Menlo, monospace;
		font-size: 0.75rem;
		color: rgb(75 85 99);
	}

	@media (min-width: 640px) {
		.docs-search-kbd {
			display: inline-flex;
		}
	}

	:global([data-theme='dark']) .docs-search-kbd {
		border-color: rgb(75 85 99);
		background-color: rgb(55 65 81);
		color: rgb(156 163 175);
	}

	/* Global styles */
	:global(.docs-page button),
	:global(.docs-page a),
	:global(.docs-page [role='button']) {
		cursor: pointer !important;
	}

	/* Smooth scrolling and header anchor styles */
	:global(.markdown-content) {
		scroll-behavior: smooth;
	}

	:global(.markdown-content h1),
	:global(.markdown-content h2),
	:global(.markdown-content h3),
	:global(.markdown-content h4),
	:global(.markdown-content h5),
	:global(.markdown-content h6) {
		scroll-margin-top: 5rem;
		position: relative;
	}

	:global(.markdown-content h1:target),
	:global(.markdown-content h2:target),
	:global(.markdown-content h3:target) {
		animation: highlight-flash 2s ease-out;
	}

	@keyframes highlight-flash {
		0% {
			background-color: rgba(59, 130, 246, 0.1);
		}
		100% {
			background-color: transparent;
		}
	}

	:global(.dark .markdown-content h1:target),
	:global(.dark .markdown-content h2:target),
	:global(.dark .markdown-content h3:target) {
		animation: highlight-flash-dark 2s ease-out;
	}

	@keyframes highlight-flash-dark {
		0% {
			background-color: rgba(59, 130, 246, 0.2);
		}
		100% {
			background-color: transparent;
		}
	}
</style>
