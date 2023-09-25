import { guard, js_arrow } from "../func/basic.ts"
import { non } from "../Expr.ts"

export const predicate =
    (check: (x: string | number) => boolean) =>
    guard(
        js_arrow(
            x => ("literal" in x && check(x.literal))
                ? x
                : non
        )
    )

export const num = 
    predicate(x =>
        typeof x == "number"
    )

export const str = 
    predicate(x =>
        typeof x == "string"
    )