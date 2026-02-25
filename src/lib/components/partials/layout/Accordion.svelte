<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { scrollToElementSmooth, animations } from '$lib/utils';

	export interface AccordionSection {
		id: string;
		title: string;
		icon?: string;
		disabled?: boolean;
		content?: string;
		[key: string]: unknown;
	}

	let {
		sections = [] as AccordionSection[],
		openSections = new SvelteSet<string>(),
		multiple = true,
		disabled = false,
		animationDuration = 350,
		maxHeight = '400px',
		enableScroll = true,
		class: className = '',
		sectionClass = '',
		headerClass = '',
		contentClass = '',
		onToggle,
		onSectionOpen,
		onSectionClose,
		children
	}: {
		sections?: AccordionSection[];
		openSections?: SvelteSet<string>;
		multiple?: boolean;
		disabled?: boolean;
		animationDuration?: number;
		maxHeight?: string;
		enableScroll?: boolean;
		class?: string;
		sectionClass?: string;
		headerClass?: string;
		contentClass?: string;
		onToggle?: (sectionId: string, isOpen: boolean) => void;
		onSectionOpen?: (sectionId: string) => void;
		onSectionClose?: (sectionId: string) => void;
		children?: import('svelte').Snippet<[section: AccordionSection, isOpen: boolean]>;
	} = $props();

	function toggleSection(section: AccordionSection, element?: HTMLElement) {
		if (disabled || section.disabled) return;

		const isCurrentlyOpen = openSections.has(section.id);

		if (isCurrentlyOpen) {
			openSections.delete(section.id);
			onSectionClose?.(section.id);
			onToggle?.(section.id, false);
		} else {
			// If not allowing multiple sections, close others
			if (!multiple) {
				openSections.clear();
			}

			openSections.add(section.id);
			onSectionOpen?.(section.id);
			onToggle?.(section.id, true);

			// Scroll to section when expanding with slight delay to avoid conflicts
			if (element && enableScroll) {
				scrollToElementSmooth(element, {
					delay: animationDuration + 50,
					disableScrollDuration: 400
				});
			}
		}
	}

	function handleKeydown(event: KeyboardEvent, section: AccordionSection) {
		if ((event.key === 'Enter' || event.key === ' ') && !disabled && !section.disabled) {
			event.preventDefault();
			toggleSection(section, (event.target as HTMLElement)?.closest('div') as HTMLElement);
		}
	}

	// Pre-computed static classes to avoid recalculation
	const containerClasses = $derived(`space-y-4 ${className}`);
	const baseSectionClasses = $derived(
		`overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${sectionClass}`
	);
	const baseHeaderClasses = $derived(
		`flex w-full items-center justify-between p-6 text-left transition-all duration-150 ease-out focus:outline-none ${headerClass}`
	);
	const baseContentClasses = $derived(
		`border-t border-gray-200 dark:border-gray-800 ${enableScroll ? 'overflow-y-auto' : ''} ${contentClass}`
	);

	// Optimized class functions - simplified without caching to avoid crashes
	function getHeaderClasses(section: AccordionSection) {
		let classes = baseHeaderClasses;
		if (disabled || section.disabled) {
			classes += ' cursor-not-allowed opacity-50';
		} else {
			classes +=
				' cursor-pointer hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-800/50 dark:focus:bg-gray-800/50 dark:active:bg-gray-800/75';
		}
		return classes;
	}
</script>

<div class={containerClasses}>
	{#each sections as section (section.id)}
		{@const isOpen = openSections.has(section.id)}

		<div class={baseSectionClasses}>
			<!-- Section Header -->
			<button
				type="button"
				class={getHeaderClasses(section)}
				disabled={disabled || section.disabled}
				onclick={(e) =>
					toggleSection(section, (e.target as HTMLElement)?.closest('div') || undefined)}
				onkeydown={(e) => handleKeydown(e, section)}
				aria-expanded={isOpen}
				aria-controls="accordion-content-{section.id}"
			>
				<div class="flex items-center space-x-3">
					{#if section.icon}
						<span class="text-xl">{section.icon}</span>
					{/if}
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
				</div>

				<!-- Optimized chevron icon with transform-gpu for hardware acceleration -->
				<svg
					class="h-5 w-5 transform-gpu text-gray-500 transition-transform duration-150 ease-out will-change-transform {isOpen
						? 'rotate-180'
						: 'rotate-0'}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<!-- Section Content with optimized transitions -->
			{#if isOpen}
				<div
					id="accordion-content-{section.id}"
					in:slide={animations.enabled
						? { duration: animationDuration, easing: quintOut }
						: { duration: 0 }}
					out:slide={animations.enabled
						? { duration: Math.floor(animationDuration * 0.85), easing: quintOut }
						: { duration: 0 }}
					class={baseContentClasses}
					style={enableScroll ? `max-height: ${maxHeight}` : ''}
				>
					<div class="p-6 pt-4">
						{#if children}
							<!-- Main content -->
							{@render children(section, isOpen)}
						{:else if section.content}
							<!-- Fallback to section content -->
							<p class="text-gray-700 dark:text-gray-300">{section.content}</p>
						{:else}
							<!-- Fallback content -->
							<p class="text-gray-500 dark:text-gray-400">No content available</p>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	/* Hardware acceleration for smooth animations */
	button {
		transform: translateZ(0);
		backface-visibility: hidden;
		perspective: 1000px;
	}

	/* Optimize text rendering during animations */
	button h3 {
		text-rendering: optimizeSpeed;
	}

	/* Reduce paint complexity during transitions */
	[id^='accordion-content-'] {
		contain: layout style paint;
	}
</style>
