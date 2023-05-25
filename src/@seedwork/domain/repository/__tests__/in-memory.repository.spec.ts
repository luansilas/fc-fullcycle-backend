import { Entity } from "../../entity/entity"
import { UniqueEntityId } from "../../value-objects/unique-entity-id.vo"
import {InMemoryRepository} from "../in-memory.respository"

type StubEntityProps = {
    name: string,
    price: number
}

class StubEntity extends Entity<StubEntityProps>{}

class StubRepository extends InMemoryRepository<StubEntity>{}

describe("InMemoryRepository Unit Tests", () => {
    let repository: StubRepository;

    beforeEach(()=> {
        repository = new StubRepository();
        
    })
    it("should insert a new Entity", async ()=> {
        const entity = new StubEntity({
            name: "Nome",
            price: 5
        });

        await repository.insert(entity);
        expect(repository.items).toHaveLength(1);
        expect(repository.items).toStrictEqual([entity]);
    })

    it("should throw an error when tyies to find an entity dont exists", async ()=> {
        await expect(repository.findById("1")).rejects.toThrowError("Entity not found using id 1");
        await expect(repository.findById(new UniqueEntityId("f4390e1f-70c9-4af2-89b1-e29d08811dbf"))).rejects.toThrowError("Entity not found using id f4390e1f-70c9-4af2-89b1-e29d08811dbf");
    })

    it("should thrown an error when tries to update an entity dont exists", async ()=> {

        const entity = new StubEntity({name: "ola", price: 5}, new UniqueEntityId("f4390e1f-70c9-4af2-89b1-e29d08811dbf"));
        await expect(repository.update(entity)).rejects.toThrowError("Entity not found using id f4390e1f-70c9-4af2-89b1-e29d08811dbf");
    });

    it("should thrown an error when tries to delete an entity dont exists", async ()=> {
        const uuid = new UniqueEntityId()
        await expect(repository.delete("1")).rejects.toThrowError("Entity not found using id 1");
        await expect(repository.delete(uuid)).rejects.toThrowError(`Entity not found using id ${uuid}`);
    });


    it("should update an entity", async ()=> {
        const props = {name: "Ola", price: 5};
        const uuid = new UniqueEntityId("f4390e1f-70c9-4af2-89b1-e29d08811dbf")
        const entity = new StubEntity(props, uuid);
        const entityAtualizado = new StubEntity({name: "Mudou", price: 2}, uuid);

        await repository.insert(entity);

        await repository.update(entityAtualizado);

        expect(repository.items).toHaveLength(1);
        expect(repository.items[0].toJSON()).toStrictEqual(entityAtualizado.toJSON());
        
    })

    it("should finds an entity by id", async ()=> {
        const props = {name: "Ola", price: 5};
        const uuid = new UniqueEntityId("f4390e1f-70c9-4af2-89b1-e29d08811dbf")
        const entity = new StubEntity(props, uuid);
        
        await repository.insert(entity);

        let entityFound = await repository.findById(uuid);

        expect(repository.items[0].toJSON()).toStrictEqual(entityFound.toJSON());

        entityFound = await repository.findById(uuid.value);

        expect(repository.items[0].toJSON()).toStrictEqual(entityFound.toJSON());
        
    })

    it("should delete an entity", async ()=> {
        const props = {name: "Ola", price: 5};
        const uuid = new UniqueEntityId("f4390e1f-70c9-4af2-89b1-e29d08811dbf")
        const uuid2 = new UniqueEntityId("f4390e1f-70c9-4af2-89b1-e29d08811dbf")
        const entity = new StubEntity(props, uuid);
        const entity2 = new StubEntity(props, uuid);
        
        await repository.insert(entity);
        expect(repository.items).toHaveLength(1);

        await repository.delete(uuid);
        expect(repository.items).toHaveLength(0);

        await repository.insert(entity);
        await repository.insert(entity2);
        expect(repository.items).toHaveLength(2);
        await repository.delete(uuid2.value);

        expect(repository.items).toHaveLength(1);
        expect(repository.items[0].toJSON()).toStrictEqual(entity.toJSON());

        
    })

    it("should find all items", async ()=> {
        const props = {name: "Ola", price: 5};
        const uuid = new UniqueEntityId("f4390e1f-70c9-4af2-89b1-e29d08811dbf")
        const uuid2 = new UniqueEntityId("f4390e1f-70c9-4af2-89b1-e29d08811dbf")
        const entity = new StubEntity(props, uuid);
        const entity2 = new StubEntity(props, uuid2);
        
        await repository.insert(entity);
        await repository.insert(entity2);

        const items = await repository.findAll();

        expect(items).toStrictEqual([entity, entity2]);
    })




    
})