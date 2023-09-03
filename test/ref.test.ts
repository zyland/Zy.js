import { assertEquals } from "std/assert"

import { calc } from "../src/mod.ts"

Deno.test("Ref - And", () => {
    assertEquals(
        calc({ref: "a"})({
            and: [
                {def: ["a", {literal: "hello"}]},
                {def: ["b", {literal: "world"}]},
            ]
        }),
        {literal: "hello"},
    )
    assertEquals(
        calc({ref: "b"})({
            and: [
                {def: ["a", {literal: "hello"}]},
                {def: ["b", {literal: "world"}]},
            ]
        }),
        {literal: "world"},
    )
})

Deno.test("Ref - Nested And", () => {
    assertEquals(
        calc({ref: "b"})({
            and: [
                {def: ["a", {literal: "hello"}]},
                {and: [
                    {def: ["b", {literal: "world"}]},
                    {def: ["c", {literal: "1234"}]},
                ]}
            ]
        }),
        {literal: "world"},
    )
})