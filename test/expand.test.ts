import { assertEquals } from "std/assert"

import { Expr, expand, $ } from "../src/mod.ts"

Deno.test("Expand - Literal", () => {
    assertEquals(
        [...expand(
            {literal: "a"}
        )({literal: "any"})],
        [{literal: "a"}],
    )
})

Deno.test("Expand - Or", () => {
    assertEquals(
        [...expand(
            {or: [
                {literal: "a"},
                {literal: "b"},
            ]}
        )({literal: "any"})],
        [
            {literal: "a"},
            {literal: "b"},
        ],
    )
})

Deno.test("Expand - Recursion", () => {
    const pat: Expr =
        {or: [
            {literal: ""},
            {or: [
                {join: [
                    {join:
                        [
                            {literal: "("},
                            {ref: "pat"},
                        ]
                    },
                    {literal: ")"},
                ]},
                {join: [
                    {ref: "pat"},
                    {or: [
                        {literal: "x"},
                        {literal: "-"},
                    ]},
                ]},
            ]},
        ]}
        assertEquals(
            $(expand({ref: "pat"})({def: ["pat", pat]})).take(10).toArray(),
            [
                { literal: "" },
                { literal: "()" },
                { literal: "x" },
                { literal: "(())" },
                { literal: "()x" },
                { literal: "(x)" },
                { literal: "-" },
                { literal: "((()))" },
                { literal: "()-" },
                { literal: "(()x)" },
            ],
        )
})