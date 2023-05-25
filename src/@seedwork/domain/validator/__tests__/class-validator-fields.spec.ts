import { ClassValidatorFields } from "../class-validator-fields"
import * as libClassValidator from 'class-validator';
class StubClassValidatorFields extends ClassValidatorFields<{field: string}>{}

describe("ClassValidatorFields Unit Test", () => {

    it("should initialize errors and validatedData variables with null", ()=>{
        const stubClassValidatorFields = new StubClassValidatorFields();
        expect(stubClassValidatorFields.errors).toBeNull();
        expect(stubClassValidatorFields.validatedData).toBeNull();
    })

    it("should validate and return with errors", ()=> {
        const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
        spyValidateSync.mockReturnValue([{
            property: "field",
            constraints: {
                isRequired: "Field is required"
            }
        }]);
        const validator = new StubClassValidatorFields();
        const isValid =validator.validate("");
        expect(spyValidateSync).toHaveBeenCalled();
        expect(isValid).toBeFalsy()
        expect(validator.validatedData).toBeNull();
        expect(validator.errors).toStrictEqual({field: ["Field is required"]})

    })

    it(("should validate without errors"), ()=> {
        const spyValidateSync = jest.spyOn(libClassValidator, "validateSync");
        spyValidateSync.mockReturnValue([]);
        const validator = new StubClassValidatorFields();
        const isValid =validator.validate({field: ""});
        expect(spyValidateSync).toHaveBeenCalled();
        expect(isValid).toBeTruthy()
        expect(validator.validatedData).toStrictEqual({field: ""});
        expect(validator.errors).toBeNull()
    })
})