class CodeWriter
{
	constructor (txt="", parent=B, filename="")
	{
		constants();
		this.parent = parent;
		this.filename = filename;
		this.dependencies();
		this.interface();
		this.setText(txt);
	}

	interface()
	{
		this.pre = this.parent.newNode("pre", "code-writer");
		this.code = this.pre.newNode("code", "code-writer");
	}

	css()
	{
		newCss(FM + "/css/CodeWriter.css");
	}

	initHighlightJsLib()
	{
		let script = mkJs(FM + "/libs/highlightjs/highlight.pack.js");
		B.append(script);
	}

	dependencies()
	{
		this.css();
		this.initHighlightJsLib();
	}

	createLine(txt, index)
	{
		let l = new Line(txt, index, this);
		this.lines.push(l);
	}

	setText(txt, filename="", owner = null)
	{
		if (owner)
		{
			owner.parser = new CodeParser(txt, this.format);
			console.log(owner.parser.classes());
		}

		this.code.innerHTML = "";
		this.filename = filename;
		this.getFileFormat();
		this.lines = [];
		let lines = txt.split("\n");
		for (let i=0; i<lines.length; i++)
		{
			this.createLine(lines[i], i);
		}

		if (owner)
		{
			owner.setFunctions();
		}
	}

	getFileFormat()
	{
		if (ext(this.filename) == "js")
			this.format = CODE_WRITER_JS;
		else if (ext(this.filename) == "php")
			this.format = CODE_WRITER_PHP;
		else if (ext(this.filename) == "py")
			this.format = CODE_WRITER_PYTHON;
	}

	setFormatSpec()
	{
		if (!this.format)
			return;

		this.keywords = []; 
		let xhr = HttpRequest();
		let path = FM + "/js/txtWriter/data/" + this.format + "-keywords";
		let params = [["func", "getFileContent"], ["path", path]];

		let func = function (xhr)
		{
			this.setBalises(xhr.responseText);
		}.bind(this);

		xhr.sendListAsPost("ajax.php", params, func);
	}

	// manage interfaces balises // 
	// keywords is a string of the language keywords separate by a "\n" char
	setBalises(keywords)
	{
		this.keywords = keywords.split("\n");
		this.setKeywords();
	}

	setKeywords()
	{
		for (let w of D.getElementsByClassName("word"))
		{
			if (this.keywords.includes(w.innerText))
				w.classList.add("keyword");
		}
	}
}

class Line
{
	constructor(txt, index, writer)
	{
		this.writer = writer;
		this.html = writer.code.newNode("div", "line");
		this.html.nb = this.html.newNode("span", "nb"); 
		this.html.nb.innerText = (index + 1);
		this.html.content = this.html.newNode("span", "content"); 
		if (writer.format == "js")
			this.html.content.classList.add("javascript");
		else if (writer.format == "py")
			this.html.content.classList.add("python");
		else 
			this.html.content.classList.add(this.writer.format);
		this.setContent(txt);
		// this.setFunction();
	}

	asWords()
	{
		return this.htmlContent().split("&nbsp;"); 
	}

	setContent(txt)
	{
		let html = txt;
		html = html.replace(new RegExp("\t", "g"), "    ");
		html = html.replace(new RegExp(" ", "g"), "&nbsp;");
		this.html.content.innerHTML = html;
		if (typeof(hljs) != "undefined")
			hljs.highlightBlock(this.html.content);
	}

	htmlContent()
	{
		return this.html.content.innerHTML;
	}

	setHtmlContent(html)
	{
		this.html.content.innerHTML = html;
	}

	codeElmt(name)
	{
		for (let c of this.html.content.children)
		{
			if (c.classList.contains("hljs-" + name))
				return this.html.content.innerText;
		}

		return "";
	}

	function()
	{
		return this.codeElmt("function");
	}

	class()
	{
		return this.codeElmt("class");
	}

	wordsTag()
	{
		let _r = [];
		for (let c of this.html.content.children)
		{
			if (c.classList.contains("word"))
			{
				_r.push(c);
			}
		}

		return _r;
	}
}

function constants()
{
	CODE_WRITER_JS = "js"; 
	CODE_WRITER_PHP = "php"; 
	CODE_WRITER_PYTHON = "py"; 
}