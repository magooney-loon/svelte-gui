<script lang="ts">
	import { onMount } from 'svelte';
	import {
		NavigationIcons,
		AccountIcons,
		StatusIcons,
		ActionIcons,
		ThemeIcons,
		SocialIcons,
		MediaIcons,
		FileIcons
	} from '$lib/components/icons';
	import { Button, Card, LoadingSpinner } from '$lib/components/partials';
	import { startViewTransition } from '$lib/utils/view-transitions';

	let loading = $state(true);
	let selectedCategory = $state('navigation');

	// Icon definitions for each category
	const iconDefinitions: Record<string, string[]> = {
		navigation: [
			'home',
			'dashboard',
			'back',
			'forward',
			'chevron-left',
			'chevron-right',
			'chevron-up',
			'chevron-down',
			'menu',
			'close',
			'plus',
			'minus',
			'refresh',
			'link',
			'download',
			'upload',
			'share',
			'search',
			'notification',
			'bookmark'
		],
		account: [
			'user',
			'login',
			'logout',
			'register',
			'profile',
			'users',
			'shield',
			'key',
			'lock',
			'unlock'
		],
		status: [
			'error',
			'warning',
			'info',
			'loading',
			'check',
			'x',
			'exclamation',
			'question',
			'pause',
			'play',
			'stop',
			'connection',
			'offline',
			'online',
			'busy',
			'away',
			'invisible'
		],
		action: [
			'edit',
			'save',
			'delete',
			'copy',
			'paste',
			'cut',
			'undo',
			'redo',
			'print',
			'heart',
			'thumbs-up',
			'thumbs-down',
			'star',
			'flag',
			'filter',
			'sort',
			'export',
			'import',
			'send',
			'reply',
			'trash'
		],
		theme: [
			'sun',
			'moon',
			'settings',
			'cog',
			'wrench',
			'adjustments',
			'sliders',
			'contrast',
			'palette',
			'brush',
			'desktop',
			'mobile',
			'tablet',
			'globe',
			'language'
		],
		social: [
			'github',
			'twitter',
			'linkedin',
			'facebook',
			'youtube',
			'instagram',
			'mail',
			'phone',
			'message',
			'whatsapp',
			'telegram',
			'discord',
			'slack'
		],
		media: [
			'camera',
			'image',
			'picture',
			'video',
			'play',
			'pause',
			'stop',
			'volume',
			'volume-up',
			'volume-down',
			'volume-mute',
			'microphone',
			'microphone-off',
			'film',
			'music',
			'headphones',
			'speaker',
			'screen',
			'projector',
			'tv',
			'radio'
		],
		file: [
			'file',
			'file-text',
			'folder',
			'folder-open',
			'document',
			'pdf',
			'spreadsheet',
			'presentation',
			'archive',
			'zip',
			'cloud',
			'cloud-upload',
			'cloud-download',
			'database',
			'hard-drive',
			'usb',
			'cd',
			'server',
			'storage',
			'backup',
			'export',
			'import',
			'attachment',
			'paperclip',
			'certificate',
			'key',
			'lock',
			'unlock'
		]
	};

	const categories = [
		{ id: 'navigation', name: 'Navigation', component: NavigationIcons, icon: 'home' },
		{ id: 'account', name: 'Account', component: AccountIcons, icon: 'user' },
		{ id: 'status', name: 'Status', component: StatusIcons, icon: 'check' },
		{ id: 'action', name: 'Action', component: ActionIcons, icon: 'edit' },
		{ id: 'theme', name: 'Theme', component: ThemeIcons, icon: 'palette' },
		{ id: 'social', name: 'Social', component: SocialIcons, icon: 'message' },
		{ id: 'media', name: 'Media', component: MediaIcons, icon: 'play' },
		{ id: 'file', name: 'File', component: FileIcons, icon: 'folder' }
	] as const;

	// Calculate total icons
	const totalIcons = Object.values(iconDefinitions).reduce((sum, icons) => sum + icons.length, 0);

	onMount(() => {
		loading = false;
	});

	async function switchCategory(categoryId: string) {
		if (selectedCategory === categoryId) return;

		await startViewTransition(() => {
			selectedCategory = categoryId;
		});
	}
</script>

<svelte:head>
	<title>Icon Gallery - General Purpose Icons</title>
	<meta
		name="description"
		content="Complete collection of {totalIcons} general purpose icons organized by category for modern web applications."
	/>
</svelte:head>

<div style="view-transition-name: page-title">
	<h1 class="sr-only">Icons Gallery</h1>
</div>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<header class="mb-8 text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">Icon Gallery</h1>
		<p class="mb-6 text-lg text-gray-600 dark:text-gray-400">
			{totalIcons} general purpose icons across {categories.length} categories
		</p>

		<!-- Category Selector -->
		<div class="mb-8 flex flex-wrap justify-center gap-2">
			{#each categories as category (category.id)}
				{@const Component = category.component}
				<Button
					variant={selectedCategory === category.id ? 'primary' : 'outline'}
					size="sm"
					onclick={() => switchCategory(category.id)}
					class="inline-flex items-center gap-2"
				>
					<Component name={category.icon} size="h-4 w-4" />
					{category.name} ({iconDefinitions[category.id].length})
				</Button>
			{/each}
		</div>
	</header>

	{#if loading}
		<div class="flex justify-center py-12">
			<LoadingSpinner text="Loading icon gallery..." size="lg" />
		</div>
	{:else}
		<!-- Icon Grid -->
		<div class="space-y-12" data-transition="icon-content">
			{#each categories as category (category.id)}
				{#if selectedCategory === category.id}
					{@const Component = category.component}
					<Card class="p-6">
						<h2 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
							{category.name} Icons
						</h2>

						<div
							class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
						>
							{#each iconDefinitions[category.id] as iconName, index (category.id + '-' + iconName + '-' + index)}
								<div class="group">
									<div
										class="flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600"
									>
										<Component
											name={iconName}
											size="h-8 w-8"
											class="text-gray-600 transition-colors group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400"
										/>
									</div>
									<p class="mt-2 text-center font-mono text-xs text-gray-600 dark:text-gray-400">
										{iconName}
									</p>
								</div>
							{/each}
						</div>
					</Card>
				{/if}
			{/each}
		</div>
	{/if}
</div>
