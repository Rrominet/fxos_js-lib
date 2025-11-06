test.it("Move element from index to new index in Array", () => 
    {
        let a = [1, 2, 3];
        let expected = [1, 3, 2];
        a.move(2, 1);
        test.check(expected, a);
    }, "Array.move(from, to)");

test.it("Remove elmt from array", () => 
    {
        let a = [1, 5, 3];
        let e= [1, 3];
        a.remove(5);
        test.check(e, a);
    }, "Array.remove(elmt)");

test.it("replace the text in innerHTML", () => 
    {
        const e = D.createElement("p");
        e.innerHTML = "Coucou mon ami !";
        e.replaceTxt("Coucou", "Hello");
        test.check("Hello mon ami !", e.innerHTML);
    }, "HTMLElement.replaceTxt (search, replace)");

test.it("return Date as the input (with no problem from hour decalage", () => 
    {
        const e = D.createElement("input");
        e.type ="time";
        e.value = "14:56:54";

        const exp = new Date(0);
        exp.setHours(14)
        exp.setMinutes(56);
        exp.setSeconds(54);
        test.check(exp, e.asDate())
        
    }, "HTMLInputElement.asDate  ()");

test.it("return true if it contains the elmt", () => 
    {
        const el = B.newNode("div");
        let expected = true;
        test.check(expected, B.contains(el));
        el.remove();
    }, "HTMLElement.contains (elmt)");

test.it("check if the elmt is visible in the scene", () => 
    {
        let e = B.newNode("div", "test content");
        test.check(true, e.isVisible());
        e.hide();
        test.check(false, e.isVisible());
        e.show();
        e.style.transform = "scale(1)";
        test.check(true, e.isVisible());
        e.style.transform = "scale(0)";
        test.check(false, e.isVisible());
        e.remove();
        test.check(false, e.isVisible());
    }, "HTMLElement.isVisible ()");

test.it("return all the parent till the hierarchy is <html>", () => 
    {
        const a = B.newNode("div");
        a.b = a.newNode("div");
        a.b.c = a.b.newNode("div");
        test.check([a.b, a, B, B.parentNode, D], a.b.c.reccursiveParents());
        a.remove();
        
    }, "HTMLElement.reccursiveParents ()");
