import {
    assertEquals,
    assertNotEquals,
} from "../deps.ts"

import {
    call,
    any,
    
    and,
    arrow,
    capture,
    mul,
    ref,
    def,
    literal,
    or,
    js_arrow,
    guard,
    non,
} from "../src/mod.ts"

Deno.test("Guard - Number", () => {
    assertEquals(
        and(
            guard(
                js_arrow(
                    x =>
                        ("literal" in x &&
                        typeof x?.literal == "number")
                            ? x
                            : non
                )
            ),
            or(
                literal(123),
                literal("456"),
            )
        ),
        literal(123),
    )
})