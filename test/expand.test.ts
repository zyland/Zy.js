import { assertEquals } from "../deps.ts"

import {
    Expr,
    expand,
    Iter,
    any,
    literal,
    or,
} from "../src/mod.ts"
import { f } from "../src/util/mod.ts"

Deno.test("Expand - Literal", () => {
    assertEquals(
        [...expand(
            literal("a")
        )(any)],
        [literal("a")],
    )
})

Deno.test("Expand - Or", () => {
    assertEquals(
        [...expand(
            or(
                literal("a"),
                literal("b"),
            )
        )(any)],
        [
            literal("a"),
            literal("b"),
        ],
    )
})

Deno.test("Expand - Join", () => {
    assertEquals(
        [...expand(
            f({
                join: [
                    or(
                        literal("1"),
                        literal("2"),
                    ),
                    or(
                        literal("3"),
                        literal("4"),
                    ),
                ]
            })
        )(any)],
        [
            literal("13"),
            literal("23"),
            literal("14"),
            literal("24"),
        ],
    )
})

Deno.test("Expand - Recursion", () => {
    const pat: Expr =
        or(
            literal(""),
            or(
                f({join: [
                    f({join:
                        [
                            literal("("),
                            {ref: "pat"},
                        ]
                    }),
                    literal(")"),
                ]}),
                f({join: [
                    {ref: "pat"},
                    or(
                        literal("x"),
                        literal("-"),
                    ),
                ]}),
            ),
        )
        assertEquals(
            Iter(expand({ref: "pat"})({def: [{ref: "pat"}, pat]})).take(10).toArray(),
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

Deno.test("Expand - Join Refs", () => {
    assertEquals(
        [...expand(
            f({
                join: [
                    {ref: "a"},
                    {ref: "b"},
                ]
            })
        )({and: [
            {def: [{ref: "a"}, or(
                literal("1"),
                literal("2"),
            )]},
            {def: [{ref: "b"}, or(
                literal("3"),
                literal("4"),
            )]},
        ]})],
        [
            literal("13"),
            literal("23"),
            literal("14"),
            literal("24"),
        ],
    )
})

Deno.test("Expand - Recursive Math", () => {
    assertEquals(
        Iter(expand({ref: "nat"})({def: [
            {ref: "nat"},
            or(
                literal(1),
                f({add: [
                    {ref: "nat"},
                    literal(1)
                ]})
            )
            
        ]})).take(3).toArray(),
        [
            literal(1),
            literal(2),
            literal(3),
        ],
    )
})