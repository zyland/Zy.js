import { assertEquals } from "../deps.ts"
import { and } from "../mod.ts";

import {
    Expr,
    expand,
    Iter,
    any,

    add,
    arrow,
    call,
    capture,
    join,
    literal,
    sub,
    or,
    ref,
    def,
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
            join(
                or(
                    literal("1"),
                    literal("2"),
                ),
                or(
                    literal("3"),
                    literal("4"),
                ),
            )
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
    const pat =
        or(
            literal(""),
            or(
                join(
                    join(
                        literal("("),
                        ref("pat"),
                    ),
                    literal(")"),
                ),
                join(
                    ref("pat"),
                    or(
                        literal("x"),
                        literal("-"),
                    ),
                ),
            ),
        )
    assertEquals(
        Iter(expand(ref("pat"))(def(ref("pat"), pat))).take(10).toArray(),
        [
            literal(""),
            literal("()"),
            literal("x"),
            literal("(())"),
            literal("()x"),
            literal("(x)"),
            literal("-"),
            literal("((()))"),
            literal("()-"),
            literal("(()x)"),
        ],
    )
})

Deno.test("Expand - Recursion With External Function", () => {
    const paren =
        arrow(
            capture("pat", any),
            join(
                join(
                    literal("("),
                    ref("pat"),
                ),
                literal(")"),
            )
        )
    const pat =
        or(
            literal(""),
            or(
                join(
                    join(
                        literal("("),
                        ref("pat"),
                    ),
                    literal(")"),
                ),
                join(
                    ref("pat"),
                    or(
                        literal("x"),
                        literal("-"),
                    ),
                ),
            ),
        )
    const expr =
        and(
            def(
                ref("pat"),
                pat,
            ),
            def(
                ref("paren"),
                paren,
            ),
        )
    assertEquals(
        Iter(expand(ref("pat"))(expr)).take(10).toArray(),
        [
            literal(""),
            literal("()"),
            literal("x"),
            literal("(())"),
            literal("()x"),
            literal("(x)"),
            literal("-"),
            literal("((()))"),
            literal("()-"),
            literal("(()x)"),
        ],
    )
})
/*
Deno.test("Expand - Recursion", () => {
    const pat_0 =
        arrow(
            literal(1),
            literal(""),
        )
    const pat_n =
        arrow(
            capture("n", any),
            or(
                join(
                    join(
                        literal("("),
                        call(
                            ref("pat"),
                            sub(ref("n"), literal(1))
                        ),
                    ),
                    literal(")"),
                ),
                join(
                    call(
                        ref("pat"),
                        sub(ref("n"), literal(1))
                    ),
                    or(
                        literal("x"),
                        literal("-"),
                    ),
                ),
            ),
        )
    const pat = and(
        pat_0,
        pat_n,
    )
    const result =
        Iter(
            expand
                (
                    call(
                        ref("pat"),
                        literal("0"),
                    )
                )
                (def(ref("pat"), pat))
        ).toArray()
        
    assertEquals(
        result,
        [
            literal(""),
            literal("()"),
            literal("x"),
            literal("(())"),
            literal("()x"),
            literal("(x)"),
            literal("-"),
            literal("((()))"),
            literal("()-"),
            literal("(()x)"),
        ],
    )
})
*/
Deno.test("Expand - Join Refs", () => {
    assertEquals(
        [...expand(
            join(
                ref("a"),
                ref("b"),
            )
        )(and(
            def(ref("a"), or(
                literal("1"),
                literal("2"),
            )),
            def(ref("b"), or(
                literal("3"),
                literal("4"),
            )),
        ))],
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
        Iter(expand(ref("nat"))(def(
            ref("nat"),
            or(
                literal(1),
                add(
                    ref("nat"),
                    literal(1)
                )
            )
        ))).take(3).toArray(),
        [
            literal(1),
            literal(2),
            literal(3),
        ],
    )
})

Deno.test("Expand - Logic", () => {
    assertEquals(
        Iter(
            expand(
                and(
                    or(
                        literal(1),
                        literal(2),
                    ),
                    or(
                        literal(2),
                        literal(3),
                    ),
                )
            )(any)
        ).toArray(),
        [literal(2)]
    )
})