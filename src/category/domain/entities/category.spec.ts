
import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import Category, { CategoryProperties } from "./category";
import {omit} from 'lodash';

Category.validate = jest.fn();

describe("Category Unit Test", ()=> {

    test("Constructor of Category", ()=> {
        
        
        let category = new Category({
            name: "Movie"
        });
        let props = omit(category.props, ['created_at']);
        expect(props).toStrictEqual({
            name: "Movie",
            description: null,
            is_active: true
        })
        expect(category.props.created_at).toBeInstanceOf(Date)

        

        const created_at = new Date();
        category = new Category({
            name: "Movie",
            description: "Movie Category",
            is_active: false,
            created_at
        })
        expect(category.props).toStrictEqual({
            name: "Movie",
            description: "Movie Category",
            is_active: false,
            created_at
        })


        category = new Category({
            name: "Movie",
            description: "Other description"
        });
        expect(category.props).toMatchObject({
            name: "Movie",
            description: "Other description",
        })


        category = new Category({
            name: "Movie",
            is_active: false
        });
        expect(category.props).toMatchObject({
            name: "Movie",
            is_active: false,
        })


        category = new Category({
            name: "Movie",
            created_at
        });
        expect(category.props).toMatchObject({
            name: "Movie",
            created_at,
        })
        

 
        
    })


    test('id field', ()=> {
        type CategoryData = {
            props: CategoryProperties,
            id?: UniqueEntityId
        }
        const arranges : CategoryData[] = [{
            props: {name: 'Movie'},
        }, {
            props: {name: 'Movie'},
            id: null
        },{
            props: {name: 'Movie'},
            id: undefined
        }, {
            props: {name: 'Movie'},
            id: new UniqueEntityId('70dac95d-83b9-47a5-a517-98397dd4ab0c')
        }]

        for(const arrange of arranges){
            const category = new Category(arrange.props, arrange.id);
            expect(category.id).toBeDefined();
            expect(category.id).not.toBeNull();
            
        }

        
    })


    test("getter of name field", ()=> {
        const category = new Category({name: "Movie"});
        expect(category.name).toBe("Movie");
    })

    test("getter and setter of description field", ()=> {
        let category = new Category({name: "Movie", description: "Movie Category"});
        expect(category.description).toBe("Movie Category");

        category = new Category({name: "Movie"});
        expect(category.description).toBeNull();

        category = new Category({name: "Movie"});
        category['description'] = "Movie Category";
        expect(category.description).toBe('Movie Category');

        category = new Category({name: "Movie"});
        category['description'] = undefined;
        expect(category.description).toBeNull();

        category = new Category({name: "Movie"});
        category['description'] = null;
        expect(category.description).toBeNull();

    })


    test("getter and setter of is_active props", ()=> {
        let category = new Category({name: "Movie", description: "Movie Category"});
        expect(category.is_active).toBe(true);

        category = new Category({name: "Movie", description: "Movie Category", is_active: true});
        expect(category.is_active).toBe(true);

        category = new Category({name: "Movie", description: "Movie Category", is_active: false});
        expect(category.is_active).toBe(false);

        category['is_active'] = false;
        expect(category.is_active).toBe(false);

        category['is_active'] = undefined;
        expect(category.is_active).toBe(true);


    })


    test("getter of created_at props", ()=> {
        let category = new Category({name: "Movie"});
        expect(category.created_at).toBeInstanceOf(Date);

        const created_at = new Date();
        category = new Category({name: "Movie", created_at});
        expect(category.created_at).toBe(created_at);
    })

    it("should change the name and description of a category", ()=> {
        let category = new Category({name: "Movie", description: "Movie Description"});

        category.update("new Name", "new Description");

        expect(category.name).toBe("new Name");
        expect(category.description).toBe("new Description")
        
    })

    it("should activate a category", ()=> {
        let category = new Category({name: "Movie", description: "Movie Description", is_active: false});
        expect(category.is_active).toBeFalsy()
        
        category.activate();
        expect(category.is_active).toBeTruthy()
    })

    it("should deactivate a category", ()=> {
        let category = new Category({name: "Movie", description: "Movie Description", is_active: true});
        expect(category.is_active).toBeTruthy()

        category.deactivate();
        expect(category.is_active).toBeFalsy()
    })
})