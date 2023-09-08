import { Expr, any } from "../Expr.ts"
import { and } from "./and.ts"
import { join } from "./join.ts"

import { match, P } from "ts-pattern"
import { $_, $a, $b } from "util/select.ts"
import { f } from "util/f.ts"

export const call = (query: Expr, expr: Expr): Expr => {
    return match(query)
    .with({ref: $_}, name =>
        match(expr)
        .with({def: [name, $_]}, value => {
            return value
        })
        .with({and: [$a, $b]}, ({a, b}) => {
            return and(
                call({ref: name}, a),
                call({ref: name}, b),
            )
        })
        .otherwise(() => any)
    )
    .with({arrow: [{literal: $a}, $b]}, ({a, b}) =>
        match(expr)
        .with({literal: a}, () => b)
        .otherwise(() => any)
    )
    .with(f({join: [$a, $b]}), ({a, b}) =>
        join(call(a, expr), call(b, expr))
    )
    .otherwise(q => q)
}