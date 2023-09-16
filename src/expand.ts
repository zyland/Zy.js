import { Expr } from "./Expr.ts"
import { call, expandable } from "./func/mod.ts"

import { match, P } from "ts-pattern"
import { $ as Iter } from "iteruyo"
import { $, $a, $b, f } from "$util"
export * from "iteruyo"

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
    yield* match(call(query, expr))
    .with({or: [$a, $b]}, function*({a, b}) {
        yield* match([a, b])
        .with([{literal: P.any}, P.any], function*() {
            yield a
            yield* expand(b)(expr)
        })
        .with([P.any, {literal: P.any}], function*() {
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
    .with({f: $("f"), args: [$a, $b]}, ({f, a, b}) => {
        const aStash = new LazyArray(expand(a)(expr))
        const bStash = new LazyArray(expand(b)(expr))
        return Iter(fill(x => !aStash.at(x), y => !bStash.at(y)))
            .map(([x, y]) => expandable[f](aStash.at(x), bStash.at(y)))
    })
    .otherwise(x => [x])
}

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
        if (isXEnd(x) || isYEnd(y)) break
    }
}