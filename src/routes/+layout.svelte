<script lang="ts">
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Navigation, Footer, SplashScreen, splashScreenState } from '$lib/components/main';
	import { Toast } from '$lib/components/partials';
	import { auth, initializeAuth, toast, Mouse, ScrollToTop, Seo } from '$lib/utils';

	onMount(async () => {
		try {
			await initializeAuth();
		} catch (error) {
			console.error('Auth initialization failed:', error);
		}
	});

	let { children } = $props();
	let splashState = $derived($splashScreenState);
	let previousAuthState = $state(auth.isAuthenticated);

	$effect(() => {
		if (auth.loading) return;

		if (!previousAuthState && auth.isAuthenticated) {
			toast.success('Welcome back!');
		} else if (previousAuthState && !auth.isAuthenticated) {
			toast.info('Signed out.');
		}

		previousAuthState = auth.isAuthenticated;
	});
</script>

<Seo />

<SplashScreen />

{#if !splashState.isVisible}
	<div class="relative">
		<Navigation />
		<main in:fade class="mx-auto">
			{@render children()}
		</main>
		<Footer />
	</div>
{/if}

<Toast />
<Mouse />
<ScrollToTop />
