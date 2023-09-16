import { Expr } from "../Expr.ts"

import { match } from "ts-pattern"
import { str$a, str$b } from "$util"
import { f } from "$util"

export const join = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with(
        [{literal: str$a}, {literal: str$b}],
        ({a, b}) => ({literal: a + b}),
    )
    .otherwise(() => f({join: [a, b]}))