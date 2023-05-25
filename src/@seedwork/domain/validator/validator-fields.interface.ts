export type FieldErrors = {
    [field: string]: string[];
}

export interface ValidatorFieldsInterface<PropsValidated>{
    validatedData: PropsValidated
    errors: FieldErrors;
    validate(data: any): boolean;
}