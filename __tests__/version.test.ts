import { isVersionValid } from "../src/version";

describe("isVersionValid", () => {
    test("should return true for valid version strings", () => {
        expect(isVersionValid("1")).toBe(true);
        expect(isVersionValid("1.0")).toBe(true);
        expect(isVersionValid("1.0.0")).toBe(true);
        expect(isVersionValid("1.2.3-alpha")).toBe(true);
        expect(isVersionValid("2.0.0-beta")).toBe(true);
        expect(isVersionValid("3.1.4-rc.1.2.3")).toBe(true);
        expect(isVersionValid("0.0.4")).toBe(true);
        expect(isVersionValid("0.0.0")).toBe(true);
        expect(isVersionValid("10.20.30")).toBe(true);
        expect(isVersionValid("1.1.2-prerelease+meta")).toBe(true);
        expect(isVersionValid("1.1.2+meta")).toBe(true);
        expect(isVersionValid("1.0.0-alpha.beta")).toBe(true);
        expect(isVersionValid("1.0.0-alpha.1")).toBe(true);
        expect(isVersionValid("1.0.0-rc.1+build.1")).toBe(true);
        expect(isVersionValid("10.2.3-DEV-SNAPSHOT")).toBe(true);
        expect(isVersionValid("1.2.3-SNAPSHOT-123")).toBe(true);
        expect(isVersionValid("2.0.0+build.1848")).toBe(true);
        expect(isVersionValid("2.0.1-alpha.1227")).toBe(true);
        expect(isVersionValid("1.2-SNAPSHOT")).toBe(true);
    });

    test("should return false for invalid version strings", () => {
        expect(isVersionValid("invalid")).toBe(false);
        expect(isVersionValid("1.0.0.0")).toBe(false);
        expect(isVersionValid("01.1.1")).toBe(false);
        expect(isVersionValid("01")).toBe(false);
        expect(isVersionValid("1.0.0-alpha_beta")).toBe(false);
        expect(isVersionValid("1.2.3.DEV")).toBe(false);
        expect(isVersionValid("1.2.3-0123")).toBe(false);
        expect(isVersionValid("9.8.7-whatever+meta+meta")).toBe(false);
    });
});
