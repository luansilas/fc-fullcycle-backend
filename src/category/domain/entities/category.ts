import { EntityValidationError } from './../../../@seedwork/domain/validator/validation-error';

import { Entity } from "../../../@seedwork/domain/entity/entity"
import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo"
import { CategoryValidatorFactory } from "../validators/category.validator"



export type CategoryProperties = {
    name: string
    description?: string
    is_active?: boolean
    created_at?: Date
}
export default class Category extends Entity<CategoryProperties>{




    constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
        Category.validate(props)
        super(props, id)

        this.props.is_active = props.is_active ?? true
        this.props.description = props.description ?? null
        this.props.created_at = props.created_at ?? new Date()
    }

    static validate(props: CategoryProperties) {
        const validator = CategoryValidatorFactory.create()
        const isValid = validator.validate(props)

        if (!isValid) {
            throw new EntityValidationError(validator.errors)
        }

    }

    get name(): string {
        return this.props.name
    }

    get description(): string {
        return this.props.description
    }

    private set description(value: string) {
        this.props.description = value ?? null
    }

    get is_active(): boolean {
        return this.props.is_active
    }

    private set is_active(value: boolean) {
        this.props.is_active = value ?? true
    }

    get created_at(): Date {
        return this.props.created_at
    }


    update(name: string, description: string) {
        Category.validate({ name, description });
        this.props.name = name
        this.description = description
    }

    activate() {
        this.props.is_active = true
    }

    deactivate() {
        this.props.is_active = false
    }

}