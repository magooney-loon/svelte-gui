<script lang="ts">
	import { Card, FormField, Button } from '$lib/components/partials';
	import type { SettingsData } from '$lib/components/main';

	let {
		settings,
		loading = false,
		saving = false,
		onSave
	}: {
		settings: SettingsData | null;
		loading?: boolean;
		saving?: boolean;
		onSave?: (data: { animationsEnabled: boolean; mouseEffectsEnabled: boolean }) => void;
	} = $props();

	let formData = $state({
		animationsEnabled: true,
		mouseEffectsEnabled: true
	});

	// Update form data when settings change
	$effect(() => {
		if (settings) {
			formData = {
				animationsEnabled: settings.ui.animationsEnabled,
				mouseEffectsEnabled: settings.ui.mouseEffectsEnabled
			};
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		onSave?.({
			animationsEnabled: formData.animationsEnabled,
			mouseEffectsEnabled: formData.mouseEffectsEnabled
		});
	}
</script>

<form onsubmit={handleSubmit} class="space-y-8">
	<!-- UI Settings Card -->
	<Card
		title="User Interface Settings"
		subtitle="Configure visual preferences and animations"
		class="space-y-6"
	>
		<div class="space-y-6">
			<FormField
				id="animations-enabled"
				label="Enable UI Animations"
				type="checkbox"
				bind:checked={formData.animationsEnabled}
				helperText="Enable GPU transitions & animations"
			/>

			<FormField
				id="mouse-effects-enabled"
				label="Enable Mouse Effects"
				type="checkbox"
				bind:checked={formData.mouseEffectsEnabled}
				helperText="Enable mouse trail & click ripple FX"
			/>
		</div>
	</Card>

	<!-- Save Button Section -->
	<Card padding="lg" class="border-2 border-dashed border-gray-200 dark:border-gray-700">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h3 class="text-sm font-medium text-gray-900 xl:text-lg dark:text-gray-100">
					Save Configuration
				</h3>
				<p class="text-xs text-gray-600 xl:text-sm dark:text-gray-400">
					Apply your changes to update
				</p>
			</div>
			<Button
				type="submit"
				loading={saving}
				disabled={saving || loading}
				color="blue"
				variant="outline"
				size="lg"
				class="w-full sm:w-auto"
			>
				{saving ? 'Saving...' : 'Save Settings'}
			</Button>
		</div>
	</Card>
</form>
