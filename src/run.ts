import { Expr } from "./Expr.ts"
import { and, call } from "./func/mod.ts"

import { match, P } from "ts-pattern"
import { $, $a, $b } from "./util/mod.ts"

export const run = (expr: Expr): Expr => {
    return match(expr)
    .with({and: [$a, $b]}, ({a, b}) => and(a, b))
    .with({call: [$a, $b]}, ({a, b}) => call(a, b))
    .with($({literal: P.string}), x => x)
    .otherwise(q => q)
}