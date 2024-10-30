<script lang="ts">
  import { emptyHex } from '$common/config'
  import type { SeedType } from '$common/wallets'

  export let variant = 'filled'
  export let type: SeedType = 'phrase'
</script>

<span
  class="flex size-7 items-center justify-center rounded border-2 text-center"
  class:border-primary-200={variant === 'filled'}
  class:border-primary-500={variant === 'soft'}>{type === 'phrase' ? 'A' : emptyHex}</span>
