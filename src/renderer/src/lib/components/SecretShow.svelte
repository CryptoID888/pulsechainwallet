<script lang="ts">
  import { CodeBlock, getDrawerStore } from '@skeletonlabs/skeleton'
  import PasswordGate from './PasswordGate.svelte'
  import type { Hex } from 'viem'
  import { wallet } from '$lib/api'

  const drawerStore = getDrawerStore()
  const cancelReveal = () => {
    drawerStore.close()
  }
  const checkPasswordAndReveal = async (e: CustomEvent) => {
    const password = e.detail
    secret = (await wallet.reveal(password, walletId, addressIndex)) || ''
  }

  export let walletId!: Hex
  export let addressIndex: number | undefined = undefined
  let secret = ''
</script>

<div class="p-4">
  <h3 class="h3 text-center">Reveal Secret</h3>
  {#if !!secret}
    <CodeBlock code={secret} />
  {:else}
    <PasswordGate on:cancel={cancelReveal} on:submit={checkPasswordAndReveal} />
  {/if}
</div>
