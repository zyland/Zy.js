import { Expr, any, non, und } from "../Expr.ts"
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
    .with([P.any, non], () => non)
    .with(
        [$("q"), {or: [$a, $b]}],
        ({a, b, q}) => or(call(q, a), call(q, b))
    )
    .with(
        [$("q"), {and: [$a, $b]}],
        ({a, b, q}) => and(call(q, a), call(q, b))
    )
    .with(
        [{ref: P.any}, {def: [{ref: P.any}, $_]}],
        ([{ref}, {def: [{ref: name}, _val]}]) => ref == name,
        val => val
    )
    // TODO: Remove these
        .with(
            [$({ref: P.any}), {def: P.any}],
            x => x
        )
        .with(
            [$({js_arrow: P.any}), {def: P.any}],
            x => x
        )
    //
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
        .with($_, () =>
            match(and(expr, type))
            .with(non, () => und)
            .otherwise(v => call(b, {def: [{ref: name}, v]}))
        )
        .exhaustive()
    )
    .with([{arrow: P.any}, P.any], () => und)
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
    .otherwise(_ => and(query, expr))
}

let depth = 0
const querying = new Set()

const id = (query: Expr, expr: Expr) => toString(query)+"@@"+toString(expr)

export const call = (query: Expr, expr: Expr): Expr => {
    if (depth > 30) throw "STACKOVERFLOW"
    depth++
    //console.log("    ".repeat(depth-1)+"call", depth)
    console.log("    ".repeat(depth)+toString(query) + " " + toString(expr))
    const nowId = id(query, expr)
    if (querying.has(nowId)) {
        throw "LOOP DETECTED"
    } else {
        querying.add(nowId)
    }
    const result = call_(query, expr)
    console.log("    ".repeat(depth+1)+"= "+toString(result)+"\n")
    depth--
    querying.delete(nowId)
    return result
}