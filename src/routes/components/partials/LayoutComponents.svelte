<script lang="ts">
	import {
		Button,
		Card,
		Accordion,
		Carousel,
		Window,
		ChromeDivider
	} from '$lib/components/partials';
	import { infoToast } from '$lib/utils';
	import { ThemeIcons } from '$lib/components/icons';
	import { Modal } from '$lib/components/main';

	let modalOpen = $state(false);
	let modalSize = $state<'sm' | 'md' | 'lg' | 'xl'>('md');

	// Enhanced carousel items with variety
	const enhancedCarouselItems = [
		{
			id: 1,
			title: 'Drag & Drop',
			description: 'Intuitive drag and drop file uploads with preview functionality.',
			icon: 'upload',
			color: 'blue'
		},
		{
			id: 2,
			title: 'Responsive Design',
			description: 'Components that adapt seamlessly to any screen size.',
			icon: 'desktop',
			color: 'green'
		},
		{
			id: 3,
			title: 'Dark Mode',
			description: 'Beautiful dark mode support across all components.',
			icon: 'moon',
			color: 'purple'
		},
		{
			id: 4,
			title: 'TypeScript',
			description: 'Full TypeScript support with proper type definitions.',
			icon: 'code',
			color: 'orange'
		},
		{
			id: 5,
			title: 'Animations',
			description: 'Smooth, performant animations and transitions.',
			icon: 'sparkles',
			color: 'yellow'
		},
		{
			id: 6,
			title: 'Accessibility',
			description: 'Built with accessibility in mind from the start.',
			icon: 'shield',
			color: 'red'
		}
	];

	// Comprehensive accordion sections with icons
	const enhancedAccordionSections = [
		{
			id: 'svelte-intro',
			title: 'What is Svelte?',
			icon: '💡',
			content:
				'Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.'
		},
		{
			id: 'ecosystem',
			title: 'Ecosystem',
			icon: '🌍',
			content:
				'Rich ecosystem with SvelteKit for full-stack applications, hundreds of components, and active community support.',
			disabled: true
		}
	];

	// Window boundary configurations
	const windowConfigs = [
		{
			title: 'Viewport Constrained',
			description: 'Constrained to browser viewport (excluding nav and footer).',
			boundary: 'viewport' as const,
			x: 50,
			y: 50,
			width: 400,
			height: 250
		},
		{
			title: 'Parent Constrained',
			description: 'Constrained to parent container (the dashed box).',
			boundary: 'parent' as const,
			x: 20,
			y: 40,
			width: 300,
			height: 200
		},
		{
			title: 'Manual Boundaries',
			description: 'Uses manually defined boundaries.',
			boundary: 'manual' as const,
			boundaries: { top: 100, right: 800, bottom: 500, left: 50 },
			x: 100,
			y: 100,
			width: 350,
			height: 220
		},
		{
			title: 'Custom Sized Window',
			description: 'Custom dimensions and styling.',
			boundary: 'viewport',
			x: 200,
			y: 200,
			width: 500,
			height: 300,
			resizable: true,
			draggable: true,
			minWidth: 300,
			minHeight: 200
		}
	];
</script>

