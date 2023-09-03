import { Expr, any } from "../Expr.ts"

import { match } from "ts-pattern"
import { $_ } from "util/select.ts"

export const and = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with([$_, any], x => x)
    .with([any, $_], x => x)
    .otherwise(_ => ({and: [a, b]}))