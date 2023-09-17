import { Expr } from "../Expr.ts"

import { match } from "ts-pattern"
import { f, str$a, str$b } from "../util/mod.ts"

export const join = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with(
        [{literal: str$a}, {literal: str$b}],
        ({a, b}) => ({literal: a + b}),
    )
    .otherwise(() => f({join: [a, b]}))