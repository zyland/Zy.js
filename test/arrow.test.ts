import {
    assertEquals,
    assertNotEquals,
} from "../deps.ts"

import {
    call,
    any,
    und,
    
    and,
    arrow,
    capture,
    mul,
    ref,
    def,
    literal,
    or,

    num,
    str,
} from "../src/mod.ts"
import { f } from "../src/util/mod.ts"

Deno.test("Arrow - Match Literal", () => {
    assertEquals(
        call(
            arrow(
                literal("hello"),
                literal("bye"),
            ),
            literal("hello"),
        ),
        literal("bye"),
    )
    assertNotEquals(
        call(
            arrow(
                literal("hello"),
                literal("bye"),
            ),
            literal("hell"),
        ),
        literal("bye"),
    )
})

Deno.test("Arrow - Multiple Match", () => {
    assertEquals(
        call(
            and(
                arrow(
                    literal("1"),
                    literal("2"),
                ),
                arrow(
                    literal("2"),
                    literal("4"),
                ),
            ),
            literal("2"),
        ),
        literal("4"),
    )
})

Deno.test("Arrow - Capture", () => {
    assertEquals(
        call(
            arrow(
                capture("n", any),
                mul(ref("n"), literal(2)),
            ),
            literal(123),
        ),
        literal(246),
    )
})

Deno.test("Arrow - Junction", () => {
    assertEquals(
        call(
            arrow(
                capture("n", any),
                mul(ref("n"), literal(2)),
            ),
            or(literal(10), literal(20)),
        ),
        or(literal(20), literal(40)),
    )
})

Deno.test("Arrow - Typed Capture", () => {
    assertEquals(
        call(
            arrow(
                capture("n", num),
                mul(ref("n"), literal(2)),
            ),
            literal(123),
        ),
        literal(246),
    )
    assertEquals(
        call(
            arrow(
                capture("n", str),
                mul(ref("n"), literal(2)),
            ),
            literal(123),
        ),
        und,
    )
})
