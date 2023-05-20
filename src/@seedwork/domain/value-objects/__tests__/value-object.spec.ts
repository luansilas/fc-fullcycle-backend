import { ValueObject } from "../value-object";

class StubValueObject extends ValueObject { }

describe("Value Object Unit test", ()=> {

    it("should set a value", ()=> {
        let valueObject = new StubValueObject("teste");

        expect(valueObject.value).toBe("teste");

        valueObject = new StubValueObject({props: "teste"});
        expect(valueObject.value).toStrictEqual({props: "teste"});

    })

    it("should convert to String", ()=> {
        const date = new Date();
        const props = {"props": "props1"};
        let arrange = [
            {received: "", expected: ""},
            {received: "fake teste", expected: "fake teste"},
            {received: 0, expected: "0"},
            {received: 1.1, expected: "1.1"},
            {received: true, expected: "true"},
            {received: false, expected: "false"},
            {received: date, expected: date.toString()},
            {received: props, expected: JSON.stringify(props)},
        ]

        for(const a of arrange){
            let vo = new StubValueObject(a.received);
            expect(`${vo}`).toBe(a.expected);

        }

    })

    it("should be immutable", ()=> {

        
        const date = new Date();
        const vo = new StubValueObject({
            prop1: "value",
            deep: {
                prop2: "prop2",
                prop3: date
            }
        });

        expect(()=> vo.value.prop1 = "changed").toThrow("Cannot assign to read only property 'prop1' of object '#<Object>'")
        expect(()=> vo.value.deep.prop2 = "changed").toThrow("Cannot assign to read only property 'prop2' of object '#<Object>'")
        expect(()=> vo.value.deep.prop3 = new Date()).toThrow("Cannot assign to read only property 'prop3' of object '#<Object>'")

        expect(vo.value).toStrictEqual({
            prop1: "value",
            deep: {
                prop2: "prop2",
                prop3: date
            }
        })

    })
    
})