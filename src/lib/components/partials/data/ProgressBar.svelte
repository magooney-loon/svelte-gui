<script lang="ts">
	let {
		value = 0,
		max = 100,
		label,
		showPercentage = true,
		color = 'blue',
		size = 'md',
		animated = true,
		striped = false,
		autoColor = false,
		class: className = ''
	}: {
		value?: number;
		max?: number;
		label?: string;
		showPercentage?: boolean;
		color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'orange';
		size?: 'sm' | 'md' | 'lg';
		animated?: boolean;
		striped?: boolean;
		autoColor?: boolean;
		class?: string;
	} = $props();

	let percentage = $derived.by(() => {
		// Validate inputs to prevent NaN values
		const safeValue = isNaN(value) || !isFinite(value) ? 0 : value;
		const safeMax = isNaN(max) || !isFinite(max) || max <= 0 ? 100 : max;

		const calculated = (safeValue / safeMax) * 100;

		// Ensure the result is a valid number within bounds
		if (isNaN(calculated) || !isFinite(calculated)) {
			return 0;
		}

		return Math.min(Math.max(calculated, 0), 100);
	});

	// Auto color logic based on percentage
	let dynamicColor = $derived.by(() => {
		if (!autoColor) return color;

		if (percentage <= 25) return 'red';
		if (percentage <= 45) return 'orange';
		if (percentage <= 75) return 'yellow';
		return 'green';
	});

	const sizeStyles = {
		sm: 'h-1',
		md: 'h-1.5',
		lg: 'h-2'
	};

	const colorStyles = {
		blue: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
		green: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
		yellow: 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
		red: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]',
		orange: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]',
		gray: 'bg-gray-500 shadow-[0_0_10px_rgba(107,114,128,0.5)]'
	};

	const backgroundStyles =
		'bg-gray-200/80 backdrop-blur-sm border border-gray-300/50 dark:bg-gray-800/30 dark:border-gray-700/50';

	const animationStyles = animated ? 'transition-all duration-500 ease-out' : '';

	const stripedStyles = striped ? 'striped-progress' : '';

	let barClasses = $derived(
		`${sizeStyles[size]} ${colorStyles[dynamicColor]} ${animationStyles} ${stripedStyles} rounded-full relative overflow-hidden`
	);

	let containerClasses = $derived(
		`relative w-full ${sizeStyles[size]} ${backgroundStyles} rounded-full overflow-hidden shadow-inner`
	);

	let nativeProgressClasses = $derived(
		`absolute inset-0 w-full h-full opacity-0 pointer-events-none`
	);
</script>

<div class="space-y-3 {className}">
	{#if label || showPercentage}
		<div class="flex items-center justify-between text-sm">
			{#if label}
				<span class="text-xs font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300"
					>{label}</span
				>
			{/if}
			{#if showPercentage}
				<span
					class="rounded border border-gray-300/50 bg-gray-100/80 px-2 py-0.5 font-mono text-xs text-gray-600 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-400"
				>
					{Math.round(percentage)}%
				</span>
			{/if}
		</div>
	{/if}

	<div class={containerClasses}>
		<!-- Native progress element for semantics and accessibility (invisible) -->
		<progress
			class={nativeProgressClasses}
			{value}
			{max}
			aria-label={label || `Progress: ${Math.round(percentage)}%`}
		>
			{Math.round(percentage)}%
		</progress>

		<!-- Custom animated progress bar (visible) -->
		<div
			class={barClasses}
			style="width: {percentage}%; {animated && !striped
				? 'transition: width 500ms ease-out;'
				: ''}"
			role="presentation"
		>
			{#if !striped}
				<!-- Futuristic glow effect (only when not striped) -->
				<div
					class="absolute inset-0 bg-linear-to-r from-transparent via-black/10 to-transparent opacity-40 dark:via-white/20 dark:opacity-60"
				></div>
				{#if animated}
					<!-- Shimmer animation for non-striped animated bars -->
					<div class="shimmer-effect absolute inset-0 opacity-40"></div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.striped-progress {
		background-image: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 10px,
			rgba(0, 0, 0, 0.15) 10px,
			rgba(0, 0, 0, 0.15) 20px
		);
		animation: stripe-move 1.5s linear infinite;
	}

	/* Dark mode stripes */
	:global([data-theme='dark']) .striped-progress {
		background-image: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 10px,
			rgba(255, 255, 255, 0.3) 10px,
			rgba(255, 255, 255, 0.3) 20px
		);
	}

	.shimmer-effect {
		background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
		background-size: 200% 100%;
		animation: shimmer 2s ease-in-out infinite;
	}

	/* Dark mode shimmer */
	:global([data-theme='dark']) .shimmer-effect {
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.4) 50%,
			transparent 100%
		);
	}

	@keyframes stripe-move {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 28px 0;
		}
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
</style>
