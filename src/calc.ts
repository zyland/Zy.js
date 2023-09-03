import { Expr } from "./Expr.ts"

import { match, P } from "ts-pattern"

export const calc = (query: Expr) => (expr: Expr): Expr => {
    return match(query)
    .with({ref: P.select()}, name =>
        match(expr)
        .with({def: [name, P.select()]}, value => {
            return value
        })
        .otherwise(() => ({literal: "any"}))
    )
    .with(P.select({literal: P.string}), x => x)
    .otherwise(q => q)
}