import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator"
import { ClassValidatorFields } from "../class-validator-fields"

class StubRules {

    @MaxLength(255)
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNumber()
    @IsNotEmpty()
    price: string

    constructor(data:any){
        Object.assign(this, data);
    }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules>{
    validate(data: any): boolean {
        return super.validate(new StubRules(data));
    }
}

describe("Class Validator Integration Tests", ()=> {

    it("should do something", ()=> {
        const validator = new StubClassValidatorFields()
        const isValid = validator.validate(null);

        expect(isValid).toBe(false)
        
        expect(validator.validatedData).toBeNull()
        expect(validator.errors).toStrictEqual({
            "name": [
                "name must be a string",
                "name should not be empty", 
                "name must be shorter than or equal to 255 characters",
                
            ],
            "price": [
                "price should not be empty",
                "price must be a number conforming to the specified constraints"
            ]
        })
    })

    it("should be valid", ()=> {
        const validator = new StubClassValidatorFields()
        const isValid = validator.validate({
            name: "Nome",
            price: 5
        });

        expect(isValid).toBe(true)
        expect(validator.validatedData).toStrictEqual(new StubRules({
            name: "Nome",
            price: 5
        }))
    })
})