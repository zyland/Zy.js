import { guard, js_arrow } from "../func/basic.ts"
import { Expr, non } from "../Expr.ts"

const predicate =
    (check: (x: Expr) => boolean) =>
    guard(
        js_arrow(
            x => check(x) ? x : non
        )
    )

export const num = 
    predicate(x =>
        "literal" in x &&
        typeof x?.literal == "number"
    )

export const str = 
    predicate(x =>
        "literal" in x &&
        typeof x?.literal == "string"
    )