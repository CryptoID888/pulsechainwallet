<script lang="ts">
  import Crumb from '$lib/components/Crumb.svelte'
  import { crumbs } from '$lib/navigation'
  import { proofs, workingProofs } from '$lib/db/proofs'
  import ChipList from '$lib/components/ChipList.svelte'

  // $: console.log(JSON.parse($proofs?.[0]?.proof || '{}'))
  $: chips = new Set($proofs.map((proof) => BigInt(proof.leaf_index)))
  $: loading = new Set<bigint>($workingProofs.map((proof) => BigInt(proof.leaf_index)))
  $: disabled = new Set<bigint>()
</script>

<Crumb {...crumbs.work} />

<div class="flex w-full flex-col px-4">
  <h3 class="h3">Work</h3>
  <ChipList {chips} {loading} {disabled} />
</div>
