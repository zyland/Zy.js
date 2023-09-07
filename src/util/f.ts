import { Expr } from "../Expr.ts"

export const f =
    <
        T extends string,
        Es extends [unknown] | [unknown, unknown]
    >
    (o: {[k in T]: Es}) => {
        const [[f, args]] = Object.entries(o)
        return {f, args} as {f: T, args: Es}
    }