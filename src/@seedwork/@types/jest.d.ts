import { FieldErrors } from "@seedwork/domain/validator/validator-fields.interface"

declare global{
    namespace jest{
        interface Matchers<R> {
            containErrorMessages: (expected: FieldErrors) => R
        }
    }
}

export {}