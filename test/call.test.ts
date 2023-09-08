import {
    assertEquals,
    assertNotEquals,
} from "std/assert"

import { call } from "../src/mod.ts"
import { f } from "util/f.ts"

Deno.test("Call - Ref - And", () => {
    assertEquals(
        call({ref: "a"}, {
            and: [
                {def: ["a", {literal: "hello"}]},
                {def: ["b", {literal: "world"}]},
            ]
        }),
        {literal: "hello"},
    )
    assertEquals(
        call({ref: "b"}, {
            and: [
                {def: ["a", {literal: "hello"}]},
                {def: ["b", {literal: "world"}]},
            ]
        }),
        {literal: "world"},
    )
})

Deno.test("Call - Ref - Nested And", () => {
    assertEquals(
        call({ref: "b"}, {
            and: [
                {def: ["a", {literal: "hello"}]},
                {and: [
                    {def: ["b", {literal: "world"}]},
                    {def: ["c", {literal: "1234"}]},
                ]}
            ]
        }),
        {literal: "world"},
    )
})

Deno.test("Call - Join", () => {
    assertEquals(
        call(f({join: [{ref: "a"}, {ref: "b"}]}), {
            and: [
                {def: ["a", {literal: "hello"}]},
                {def: ["b", {literal: "world"}]},
            ]
        }),
        {literal: "helloworld"},
    )
})

Deno.test("Call - Arrow - Match Literal", () => {
    assertEquals(
        call(
            {arrow: [
                {literal: "hello"},
                {literal: "bye"},
            ]},
            {literal: "hello"},
        ),
        {literal: "bye"},
    )
    assertNotEquals(
        call(
            {arrow: [
                {literal: "hello"},
                {literal: "bye"},
            ]},
            {literal: "hell"},
        ),
        {literal: "bye"},
    )
})