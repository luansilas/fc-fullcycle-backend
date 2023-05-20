
import { Entity } from "./entity"
import { UniqueEntityId } from "../value-objects/unique-entity-id.vo";
import { validate as uuidValidate } from "uuid";


class StubEntity extends Entity<{prop1: string, prop2: number}> {

}

describe("Entity Unit test", ()=> {

    it("should set all properties", ()=> {
        const entity = new StubEntity({prop1: "prop1", prop2: 2});

        expect(entity.props).toStrictEqual({prop1: "prop1", prop2: 2});
        expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
        expect(entity.id).not.toBeNull()
        expect(uuidValidate(entity.id)).toBe(true)
    })

    it('it should accept a valid uuid', ()=> {
        const uniqueId = new UniqueEntityId();
        const entity = new StubEntity({prop1: "prop1", prop2: 2}, uniqueId);

        expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
        expect(entity.id).toBe(uniqueId.value);
    })

    it("should convert to a entity to a JSON", ()=> {
        const uniqueId = new UniqueEntityId();
        const props = {prop1: "prop1", prop2: 2}
        const entity = new StubEntity(props, uniqueId);

        const json = entity.toJSON();
        expect(json).toStrictEqual({
            id: uniqueId.value,
            ...props
        })
    })
})