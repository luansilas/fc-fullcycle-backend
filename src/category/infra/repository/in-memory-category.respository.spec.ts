import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/in-memory.respository"
import { InMemoryCategoryRepository } from "./in-memory-category.repository"
import Category from "../../../category/domain/entities/category"

describe("InMemoryCategory Unit tests", ()=> {
    
    let repo: InMemorySearchableRepository<Category>
    
    beforeEach(()=> {
        repo = new InMemoryCategoryRepository();
        
    })

    test("applyFilter method", async ()=> {
        const items = [
            new Category({name: "fake 2"}),
            new Category({name: "fake 1"}),
            new Category({name: "teste"}),
        ]

        const spyOnFilter = jest.spyOn(items, "filter");
        let itemsFiltered = await repo["applyFilter"](items, "");
        expect(itemsFiltered).toStrictEqual(items);
        expect(spyOnFilter).toHaveBeenCalledTimes(0);


        itemsFiltered = await repo["applyFilter"](items, null);
        expect(itemsFiltered).toStrictEqual(items);
        expect(spyOnFilter).toHaveBeenCalledTimes(0);

        itemsFiltered = await repo["applyFilter"](items, "fake")
        expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
        expect(spyOnFilter).toHaveBeenCalledTimes(1);

        spyOnFilter.mockReset();

        itemsFiltered = await repo["applyFilter"](items, "test")
        expect(itemsFiltered).toStrictEqual([items[2]]);
        expect(spyOnFilter).toHaveBeenCalledTimes(1);

        
    })

    it("should sort by created_at when sort param is not set", async ()=> {
        const items = [
            new Category({name: "teste", created_at: new Date("2020-01-01")}),
            new Category({name: "fake 1", created_at: new Date("2019-01-01")}),
            new Category({name: "fake 2", created_at: new Date("2021-01-01")}),
        ]

        
        let itemsSorted = await repo["applySort"](items, null, null);
        expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
        
    })
    test("should sort by name", async ()=> {
        const items = [
            new Category({name: "teste", created_at: new Date("2020-01-01")}),
            new Category({name: "fake 1", created_at: new Date("2019-01-01")}),
            new Category({name: "fake 2", created_at: new Date("2021-01-01")}),
        ]

        
        
        let itemsSorted = await repo["applySort"](items, "name", "asc");
        expect(itemsSorted).toStrictEqual([items[1], items[2], items[0]]);
        
        
        itemsSorted = await repo["applySort"](items, "name", "desc");
        expect(itemsSorted).toStrictEqual([items[0], items[2], items[1]]);
        

        
    })

    
})