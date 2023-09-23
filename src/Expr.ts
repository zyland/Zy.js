export type Expr =
    | {ref: string}
    | {literal: string | number}
    | {def: [Expr, Expr]}
    | {or: [Expr, Expr]}
    | {and: [Expr, Expr]}
    | {symbol: string}
    | {call: [Expr, Expr]}
    | {arrow: [Expr, Expr]}
    | {capture: [string, Expr]}
    | {f: string, args: [Expr, Expr]}

export const any = {symbol: "any"}
export const non = {symbol: "non"}