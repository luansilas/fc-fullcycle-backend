import { Entity } from "../../entity/entity"
import { SearchParams, SearchResult } from "../repository.contracts"

describe("Search Params unit tests", () => {

    test("page properties", ()=> {
        let searchParams = new SearchParams()
        expect(searchParams.page).toBe(1);

        const arrange = [null, undefined, -1, 1.5, 0, "aaa", {}, [],true, false]

        for(const item of arrange){
            
            searchParams = new SearchParams({page: item as any})
            expect(searchParams.page).toBe(1);
        }

        searchParams = new SearchParams({page: 2})
        expect(searchParams.page).toBe(2);
    })

    test("per page properties", ()=> {

        let searchParams = new SearchParams();
        expect(searchParams.per_page).toBe(15);

        const arrange = [null, undefined, -1, 1.5, 0, "aaa", {}, [], true, false]

        for(const item of arrange){
            
            searchParams = new SearchParams({page: item as any})
            expect(searchParams.per_page).toBe(15);
        }

        searchParams = new SearchParams({per_page: 20})
        expect(searchParams.per_page).toBe(20);

    })

    test("sort properties", ()=> {
        let searchParams = new SearchParams();
        expect(searchParams.sort).toBeNull();

        const arrange = [null, undefined, -1, 1.5, 0, {}, [], true, false]

        for(const item of arrange){
            
            searchParams = new SearchParams({sort: item as any})
            expect(searchParams.sort).toBeNull();
        }

        searchParams = new SearchParams({sort: "field"})
        expect(searchParams.sort).toBe("field");
    })

    test("sort_dir properties", ()=> {
        let searchParams = new SearchParams();
        expect(searchParams.sort_dir).toBeNull();

        searchParams = new SearchParams({sort_dir: "desc"})
        expect(searchParams.sort_dir).toBeNull();

        searchParams = new SearchParams({sort: "", sort_dir: "desc"})
        expect(searchParams.sort_dir).toBeNull();

        searchParams = new SearchParams({sort: undefined, sort_dir: "desc"})
        expect(searchParams.sort_dir).toBeNull();

        searchParams = new SearchParams({sort: null, sort_dir: "desc"})
        expect(searchParams.sort_dir).toBeNull();

        const arrange = [null, undefined, -1, 1.5, 0, {}, [], "aaaa", true, false]

        for(const item of arrange){
            
            searchParams = new SearchParams({sort_dir: item as any})
            expect(searchParams.sort_dir).toBeNull();

            searchParams = new SearchParams({sort: "field", sort_dir: item as any})
            expect(searchParams.sort_dir).toBe("asc");
        }

        searchParams = new SearchParams({sort: "Field", sort_dir: "asc" as any})
        expect(searchParams.sort_dir).toBe("asc");

        searchParams = new SearchParams({sort: "Field", sort_dir: "ASC" as any})
        expect(searchParams.sort_dir).toBe("asc");

        searchParams = new SearchParams({sort: "Field", sort_dir: "DESC" as any})
        expect(searchParams.sort_dir).toBe("desc");


        searchParams = new SearchParams({sort: "Field", sort_dir: "desc" as any})
        expect(searchParams.sort_dir).toBe("desc");
    })

    test("filter properties", ()=> {
        let searchParams = new SearchParams();
        expect(searchParams.filter).toBeNull();

        const arrange :{value: any, expected: any}[] = [
            {value: null, expected: null},
            {value: undefined, expected: null},
            {value: -1, expected: "-1"},
            {value: 1, expected: "1"}, 
            {value: 0, expected: "0"},
            {value: {}, expected: "[object Object]"},
            {value: [], expected: ""},
            {value: true, expected: "true"},
            {value: false, expected: "false"},
            {value: "my filter", expected: "my filter"}
        ]

        for(const item of arrange){
            
            searchParams = new SearchParams({filter: item.value as any})
            expect(searchParams.filter).toBe(item.expected);
        }

        // searchParams = new SearchParams({filter: "field"})
        // expect(searchParams.filter).toBe("field");
    })
})


class StubEntity extends Entity{}

describe("Search Result unit tests", ()=>{


    test("Constructor Props", ()=> {
        const e1 = new StubEntity("E1");
        const e2 = new StubEntity("E2");

        let result = new SearchResult({
            items: [e1, e2],
            current_page: 1, 
            per_page: 2,
            total: 4,
            filter: null,
            sort: null,
            sort_dir: null
        });

        expect(result.toJSON()).toStrictEqual({
            items: [e1, e2],
            current_page: 1, 
            per_page: 2,
            total: 4,
            filter: null,
            sort: null,
            sort_dir: null,
            last_page: 2
        })
        
        result = new SearchResult({
            items: [e1, e2],
            current_page: 1, 
            per_page: 2,
            total: 5,
            filter: null,
            sort: null,
            sort_dir: null
        });

        expect(result.toJSON()).toStrictEqual({
            items: [e1, e2],
            current_page: 1, 
            per_page: 2,
            total: 5,
            filter: null,
            sort: null,
            sort_dir: null,
            last_page: 3
        })

        result = new SearchResult({
            items: [e1, e2],
            current_page: 1, 
            per_page: 20,
            total: 4,
            filter: null,
            sort: null,
            sort_dir: null
        });

        expect(result.toJSON()).toStrictEqual({
            items: [e1, e2],
            current_page: 1, 
            per_page: 20,
            total: 4,
            filter: null,
            sort: null,
            sort_dir: null,
            last_page: 1
        })
    })
})