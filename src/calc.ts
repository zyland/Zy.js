import { Expr, any } from "./Expr.ts"

import { match, P } from "ts-pattern"

export const calc = (query: Expr) => (expr: Expr): Expr => {
    return match(query)
    .with({ref: P.select()}, name =>
        match(expr)
        .with({def: [name, P.select()]}, value => {
            return value
        })
        .with({and: [P.select("a"), P.select("b")]}, ({a, b}) => {
            return calc({and: [
                calc({ref: name})(a),
                calc({ref: name})(b),
            ]})(expr)
        })
        .otherwise(() => any)
    )
    .with({and: [P.select(), any]}, x => x)
    .with({and: [any, P.select()]}, x => x)
    .with(P.select({literal: P.string}), x => x)
    .otherwise(q => q)
}