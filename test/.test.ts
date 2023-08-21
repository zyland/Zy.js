import { Expr, expand, $ } from "../src/mod.ts"

const pat: Expr =
    {or: [
        {literal: ""},
        {or: [
            {join: [
                {join:
                    [
                        {literal: "("},
                        {ref: "pat"},
                    ]
                },
                {literal: ")"},
            ]},
            {join: [
                {ref: "pat"},
                {or: [
                    {literal: "x"},
                    {literal: "-"},
                ]},
            ]},
        ]},
    ]}

console.log($(expand({ref: "pat"})({def: ["pat", pat]})).take(100).toArray())

;([...expand(
    {or: [
        {literal: "a"},
        {literal: "b"},
    ]}
)({literal: "any"})])