import { Expr } from "./Expr.ts"
import { and, call } from "./func/mod.ts"

import { match, P } from "ts-pattern"

export const run = (expr: Expr): Expr => {
    return match(expr)
    .with({and: [P.select("a"), P.select("b")]}, ({a, b}) => and(a, b))
    .with({call: [P.select("a"), P.select("b")]}, ({a, b}) => call(a, b))
    .with(P.select({literal: P.string}), x => x)
    .otherwise(q => q)
}