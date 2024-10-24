<script lang="ts">
  import { tldToChainId, type TLD } from '$lib/ens'

  import * as viem from 'viem'
  import { normalize } from 'viem/ens'
  import Copy from './Copy.svelte'
  import AddContactButton from './AddContactButton.svelte'
  import Icon from '@iconify/svelte'
  import { createEventDispatcher } from 'svelte'
  import { ens } from '$lib/api'

  const noop = () => {}
  const dispatch = createEventDispatcher()
  const fetchENS = ($ens: string) => {
    let cancelled = false
    if (!$ens) {
      address = value as viem.Hex
      return noop
    }
    const name = normalize($ens)
    const getAddressFromEns = async (chainId: number) => {
      return ens.getEnsAddress(chainId, name)
    }
    const update = (val: viem.GetEnsAddressReturnType) => {
      if (cancelled) return
      address = val || null
      dispatch('change', address)
    }
    const tld = value.slice(-4) as `.${string}`
    const chainId = tldToChainId.get(tld)
    getAddressFromEns(chainId).then(update)
    return () => {
      cancelled = true
    }
  }
  const addressCouldBeNs = (value: string) => {
    return tldToChainId.has(value.slice(-4) as TLD)
  }
  const checkForAddressDerivation = () => {
    cancelFetchENS()
    if (value.startsWith('0x') && value.length === 42) {
      if (viem.isAddress(value)) {
        // do not show derived address if input is hex formatted address
        address = value
        dispatch('change', address)
        return
      }
    }
    if (addressCouldBeNs(value)) {
      cancelFetchENS = fetchENS(value)
      return
    }
    address = null
    dispatch('change', address)
  }
  export let value = ''
  export let address: viem.Hex | null = null
  let cancelFetchENS = noop
  $: addr = address && viem.isAddress(address) && value !== address ? address : ''
</script>

<label for="address" class="w-full">
  <span class="flex w-full text-sm font-medium italic leading-6 text-gray-900"><slot name="label" /></span>
  <input
    id="address"
    name="address"
    type="text"
    bind:value
    placeholder="0x.../.eth/.pls"
    on:input={checkForAddressDerivation}
    class="input flex w-full" />
  <div class="flex flex-row items-center gap-2">
    <Copy text={addr} let:copy let:copied>
      <button type="button" class="flex flex-row items-center" on:click={copy}>
        <span class="flex text-sm leading-6">{addr}&nbsp;</span>
        {#if addr}
          {#if copied}
            <Icon icon="icon-park-outline:file-success-one" height={12} width={12} />
          {:else}
            <Icon icon="fa:copy" height={12} width={12} />
          {/if}
        {/if}
      </button>
    </Copy>
    <AddContactButton {address} name={value !== address ? value : ''} />
  </div>
</label>
