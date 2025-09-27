class test
{
    static it(description, fn, fname="")
    {
        if (fname)
            console.log("Testing " + fname + " ...");
        console.log("supposed to " + description);
        try{
            fn(); 
            //console.log('\x1b[32m%s\x1b[0m', '\u2714 ' + "succeed.");
        }

        catch(error)
        {
            console.error("Error : " + error.stack);    
        }
        //console.log("   ");
    }

    static check(expected, res)
    {
        if (typeof(expected) == "object")
        {
            if (getType(expected) == "Date")
            {
                test.check(expected.getTime(), res.getTime());
                return;
            }

            if (expected instanceof HTMLElement || 
            expected instanceof Location)
            {
                if (expected !== res)
                    throw new Error("Expected value don't match !\nExpected : " + expected + "\nGot : " + res);
                return;
            }

            if (getType(expected) == "Array")
            {
                for (let i=0; i<expected.length; i++)
                    test.check(expected[i], res[i]);
                return;
            }
        }
        else if (expected !== res)
            throw new Error("Expected value don't match !\nExpected : " + expected + "\nGot : " + res);
    }

    static checkType(expected, variable)
    {
        if (typeof(variable) == "object" && expected != typeof(variable))
        {
            if (expected.toLowerCase() != getType(variable).toLowerCase())
            {
                throw new Error("Expected type don't match !\nExpected : " + expected + "\nGot : " + getType(variable));
            }
            return;
        }
        if (expected != typeof(variable))
            throw new Error("Expected type don't match !\nExpected : " + expected + "\nGot : " + typeof(variable));

    }

    static isTrue(cond)
    {
        if (!cond)
            throw new Error("The condition is not true");
    }

    static containKey(expectedKey, obj)
    {
        if (typeof(expectedKey) == "object")
        {
            for (const k of expectedKey)
                test.containKey(k, obj);
            return;
        }
        test.checkType("object", obj);
        if (typeof(obj[expectedKey]) == "undefined")
        {
            let string = "Can't find the expected key in the object !\nExpected key : " + expectedKey + "\nThe object : \n{";
            for (const k in obj)
            {
                if (typeof(obj[k]) == "function")
                    string += "    \"" + k + "\" : function\n";
                else 
                    string += "    \"" + k + "\" : " + obj[k] + "\n";
            }
            string +="}";
            throw new Error(string);
        }
    }
}
