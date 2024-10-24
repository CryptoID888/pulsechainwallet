<script lang="ts">
  import { transactions } from '$lib/transactions'
  import Icon from '@iconify/svelte'
  import { link } from 'svelte-spa-router'

  import Crumb from '$lib/components/Crumb.svelte'
  import { crumbs } from '$lib/navigation'
</script>

<Crumb {...crumbs.transactions} />

<div class="flex flex-col items-center gap-2 p-4">
  {#if !$transactions.length}
    <div class="contents">
      <Icon icon="fa:inbox" class="size-8" />
      <p class="my-4">no transaction history</p>
    </div>
  {:else}
    <Icon icon="fa:inbox" class="size-8" />
    <ol class="list">
      {#each $transactions as tx}
        <li>
          <a use:link class="anchor font-mono" href={`/account/transactions/${tx.hash}`}>{tx.hash}</a>
        </li>
      {/each}
    </ol>
  {/if}
</div>
