
setTimeout(() => 
    {
        const cb = new ComboBox(["1", "2", "3"]);
        test.check(true, cb.options[0] == "1");
        test.check(true, cb.options[2] == "3");
        test.check(true, cb.options.length == 3);
        test.it("create combobox interface", () => 
            {
                test.check(true, B.contains(cb.div));
            }, "    interface()");
        test.it("create the menu containing all options", () => 
            {
                cb.div.btn.click();
                test.check(true, B.contains(cb.menu))
                test.check(true, cb.menu.children.length == 3);
                cb.div.btn.click();
                cb.div.btn.click();
                cb.menu.children[2].click();
                test.check(true, cb.div.btn.innerText == cb.options[2]);
                test.check(true, cb.div.btn.innerText == cb.activeOption());
                cb.infos = "none";
                cb.addOnChange(() => cb.infos = "infos");
                cb.addOnChange(() => testlog("Combobox changed !"));
                cb.div.btn.click();
                cb.menu.children[2].click();
                test.check(true, cb.infos == "none");
                cb.div.btn.click();
                cb.menu.children[0].click();
                test.check(true, cb.infos == "infos");

            }, "    createMenu()");

        test.it("set value in a combo box", () => 
            {
                cb.setValue("2");
                test.check(true, cb.div.btn.innerText == "2");
                cb.setValue("5");
                test.check(false, cb.div.btn.innerText == "5");
                cb.setValue("5", true);
                test.check(true, cb.div.btn.innerText == "5");
                test.check(true, cb.options.length == 4);

            }, "    setValue(text, force=false)");
        cb.remove();
    }, 200);


