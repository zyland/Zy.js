import { Expr, any, non, und } from "../Expr.ts"

import { match, P } from "../../deps.ts"
import { $a, commu } from "../util/mod.ts"

export const or = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with(commu([P.any, any]), () => any)
    .with(commu([$a, non]), ({a}) => a!)
    .with(commu([$a, und]), ({a}) => a!)
    .otherwise(_ => ({or: [a, b]}))