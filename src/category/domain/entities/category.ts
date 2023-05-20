import { Entity } from "../../../@seedwork/domain/entity/entity";
import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";



export type CategoryProperties = {
    name: string;
    description?: string ,
    is_active?: boolean,
    created_at?: Date,
}
export default class Category extends Entity<CategoryProperties>{

    
   

    constructor(public readonly props: CategoryProperties, id?: UniqueEntityId){
        super(props, id);
        
        this.description = props.description;
        this.is_active = props.is_active;
        this.props.created_at = props.created_at ?? new Date();
    }
    
    get name(): string{
        return this.props.name;
    }
    
    get description(): string{
        return this.props.description;
    }

    private set description( value : string){
        this.props.description = value ?? null;    
    }

    get is_active(): boolean{
        return this.props.is_active;
    }

    private set is_active(value: boolean){
        this.props.is_active = value ?? true;
    }

    get created_at(): Date{
        return this.props.created_at;
    }


    update(name: string, description: string){
        this.props.name = name;
        this.description = description;
    }

    activate(){
        this.props.is_active = true;
    }

    deactivate(){
        this.props.is_active = false;
    }
  
}