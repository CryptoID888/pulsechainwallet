<script lang="ts"></script>

<!-- <script lang="ts">
  import Lazy from '$lib/components/Lazy.svelte'
  import { Avatar } from '@skeletonlabs/skeleton'
  import Number from '../Number.svelte'
  import { type Erc20Token, whitelistedERC20, setMetadata } from '$lib/tokens'
  import { pulsechain } from 'viem/chains'
  import * as viem from 'viem'
  // import { currentAddress } from '$lib/wallets'
  import { multicallErc20, erc20 } from '$lib/chain/erc20'
  const chain = pulsechain
  // $: tokens = whitelistedERC20.filter((token) => token.chainId === chain.id)

  const logoURI = (token: Erc20Token) => {
    return token.metadata?.logoURI || `https://gib.show/image/${token.chainId}/${token.address}`
  }
  const loadMetadata = async (token: Erc20Token) => {
    if (token.metadata?.decimals) {
      return
    }
    if (token.address === viem.zeroAddress) {
      setMetadata(token, {
        name: 'Pulse',
        symbol: 'PLS',
        decimals: 18,
        logoURI: logoURI({
          chainId: token.chainId,
          address: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
        }),
      })
      return
    }
    const [[name, symbol, decimals], balance] = await Promise.all([
      multicallErc20({
        chain,
        target: token.address,
      }),
      $address
        ? erc20({
            chain,
            address: token.address,
          }).read.balanceOf([$address!])
        : 0n,
    ])
    setMetadata(token, {
      name,
      symbol,
      decimals,
      balances: {
        [$address]: balance,
      },
      logoURI: logoURI(token),
    })
  }
</script>

<ul class="list">
  {#each tokens as token}
    <li>
      <Lazy height={50} let:load class="flex w-full" visible={() => loadMetadata(token)}>
        <span class="flex items-center"
          ><Avatar
            src={token.metadata?.logoURI || load ? token.metadata?.logoURI || '' : ''}
            width="w-8"
            rounded="rounded-full"
          /></span
        >
        <span class="ml-4 mr-auto">
          {token.metadata?.symbol || 'Symbol (unknown)'}<br />
          <small class="text-slate-400">
            <Number
              x={token.metadata?.balances?.[$address ? viem.getAddress($address) : $address] || 0n}
              decimals={token.metadata?.decimals || 18}
            />
          </small>
        </span>
        <span class="flex items-center">⋮</span>
      </Lazy>
    </li>
  {/each}
  <!-- <li>
		<span
			><Avatar
				src="https://pulsechain.com/img/wordmarkShort.png"
				width="w-8"
				rounded="rounded-full" /></span>
		<span class="flex-auto">
			PLS<br />
			<small class="text-slate-400">
				<Number x={1644123010000000000000000n} decimals={18} />
			</small>
		</span>
		<span>⋮</span>
	</li>
	<li>
		<span
			><Avatar
				src="https://s2.coinmarketcap.com/static/img/coins/64x64/25417.png"
				width="w-8"
				rounded="rounded-full" /></span>
		<span class="flex-auto">
			PLSX<br />
			<small class="text-slate-400">
				<Number x={35623010000000000000000n} decimals={18} />
			</small>
		</span>
		<span>⋮</span>
	</li>
	<li>
		<span
			><Avatar
				src="https://s2.coinmarketcap.com/static/img/coins/64x64/5015.png"
				width="w-8"
				rounded="rounded-full" /></span>
		<span class="flex-auto">
			HEX<br />
			<small class="text-slate-400">
				<Number x={562301000000n} decimals={8} />
			</small>
		</span>
		<span>⋮</span>
	</li>
</ul> -->
