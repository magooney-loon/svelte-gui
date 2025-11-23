<script lang="ts">
	import {
		Button,
		Card,
		MetricCard,
		ChromeDivider,
		StatusBadge,
		DataTable,
		Carousel
	} from '$lib/components/partials';
	import { NavigationIcons, ThemeIcons, StatusIcons, AccountIcons } from '$lib/components/icons';
	import {
		staggeredAnimation,
		singleElementAnimation,
		staggerPresets,
		APP_NAME,
		safeResolve
	} from '$lib/utils';
	import {
		technicalFeatures,
		frameworkFeatures,
		heroData,
		featurePreviewCards,
		frameworkColumns,
		stackOverview,
		gettingStartedCards,
		sectionTitles,
		carouselConfig,
		animationConfigs,
		dataTableConfig,
		checkIconConfig,
		stackFooterText
	} from '$lib/landing';

	// Transform frameworkFeatures for DataTable
	const frameworkFeaturesList = frameworkFeatures.flatMap((feature) =>
		feature.items.map((item) => ({
			id: `${feature.title}-${item.text}`,
			feature: item.text,
			category: feature.title,
			status: 'Available',
			color: item.color
		}))
	);

	// Get icon components dynamically
	const getIconComponent = (iconLibrary: string) => {
		switch (iconLibrary) {
			case 'NavigationIcons':
				return NavigationIcons;
			case 'ThemeIcons':
				return ThemeIcons;
			case 'StatusIcons':
				return StatusIcons;
			case 'AccountIcons':
				return AccountIcons;
			default:
				return NavigationIcons;
		}
	};

	// Get animation presets safely
	const getAnimationPreset = (presetName: string) => {
		const preset = staggerPresets[presetName as keyof typeof staggerPresets];
		return preset ? preset() : staggerPresets.fadeInUp();
	};
</script>

<!-- Hero Section -->
<section class="relative text-center">
	<div
		class="mx-auto max-w-4xl"
		use:staggeredAnimation={getAnimationPreset(animationConfigs.heroSection.preset)}
	>
		<img src="/favicon.png" alt="Svelte GUI Logo" class="mx-auto h-20 w-20" />
		<h1
			class="flex items-center justify-center gap-2 text-5xl font-bold text-black dark:text-white"
		>
			{APP_NAME}
		</h1>

		<h2 class="mt-2 mb-8 text-lg font-light text-gray-600 italic dark:text-blue-200">
			{heroData.subtitle}
		</h2>

		<!-- Hero CTA -->
		<div class="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
			{#each heroData.buttons as button (button.id)}
				{@const IconComponent = getIconComponent(button.iconLibrary)}
				<Button
					variant={button.variant}
					size={button.size}
					href={safeResolve(button.href)}
					class={button.variant === 'primary' ? 'relative overflow-hidden' : ''}
				>
					<IconComponent name={button.icon} class="mr-2 h-5 w-5" />
					{button.text}
				</Button>
			{/each}
		</div>

		<!-- Feature Preview Cards -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each featurePreviewCards as card (card.id)}
				{@const IconComponent = getIconComponent(card.iconLibrary)}
				<Card padding="lg" hover={true}>
					<div class="text-center">
						<div
							class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full {card.bgColor}"
						>
							<IconComponent name={card.icon} size="h-6 w-6" class={card.iconColor} />
						</div>
						<h3 class="mb-2 font-semibold text-gray-900 dark:text-gray-100">{card.title}</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Technical Features -->
<section
	class="py-16"
	use:singleElementAnimation={getAnimationPreset(animationConfigs.technicalFeatures.preset)}
