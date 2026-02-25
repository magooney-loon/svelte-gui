<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { NavigationIcons } from '$lib/components/icons';
	import { scrollToElementSmooth, animations } from '$lib/utils';
	import { untrack } from 'svelte';

	let {
		title,
		subtitle,
		padding = 'md',
		shadow = 'md',
		rounded = 'lg',
		hover = false,
		clickable = false,
		expandable = false,
		defaultExpanded = false,
		href,
		target,
		onclick,
		class: className = '',
		headerClass = '',
		bodyClass = '',
		children
	}: {
		title?: string;
		subtitle?: string;
		padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
		shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
		rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
		hover?: boolean;
		clickable?: boolean;
		expandable?: boolean;
		defaultExpanded?: boolean;
		href?: string;
		target?: string;
		onclick?: () => void;
		class?: string;
		headerClass?: string;
		bodyClass?: string;
		children?: import('svelte').Snippet;
	} = $props();

	let isExpanded = $state(untrack(() => defaultExpanded));
	let cardElement: HTMLElement | undefined = $state();

	// Pre-computed static classes - no reactive recalculation
	const paddingClasses = {
		none: '',
		sm: 'p-3',
		md: 'p-4 sm:p-6',
		lg: 'p-6 sm:p-8',
		xl: 'p-8 sm:p-10'
	};

	const shadowClasses = {
		none: '',
		sm: 'shadow-sm',
		md: 'shadow-md',
		lg: 'shadow-lg',
		xl: 'shadow-xl'
	};

	const roundedClasses = {
		none: '',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		full: 'rounded-full'
	};

	// Base styles - computed once with more specific transitions
	const baseStyles =
		'bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-950 dark:to-gray-900/95 backdrop-blur-sm border border-gray-200/60 dark:border-gray-800/60 relative overflow-hidden transform-gpu will-change-transform';

	// Optimized class computation with caching
	const cardClasses = $derived.by(() => {
		const parts = [
			baseStyles,
			expandable ? '' : paddingClasses[padding],
			shadowClasses[shadow],
			roundedClasses[rounded],
			className
		];

		// Determine if we need hover effects
		const needsHover = hover || clickable || href || onclick;
		const isInteractiveCard = clickable || href || onclick;

		// Interactive styles
		if (isInteractiveCard) {
			parts.push(
				'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-white/80 dark:focus:ring-offset-gray-950 group'
			);
		}

		// Apply hover styles only once, regardless of multiple conditions
		if (needsHover) {
			const borderIntensity = isInteractiveCard ? '80' : '60';
			parts.push(
				`transition-all duration-200 ease-out hover:border-blue-400/${borderIntensity} dark:hover:border-blue-500/${borderIntensity} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`
			);
		} else {
			// Still need transition for non-hover cards for consistent behavior
			parts.push('transition-all duration-200 ease-out');
		}

		return parts.filter(Boolean).join(' ');
	});

	// Cached computations
	const hasHeader = $derived(!!(title || subtitle || expandable));
	const isInteractive = $derived(!!(href || onclick || clickable));

	// Optimized event handlers
	function handleClick() {
		onclick?.();
	}

	function toggleExpand() {
		isExpanded = !isExpanded;

		// Scroll to card when expanding with slight delay to avoid conflicts
		if (isExpanded && cardElement) {
			scrollToElementSmooth(cardElement, {
				delay: transitionDuration + 100,
				disableScrollDuration: 400
			});
		}
	}

	function handleHeaderClick() {
		if (expandable) {
			toggleExpand();
		} else {
			onclick?.();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter' && event.key !== ' ') return;

		event.preventDefault();

		if (expandable) {
			toggleExpand();
		} else if (onclick) {
			onclick();
		}
	}

	// Pre-computed header classes for expandable cards
	const expandableHeaderClasses = $derived(
		`group flex w-full cursor-pointer items-start justify-between p-4 text-left transition-all duration-150 ease-out hover:bg-gray-50/80 focus:bg-gray-50/80 focus:outline-none active:bg-gray-100/80 sm:p-6 dark:hover:bg-gray-800/50 dark:focus:bg-gray-800/50 dark:active:bg-gray-800/75 ${headerClass}`
	);

	const staticHeaderClasses = $derived(`mb-4 ${headerClass}`);

	// Transition duration - optimized for smooth performance
	const transitionDuration = 300;
</script>

{#if href}
	<a
		bind:this={cardElement}
		{href}
		{target}
		class={cardClasses}
		tabindex="0"
		onkeydown={handleKeydown}
	>
		<!-- Content wrapper -->
		<div class="relative z-10">
			{#if hasHeader}
				{#if expandable}
					<button
						type="button"
						class={expandableHeaderClasses}
						onclick={handleHeaderClick}
						onkeydown={handleKeydown}
						aria-expanded={isExpanded}
						aria-controls="card-content"
					>
						<div class="min-w-0 flex-1 pr-3">
							{#if title}
								<h3
									class="text-base font-semibold tracking-tight text-gray-900 transition-colors duration-150 ease-out group-hover:text-gray-700 sm:text-lg dark:text-gray-100 dark:group-hover:text-gray-200"
								>
									{title}
								</h3>
							{/if}
							{#if subtitle}
								<p
									class="mt-1 text-xs leading-relaxed font-medium text-gray-500 sm:mt-1.5 sm:text-sm dark:text-gray-400"
								>
									{subtitle}
								</p>
							{/if}
						</div>
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ease-out group-hover:bg-gray-100/80 group-active:bg-gray-200/80 sm:h-10 sm:w-10 dark:group-hover:bg-gray-700/50 dark:group-active:bg-gray-700/75"
						>
							<NavigationIcons
								name="chevron-down"
								size="h-4 w-4 sm:h-5 sm:w-5"
								class="transform-gpu text-gray-400 transition-transform duration-150 ease-out will-change-transform group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 {isExpanded
									? 'rotate-180'
									: 'rotate-0'}"
							/>
						</div>
					</button>
				{:else}
					<div class={staticHeaderClasses}>
						{#if title}
							<h3
								class="text-base font-semibold tracking-tight text-gray-900 transition-colors duration-150 ease-out group-hover:text-blue-600 sm:text-lg dark:text-gray-100 dark:group-hover:text-blue-400"
							>
								{title}
							</h3>
						{/if}
						{#if subtitle}
							<p
								class="mt-1 text-xs leading-relaxed font-medium text-gray-500 sm:mt-1.5 sm:text-sm dark:text-gray-400"
							>
								{subtitle}
							</p>
						{/if}
					</div>
				{/if}
			{/if}

			{#if expandable}
				{#if isExpanded}
					<div
						id="card-content"
						in:slide={animations.enabled
							? { duration: transitionDuration, easing: quintOut }
							: { duration: 0 }}
						out:slide={animations.enabled
							? { duration: Math.floor(transitionDuration * 0.8), easing: quintOut }
							: { duration: 0 }}
						class="border-t border-gray-200/80 dark:border-gray-800/80"
					>
						<div class="p-4 sm:p-6 {bodyClass}">
							{#if children}
								{@render children()}
							{/if}
						</div>
					</div>
				{/if}
			{:else}
				<div class={bodyClass}>
					{#if children}
						{@render children()}
					{/if}
				</div>
			{/if}
		</div>
	</a>
{:else}
	<div
		bind:this={cardElement}
		class={cardClasses}
		role={isInteractive ? 'button' : undefined}
		{...isInteractive ? { tabindex: 0 } : {}}
		onclick={isInteractive ? handleClick : undefined}
		onkeydown={isInteractive ? handleKeydown : undefined}
	>
		<!-- Content wrapper -->
		<div class="relative z-10">
			{#if hasHeader}
				{#if expandable}
					<div
						class={expandableHeaderClasses}
						onclick={handleHeaderClick}
						onkeydown={handleKeydown}
						role="button"
						tabindex="0"
						aria-expanded={isExpanded}
						aria-controls="card-content"
					>
						<div class="min-w-0 flex-1 pr-3">
							{#if title}
								<h3
									class="text-base font-semibold tracking-tight text-gray-900 transition-colors duration-150 ease-out group-hover:text-gray-700 sm:text-lg dark:text-gray-100 dark:group-hover:text-gray-200"
								>
									{title}
								</h3>
							{/if}
							{#if subtitle}
								<p
									class="mt-1 text-xs leading-relaxed font-medium text-gray-500 sm:mt-1.5 sm:text-sm dark:text-gray-400"
								>
									{subtitle}
								</p>
							{/if}
						</div>
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ease-out group-hover:bg-gray-100/80 group-active:bg-gray-200/80 sm:h-10 sm:w-10 dark:group-hover:bg-gray-700/50 dark:group-active:bg-gray-700/75"
						>
							<NavigationIcons
								name="chevron-down"
								size="h-4 w-4 sm:h-5 sm:w-5"
								class="transform-gpu text-gray-400 transition-transform duration-150 ease-out will-change-transform group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 {isExpanded
									? 'rotate-180'
									: 'rotate-0'}"
							/>
						</div>
					</div>
				{:else}
					<div class={staticHeaderClasses}>
						{#if title}
							<h3
								class="text-base font-semibold tracking-tight text-gray-900 transition-colors duration-150 ease-out group-hover:text-blue-600 sm:text-lg dark:text-gray-100 dark:group-hover:text-blue-400"
							>
								{title}
							</h3>
						{/if}
						{#if subtitle}
							<p
								class="mt-1 text-xs leading-relaxed font-medium text-gray-500 sm:mt-1.5 sm:text-sm dark:text-gray-400"
							>
								{subtitle}
							</p>
						{/if}
					</div>
				{/if}
			{/if}

			{#if expandable}
				{#if isExpanded}
					<div
						id="card-content"
						in:slide={animations.enabled
							? { duration: transitionDuration, easing: quintOut }
							: { duration: 0 }}
						out:slide={animations.enabled
							? { duration: Math.floor(transitionDuration * 0.8), easing: quintOut }
							: { duration: 0 }}
						class="border-t border-gray-200/80 dark:border-gray-800/80"
					>
						<div class="p-4 sm:p-6 {bodyClass}">
							{#if children}
								{@render children()}
							{/if}
						</div>
					</div>
				{/if}
			{:else}
				<div class={bodyClass}>
					{#if children}
						{@render children()}
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Simple and effective hover transitions */
	:global(.transform-gpu) {
		transform: translateZ(0);
		backface-visibility: hidden;
	}
</style>
