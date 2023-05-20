import { deepFreeze } from "../utils/deep-freeze";

export abstract class ValueObject<Value = any> {

    private _value: Value;

    constructor(value: Value){
        this._value = deepFreeze(value);
    }

    get value(): Value {
        return this._value
    }

    toString = ()=> {
        if(typeof this.value !=="object" || this.value === null){
            try{
                return this.value.toString();
            } catch(err){
                return this.value + "";
            }
        }

        const valueString = this.value.toString();
        return (valueString === "[object Object]") ? JSON.stringify(this._value) : valueString;
    }

}