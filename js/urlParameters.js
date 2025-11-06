function getUrlParameter(paramaterName) 
{
    let url = decodeURI(location.href)
    const u = new URL(url);
    return u.searchParams.get(paramaterName);
}

window.urlParameters = getUrlParameter;
window.urlParameter = getUrlParameter;

Location.prototype.get = getUrlParameter;

Location.prototype.id = function ()
{
    const tmp = location.href.split("#");
    if (tmp.length == 1)
        return ""; 
    return tmp.last();
}

Location.prototype.getId = Location.prototype.id;

Location.prototype.parse = function(url=null)
{
    if (!url)
        url = decodeURI(this.href)
    else 
        url = decodeURI(url);

    const u = new URL(url);
    let tmp = u.search.slice(1).split("&");

    const parsed = {};
    parsed.host = u.host;
    parsed.origin = u.origin;
    parsed.pathname = u.pathname;
    parsed.simpleUrl = u.origin + u.pathname;

    if (u.hash)
        parsed.id = u.hash.slice(1);

    parsed.parameters = {};

    for (let t of tmp)
    {
        let t2 = t.split("=");
        if (t2.length>1)
            parsed.parameters[t2[0]] = value(t2[1]);
    }

    return parsed;
}

Location.prototype.parsed = Location.prototype.parse;
