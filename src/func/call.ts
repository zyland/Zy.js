import { Expr, any } from "../Expr.ts"
import { and } from "./and.ts"

import { match, P } from "ts-pattern"

export const call = (query: Expr, expr: Expr): Expr => {
    return match(query)
    .with({ref: P.select()}, name =>
        match(expr)
        .with({def: [name, P.select()]}, value => {
            return value
        })
        .with({and: [P.select("a"), P.select("b")]}, ({a, b}) => {
            return and(
                call({ref: name}, a),
                call({ref: name}, b),
            )
        })
        .otherwise(() => any)
    )
    .otherwise(q => q)
}