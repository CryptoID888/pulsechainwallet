<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import Copy from './Copy.svelte'
  import Icon from '@iconify/svelte'
  import _ from 'lodash'
  import { mnemonicToAccount, english, generateMnemonic } from 'viem/accounts'
  export let cancelText = 'Back'
  export let phrase: string[] | null = null

  let wordCount = 12

  const emptyList = () => new Array(wordCount).fill('') as string[]

  $: words = phrase || emptyList()
  $: clearDisabled = _.filter(words, (w) => !!w).length === 0
  $: inputs = new Array(words.length).fill(null) as (HTMLInputElement | null)[]
  $: {
    const filled = words.filter((w) => !!w)
    const split = filled[0]?.split(' ')
    if (split?.length > 1) {
      split.forEach((w, i) => {
        words[i] = w
      })
    }
  }
  $: disabled = _.compact(words).length !== wordCount
  const dispatch = createEventDispatcher()
  const submitMnemonic = async () => {
    mnemonicToAccount(words.join(' '))
    dispatch('valid-phrase', words)
  }

  onMount(() => {
    inputs[0]?.focus()
  })
  const refreshPhrase = () => {
    phrase = generateMnemonic(english).split(' ')
  }
  const clearPhrase = () => {
    words = emptyList()
  }
</script>

<div class="flex flex-col gap-4">
  <p class="flex flex-row items-center justify-center text-center">
    <button type="button" class="px-2" on:click={refreshPhrase}>
      <Icon icon="material-symbols:refresh" height={24} />
    </button>
    <span>Enter your {wordCount} word mnemonic</span>
    <Copy let:copy text={words.join(' ')}>
      <button class="btn" on:click={copy}>
        <Icon icon="fa:copy" />
      </button>
    </Copy>
  </p>
  <form on:submit|preventDefault={submitMnemonic} class="flex flex-col gap-4">
    <ol class="grid grid-cols-4 gap-2">
      {#each words as word, i}
        <li class="col flex w-full">
          <input
            placeholder={'*'.repeat(3 + Math.floor(Math.random() * 4))}
            class="input min-w-0"
            bind:this={inputs[i]}
            bind:value={word}
          />
        </li>
      {/each}
    </ol>
    <div class="grid grid-cols-3 flex-row items-center gap-2">
      <button
        type="button"
        class="btn variant-ghost-error"
        on:click={() => {
          dispatch('cancel')
        }}>{cancelText}</button
      >
      <button type="button" disabled={clearDisabled} class="btn variant-outline-primary" on:click={clearPhrase}>
        Clear
      </button>
      <button {disabled} class="btn bg-primary-active-token" type="submit">Enter</button>
    </div>
  </form>
</div>
