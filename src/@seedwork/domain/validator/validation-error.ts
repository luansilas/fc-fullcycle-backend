import { FieldErrors } from "./validator-fields.interface"

export class EntityValidationError extends Error{
    constructor(public error: FieldErrors){
        super("Entity Validation Error");
        this.name = "[Entity Validation Error]"

    }
}