import { identity, templateSettings } from "lodash"
import { CategoryValidator, CategoryValidatorFactory } from "./category.validator"
import exp from "constants"
import { CategoryRules } from "./category.validator"
import Category from "../entities/category"

describe("Category Validator Tests", () => {


    test("Invalidation cases for name field", () => {

        const arrange = [{
            data: null as any,
            expected: {
                name: [
                    'name should not be empty',
                    'name must be a string',
                    'name must be shorter than or equal to 255 characters'
                ]
            }
        }, {
            data: { name: "" },
            expected: {
                name: ['name should not be empty']
            }
        }, {
            data: { name: 5 as any },
            expected: {
                name: [
                    'name must be a string',
                    "name must be shorter than or equal to 255 characters"
                ]
            }
        }, {
            data: { name: 't'.repeat(256) },
            expected: {
                name: ['name must be shorter than or equal to 255 characters']
            }
        }]

        for (const item of arrange) {
            const validator = CategoryValidatorFactory.create()
            expect({ validator, data: item.data }).containErrorMessages(item.expected)
        }


    })

    test("Valid cases for name field", () => {
        const created_at = new Date()
        const arrange = [{
            name: "Movie"
        }, {
            name: "Movie",
            description: "Some description"
        }, {
            name: "Movie",
            description: "Some description"
        }, {
            name: "Movie",
            description: null
        }, {
            name: "Movie",
            is_active: true
        }, {
            name: "Movie",
            is_active: false
        }, {
            name: "Movie", created_at
        }]

        for (const item of arrange) {
            const validator = CategoryValidatorFactory.create()
            const is_valid = validator.validate(item)
            expect(is_valid).toBeTruthy()
            expect(validator.validatedData).toStrictEqual(new CategoryRules(item))
        }


    })

    test("invalidation cases for description", () => {
        const validator = CategoryValidatorFactory.create()


        expect({
            data: {
                'name': "Movie",
                description: 5 as any
            }, validator
        }).containErrorMessages({
            description: ['description must be a string']
        })


    })

    test("Invalidation cases for is_active", () => {
        const validator = CategoryValidatorFactory.create()


        expect({
            data: {
                'name': "Movie",
                is_active: 1 as any
            }, validator
        }).containErrorMessages({
            is_active: ['is_active must be a boolean value']
        })

        // let is_valid = validator.validate({
        //     'name': "Movie",
        //     is_active: 1 as any
        // })


        // expect(is_valid).toBe(false)
        // expect(validator.errors['is_active']).toStrictEqual([
        //     'is_active must be a boolean value'
        // ])

    })

    test("Invalidation cases for created_at", () => {

        const validator = CategoryValidatorFactory.create()

        expect({
            data: {
                'name': "Movie",
                created_at: '2023' as any
            }, validator
        }).containErrorMessages({
            created_at: [ 'created_at must be a Date instance' ]
        })


       
    })
})