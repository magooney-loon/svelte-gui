<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { NavigationIcons } from '$lib/components/icons';

	let showButton = $state(false);
	let scrollY = $state(0);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	const handleScroll = () => {
		scrollY = window.scrollY;
		showButton = scrollY > 300;
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

{#if showButton}
	<button
		onclick={scrollToTop}
		class="group fixed right-6 z-40 h-10 w-10 cursor-pointer rounded-lg border border-gray-200 bg-white/20 text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-white hover:text-gray-900 hover:shadow-md focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:outline-none dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus:ring-gray-700"
		style="bottom: max(0.5rem, env(safe-area-inset-bottom, 0.5rem));"
		aria-label="Scroll to top"
		in:fly={{ y: 20, duration: 300 }}
		out:fly={{ y: 20, duration: 200 }}
	>
		<div
			class="flex h-full w-full items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5"
		>
			<NavigationIcons name="chevron-up" size="h-4 w-4" />
		</div>
	</button>
{/if}
