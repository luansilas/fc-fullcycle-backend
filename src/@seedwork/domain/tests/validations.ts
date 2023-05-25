import { assert } from "console"
import { ClassValidatorFields } from "../validator/class-validator-fields"
import { EntityValidationError } from "../validator/validation-error"
import { FieldErrors } from "../validator/validator-fields.interface"


type Expect ={ validator: ClassValidatorFields<any>, data: any} | (() => any);

expect.extend({
    containErrorMessages( expected: Expect , received: FieldErrors) {
        if(typeof expected === "function"){
            try{
                expected();
                return {
                    pass: false,
                    message: ()=> "Function did not throw"
                }
            } catch(e){
                const error = e as EntityValidationError;
                return assertContainErrorMessages(received,error.error)
        
            }
        }
        else {

            const {validator, data} = expected;
            const isValid = validator.validate(data);
            if(isValid){
                return {
                    pass: false,
                    message: ()=> "The Data is valid"
                }
            }
            return assertContainErrorMessages(received, validator.errors)

        }
    }
})

function valid() {
    return {pass: true, message : ()=>""} 
}

function assertContainErrorMessages(received: FieldErrors, expected: FieldErrors){
            const isMatch = expect.objectContaining(received).asymmetricMatch(expected);
            return isMatch 
                    ? valid()
                    : {pass: false, message: () => `The validation errors not contains ${JSON.stringify(received)}. Current ${JSON.stringify(expected)}`};
}