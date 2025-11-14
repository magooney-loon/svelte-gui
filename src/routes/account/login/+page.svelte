<script lang="ts">
	import { page } from '$app/state';
	import {
		APP_NAME,
		loginUser,
		auth,
		navigateWithTransition,
		transitionLink,
		toast,
		safeResolve
	} from '$lib/utils';
	import { Card, Button, FormField, FormValidator } from '$lib/components/partials';
	import { ApiClient } from '$lib/api';

	const api = new ApiClient();

	let formData = $state({
		email: '',
		password: ''
	});

	let loading = $state(false);

	// FormValidator configuration
	const fieldConfigs = {
		email: { type: 'email', required: true },
		password: { type: 'password', required: true, min: 1 }
	};

	$effect(() => {
		if (!auth.loading && auth.isAuthenticated) {
			const redirectTo = page.url.searchParams.get('redirect') || '/account';
			navigateWithTransition(redirectTo);
		}
	});

	function handleSubmit(validation: {
		validateForm: () => { isValid: boolean; errors: Record<string, string> };
		getFieldError: (fieldName: string) => string;
		isValid: boolean;
	}) {
		return async (e: Event) => {
			e.preventDefault();

			const result = validation.validateForm();
			if (!result.isValid) {
				toast.error('Please fill in all fields correctly');
				return;
			}

			loading = true;

			// Add minimum delay for smoother UX
			const minDelay = new Promise((resolve) => setTimeout(resolve, 800));

			try {
				const [response] = await Promise.all([
					api.auth.login({
						email: formData.email,
						password: formData.password
					}),
					minDelay
				]);

				// Update auth state - create AuthRecord from AuthUser
				const authRecord = {
					...response.record,
					collectionId: 'users',
					collectionName: 'users'
				};
				loginUser(response.token, authRecord);

				// Add slight delay before navigation for smoother transition
				await new Promise((resolve) => setTimeout(resolve, 300));
				const redirectTo = page.url.searchParams.get('redirect') || '/account';
				await navigateWithTransition(redirectTo);
			} catch (err) {
				console.error('Login failed:', err);
				const errorMessage =
					err instanceof Error
						? err.message
						: 'Login failed. Please check your credentials and try again.';
				toast.error(errorMessage);
			} finally {
				// Add small delay before removing loading state
				setTimeout(() => {
					loading = false;
				}, 200);
			}
		};
	}
</script>

<svelte:head>
	<title>Login | {APP_NAME}</title>
</svelte:head>

<div class="mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:w-1/3">
	<!-- Header -->
	<div class="mb-4 text-center">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h1>
		<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your {APP_NAME} account</p>
	</div>

	<!-- Login Form -->
	<Card padding="lg" class="shadow-lg" hover={false}>
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
						errorText={validation.getFieldError('email')}
						autoValidate={false}
						oninput={() => validation.validateField('email')}
					/>

					<FormField
						id="password"
						label="Password"
						type="password"
						placeholder="Enter your password"
						bind:value={formData.password}
						required
						disabled={loading}
						errorText={validation.getFieldError('password')}
						autoValidate={false}
						oninput={() => validation.validateField('password')}
					/>

					<!-- <div class="flex items-center justify-between">
						<div class="text-sm">
							<a
								href="/account/forgot-password"
								use:transitionLink
								class="text-blue-600 underline-offset-4 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
							>
								Forgot your password?
							</a>
						</div>
					</div> -->

					<Button
						type="submit"
						variant="primary"
						color="blue"
						size="lg"
						fullWidth
						disabled={!validation.isValid}
						{loading}
					>
						{loading ? 'Signing in...' : 'Sign in'}
					</Button>
				</form>
			{/snippet}
		</FormValidator>

		<!-- Register Link -->
		<div class="mt-6 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Don't have an account?
				<a
					href={safeResolve('/account/register')}
					use:transitionLink
					class="font-medium text-blue-600 underline-offset-4 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
				>
					Sign up
				</a>
			</p>
		</div>
	</Card>
</div>
