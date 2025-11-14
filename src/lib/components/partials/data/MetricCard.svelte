<script lang="ts">
	let {
		title,
		value,
		icon,
		iconSnippet,
		color = 'default',
		size = 'md',
		href,
		onclick,
		class: className = ''
	}: {
		title: string;
		value: string | number;
		icon?: string;
		iconSnippet?: import('svelte').Snippet;
		color?: 'default' | 'blue' | 'green' | 'red' | 'yellow' | 'purple';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		onclick?: () => void;
		class?: string;
	} = $props();

	const colorVariants = {
		default: {
			value: 'text-gray-900 dark:text-gray-100',
			icon: 'text-gray-600 dark:text-gray-400',
			iconBg: 'bg-white/50 dark:bg-gray-800/50',
			bgGradient: 'from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/80',
			borderColor: 'border-gray-200/50 dark:border-gray-700/50'
		},
		blue: {
			value: 'text-blue-700 dark:text-blue-300',
			icon: 'text-blue-600 dark:text-blue-400',
			iconBg: 'bg-blue-50/80 dark:bg-blue-950/50',
			bgGradient: 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/40',
			borderColor: 'border-blue-200/50 dark:border-blue-800/50'
		},
		green: {
			value: 'text-emerald-700 dark:text-emerald-300',
			icon: 'text-emerald-600 dark:text-emerald-400',
			iconBg: 'bg-emerald-50/80 dark:bg-emerald-950/50',
			bgGradient:
				'from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/40',
			borderColor: 'border-emerald-200/50 dark:border-emerald-800/50'
		},
		red: {
			value: 'text-red-700 dark:text-red-300',
			icon: 'text-red-600 dark:text-red-400',
			iconBg: 'bg-red-50/80 dark:bg-red-950/50',
			bgGradient: 'from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/40',
			borderColor: 'border-red-200/50 dark:border-red-800/50'
		},
		yellow: {
			value: 'text-amber-700 dark:text-amber-300',
			icon: 'text-amber-600 dark:text-amber-400',
			iconBg: 'bg-amber-50/80 dark:bg-amber-950/50',
			bgGradient: 'from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/40',
			borderColor: 'border-amber-200/50 dark:border-amber-800/50'
		},
		purple: {
			value: 'text-violet-700 dark:text-violet-300',
			icon: 'text-violet-600 dark:text-violet-400',
			iconBg: 'bg-violet-50/80 dark:bg-violet-950/50',
			bgGradient: 'from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/40',
			borderColor: 'border-violet-200/50 dark:border-violet-800/50'
		}
	};

	const sizeVariants = {
		sm: {
			padding: 'p-4',
			iconSize: 'text-lg',
			valueSize: 'text-base',
			titleSize: 'text-xs',
			spacing: 'ml-3',
			iconPadding: 'p-2'
		},
		md: {
			padding: 'p-5',
			iconSize: 'text-2xl',
			valueSize: 'text-lg',
			titleSize: 'text-sm',
			spacing: 'ml-4',
			iconPadding: 'p-2.5'
		},
		lg: {
			padding: 'p-6',
			iconSize: 'text-3xl',
			valueSize: 'text-xl',
			titleSize: 'text-sm',
			spacing: 'ml-5',
			iconPadding: 'p-3'
		}
	};

	let colors = $derived(colorVariants[color]);
	let sizes = $derived(sizeVariants[size]);
	let isClickable = $derived(!!(href || onclick));

	let cardClasses = $derived(
		`relative overflow-hidden rounded-xl shadow-md bg-gradient-to-br ${colors.bgGradient} border ${colors.borderColor} transition-all duration-200 ease-out ${isClickable ? 'hover:-translate-y-0.5 cursor-pointer group' : ''} ${className}`
	);

	function handleClick() {
		if (onclick) {
			onclick();
		}
	}
</script>

{#if href}
	<a {href} class={cardClasses}>
		<!-- Main content -->
		<div class="relative z-10 {sizes.padding}">
			<div class="flex items-center">
				{#if icon || iconSnippet}
					<div class="shrink-0">
						<div
							class="rounded-lg {colors.iconBg} {sizes.iconPadding} border border-white/20 dark:border-gray-700/20"
						>
							<span
								class="{sizes.iconSize} {colors.icon} transition-transform duration-150 group-hover:scale-110"
							>
								{#if iconSnippet}
									{@render iconSnippet()}
								{:else}
									{icon}
								{/if}
							</span>
						</div>
					</div>
				{/if}
				<div class="{icon || iconSnippet ? sizes.spacing : ''} w-0 flex-1">
					<dl>
						<dt
							class="truncate {sizes.titleSize} font-medium tracking-tight text-gray-600 transition-colors duration-150 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
						>
							{title}
						</dt>
						<dd
							class="{sizes.valueSize} font-bold tracking-tight {colors.value} origin-left transition-transform duration-150 group-hover:scale-105"
						>
							{value}
						</dd>
					</dl>
				</div>
			</div>
		</div>
	</a>
{:else}
	<div
		class={cardClasses}
		onclick={isClickable ? handleClick : undefined}
		role={isClickable ? 'button' : undefined}
		{...isClickable ? { tabindex: 0 } : {}}
	>
		<!-- Main content -->
		<div class="relative z-10 {sizes.padding}">
			<div class="flex items-center">
				{#if icon || iconSnippet}
					<div class="shrink-0">
						<div
							class="rounded-lg {colors.iconBg} {sizes.iconPadding} border border-white/20 dark:border-gray-700/20"
						>
							<span
								class="{sizes.iconSize} {colors.icon} transition-transform duration-150 group-hover:scale-110"
							>
								{#if iconSnippet}
									{@render iconSnippet()}
								{:else}
									{icon}
								{/if}
							</span>
						</div>
					</div>
				{/if}
				<div class="{icon || iconSnippet ? sizes.spacing : ''} w-0 flex-1">
					<dl>
						<dt
							class="truncate {sizes.titleSize} font-medium tracking-tight text-gray-600 transition-colors duration-150 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
						>
							{title}
						</dt>
						<dd
							class="{sizes.valueSize} font-bold tracking-tight {colors.value} origin-left transition-transform duration-150 group-hover:scale-105"
						>
							{value}
						</dd>
					</dl>
				</div>
			</div>
		</div>
	</div>
{/if}
