<script lang="ts">
	import { ProgressBar } from '$lib/components/partials';
	import { onMount } from 'svelte';
	import { splashScreenState, splashScreen } from './SplashScreen';
	import { APP_NAME } from '$lib/utils';

	let state = $derived($splashScreenState);

	onMount(() => {
		splashScreen.startLoading();

		return () => {
			splashScreen.stop();
		};
	});
</script>

{#if state.isVisible}
	<div class="fixed inset-0 z-50">
		<div class="relative flex h-full items-center justify-center">
			<div class="flex flex-col items-center space-y-8 px-4">
				<!-- Logo -->
				<div class="animate-pulse">
					<img src="/favicon.png" alt="Loading" class="h-24 w-24 sm:h-32 sm:w-32" />
				</div>

				<!-- App Name -->
				<div class="text-center">
					<h1 class="mb-2 text-2xl font-bold text-black sm:text-3xl dark:text-white">{APP_NAME}</h1>
				</div>

				<!-- Progress Bar -->
				<div class="w-48 sm:w-64">
					<ProgressBar value={state.progress} label="Loading..." size="sm" animated={true} />
				</div>
			</div>
		</div>
	</div>
{/if}
