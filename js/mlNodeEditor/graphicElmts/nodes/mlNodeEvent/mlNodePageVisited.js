class mlNodePageVisited extends mlNodeEvent
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = PAGE_VISITED;
	}

	setEvents()
	{
		super.setEvents();
		this.content.page.addEventListener("change", this.testPage.bind(this));
		this.content.page.addEventListener("change", this.testEmailDistFile.bind(this));
	}

	drawContent()
	{
		this.content.page = this.content.newInput("text");
		this.content.page.placeholder = "page url";
		this.content.page.title       = "page url";

		this.content.newBr();

		this.content.max = this.content.newInput("number");
		this.content.max.placeholder = "Maximum visit";
		this.content.max.title       = "Maximum visit";

		console.log(this.content);

		this.content.infos = this.content.newNode("div"); 
		this.content.infos.error1 = this.content.infos.newNode("p", "error");
		this.content.infos.error1.innerHTML = `This URL have an error...`; 
		this.content.infos.error1.hidden = true;

		this.content.infos.error2 = this.content.infos.newNode("p", "error");
		this.content.infos.error2.innerHTML = `This URL does not have an email count file.<br>
		The name of this file is 'the/url/path/THE_PAGE_NAME-emails.node'`; 
		this.content.infos.error2.hidden = true;

		this.content.infos.valid = this.content.infos.newNode("p", "valid");
		this.content.infos.valid.innerHTML = `This URL does have an email count file.`; 
		this.content.infos.valid.hidden = true;

		this.addOutput("Contact");
		this.addOutput("Time", "green");
	}

	testUrl(url, errorHtmlNode)
	{
		errorHtmlNode.hidden = true;
		let xhr = HttpRequest(); 

		xhr.addEventListener("error", function (e) {errorHtmlNode.hidden = false;})

		let func = function ()
		{
			if (xhr.status === 404)
			{
				errorHtmlNode.hidden = false;
			}
			else
			{
				errorHtmlNode.hidden = true;
			}

		};

		xhr.onreadystatechange = func;

		xhr.open("GET", url); 
		xhr.send();
	}

	testPage()
	{
		this.testUrl(this.content.page.value, this.content.infos.error1);
	}

	testEmailFile()
	{
		let url = this.content.page.value.split("/"); 
		let name = url.pop();
		url = url.join("/");
		url += "/" + name + "-emails.node";

		this.testUrl(url, this.content.infos.error2);
	}

	serialize() 
	{
		let json = super.serialize();
		json.page = this.content.page.value;
		json.max = this.content.max.value;

		return json

	}

	deserialize(json)
	{
		super.deserialize(json);
		this.content.page.value = json.page;
		this.content.max.value = json.max;
	}

	initStr()
	{
		super.initStr();
		
		let str = "$node_" + this.id + " = new mlNodePageVisited;\n";
		str += "$node_" + this.id + "->data['page'] = '" + this.content.page.value + "';\n";
		str += "$node_" + this.id + "->data['max'] = '" + this.content.max.value + "';\n";
		return str;
	}

	executeStr(isEvent = false)
	{
		if (!isEvent || this.executed)
			return "";

		this.executed = true;

		let s = "if ($_POST['event'] == '" + this.id + "' %26%26 $_POST['page'] == $node_" + this.id + "->data['page'])  ";
		s += "$res_" + this.id + " = $node_" + this.id + "->execute([$_POST]);\n";

		return s;
	}
}