
import { InvalidUuidError } from '../../errors/invalid-uuid.error';
import { UniqueEntityId } from '../unique-entity-id.vo';
import {  validate as validateUUID } from 'uuid';
describe("UniqueEntityId Unit Test", ()=> {

    const spyValidateMethod = ()=> {

        return jest.spyOn(UniqueEntityId.prototype as any, 'validate');
    }

    it('should throw an error if the id is not a valid uuid', ()=> {
        const validateSpy = spyValidateMethod();
        
        expect(() => new UniqueEntityId('123')).toThrow(InvalidUuidError);
        expect(validateSpy).toHaveBeenCalled();


    })

    it("should accept uuid passed on constructor", ()=> {
        const id = 'd9962550-d8b0-40cd-af35-193df2bec2e5';
        const validateSpy = spyValidateMethod();
        const vo = new UniqueEntityId(id);
        expect(vo).toBeInstanceOf(UniqueEntityId);
        expect(vo.value).toBe(id);
        expect(validateSpy).toHaveBeenCalledTimes(1);
        expect(validateUUID(vo.value)).toBeTruthy();
    })

    it("should generate a valid uuid if no id is passed on constructor", ()=> {
        
        const validateSpy = spyValidateMethod();
        const vo = new UniqueEntityId();
        expect(vo).toBeInstanceOf(UniqueEntityId);
        expect(validateSpy).toHaveBeenCalled();
        expect(validateUUID(vo.value)).toBeTruthy();
    })
});