<script lang="ts">
  import { defaultName, type Account, type WalletMetadata } from '$common/wallets'
  import { wallets } from '$lib/wallets'
  import SeedBox from './SeedBox.svelte'
  import Address from '../Address.svelte'
  export let account!: Account
  export let seed: WalletMetadata | null = null
  export let variant = 'filled'
  $: if ($wallets) {
    seed = $wallets.find((w) => w.id === account.wallet_id)
  }
</script>

{#if seed}
  <div class="flex flex-row items-center gap-2">
    <span class="flex">
      <SeedBox {variant} type={seed.type} />
    </span>
    <span class="whitespace-pre">{seed?.name || defaultName(seed.type, seed.user_order, account?.address_index)}</span>
    <span
      class="text-sm text-primary-200"
      class:text-primary-200={variant === 'filled'}
      class:text-primary-800={variant === 'soft'}>
      <Address address={account?.address} />
      <input type="hidden" id="from-address" name="from-address" value={account && account.address} />
    </span>
  </div>
{/if}
