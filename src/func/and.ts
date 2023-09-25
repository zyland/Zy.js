import { Expr, any, non } from "../Expr.ts"

import { match, P } from "../../deps.ts"
import { $, $a, $b, commu } from "../util/mod.ts"

import { call } from "./call.ts"
import { or } from "./or.ts"

export const and = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with(
        commu([
            {or: [$("a1"), $("a2")] as const},
            $b,
        ]),
        ({a1, a2, b}) => {
            return or(
                and(a1!, b!),
                and(a2!, b!),
            )
        }
    )
    .with(
        [{literal: $a}, {literal: $b}],
        ({a, b}) => {
            return a === b
                ? {literal: a}
                : non
        }
    )
    .with(
        commu([
            {guard: $a},
            $b,
        ]),
        ({a, b}) => call(a!, b!)
    )
    .with(commu([P.any, non]), () => non)
    .with(commu([$a, any]), ({a}) => a!)
    .otherwise(_ => ({and: [a, b]}))