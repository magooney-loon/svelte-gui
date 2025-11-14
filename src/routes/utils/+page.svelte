<script lang="ts">
	import { onMount } from 'svelte';
	import { staggeredAnimation, singleElementAnimation, staggerPresets } from '$lib/utils';
	import { Button, Card, LoadingSpinner } from '$lib/components/partials';
	import { ThemeIcons, NavigationIcons } from '$lib/components/icons';

	let loading = $state(true);
	let selectedDemo = $state('fade-in-up');
	let refreshCounter = $state(0);

	// Demo configurations
	const demos = [
		{
			id: 'fade-in-up',
			name: 'Fade In Up',
			icon: 'arrow-up',
			description: 'Fade in while sliding up from below'
		},
		{
			id: 'fade-in-down',
			name: 'Fade In Down',
			icon: 'arrow-down',
			description: 'Fade in while sliding down from above'
		},
		{
			id: 'fade-in-left',
			name: 'Fade In Left',
			icon: 'arrow-left',
			description: 'Fade in while sliding from the left'
		},
		{
			id: 'fade-in-right',
			name: 'Fade In Right',
			icon: 'arrow-right',
			description: 'Fade in while sliding from the right'
		},
		{
			id: 'scale-in',
			name: 'Scale In',
			icon: 'plus',
			description: 'Scale up from a smaller size'
		},
		{
			id: 'slide-up-scale',
			name: 'Slide Up Scale',
			icon: 'arrow-up',
			description: 'Slide up and scale in simultaneously'
		},
		{
			id: 'quick-fade',
			name: 'Quick Fade',
			icon: 'refresh',
			description: 'Fast fade in with minimal movement'
		},
		{
			id: 'dramatic',
			name: 'Dramatic',
			icon: 'star',
			description: 'Slow entrance with scale and movement'
		},
		{
			id: 'custom',
			name: 'Custom Mix',
			icon: 'settings',
			description: 'Custom animation parameters possible'
		}
	];

	// Sample data for animations
	const sampleCards = [
		{
			id: 1,
			title: 'Feature One',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
			icon: 'dashboard',
			color: 'blue'
		},
		{
			id: 2,
			title: 'Feature Two',
			description: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
			icon: 'user',
			color: 'green'
		},
		{
			id: 3,
			title: 'Feature Three',
			description: 'Ut enim ad minim veniam, quis nostrud exercitation.',
			icon: 'star',
			color: 'purple'
		},
		{
			id: 4,
			title: 'Feature Four',
			description: 'Duis aute irure dolor in reprehenderit in voluptate.',
			icon: 'heart',
			color: 'red'
		}
	];

	const listItems = [
		'Performance optimized with requestAnimationFrame',
		'GPU-accelerated transforms for smooth 60fps animations',
		'Intersection Observer for viewport detection',
		'Respects user animation preferences',
		'Resets on scroll when needed',
		'Lightweight and tree-shakable'
	];

	// Get current animation options based on selection
	function getCurrentAnimationOptions() {
		switch (selectedDemo) {
			case 'fade-in-up':
				return staggerPresets.fadeInUp();
			case 'fade-in-down':
				return staggerPresets.fadeInDown();
			case 'fade-in-left':
				return staggerPresets.fadeInLeft();
			case 'fade-in-right':
				return staggerPresets.fadeInRight();
			case 'scale-in':
				return staggerPresets.scaleIn();
			case 'slide-up-scale':
				return staggerPresets.slideUpScale();
			case 'quick-fade':
				return staggerPresets.quickFade();
			case 'dramatic':
				return staggerPresets.dramatic();
			case 'custom':
				return {
					duration: 800,
					fromOpacity: 0,
					fromY: 50,
					fromX: -20,
					fromScale: 0.7,
					staggerDelay: 150,
					easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
				};
			default:
				return staggerPresets.fadeInUp();
		}
	}

	// Reactive animation options
	const currentAnimationOptions = $derived(getCurrentAnimationOptions());

	function refreshAnimations() {
		refreshCounter += 1;
	}

	function selectDemo(demoId: string) {
		selectedDemo = demoId;
		refreshAnimations();
	}

	onMount(() => {
		loading = false;
	});
</script>

