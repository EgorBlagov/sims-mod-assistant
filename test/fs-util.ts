import { expect } from "chai";
import { isWithinSameDir } from "../server/fs-util";

describe("fs util", () => {
    it("should recognize subdir", () => {
        const truthySet = [
            ["a", "a/b"],
            ["a", "a/b/c/d"],
            ["C:/a/b/c-d-e", "C:/a/b/c-d-e/f"],
            [
                "C:\\Users\\username\\Documents\\Some path\\Subidr name\\Mods",
                "C:\\Users\\username\\Documents\\Some path\\Subidr name\\Mods\\1",
            ],
        ];

        for (const [parent, child] of truthySet) {
            expect(isWithinSameDir(parent, child), `invalid ${parent} ${child}`).to.be.true;
        }
    });

    it("should recongnize samedir", () => {
        const truthySet = [
            [
                "C:\\Users\\username\\Documents\\Some path\\Subidr name\\Mods",
                "C:\\Users\\username\\Documents\\Some path\\Subidr name\\Mods",
            ],
            ["C:\\Users\\username\\Documents\\", "C:\\Users\\username\\Documents\\"],
            ["a\\b", "a/b"],
        ];

        for (const [parent, child] of truthySet) {
            expect(isWithinSameDir(parent, child), `invalid ${parent} ${child}`).to.be.true;
        }
    });

    it("should recognize not samedir", () => {
        const falsySet = [
            ["a", "b/b"],
            ["a", "c/b/c/d"],
            ["C:/a/b/c-d-e", "C:/a/b/c-d-e-1/f"],
            [
                "C:\\Users\\username\\Documents\\Some path\\Subidr name\\Mods",
                "C:\\Users\\username\\Documents\\Some path\\Subidr name\\Mods-sorted\\1",
            ],
        ];

        for (const [parent, child] of falsySet) {
            expect(isWithinSameDir(parent, child), `invalid ${parent} ${child}`).to.be.false;
        }
    });
});
