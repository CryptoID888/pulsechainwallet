<script lang="ts">
  import { type Config, Offsets } from '$lib/unit'
  import { Avatar } from '@skeletonlabs/skeleton'
  import { writable, type Writable } from 'svelte/store'

  export let units = new Map<Offsets, Config>()
  export let current: Writable<Offsets> = writable(Offsets.Neutral)
  export let neutral: number = 18
</script>

<ol class="list px-2 py-3">
  {#each units.entries() as [offset, config]}
    {#if offset >= -neutral}
      <li>
        <button
          type="button"
          class="relative flex w-full place-content-center items-center"
          on:click={() => {
            current.set(offset)
          }}
        >
          <span class="flex">
            <span class="relative flex">
              <span class="variant-filled-warning badge-icon absolute -right-1 -top-1 z-10">{offset}</span>
              <Avatar background={$current === offset ? 'variant-filled-primary' : 'variant-ghost-primary'} width="w-9">
                {config.symbolPrefix}
              </Avatar>
            </span>
            <span class="min-w-16 flex-auto">{config.namePrefix}</span>
          </span>
        </button>
      </li>
    {/if}
  {/each}
</ol>
