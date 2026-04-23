import { describe, it, expect } from "vitest";
import { ptcglToTcgdex, tcgdexToPtcgl, isPtcglCode } from "../lib/set-map.js";

describe("ptcglToTcgdex", () => {
  it("converts SVI to sv01", () => {
    expect(ptcglToTcgdex("SVI")).toBe("sv01");
  });

  it("converts BRS to swsh9", () => {
    expect(ptcglToTcgdex("BRS")).toBe("swsh9");
  });

  it("converts SVP to svp", () => {
    expect(ptcglToTcgdex("SVP")).toBe("svp");
  });

  it("returns undefined for unknown code", () => {
    expect(ptcglToTcgdex("XYZ")).toBeUndefined();
  });

  it("converts PAL to sv02", () => {
    expect(ptcglToTcgdex("PAL")).toBe("sv02");
  });

  it("converts SSH to swsh1", () => {
    expect(ptcglToTcgdex("SSH")).toBe("swsh1");
  });

  it("converts MEW to sv03.5", () => {
    expect(ptcglToTcgdex("MEW")).toBe("sv03.5");
  });
});

describe("tcgdexToPtcgl", () => {
  it("converts sv01 to SVI", () => {
    expect(tcgdexToPtcgl("sv01")).toBe("SVI");
  });

  it("converts swsh9 to BRS", () => {
    expect(tcgdexToPtcgl("swsh9")).toBe("BRS");
  });

  it("converts svp to SVP", () => {
    expect(tcgdexToPtcgl("svp")).toBe("SVP");
  });

  it("returns undefined for unknown tcgdex id", () => {
    expect(tcgdexToPtcgl("xy01")).toBeUndefined();
  });
});

describe("isPtcglCode", () => {
  it("returns true for 3-letter uppercase code", () => {
    expect(isPtcglCode("SVI")).toBe(true);
  });

  it("returns true for 2-letter uppercase code", () => {
    expect(isPtcglCode("SS")).toBe(true);
  });

  it("returns true for 4-letter uppercase code", () => {
    expect(isPtcglCode("SWSH")).toBe(true);
  });

  it("returns false for lowercase", () => {
    expect(isPtcglCode("svi")).toBe(false);
  });

  it("returns false for mixed case", () => {
    expect(isPtcglCode("Svi")).toBe(false);
  });

  it("returns false for 1-letter code", () => {
    expect(isPtcglCode("S")).toBe(false);
  });

  it("returns false for 5-letter code", () => {
    expect(isPtcglCode("ABCDE")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isPtcglCode("")).toBe(false);
  });
});
