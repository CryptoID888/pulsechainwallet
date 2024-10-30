import _ from "lodash";
import { readable as readableSlave } from '$lib/event-store';
import * as api from '$lib/api';
import { derived } from "svelte/store";
import { getAddress } from "viem";

export const contacts = readableSlave('contacts', () => api.contact.all(), [])

export const contactByAddress = derived([contacts], ([$contacts]) => (
  new Map($contacts.map(($contact) => (
    [getAddress($contact.address), $contact] as const
  )))
))
