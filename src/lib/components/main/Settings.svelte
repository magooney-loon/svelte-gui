<script lang="ts">
	import { onMount } from 'svelte';
	import { settingsService, type SettingsData, updateUISettings } from './Settings.js';
	import { LoadingSpinner, SettingsForm } from '$lib/components/partials';
	import { toast } from '$lib/utils';

	let settings: SettingsData | null = $state(null);
	let loading = $state(true);
	let saving = $state(false);

	onMount(async () => {
		await loadSettings();
	});

	async function loadSettings() {
		try {
			loading = true;

			const data = await settingsService.getSettings();
			settings = data;
		} catch (err) {
			toast.error('Failed to load settings. Please try again.');
			console.error('Error loading settings:', err);
		} finally {
			loading = false;
		}
	}

	async function saveSettings(data: { animationsEnabled: boolean; mouseEffectsEnabled: boolean }) {
		try {
			saving = true;

			const { animationsEnabled, mouseEffectsEnabled } = data;

			const updatedSettings: Partial<SettingsData> = {
				ui: {
					animationsEnabled,
					mouseEffectsEnabled
				}
			};

			settings = await settingsService.updateSettings(updatedSettings);
			updateUISettings(settings);

			toast.success('Settings saved successfully!');
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to save settings. Please try again.';
			toast.error(errorMessage);
			console.error('Error saving settings:', err);
		} finally {
			saving = false;
		}
	}
</script>

<div class="mx-auto xl:w-2/3">
	<!-- Header -->
	<header class="mb-4 text-center">
		<h1 class="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">Settings</h1>
		<!-- <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">Configure application preferences</p> -->
	</header>

	{#if loading}
		<div class="flex justify-center py-12">
			<LoadingSpinner text="Loading settings..." size="lg" />
		</div>
	{:else}
		<SettingsForm {settings} {loading} {saving} onSave={saveSettings} />
	{/if}
</div>
