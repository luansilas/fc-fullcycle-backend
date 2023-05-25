import { Entity } from "../entity/entity"
import { NotFoundError } from "../errors/not-found.error"
import { UniqueEntityId } from "../value-objects/unique-entity-id.vo"
import { RepositoryInterface, SearchParams, SearchResult, SearchableRepositoryInterface, SortDirection } from "./repository.contracts"

export abstract class InMemoryRepository<E extends Entity> implements RepositoryInterface<E>{

    items: E[] = [];



    async insert(entity: E): Promise<void> {
        this.items.push(entity)
    }

    async findById(id: string | UniqueEntityId): Promise<E> {
        const item = await this._get(`${id}`)
        return item
    }

    async findAll(): Promise<E[]> {
        return this.items
    }
    async update(entity: E): Promise<void> {
        await this._get(entity.id)

        const index = this.items.findIndex(i => i.id === entity.id)
        this.items[index] = entity

    }

    async delete(id: string | UniqueEntityId): Promise<void> {
        await this._get(`${id}`)

        const index = this.items.findIndex(i => i.id === `${id}`)
        this.items.splice(index, 1)
    }

    private async _get(id: string): Promise<E> {
        const item: E = this.items.find(item => item.id === id)
        if (!item) {
            throw new NotFoundError(`Entity not found using id ${id}`)
        }

        return item
    }



}


export abstract class InMemorySearchableRepository<E extends Entity>
    extends InMemoryRepository<E>
    implements SearchableRepositoryInterface<E>{

    sortableFields: string[] = [];
    async search(props: SearchParams): Promise<SearchResult<E>> {
        const items = await this.applyFilter(this.items, props.filter)

        const itemsSorted = await this.applySort(items, props.sort, props.sort_dir)

        const itemPaginated = await this.applyPagination(itemsSorted, props.per_page, props.page)

        return new SearchResult({
            items: itemPaginated,
            total: items.length,
            current_page: props.page,
            per_page: props.per_page,
            sort: props.sort,
            sort_dir: props.sort_dir,
            filter: props.filter

        })
    }

    protected abstract applyFilter(items: E[], filter: SearchParams["filter"] | null): Promise<E[]>

    protected async applySort(items: E[], sort: SearchParams['sort'] | null, sort_dir: SortDirection | null): Promise<E[]> {
        if (!sort || !this.sortableFields.includes(sort)) {
            return items
        }



        return [...items].sort((a, b) => {
            if (a.props[sort] < b.props[sort]) {
                return sort_dir === "asc" ? -1 : 1
            } else if (a.props[sort] > b.props[sort]) {
                return sort_dir === "asc" ? 1 : -1
            }

            return 0

        })


    }

    protected async applyPagination(items: E[], per_page: SearchParams['per_page'], page: SearchParams['page']): Promise<E[]>{
        const start = (page - 1) * per_page
        const limit = start + per_page;
        return items.slice(start, limit);
    }
}

