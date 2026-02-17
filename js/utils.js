if (typeof document != "undefined")
{
    D = document;
    B = document.body;
    H = document.head;
}

letters = "abcdefghijklmnopqrstuvwxyz";
lettersMaj = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

Array.prototype.move = function(from, to) 
{
    this.splice(to, 0, this.splice(from, 1)[0]);
};

Array.prototype.remove = function(elmt) 
{
    for (let i=0; i<this.length; i++)
    {
        if (this[i] == elmt) 
        {
            this.splice(i, 1);
            return;
        }
    }
};

// array could be an Array or a single elemt too
Array.prototype.subtract = function(array)
{
    let _r = [];
    if (typeof(array) != "object")
        array = [array];
    for (let i=0; i<this.length; i++)
    {
        if (!array.includes(this[i]))
            _r.push(this[i]);
    }

    return _r;
}

// func take the iterated elmt of the Array in argument
// must return a bool
Array.prototype.removeIf = function(func) 
{
    let len = this.length;
    for (let i=0; i<len; i++)
    {
        if (func(this[i]))
        {
            this.splice(i, 1);
            len --;
        }
    }
};

Array.prototype.serialize = function() 
{
    let serialized = [];

    for (let i=0; i<this.length; i++)
    {
        serialized.push(this[i].serialize());
    }

    return serialized;
};

Array.prototype.allToString = function() 
{
    for (let i=0; i<this.length; i++)
    {
        this[i] = this[i].toString();
    }
};

Array.prototype.toCode = function()
{
    let code = "[";
    
    for (let i=0; i<this.length; i++)
    {
        if (typeof(this[i]) == "string")
            code += "\"" + this[i] + "\"";
        else 
            code += this[i];
        if (i != this.length - 1)
            code += ",";
    }

    code += "]";
    return code;
}

Array.prototype.last = function() 
{
    return this[this.length -1];
};

Array.prototype.unique = function() 
{
    return [...new Set(this)];
};

Array.prototype.clear = function() 
{
    while(this.length>0)
        this.remove(this.last());
}

// clear the array and get all the value of the argument
Array.prototype.copyFrom = function(array) 
{
    this.clear();
    for(let i=0; i<array.length; i++)
    {
        this.push(array[i]);
    }
}

Array.prototype.clean = function (type)
{
    let tmp = [];

    if (type == "emails")
    {
        tmp = this.unique(); 
        i = 0;
        while (i<tmp.length)
        {
            if (tmp[i] == ""||
                tmp[i] == "false"||
                tmp[i] == "*"||
                !tmp[i].includes("@")||
                tmp[i].includes("romain.gilliot")||
                tmp[i].includes("maud.zellner") ||
                tmp[i].includes("pierre.legrand.mlt"))
            {
                tmp.remove(tmp[i]);
            }
            else 
                i++;
        }
    }

    this.copyFrom(tmp);
}

Array.prototype.isEqual = function(array2)
{
    if (this.length != array2.length)
        return false;
    for (let i=0; i<this.length; i++)
    {
        if (array2[i] != this[i])
            return false;
    }

    return true;
}

Array.prototype.swapByIdxs = function (index1, index2)
{
    let tmp = this[index1];
    this[index1] = this[index2];
    this[index2] = tmp;
}

Array.prototype.swap = function (elmt1, elmt2)
{
    let index1 = this.indexOf(elmt1);
    let index2 = this.indexOf(elmt2);
    this.swapByIdxs(index1, index2);
}

