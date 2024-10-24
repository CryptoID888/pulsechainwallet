<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import BackButton from './BackButton.svelte'

  let password = ''
  const dispatch = createEventDispatcher()

  const encryptAndSaveWallet = async () => {
    dispatch('submit', password)
  }
</script>

<form on:submit|preventDefault={encryptAndSaveWallet}>
  <input class="input mb-4" type="password" placeholder="password" bind:value={password} />
  <div class="grid grid-cols-2 gap-2">
    <BackButton on:cancel />
    <button type="submit" class="variant-filled-primary btn w-full">Reveal</button>
  </div>
</form>
