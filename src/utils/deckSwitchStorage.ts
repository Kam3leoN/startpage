import { DECK_SWITCH_KEY_PREFIX } from "../config/deck";

/** Lit l'état d'un interrupteur deck. */
export function readDeckSwitch(switchId: string): boolean {
  return localStorage.getItem(`${DECK_SWITCH_KEY_PREFIX}${switchId}`) === "true";
}

/** Persiste l'état d'un interrupteur deck. */
export function writeDeckSwitch(switchId: string, on: boolean): void {
  localStorage.setItem(`${DECK_SWITCH_KEY_PREFIX}${switchId}`, String(on));
}

/** Bascule et retourne le nouvel état. */
export function toggleDeckSwitch(switchId: string): boolean {
  const next = !readDeckSwitch(switchId);
  writeDeckSwitch(switchId, next);
  return next;
}
