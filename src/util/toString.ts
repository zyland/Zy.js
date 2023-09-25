import { Expr } from "../Expr.ts"
import { match, P } from "../../deps.ts"
import { $, $_, $a, $b } from "../util/mod.ts"

export const toString =
    (expr: Expr): string =>
    match(expr)
    .with(
        {ref: $_},
        s => `${s}`
    )
    .with(
        {literal: $(P.string)},
        s => `"${s}"`
    )
    .with(
        {literal: $(P.number)},
        s => `${s}`
    )
    .with(
        {symbol: $_},
        s => `${s.toUpperCase()}`
    )

    .with(
        {def: [$a, $b]},
        ({a, b}) =>
            `def(${
                toString(a)
            }, ${
                toString(b)
            })`
    )
    .with(
        {or: [$a, $b]},
        ({a, b}) =>
            `or(${
                toString(a)
            }, ${
                toString(b)
            })`
    )
    .with(
        {and: [$a, $b]},
        ({a, b}) =>
            `and(${
                toString(a)
            }, ${
                toString(b)
            })`
    )
    .with(
        {call: [$a, $b]},
        ({a, b}) =>
            `call(${
                toString(a)
            }, ${
                toString(b)
            })`
    )
    .with(
        {arrow: [$a, $b]},
        ({a, b}) =>
            `arrow(${
                toString(a)
            }, ${
                toString(b)
            })`
    )
    
    .with(
        {capture: [$a, $b]},
        ({a, b}) =>
            `$${a}{${toString(b)}})`
    )

    .with(
        {guard: $_},
        e => `guard(${toString(e)})`
    )

    .with(
        {js_arrow: $_},
        e => `[JS]`
    )

    .with(
        {f: $("name"), args: [$a, $b]},
        ({name, a, b}) => `${name}(${
            toString(a)
        }, ${
            toString(b)
        })`
    )
    .exhaustive()
