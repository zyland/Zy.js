export type Expr =
    | {ref: string}
    | {literal: string}
    | {def: [string, Expr]}
    | {join: [Expr, Expr]}
    | {or: [Expr, Expr]}

import { match, P } from "https://esm.sh/ts-pattern@5.0.5"

export const calc = (query: Expr) => (expr: Expr): Expr => {
    return match(query)
    .with({ref: P.select()}, name =>
        match(expr)
        .with({def: [name, P.select()]}, value => {
            return value
        })
        .otherwise(() => ({literal: "any"}))
    )
    .with(P.select({literal: P.string}), x => x)
    .otherwise(q => q)
}

class LazyArray<T> {
    memory: T[] = []
    length?: number
    iterator
    constructor(iterable: Iterable<T>) {
        this.iterator = iterable[Symbol.iterator]()
    }
    at(index: number) {
        for (
            let i = this.memory.length;
            i <= index;
            i++
        ) {
            const {done, value} = this.iterator.next()
            if (done) {
                this.length = i
                break
            }
            this.memory[i] = value
        }
        return this.memory[index]
    }
}

import { $ } from "https://deno.land/x/iteruyo@v0.3.0/mod.ts"
export * from "https://deno.land/x/iteruyo@v0.3.0/mod.ts"

function* alternate<T>(as: Iterable<T>, bs:Iterable<T>) {
    const aIterator = as[Symbol.iterator]()
    const bIterator = bs[Symbol.iterator]()
    while (true) {
        const a = aIterator.next()
        const b = bIterator.next()
        a.done || (yield a.value)
        b.done || (yield b.value)
        if (a.done && b.done) break
    }
}

export const expand = (query: Expr) => function*(expr: Expr): Generator<Expr, void, undefined> {
    yield* match(calc(query)(expr))
    .with({or: [P.select("a"), P.select("b")]}, function*({a, b}) {
        yield* match([a, b])
        .with([{literal: P.string}, P.any], function*() {
            yield a
            yield* expand(b)(expr)
        })
        .with([P.any, {literal: P.string}], function*() {
            yield b
            yield* expand(a)(expr)
        })
        .otherwise(function*() {
            yield* alternate(
                expand(a)(expr),
                expand(b)(expr),
            )
        })
    })
    .with({join: [P.select("a"), P.select("b")]}, ({a, b}) => {
        const aStash = new LazyArray(expand(a)(expr))
        const bStash = new LazyArray(expand(b)(expr))
        return $(fill(x => !aStash.at(x), y => !bStash.at(y)))
            .map(([x, y]) => join(aStash.at(x), bStash.at(y)))
    })
    .otherwise(x => [x])
}

const join = (a: Expr, b: Expr): Expr =>
    match([a, b])
    .with(
        [{literal: P.select("x")}, {literal: P.select("y")}],
        ({x, y}) => ({literal: x + y}),
    )
    .otherwise(() => ({join: [a, b]}))

function* fill (
    isXEnd: (x: number) => boolean,
    isYEnd: (y: number) => boolean,
) {
    /* https://stackoverflow.com/a/34671333 */
    let x = 0
    let y = 0
    let down = false
    
    while (true) {
        yield [x, y]
        const even = ((x + y) % 2 == 0)
        if (even == down) {
            x--
            y++
            if (isYEnd(y)) {
                x += 2
                y--
            }
            if (x < 0) x = 0
        } else {
            x++
            y--
            if (isXEnd(x)) {
                x--
                y += 2
            }
            if (y < 0) y = 0
        }
    }
}