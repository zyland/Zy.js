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
    num,
} from "../src/mod.ts"

Deno.test("Guard - Number", () => {
    assertEquals(
        and(
            num,
            or(
                literal(123),
                literal("456"),
            )
        ),
        literal(123),
    )
})