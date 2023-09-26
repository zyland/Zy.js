import {
    assertEquals,
    assertNotEquals,
} from "../../deps.ts"

import {
    call,
    any,
    
    and,
    arrow,
    capture,
    add,
    sub,
    mul,
    ref,
    def,
    literal,
    or,
    guard,
    js_arrow,

    predicate,
} from "../../src/mod.ts"

import {
    toString
} from "../../src/util/mod.ts"

Deno.test("Fibonacci", () => {
    const fib = 
        and(
            and(
                arrow(
                    literal(0),
                    literal(0),
                ),
                arrow(
                    literal(1),
                    literal(1),
                )
            ),
            arrow(
                capture(
                    "n",
                    predicate(
                        n => {
                            console.log(n)
                            return typeof n == "number"
                            && n > 1
                        }
                    ),
                ),
                add(
                    call(
                        ref("fib"),
                        sub(
                            ref("n"),
                            literal(1),
                        )
                    ),
                    call(
                        ref("fib"),
                        sub(
                            ref("n"),
                            literal(2),
                        )
                    ),
                ),
            ),
        )
    assertEquals(
        call(
            call(
                ref("fib"),
                literal(2),
            ),
            def(ref("fib"), fib),
        ),
        literal(1),
    )
})