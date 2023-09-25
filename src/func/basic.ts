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

export const capture =
    (name: string, type: Expr): Expr =>
    ({capture: [name, type]})

export const guard =
    (f: Expr) =>
    ({guard: f})

export const js_arrow =
    (f: (x: Expr) => Expr) =>
    ({js_arrow: f})