<script lang="ts">
	import { Button, Card, LoadingSpinner, EmptyState } from '$lib/components/partials';
	import { FileIcons, StatusIcons } from '$lib/components/icons';
	import MarkdownRenderer from './MarkdownRenderer.svelte';
	import DocNavigation from './DocNavigation.svelte';
	import type { LoadedDocSection } from '../types';

	interface Props {
		section: LoadedDocSection | null;
		content: string;
		loading?: boolean;
		onMenuToggle?: () => void;
		showOnlyHeader?: boolean;
		showOnlyContent?: boolean;
		sections?: LoadedDocSection[];
		onSectionSelect?: (section: LoadedDocSection) => void;
	}

	let {
		section,
		content,
		loading = false,
		onMenuToggle,
		showOnlyHeader = false,
		showOnlyContent = false,
		sections = [],
		onSectionSelect = () => {}
	}: Props = $props();
</script>

{#if showOnlyHeader}
	<!-- Header with mobile menu button -->
	<Card
		padding="md"
		shadow="sm"
		rounded="none"
		class="border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95"
	>
		<div class="flex items-center justify-between">
			<!-- Mobile menu button -->
			<Button
				variant="ghost"
				size="md"
				iconComponent="navigation"
				iconName="menu"
				class="cursor-pointer lg:hidden"
				onclick={onMenuToggle}
			/>

			<!-- Breadcrumb/Title -->
			<div class="flex items-center">
				{#if section}
					<div class="flex items-center space-x-2">
						<span class="text-lg">{section.icon}</span>
						<h1 class="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h1>
					</div>
				{:else}
					<h1 class="text-lg font-semibold text-gray-900 dark:text-white">Documentation</h1>
				{/if}
			</div>

			<!-- Actions -->
			<div class="flex items-center space-x-2">
				<!-- Search button placeholder -->
				<Button
					variant="ghost"
					size="sm"
					iconComponent="navigation"
					iconName="search"
					class="cursor-not-allowed opacity-50"
					disabled={true}
				/>
			</div>
		</div>
	</Card>
{:else if showOnlyContent}
	<!-- Main content -->
	<div class="mx-auto max-w-4xl px-6 py-8 lg:px-8">
		{#if loading}
			<!-- Loading state -->
			<LoadingSpinner text="Loading documentation..." size="lg" centered={true} />
		{:else if !section}
			<!-- Welcome state -->
			<div class="py-12 text-center">
				<EmptyState
					title="Welcome to the Documentation"
					description="Select a section from the sidebar to get started. You'll find comprehensive guides, API references, and examples to help you make the most of this platform."
					size="lg"
				>
					{#snippet iconSnippet()}
						<FileIcons name="document" class="h-12 w-12 text-blue-600 dark:text-blue-400" />
					{/snippet}
				</EmptyState>

				<div class="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
					<Card
						title="Quick Start"
						padding="lg"
						shadow="none"
						hover={true}
						class="cursor-pointer border-gray-200 text-center dark:border-gray-700"
					>
						<div class="mb-3 text-2xl">🚀</div>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							Get up and running in minutes with our installation guide.
						</p>
					</Card>

					<Card
						title="Components"
						padding="lg"
						shadow="none"
						hover={true}
						class="cursor-pointer border-gray-200 text-center dark:border-gray-700"
					>
						<div class="mb-3 text-2xl">⚙️</div>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							Explore our comprehensive component library and examples.
						</p>
					</Card>

					<Card
						title="Advanced"
						padding="lg"
						shadow="none"
						hover={true}
						class="cursor-pointer border-gray-200 text-center dark:border-gray-700"
					>
						<div class="mb-3 text-2xl">🔧</div>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							Deep dive into technical details and advanced usage patterns.
						</p>
					</Card>
				</div>
			</div>
		{:else if content}
			<!-- Content -->
			<MarkdownRenderer {content} />

			<!-- Navigation Controls -->
			{#if section && sections.length > 0}
				<DocNavigation {sections} currentSectionId={section.id} {onSectionSelect} class="mt-12" />
			{/if}
		{:else}
			<!-- Error state -->
			<EmptyState
				title="Content Not Available"
				description="The selected documentation section could not be loaded. Please try selecting another section."
				size="md"
			>
				{#snippet iconSnippet()}
					<StatusIcons name="warning" class="h-8 w-8 text-red-600 dark:text-red-400" />
				{/snippet}
			</EmptyState>
		{/if}
	</div>
{/if}
