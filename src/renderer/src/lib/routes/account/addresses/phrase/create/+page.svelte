<script lang="ts">
  import { push as goto } from 'svelte-spa-router'
  import Back from '$lib/components/Back.svelte'
  import MnemonicInput from '$lib/components/MnemonicInput.svelte'
  import { english, generateMnemonic } from 'viem/accounts'
  import { crumbs } from '$lib/navigation'
  import Crumb from '$lib/components/Crumb.svelte'
  import { wallet } from '$lib/api'
  import { PathTypes } from '$common/path'
  let phrase = generateMnemonic(english).split(' ')
</script>

<Crumb {...crumbs.addresses} />

<div class="flex flex-col gap-2 p-4">
  <h3 class="h3 flex justify-center">Create Phrase</h3>
  <Back let:back>
    <MnemonicInput
      {phrase}
      on:cancel={() => {
        back()
      }}
      on:valid-phrase={async () => {
        const metadata = await wallet.add(phrase.join(' '), PathTypes.BIP44)
        goto(`/account/addresses/${metadata.id}/toggle`)
      }} />
  </Back>
</div>
