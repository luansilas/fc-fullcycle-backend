import { validateSync } from "class-validator";
import { FieldErrors, ValidatorFieldsInterface } from "./validator-fields.interface";


export abstract class ClassValidatorFields<PropsValidated> implements ValidatorFieldsInterface<PropsValidated> {

    validatedData: PropsValidated = null;
    errors: FieldErrors = null;

    validate(data: any): boolean {
        let isValid = true;
        const errors = validateSync(data);
        if(errors.length){
            isValid = false;
            this.errors = {};
            for(const error of errors){
                const field = error.property;
                this.errors[field] = Object.values(error.constraints);
            } 
        } else{ 
            this.validatedData = data;
        }

        return isValid;
    }

}