import { expect } from "chai";
import { isSubdir } from "../server/fs-util";

describe("fs util", () => {
    it("should recognize subdir", () => {
        expect(isSubdir("a", "a/b")).to.be.true;
    });
});
