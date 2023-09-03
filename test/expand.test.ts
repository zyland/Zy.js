import { assertEquals } from "https://deno.land/std@0.201.0/assert/mod.ts"

import { Expr, expand, $ } from "../src/mod.ts"

Deno.test("Expand - Literal", () => {
    assertEquals(
        [{literal: "a"}],
        [...expand(
            {literal: "a"}
        )({literal: "any"})]
    )
})

Deno.test("Expand - Or", () => {
    assertEquals(
        [
            {literal: "a"},
            {literal: "b"},
        ],
        [...expand(
            {or: [
                {literal: "a"},
                {literal: "b"},
            ]}
        )({literal: "any"})]
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
            $(expand({ref: "pat"})({def: ["pat", pat]})).take(10).toArray()
        )
})