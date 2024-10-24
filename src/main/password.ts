import { Hex } from "viem";
import { writable } from "./store";

type Password = {
  hashedPassword: Hex
  providedAt: string
}

export const password = writable<null | Password>(null, 'hashedpass', null)
