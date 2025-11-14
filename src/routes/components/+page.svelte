<script lang="ts">
	import { Button } from '$lib/components/partials';
	import {
		successToast,
		errorToast,
		warningToast,
		infoToast,
		startViewTransition
	} from '$lib/utils';
	import { NavigationIcons, ThemeIcons, ActionIcons, FileIcons } from '$lib/components/icons';
	import FormComponents from './partials/FormComponents.svelte';
	import DataComponents from './partials/DataComponents.svelte';
	import LayoutComponents from './partials/LayoutComponents.svelte';
	import FeedbackComponents from './partials/FeedbackComponents.svelte';

	let selectedCategory = $state('form');

	const categories = [
		{ id: 'form', name: 'Form Components', icon: 'edit' },
		{ id: 'data', name: 'Data Display', icon: 'spreadsheet' },
		{ id: 'layout', name: 'Layout', icon: 'sliders' },
		{ id: 'feedback', name: 'Feedback', icon: 'notification' }
	] as const;

	function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
		switch (type) {
			case 'success':
				successToast(message);
				break;
			case 'error':
				errorToast(message);
				break;
			case 'warning':
				warningToast(message);
				break;
			case 'info':
				infoToast(message);
				break;
		}
	}

	async function switchCategory(categoryId: string) {
		if (selectedCategory === categoryId) return;

		await startViewTransition(() => {
			selectedCategory = categoryId;
		});
	}
</script>

<svelte:head>
	<title>Component Gallery</title>
	<meta name="description" content="Explore our comprehensive UI component library" />
</svelte:head>

<div style="view-transition-name: page-title">
	<h1 class="sr-only">Component Gallery</h1>
</div>

<div class="container mx-auto px-4 py-8">
	<header class="mb-8 text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">Component Gallery</h1>
		<p class="mb-6 text-lg text-gray-600 dark:text-gray-400">General purpose UI components.</p>

		<div class="mb-8 flex flex-wrap justify-center gap-2">
			{#each categories as category (category.id)}
				<Button
					variant={selectedCategory === category.id ? 'primary' : 'outline'}
					onclick={() => switchCategory(category.id)}
					class="flex items-center"
				>
					{#if category.id === 'form'}
						<ActionIcons name={category.icon} size="h-4 w-4" class="mr-2" />
					{:else if category.id === 'data'}
						<FileIcons name={category.icon} size="h-4 w-4" class="mr-2" />
					{:else if category.id === 'layout'}
						<ThemeIcons name={category.icon} size="h-4 w-4" class="mr-2" />
					{:else}
						<NavigationIcons name={category.icon} size="h-4 w-4" class="mr-2" />
					{/if}
					{category.name}
				</Button>
			{/each}
		</div>
	</header>

	<div data-transition="category-content">
		{#if selectedCategory === 'form'}
			<FormComponents />
		{:else if selectedCategory === 'data'}
			<DataComponents />
		{:else if selectedCategory === 'layout'}
			<LayoutComponents />
		{:else if selectedCategory === 'feedback'}
			<FeedbackComponents {showToast} />
		{/if}
	</div>
</div>

<style>
	:global(.grid) {
		display: grid;
	}
</style>
