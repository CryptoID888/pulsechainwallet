<script lang="ts">
  import type { Erc20Token } from '$lib/tokens'
  import TokenIcon from './TokenIcon.svelte'

  export let token!: Erc20Token
</script>

<span class="flex flex-row items-center justify-center whitespace-pre">
  <TokenIcon {token} />
  <span class="ml-2 flex">
    {token.metadata?.name || ''}
  </span>
</span>
