import { Expr, any, non } from "../Expr.ts"
import { and } from "./and.ts"
import { or } from "./or.ts"
import { join } from "./join.ts"
import {
    add,
    sub,
    mul,
    div,
} from "./math.ts"

import { match, P } from "../../deps.ts"
import { $, $_, $a, $b, commu, toString } from "../util/mod.ts"

export const call_ = (query: Expr, expr: Expr): Expr => {
    return match([query, expr])
    .with([P.any, non], () => any)
    .with(
        [$("q"), {or: [$a, $b]}],
        ({a, b, q}) => or(call(q, a), call(q, b))
    )
    .with(
        [{ref: P.any}, {def: [{ref: P.any}, $_]}],
        ([{ref}, {def: [{ref: name}, _val]}]) => ref == name,
        val => val
    )
    .with(
        [{ref: $("name")}, {and: [$a, $b]}],
        ({name, a, b}) =>
            and(
                call({ref: name}, a),
                call({ref: name}, b),
            )
    )
    .with(
        [{ref: P.any}, P.any],
        (): Expr => ({call: [query, expr]})
        // () => any
    )
    .with(
        [{arrow: [{literal: P.any}, $_]}, {literal: P.any}],
        ([{arrow: [{literal: a1}, _]}, {literal: a2}]) => a1 == a2,
        val => val
    )
    .with(
        [{arrow: [{capture: $a}, $b]}, P.any],
        ({a: [name, type], b}) =>
        match(expr)
        .with($_, () => call(b, {def: [
            {ref: name},
            and(expr, type),
        ]}))
        .otherwise(() => any)
    )
    .with([{arrow: P.any}, P.any], () => any)
    .with([{call: [$a, $b]}, P.any], ({a, b}) => call(
        call(a, expr),
        call(b, expr),
    ))
    .with([{and: [$a, $b]}, P.any], ({a, b}) => and(
        call(a, expr),
        call(b, expr),
    ))
    .with(
        [{f: P.any, args: commu([non, P.any])}, P.any],
        () => any
    )
    .with(
        [{f: $("name"), args: $("args")}, P.any],
        ({name, args}) => {
            return {
                join,
                add,
                sub,
                mul,
                div,
            }[name as "join"](
                ...args.map(arg => call(arg, expr)) as typeof args
            )
        }
    )
    .with(
        [{js_arrow: $("f")}, $a],
        ({f, a}) => f(a)
    )
    .otherwise(_ => query)
}

let depth = 0

export const call = (query: Expr, expr: Expr): Expr => {
    if (depth > 100) throw "STACKOVERFLOW"
    depth++
    const result = call_(query, expr)
    console.log("call", depth)
    console.log("   ", toString(query))
    console.log("   ", toString(expr))
    console.log("    =", toString(result))
    depth--
    return result
}