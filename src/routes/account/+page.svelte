<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, logoutUser, pb, toast, safeResolve } from '$lib/utils';
	import { untrack } from 'svelte';
	import { AuthCrudClient } from '$lib/api/auth/crud';
	import { Card, Button } from '$lib/components/partials';
	import { AccountIcons, StatusIcons, FileIcons } from '$lib/components/icons';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const authClient = new AuthCrudClient(pb);

	let profileForm = $state(
		untrack(() => ({
			name: data.user?.name || '',
			avatar: null as File | null
		}))
	);

	function copyToClipboard(text: string) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				toast.success('User ID copied to clipboard!');
			})
			.catch(() => {
				toast.error('Failed to copy User ID');
			});
	}

	async function handleLogout() {
		try {
			await authClient.logout();
			logoutUser();
			goto(safeResolve('/account/login'));
		} catch (error) {
			console.error('Logout failed:', error);
			toast.error('Logout failed. Please try again.');
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	// Watch for changes in auth.user and update form accordingly
	$effect(() => {
		if (auth.user) {
			profileForm.name = auth.user.name || '';
		}
	});
</script>

<svelte:head>
	<title>Account - Your Profile</title>
</svelte:head>

<div class="mx-auto px-4 py-8 sm:px-6 lg:px-8 xl:max-w-2/3">
	<header class="mb-4 text-center">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">Manage your account</p>
	</header>

	<div class="grid gap-8 lg:grid-cols-3">
		<!-- Account Levels -->
		<div class="lg:col-span-2">
			<Card title="Account Levels" subtitle="Choose your plan">
				<div class="grid gap-6 md:grid-cols-2">
					<!-- Free Plan -->
					<div
						class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
					>
						<div class="mb-4">
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Free</h3>
							<p class="text-gray-600 dark:text-gray-400">Practice with paper trading</p>
						</div>
						<div class="mb-6">
							<span class="text-3xl font-bold text-gray-900 dark:text-white">$0</span>
							<span class="text-gray-600 dark:text-gray-400">/month</span>
						</div>
						<ul class="mb-6 space-y-3">
							<li class="flex items-center text-sm text-gray-600 dark:text-gray-400">
								<StatusIcons name="check" size="mr-3 h-5 w-5" class="text-green-500" />
								Paper Trading
							</li>
							<li class="flex items-center text-sm text-gray-400 line-through">
								<StatusIcons name="x" size="mr-3 h-5 w-5" class="text-red-500" />
								Live Trading
							</li>
						</ul>
						<Button variant="outline" fullWidth disabled>Current Plan</Button>
					</div>

					<!-- Pro Plan -->
					<div
						class="relative rounded-lg border-2 border-blue-500 bg-linear-to-br from-blue-50 to-indigo-50 p-6 shadow-xl dark:border-blue-500 dark:bg-linear-to-br dark:from-blue-900/20 dark:to-indigo-900/20"
					>
						<div class="absolute -top-3 left-1/2 -translate-x-1/2 transform">
							<div
								class="rounded-full bg-linear-to-r from-blue-500 to-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-lg"
							>
								50% Discount
							</div>
						</div>

						<div class="space-y-6">
							<div class="text-center">
								<div class="mb-2">
									<span class="text-2xl font-bold text-gray-500 line-through">$600</span>
									<span class="ml-2 text-4xl font-bold text-green-600">$300</span>
								</div>
								<div class="text-sm text-gray-500 dark:text-gray-400">anually</div>
							</div>

							<ul class="mb-6 space-y-3">
								<li class="flex items-center text-sm text-gray-600 dark:text-gray-400">
									<StatusIcons name="check" size="mr-3 h-5 w-5" class="text-green-500" />
									0.00% Trade Fee
								</li>
								<li class="flex items-center text-sm text-gray-700 dark:text-gray-300">
									<StatusIcons name="check" size="mr-3 h-5 w-5" class="text-green-500" />
									Live Trading
								</li>
							</ul>

							<div class="pt-4">
								<Button size="lg" fullWidth={true} color="blue">Start Pro</Button>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- Account Details -->
		<div class="space-y-6">
			<!-- User Info Card -->
			<Card title="Account Details">
				<div class="space-y-4">
					<div>
						<div class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</div>
						<p class="break-all text-gray-900 dark:text-white">{auth.user?.email}</p>
					</div>

					<div>
						<div class="flex items-center justify-between">
							<div class="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</div>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => copyToClipboard(auth.user?.id || '')}
								class="h-6 px-2 text-xs"
							>
								<AccountIcons name="copy" size="h-3 w-3" />
								Copy
							</Button>
						</div>
						<p class="font-mono text-sm break-all text-gray-900 dark:text-white">
							{auth.user?.id}
						</p>
					</div>

					<!-- <div>
						<div class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
						<div class="flex items-center space-x-2">
							{#if auth.user?.verified}
								<span
									class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400"
								>
									<svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										></path>
									</svg>
									Verified
								</span>
							{:else}
								<span
									class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
								>
									<svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
											clip-rule="evenodd"
										></path>
									</svg>
									Unverified
								</span>
							{/if}
						</div>
					</div> -->

					<div>
						<div class="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</div>
						<p class="text-sm text-gray-900 dark:text-white">
							{formatDate(auth.user?.created || '')}
						</p>
					</div>

					<!-- <div>
						<div class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</div>
						<p class="text-sm text-gray-900 dark:text-white">
							{formatDate(auth.user?.updated || '')}
						</p>
					</div> -->
				</div>
			</Card>

			<!-- Actions Card -->
			<Card title="Account Actions">
				<div class="space-y-3">
					<!-- {#if !auth.user?.verified}
						<Button variant="outline" fullWidth color="blue" onclick={handleEmailVerification}>
							<AccountIcons name="user" size="h-4 w-4 mr-1" />
							Verify Email
						</Button>
					{/if}

					<Button variant="outline" fullWidth color="gray">
						<AccountIcons name="change-pass" size="h-4 w-4 mr-1" />
						Change Password
					</Button> -->

					<Button variant="outline" fullWidth color="red" onclick={handleLogout}>
						<AccountIcons name="logout" size="h-4 w-4 mr-1" />
						Sign Out
					</Button>
				</div>
			</Card>
		</div>
	</div>

	<!-- Billing Section -->
	<div class="mt-8">
		<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h2>
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Billing History -->
			<Card title="Billing History" subtitle="View your payment history">
				<div class="space-y-4">
					<!-- Sample billing entries -->
					<div
						class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
					>
						<div class="flex items-center space-x-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20"
							>
								<StatusIcons
									name="check"
									size="h-5 w-5"
									class="text-green-600 dark:text-green-400"
								/>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white">Pro Plan - Annual</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">Jan 15, 2024</p>
							</div>
						</div>
						<div class="text-right">
							<p class="text-sm font-semibold text-gray-900 dark:text-white">$300.00</p>
							<p class="text-xs text-green-600 dark:text-green-400">Paid</p>
						</div>
					</div>

					<div
						class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
					>
						<div class="flex items-center space-x-3">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20"
							>
								<FileIcons
									name="certificate"
									size="h-5 w-5"
									class="text-blue-600 dark:text-blue-400"
								/>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white">Pro Plan - Annual</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">Jan 15, 2023</p>
							</div>
						</div>
						<div class="text-right">
							<p class="text-sm font-semibold text-gray-900 dark:text-white">$300.00</p>
							<p class="text-xs text-green-600 dark:text-green-400">Paid</p>
						</div>
					</div>

					<div class="pt-2">
						<Button variant="outline" fullWidth size="sm">
							<AccountIcons name="download" size="h-4 w-4 mr-2" />
							Download Invoices
						</Button>
					</div>
				</div>
			</Card>

			<!-- Subscription Management -->
			<Card title="Subscription Management" subtitle="Manage your plan settings">
				<div class="space-y-4">
					<!-- Current Plan Status -->
					<div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
						<div class="mb-3 flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white">Current Plan</p>
								<p class="text-lg font-bold text-blue-600 dark:text-blue-400">Pro Annual</p>
							</div>
							<div class="rounded-full bg-green-100 px-3 py-1 dark:bg-green-900/20">
								<p class="text-xs font-medium text-green-800 dark:text-green-400">Active</p>
							</div>
						</div>
						<div class="text-sm text-gray-600 dark:text-gray-400">
							<p>Next billing date: January 15, 2025</p>
							<p>Amount: $300.00</p>
						</div>
					</div>

					<!-- Auto-renewal Toggle -->
					<div
						class="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
					>
						<div>
							<p class="text-sm font-medium text-gray-900 dark:text-white">Auto-renewal</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								Automatically renew your subscription
							</p>
						</div>
						<label class="relative inline-flex cursor-pointer items-center">
							<input type="checkbox" class="peer sr-only" checked />
							<div
								class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
							></div>
						</label>
					</div>

					<!-- Payment Method -->
					<div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
						<div class="mb-2 flex items-center justify-between">
							<p class="text-sm font-medium text-gray-900 dark:text-white">Payment Method</p>
							<Button variant="ghost" size="sm">Update</Button>
						</div>
						<div class="flex items-center space-x-3">
							<div class="flex h-8 w-12 items-center justify-center rounded bg-blue-600">
								<FileIcons name="certificate" size="h-4 w-4" class="text-white" />
							</div>
							<div>
								<p class="text-sm text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">Expires 12/25</p>
							</div>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="space-y-2 pt-2">
						<Button variant="outline" fullWidth>
							<AccountIcons name="settings" size="h-4 w-4 mr-2" />
							Manage Subscription
						</Button>
						<Button variant="outline" fullWidth color="gray">
							<AccountIcons name="help" size="h-4 w-4 mr-2" />
							Billing Support
						</Button>
					</div>
				</div>
			</Card>
		</div>
	</div>
</div>
