import { Expr, any } from "../Expr.ts"

import { match } from "ts-pattern"
import { $_ } from "../util/mod.ts"

export const or = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with([$_, any], _ => any)
    .with([any, $_], _ => any)
    .otherwise(_ => ({or: [a, b]}))