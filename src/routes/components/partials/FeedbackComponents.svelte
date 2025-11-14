<script lang="ts">
	import {
		Button,
		Card,
		LoadingSpinner,
		EmptyState,
		StatusBadge,
		WarningBanner
	} from '$lib/components/partials';

	export let showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;

	// Different empty state configurations
	const emptyStates = [
		{
			title: 'No Data Found',
			description: 'There are no items to display at the moment.',
			primaryAction: {
				text: 'Add First Item',
				onclick: () => showToast('Add item clicked!', 'info')
			}
		},
		{
			title: 'Search Results',
			description: 'No results found for your search query.',
			secondaryText: 'Try adjusting your filters or search terms'
		},
		{
			title: 'Network Error',
			description: 'Unable to connect to the server.',
			primaryAction: {
				text: 'Retry Connection',
				variant: 'primary' as const,
				color: 'blue' as const,
				onclick: () => showToast('Retrying connection...', 'info')
			},
			secondaryText: 'Please check your internet connection'
		}
	];
</script>

<div class="space-y-8">
	<!-- Toast Notifications -->
	<Card
		title="Toast Notifications"
		subtitle="Global toast notification system with auto-dismiss and different types."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<div class="space-y-4">
			<h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Basic Toasts</h3>
			<div class="flex flex-wrap gap-2">
				<Button onclick={() => showToast('Success message!', 'success')}>Success Toast</Button>
				<Button onclick={() => showToast('Error occurred!', 'error')}>Error Toast</Button>
				<Button onclick={() => showToast('Warning message', 'warning')}>Warning Toast</Button>
				<Button onclick={() => showToast('Info notification', 'info')}>Info Toast</Button>
			</div>
		</div>
	</Card>

	<!-- LoadingSpinner Component -->
	<Card
		title="LoadingSpinner"
		subtitle="Animated loading spinner with various sizes, colors, and text options."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<!-- Size Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Size Variants</h3>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<div class="text-center">
					<LoadingSpinner text="Small" size="sm" centered={false} />
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Small (24px)</p>
				</div>
				<div class="text-center">
					<LoadingSpinner text="Medium" size="md" centered={false} />
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Medium (32px)</p>
				</div>
				<div class="text-center">
					<LoadingSpinner text="Large" size="lg" centered={false} />
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Large (40px)</p>
				</div>
				<div class="text-center">
					<LoadingSpinner text="Default" centered={false} />
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Default (md)</p>
				</div>
			</div>
		</div>

		<!-- Color Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Color Variants</h3>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
				<div class="text-center">
					<LoadingSpinner text="Blue" color="blue" centered={false} />
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Blue</p>
				</div>
				<div class="text-center">
					<LoadingSpinner text="Green" color="green" centered={false} />
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Green</p>
				</div>
				<div class="text-center">
					<LoadingSpinner text="Red" color="red" centered={false} />
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Red</p>
				</div>
				<div class="text-center">
					<LoadingSpinner text="Yellow" color="yellow" centered={false} />
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Yellow</p>
				</div>
				<div class="text-center">
					<LoadingSpinner text="Gray" color="gray" centered={false} />
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Gray</p>
				</div>
			</div>
		</div>
	</Card>

	<!-- EmptyState Component -->
	<Card
		title="EmptyState"
		subtitle="Consistent empty state displays with customizable icons, actions, and text."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<!-- Size Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Size Variants</h3>
			<div class="grid gap-6 md:grid-cols-3">
				<div>
					<EmptyState
						icon="📦"
						title="Small Empty State"
						description="This is a small empty state."
						size="sm"
					/>
				</div>
				<div>
					<EmptyState
						icon="📋"
						title="Medium Empty State"
						description="This is a medium empty state with more text content."
						size="md"
					/>
				</div>
				<div>
					<EmptyState
						icon="🎯"
						title="Large Empty State"
						description="This is a large empty state with even more text content to showcase the larger size and spacing."
						size="lg"
					/>
				</div>
			</div>
		</div>

		<!-- Different Configurations -->
		<div>
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">
				Different Configurations
			</h3>
			<div class="grid gap-6 md:grid-cols-1">
				<div class="space-y-4">
					{#each emptyStates as state, index (index)}
						<Card class="border p-4">
							<EmptyState
								icon={index === 2 ? '🔌' : undefined}
								title={state.title}
								description={state.description}
								primaryAction={state.primaryAction}
								secondaryText={state.secondaryText}
								size="md"
							/>
						</Card>
					{/each}
				</div>
			</div>
		</div>
	</Card>

	<!-- StatusBadge Component -->
	<Card
		title="StatusBadge"
		subtitle="Visual status indicators with various variants, sizes, and customization options."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<!-- Status Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Status Variants</h3>
			<div class="space-y-4">
				<div class="flex flex-wrap gap-2">
					<StatusBadge status="Success" variant="success" />
					<StatusBadge status="Completed" variant="success" />
					<StatusBadge status="Verified" variant="success" />
				</div>
				<div class="flex flex-wrap gap-2">
					<StatusBadge status="Warning" variant="warning" />
					<StatusBadge status="Pending" variant="warning" />
					<StatusBadge status="Review" variant="warning" />
				</div>
				<div class="flex flex-wrap gap-2">
					<StatusBadge status="Error" variant="error" />
					<StatusBadge status="Failed" variant="error" />
					<StatusBadge status="Critical" variant="error" />
				</div>
				<div class="flex flex-wrap gap-2">
					<StatusBadge status="Info" variant="info" />
					<StatusBadge status="New" variant="info" />
					<StatusBadge status="Updated" variant="info" />
				</div>
				<div class="flex flex-wrap gap-2">
					<StatusBadge status="Active" variant="update" />
					<StatusBadge status="In Progress" variant="update" />
					<StatusBadge status="Processing" variant="update" />
				</div>
				<div class="flex flex-wrap gap-2">
					<StatusBadge status="Inactive" variant="gray" />
					<StatusBadge status="Archived" variant="gray" />
					<StatusBadge status="Disabled" variant="gray" />
				</div>
			</div>
		</div>

		<!-- Size Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Size Variants</h3>
			<div class="space-y-4">
				<div class="flex flex-wrap items-center gap-2">
					<StatusBadge status="Small" variant="success" size="xs" />
					<StatusBadge status="Small" variant="success" size="sm" />
					<StatusBadge status="Medium" variant="success" size="md" />
					<StatusBadge status="Large" variant="success" size="lg" />
				</div>
			</div>
		</div>

		<!-- With Dots -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">With Status Dots</h3>
			<div class="flex flex-wrap gap-2">
				<StatusBadge status="With Dot" variant="success" dot={true} />
				<StatusBadge status="With Dot" variant="warning" dot={true} />
				<StatusBadge status="With Dot" variant="error" dot={true} />
				<StatusBadge status="With Dot" variant="info" dot={true} />
				<StatusBadge status="With Dot" variant="gray" dot={true} />
			</div>
		</div>

		<!-- Border Variations -->
		<div>
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Border Variations</h3>
			<div class="space-y-4">
				<div class="flex flex-wrap gap-2">
					<StatusBadge status="Rounded" variant="success" rounded={true} />
					<StatusBadge status="Square" variant="success" rounded={false} />
					<StatusBadge status="Custom Class" variant="success" class="border-2 border-blue-300" />
				</div>
			</div>
		</div>
	</Card>

	<!-- WarningBanner Component -->
	<Card
		title="WarningBanner"
		subtitle="Attention-grabbing banner components with different colors and dismissible options."
		expandable={true}
		defaultExpanded={false}
		class="p-6"
	>
		<!-- Color Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Color Variants</h3>
			<div class="space-y-4">
				<WarningBanner
					color="yellow"
					message="This is a warning message that requires your attention."
				/>
				<WarningBanner color="blue" message="This is an informational message for context." />
				<WarningBanner
					color="red"
					message="This is an error message that needs immediate action."
				/>
				<WarningBanner color="green" message="This is a success message confirming an action." />
				<WarningBanner color="gray" message="This is a neutral message for general information." />
			</div>
		</div>

		<!-- Size Variants -->
		<div class="mb-8">
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Size Variants</h3>
			<div class="space-y-4">
				<WarningBanner
					size="xs"
					color="blue"
					message="This is an extra small banner for compact spaces."
				/>
				<WarningBanner
					size="sm"
					color="yellow"
					message="This is a small banner with slightly more padding."
				/>
			</div>
		</div>

		<!-- Dismissible Options -->
		<div>
			<h3 class="mb-3 text-lg font-medium text-gray-900 dark:text-gray-100">Dismissible Options</h3>
			<div class="space-y-4">
				<WarningBanner
					dismissible={true}
					color="blue"
					message="This banner can be dismissed by clicking the X button."
				/>
				<WarningBanner
					dismissible={false}
					color="red"
					message="This banner cannot be dismissed and requires action."
				/>
				<WarningBanner
					dismissible={true}
					delay={500}
					color="yellow"
					message="This banner appears with a 500ms delay."
				/>
			</div>
		</div>
	</Card>
</div>

<style>
	/* Custom styles for demonstration */
	:global(.custom-spinner) {
		--spinner-color: #8b5cf6;
	}
</style>
