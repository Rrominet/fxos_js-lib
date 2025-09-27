class CodeParser
{
	//code as string 
	//format as constants
	constructor(code, format)
	{
		constants();
		this.code = code.replace(/\r/g, "");
		this.format = format;
	}

	
	//return all functions as str in a list
	functions()
	{
		let _r = [];

		let lines = this.code.split("\n"); 
		for (let l of lines)
		{
			if (l.includes("function")
				&& l.includes("(")
				&& l.includes(")"))
			{
				if (l.includes("addEventListener") || l.includes ("let ") || l.includes ("var ") || l.includes ("setTimeout") || l.includes ("setInterval")
				|| (l.replace(/ /g, "").includes("=function") && !l.includes("prototype"))
				||  l.replace(/ /g, "").replace(/function\(\)/g, "") == ""
					)
					continue;

				let f = l;
				f = f.replace(/{/g, ""); 
				f = f.replace(/}/g, ""); 
				_r.push(f);
			}
		}

		return _r;
	}

	// return list of class object
	// class : {name, methods{declaration, comments}}
	classes()
	{
		let _r = [];

		let i = 0;
		while (i!=-1)
		{
			let index = this.code.substring(i).indexOf("class ");
			if (index == -1)
				break;
			i += index;

			if (this.includesOnHisLine(i, "\"")
			||  this.includesOnHisLine(i, "'" )
			||  this.includesOnHisLine(i, "`" ))
			{
				i += 7
				continue;
			}
			

			let cl = {}; 
			cl.name = this.className(i); 
			cl.methods = this.methodsFromClassContent(this.classContentAsStr(i));

		

			_r.push(cl);
			// search other class
			i += 7
			if (i>= this.code.length)
				break;
		}

		return _r;
	}

	className(index)
	{
		let line = this.lineFromIndex(index); 
		line = line.replace(/ /g, ""); 
		line = line.replace(/class/g, ""); 
		line = line.split("//")[0];

		return line;
	}

	classContentAsStr(index)
	{
		let after = this.code.substring(index); 
		let begin = -1; 
		let end = -1; 

		let level = 0;

		for (let i=0; i<after.length; i++)
		{
			if (after[i] == "{")
			{
				if (level == 0)
				{
					begin = i;
				}
				level++;
			}

			else if (after[i] == "}")
			{
				level --;
				if (level == 0)
				{
					end = i;
				}
			}
		}

		return after.substring(begin + 1, end);
	}

	removeComments(str)
	{
		let lines = str.split("\n");
		let ok = [];
		for (let l of lines)
		{
			l = l.replace(/\t/g, "");
			l = l.replace(/ /g, "");
			let i = l.indexOf("//");
			if (i!=-1)
			{
				l = l.substring(0, i);
			}
			ok.push(l);
		}

		let _r = ok.join("\n");
		return _r;

		// manage /**/ comment type

		// let start = 0; 
		// let end = 0;

		// while(start != -1)
		// {
		// 	start = _r.substring(start).indexOf("/*");
		// 	if (start == -1)
		// 		break;

		// 	end = _r.substring(start).indexOf("*/");
		// }
	}

	//return code with no comments and no blank lines
	clean(str)
	{
		let _r = this.removeComments(str); 
		let lines = _r.split("\n"); 
		let ok = []; 

		for (let l of lines)
		{
			if (l == "" || l==" ")
				continue;
			else 
				ok.push(l); 
		}

		_r = ok.join("\n");
		return _r; 
	}

	//content as string
	//return list of str with methods declaration
	methodsFromClassContent(content)
	{
		content = this.clean(content);
		let level = 1;
		let methods = [];
		for (let i=0; i<content.length; i++)
		{
			if (content[i] == "{")
			{
				if (level == 1)
				{
					let bef = content.substring(0, i); 
					let methodName = [];
					for (let j = bef.length -1; j>=0; j--)
					{
						if (bef[j] == "}")
							break;

						methodName.unshift(bef[j]); 
					}
					let method = {}; 
					method.name = methodName.join("").replace(/,/g, ", ").replace(/\(/g, " (").replace(/\n/g, ""); 
					method.comments = this.getFunctionComments(method.name); // attention à changer car method.name peut être différent de la verion du code
					methods.push(method);
				}

				level ++;
			}
			else if (content[i] == "}")
			{
				level --;
			}
		}
		return methods;
	}

	//return line as str
	lineFromIndex(index)
	{
		let bef = this.code.substring(0, index);
		let aft = this.code.substring(index);

		let befLine = [];
		let afterLine = [];

		for (let i=bef.length-1; i<=0; i++)
		{
			if (bef[i]!="\n")
				befLine.unshift(bef[i]);
			else 
				break;
		}

		for (let i=0; i<aft.length; i++)
		{
			if (aft[i]!="\n")
			{
				afterLine.push(aft[i]);
			}
			else 
				break;
		}
		return befLine.join("") + afterLine.join("");
	}

	includesOnHisLine(index, char)
	{
		let line = this.lineFromIndex(index);
		return line.includes(char);
	}

	isInScope(txt)
	{
		let i = this.code.indexOf(txt); 
		if (i == -1)
			return false;

		let before = this.code.substring(0, i);
		let after = this.code.substring(i + txt.length-1);

		let inBracketIndex = -1;
		let outBracketIndex = -1;

		for (let j=before.length-1; j>=0; j--)
		{
			if (before[j] == "{")
			{
				inBracketIndex = j;
				break;
			}
		}

		for (let k=0; k<after.length; k++)
		{
			if (after[k] == "}")
			{
				outBracketIndex = k;
				break;
			}
		}

		if (inBracketIndex == -1 || 
			outBracketIndex == -1)
			return false;

		let block = this.code.substring(inBracketIndex, outBracketIndex);
		if (block.includes(txt))
			return true;
		return false;
	}

	//return comment lines in an array
	getFunctionComments(funcLine)
	{
		let i = this.code.indexOf(funcLine);
		while (this.lineFromIndex(i).includes("."))
			i += this.code.indexOf(funcLine);

		let before = this.code.substr(0, i);
		let comments = [];

		let lines = before.split("\n");
		for (let j=lines.length-1; j>=0; j--)
		{
			if (!lines[j].includes("//") && (lines[j].includes("}") || lines[j].includes(";") || lines[j].includes("=")))
				break;

			if (lines[j].includes("//"))
				comments.unshift(lines[j].replace("//", ""));
		}

		// let start = -1;
		// let end = before.length -1;

		// for (let j=before.length-1; j>=0; j--)
		// {
		// 	if (before[j] == "{")
		// 	{
		// 		inBracketIndex = j;
		// 		break;
		// 	}
		// }

		return comments;
	}
}

function constants()
{
	CODE_WRITER_JS = "js"; 
	CODE_WRITER_PHP = "php"; 
	CODE_WRITER_PYTHON = "py"; 
}