String.prototype.clean = function(dash=true, spacechar="")
{
    let s = this.toString();
    s = s.toLowerCase();
    s = s.replace(/é/g, "e");
    s = s.replace(/è/g, "e");
    s = s.replace(/ê/g, "e");
    s = s.replace(/ë/g, "e");
    s = s.replace(/à/g, "a");
    s = s.replace(/â/g, "a");
    s = s.replace(/ä/g, "a");
    s = s.replace(/û/g, "u");
    s = s.replace(/ù/g, "u");
    s = s.replace(/ü/g, "u");
    s = s.replace(/ŷ/g, "y");
    s = s.replace(/ÿ/g, "y");
    s = s.replace(/î/g, "i");
    s = s.replace(/ï/g, "i");
    s = s.replace(/ô/g, "o");
    s = s.replace(/ö/g, "o");
    s = s.replace(/ /g, spacechar);
    s = s.replace(/,/g, spacechar);
    s = s.replace(/;/g, spacechar);
    s = s.replace(/'/g, "-");
    if (dash)
    {
        s = s.replace(/-/g, "");
        s = s.replace(/_/g, "");
    }
    s = s.replace(/@/g, "_a_");

    return s;
};

String.prototype.splitMultiple = function (separators)
{
    if (!Array.isArray(separators))
        separators = [separators];
    const regex = new RegExp(separators.join("|"), "g")
    return this.split(regex);
}

Array.prototype.random = function ()
{
    const i = Math.floor(Math.random() * this.length);
    return this[i];
}

Array.prototype.exec = function (...args)
{
    for (let i=0; i<this.length; i++)
    {
        if (typeof(this[i]) == "function")
            this[i](...args);
        else
            args[0](this[i]);
    }
}
Array.prototype.execs = Array.prototype.exec;

// remove any parameters from your url (like anchor (#) or $_GET parameters (?key=value&key2=value2))
// don't apply on the string itself, it return a new string.
String.prototype.removeParameters = function()
{
    let s = this.toString();
    let tmp = s.split("?"); 
    s = tmp[0]; 

    tmp = s.split("#"); 
    s = tmp[0]; 
    return s;
};

//return true if the string contains at least one list elmt.
String.prototype.containsListElt = function(list)
{
    for (el of list)
    {
        if (this.indexOf(el) != -1)
            return true;
    }
    return false;
}

String.prototype.allIndexesOf = function (str)
{
    if (str == "")
        return [];

    let indexes = []; 
    let i=-1;
    while (true)
    {
        i = this.indexOf(str, i+1);
        if (i!= -1)
            indexes.push(i);
        else 
            break;
    }

    return indexes;

}

//toRemove remove a certain amount of character after 'start'
String.prototype.insert = function (start, str, toRemove=0)
{
   return this.slice(0, start) + str + this.slice(start + toRemove);
}

String.prototype.inHtmlBalise = function(index)
{
    let s = this.toString();
    let inBalises = s.allIndexesOf("<"); 
    let outBalises = s.allIndexesOf(">"); 

    if (inBalises == [] && outBalises == [])
        return false;

    for (let i=0; i<inBalises.length; i++)
    {
        if (inBalises[i] < index && index <= outBalises[i])
            return true;
    }

    return false;
}
String.prototype.capitalize = function ()
{
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.last = function()
{
    return this.slice(-1);
}

String.prototype.pop = function()
{
    return this.substring(0, this.length - 1);
}

String.prototype.compare = function(b)
{
    let diff = "";
    for (let i=0; i<this.length; i++)
    {
        if (b.length<=i)
        {
            console.log( "b is this not large enough ! :o");
            console.log( this.length)
            console.log( b.length)
            break;
        }
        if (this.toString()[i] != b[i])
            diff += b[i];
    }

    return diff;
}

//filters is a list a string. if the urls soes not includes these strings theay are NOT returned. 
//if filters is empty, ir returns ALL urls
String.prototype.urls = function(filters=[])
{
    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    if (typeof(filters) != "object")
        filters = [filters];

    let _urls = this.match(regex);
    if (!_urls)
        _urls = [];
    let urls = [];
    for (const filter of filters)
        urls = urls.concat(_urls.filter((s) => s.includes(filter))) ;

    return urls;
}

//blank will add the prop target='_blank' in the <a></a> tag
//filters is an array of strings. if one these string is in url, it will do nothing to this url (to tag transformation))
String.prototype.withUrlsAsLinkTag = function(blank=false, filters=[])
{
    let urls = this.urls();
    if (typeof(filters) == "string")
        filters = [filters];
    for (const filter of filters)
    {
        urls = urls.subtract(urls.filter((s) => s.includes(filter))) ;
        testlog(urls);
    }

    urls = urls.unique();
    testlog(urls);

    let _r = this.toString();
    for (const url of urls)
    {
        let replaced = "<a href='" + url + "'>" + url + "</a>";
        if (blank)
            replaced = "<a href='" + url + "' target='_blank'>" + url + "</a>";

        _r = _r.replaceAll(url, replaced);
    }

    return _r;
}

// will cut the string if it's too long
// the suffix length is not inclued in the maxlength
String.prototype.strip = function(maxlength, suffix="...")
{
    let s = "";
    if (this.length > maxlength)
        s = this.slice(0, maxlength) + suffix;
    else
        s = this;
    return s;
}

function boolToStr(bool)
{
    if (bool)
        return "true"; 

    else 
        return "false";
}

function strToBool(str)
{
    if (str == true)
        return str;
    else if (str == false)
        return str;
    
    if (str.toLowerCase() == "true")
        return true;

    else 
        return false;
}

Date.prototype.asTimeString = function ()
{
    return this.toTimeString().split(" ")[0];
}

Date.prototype.toYYYYMMDDTHHmmssZ = function()
{
    // Pad numbers to two digits
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    return this.getUTCFullYear() +
        pad(this.getUTCMonth() + 1) + // Months are zero indexed
        pad(this.getUTCDate()) +
        'T' +
        pad(this.getUTCHours()) +
        pad(this.getUTCMinutes()) +
        pad(this.getUTCSeconds()) +
        'Z'; // 'Z' indicates UTC time
}

Date.prototype.toYYYYMMDDTHHmmss = function()
{
    return this.toISOString()
}

Date.prototype.toYYYYMMDD = function()
{
    return this.toISOString().split("T")[0];
}

Date.prototype.withoutTime = function()
{
    return new Date(this.toYYYYMMDD());
}

Date.prototype.fromStr = function (str, type = "fr")
{
    if (!str)
        return new Date;

    let t = str.split("/"); 
    if (t.length<2)
        t = str.split("-"); 

    let d = "00"; 
    let m = "00"; 
    let y = "1970";

    if (type == "fr")
    {
        d = t[0];
        m = t[1];
        y = t[2];
    }

    else if (type == "en")
    {
        d = t[1];
        m = t[0];
        y = t[2];
    }

    this.setTime(Date.parse(y + "-" + m + "-" + d));

    return this;
};

//timestamp is in seconds (not miliseconds)
Date.setInputFromTimestamp = function (input, timestamp)
{
    let date = null;
    if (timestamp instanceof Date)
        date = timestamp;
    else  
        date = new Date(timestamp * 1000); // convert to milliseconds

    // Format to "YYYY-MM-DDTHH:mm"
    const localISO = date.toISOString().slice(0, 16);
    const timezoneOffset = date.getTimezoneOffset(); // in minutes

    // Adjust for local timezone
    const localDate = new Date(date.getTime() - timezoneOffset * 60000);
    input.value = localDate.toISOString().slice(0, 16);
}

Date.prototype.setInput = function (input)
{
    Date.setInputFromTimestamp(input, this.getTime() / 1000);
}


Date.fromStr = function (str, type = "fr")
{
    let date = new Date;
    date.fromStr(str, type);
    return date;
};

Date.readeableFromSeconds = function (time = -1)
{
    if (time == -1) 
        time = new Date().getTime();
    else 
        time = time *1000;

    let d = new Date(time);
    let str = "";

    let day = String(d.getDate()).padStart(2, '0');
    let month = String(d.getMonth() + 1).padStart(2, '0');
    let houre = String(d.getHours()).padStart(2, '0');
    let min = String(d.getMinutes()).padStart(2, '0');

    str += day + "/" + month + "/" + d.getFullYear();
    str += " à " + houre + ":" + min;

    return str;
}

Date.readableFromSeconds = Date.readeableFromSeconds;

Date.prototype.getOnlyDay = function ()
{
    let d = new Date (this.getTime()); 
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    return d;
}

Date.prototype.getMonday = function ()
{
    if (this.getDay() == 1)
        return this.getOnlyDay();

    let t = this.getTime(); 
    let newTime = 0;

    if (this.getDay()>1)
    {
        newTime = t - ((this.getDay() - 1) * 1000 * 3600 *24);
    }

    else if (this.getDay() == 0) // dimanche (7-1)! 
    {
        newTime = t - (6 * 1000 * 3600 *24);
    }

    let mondayDate = new Date(newTime);
    mondayDate = mondayDate.getOnlyDay();

    return mondayDate;
}

Date.prototype.isTheSameDay = function(d2)
{
    if (this.getFullYear() == d2.getFullYear() &&
        this.getMonth()    == d2.getMonth() &&
        this.getDate()     == d2.getDate()
    )
        return true; 
    return false;
}

Date.prototype.asFrench = function(includeDay = true, includeMonth = true, includeYear = true, includeTime=false, isDuration=false)
{
    let d = this.getDate(); 
    if (isDuration)
        d --;
    let m = this.getMonth() + 1; 
    if (isDuration)
        m -= 1;
    let y = this.getFullYear();
    if (isDuration)
        y -= 1970;

    let r = String(d).padStart(2, '0')+ "/" + String(m).padStart(2, '0') + "/" + String(y).padStart(2, '0');
    if (includeDay && includeMonth && includeYear)
    {

    }
    else 
    {
        tmp = r.split("/"); 
        if (!includeMonth && !includeDay && !includeYear)
            tmp = tmp.slice(3);
        else if (!includeMonth && !includeDay)
            tmp = tmp.slice(2);
        else if (!includeDay)
            tmp.remove(tmp[0]); 
        else if (!includeMonth)
            tmp.remove(tmp[1]); 
        else if (!includeYear)
            tmp.remove(tmp[2]); 

        r = tmp.join("/");
    }

    if (includeTime)
    {
        let h = this.getHours();
        if (isDuration)
            h -=1 ;
        let m = this.getMinutes();
        let s = this.getSeconds();

        let time = String(h).padStart(2, "0") + ":" + 
            String (m).padStart(2, "0") + ":" +
            String (s).padStart(2, "0");
        if (r.length>0)
            r += " - " + time;
        else 
            r = time;
    }

    return r;
}

Date.prototype.asDuration = function(includesMinutes=true, includesSeconds=true)
{
    let d = this.getDate(); 
    d --;
    let m = this.getMonth() + 1; 
    m -= 1;
    let y = this.getFullYear();
    y -= 1970;
    let h = this.getHours();
    h -=1 ;
    let min = this.getMinutes();
    let s = this.getSeconds();

    let str = "";
    if (y)
        str += y + " années, ";
    if (m)
        str += m + " mois, ";
    if (d)
        str += d + " j, ";
    if (h)
        str += h + " h, ";
    if (min && includesMinutes)
        str += min + " min, ";
    if (s && includesMinutes && includesSeconds)
        str += s + " s";

    while(str.last() == " " || str.last() == ",")
        str = str.slice(0, str.length-1);

    return str;
}

Date.timeForMyTimezone = function(time)
{
    time = time + (new Date().getTimezoneOffset() * 60 * 1000);
    return time;
}


Date.dayTime = function ()
{
    return 86400000;
}

Date.weekTime = function ()
{
    return 604800000;
}

Date.yearTime = function()
{
    return 52.1429*Date.weekTime();
}

// return getTime divide by 1000
Date.prototype.getTimePhp = function () 
{
    let t = this.getTime();
    t = t/1000; 
    return parseInt(t);
}

Date.prototype.frenchMonth = function()
{
    let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return months[this.getMonth()];
}


function createVideoLecteur(videoPath, imgPath, type="formation")
{
    let iframe = D.createElement("iframe");

    let videoDir = ""; 
    let videoName = ""; 

    let tmp = videoPath.split("/"); 
    videoName = tmp.pop();
    videoDir = tmp.join("/");

    iframe.classList.add("lecteurVideo"); 
    iframe.classList.add("videos"); 
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("webkit-playsinline", "true");
    iframe.setAttribute("playsinline", "true");
    iframe.src = "https://motion-live.com/lecteur/lecteur.php?"; 
    iframe.src += "dir=" + videoDir; 
    iframe.src += "&name=" + videoName; 
    iframe.src += "&type=" + type; 
    iframe.src += "&img=" + imgPath; 

    iframe.body = function () 
    {
        if (!iframe.contentWindow)
            return null;
        return iframe.contentWindow.document.body;
    }

    return iframe;
}

function setVideoSize(responsive = false) 
{
    for (let v of D.getElementsByClassName("lecteurVideo"))
    {
        v.style.width = "100%";

        let w = v.getClientRects()[0].width;

        if (outerWidth<840)
            v.style.height = (w + 150) + "px";
        else 
            v.style.height = (w*0.5625 + 100) + "px";
    } 		
}

function youtubeResponsive()
{
    for (let v of D.getElementsByClassName("videos"))
    {
        if (outerWidth>1250)
            v.style.width = "65%";
        else 
            v.style.width = "95%";

        let w = v.getClientRects()[0].width;

        v.style.height = (w*0.5625) + "px";
    } 
}

function addYoutubeVideo(embedUrl, buttons, offLineLink = "")
{
    let mask = D.createElement("div");
    mask.classList.add("externVideos"); 
    mask.classList.add("masks"); 
    B.appendChild(mask);

    mask.div = D.createElement("div"); 
    mask.appendChild(mask.div); 
    mask.div.classList.add("youtubeContainer");

    mask.div.close = D.createElement("img");
    mask.div.close.classList.add("closes"); 
    if (!navigator.onLine)
        mask.div.close.src = "images/cross.png";
    else
        mask.div.close.src = "https://pictures.motion-live.com/images/cross.png";
    mask.div.close.title = "Fermer cette vidéo";
    mask.div.close.alt = "Fermer cette vidéo";
    mask.div.appendChild(mask.div.close); 

    if (!navigator.onLine && offLineLink != "")
    {
        mask.div.iframe = D.createElement("video"); 
        mask.div.iframe.classList.add("videos");// iframe = video
        mask.div.iframe.classList.add("centerHeight")
        mask.div.iframe.controls = true; 
        mask.div.iframe.source = D.createElement("source"); 
        mask.div.iframe.source.src = offLineLink; 
        mask.div.iframe.source.type = "video/mp4"; 

        mask.div.iframe.appendChild(mask.div.iframe.source);
        mask.div.appendChild(mask.div.iframe);

        for (let b of buttons)
        {
            b.addEventListener("click", function () 
                {
                    mask.style.transform = "scale(1)";
                    setTimeout(youtubeResponsive, 500);
                });
        }
    }

    else 
    {
        mask.div.iframe = D.createElement("iframe"); 
        mask.div.iframe.classList.add("videos"); 
        mask.div.iframe.setAttribute("allowfullscreen", true);
        mask.div.iframe.setAttribute("frameborder", 0)
        mask.div.iframe.classList.add("centerHeight")
        mask.div.appendChild(mask.div.iframe);

        for (let b of buttons)
        {
            b.addEventListener("click", function () 
                {
                    mask.div.iframe.src = embedUrl; 
                    mask.style.transform = "scale(1)";
                    setTimeout(youtubeResponsive, 500);
                });
        }
    }

    mask.div.close.addEventListener("click",
        function () 
        {
            mask.style.transform = "scale(0)";
            if (navigator.onLine)
                mask.div.iframe.src = "";
            else
                mask.div.iframe.pause();
        });

}

function includeYoutubeVideo(embedUrl, place="after", node, offLineLink = "")
{
    if (!navigator.onLine && offLineLink != "")
    {
        let video = D.createElement("video"); 
        video.controls = true;
        video.source = D.createElement("source");
        video.source.src = offLineLink; 
        video.source.type = "video/mp4";

        video.classList.add("videos");
        video.classList.add("youtube");

        video.appendChild(video.source);

        if (place=="after")
            insertAfter(video, node);
        else
            node.parentNode.insertBefore(video, node);

        return video;
    }

    else
    {
        let iframe = D.createElement("iframe"); 
        iframe.src = embedUrl; 
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allow", "accelerometer");
        iframe.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
        iframe.setAttribute("allowfullscreen", true);
        iframe.classList.add("videos");

        if (place=="after")
            insertAfter(iframe, node);
        else
            node.parentNode.insertBefore(iframe, node);

        return iframe;
    }
}

function insertAfter(newNode, before)
{
    let after = before.nextElementSibling; 
    if (!after)
        before.parentNode.append(newNode);

    else
        after.parentNode.insertBefore(newNode, after);
}

HTMLElement.prototype.insertAfter = function (newNode)
{
    insertAfter(newNode, this);
}
HTMLElement.prototype.toggleClass = function (cls)
{
    if (this.classList.contains(cls))
        this.classList.remove(cls);
    else
        this.classList.add(cls);
}

HTMLElement.prototype.addAfter = HTMLElement.prototype.insertAfter;

HTMLElement.prototype.addBefore = function (newNode)
{
    this.parentNode.insertBefore(newNode, this);
}

HTMLElement.prototype.remove = function()
{
    if (this.parentNode)
        this.parentNode.removeChild(this);
}

// nodeTag is the type of tag you want your txt in it
HTMLElement.prototype.prependHtml = function (html, nodeTag, classList = [])
{
    let node = D.createElement(nodeTag); 
    node.innerHTML = html;
    if (typeof(classList) == "string")
        node.classList.add(classList); 
    else 
    {
        for (let cls of classList)
        {
            node.classList.add(cls);
        }
    }

    this.addBefore(node);
    return node;
}
// nodeTag is the type of tag you want your txt in it
HTMLElement.prototype.appendHtml = function (html, nodeTag, classList = [])
{
    let node = this.parentNode.newNode(nodeTag, classList); 
    node.innerHTML = html;
    return node;
}


function addBgImg(node, url, title="")
{
    let img = D.createElement("img"); 
    img.src = url; 
    img.title = title; 
    img.alt = node.innerText;

    img.classList.add("bgImgs"); 

    node.parentNode.insertBefore(img, node);

    return img;
}

function fullScreenOn(elmt=B)
{
    elmt.requestFullscreen();
}

HTMLElement.prototype.fullscreen = function()
{
    fullScreenOn(this);
}

HTMLElement.prototype.setFullscreen = function()
{
    this.classList.add("fullscreen");
    this.addEventListener("click", () => this.fullscreen());
}

function fullScreenOff() 
{
    if (document.webkitIsFullScreen || document.mozFullScreen)
    {
        if (navigator.userAgent.includes("Chrom") || navigator.userAgent.includes("Safari") || navigator.userAgent.includes("Opera"))
            document.webkitExitFullscreen();
        else if (navigator.userAgent.includes("Firefo"))
            document.mozCancelFullScreen();
        else 
            document.msRequestFullscreen();
    }
}

function addOnFullScreenChange(func)
{
    addEventListener("fullscreenchange", func);
    addEventListener("mozfullscreenchange", func);
    addEventListener("webkitfullscreenchange", func);
    addEventListener("msfullscreenchange", func);
}

function isTouchable () 
{
    return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
}

function floatValueFromInput(input, pRound = 5)
{
    let val = parseFloat(input.value); 
    if (input.classList.contains("auto"))
        return "auto";
    if (isNaN(val))
        return 0.0; 

    return round(val, pRound);
}

HTMLInputElement.prototype.asInt = function ()
{
    let val = parseInt(this.value); 
    if (isNaN(val))
        return 0; 

    return val;
}

HTMLInputElement.prototype.asFloat = function (pRound = 5)
{
    return floatValueFromInput(this, pRound = 5);
}

function newNode(type, parent = B, classList = [], id="")
{
    const node = D.createElement(type); 
    if (typeof(classList) == "string" && classList != "")
        node.className = classList; 
    else if (classList)
    {
        for (let className of classList)
        {
            if (className)
                node.classList.add(className); 
        }
    }

    if (id !="")
        node.id = id;

    parent.appendChild(node); 

    return node;
}

function newElement (type, parent = B, classList = [], id="")
{
    const node = newNode (type, parent, classList, id);
    return node;
}

HTMLElement.prototype.newNode = function (type, classList = [], id="") 
{
    const node = newNode(type, this, classList, id); 
    return node;
}

HTMLElement.prototype.newElement = function (type, classList = [], id="") 
{
    const node = newNode(type, this, classList, id); 
    return node;
}

HTMLElement.prototype.prependNode = function(type, classList=[], id="")
{
    const node = D.createElement(type); 
    if (typeof(classList) == "string")
        node.className = classList; 
    else 
    {
        for (let className of classList)
            node.classList.add(className); 
    }

    if (id !="")
        node.id = id;

    this.prepend(node); 

    return node;
}

HTMLElement.prototype.newInput = function (type, name="", classList = [], id="") 
{
    let node = newNode("input", this, classList, id); 
    node.type = type;
    if (name)
        node.name = name;
    return node;
}


// newInput with more options
HTMLElement.prototype.addInput = function (type, placeholder="", classList = [], id="", name="")
{
    const i = this.newInput(type, name, classList, id); 
    if (placeholder)
    {
        i.placeholder = placeholder; 
        i.title = placeholder; 
    }
    if (type == "email")
        i.addEventListener("input", () => i.checkEmail());

    const numbers = "0123456789+";
    i.setAsPhone = () => 
    {
        i.addEventListener("input", () => 
            {
                let value = i.value;
                let newvalue = "";
                for (const c of value)
                {
                    if (numbers.includes(c))
                        newvalue += c;
                    else if (c == " ")
                        newvalue += c;
                }

                let maxlen = 10;
                if (newvalue.includes("+"))
                    maxlen = 15;
                if (newvalue.replaceAll(" ", "").length > maxlen)
                    newvalue = newvalue.slice(0, maxlen);
                i.value = newvalue;
            });
    };

    return i;
}

//the created input is connected to given object["propertyName"]
//this mean that when the input value change, the object["propertyName"] will do to
HTMLElement.prototype.addLinkedInput = function (object, propertyName, type, placeholder="", classList = [], id="", name="")
{

    const i = this.newInput(type, name, classList, id); 
    if (placeholder)
    {
        i.placeholder = placeholder; 
        i.title = placeholder; 
    }
    if (type == "email")
        i.addEventListener("input", () => i.checkEmail());

    i.connect(object, propertyName);
    return i;
}

HTMLElement.prototype.connect = function (object, propertyName)
{
    const onChange = () => {
        let v = null;
        if (this.tagName == "INPUT" || this.tagName == "TEXTAREA" || this.tagName == "SELECT")
            v = this.value;
        else 
            v = value(this.innerText);
        if (this.type == "checkbox")
            v = this.checked;
        object[propertyName] = v;
    }

    this.addEventListener("input", onChange);
    this.addEventListener("change", onChange);

    if (this.tagName == "INPUT" || this.tagName == "TEXTAREA" || this.tagName == "SELECT")
        this.value = object[propertyName];
    else 
        this.innerText = object[propertyName];
}

HTMLSelectElement.prototype.connect = HTMLInputElement.prototype.connect;

HTMLInputElement.prototype.checkEmail = function()
{
    if (this.value.includes(".") && this.value.includes("@") && !this.value.includes(" "))
    {
        this.classList.add("ok");
        return true;
    }
    else 
    {
        this.classList.remove("ok");
        return false;
    }
}

// newInput with more options
HTMLElement.prototype.newTextarea = function (placeholder="", classList = [], id="", name="")
{
    let i = this.newNode("textarea", classList, id); 
    if (placeholder)
    {
        i.placeholder = placeholder; 
        i.title = placeholder; 
    }
    return i;
}


HTMLElement.prototype.newA = function (href, classList = [], id="") 
{
    let node = newNode("a", this, classList, id); 
    node.href = href;
    return node;
}

HTMLElement.prototype.addA = function (txt, href, classList = [], id="") 
{
    const node = this.newA(href, classList, id);
    node.innerHTML = txt;
    return node;
}

// elmts could be any html elments
HTMLElement.prototype.labelInput = function (type, text, name="", classList = [], id="", elmts = [], placeholder="")
{
    const label = this.newNode("label", classList, id);
    label.classList.add("input-container");
    const txt = label.newNode("span"); 
    txt.innerHTML = text;
    const input = label.newInput(type, name);
    input.placeholder = placeholder; 
    input.title = placeholder;

    label.text = txt; 
    label.input = input; 

    label.getText = function () {return this.text.innerText};
    label.setText = function (txt) {this.text.innerText = txt};

    if (type == "number")
    {
        label.getValue = function () {return this.input.asFloat()};
        label.setValue = function (val) {this.input.value = val};
    }
    else if (type == "checkbox")
    {
        label.getValue = function () {return this.input.checked};
        label.setValue = function (val) {this.input.checked = strToBool(val)};
    }
    else 
    {
        label.getValue = function () {return this.input.value};
        label.setValue = function (val) {this.input.value = val};
    }

    label.callbacks = {};
    label.setNTrigger = function (val, type) {
        this.setValue(val);

        if (this.callbacks[type])
        {
            for (const cb of this.callbacks[type])
                cb();
        }
    };

    label.addEvent = function (type, callback)
    {
        if (!this.callbacks[type])
            this.callbacks[type] = [];
        this.callbacks[type].push(callback);
        this.input.addEventListener(type, callback);
    };

    label.elmts = elmts;

    for (let el of label.elmts)
        label.append(el);

    label.asInt = () => {return label.input.asInt()};
    label.asFloat = () => {return label.input.asFloat()};

    return label;
}

HTMLElement.prototype.cssInput = function (type, text, name="", classList = [], id="", elmts = [], placeholder="")
{
    return this.labelInput(type, text, name, classList, id, elmts, placeholder);
}

//oninput is a function with one argument the css string result
HTMLElement.prototype.css4Input = function(property, oninput=null, classList=[], id="", help="")
{
    const inputs = this.newNode("div", "css-inputs");
    inputs.title = help;
    inputs.index = 0;
    inputs.label = inputs.newTitle("label", property.capitalize() + " : ");
    inputs.one = inputs.addInput("range", "one");
    inputs.one.value = 0;

    inputs.two = inputs.newNode("div", "two");
    inputs.two.up = inputs.two.newInput("range", ["two", "up"]);
    inputs.two.side = inputs.two.newInput("range", ["two", "side"]);
    inputs.two.up.value = 0;
    inputs.two.side.value = 0;

    inputs.four = inputs.newNode("div", "four");
    inputs.four.up = inputs.four.addInput("number", "up", ["four", "up"]);
    inputs.four.right = inputs.four.addInput("number", "right", ["four", "right"]);
    inputs.four.down = inputs.four.addInput("number", "down", ["four", "down"]);
    inputs.four.left = inputs.four.addInput("number", "left", ["four", "left"]);

    inputs.two.hide();
    inputs.four.hide();

    inputs.units = inputs.newNode("select");
    inputs.units.addOption(["px", "px"]);
    inputs.units.addOption(["em", "em"]);

    inputs.coef = 1.0;

    val = function ()
    {
        if (isAuto(this))
            return "auto"
        else 
            return this.asFloat() * inputs.coef;
    }

    inputs.one.val = val;
    inputs.two.up.val = val;
    inputs.two.side.val = val;

    inputs.units.addEventListener("change", () =>{
        inputs.onChangeFunc(inputs.css());
        if (inputs.units.value == "em")
        {
            inputs.four.up.step = "0.1";
            inputs.four.right.step = "0.1";
            inputs.four.down.step = "0.1";
            inputs.four.left.step = "0.1";

            inputs.coef = 0.1;
        }
        else 
        {
            inputs.four.up.step = "1";
            inputs.four.right.step = "1";
            inputs.four.down.step = "1";
            inputs.four.left.step = "1";

            inputs.coef = 1;
        }
    });

    inputs.next = function()
    {
        if (this.index<2)
            this.index ++;
        this.updateFromIndex();
    };

    inputs.prev = function()
    {
        if (this.index>0)
            this.index --;
        this.updateFromIndex();
    };

    inputs.updateFromIndex = function ()
    {
        if (this.index == 0)
        {
            this.one.show();
            this.two.hide();
            this.four.hide();
        }

        else if (this.index == 1)
        {
            this.one.hide();
            this.two.show();
            this.four.hide();
        }

        else if (this.index == 2)
        {
            this.one.hide();
            this.two.hide();
            this.four.show();
        }
    }

    inputs.css = function ()
    {
        let replace = "auto" + this.units.value;
        const reg = new RegExp(replace,"g");
        if (this.index == 0)
        {
            let css = this.one.val() + this.units.value;
            if (isAuto(this.one))
                return css.replace(this.units.value, "");
            return css;
        }
        else if (this.index == 1)
        {
            let css = this.two.up.val() + this.units.value + " " + this.two.side.val() + this.units.value;
            return css.replace(reg, "auto");
        }
        else if (this.index == 2)
        {
            let css = this.four.up.asFloat() + this.units.value + " " + this.four.right.asFloat() + this.units.value + " " + this.four.down.asFloat() + this.units.value + " " + this.four.left.asFloat() + this.units.value;
            return css.replace(reg, "auto");
        }
    }

    inputs.addOnChange = function(func)
    {
        this.onChangeFunc = func;
        this.one.addEventListener("input", () => func(this.css()));
        this.two.up.addEventListener("input", () => func(this.css()));
        this.two.side.addEventListener("input", () => func(this.css()));
        this.four.up.addEventListener("input", () => func(this.css()));
        this.four.right.addEventListener("input", () => func(this.css()));
        this.four.down.addEventListener("input", () => func(this.css()));
        this.four.left.addEventListener("input", () => func(this.css()));
    }

    inputs.addEventListener("wheel", function (e) 
        {
            if (e.altKey)
                e.preventDefault();
            if (e.deltaY<0 && e.altKey)
                this.prev();
            else if (e.deltaY>0 && e.altKey) 
               this.next();
            this.onChangeFunc(this.css());
        });


    function toggleAuto(elmt)
    {
        if (!elmt.classList.contains("auto"))
            elmt.classList.add("auto");
        else 
            elmt.classList.remove("auto");
        inputs.onChangeFunc(inputs.css());
    }

    function isAuto(elmt)
    {
        return elmt.classList.contains("auto");
    }

    function onKey(e)
    {
        if (e.altKey && e.key == "a")
        {
            e.preventDefault();
            toggleAuto(this);
        }

        else if (e.altKey && e.key == "e")
        {
            e.preventDefault();
            inputs.coef *= 10;
        }

        else if (e.altKey && e.key == "E")
        {
            e.preventDefault();
            inputs.coef *= 0.1;
        }
    }

    inputs.one.addEventListener("keydown", onKey);
    inputs.two.up.addEventListener("keydown", onKey);
    inputs.two.side.addEventListener("keydown", onKey);
    inputs.four.up.addEventListener("keydown", onKey);
    inputs.four.right.addEventListener("keydown", onKey);
    inputs.four.down.addEventListener("keydown", onKey);
    inputs.four.left.addEventListener("keydown", onKey);

    return inputs;
}

// elmts could be any html elments
HTMLElement.prototype.newLabelInput = function (type, text, name="", classList = [], id="", elmts = [], placeholder="")
{
    let label = this.newNode("label", classList, id);
    let txt = label.newNode("span"); 
    txt.innerHTML = text;
    let input = label.newInput(type, name);
    input.placeholder = placeholder; 
    input.title = placeholder;

    label.text = txt; 
    label.input = input; 

    label.getText = function () {return this.text.innerText};
    label.setText = function (txt) {this.text.innerText = txt};

    if (type != "checkbox")
    {
        label.getValue = function () {return this.input.value};
        label.setValue = function (val) {this.input.value = val};
    }
    else if (type == "checkbox")
    {
        label.getValue = function () {return this.input.checked};
        label.setValue = function (val) {this.input.checked = val};
    }

    label.addEvent = function (type, callback)
    {
        this.input.addEventListener(type, callback);
    };

    label.elmts = elmts;

    for (let el of label.elmts)
        label.append(el);

    return label;
}

// options as [innerText, value]
// elmts could be any html elments to add after the select tag
HTMLElement.prototype.labelSelect = function (options = [], text="", name="", classList = [], id="", elmts = []) 
{
    let label = this.newNode("label", classList, id);

    let txt = label.newNode("span"); 
    if (text != "")
        txt.innerText = text;

    label.text = txt;
    label.select = label.newNode("select");

    for (let op of options)
    {
        let option = label.select.newNode("option");
        if (typeof(op) == "object")
        {
            option.value = op[1]; 
            option.innerText = op[0]; 
        }
        else 
        {
            option.value = op;
            option.innerText = op;
        }
    } 

    label.getText = function () {return this.text.innerText};
    label.setText = function (txt) {this.text.innerText = txt};

    label.getValue = function () {return this.select.value};
    label.setValue = function (value) {return this.select.value = value};

    label.elmts = elmts;

    label.selectedIndex = function (){
        return this.select.selectedIndex;
    };

    for (let el of label.elmts)
        label.append(el);

    label.callbacks = {};
    label.setNTrigger = function (val, type)
    {
        this.setValue(val);
        if (this.callbacks[type])
        {
            for (const cb of this.callbacks[type])
                cb();
        }
    };

    label.addEvent = function (type, callback)
    {
        if (!this.callbacks[type])
            this.callbacks[type] = [];
        this.callbacks[type].push(callback);
        this.select.addEventListener(type, callback);
    };

    // o = [innerText, value]
    label.add = function (o)
    {
        const op = label.select.newNode("option");
        if (typeof(o) == "object")
        {
            op.value = o[1];
            op.innerText = o[0];
        }
        else 
        {
            op.value = o;
            op.innerText = o;
        }
    }

    label.clear = function ()
    {
        label.select.clear();
    };

    label.getCurrentText = function ()
    {
        return label.select.selectedOptions[0].innerText;
    };

    return label;
}
//
// options as [innerText, value]
// elmts could be any html elments to add after the select tag
HTMLElement.prototype.newSelect = function (options = [], classList = [], id="") 
{
    const _r = this.newNode("select");

    for (let op of options)
    {
        let option = _r.newNode("option");
        if (typeof(op) == "object")
        {
            option.value = op[1]; 
            option.innerText = op[0]; 
        }
        else 
        {
            option.value = op;
            option.innerText = op;
        }
    } 

    _r.getText = function () {return ""};
    _r.setText = function (txt) {};

    _r.getValue = function () {return this.value};
    _r.setValue = function (value) {return this.value = value};

    _r.elmts = [];

    _r.setIndex = function (){
        return this.selectedIndex;
    };

    _r.callbacks = {};
    _r.setNTrigger = function (val, type)
    {
        this.setValue(val);
        if (this.callbacks[type])
        {
            for (const cb of this.callbacks[type])
                cb();
        }
    };

    _r.addEvent = function (type, callback)
    {
        if (!this.callbacks[type])
            this.callbacks[type] = [];
        this.callbacks[type].push(callback);
        this.addEventListener(type, callback);
    };

    // o = [innerText, value]
    _r.add = function (o)
    {
        const op = this.newNode("option");
        if (typeof(o) == "object")
        {
            op.value = o[1];
            op.innerText = o[0];
        }
        else 
        {
            op.value = o;
            op.innerText = o;
        }
    }

    _r.clear = function ()
    {
        this.clear();
    };

    _r.getCurrentText = function ()
    {
        return this.selectedOptions[0].innerText;
    };

    return _r;
}

HTMLElement.prototype.labelValue = function (label, value, unit="", classList = [], id="")
{
    const r = this.newNode("div", classList, id); 
    r.classList.add("label-container");
    if (label)
        r.label = r.newTitle("label", label + " : "); 
    else 
        r.label = r.newTitle("label", "");
    r.value = r.newTitle("label", "<b>" + value + "</b>" + unit, "value"); 
    r.value.children[0].formatNumbersWithSpaces();

    r.getText = function (){return this.label.innerHTML; }
    r.getLabel= r.getText;

    r.getValue = function(){return this.value.children[0].innerText;}

    r.setText = function (txt){return this.label.innerHTML = txt; }
    r.setLabel = r.setText;
    r.setValue = function (val){this.value.children[0].innerHTML = val;}

    r.addToValue = function(val){this.value.children[0].innerHTML += val;}

    return r;
}

HTMLElement.prototype.editableLabelValue = function (label, value, unit="", classList = [], id="")
{
    const r = this.labelValue(label, value, unit, classList, id);
    r.value.children[0].contentEditable = true;

    r.addEventListener = (type, func) => r.value.children[0].addEventListener(type, func);
    r.addEvent = r.addEventListener;

    return r;
}

function mkJs(src, forceReload=false)
{
    return newScript(src, forceReload);
}

function newScript(src, forceReload=false) 
{
    let sc = D.createElement("script"); 
    if (forceReload)
        src += "?ver=" + Date.now();
    sc.src = src;

    return sc;
}

function newScriptNode(src, forceReload=false)
{
    return newScript(src, forceReload);
}

function newScriptElement(src, forceReload=false) 
{
    return newScript(src, forceReload);
}

function newCss(href, doc=null) 
{
    let d = D;
    if (doc)
        d = doc;

    for (const el of d.getElementsByTagName("link"))
    {
        if (el.href == href)
            return;
    }

    const css = d.createElement("link");
    css.rel = "stylesheet"; 
    css.type = "text/css"; 
    css.href = href; 
    d.head.appendChild(css);

    return css;
}

function newCssNode(href)
{
    return newCss(href);
}

function newCssElement(href) 
{
    return newCss(href);
} 

function removeCss(href)
{
    for (let css of H.children)
    {
        if (css.rel == "stylesheet")
        {
            if (css.href == href)
                css.remove();
        }
    }
}

Date.prototype.toInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});


