export type Expr =
    | {ref: string}
    | {literal: string}
    | {def: [string, Expr]}
    | {join: [Expr, Expr]}
    | {or: [Expr, Expr]}