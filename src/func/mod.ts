export * from "./and.ts"
export * from "./call.ts"
export * from "./join.ts"
export * from "./basic.ts"
export * from "./math.ts"
export * from "./or.ts"

import { join, or, add, sub, mul, div } from "./mod.ts"

import { Expr } from "../Expr.ts"

export const expandable: Record<string, (a: Expr, b: Expr) => Expr> = 
    { join, or, add, sub, mul, div }