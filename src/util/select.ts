import { P } from "../../deps.ts"

export const $ = P.select
export const $_ = $()
export const $a = $("a")
export const $b = $("b")
export const str$a = $("a", P.string)
export const str$b = $("b", P.string)
export const num$a = $("a", P.number)
export const num$b = $("b", P.number)
export const commu =
    <A, B>
    ([a, b]: [A, B]) =>
    P.union(
        [a, b],
        [b, a],
    )