Number.prototype.withZero = function (numberOfZero = 2)
{
    let s = this.toString(); 
    return s.padStart(numberOfZero, "0");
}

Date.prototype.toHumanReadable = function(day=true, hours=true, min=true, secs=false)
{
    let s = ""; 
    if (day)
        s += this.asFrench(); 
    if (hours && day)
        s += " à ";
    if (hours)
        s += this.getHours().withZero(2);
    if (min)
        s += ":" + this.getMinutes().withZero(2); 
    if (secs)
        s += ":" + this.getSeconds().withZero(2);
    return s;
};

HTMLElement.prototype.newBr = function () 
{
    let br = D.createElement("br"); 
    this.appendChild(br);
}

HTMLElement.prototype.newLine = HTMLElement.prototype.newBr;

HTMLElement.prototype.addBr = HTMLElement.prototype.newBr;

function getType(object)
{
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((object).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
}

// liste de fonctions pour travailler facilement avec la forme du texte dans une texteaera.  // 

HTMLTextAreaElement.prototype.addTextAtCursor = function (pText, endPos = 0)
{
    let pos = this.selectionStart;
    let avText = this.value.substring(0, pos);
    let apText = this.value.substring(pos, this.value.length);

    this.value = avText + pText + apText;

    this.selectionStart += endPos;
}

function getActiveElementId()
{
    return document.activeElement.id;
}

function activeElmtAnInput()
{
    const active = document.activeElement;
    if (!active)
        return false;
    if (active.tagName == "INPUT" || active.tagName == "TEXTAREA")
        return true;
    if (active.tagName == "SELECT")
        return true;
    if (active.contentEditable == "true")
        return true;
    return false;
}

HTMLTextAreaElement.prototype.addSelectionText = function(pChar)
{
    let tmp = pChar.split ("<"); 
    let endChar = "</" + tmp[1];
    let txt = this.value; 
    let s = this.selectionStart;
    let e = this.selectionEnd; 
    let startText = txt.slice(0,s); 
    let middleText = txt.slice(s,e); 
    let endText = txt.slice(e, txt.length -1);
    this.value = startText + pChar + middleText + endChar + endText;
}

HTMLTextAreaElement.prototype.addTextToActiveLine = function (pChar)
{
    let tmp = pChar.split ("<"); 
    let endChar = "</" + tmp[1];
    let txt = this.value; 
    tmp = txt.split("\n"); 
    let s = this.selectionStart;
    let e = this.selectionEnd;
    if (s==e)
    {
        let pos = s; 
        let start = 0;
        let line = 0;

        for (let i =0; i<tmp.length; i++)
        {
            if (pos>=start && pos <= (start + tmp[i].length + 1))
            {
                line = i;
                break;
            }

            try
            {
                start += tmp[i].length + 1;
            }
            catch (e)
            {
            }

        }
        tmp[line] = pChar + tmp[line] + endChar;
        this.value = tmp.join("\n");
    }
    else 
    {
        addSelectionText(areaId, pChar);
    }
}

Date.asJHMS = function (time)
{
    if (time<1000)
        return [0,0,0,0]; 

    time = time/1000;
    let day = parseInt(time/(24*60*60)); 
    let houres = parseInt((time%(24*60*60))/(60*60));
    let minuts = parseInt((time%(60*60)/(60))); 
    let seconds = parseInt(time%60);

    return [day, houres, minuts, seconds];
}

HTMLElement.prototype.newText = function (text)
{
    this.append(D.createTextNode(text));
}

HTMLElement.prototype.newListArea = function (array)
{
    let area = this.newNode("list");

    for (let i=0; i<array.length; i++)
    {
        if (typeof(array[i]) == "object")
        {
            area.append(array[i]);
        }

        else
        {
            let el = area.newNode("elmt"); 
            el.innerText = array[i];
        }
    }

    area.hide = function()
    {
        this.style.display = "none";
    }

    area.show = function()
    {
        this.style.display = "block";
    }

    area.toggle = function()
    {
        if (this.style.display == "none") 
            this.style.display = "block";
        else 
            this.style.display = "none";
    }

    return area;
}

function isPhone()
{
    if (innerWidth<840)
        return true; 
    else 
        return false;
}

//return true if the script was append to the body
function importScript(script)
{
    const scripts = D.querySelectorAll("script");
    for (const s of scripts)
    {
        if (s.src == script.src)
            return false;
    }
    B.appendChild(script);
    return true;
}

//remove scripts in list that are already in body of the HTML doc (comparing the src attribute)
function filterScripts(scripts)
{
    const bscripts = D.querySelectorAll("script");
    let toRemove = [];
    for (let s of scripts)
    {
        if (typeof(s) == "object")
            s = s.src;
        for (const bs of bscripts)
        {
            if (bs.src == s)
                toRemove.push(s);
        }
    }

    for (const s of toRemove)
        scripts.remove(s);
    return scripts;
}

window._imported_scripts = window._imported_scripts || new Map();
// will download all the scripts in parallell but will parse them and execute them sequencially keeping the dependencies in the right order.
// if func exists, it will be executed ones everything is downloaded and parsed.
// prefer using the scripts.import(...) version that is compatible with async and await.
function importScripts(scripts, func=null, forceLoaded=false)
{
    scripts = filterScripts(scripts);
    const scriptsToLoad = [];
    
    for (let script of scripts)
    {
        if (typeof(script) == "object")
            script = script.src;
        const scriptName = script.split("/").pop();
        
        // Skip if already loaded
        if (window._imported_scripts.has(scriptName) && 
            window._imported_scripts.get(scriptName).executed)
        {
            continue;
        }
        
        // Skip if already in process
        if (window._imported_scripts.has(scriptName))
        {
            scriptsToLoad.push(window._imported_scripts.get(scriptName));
            continue;
        }
        
        // Fetch the script content (parallel download)
        const scriptObj = {
            script: script,
            downloaded: false,
            executed: false,
            content: null,
            fetchPromise: fetch(script)
                .then(response => response.text())
                .then(content => {
                    scriptObj.content = content;
                    scriptObj.downloaded = true;
                    return content;
                })
                .catch(err => {
                    if (forceLoaded) {
                        scriptObj.downloaded = true;
                        scriptObj.content = '';
                    }
                    throw err;
                })
        };
        
        window._imported_scripts.set(scriptName, scriptObj);
        scriptsToLoad.push(scriptObj);
    }
    

    let allJs = "";
    // Wait for ALL downloads to complete (parallel)
    Promise.all(scriptsToLoad.map(s => s.fetchPromise))
        .then(() => {
            // Execute sequentially
            for (let scriptObj of scriptsToLoad)
            {
                if (!scriptObj.executed && scriptObj.content !== null)
                {
                    allJs += scriptObj.content + "\n";
                    scriptObj.executed = true;
                }
            }

            // Add the scripts to the body
            const script = D.createElement("script");
            script.innerHTML = allJs;
            B.appendChild(script);
            
            if (func)
                func();
        })
        .catch(err => {
            console.error("Script loading failed:", err);
            if (forceLoaded && func)
                func();
        });
}

class scripts
{
    //ls is a string list of scripts paths
    //importScripts allias returning a Promise and so with async await compatibili
    static import(ls, cb=null)
    {
        if (typeof(ls) != "object")
            ls = [ls];
        return new Promise((resolve) => 
            {
                let _resolve = resolve;
                if (cb)
                {
                    _resolve = () => 
                    {
                        cb();
                        resolve();
                    };
                }
                importScripts(ls, _resolve);
            }) 
    }
}

function logImportedScripts()
{
    console.log("----");
    for (const o of window._imported_scripts)
        console.log(o.script.src);
    console.log("----");
}

HTMLElement.prototype.newButton = function (text, func=null, classList = [], id="", prepend=false) 
{
    let b = null;
    if (prepend)
        b = this.prependNode("button", classList, id);
    else 
        b = this.newNode("button", classList, id); 
    if (typeof(text) == "object")
    {
        if (text instanceof Array)
        {
            for (const elmt of text)
                b.appendChild(elmt);
        }
        else 
            b.appendChild(text);
    }
    else 
        b.innerHTML = text; 
    
    if (func)
    {
        const f = (ev) => func(b, ev);
        b.addEventListener("click", f);
    }

    return b;
} 

HTMLElement.prototype.newToggleButton = function (text, func=null, classList=[], id="")
{
    const button = this.newButton(text, func, classList, id);
    button.classList.add("toggle");
    button.addEventListener("click", () => 
        {
            if (button.classList.contains("active"))
                button.classList.remove("active")
            else 
                button.classList.add("active");
        })
    button.active = function ()
    {
        return this.classList.contains("active");
    }

    return button;
}

HTMLElement.prototype.newImg = function(src, alt="", title="", hide = false)
{
    let img = this.newNode("img"); 
    if (hide)
        img.hide();
    img.src = src; 
    img.alt = alt

    if (title == "")
        img.title = alt; 
    else 
        img.title = title; 

    return img;
}

function uniqueId()
{
    let id = Math.floor(Math.random() * 100000000);
    return id;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// return a list as [r, g, b]
// 
// min and max as float btw 0 and 1.
// if float value are float btw 0 and 1.
// else value are int btw 0 and 255.
function randomRGB(min=0, max=1, float=false)
{
    let r = randomFloat(min, max);
    let g = randomFloat(min, max);
    let b = randomFloat(min, max);
    let color = [r,g,b];

    if (float)
    {
        return color;
    }

    for (let i=0; i<color.length; i++)
    {
        color[i] = color[i]*255.0;
        color[i] = round(color[i]);
    }

    return color;
}

//where rgb is a list as [r, g, b]
// a is alpha as a float btw 0 and 1
function rgbAsStyle(rgb, a=1)
{
    if (a == 1)
        return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    else
        return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
}

// the callback function can have one argument : the obtained ip as str.
function ip(callback)
{
    if (window.IP)
    {
        if (callback)
            callback(window.IP);
        return window.IP;
    }
    importScripts([
    mkJs(FM + "/js/HttpRequest.js")], () => 
        {
            const xhr = HttpRequest();
            const url = FM + "/php/ip.php?func=getIp";
            xhr.sendAsPost(url, null, (xhr) => {
                window.IP = xhr.response;
                if (callback)
                    callback(xhr.response);
            });
        })
    return "waiting";
}

function getLocalStorage(key)
{
    if (typeof(localStorage[key]) == "undefined")
        return "";

    else if (localStorage[key] == undefined)
        return ""; 

    return localStorage[key];
}

function email()
{
    let email; 
    email = getUrlParameter("email");
    if (email)
    {
        localStorage["email"] = email;
        return email.toLowerCase();
    }

    email = getLocalStorage("email");
    if (email)
        return email.toLowerCase(); 
    return "";
}

function prenom()
{
    let prenom; 
    prenom = getUrlParameter("prenom");
    if (prenom)
    {
        localStorage["prenom"] = prenom;
        return prenom;
    }

    prenom = getLocalStorage("prenom");
    if (prenom)
        return prenom; 
    return "";
}

function isFullScreen()
{
    if (D.fullscreenElement)
    {
        return true;
    }

    if (D.webkitIsFullscreen || //Webkit browsers
        D.mozFullScreen || // Firefox
        D.msFullscreenElement !== undefined)
        return true; 

    return false;
}

function exitFullScreen()
{
    if (D.exitFullscreen) {
        D.exitFullscreen();
    } else if (D.webkitExitFullscreen) {
        D.webkitExitFullscreen();
    } else if (D.mozCancelFullScreen) {
        D.mozCancelFullScreen();
    } else if (D.msExitFullscreen) {
        D.msExitFullscreen();
    }
}


// tag can be h1, h2, h3, etc...
HTMLElement.prototype.newTitle = function (tag="h1", html="", classList = [], id="")
{
    let node = this.newNode(tag, classList, id);
    node.innerHTML = html;
    return node; 
}

function txtToSpan(txt, classList=[], id="")
{
    let bef = "<span";
    if (typeof(classList) == "string" )
        bef += ` class="` + classList + `"`
    else if (classList.length>0)
    {
        bef += ` class="`; 
        for (let cls of classList)
        {
            bef += cls + " ";
        }

        bef += `"`;
    }

    if (id)
    {
        bef += ` id="` + id + `"`
    }

    bef += ">"; 
    let after = "</span>"; 
    return bef + txt + after;
}

// return true if you can see the element on your screen.
HTMLElement.prototype.onScreen = function()
{
    let clientRects = this.getClientRects(); 
    if (clientRects.length == 0)
        return false;

    let y = clientRects[0].y; 
    let screenHeight = innerHeight; 

    if (y-screenHeight<=0 && clientRects[0].bottom>0)
        return true;

    else 
        return false;
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

HTMLElement.prototype.childrenByClassName = function (cls)
{
    let _r = []; 
    for (let c of this.children)
    {
        if (c.className == cls)
            _r.push(c);
    }

    return _r;
}

HTMLElement.prototype.deepChildren = function()
{
    let _r = []
    for (let c of this.children)
    {
        _r.push(c);
        if ("deepChildren" in c)
            _r = _r.concat(c.deepChildren());
    }

    return _r;
}

Node.prototype.deepChildNodes = function()
{
    let _r = []
    for (let c of this.childNodes)
    {
        _r.push(c);
        if ("deepChildNodes" in c)
            _r = _r.concat(c.deepChildNodes());
    }

    return _r;
}

HTMLElement.prototype.replace = function (newNode, returnOld = false)
{
    const old = this.parentNode.replaceChild(newNode, this);
    if (returnOld)
        return old;
    return newNode;
}

HTMLElement.prototype.setAncher = function (id, pBehavior="smooth")
{
    if (typeof(this.scrollIntoView) == "undefined")
    {
        let link = D.createElement("a"); 
        link.href = "#" + id;
        this.replace(link);
        link.append(this);
    }
    else
    {
        this.addEventListener("click", function () 
            {
                D.getElementById(id).scrollIntoView({behavior : pBehavior})
            })
    }
}

function download(filename, text)
{
    let a = B.newA(); 
    a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text)); 
    a.setAttribute("download", filename); 
    a.click()
    a.remove();
}

function downloadFile(path, filename)
{
    let a = B.newA(); 
    a.setAttribute("href", path); 
    a.download = filename;
    a.setAttribute("download", filename); 
    a.click()
    a.remove();
}

// return float number with the "," convert to an "."
HTMLInputElement.prototype.valueAsEnglish = function () 
{
    return this.value.replace(",", ".");
}

Number.prototype.ToString = function (language = "en")
{
    if (language == "en") 
        return this.toString().replace(",", ".");
    else if (language == "fr")
        return this.toString().replace(".", ",");
}

HTMLElement.prototype.hide = function(soft=false)
{
    if (soft)
    {
        this.style.opacity = 0;
        this.oldCursor = this.style.cursor; 
        this.style.cursor = "default";
    }
    else 
        this.style.display = "none";
}

HTMLElement.prototype.show = function(opacity=true, css="")
{
    this.style.display = css;
    if (this.style.opacity && opacity)
        this.style.opacity = 1;
    if (this.oldCursor)
        this.style.cursor = this.oldCursor;
}
HTMLElement.prototype.toggle = function()
{
    if (this.isVisible())
        this.hide();
    else 
        this.show();
}

HTMLElement.prototype.isVisible = function()
{
    if (this.style.display == "none" || !this.parentNode)
        return false; 
    if (getComputedStyle(this).transform.includes("matrix(0, 0, 0, 0, 0, 0)"))
        return false;

    return !this.hidden;
}

//create a child div with 2 button "Annuler" & "Valider";
//f1 is executed when Valider is clicked
//f2 is executed when Annuler is clicked
//return the parent div containing the two buttons
HTMLElement.prototype.cvButtons = function(f1 = null, f2 = null)
{
    this.dialogButtons = this.newNode("div", "buttons"); 
    this.dialogButtons.newButton("Annuler", f2, "cancel");
    this.dialogButtons.newButton("Valider", f1, "valid");

    this.buttons = () =>
    {
        return [this.dialogButtons.children[0], this.dialogButtons.children[1]];
    }

    this.setValidFunc = (f) =>
    {
        this.dialogButtons.children[1].onclick = f;
    }

    this.setCancelFunc = (f) =>
    {
        this.dialogButtons.children[0].onclick = f;
    }

    return this.dialogButtons;
}

String.prototype.idFromVideo = function () 
{
    let s = this.toString();
    if (s.includes("youtube") || 
        s.includes("youtu.be"))
    {
        if (s.includes("watch?v=")) 
        {
            s = s.split("watch?v=");
        }

        else 
        {
            s = s.split("/"); 
        }

        s = s[s.length - 1];
    }

    else if (s.includes("vimeo.com/"))
    {
        s = s.split("/"); 
        s = s[s.length - 1];
    }

    return s;
}

HTMLElement.prototype.isToBottom = function ()
{
    return this.scrollHeight - this.scrollTop === this.clientHeight
}

screenIsToBottom = function () 
{
    return scrollY + innerHeight >= B.scrollHeight;
}

HTMLElement.prototype.screenPos = function () 
{
    res = []; 

    res[0] = this.getBoundingClientRect().left;
    res[1] = this.getBoundingClientRect().top;

    return res;
}

HTMLElement.prototype.globalPos = function () 
{
    let res = this.screenPos();
    res[0] += scrollX; 
    res[1] += scrollY;

    let p = this; 
    while (p!=B)
    {
        p = p.parentNode;
        res[0] += p.scrollLeft; 
        res[1] += p.scrollTop;
    }

    return res;
}

setActive = function (bool)
{
    this.active = bool; 
    if (bool)
        this.style.fontWeight = "bold";
    else 
        this.style.fontWeight = "normal";
}

function setVideosResponsive(className="videos", ratio = 0.5625, useBody=false)
{
    let func = () =>
    {
        let p = D.getElementsByClassName(className)[0].parentNode;
        if (!p || useBody)
            p = B;

        let screenW = p.w();
        let w = 0;
        if (isPhone())
        {
            w = 0.95 * screenW;
        }

        else if (screenW<1250)
        {
            w = 0.75 * screenW;
        }

        else
        {
            w = 0.5 * screenW;
        }
        let h = 0; 

        h = w * ratio;

        for (let v of D.getElementsByClassName(className))
        {
            v.width = w; 
            v.height = h;
        }
    }

    addEventListener("load", func);
    addEventListener("resize", func);
    func();
}

function c_navigator()
{
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1 - 79
    var isChrome = window.chrome;

    // Edge (based on chromium) detection
    var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;

    if (isOpera)
        return "opera";
    else if (isFirefox)
        return "firefox";
    else if (isSafari)
        return "safari";
    else if (isIE)
        return "ie";
    else if (isEdge)
        return "edge";
    else if (isChrome)
        return "chrome";
    else if (isEdgeChromium)
        return "chromium"; 
    else if (isBlink)
        return "blink";
    return "unknown";
}

if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';

        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp');
        } 
        if (start === undefined) { start = 0; }
        return this.indexOf(search, start) !== -1;
    };
}

