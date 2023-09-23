import { Expr } from "../Expr.ts";

export const literal =
    (value: string | number) =>
    ({literal: value})

export const ref =
    (name: string) =>
    ({ref: name})

export const def =
    (name: Expr, expr: Expr): Expr =>
    ({def: [name, expr]})

export const arrow =
    (from: Expr, to: Expr): Expr =>
    ({arrow: [from, to]})