<div class="space-y-8">
	<!-- Card Component -->
	<Card
		title="Card"
		subtitle="Flexible container component with various styles, padding, shadows, and interactive states."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<!-- Card Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Card Variants</h3>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card class="p-4" title="Default Card" subtitle="Basic styling">
					<p class="text-gray-600 dark:text-gray-400">Basic card with default styling.</p>
				</Card>

				<Card class="p-4 ring-1 ring-gray-200 dark:ring-gray-800" title="Outlined Card">
					<p class="text-gray-600 dark:text-gray-400">Card with outline border.</p>
				</Card>

				<Card class="p-4 shadow-lg" title="Elevated Card" subtitle="With shadow">
					<p class="text-gray-600 dark:text-gray-400">Card with shadow elevation.</p>
				</Card>
			</div>
		</div>

		<!-- Padding Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Padding Options</h3>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card padding="none" class="border" title="No Padding">
					<p class="px-4 py-2 text-gray-600 dark:text-gray-400">No padding</p>
				</Card>

				<Card padding="sm" class="border" title="Small Padding">
					<p class="text-gray-600 dark:text-gray-400">Small padding</p>
				</Card>

				<Card padding="md" class="border" title="Medium Padding">
					<p class="text-gray-600 dark:text-gray-400">Medium padding</p>
				</Card>

				<Card padding="xl" class="border" title="Extra Large Padding">
					<p class="text-gray-600 dark:text-gray-400">Extra large padding</p>
				</Card>
			</div>
		</div>

		<!-- Shadow Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Shadow Options</h3>
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card shadow="none" class="border p-4" title="No Shadow">
					<p class="text-gray-600 dark:text-gray-400">No shadow</p>
				</Card>

				<Card shadow="sm" class="p-4" title="Small Shadow">
					<p class="text-gray-600 dark:text-gray-400">Small shadow</p>
				</Card>

				<Card shadow="xl" class="p-4" title="Extra Large Shadow">
					<p class="text-gray-600 dark:text-gray-400">Extra large shadow</p>
				</Card>
			</div>
		</div>

		<!-- Interactive Cards -->
		<div>
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Interactive Cards</h3>
			<div class="grid gap-4 md:grid-cols-2">
				<Card hover={true} class="cursor-pointer p-4" onclick={() => infoToast('Card clicked!')}>
					<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Hover Effect</h3>
					<p class="text-gray-600 dark:text-gray-400">
						Card with hover animation and click handler.
					</p>
				</Card>

				<Card clickable={true} href="#" class="p-4" title="Link Card">
					<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
						Clickable Link
					</h3>
					<p class="text-gray-600 dark:text-gray-400">Card that acts as a link.</p>
				</Card>
			</div>
		</div>
	</Card>

	<!-- Modal Component -->
	<Card
		title="Modal"
		subtitle="Overlay dialogs for important user interactions with multiple size options."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<div class="space-y-6">
			<div>
				<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Modal Sizes</h3>
				<div class="flex flex-wrap gap-2">
					<Button
						onclick={() => {
							modalSize = 'sm';
							modalOpen = true;
						}}>Small Modal</Button
					>
					<Button
						onclick={() => {
							modalSize = 'md';
							modalOpen = true;
						}}>Medium Modal</Button
					>
					<Button
						onclick={() => {
							modalSize = 'lg';
							modalOpen = true;
						}}>Large Modal</Button
					>
					<Button
						onclick={() => {
							modalSize = 'xl';
							modalOpen = true;
						}}>Extra Large Modal</Button
					>
				</div>
			</div>
		</div>
	</Card>

	<!-- Accordion Component -->
	<Card
		title="Accordion"
		subtitle="Collapsible content sections with icons, animations, and configuration options."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<!-- Standard Accordion -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">
				Multiple Sections (Default)
			</h3>
			<Accordion sections={enhancedAccordionSections} multiple={true} animationDuration={200} />
		</div>
	</Card>

	<!-- Carousel Component -->
	<Card
		title="Carousel"
		subtitle="Image and content carousel with navigation, autoplay, and responsive layouts."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<!-- Multiple Items Visible -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">
				Multiple Items Visible
			</h3>
			<Carousel
				totalItems={enhancedCarouselItems.length}
				itemsVisible={3}
				showArrows={true}
				showDots={false}
				autoplay={false}
				class="mx-auto w-full max-w-4xl"
			>
				{#each enhancedCarouselItems as item (item.id)}
					<div class="carousel-item px-2">
						<Card class="p-6 text-center" hover={true}>
							<ThemeIcons
								name={item.icon}
								size="h-12 w-12"
								class={`mx-auto mb-3 text-${item.color}-500 dark:text-${item.color}-400`}
							/>
							<h4 class="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h4>
						</Card>
					</div>
				{/each}
			</Carousel>
		</div>

		<!-- Minimal Carousel -->
		<div>
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Minimal Carousel</h3>
			<Carousel
				totalItems={enhancedCarouselItems.length}
				itemsVisible={2}
				showArrows={false}
				showDots={true}
				autoplay={true}
				autoplayInterval={2000}
				class="mx-auto w-full max-w-3xl"
			>
				{#each enhancedCarouselItems as item (item.id)}
					<div class="carousel-item px-2">
						<Card class="border p-4" hover={true}>
							<div class="flex items-center space-x-3">
								<ThemeIcons
									name={item.icon}
									size="h-8 w-8"
									class={`text-${item.color}-500 dark:text-${item.color}-400`}
								/>
								<div>
									<h4 class="font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
								</div>
							</div>
						</Card>
					</div>
				{/each}
			</Carousel>
		</div>
	</Card>

	<!-- Window Component -->
	<Card
		title="Window"
		subtitle="Draggable, resizable window modal component with boundary constraints and customization options."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<div
			class="mb-6 block rounded-lg border border-blue-200 bg-blue-50 p-4 sm:hidden dark:border-blue-800 dark:bg-blue-950/30"
		>
			<p class="text-sm text-blue-700 dark:text-blue-300">
				<strong>Note:</strong> Window components are disabled on mobile devices (≤768px). Use on desktop/tablet
				only.
			</p>
		</div>

		<div class="space-y-8">
			<!-- Viewport Boundary (Default) -->
			<div>
				<h4 class="mb-3 hidden text-lg font-medium text-gray-900 sm:block dark:text-gray-100">
					Viewport Boundary (Default)
				</h4>
				<Window
					title={windowConfigs[0].title}
					width={windowConfigs[0].width}
					height={windowConfigs[0].height}
					x={windowConfigs[0].x}
					y={windowConfigs[0].y}
					open={true}
					boundary={'viewport' as const}
					resizable={true}
					draggable={true}
					minWidth={250}
					minHeight={150}
				>
					<div class="p-4">
						<p class="text-gray-600 dark:text-gray-400">{windowConfigs[0].description}</p>
					</div>
				</Window>
			</div>

			<!-- Parent Boundary -->
			<div
				class="relative hidden h-96 rounded-lg border-2 border-dashed border-gray-300 sm:block dark:border-gray-600"
			>
				<div class="absolute top-2 left-2 text-sm text-gray-500 dark:text-gray-400">
					Parent Boundary
				</div>
				<Window
					title={windowConfigs[1].title}
					width={windowConfigs[1].width}
					height={windowConfigs[1].height}
					x={windowConfigs[1].x}
					y={windowConfigs[1].y}
					open={true}
					boundary={'parent' as const}
					resizable={true}
					draggable={true}
				>
					<div class="p-4">
						<p class="text-gray-600 dark:text-gray-400">{windowConfigs[1].description}</p>
					</div>
				</Window>
			</div>

			<!-- Manual Boundary -->
			<div>
				<Window
					title={windowConfigs[2].title}
					width={windowConfigs[2].width}
					height={windowConfigs[2].height}
					x={windowConfigs[2].x}
					y={windowConfigs[2].y}
					open={true}
					boundary={'manual' as const}
					boundaries={windowConfigs[2].boundaries}
					resizable={true}
					draggable={true}
				>
					<div class="p-4">
						<p class="text-gray-600 dark:text-gray-400">{windowConfigs[2].description}</p>
					</div>
				</Window>
			</div>

			<!-- Disabled Window -->
			<div>
				<Window
					title="Disabled Window"
					width={300}
					height={200}
					x={600}
					y={300}
					open={true}
					resizable={false}
					draggable={false}
					closable={false}
				>
					<div class="p-4">
						<p class="text-gray-600 dark:text-gray-400">
							This window has drag, resize, and close disabled.
						</p>
					</div>
				</Window>
			</div>
		</div>
	</Card>

	<!-- ChromeDivider Component -->
	<Card
		title="ChromeDivider"
		subtitle="Browser-style divider components with shimmer and flow animations."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<div class="space-y-8">
			<!-- Variants -->
			<div>
				<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Variants</h3>
				<div class="space-y-6">
					<div class="space-y-2">
						<p class="text-sm text-gray-600 dark:text-gray-400">Content above Chrome Divider</p>
						<ChromeDivider variant="chrome" />
						<p class="text-sm text-gray-600 dark:text-gray-400">Content below Chrome Divider</p>
					</div>

					<div class="space-y-2">
						<p class="text-sm text-gray-600 dark:text-gray-400">Content above Gradient Divider</p>
						<ChromeDivider variant="gradient" />
						<p class="text-sm text-gray-600 dark:text-gray-400">Content below Gradient Divider</p>
					</div>
				</div>
			</div>

			<!-- Heights -->
			<div>
				<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Height Options</h3>
				<div class="space-y-6">
					<div class="space-y-2">
						<p class="text-sm text-gray-600 dark:text-gray-400">Small Height (1px)</p>
						<ChromeDivider variant="chrome" height="sm" />
						<p class="text-sm text-gray-600 dark:text-gray-400">Content below</p>
					</div>

					<div class="space-y-2">
						<p class="text-sm text-gray-600 dark:text-gray-400">Medium Height (2px - Default)</p>
						<ChromeDivider variant="chrome" height="md" />
						<p class="text-sm text-gray-600 dark:text-gray-400">Content below</p>
					</div>

					<div class="space-y-2">
						<p class="text-sm text-gray-600 dark:text-gray-400">Large Height (4px)</p>
						<ChromeDivider variant="chrome" height="lg" />
						<p class="text-sm text-gray-600 dark:text-gray-400">Content below</p>
					</div>
				</div>
			</div>

			<!-- Animation Control -->
			<div>
				<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Animation Control</h3>
				<div class="space-y-6">
					<div class="space-y-2">
						<p class="text-sm text-gray-600 dark:text-gray-400">Animated (Default)</p>
						<ChromeDivider variant="chrome" animated={true} />
						<p class="text-sm text-gray-600 dark:text-gray-400">Content below</p>
					</div>

					<div class="space-y-2">
						<p class="text-sm text-gray-600 dark:text-gray-400">Not Animated</p>
						<ChromeDivider variant="chrome" animated={false} />
						<p class="text-sm text-gray-600 dark:text-gray-400">Content below</p>
					</div>
				</div>
			</div>
		</div>
	</Card>
</div>

<Modal
	open={modalOpen}
	size={modalSize}
	title="Component Information"
	onclose={() => (modalOpen = false)}
>
	<div class="space-y-4">
		<p class="text-gray-600 dark:text-gray-400">
			This modal demonstrates the different size options available for our Modal component.
		</p>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
				<h4 class="mb-2 font-medium text-gray-900 dark:text-gray-100">Available Sizes:</h4>
				<ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
					<li>• Small (sm) - Compact dialogs</li>
					<li>• Medium (md) - Standard dialogs</li>
					<li>• Large (lg) - Detailed content</li>
					<li>• Extra Large (xl) - Complex layouts</li>
				</ul>
			</div>
			<div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
				<h4 class="mb-2 font-medium text-gray-900 dark:text-gray-100">Features:</h4>
				<ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
					<li>• Responsive design</li>
					<li>• Keyboard navigation</li>
					<li>• Customizable content</li>
					<li>• Smooth animations</li>
				</ul>
			</div>
		</div>
	</div>

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="outline" onclick={() => (modalOpen = false)}>Close</Button>
			<Button onclick={() => (modalOpen = false)}>Got it</Button>
		</div>
	{/snippet}
</Modal>
