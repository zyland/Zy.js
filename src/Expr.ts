export type Expr =
    | {ref: string}
    | {literal: string | number}
    | {symbol: string}

    | {def: [Expr, Expr]}
    | {or: [Expr, Expr]}
    | {and: [Expr, Expr]}
    | {call: [Expr, Expr]}
    | {arrow: [Expr, Expr]}

    | {capture: [string, Expr]}

    | {guard: Expr}
    
    | {js_arrow: (x: Expr) => Expr}

    | {f: string, args: [Expr, Expr]}

export const any = {symbol: "any"}
export const non = {symbol: "non"}
export const und = {symbol: "und"}