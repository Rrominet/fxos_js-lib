class HtmlCleaner
{
    //elmt is a DOM object
    constructor (elmt)
    {
        this._elmt = elmt;
        this.finalHtml = "";
    }

    cleanAllBalises()
    {
        this.finalHtml = this._elmt.innerText.replaceAll(" \n", "\n").replaceAll("\n", "<br>");
    }
    
    retreiveSpecials()
    {
        let bolds = [];
        for (const c of this._elmt.deepChildren())
        {
            if (getComputedStyle(c).fontWeight == "700")
                bolds.push(c.innerText)
        }

        let underlines = [];
        for (const c of this._elmt.deepChildren())
        {
            if (getComputedStyle(c).textDecoration == "underline")
                underlines.push(c.innerText)
        }

        let italics = [];
        for (const c of this._elmt.deepChildren())
        {
            if (getComputedStyle(c).fontStyle == "italic")
                italics.push(c.innerText)
        }

        let links = []
        {
            for (const c of this._elmt.deepChildren())
            {
                if (c.tagName.toLowerCase() == "a")
                    links.push({link : c.href, txt : c.innerText});
            }
        }

        let hs = ["h1", "h2", "h3", "h4", "h5", "h6"];
        let titles = [];

        for (const c of this._elmt.deepChildren())
        {
            if (hs.includes(c.tagName.toLowerCase()))
            {
                const o = {};
                o.balise = c.tagName.toLowerCase();
                o.txt = c.innerText;
                titles.push(o);
            }
        }

        for (const o of titles)
            this.addBalise(o.balise, o.txt);
        for (const a of links)
            this.addBalise("a", a.txt, [{key : "href", value : a.link}]);
        for (const b of bolds)
            this.addBalise("b", b);
        for (const b of underlines)
            this.addBalise("u", b);
        for (const b of italics)
            this.addBalise("i", b);
    }

    // attributes a table ob object as key, value
    addBalise(balise, txt, attributes = [])
    {

        if (txt == "" || txt == " " || txt == "\n" || txt.charCodeAt(0) == 160 || txt.charCodeAt(0) == 46)
            return;
        let pre = "<" + balise;
        for (const a of attributes)
            pre += " " + a.key + "=\"" + a.value + "\"";
        pre += ">"
        const post = "</" + balise + ">"


        testlog(txt.charCodeAt(0));
        testlog(pre + txt + post);
        testlog("---");

        this.finalHtml = this.finalHtml.replaceAll(txt, pre + txt + post);

        while (this.finalHtml.includes(pre + pre))
            this.finalHtml = this.finalHtml.replaceAll(pre + pre, pre);

        while (this.finalHtml.includes(post + post))
            this.finalHtml = this.finalHtml.replaceAll(post + post, post);
    }

    cleaned()
    {
        this.cleanAllBalises();
        this.retreiveSpecials();
        while (this.finalHtml.includes("&npsp;<br>"))
            this.finalHtml = this.finalHtml.replaceAll("&npsp;<br>", "<br>");
        while (this.finalHtml.includes(" <br>"))
            this.finalHtml = this.finalHtml.replaceAll(" <br>", "<br>");
        while (this.finalHtml.includes(" <br>"))
            this.finalHtml = this.finalHtml.replaceAll(" <br>", "<br>");
        while (this.finalHtml.includes("<br><br><br>"))
            this.finalHtml = this.finalHtml.replaceAll("<br><br><br>", "<br><br>")
        testlog(this.finalHtml);
        return this.finalHtml;
    }

}

// TEST file and exec //
if (location.href.includes('http://localhost/'))
{
    importScripts([
        mkJs(FM + "/js/test.js"),
        mkJs("http://localhost/motion-live/frameworks/js/txtWriter/HtmlCleaner_test.js"),
    ]);
}
