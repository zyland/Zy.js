import { Expr, any } from "../Expr.ts"
import { and } from "./and.ts"
import { join } from "./join.ts"
import {
    add,
    sub,
    mul,
    div,
} from "./math.ts"

import { match, P } from "ts-pattern"
import { $, $_, $a, $b } from "util/select.ts"
import { f } from "util/f.ts"

export const call = (query: Expr, expr: Expr): Expr => {
    return match([query, expr])
    .with([{ref: $_}, P.any], name =>
        match(expr)
        .with({def: [name, $_]}, value => {
            return value
        })
        .with({and: [$a, $b]}, ({a, b}) => {
            return and(
                call({ref: name}, a),
                call({ref: name}, b),
            )
        })
        .otherwise(() => any)
    )
    .with([{arrow: [{literal: $a}, $b]}, P.any], ({a, b}) =>
        match(expr)
        .with({literal: a}, () => b)
        .otherwise(() => any)
    )
    .with([{arrow: [{capture: $a}, $b]}, P.any], ({a: [name, _type], b}) => // TODO: Type Checking
        match(expr)
        .with($_, () => call(b, {def: [name, expr]}))
        .otherwise(() => any)
    )
    .with([{call: [$a, $b]}, P.any], ({a, b}) => call(
        call(a, expr),
        call(b, expr),
    ))
    .with([{and: [$a, $b]}, P.any], ({a, b}) => and(
        call(a, expr),
        call(b, expr),
    ))
    .with(
        [{f: $("name"), args: $("args")}, P.any],
        ({name, args}) => (
            {
                join,
                add,
                sub,
                mul,
                div,
            }[name as "join"](
                ...args.map(arg => call(arg, expr)) as typeof args
            )
        )
    )
    .otherwise(_ => query)
}