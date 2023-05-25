import { SortDirection } from "@seedwork/domain/repository/repository.contracts"
import  { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/in-memory.respository"
import Category from "category/domain/entities/category"
import CategoryRepository from "category/domain/repository/category-repository.interface"


export class InMemoryCategoryRepository 
    extends InMemorySearchableRepository<Category> 
    implements CategoryRepository.Repository{

    constructor(){
        super();
        this.sortableFields = ["name", "created_at"]
    }
    protected async applySort(items: Category[], sort: string, sort_dir: SortDirection): Promise<Category[]> {
        if(!sort || !this.sortableFields.includes(sort)){
            return super.applySort(items, "created_at", "asc")
        } 

        return super.applySort(items, sort, sort_dir);
    }

    protected async applyFilter(items: Category[], filter: CategoryRepository.Filter): Promise<Category[]> {
        if (!filter) {
            return items
        }
        return items.filter(item => {
            return item.props.name.toLowerCase().includes(filter.toLowerCase())
        })
    }

      
}