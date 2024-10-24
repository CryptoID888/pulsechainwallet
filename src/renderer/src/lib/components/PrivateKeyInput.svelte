<script lang="ts">
  import { push as goto } from 'svelte-spa-router'
  import { addWalletUnderCurrent } from '$lib/wallets'
  import Icon from '@iconify/svelte'
  import { generatePrivateKey } from 'viem/accounts'
  import Back from './Back.svelte'
  import type { Hex } from 'viem'

  export let show = false
  export let showRefresh = false
  export let showBack = false
  export let value = ''
  export let action = 'Import'
  export let refresh = () => {
    value = generatePrivateKey()
  }
  let input!: HTMLInputElement
  $: type = show ? 'text' : 'password'
  const submit = async () => {
    const metadata = await addWalletUnderCurrent(value as Hex)
    goto(`/account/addresses/${metadata.id}/toggle`)
  }
  const updateValue = () => {
    value = input.value
  }
</script>

<form on:submit|preventDefault={submit} class="flex flex-col gap-2">
  <input bind:this={input} {type} class="input" placeholder="0x..." {value} on:input={updateValue} />
  <div class="flex flex-row gap-2">
    {#if showRefresh}
      <button type="button" class="variant-outline-primary btn" on:click={refresh}>
        <Icon icon="material-symbols:refresh" height={24} />
      </button>
    {/if}
    {#if showBack}
      <Back let:back>
        <button type="button" class="variant-outline-primary btn" on:click={() => back()}>Cancel</button>
      </Back>
    {/if}
    <button class="variant-filled-primary btn w-full" type="submit">{action}</button>
  </div>
</form>
