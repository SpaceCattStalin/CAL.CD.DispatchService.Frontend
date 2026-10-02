import { expect, test } from 'vitest';
import { base64UrlDecode } from './decoder';

test("global replace \"-\" character", () => {
    // base64url for "subject>>?data>>?again" — contains 2 "-" characters
    // (each one came from a "+" in the original base64 output)
    const stringToReplace = "c3ViamVjdD4-P2RhdGE-Pj9hZ2Fpbg";
    const expectedString = "subject>>?data>>?again";

    const result = base64UrlDecode(stringToReplace);

    expect(result).toBe(expectedString);
});

test("global replace \"_\" character", () => {
    // base64url for "subject>>?data>>?again" — contains 2 "-" characters
    // (each one came from a "+" in the original base64 output)
    const stringToReplace = "c3ViamVjdD4_P2RhdGE_Pj9hZ2Fpbg";
    const expectedString = "subject>??data?>?again";

    const result = base64UrlDecode(stringToReplace);

    expect(result).toBe(expectedString);
});

test("global replace \"_\" and \"-\" character", () => {
    // base64url for "subject>>?data>>?again" — contains 2 "-" characters
    // (each one came from a "+" in the original base64 output)
    const stringToReplace = "c3ViamVjdD4-c3ViamVjdD4_P2RhdGE_Pj9hZ2Fpbg";
    const expectedString = "subject>>subject>??data?>?again";

    const result = base64UrlDecode(stringToReplace);

    expect(result).toBe(expectedString);
});

test("length % 4 === 0 needs no padding", () => {
    // base64url for "abc" — length 4, divisible by 4 already
    const stringToDecode = "YWJj";
    const expectedString = "abc";

    const result = base64UrlDecode(stringToDecode);

    expect(result).toBe(expectedString);
});

test("length % 4 === 2 needs \"==\" padding", () => {
    // base64url for "a" — length 2, needs 2 "=" to reach a multiple of 4
    const stringToDecode = "YQ";
    const expectedString = "a";

    const result = base64UrlDecode(stringToDecode);

    expect(result).toBe(expectedString);
});

test("length % 4 === 3 needs \"=\" padding", () => {
    // base64url for "ab" — length 3, needs 1 "=" to reach a multiple of 4
    const stringToDecode = "YWI";
    const expectedString = "ab";

    const result = base64UrlDecode(stringToDecode);

    expect(result).toBe(expectedString);
});

test("length % 4 === 1 is not valid base64 and throws", () => {
    // no valid base64-encoded data can produce a length ≡ 1 (mod 4);
    // padding this with "===" still leaves an undecodable final group
    const stringToDecode = "Y";

    expect(() => base64UrlDecode(stringToDecode)).toThrow();
});