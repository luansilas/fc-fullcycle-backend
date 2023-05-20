import { deepFreeze } from "./deep-freeze"

describe("Deep Freeze Unit Test", ()=> {

    it("should not freez a scalar value", ()=> {
        let str = deepFreeze("teste");
        expect(typeof str).toBe("string");

        let bool = deepFreeze(true);
        expect(typeof bool).toBe("boolean");

        bool = deepFreeze(false);
        expect(typeof bool).toBe("boolean");

        const num = deepFreeze(5)
        expect(typeof num).toBe("number");
    })

    it("should freeze an object", ()=> {
        const date = new Date();
        const obj = deepFreeze({
            prop1: "value",
            deep: {
                prop2: "prop2",
                prop3: date
            }
        });

        expect(()=> obj.prop1 = "changed").toThrow("Cannot assign to read only property 'prop1' of object '#<Object>'")
        expect(()=> obj.deep.prop2 = "changed").toThrow("Cannot assign to read only property 'prop2' of object '#<Object>'")
        expect(()=> obj.deep.prop3 = new Date()).toThrow("Cannot assign to read only property 'prop3' of object '#<Object>'")

        expect(obj).toStrictEqual({
            prop1: "value",
            deep: {
                prop2: "prop2",
                prop3: date
            }
        })

    })
})