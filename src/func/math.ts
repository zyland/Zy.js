import { Expr } from "../Expr.ts"

import { match } from "ts-pattern"
import { num$a, num$b } from "../util/mod.ts"

const math =
    (name: string, func: (a: number, b: number) => number) =>
    (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with(
        [{literal: num$a}, {literal: num$b}],
        ({a, b}) => ({literal: func(a, b)})
    )
    .otherwise(() => ({f: name, args: [a, b]}))

export const add = math("add", (a, b) => a + b)
export const sub = math("sub", (a, b) => a - b)
export const mul = math("mul", (a, b) => a * b)
export const div = math("div", (a, b) => a / b)