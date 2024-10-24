<script lang="ts">
  import ComplexListItem from './ComplexListItem.svelte'
  import type { Section } from '$lib/link-list'

  export let sections: Section[] = []
</script>

{#each sections as section}
  <div class="mb-4 flex flex-col">
    <span class="text-sm">{section.name}</span>
    <ul class="flex flex-col last:border-b">
      {#each section.actions as action}
        <li class="flex flex-grow border border-b-0">
          <ComplexListItem
            on:click={() => {
              action.click?.()
            }}>{action.name}</ComplexListItem
          >
        </li>
      {/each}
    </ul>
  </div>
{/each}
<!--
<div>
	<h3>{name}</h3>
	<ul class="flex flex-col">
		{#each actions as action}
			<li class:pl-3={depth > 0} class="flex">
				<a
					href={action.path || '#'}
					class="w-full py-1 px-4"
					target={action.openNewPage ? '_blank' : '_self'}>
					<span>{action.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</div> -->
