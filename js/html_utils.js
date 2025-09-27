//return an array which split from all html char 
// ex of posible returned value : 
// htmlSre = '<a href=''> my link is <b>important</b></a>
// return = ["<a href=''>", " my link is ", "<b>" ,"important", "</b>", "</a>"]
function getAsArray(htmlStr)
{
	let html = htmlStr.replace(/>/g, "<");
	let t1 = html.split("<"); 
	for (let i=0; i<t1.length; i++)
	{
		if (htmlStr.includes("<" + t1[i] + ">"))
			t1[i] = "<" + t1[i] + ">";
	}

	return t1;
}

function containHtml(str)
{
	if (str.includes("<") && str.includes(">"))
		return true; 
	return false;
}

String.prototype.isLink = function () 
{
	let s = this.toString();
	if (
		s.includes(" ") || 
		s.includes("\"")|| 
		s.includes("'") ||
		s.includes("<") ||
		s.includes(">")
	)
		return false;
	
	if (
		!s.includes("://") &&
		!s.includes("://") ||
		!s.includes(".") ||
		!s.includes("/")
	)
		return false;

	return true;
}

String.prototype.transformToA = function (blank = false)
{
	let s = this.toString();
    s = s.replaceAll("<br/>", "");
    s = s.replaceAll("<br>", "");
    s = s.replaceAll("<b>", "");
    s = s.replaceAll("<r>", "");
    s = s.replaceAll("<u>", "");
    s = s.replaceAll("<em>", "");
    s = s.replaceAll("<strong>", "");
	let bef = "<a href='" + s + "'";
	if (blank)
		bef += " target='_blank'";
	bef += ">";
	let end = "</a>";
	return bef + s + end;
}

Node.prototype.isTheSame = function(node)
{
    if (node.nodeType == this.nodeType && node.textContent == this.textContent && node.nodeValue == this.nodeValue)
        return true;
    return false;
}

HTMLElement.prototype.getNodeFromSimilar = function(node)
{
    for (const c of this.deepChildNodes())
    {
        if (node.isTheSame(c))
            return c;
    }
    return null;
}
