<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { themeStore, transitionLink, auth, APP_NAME, safeResolve } from '$lib/utils';
	import { NavigationLogic, type NavigationState } from './Navigation.js';
	import { NavigationIcons, AccountIcons, ThemeIcons } from '$lib/components/icons';

	const logic = new NavigationLogic(page.url.pathname);
	let state = $state<NavigationState>(logic.getState());

	logic.onStateUpdate((newState) => {
		state = newState;
	});

	$effect(() => {
		logic.updateCurrentPath(page.url.pathname);
	});

	function isActive(path: string): boolean {
		const normalizePath = (p: string) => (p === '/' ? p : p.endsWith('/') ? p.slice(0, -1) : p);
		return normalizePath(state.currentPath) === normalizePath(path);
	}

	// const api = new ApiClient();
	// async function handleLogout() {
	// 	try {
	// 		await api.auth.logout();
	// 		logoutUser();
	// 		await navigateWithTransition('/');
	// 	} catch (error) {
	// 		console.error('Logout failed:', error);
	// 	}
	// }
</script>

<nav
	class="top-0 border-b border-gray-200/50 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
	in:slide
>
	<div class="mx-auto px-2">
		<div class="flex h-14 items-center justify-between">
			<!-- Logo and brand -->
			<div class="flex items-center">
				<div class="shrink-0">
					<a href={safeResolve('/')} class="group flex items-center space-x-1" use:transitionLink>
						<img
							alt="{APP_NAME} logo"
							src="/favicon.png"
							class="h-9 w-9 transition-transform group-hover:scale-110"
						/>
						<span class="text-lg font-medium text-gray-900 dark:text-gray-100">{APP_NAME}</span>
					</a>
				</div>

				<!-- Desktop navigation -->
				<div class="relative ml-8 hidden sm:flex sm:items-center sm:space-x-1">
					{#each logic.navItems as item (item.href)}
						<a
							href={safeResolve(item.href)}
							onclick={() => logic.handleNavItemClick(item.href)}
							use:transitionLink
							class="nav-link relative flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200
							{isActive(item.href)
								? 'text-gray-900 dark:text-gray-100'
								: 'text-gray-600 hover:bg-gray-50/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/30 dark:hover:text-gray-100'}
							{logic.isNavItemDisabled(item) ? 'pointer-events-none cursor-not-allowed opacity-50' : ''}"
							aria-disabled={logic.isNavItemDisabled(item)}
						>
							<span
								class="transition-transform duration-200 {isActive(item.href) ? 'scale-110' : ''}"
							>
								<NavigationIcons name={item.icon} />
							</span>
							<span class="relative flex items-center space-x-1">
								<span>{item.label}</span>
								{#if logic.hasNavItemBadge(item)}
									<span
										class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white"
									>
										{logic.getNavItemBadge(item)}
									</span>
								{/if}
								<div
									class="nav-indicator absolute -bottom-3 left-1/2 h-0.5 rounded-full bg-black transition-all duration-300 ease-out dark:bg-white
									{isActive(item.href) ? 'w-full -translate-x-1/2 opacity-100' : 'w-0 -translate-x-1/2 opacity-0'}"
								></div>
							</span>
						</a>
					{/each}
				</div>
			</div>

			<!-- Right side items -->
			<div class="flex items-center space-x-3">
				<!-- Auth Section -->
				{#if auth.isAuthenticated}
					<!-- Account link -->
					<a
						href={safeResolve('/account')}
						use:transitionLink
						class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus:ring-gray-100 dark:focus:ring-offset-gray-950"
						title="Account"
						aria-label="View account"
					>
						<AccountIcons name="user" />
					</a>

					<!-- Logout button
					<button
						onclick={handleLogout}
						class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus:ring-gray-100 dark:focus:ring-offset-gray-950"
						title="Logout"
						aria-label="Logout"
					>
						<AccountIcons name="logout" />
					</button> -->
				{:else}
					<!-- Login button -->
					<a
						href={safeResolve('/account/login')}
						use:transitionLink
						class="relative flex h-8 items-center justify-center space-x-1.5 rounded-md border border-blue-200 bg-linear-to-r from-white to-blue-50/30 px-3 text-blue-600 shadow-sm shadow-blue-100/50 transition-all duration-200 hover:border-blue-300 hover:bg-linear-to-r hover:from-blue-50 hover:to-blue-100/50 hover:text-blue-700 hover:shadow-md hover:shadow-blue-200/50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-blue-800 dark:from-gray-950 dark:to-blue-950/30 dark:text-blue-400 dark:shadow-blue-900/20 dark:hover:border-blue-700 dark:hover:from-blue-950 dark:hover:to-blue-900/50 dark:hover:text-blue-300 dark:hover:shadow-blue-800/30 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-950"
						title="Login"
						aria-label="Login"
					>
						<AccountIcons name="login" />
						<span class="text-sm font-medium">Log In</span>
					</a>
				{/if}

				<!-- Settings link -->
				{#if !auth.isAuthenticated}
					<a
						href={safeResolve('/settings')}
						use:transitionLink
						class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus:ring-gray-100 dark:focus:ring-offset-gray-950"
						title="Settings"
						aria-label="View settings"
					>
						<ThemeIcons name="settings" />
					</a>
				{/if}

				<!-- Theme toggle -->
				<button
					onclick={() => logic.toggleTheme()}
					class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus:ring-gray-100 dark:focus:ring-offset-gray-950"
					title="Toggle theme"
					aria-label="Toggle dark mode"
				>
					<ThemeIcons name={$themeStore === 'dark' ? 'sun' : 'moon'} />
				</button>

				<!-- Mobile menu button -->
				<button
					onclick={() => logic.toggleMobileMenu()}
					class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none sm:hidden dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-100 dark:focus:ring-gray-100 dark:focus:ring-offset-gray-950"
					aria-expanded={state.mobileMenuOpen}
					aria-label="Toggle mobile menu"
				>
					<NavigationIcons
						name={state.mobileMenuOpen ? 'close' : 'menu'}
						class="transition-transform duration-150 {state.mobileMenuOpen ? 'rotate-90' : ''}"
					/>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if state.mobileMenuOpen}
		<div
			out:slide={{ duration: 200, easing: cubicOut, axis: 'y' }}
			in:slide={{ duration: 300, easing: cubicOut, axis: 'y' }}
			class="border-t border-gray-200/50 bg-white/95 sm:hidden dark:border-gray-800/50 dark:bg-gray-950/95"
		>
			<div class="px-4 py-3">
				<!-- Mobile navigation items -->
				<div class="space-y-1">
					{#each logic.navItems as item (item.href)}
						<a
							href={safeResolve(item.href)}
							onclick={() => logic.handleNavItemClick(item.href)}
							use:transitionLink
							class="group relative flex items-center space-x-2.5 overflow-hidden rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200
							{isActive(item.href)
								? 'bg-gray-100 text-gray-900 dark:bg-gray-800/50 dark:text-gray-100'
								: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900/50 dark:hover:text-gray-100'}
							{logic.isNavItemDisabled(item) ? 'pointer-events-none cursor-not-allowed opacity-50' : ''}"
							aria-disabled={logic.isNavItemDisabled(item)}
						>
							<span
								class="transition-transform duration-200 {isActive(item.href) ? 'scale-110' : ''}"
							>
								<NavigationIcons name={item.icon} />
							</span>
							<span class="flex-1">{item.label}</span>
							<div class="flex items-center space-x-2">
								{#if logic.hasNavItemBadge(item)}
									<span
										class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white"
									>
										{logic.getNavItemBadge(item)}
									</span>
								{/if}
								<div
									class="h-1.5 w-1.5 rounded-full bg-black transition-all duration-300 dark:bg-white
									{isActive(item.href) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}"
								></div>
							</div>
							{#if isActive(item.href)}
								<div
									class="absolute top-0 left-0 h-full w-1 bg-black transition-all duration-300 ease-out dark:bg-white"
								></div>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</nav>

<style>
	.nav-link:hover .nav-indicator {
		width: 50%;
		opacity: 0.3;
	}

	/* Prevent layout shift during transitions */
	.nav-indicator {
		will-change: width, opacity, transform;
	}
</style>
