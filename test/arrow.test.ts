import {
    assertEquals,
    assertNotEquals,
} from "std/assert"

import { call, any } from "../src/mod.ts"
import { f } from "util/f.ts"

Deno.test("Arrow - Match Literal", () => {
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

Deno.test("Arrow - Multiple Match", () => {
    assertEquals(
        call(
            {and: [
                {arrow: [
                    {literal: "1"},
                    {literal: "2"},
                ]},
                {arrow: [
                    {literal: "2"},
                    {literal: "4"},
                ]},
            ]},
            {literal: "2"},
        ),
        {literal: "4"},
    )
})

Deno.test("Arrow - Capture", () => {
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