<script lang="ts">
  import { crumbs } from '$lib/navigation'
  import Crumb from '$lib/components/Crumb.svelte'
  import { accounts, isLoggedIn } from '$lib/wallets'
  import { contacts } from '$lib/contacts'
  import Label from '$lib/components/Label.svelte'
  import QRCode from '@castlenine/svelte-qrcode'
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton'
  import Loader from '$lib/components/Loader.svelte'
  import type { Hex } from 'viem'
  import { emptyHex } from '$common/config'

  export let walletId: Hex = emptyHex
  export let addressIndex: number = 0
  export let params: { walletId: Hex; addressIndex: number } = { walletId, addressIndex }
  $: id = params.walletId
  $: index = +params.addressIndex
  $: account = $accounts.find((a) => a.wallet_id === id && a.address_index === index)
  const popupHover: PopupSettings = {
    event: 'hover',
    target: 'qrcode-hover',
    placement: 'bottom',
  }
  $: contact = $contacts.find((c) => c.address === account?.address)
</script>

<Crumb {...crumbs.addresses} />
<Crumb {...crumbs.addressDetail(walletId, addressIndex)} />

{#if $isLoggedIn}
  <div class="flex flex-col p-4">
    <div class="flex flex-col rounded border bg-white">
      <div class="flex w-full flex-col border-b p-4">
        <Label text="Address" />
        <span class="text-sm">{account?.address}</span>
      </div>
      <div class="flex w-full flex-row items-center border-b p-4">
        <span class="w-full">Address Note</span>
        <span class="w-full text-right italic" class:italic={!contact}>
          {#if contact}
            {contact.name}
          {:else}
            No Name
          {/if}
        </span>
      </div>
      <div class="flex w-full flex-row items-center p-4">
        <span class="w-full">QR Code</span>
        {#if account?.address}
          <span class="flex [&>*]:pointer-events-none" use:popup={popupHover}>
            <QRCode data={account?.address} size={28} />
          </span>
          <div data-popup="qrcode-hover" class="variant-filled-primary p-2">
            <div class="variant-filled-primary arrow" />
            <QRCode size={128} data={account?.address} />
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <Loader />
{/if}
