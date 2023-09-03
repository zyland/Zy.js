import { Expr, any } from "../Expr.ts"

import { match, P } from "ts-pattern"

export const and = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with([P.select(), any], x => x)
    .with([any, P.select()], x => x)
    .otherwise(_ => ({and: [a, b]}))