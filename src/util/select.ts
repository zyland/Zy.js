import { P } from "ts-pattern"

export const $ = P.select
export const $_ = P.select()
export const $a = P.select("a")
export const $b = P.select("b")