// options could a be a list like  ["html", "value"]
HTMLSelectElement.prototype.addOption = function (options)
{
    op = this.newNode("option"); 
    if (typeof(options) == "object")
    {
        op.value = options[1]; 
        op.innerText = options[0]; 
    }
    else 
        op.value = op.innerText = options;
}

// options could a be a list of list like  ["html", "value"]
HTMLSelectElement.prototype.addOptions = function (options)
{
    for (const o of options)
        this.addOption(o);
}

HTMLSelectElement.prototype.setOptions = function (options)
{
    this.innerHTML = "";
    this.addOptions(options);
}

HTMLSelectElement.prototype.clearOptions = function ()
{
    this.innerHTML = "";
}

// return the path from motion-live.com starting with a '/'
function localPathToGlobal(path)
{
    let loc = location.href.split("?")[0]; 
    loc = loc.split("#")[0];

    loc = loc.split("/");
    loc.remove(loc.last()); 
    loc = loc.join("/");

    path = loc + "/" + path;
    path = path.replace("http://", "");
    path = path.replace("http:/", "");
    path = path.replace("https://", "");
    path = path.replace("https:/", "");

    path = path.replace("file:///var/www/html/no-upload/mlt-tools", "");

    if (location.href.includes("teach.motion-live.com"))
    {
        path = path.replace("teach.motion-live.com", "motion-live.com/site-teach");
    }

    else if (location.href.includes("pictures.motion-live.com"))
    {
        path = path.replace("pictures.motion-live.com", "motion-live.com/site-pictures");
    }

    else if (location.href.includes("localhost/motion-live") )
    {
        path = path.replace("localhost/motion-live", "motion-live.com");
    }

    path = path.replace(/\/\//g, "/");
    return path.replace("motion-live.com", "");
}

Element.prototype.w = function ()
{
    return this.getBoundingClientRect().width; 
}
Element.prototype.width = Element.prototype.w;

Element.prototype.h = function ()
{
    return this.getBoundingClientRect().height; 
}
Element.prototype.height = Element.prototype.h;

Element.prototype.childrenHeight = function()
{
    let totalHeight = 0;

    // Loop over all children
    for (const child of this.children) 
    {
        // Get computed style for the current child
        const style = window.getComputedStyle(child);

        // Extract numeric values of margins (default to 0 if not found)
        const marginTop = parseFloat(style.marginTop) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;

        // offsetHeight includes padding + borders, but not margins
        const childHeight = child.offsetHeight;

        // Sum up the child’s height and margins
        totalHeight += (childHeight + marginTop + marginBottom);
    }

    return totalHeight;
}

Element.prototype.x = function (includeScroll=true)
{
    let _r = this.getBoundingClientRect().x; 
    if (!includeScroll)
        _r += scrollX;
    return _r;
}
Element.prototype.left = Element.prototype.x;
Element.prototype.getx = Element.prototype.x;

Element.prototype.y = function (includeScroll=true)
{
    let _r = this.getBoundingClientRect().y; 
    if (!includeScroll)
        _r += scrollY;
    return _r;
}
Element.prototype.top = Element.prototype.y;
Element.prototype.gety = Element.prototype.y;

Element.prototype.bottom = function ()
{
    return this.top() + this.h();
}

Element.prototype.right = function()
{
    return this.x() + this.w();
}

// the node must be the parent of this
Element.prototype.center = function (node= null)
{
    if (!node)
        node = this.parentNode;
    this.style.marginLeft = (node.w()/2 - this.w()/2) + "px";
    this.style.marginTop = (node.h()/2 - this.h()/2) + "px"; 
}

// the node muste be juste after this
HTMLElement.prototype.centerAbsolute = function (node)
{
    this.center(node);
    this.style.position = "fixed";
    this.style.left = node.x() + "px";
    this.style.top = node.y() + "px";

    if (!this.hadCenterEvents)
    {
        node.addEventListener("load", () => this.centerAbsolute());
        addEventListener("scroll", () => this.centerAbsolute(node));
        addEventListener("resize", () => this.centerAbsolute(node));
        addEventListener("load", () => this.centerAbsolute(node));
    }
    this.hadCenterEvents = true;
}

HTMLImageElement.prototype.reload = function (src=null)
{
    if (!src) 
        src = this.src

    this.src = src;
}

function domain()
{
    let path = location.href;
    path = path.replace("http://", "");
    path = path.replace("https://", "");
    return path.split("/")[0];
}

HTMLDocument.prototype.createImg = function(src, cls="", id="", alt="")
{
    let img = this.createElement("img"); 
    img.src = src; 
    if (cls)
        img.classList.add(cls); 
    img.id = id; 
    img.alt = alt; 
    img.title = alt;
    return img;
}

HTMLElement.prototype.moveUp = function ()
{
    let index = -1; 
    for (let c of this.parentElement.children)
    {
        index ++; 
        if (c == this)
            break;
    }

    let parent = this.parentElement;
    this.remove();
    parent.insertBefore(this, parent.children[index-1])
}

HTMLElement.prototype.moveDwn = function ()
{
    let index = -1; 
    for (let c of this.parentElement.children)
    {
        index ++; 
        if (c == this)
            break;
    }

    let parent = this.parentElement;
    this.remove();
    parent.insertBefore(this, parent.children[index+1])
}

HTMLElement.prototype.moveToIndex = function (index)
{
    let parent = this.parentElement;
    this.remove();
    if (index>=parent.children.length)
    {
        parent.appendChild(this);
        return;
    }
    parent.insertBefore(this, parent.children[index])
}

HTMLElement.prototype.moveDown = function (){this.moveDwn();}

HTMLElement.prototype.moveToTop = function ()
{
    const parent = this.parentElement; 
    this.remove(); 
    parent.insertBefore(this, parent.children[0]);
}
HTMLElement.prototype.moveToBegining = function (){this.moveToTop();}

HTMLElement.prototype.moveToEnd = function ()
{
    const parent = this.parentElement; 
    this.remove(); 
    parent.appendChild(this);
}

HTMLElement.prototype.move = function (target)
{
    this.remove(); 
    target.appendChild(this);
}

HTMLElement.prototype.swap = function (child1, child2)
{
    let index1 = Array.prototype.indexOf.call(this.children, child1);
    let index2 = Array.prototype.indexOf.call(this.children, child2);
    this.insertBefore(child2, this.children[index1]);
    this.insertBefore(child1, this.children[index2]);
}

HTMLElement.prototype.nodeBefore = function ()
{
    if (this == B)
        return null;

    for (let i=0; i<this.parentNode.children.length; i++)
    {
        if (this.parentNode.children[i] == this && i>0) 
            return this.parentNode.children[i-1];

        if (this.parentNode.children[i] == this && i==0) 
            return null;
    }
    return null;
}

HTMLElement.prototype.nodeAfter = function ()
{
    if (this == B)
        return null;
    else if (!this.parentNode)
        return null;

    for (let i=0; i<this.parentNode.children.length; i++)
    {
        if (this.parentNode.children[i] == this && i<this.parentNode.children.length - 1) 
            return this.parentNode.children[i+1];
    }
    return null;
}

HTMLElement.prototype.separator = function()
{
    return this.newNode("div", "separator");
}

HTMLElement.prototype.vseparator = function()
{
    return this.newNode("div", ["separator", "vertical"]);
}

HTMLElement.prototype.set = function(elmt)
{
    if (!elmt)
        return;
    if (typeof(elmt) == "object")
    {
        this.innerHTML = "";
        this.appendChild(elmt);
    }
    else 
        this.innerHTML = elmt;
}

HTMLElement.prototype.append = function(elmt)
{
    if (!elmt)
        return;
    if (typeof(elmt) == "object")
        this.appendChild(elmt);
    else 
    {
        const dum = this.newNode("span");
        dum.innerHTML = elmt;
        this.appendChild(dum);
    }
}

Document.prototype.listFromClassName = function (cls)
{
    let _r = [];
    const elmts = this.getElementsByClassName(cls) ;
    for (const el of elmts)
        _r.push(el);

    return _r;
}

Document.prototype.listFromTagName = function (name)
{
    let _r = [];
    const elmts = this.getElementsByTagName(name) ;
    for (const el of elmts)
        _r.push(el);

    return _r;
}

HTMLElement.prototype.clear = function()
{
   this.innerHTML = "";
}


HTMLElement.prototype.newSVG = function(w, h, data, color="")
{
    const svg = D.createElement("svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width" , w);
    svg.setAttribute("height" , h);
    svg.setAttribute("viewBox", "0 0 " + w + " " + h) ;
    svg.path = svg.newNode("path");
    svg.path.setAttribute("d", data);
    if (color)
        svg.path.setAttribute("fill", color);

    this.appendChild(svg);

    return svg;
}

HTMLCollection.prototype.last = function ()
{
    return this.item(this.length-1);
}

HTMLCollection.prototype.includes = function (val)
{
    for (let i = 0; i<this.length; i++)
    {
        if (this.item(i) == val)
            return true;
    }
    return false;
}

HTMLElement.prototype.isEditable = function ()
{
    if (this.tagName == "INPUT" ||
        this.contentEditable == "true" || this.tagName == "TEXTAREA")
        return true; 
    return false;
}

HTMLSelectElement.prototype.addOnSet = function (func)
{
    this.addEventListener("change", func);
    this.addEventListener("keydown", (e) =>
        {
            if (e.key == "Enter")
            {
                e.stopPropagation();
                func();
            }
        });
}

HTMLInputElement.prototype.link = function (input, both=true, asDate = false)
{
    const elmt1 = this;
    const elmt2 = input;
    const f = () =>  
    {
        if (!asDate)
            elmt2.value = elmt1.value;
        else 
            elmt2.valueAsDate = elmt1.valueAsDate;
    }

    const f2 = () =>  
    {
        if (!asDate)
            elmt1.value = elmt2.value;
        else 
            elmt1.valueAsDate = elmt2.valueAsDate;
    }

    input.addEventListener("input", f2);
    input.addEventListener("change", f2);
    if (both)
    {
        this.addEventListener("input", f);
        this.addEventListener("change", f);
    }
}

//it actually return the date that is printed in the input... 
//not like the valueAsDate method wich return the UTC value of it.
HTMLInputElement.prototype.asDate = function ()
{
    let v = this.value; 
    let tmp = v.split(":");

    d = new Date(0);
    d.setHours(tmp[0]);
    d.setMinutes(tmp[1]);
    if (tmp.length>2)
        d.setSeconds(tmp[2]);

    return d;
}

function html2clipboard(html)
{
    const item = new ClipboardItem({
        "text/html" : new Blob ([html], {type : 'text/html'})
    });
    const p = navigator.clipboard.write([item]);
    return p;
}

function selectedText()
{
    return window.getSelection().toString();
}

function selectedHTML() {
    let html = "";
    if (typeof window.getSelection != "undefined") {
        let sel = window.getSelection();
        if (sel.rangeCount) {
            let container = document.createElement("div");
            for (let i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

HTMLElement.prototype.replaceTxt = function(search, replace)
{
    this.innerHTML = this.innerHTML.replaceAll(search, replace);
}

HTMLElement.prototype.contains = function(elmt)
{
    for (const c of this.deepChildren())
    {
        if (c == elmt)
            return true;
    }
    return false;
}

HTMLElement.prototype.reccursiveParents = function()
{
    let elmt = this;
    let parents = [];
    while (elmt.parentNode)
    {
        parents.push(elmt.parentNode);
        elmt = elmt.parentNode;
    }
    return parents;
}

function testlog(data)
{
    if (location.href.includes('://localhost/'))
        console.log(data);
}

//execute f when condition is true... 
//this condition need to be a function
//if not it wait util it's true to execute it'
function doWhenItsTrue(condition, f)
{
    if (typeof(condition) == "function")
    {
        if (condition())
        {
            f()
            return;
        }

        const f2 = () => 
        {
            if (condition())
            {
                f();
                return;
            }
            setTimeout(f2, 16);
        }

        setTimeout(f2, 16);
    }
    else 
    {
        throw "condition need to be a function";
        return;
    }
}

window.execWhenItsDoned = doWhenItsTrue;

HTMLElement.prototype.setClickable = function ()
{
    this.addEventListener("click", () => this.requestFullscreen());
    this.classList.add("clickable");
}

// exec a function if the event havebeen fired and after the time passed only if the event has not been fired again. 
// Else the timer reset to time and the function executed after then
// useful for search on input but limiting the requests
HTMLElement.prototype.execAfterEvent = function (eventType, func, time)
{
    const f = () => 
    {
        if (this.execTimeout)
            clearTimeout(this.execTimeout);
        if (!this.canExecEvent)
        {
            this.execTimeout = setTimeout(() => 
                {
                    this.canExecEvent = true;
                    f();
                }, time);
            return;
        }

        func();
        this.canExecEvent = false;
    }

    this.addEventListener(eventType, f);
}

function html2text(html)
{
    const dom = D.createElement("div");
    dom.innerHTML = html;
    return dom.innerText;
}

self.htmltotext = html2text;

//return correct type value from a string 
function value(val)
{
    if (val.toLowerCase() == "true")
        return true;
    if (val.toLowerCase() == "false")
        return false;

    for (const l of letters)
    {
        if (val.toLowerCase().includes(l))
            return val;
    }

    let _r = parseFloat(val);
    if (!isNaN(_r))
        return _r;

    return val;
}

//onFound take the elemt found as arg or null if none found
//after timeout (en seconds) is reached, the element won't be searched again if not found yet.
HTMLElement.prototype.find = function(selector, onFounded, timeout=10)
{
    const d = this.querySelector(selector);
    if (d)
    {
        onFounded(d);
        return;
    }

    let time = 0;
    const interval = setInterval(() => 
    {
        const d = this.querySelector(selector);
        if (d)
        {
            onFounded(d);
            clearInterval(interval);
            return;
        }
        time += 16;
        if (time >= 10000)
            clearInterval(interval);

    }, 16);
}

//return true if in localhost
function local()
{
    return (location.href.includes("http://localhost") || 
        location.href.includes("https://localhost"))
}

HTMLElement.prototype.place = function(x, y)
{
    this.style.transform = "translate(" + x + "px, " + y + "px)";
    this.style.margin = "0px";
    this.style.position = "fixed";
    this.style.left = "0px";
    this.style.right = "0px";
}

Number.prototype.withSpaces = function()
{
    let s = this.toString();
    let parts = s.split(".");
    parts[0] = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

HTMLElement.prototype.formatNumbersWithSpaces = function()
{
    const text = this.innerHTML;
    if (text.includes("_") || text.includes("-") || text.includes("/"))
        return;
    let n = parseFloat(text);
    if (isNaN(n))
        return;
    this.innerHTML = n.withSpaces();
}

//return a copy of this element but with a different tag (arg)
HTMLElement.prototype.transformed = function(tag)
{
    const newElement = document.createElement(tag);
    // Copy attributes from the old element to the new element
    Array.from(this.attributes).forEach(attr => {
        newElement.setAttribute(attr.name, attr.value);
    });

    // Move all children from the old element to the new element
    while (this.firstChild) {
        newElement.appendChild(this.firstChild);
    }

    return newElement;
}

HTMLElement.prototype.transform = function(tag)
{
    const nel = this.transformed(tag);
    this.parentNode.replaceChild(nel, this);
}

// source2 is prioritary incase of conflict in keys !
JSON.merged = function(source1, source2){
    /*
     * Properties from the Souce1 object will be copied to Source2 Object.
     * Note: This method will return a new merged object, Source1 and Source2 original values will not be replaced.
     * */
    let mergedJSON = structuredClone(source2);// Copying Source2 to a new Object
    for (const attrname in source1)
    {
        if (typeof(source1[attrname]) == "function")
            continue;
        if(mergedJSON.hasOwnProperty(attrname))
        {
            if (typeof(mergedJSON[attrname]) == "function")
                continue;
            if (source1[attrname]!=null)
            {
                if(source1[attrname].constructor==Object || source1[attrname].constructor==Array)
                    mergedJSON[attrname] = JSON.merged(source1[attrname], mergedJSON[attrname]);
            }
        }
        else 
            mergedJSON[attrname] = source1[attrname];
    }

    return mergedJSON;
}

HTMLVideoElement.prototype.fps = function ()
{
    const fps = this.getVideoPlaybackQuality().totalVideoFrames /
                (this.currentTime || 1);
    return fps;
}

function randomUTF8Char()
{
    // Common printable ranges
    const ranges = [
        [0x0020, 0x007E],  // Basic Latin
        [0x00A0, 0x00FF],  // Latin-1 Supplement
        [0x0100, 0x017F],  // Latin Extended-A
        [0x0370, 0x03FF],  // Greek
        [0x0400, 0x04FF],  // Cyrillic
        [0x4E00, 0x9FFF],  // CJK Unified Ideographs
    ];
    
    const range = ranges[Math.floor(Math.random() * ranges.length)];
    const codePoint = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    return String.fromCodePoint(codePoint);
}
