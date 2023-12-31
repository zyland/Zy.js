import {
    assertEquals,
    assertNotEquals,
} from "../deps.ts"
import { mul } from "../mod.ts";

import {
    call,
    any,
    
    and,
    ref,
    def,
    join,
    literal,
} from "../src/mod.ts"
import { f } from "../src/util/mod.ts"

Deno.test("Call - Ref - And", () => {
    assertEquals(
        call(
            ref("a"),
            and(
                def(ref("a"), literal("hello")),
                def(ref("b"), literal("world")),
            )
        ),
        literal("hello"),
    )
    assertEquals(
        call(
            ref("b"),
            and(
                def(ref("a"), literal("hello")),
                def(ref("b"), literal("world")),
            )
        ),
        literal("world"),
    )
})

Deno.test("Call - Ref - Nested And", () => {
    assertEquals(
        call(
            ref("b"),
            and(
                def(ref("a"), literal("hello")),
                and(
                    def(ref("b"), literal("world")),
                    def(ref("c"), literal("1234")),
                )
            )
        ),
        literal("world"),
    )
})

Deno.test("Call - Ref - Nested Complex", () => {
    assertEquals(
        call(
            {call: [ref("area"), ref("square")]},
            and(
                def(
                    ref("square"),
                    and(
                        def(ref("w"), literal(12)),
                        def(ref("h"), literal(5)),
                    )
                ),
                def(
                    ref("area"),
                    mul(
                        ref("w"),
                        ref("h"),
                    )
                )
            )
        ),
        literal(60),
    )
})

Deno.test("Call - Join", () => {
    assertEquals(
        call(
            join(ref("a"), ref("b")),
            and(
                def(ref("a"), literal("hello")),
                def(ref("b"), literal("world")),
            )
        ),
        literal("helloworld"),
    )
})

Deno.test("Call - Math", () => {
    assertEquals(
        call(
            mul(ref("a"), ref("b")),
            and(
                def(ref("a"), literal(12)),
                def(ref("b"), literal(5)),
            )
        ),
        literal(60),
    )
})