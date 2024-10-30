<script lang="ts">
  import _ from 'lodash'
  import Crumb from '$lib/components/Crumb.svelte'
  import { crumbs } from '$lib/navigation'
  import { proofsUnderPool, leafIndices } from '$lib/db/proofs'
  import ChipList from '$lib/components/ChipList.svelte'
  import { isHex, type Hex } from 'viem'
  import IconList from '$lib/components/IconList.svelte'
  import type { Proof } from '$common/pools'
  import { push, link } from 'svelte-spa-router'
  import type { Icon } from '$common/types'

  export let params = {} as { poolId: Hex }
  const toIcon = (poolId: Hex, list: Proof[]) => {
    return {
      title: poolId,
      badge: list.length,
      type: 'pk' as const,
    }
  }
  $: poolId = params.poolId
  $: icons = Object.entries($proofsUnderPool).map(([poolId, list]) => toIcon(poolId as Hex, list))
  $: selectedList = $proofsUnderPool[poolId]
  $: byWorkState = _.groupBy(selectedList || [], 'work_state')
  $: selected = poolId && isHex(poolId) && selectedList && toIcon(poolId, selectedList)
  const selectPool = (e: CustomEvent<Icon>) => {
    const pool = e.detail
    push(`/account/shield/work/${pool.title}`)
  }
</script>

<Crumb {...crumbs.work} />

<div class="flex w-full flex-col px-4 gap-2">
  <div class="flex w-full justify-between items-center">
    <h3 class="h3 flex justify-between items-center">Work</h3>
    <a use:link class="anchor" href="/account/shield/assist">Assist &rightarrow;</a>
  </div>
  <IconList {icons} {selected} on:select={selectPool} />
  {#each Object.entries(byWorkState) as [workState, proofs]}
    {@const chips = new Set(leafIndices(proofs))}
    <h4 class="h4">{workState}</h4>
    <ChipList {chips} />
  {/each}
</div>
