<script lang="ts">
  import { english, generateMnemonic } from 'viem/accounts'
  import FromMnemonic from '../from-mnemonic.svelte'
</script>

<FromMnemonic phrase={generateMnemonic(english).split(' ')} setPassword />