<svelte:head>
	<title>Utils | Svelte-GUI</title>
	<meta name="description" content="Explore powerful animation utilities in Svelte-GUI" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<!-- Header -->
	<header class="mb-8 text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">Animation Utilities</h1>
		<p class="mb-6 text-lg text-gray-600 dark:text-gray-400">
			Staggered effects & viewport detection
		</p>
		<div class="mb-8 flex justify-center gap-4">
			<Button onclick={refreshAnimations} variant="outline" size="md">
				<NavigationIcons name="refresh" class="mr-2 h-4 w-4" />
				Refresh Animations
			</Button>
		</div>
	</header>

	{#if loading}
		<div class="flex justify-center py-12">
			<LoadingSpinner text="Loading animation demos..." size="lg" />
		</div>
	{:else}
		<!-- Demo Selector -->
		<div class="mb-8">
			<h2 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
				Choose Animation Type
			</h2>
			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each demos as demo (demo.id)}
					<Card
						padding="md"
						hover={true}
						clickable={true}
						class={selectedDemo === demo.id
							? 'bg-blue-50 ring-2 ring-blue-500 dark:bg-blue-900/20'
							: ''}
						onclick={() => selectDemo(demo.id)}
					>
						<div class="flex items-start gap-3">
							<ThemeIcons name={demo.icon} class="mt-1 h-5 w-5 text-gray-600 dark:text-gray-400" />
							<div class="flex-1">
								<h3 class="font-medium text-gray-900 dark:text-gray-100">
									{demo.name}
								</h3>
								<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
									{demo.description}
								</p>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>

		<!-- Card Grid Demo -->
		<section class="mb-12">
			<Card padding="lg">
				<h2 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">Card Grid</h2>
				<p class="mb-8 text-gray-600 dark:text-gray-400">
					Watch as these cards animate into view with the selected stagger effect.
				</p>
				{#key refreshCounter}
					<div
						class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
						use:staggeredAnimation={currentAnimationOptions}
					>
						{#each sampleCards as card (card.id)}
							<div
								class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
							>
								<div class="mb-4 flex items-center justify-between">
									<ThemeIcons name={card.icon} class="h-8 w-8 text-{card.color}-500" />
									<span class="text-xs font-medium text-gray-500 dark:text-gray-400">
										0{card.id}
									</span>
								</div>
								<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
									{card.title}
								</h3>
								<p class="text-gray-600 dark:text-gray-400">
									{card.description}
								</p>
							</div>
						{/each}
					</div>
				{/key}
			</Card>
		</section>

		<!-- List Demo -->
		<section class="mb-12">
			<Card padding="lg">
				<h2 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">Feature List</h2>
				<p class="mb-8 text-gray-600 dark:text-gray-400">
					The stagger effect works with lists too. Each item appears with a cascading delay.
				</p>
				{#key refreshCounter}
					<div class="space-y-3" use:staggeredAnimation={currentAnimationOptions}>
						{#each listItems as item, index (index)}
							<div
								class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
							>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
								>
									{index + 1}
								</div>
								<p class="text-gray-900 dark:text-gray-100">{item}</p>
							</div>
						{/each}
					</div>
				{/key}
			</Card>
		</section>

		<!-- Single Element Demo -->
		<section class="mb-12">
			<Card padding="lg">
				<h2 class="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">Single Element</h2>
				<p class="mb-8 text-gray-600 dark:text-gray-400">
					You can also animate individual elements without staggering.
				</p>
				<div class="grid gap-8 md:grid-cols-2">
					{#key refreshCounter}
						<div
							class="rounded-lg bg-linear-to-r from-blue-500 to-blue-950 p-8 text-white"
							use:singleElementAnimation={{
								duration: 800,
								fromOpacity: 0,
								fromY: 40,
								easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
							}}
						>
							<h3 class="mb-2 text-xl font-bold">Call-to-Action</h3>
							<p class="mb-4">This entire card animates.</p>
							<Button
								variant="secondary"
								size="sm"
								class="bg-white text-gray-900 hover:bg-gray-100"
							>
								Get Started
							</Button>
						</div>
					{/key}
					{#key refreshCounter + 1}
						<div
							class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600"
							use:singleElementAnimation={{
								duration: 600,
								fromOpacity: 0,
								fromScale: 0.5,
								easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
							}}
						>
							<ThemeIcons name="star" class="mx-auto mb-4 h-12 w-12 text-yellow-500" />
							<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
								Scale Animation
							</h3>
							<p class="text-gray-600 dark:text-gray-400">
								This container scales up with a bounce effect
							</p>
						</div>
					{/key}
				</div>
			</Card>
		</section>

		<!-- Configuration Info -->
		<section>
			<div class="mx-auto max-w-2xl">
				<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">Preset Options</h3>
				<div class="overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800">
					<div class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each Object.entries(currentAnimationOptions) as [key, value] (`${key}-${value}`)}
							<div class="flex items-center justify-between px-4 py-3">
								<span class="font-mono text-sm text-gray-600 dark:text-gray-400">{key}</span>
								<span class="text-sm font-medium text-gray-900 dark:text-gray-100">
									{typeof value === 'number' ? `${value}ms` : String(value)}
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}
</div>
