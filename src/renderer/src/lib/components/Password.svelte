<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import BackButton from './BackButton.svelte'

  let password = ''
  let confirm = ''
  const dispatch = createEventDispatcher()

  $: disabled = !password || password !== confirm

  const encryptAndSaveWallet = async () => {
    if (confirm !== password) return
    dispatch('submit', password)
  }
  let passwordInput: HTMLInputElement
  onMount(() => {
    passwordInput.focus()
  })
</script>

<form on:submit|preventDefault={encryptAndSaveWallet}>
  <input bind:this={passwordInput} class="input mb-4" type="password" placeholder="password" bind:value={password} />
  <input
    class="input mb-4"
    class:input-error={!!confirm && confirm !== password}
    type="password"
    placeholder="confirm"
    bind:value={confirm} />
  <div class="grid grid-cols-2 gap-2">
    <BackButton on:cancel />
    <button {disabled} type="submit" class="variant-filled-primary btn w-full">Save</button>
  </div>
</form>
