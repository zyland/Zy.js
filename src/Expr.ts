export type Expr =
    | {ref: string}
    | {literal: string}
    | {def: [string, Expr]}
    | {or: [Expr, Expr]}
    | {and: [Expr, Expr]}
    | {symbol: string}
    | {call: [Expr, Expr]}
    | {f: string, args: [Expr, Expr]}

export const any = {symbol: "any"}