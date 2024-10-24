<script lang="ts">
  import Icon from '@iconify/svelte'

  let isOpen = true

  // enum Paths {
  // 	BIP44,
  // 	LedgerLive,
  // 	LedgerLegacy,
  // }
  // type Path = {
  // 	path: (index: '' | number) => string
  // }
  // const paths = new Map<Paths, Path>([
  // 	[Paths.BIP44, { path: (idx) => `m/44'/60'/0'/0/${idx}` }],
  // 	[Paths.LedgerLive, { path: (idx) => `m/44'/60'/${idx}/0/0` }],
  // 	[Paths.LedgerLegacy, { path: (idx) => `m/44'/60'/0'/${idx}` }],
  // ])
  // // custom path is set here allow user to override to any custom path that they wish to use
  // let customPath = ''
  import { crumbs } from '$lib/navigation'
  import Crumb from '$lib/components/Crumb.svelte'
</script>

<Crumb {...crumbs.addresses} />

<div class:open={isOpen}>
  <span>Path Settings<Icon class="ml-1" icon="fa:gear" /></span>
  <div class="flex w-full" class:h-0={!isOpen} class:h-16={isOpen}></div>
</div>
