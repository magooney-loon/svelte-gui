<script lang="ts">
	import { page } from '$app/state';
	import {
		APP_NAME,
		loginUser,
		navigateWithTransition,
		transitionLink,
		toast,
		safeResolve
	} from '$lib/utils';
	import { Card, Button, FormField, FormValidator } from '$lib/components/partials';
	import { ApiClient } from '$lib/api';
	import { onMount } from 'svelte';
	import { Modal } from '$lib/components/main';

	const api = new ApiClient();

	let formData = $state({
		email: '',
		password: '',
		passwordConfirm: ''
	});

	let loading = $state(false);
	let showConfirmationModal = $state(false);

	// FormValidator configuration
	const fieldConfigs = {
		email: { type: 'email', required: true },
		password: { type: 'password', required: true, min: 8 },
		passwordConfirm: { type: 'password', required: true, confirmField: 'password' }
	};

	onMount(() => {
		if (api.auth.isAuthenticated()) {
			navigateWithTransition('/account');
		}
	});

	function handleSubmit(validation: {
		validateForm: () => { isValid: boolean; errors: Record<string, string> };
		getFieldError: (fieldName: string) => string;
		isValid: boolean;
	}) {
		return (e: Event) => {
			e.preventDefault();

			const result = validation.validateForm();
			if (!result.isValid) {
				toast.error('Please fix the form errors before submitting');
				return;
			}

			// Show confirmation modal before proceeding
			showConfirmationModal = true;
		};
	}

	async function proceedWithRegistration() {
		loading = true;
		showConfirmationModal = false;

		// Add minimum delay for smoother UX
		const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));

		try {
			// Attempt registration
			const [response] = await Promise.all([
				api.auth.register({
					email: formData.email,
					password: formData.password,
					passwordConfirm: formData.passwordConfirm
				}),
				minDelay
			]);

			// Update auth state (user is automatically logged in after registration)
			const authRecord = {
				...response.record,
				collectionId: 'users',
				collectionName: 'users'
			};
			loginUser(response.token, authRecord);

			// Add slight delay before navigation for smoother transition
			await new Promise((resolve) => setTimeout(resolve, 400));
			const redirectTo = page.url.searchParams.get('redirect') || '/account';
			await navigateWithTransition(redirectTo);
		} catch (err) {
			console.error('Registration failed:', err);
			if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error('Registration failed. Please try again.');
			}
		} finally {
			// Add small delay before removing loading state
			setTimeout(() => {
				loading = false;
			}, 250);
		}
	}
</script>

<svelte:head>
	<title>Register | {APP_NAME}</title>
</svelte:head>

<div class="mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:w-1/3">
	<!-- Header -->
	<div class="mb-4 text-center">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Your account</h1>
		<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
			Join {APP_NAME} and start Your journey
		</p>
	</div>

	<!-- Registration Form -->
	<Card padding="lg" class="shadow-lg">
		<FormValidator bind:formData {fieldConfigs}>
			{#snippet children(validation)}
				<form onsubmit={handleSubmit(validation)} class="space-y-6">
					<FormField
						id="email"
						label="Email address"
						type="email"
						placeholder="Enter your email"
						bind:value={formData.email}
						required
						disabled={loading}
						helperText="You can use a fake or non-existent email"
						errorText={validation.getFieldError('email')}
						autoValidate={false}
						oninput={() => validation.validateField('email')}
					/>

					<FormField
						id="password"
						label="Password"
						type="password"
						placeholder="Create a strong password"
						bind:value={formData.password}
						required
						disabled={loading}
						errorText={validation.getFieldError('password')}
						autoValidate={false}
						oninput={() => {
							validation.validateField('password');
							if (formData.passwordConfirm) {
								validation.validateField('passwordConfirm');
							}
						}}
					/>

					<FormField
						id="passwordConfirm"
						label="Confirm Password"
						type="password"
						placeholder="Confirm your password"
						bind:value={formData.passwordConfirm}
						required
						disabled={loading}
						errorText={validation.getFieldError('passwordConfirm')}
						autoValidate={false}
						oninput={() => validation.validateField('passwordConfirm')}
					/>

					<div class="text-xs text-gray-500 dark:text-gray-400">
						<p>
							By creating an account, You agree on the
							<a
								href={safeResolve('/account/legal')}
								use:transitionLink
								class="text-blue-600 underline-offset-4 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
							>
								TOS
							</a>
						</p>
					</div>

					<Button
						type="submit"
						variant="primary"
						color="blue"
						size="lg"
						fullWidth
						disabled={!validation.isValid}
						{loading}
					>
						{loading ? 'Creating account...' : 'Create Account'}
					</Button>
				</form>
			{/snippet}
		</FormValidator>

		<!-- Login Link -->
		<div class="mt-6 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Already have an account?
				<a
					href={safeResolve('/account/login')}
					use:transitionLink
					class="font-medium text-blue-600 underline-offset-4 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
				>
					Sign in
				</a>
			</p>
		</div>
	</Card>

	<!-- Confirmation Modal -->
	<Modal
		open={showConfirmationModal}
		title="🎨 Svelte-GUI Preview Showcase"
		size="md"
		onclose={() => (showConfirmationModal = false)}
	>
		<div class="space-y-4 text-sm">
			<div
				class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
			>
				<p class="mb-2 font-medium text-blue-800 dark:text-blue-200">
					Welcome to the Svelte-GUI Preview!
				</p>
				<ul class="space-y-2 text-blue-700 dark:text-blue-300">
					<li class="flex items-start">
						<span class="mr-2">•</span>
						<span
							><strong>This is a demonstration showcase.</strong> The form you're seeing is one of the
							prebuilt auth components included in Svelte-GUI.</span
						>
					</li>
					<li class="flex items-start">
						<span class="mr-2">•</span>
						<span
							><strong>No backend is connected.</strong> This preview has no database or authentication
							server, so no actual registration will occur.</span
						>
					</li>
					<li class="flex items-start">
						<span class="mr-2">•</span>
						<span
							><strong>Explore the UI components.</strong> Feel free to interact with the form, buttons,
							and other elements to see how they behave and respond.</span
						>
					</li>
					<li class="flex items-start">
						<span class="mr-2">•</span>
						<span
							><strong>Ready to build?</strong> These components are ready to use in your own projects
							with your preferred backend integration.</span
						>
					</li>
				</ul>
			</div>

			<p class="text-gray-600 dark:text-gray-400">
				This registration form demonstrates the authentication UI patterns and components you get
				with Svelte-GUI. When you're ready to implement real authentication, simply connect your
				backend API.
			</p>
		</div>

		{#snippet footer()}
			<div class="flex gap-3">
				<Button variant="secondary" size="md" onclick={() => (showConfirmationModal = false)}>
					Close
				</Button>
				<Button variant="primary" color="blue" size="md" onclick={proceedWithRegistration}>
					Continue Demo
				</Button>
			</div>
		{/snippet}
	</Modal>
</div>
