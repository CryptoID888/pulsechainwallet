export enum Offsets {
  Giga = 9,
  Mega = 6,
  Kilo = 3,
  Neutral = 0,
  Milli = -3,
  Micro = -6,
  GWei = -9,
  Wei = -18,
  // custom units
  Hearts = -8,
}
export type Config = {
  symbolPrefix: string
  namePrefix: string
  replacesSymbol?: boolean
}

export const units = new Map<Offsets, Config>([
  [Offsets.Giga, { symbolPrefix: 'G', namePrefix: 'Giga' }],
  [Offsets.Mega, { symbolPrefix: 'M', namePrefix: 'Mega' }],
  [Offsets.Kilo, { symbolPrefix: 'k', namePrefix: 'Kilo' }],
  [Offsets.Neutral, { symbolPrefix: '-', namePrefix: 'None' }],
  [Offsets.Milli, { symbolPrefix: 'm', namePrefix: 'Milli' }],
  [Offsets.Micro, { symbolPrefix: 'μ', namePrefix: 'Micro' }],
  [Offsets.GWei, { symbolPrefix: 'Γ', namePrefix: 'Gwei', replacesSymbol: true }],
  [Offsets.Wei, { symbolPrefix: '伟', namePrefix: 'Wei', replacesSymbol: true }],
])
