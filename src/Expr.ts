export type Expr =
    | {ref: string}
    | {literal: string}
    | {def: [string, Expr]}
    | {join: [Expr, Expr]}
    | {or: [Expr, Expr]}
    | {and: [Expr, Expr]}
    | {symbol: string}
    | {call: [Expr, Expr]}

export const any = {symbol: "any"}