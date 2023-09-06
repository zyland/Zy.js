import { Expr } from "../Expr.ts"

import { match } from "ts-pattern"
import { $a, $b } from "util/select.ts"

export const join = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with(
        [{literal: $a}, {literal: $b}],
        ({a, b}) => ({literal: a + b}),
    )
    .otherwise(() => ({join: [a, b]}))