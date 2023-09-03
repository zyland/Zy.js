import { Expr, any } from "../Expr.ts"
import { and } from "./and.ts"

import { match, P } from "ts-pattern"
import { $_, $a, $b } from "util/select.ts"

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
    .otherwise(q => q)
}