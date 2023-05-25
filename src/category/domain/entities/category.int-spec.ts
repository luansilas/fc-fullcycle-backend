
import Category from "./category"

describe("Category Integration Test", ()=> {
    describe("Create Method", ()=> {

        it("should create a Category", ()=> {
            
            const created_at = new Date();
            const arrange = [
                {name: "Movie"},
                {name: "Movie", description: "Movie Category"},
                {name: "Movie", description: "Movie Category", is_active: true},
                {name: "Movie", description: "Movie Category", is_active: false},
                {name: "Movie", is_active: false},
                {name: "Movie", is_active: true},
                {name: "Movie", description: "Movie Category", is_active: true, created_at},
                {name: "Movie", description: "Movie Category", is_active: false, created_at}   
            ]

            for(const item of arrange){
                const category = new Category(item);
                expect(category.props).toStrictEqual(item);
            }
            
            
            
        })
        test("Invalid Name property", ()=> {
            expect(()=> new Category(null)).containErrorMessages({
                name: [
                    "name should not be empty",
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters"
                ]
            })

            expect(()=> new Category({name: 5 as any})).containErrorMessages({
                name: [
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters"
                ]
            })

            expect(()=> new Category({name: ""})).containErrorMessages({
                name: [
                    "name should not be empty",
                    
                ]
            })

            expect(()=> new Category({name: null})).containErrorMessages({
                name: [
                    "name should not be empty",
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters"
                ]
            })

            expect(()=> new Category({} as any)).containErrorMessages({
                name: [
                    "name should not be empty",
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters"
                ]
            })

            expect(()=> new Category({name: "t".repeat(256)})).containErrorMessages({
                name: [
                    "name must be shorter than or equal to 255 characters"
                ]
            })
        })


        test("Invalid Description property", ()=> {
            expect(()=> new Category({name: "Movie", description: 1 as any})).containErrorMessages({
                description: [
                    "description must be a string",
                ]
            })
        })


        test("Invalid is_active property", ()=> {
            expect(()=> new Category({name: "Movie", is_active: 1 as any})).containErrorMessages({
                is_active: [
                    "is_active must be a boolean value",
                ]
            })
        })


        test("Invalid created_at property", ()=> {
            expect(()=> new Category({name: "Movie", created_at: "2023" as any})).containErrorMessages({
                created_at: [
                    "created_at must be a Date instance",
                ]
            })
        })
    })

    describe("Update Method", ()=> {

        test("Invalid Properties", ()=> {
            const category = new Category({
                name: "Movie"
            });

            expect(()=> {
                category.update(null as any, null as any)
            }).containErrorMessages({
                name: [
                    "name should not be empty",
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters"
                ]
            })

            expect(()=> {
                category.update("Movie 2", 5 as any)
            }).containErrorMessages({
                description: [
                    "description must be a string"
                ]
            })

            expect(()=> {
                category.update("t".repeat(256), null as any)
            }).containErrorMessages({
                name: [
                    "name must be shorter than or equal to 255 characters"
                ]
            })

            expect(()=> {
                category.update(5 as any, null as any)
            }).containErrorMessages({
                name: [
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters"
                ]
            })

            
        })

        it("should update a Category", ()=> {
            const category = new Category({name: "Movie"});
            
            category.update("Movie 2", "Movie Category 2");
            expect({
               name: category.name,
               description: category.description
            }).toStrictEqual({
                name: "Movie 2",
               description: "Movie Category 2"
            });
            
            category.update("Movie 3", null);
            expect({
                name: category.name,
                description: category.description
             }).toStrictEqual({
                 name: "Movie 3",
                description: null
             });

            category.update("Movie 4", undefined as any);
            expect({
                name: category.name,
                description: category.description
             }).toStrictEqual({
                 name: "Movie 4",
                description: null
             });

        })
    })
})