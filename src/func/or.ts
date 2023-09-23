import { Expr, any, non } from "../Expr.ts"

import { match, P } from "../../deps.ts"
import { $a, commu } from "../util/mod.ts"

export const or = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with(commu([$a, non]), ({a}) => a!)
    .with(commu([P.any, any]), () => any)
    .otherwise(_ => ({or: [a, b]}))