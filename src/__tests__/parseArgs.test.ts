import { parseArgs } from "../utilities";

describe("parseArgs", () => {
    it('should fail for a non-string argument', () => {
        expect(parseArgs([0])).toThrow('Must pass path to image as first argument to script.');
    });
});