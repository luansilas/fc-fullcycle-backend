import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, Validator } from "class-validator";
import { ClassValidatorFields } from "../../../@seedwork/domain/validator/class-validator-fields";
import { ValidatorFieldsInterface } from "../../../@seedwork/domain/validator/validator-fields.interface";
import { CategoryProperties } from "../entities/category";


export class CategoryRules {

    @MaxLength(255)
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    is_active: boolean;

    @IsDate()
    @IsOptional()
    created_at: Date;
    
    constructor(data: CategoryProperties){
         Object.assign(this, data);
    }
};

export class CategoryValidator extends ClassValidatorFields<CategoryRules> implements ValidatorFieldsInterface<CategoryRules> {

    validate(data: CategoryProperties): boolean {
        return super.validate(new CategoryRules(data));
    }

}

export class CategoryValidatorFactory {
    static create(): ValidatorFieldsInterface<CategoryRules> {
        return new CategoryValidator();
    }
}