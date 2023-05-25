
import { filter } from "lodash"
import { Entity } from "../../entity/entity"
import { InMemorySearchableRepository } from "../in-memory.respository"
import { SearchParams, SearchResult } from "../repository.contracts"


type StubEntityProps = {
    name: string
    price: number
}
class StubEntity extends Entity<StubEntityProps>{ }

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity>{

    constructor() {
        super()
        this.sortableFields = ["name"]
    }
    protected async applyFilter(items: StubEntity[], filter: string): Promise<StubEntity[]> {
        if (!filter) {
            return items
        }
        return items.filter(item => {
            return item.props.name.toLowerCase().includes(filter.toLowerCase()) || item.props.price.toString() == filter
        })
    }

}


describe("InMemorySearchableRepository Unit Tests", () => {

    let repo: InMemorySearchableRepository<StubEntity>

    beforeEach(() => {
        repo = new StubInMemorySearchableRepository()
    })

    describe("applyFilter method", () => {
        it("should no filter when filter is null", async () => {
            const entity = new StubEntity({ name: "Ola", price: 5 })
            const entity2 = new StubEntity({ name: "Ola2", price: 5 })
            const entity3 = new StubEntity({ name: "Ola3", price: 5 })
            const items = [entity, entity2, entity3]

            const filterMethodSpy = jest.spyOn(items, 'filter')

            const filteredItems = await repo['applyFilter'](items, null)

            expect(items).toStrictEqual(filteredItems)
            expect(filterMethodSpy).not.toHaveBeenCalled()

        })

        it("should filter using a filter param", async () => {
            const entity = new StubEntity({ name: "Teste", price: 2 })
            const entity2 = new StubEntity({ name: "teste", price: 1 })
            const entity3 = new StubEntity({ name: "Fake", price: 0 })
            const items = [entity, entity2, entity3]

            const filterMethodSpy = jest.spyOn(items, 'filter')

            let filteredItems = await repo['applyFilter'](items, "Teste")


            expect(filteredItems).toHaveLength(2)
            expect(filteredItems).toStrictEqual([entity, entity2])
            expect(filterMethodSpy).toHaveBeenCalledTimes(1)

            filterMethodSpy.mockClear()

            filteredItems = await repo['applyFilter'](items, "1")
            expect(filteredItems).toHaveLength(1)
            expect(filteredItems).toStrictEqual([entity2])
            expect(filterMethodSpy).toHaveBeenCalledTimes(1)

            filterMethodSpy.mockClear()

            filteredItems = await repo['applyFilter'](items, "fake")
            expect(filteredItems).toHaveLength(1)
            expect(filteredItems).toStrictEqual([entity3])
            expect(filterMethodSpy).toHaveBeenCalledTimes(1)

            filterMethodSpy.mockClear()

            filteredItems = await repo['applyFilter'](items, "no-filter")
            expect(filteredItems).toHaveLength(0)
            expect(filteredItems).toStrictEqual([])
            expect(filterMethodSpy).toHaveBeenCalledTimes(1)
        })
    })
    describe("applySort method", () => {
        it("should no sort when sort is null", async () => {
            const entity = new StubEntity({ name: "C", price: 5 })
            const entity2 = new StubEntity({ name: "A", price: 2 })
            const entity3 = new StubEntity({ name: "B", price: 1 })
            const items = [entity, entity2, entity3]

            let sortedItems = await repo['applySort'](items, null, null)
            const spySortMethod = jest.spyOn(items, 'sort')

            expect(sortedItems).toStrictEqual(items)
            expect(spySortMethod).not.toHaveBeenCalled()

            spySortMethod.mockClear()

            sortedItems = await repo['applySort'](items, "price", "asc")

            expect(sortedItems).toStrictEqual(items)
            expect(spySortMethod).not.toHaveBeenCalled()

        })

        it("should sort items by name", async () => {
            const entity = new StubEntity({ name: "C", price: 5 })
            const entity2 = new StubEntity({ name: "A", price: 2 })
            const entity3 = new StubEntity({ name: "B", price: 1 })

            const items = [entity, entity2, entity3]
            const ascExpectedSortedItems = [entity2, entity3, entity]
            const descExpectedSortedItems = [entity, entity3, entity2]

            let sortedItems = await repo['applySort'](items, "name", "asc")


            

            expect(sortedItems).toStrictEqual(ascExpectedSortedItems)


            sortedItems = await repo['applySort'](items, "name", "desc")

            expect(sortedItems).toStrictEqual(descExpectedSortedItems)
        })

    })

    describe("applyPaginate method", () => {

        it("should paginate items", async () => {
            const entity = new StubEntity({ name: "A", price: 5 })
            const entity2 = new StubEntity({ name: "B", price: 2 })
            const entity3 = new StubEntity({ name: "C", price: 1 })
            const entity4 = new StubEntity({ name: "D", price: 1 })

            const items = [entity, entity2, entity3, entity4]

            let paginatedItem = await repo['applyPagination'](items, 1, 1)

            expect([entity]).toStrictEqual(paginatedItem)

            paginatedItem = await repo['applyPagination'](items, 2, 2)
            expect([entity3, entity4]).toStrictEqual(paginatedItem)


        })
    })

    describe("search method", () => {

        it('should search an entity', async () => {

            const entity = new StubEntity({ name: "Teste", price: 2 })

            const items = Array(16).fill(entity)
            repo.items = items

            const result = await repo.search(new SearchParams())


            expect(result).toStrictEqual(new SearchResult({
                items: Array(15).fill(entity),
                total: 16,
                current_page: 1,
                per_page: 15,
                sort: null,
                sort_dir: null,
                filter: null
            }))

        })

        it("should apply paginate and filter", async () => {
            const entity = new StubEntity({ name: "teste a", price: 5 })
            const entity2 = new StubEntity({ name: "Teste e", price: 2 })
            const entity3 = new StubEntity({ name: "fake b", price: 1 })
            const entity4 = new StubEntity({ name: "afake a", price: 3 })

            repo.items = [entity, entity2, entity3, entity4]

            const result = await repo.search(new SearchParams({
                page: 2,
                per_page: 1,
                filter: 'test'
            }))


            expect(result).toStrictEqual(new SearchResult({
                items: [entity2],
                total: 2,
                current_page: 2,
                per_page: 1,
                sort: null,
                sort_dir: null,
                filter: "test"
            }))
        })

        it("should apply paginate and sort", async () => {
            const entity = new StubEntity({ name: "teste a", price: 5 })
            const entity2 = new StubEntity({ name: "teste e", price: 2 })
            const entity3 = new StubEntity({ name: "fake b", price: 1 })
            const entity4 = new StubEntity({ name: "afake a", price: 3 })

            repo.items = [entity, entity2, entity3, entity4]

            const arrange = [{
                params: {
                    page: 1,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "asc"
                },
                expected: {
                    items: [entity4],
                    total: 4,
                    current_page: 1,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "asc",
                    filter: null as any
                }
            }, {
                params: {
                    page: 2,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "asc"
                },
                expected: {
                    items: [entity3],
                    total: 4,
                    current_page: 2,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "asc",
                    filter: null as any
                }
            }, {
                params: {
                    page: 2,
                    per_page: 2,
                    sort: "name",
                    sort_dir: "asc"
                },
                expected: {
                    items: [entity, entity2],
                    total: 4,
                    current_page: 2,
                    
                    per_page: 2,
                    sort: "name",
                    sort_dir: "asc",
                    filter: null as any
                }
            }, {
                params: {
                    page: 1,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "desc"
                },
                expected: {
                    items: [entity2],
                    total: 4,
                    current_page: 1,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "desc",
                    filter: null as any
                }
            }]

            for (const item of arrange) {
                const result = await repo.search(new SearchParams(item.params as any))
                expect(result).toStrictEqual(new SearchResult(item.expected))
            }
        })

        it('should search using filter, pagination and sort', async ()=> {
            const entity = new StubEntity({ name: "teste a", price: 5 })
            const entity2 = new StubEntity({ name: "teste e", price: 2 })
            const entity3 = new StubEntity({ name: "fake b", price: 1 })
            const entity4 = new StubEntity({ name: "afake a", price: 3 })
            const entity5 = new StubEntity({ name: "bfake test a", price: 3 })

            repo.items = [entity, entity2, entity3, entity4, entity5]

            const arrange = [{
                params: {
                    page: 1,
                    per_page: 2,
                    sort: "name",
                    sort_dir: "asc",
                    filter: "test"
                },
                expected: {
                    items: [entity5, entity],
                    total: 3,
                    current_page: 1,
                    per_page: 2,
                    sort: "name",
                    sort_dir: "asc",
                    filter: "test"
                }
            }, {
                params: {
                    page: 2,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "asc",
                    filter: "fake"
                },
                expected: {
                    items: [entity5],
                    total: 3,
                    current_page: 2,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "asc",
                    filter: "fake"
                }
            },  {
                params: {
                    page: 1,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "desc",
                    filter: "fake"
                },
                expected: {
                    items: [entity3],
                    total: 3,
                    current_page: 1,
                    per_page: 1,
                    sort: "name",
                    sort_dir: "desc",
                    filter: "fake"
                }
            }]

            for (const item of arrange) {
                const result = await repo.search(new SearchParams(item.params as any))
                expect(result).toStrictEqual(new SearchResult(item.expected))
            }
        })

    })
})