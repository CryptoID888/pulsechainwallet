<script lang="ts">
  import type { Erc20Token } from '$lib/tokens'
  import { Offsets, units } from '$lib/unit'
  import { getDrawerStore } from '@skeletonlabs/skeleton'
  import { writable } from 'svelte/store'

  const drawerStore = getDrawerStore()

  export let token!: Erc20Token
  export let offset: Offsets = Offsets.Neutral
  let unitList = units

  $: symbolPrefix = unitList.get(offset)!.symbolPrefix
  $: namePrefix = unitList.get(offset)!.namePrefix

  const openDrawer = () => {
    const current = writable(offset)
    current.subscribe((val) => {
      offset = val
    })
    if (token.metadata!.name === 'Hex') {
      const u = new Map(units.entries())
      u.set(Offsets.Hearts, {
        namePrefix: 'Heart',
        symbolPrefix: '<3',
      })
      unitList = u
    } else {
      unitList = units
    }
    drawerStore.open({
      id: 'unit',
      position: 'bottom',
      meta: {
        neutral: token.metadata!.decimals,
        current,
        units: unitList,
      },
    })
  }
</script>

<button class="pl-0 [&>*]:pointer-events-none" on:click={openDrawer}>
  <span class="-ml-2 whitespace-pre p-0 px-0 py-2 text-neutral-500"
    >{#if offset < Offsets.Micro}
      {namePrefix}
    {:else}
      {offset === Offsets.Neutral ? '' : symbolPrefix}{token.metadata?.symbol}{/if}</span
  >
</button>
