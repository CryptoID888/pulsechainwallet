export enum TimeUnit {
  Millisecond = 1,
  Second = 1_000,
  Minute = 60_000,
  Hour = 3_600_000,
  Day = 86_400_000,
}

export const numberToTime = (value: bigint, unit: TimeUnit) => {
  return value * BigInt(unit)
}
