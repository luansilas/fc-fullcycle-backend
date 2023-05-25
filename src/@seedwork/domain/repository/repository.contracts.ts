

import { Entity } from "../entity/entity"
import { UniqueEntityId } from "../value-objects/unique-entity-id.vo"


export interface RepositoryInterface<E extends Entity>{
    insert(entity: E) : Promise<void>;
    
    findById(id : string | UniqueEntityId): Promise<E>;
    
    findAll() : Promise<E[]>

    update(entity: E) : Promise<void>;

    delete(id: string | UniqueEntityId) : Promise<void>;
}

export type SortDirection = "asc" | "desc";

type SearchProps<Filter = string> = {
    page?: number,
    per_page?: number,
    sort?: string | null,
    sort_dir?: SortDirection | null,
    filter?: Filter | null


}

export class SearchParams<Filter = string>{
    
    protected _page: number 
    protected _per_page: number = 15
    protected _sort: string | null
    protected _sort_dir: SortDirection | null
    protected _filter: Filter


    constructor( props: SearchProps<Filter> = {}) {
        this.page = props.page;
        this.per_page = props.per_page
        this.sort = props.sort;
        this.sort_dir = props.sort_dir;
        this.filter = props.filter;

    }

    get page(): number{
        return this._page;
    }

    get per_page(): number{
        return this._per_page;
    }

    get sort(): string{
        return this._sort;
    }

    get sort_dir(): SortDirection{
        return this._sort_dir;
    }

    get filter(): Filter{
        return this._filter;
    }

    private set page(page: number){
        let _page = +page;
        if(Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page){
            _page = 1;
        }
        

        this._page = _page;
    }

    private set per_page(per_page: number){
        let _per_page = +per_page;
        if(Number.isNaN(_per_page) || _per_page <= 0 || parseInt(_per_page as any) !== _per_page){
            _per_page = 15;
        }
        
        this._per_page = _per_page;
    }

    private set sort(sort: string | null){
        if(sort === null || sort === undefined || sort === "" || typeof sort !== "string"){
            sort = null
        } else {
            sort = `${sort}`
        }

        this._sort = sort;
    }

    private set sort_dir(sort_dir: SortDirection | null){
        if(!this.sort){
            this._sort_dir = null;
            return;
        }

        const dir = `${sort_dir}`.toLowerCase();
        this._sort_dir = dir !== "asc" && dir !== "desc" ? "asc" : dir; 
    }

    private set filter(filter: Filter | null){
        
        if(filter === null || filter === undefined || (filter as unknown) === "" ){
            this._filter = null
            return;
        } 
        

        this._filter = `${filter}` as any;
    }


}


interface SearchResultProps<E extends Entity, Filter = string> {
    readonly items: E[]
    readonly total: number
    readonly current_page: number
    readonly per_page: number
    
    readonly sort?: string | null
    readonly sort_dir?: string | null
    readonly filter?: Filter | null
}

export class SearchResult<E extends Entity, Filter = string>{
    readonly items: E[]
    readonly total: number
    readonly current_page: number
    readonly per_page: number
    readonly sort: string
    readonly last_page: number
    readonly sort_dir: string
    readonly filter: Filter

    constructor(props: SearchResultProps<E, Filter>){
        this.items = props.items;
        this.total = props.total;
        this.current_page = props.current_page;
        this.per_page = props.per_page;
        this.last_page = Math.ceil(props.total / this.per_page);
        this.sort = props.sort;
        this.sort_dir = props.sort_dir;
        this.filter = props.filter;

    }

    toJSON(){
        return {
            items: this.items,
            total: this.total,
            current_page: this.current_page,
            per_page: this.per_page,
            last_page: this.last_page,
            sort: this.sort,
            sort_dir: this.sort_dir,
            filter: this.filter,
        }
    }
}



export interface SearchableRepositoryInterface<
    
    E extends Entity, 
    Filter = string,
    SearchInput = SearchParams<Filter>, 
    SearchOutput = SearchResult<E, Filter>

> extends RepositoryInterface<E>{
    sortableFields: string[];
    search(props:SearchInput) : Promise<SearchOutput>;
}