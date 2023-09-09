import {
    assertEquals,
    assertNotEquals,
} from "std/assert"

import { call, any } from "../src/mod.ts"
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

Deno.test("Call - Ref - Nested Complex", () => {
    assertEquals(
        call({call: [{ref: "area"}, {ref: "square"}]},
            {and: [
                {def: [
                    "square",
                    {and: [
                        {def: ["w", {literal: 12}]},
                        {def: ["h", {literal: 5}]},
                    ]}
                ]},
                {def: [
                    "area",
                    f({mul: [
                        {ref: "w"},
                        {ref: "h"},
                    ]})
                ]}
            ]}
        ),
        {literal: 60},
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

Deno.test("Call - Math", () => {
    assertEquals(
        call(f({mul: [{ref: "a"}, {ref: "b"}]}), {
            and: [
                {def: ["a", {literal: 12}]},
                {def: ["b", {literal: 5}]},
            ]
        }),
        {literal: 60},
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

Deno.test("Call - Arrow - Capture", () => {
    assertEquals(
        call(
            {arrow: [
                {capture: ["n", any]},
                f({mul: [{ref: "n"}, {literal: 2}]}),
            ]},
            {literal: 123},
        ),
        {literal: 246},
    )
})