>
	<div class="mx-auto max-w-6xl">
		<h3 class="mb-12 text-center text-3xl font-bold text-black dark:text-white">
			{sectionTitles.whatIncluded}
		</h3>
		<div class="flex justify-center">
			<Carousel
				showArrows={carouselConfig.showArrows}
				showDots={carouselConfig.showDots}
				autoplay={carouselConfig.autoplay}
				autoplayInterval={carouselConfig.autoplayInterval}
				totalItems={technicalFeatures.length}
				itemsVisible={carouselConfig.itemsVisible}
				class="w-full"
			>
				{#each technicalFeatures as feature (feature.title)}
					<div class="carousel-item">
						<Card
							title={feature.title}
							padding="md"
							shadow="sm"
							hover={true}
							class="h-full text-center"
						>
							<div class="space-y-4">
								<p class="text-gray-600 dark:text-gray-400">{feature.description}</p>
								<StatusBadge
									status={feature.status}
									variant={feature.status === 'Implemented'
										? 'success'
										: feature.status === 'Beta Ready'
											? 'warning'
											: 'info'}
									size="sm"
									class="mx-auto"
								/>
							</div>
						</Card>
					</div>
				{/each}
			</Carousel>
		</div>
	</div>
</section>

<ChromeDivider variant="chrome" animated={false} />

<!-- Framework Features -->
<section use:singleElementAnimation={getAnimationPreset(animationConfigs.frameworkFeatures.preset)}>
	<div class="mx-auto max-w-6xl">
		<h3 class="my-12 text-center text-3xl font-bold text-black dark:text-white">
			{sectionTitles.fullStackShell}
		</h3>
		<div
			class="mb-12 text-center"
			use:staggeredAnimation={getAnimationPreset(animationConfigs.frameworkDescription.preset)}
		>
			<p class="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
				{sectionTitles.fullStackDescription}
			</p>
		</div>

		<div class="flex justify-center">
			<div
				class="w-full max-w-5xl overflow-x-auto"
				use:staggeredAnimation={{
					...getAnimationPreset(animationConfigs.frameworkTable.preset),
					selector: animationConfigs.frameworkTable.selector,
					staggerDelay: animationConfigs.frameworkTable.staggerDelay
				}}
			>
				<div class="min-w-[600px]">
					<DataTable
						data={frameworkFeaturesList}
						columns={frameworkColumns}
						striped={dataTableConfig.striped}
						hoverable={dataTableConfig.hoverable}
						emptyState={dataTableConfig.emptyState}
						compact={dataTableConfig.compact}
					>
						{#snippet children(item)}
							<td
								class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
								style="vertical-align: middle;"
							>
								<div class="flex items-center justify-start">
									<div class="flex items-center gap-2">
										<div class="h-2 w-2 shrink-0 rounded-full {item.color}"></div>
										<span class="truncate font-medium">{item.feature}</span>
									</div>
								</div>
							</td>
							<td
								class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
								style="vertical-align: middle;"
							>
								<div class="flex items-center justify-center">
									<span class="truncate text-xs text-gray-600 sm:text-sm dark:text-gray-400"
										>{item.category}</span
									>
								</div>
							</td>
							<td
								class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
								style="vertical-align: middle;"
							>
								<div class="flex items-center justify-end">
									<StatusBadge status={item.status} variant="success" size="xs" />
								</div>
							</td>
						{/snippet}
					</DataTable>
				</div>
			</div>
		</div>

		<!-- Stack Overview -->
		<div class="mt-12">
			<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
				{#each stackOverview as stack (stack.id)}
					<MetricCard title={stack.title} value={stack.value} color={stack.color} size="sm">
						{#snippet iconSnippet()}
							<img src={stack.imageUrl} alt={stack.alt} class="h-5 w-5" />
						{/snippet}
					</MetricCard>
				{/each}
			</div>
			<div class="mt-3 text-center">
				<div class="mb-2 text-xs text-gray-400">
					{stackFooterText}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Getting Started -->
<section
	class="py-16"
	use:singleElementAnimation={getAnimationPreset(animationConfigs.gettingStarted.preset)}
>
	<div class="mx-auto max-w-6xl">
		<h3
			use:staggeredAnimation={getAnimationPreset(animationConfigs.gettingStartedTitle.preset)}
			class="mb-8 text-center text-3xl font-bold text-black dark:text-white"
		>
			{sectionTitles.getStarted}
		</h3>

		<div
			class="grid grid-cols-1 gap-8 md:grid-cols-2"
			use:staggeredAnimation={getAnimationPreset(animationConfigs.gettingStartedCards.preset)}
		>
			{#each gettingStartedCards as card (card.id)}
				{@const ButtonIconComponent = getIconComponent(card.button.iconLibrary)}
				<Card padding="xl" shadow="lg" class="edge-wrapper text-center">
					<div class="space-y-6">
						<div class="text-center">
							<div class="mb-4 text-4xl">{card.emoji}</div>
							<h4 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{card.title}</h4>
						</div>
						<div class="space-y-4">
							<ul class="mb-6 space-y-3 text-left">
								{#each card.steps as step (step.id)}
									{@const StepIconComponent = getIconComponent(step.iconLibrary)}
									<li class="flex items-center text-sm text-gray-600 dark:text-gray-400">
										<div
											class="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full {checkIconConfig.bgColor}"
										>
											<StepIconComponent
												name={step.icon}
												size={checkIconConfig.size}
												class={checkIconConfig.iconColor}
											/>
										</div>
										{step.text}
									</li>
								{/each}
							</ul>
						</div>
						<div class="pt-4">
							<Button
								variant={card.button.variant}
								color={card.button.color}
								size="lg"
								fullWidth={true}
								href={card.button.href}
								target={card.button.target}
							>
								<ButtonIconComponent name={card.button.icon} class="mr-2 h-3 w-3" />
								{card.button.text}
							</Button>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</section>
