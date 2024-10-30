<script lang="ts">
  import Back from '$lib/components/Back.svelte'
  import Crumb from '$lib/components/Crumb.svelte'
  import BackButton from '$lib/components/BackButton.svelte'

  import { push as goto } from 'svelte-spa-router'

  import { crumbs } from '$lib/navigation'
  import { password } from '$lib/api'

  let current = ''
  let next = ''
  let nextConfirm = ''
  $: disabled = !next || !current || next !== nextConfirm
  const submitHandler = async () => {
    try {
      const successful = await password.change(current, next)
      if (successful) {
        console.log('changepass /locked')
        goto('/locked')
      }
    } catch (err) {
      console.log('failed to change pass')
    }
  }
  const focus = (e: Event) => {
    ;(e.target as HTMLInputElement).type = 'text'
  }
  const blur = (e: Event) => {
    ;(e.target as HTMLInputElement).type = 'password'
  }
</script>

<Crumb {...crumbs.changePassword} />

<div class="flex flex-col px-4">
  <form class="flex flex-col" on:submit|preventDefault={submitHandler}>
    <label class="flex w-full flex-col">
      Current Pass
      <input
        class="input my-2 w-full"
        placeholder="***"
        type="text"
        bind:value={current}
        on:focus={focus}
        on:blur={blur} />
    </label>
    <label class="flex w-full flex-col">
      New Pass
      <input
        class="input my-2 w-full"
        placeholder="***"
        type="text"
        bind:value={next}
        on:focus={focus}
        on:blur={blur} />
    </label>
    <label class="flex w-full flex-col">
      Confirm Pass
      <input
        class="input my-2 w-full"
        placeholder="***"
        type="text"
        bind:value={nextConfirm}
        on:focus={focus}
        on:blur={blur} />
    </label>
    <div class="grid grid-cols-2 gap-2">
      <Back let:back>
        <BackButton
          cancelText="Cancel"
          on:cancel={() => {
            back()
          }} />
      </Back>
      <button {disabled} type="submit" class="variant-filled-error btn">Change Password</button>
    </div>
  </form>
</div>
