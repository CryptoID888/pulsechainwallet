<script lang="ts">
  import { push as goto } from 'svelte-spa-router'
  import Back from '$lib/components/Back.svelte'
  import MnemonicInput from '$lib/components/MnemonicInput.svelte'
  import { addWalletUnderCurrent } from '$lib/wallets'
  import { crumbs } from '$lib/navigation'
  import Crumb from '$lib/components/Crumb.svelte'
  const handleValidPhrase = async (e: CustomEvent<string[]>) => {
    const id = await addWalletUnderCurrent(e.detail.join(' '))
    goto(`/account/addresses/${id}/toggle`)
  }
</script>

<Crumb {...crumbs.addresses} />

<div class="flex flex-col gap-2 p-4">
  <h3 class="h3 flex justify-center">Import Phrase</h3>
  <Back let:back>
    <MnemonicInput
      on:cancel={() => {
        // goto(previous || '/account')
        back()
      }}
      on:valid-phrase={handleValidPhrase} />
  </Back>
</div>
