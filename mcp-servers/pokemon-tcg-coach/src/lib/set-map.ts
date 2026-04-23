/**
 * Mapping between PTCGL set codes and tcgdex API IDs.
 */

const PTCGL_TO_TCGDEX: Record<string, string> = {
  // Scarlet & Violet era
  SVI: "sv01",
  PAL: "sv02",
  OBF: "sv03",
  MEW: "sv03.5",
  PAR: "sv04",
  PAF: "sv04.5",
  TEF: "sv05",
  TWM: "sv06",
  SFA: "sv06.5",
  SCR: "sv07",
  SSP: "sv08",
  PRE: "sv08.5",
  JTG: "sv09",
  SVE: "sve",
  SVP: "svp",

  // Sword & Shield era
  SSH: "swsh1",
  RCL: "swsh2",
  DAA: "swsh3",
  VIV: "swsh4",
  BST: "swsh5",
  CRE: "swsh6",
  EVS: "swsh7",
  FST: "swsh8",
  BRS: "swsh9",
  ASR: "swsh10",
  LOR: "swsh11",
  SIT: "swsh12",
  CRZ: "swsh12.5",

  // Sun & Moon era
  SUM: "sm1",
  GRI: "sm2",
  BUS: "sm3",
  SLG: "sm35",
  CIN: "sm4",
  UPR: "sm5",
  FLI: "sm6",
  CES: "sm7",
  LOT: "sm8",
  TEU: "sm9",
  UNB: "sm10",
  UNM: "sm11",
  HIF: "sm115",
  CEC: "sm12",
};

const TCGDEX_TO_PTCGL: Record<string, string> = Object.fromEntries(
  Object.entries(PTCGL_TO_TCGDEX).map(([ptcgl, tcgdex]) => [tcgdex, ptcgl])
);

/**
 * Convert a PTCGL set code to a tcgdex API ID.
 * Returns undefined if the code is not in the mapping.
 */
export function ptcglToTcgdex(ptcglCode: string): string | undefined {
  return PTCGL_TO_TCGDEX[ptcglCode];
}

/**
 * Convert a tcgdex API ID to a PTCGL set code.
 * Returns undefined if the ID is not in the mapping.
 */
export function tcgdexToPtcgl(tcgdexId: string): string | undefined {
  return TCGDEX_TO_PTCGL[tcgdexId];
}

/**
 * Returns true if the code looks like a PTCGL set code (2-4 uppercase letters).
 */
export function isPtcglCode(code: string): boolean {
  return /^[A-Z]{2,4}$/.test(code);
}
