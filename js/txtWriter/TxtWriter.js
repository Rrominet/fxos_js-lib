const TXT_WRITER_COMPLETE_VERSION = 0;
const TXT_WRITER_SMALL_VERSION = 1;
const TXT_WRITER_WEB_VERSION = 2;

const TXT_WRITER_AJAX_PATH = FM + "/php/txtWriterAjax.php";

//this.end = index of the char after the end of the selection

class Selection
{
    constructor()
    {

    }

    set(windowSelection)
    {
        this.start = windowSelection.anchorOffset;
        this.end = windowSelection.focusOffset; // index is exclude of the selection
        this.range = windowSelection.getRangeAt(0).cloneRange();
        this.currentNode = this.range.commonAncestorContainer;
        this.startNode = this.range.startContainer;
        this.endNode = this.range.endContainer;
        while (getType(this.currentNode) == "Text")
            this.currentNode = this.currentNode.parentElement;

        // invert because it depands of the selection sense... 

        if (this.start > this.end)
        {
            //invert the values btw start and end
            let tmp = this.end; 
            this.end = this.start; 
            this.start = tmp;

            let tmp2 = this.endNode;
            this.endNode = this.startNode;
            this.startNode = this.endNode;
        }

        this.length = this.end-this.start;
        if (this.length <0)
            this.length = Math.abs(this.length);
    }

    setFromRange(range = null)
    {
        if (!range)
            range = this.range.cloneRange();

        this.start = range.startOffset;
        this.end = range.endOffset; 
        this.length = this.end - this.start;
        this.startNode = range.startContainer;
        this.endNode = range.endContainer;
    }
}

class TxtWriter
{
    static get FM() 
    {
        if (typeof(FML) == "undefined")
        {
            if (!location.href.includes("file:///"))
                return FM;
            else 
                return "frameworks";
        }
        else 
            return FML;
    }

    static get PATH()
    {
        return TxtWriter.FM + "/js/txtWriter";
    }

    static get IMGS()
    {
        return TxtWriter.PATH + "/images";
    }

    static load(onLoaded)
    {
        const HttpRequest = mkJs(TxtWriter.FM + "/js/HttpRequest.js");
        const fonts = mkJs(TxtWriter.FM + "/js/txtWriter/fonts.js");
        const Html = mkJs(TxtWriter.FM + "/js/html_utils.js");
        const ProgressBar = mkJs(TxtWriter.FM + "/js/ProgressBar.js");
        const Mouse = mkJs(TxtWriter.FM + "/js/mouse.js");
        const Window = mkJs(TxtWriter.FM + "/js/windows-manager/Window.js") ;
        const MessageWindow = mkJs(TxtWriter.FM + "/js/windows-manager/MessageWindow.js") ;
        const WindowsManager = mkJs(TxtWriter.FM + "/js/windows-manager/WindowsManager.js");

        let scripts = [
            HttpRequest,
            fonts,
            Html,
            ProgressBar,
            Mouse,
            Window, 
            MessageWindow, 
            mkJs(TxtWriter.FM + "/js/icons.js"),
            WindowsManager,
        ];

        importScripts(scripts, onLoaded);
        newCss(TxtWriter.FM + "/css/TxtWriter.css");
        newCss(TxtWriter.FM + "/css/windows-manager.css");
    }

    static get RIGHT(){return 1;}
    static get LEFT(){return 1;}

    constructor(parent = B, version = TXT_WRITER_COMPLETE_VERSION, inter=true)
    {
        this.version = version;
        this.parent = parent;
        if (inter)
        {
            this.interface();
            this.codeArea();
            this.selection = new Selection();
            this.setEvents();
            this.progress = null;
        }
        this.uploading = false;

        // for this to work, you must define this.canComment = true;
        this.comments = [];
        this.commentsVisible = true;
        this.commentIndex = 0;
        this.side = TxtWriter.RIGHT;
        this.ctx = null;
        this.onUploadDoned = [];
    }

    static createfromElement(elmt, version = TXT_WRITER_WEB_VERSION)
    {
        const writer = new TxtWriter(elmt.parent, version, false);
        writer.interface(elmt);
        writer.codeArea();
        writer.selection = new Selection();
        writer.progress = null;
        writer.setHtml(elmt.innerHTML);
        writer.setStyleFromElmt();
        writer.setEvents();
        return writer;
    }

    //if elmt, the writer will replace it !
    interface(elmt = null)
    {
        if (elmt)
        {
            this.div = D.createElement("div");
            this.div.classList.add("txtWriter");
            this.div.classList.add("from-elmt");
            this.elmt = elmt; 
            this.div.elmt = elmt;
            this.saveStyleFromElmt()
            this.elmt = this.elmt.replace(this.div, true);
        }
        else 
            this.div = this.parent.newNode("div", "txtWriter"); 
        this.header();
        this.div.writer = this.div.newNode("div", "writer"); 
        this.div.writer.contentEditable = true;
        this.div.writer.innerText = "Votre texte...";
        this.wLink = null;
        this.imgLink = null; 
        this.imgParams = null; 
        if (window.WM)
            this.wm = window.WM;
        else 
            window.WM = this.wm = new WindowsManager;
    }

    remove()
    {
        if (this.elmt)
            this.div.replace(this.elmt, true);
        else 
            this.div.remove();
    }

    saveStyleFromElmt()
    {
        const style = getComputedStyle(this.elmt);
        const s = this.elmtOldStyle = {}; 
        s.padding = style.padding;
        s.margin = style.margin;
        s.height = style.height;
        s.width = style.width;
        s.displa = style.display;
        s.position = style.position;
        s.lineHeight = style.lineHeight;
        s.fontSize = style.fontSize;
        s.fontWeight = style.fontWeight;
        s.textAlign = style.textAlign;
    }

    setStyleFromElmt()
    {
        const style = this.elmtOldStyle;
        this.div.writer.style.padding = style.padding; 
        this.div.writer.style.width = style.width; 
        this.div.writer.style.display = style.display;
        this.div.writer.style.margin = style.margin;
        this.div.writer.style.lineHeight = style.lineHeight;
        this.div.writer.style.position = style.position;
        this.div.writer.style.fontSize = style.fontSize;
        this.div.writer.style.fontWeight = style.fontWeight;
        this.div.writer.style.textAlign = style.textAlign;
    }

    setHtml(html)
    {
        this.div.writer.innerHTML = html;
    }

    setHeight(h)
    {
        this.div.writer.style.height = h + "px";
        this.div.writer.style.minHeight = "0px"
    }

    codeArea()
    {
        this.div.code = this.div.newNode("textarea", "code");
        this.div.code.style.display = "none";
    }

    toggleCode()
    {
        if (this.div.code.style.display == "none")
            this.div.code.style.display = "block";
        else
            this.div.code.style.display = "none";

        if (this.div.code.style.display == "block")
            this.updateToCode();
    }

    addEvent(type, func)
    {
        this.div.writer.addEventListener(type, func);
    }

    setEvents()
    {
        this.setKeyEvents();

        this.div.writer.addEventListener("mouseup",() => 
            {
                this.updateSelection();
                this.unFocusComments();
            });
        this.div.writer.addEventListener("mouseup", this.updateImgEvents.bind(this));
        this.div.writer.addEventListener("focus", () =>
            {
                this.removeDefaultText();
                this.div.header.style.display = "flex";
            });
        this.div.writer.addEventListener("input", this.updateSelection.bind(this));
        this.div.writer.addEventListener("change", this.updateSelection.bind(this));

        this.div.writer.addEventListener("keyup", function (e) 
            {
                this.updateSelection();
            }.bind(this));

        this.div.writer.addEventListener("input", this.cleanAll.bind(this));
        this.div.writer.addEventListener("input", function () {this.updateToCode();}.bind(this));
        this.div.code.addEventListener("input", this.updateFromCode.bind(this));
        this.div.writer.addEventListener("focusout", () => 
            {
                if (this.ctx && this.ctx.menu.isVisible())
                    return;
                //this.div.header.style.display = "none";
                let html = this.createAutoLinks(this.div.writer.innerHTML);
                if (html.substring(html.length-6) != "&nbsp;")
                    html += "&nbsp;";
                this.setHtml(html);
                this.removeCommentsThatDoesNotExistsAnymore();
                this.updateToCode();
            });

        this.div.writer.addEventListener("paste", () => 
            {
                setTimeout(()=> this.cleanImages(), 16);
            });

        this.div.writer.addEventListener("drop", () => 
            {
                setTimeout(()=> this.cleanImages(), 16);
            });
    }

    async cleanImages()
    {
        await scripts.import(FM + "/js/imgs.js");
        const _imgs = this.div.writer.getElementsByTagName("img");
        for (const i of _imgs)
        {
            if (i.src.includes("data:image"))
                imgs.converted(i.src, "webp", 80, (url) => {
                    i.src = url;
                    this.uploadModifiedImage(i);
                });
        }
    }

    uploadModifiedImage(img)
    {
        img.classList.add("uploading");
    }

    setSelectionFromLast()
    {
        let r = this.rangeFromLastSelection();
        getSelection().removeAllRanges();
        getSelection().addRange(r);
        this.updateSelection();
    }

    rangeFromLastSelection()
    {
        let r = new Range;
        let snode = this.div.writer.getNodeFromSimilar(this.selection.startNode);
        if (!snode)
            snode = this.div.writer;
        let enode = this.div.writer.getNodeFromSimilar(this.selection.endNode);
        if (!enode)
            enode = this.div.writer;
        r.setStart(snode, this.selection.start);
        r.setEnd(enode, this.selection.end);

        return r;
    }

    header()
    {
        let h = this.div.header = this.div.newNode("div", "header"); 
        if (this.version == TXT_WRITER_COMPLETE_VERSION)
        {
            h.alignDiv = h.newNode("div", "align");
            h.alignDiv.left     = h.alignDiv.newButton("<img src='" + TxtWriter.IMGS + "/left.png' />", function ()
                {
                    this.addStyle([["text-align", "left"]]);
                    this.updateToCode();
                }.bind(this));
            h.alignDiv.center   = h.alignDiv.newButton("<img src='" + TxtWriter.IMGS + "/center.png' />", function ()
                {
                    this.addStyle([["text-align", "center"]]);
                    this.updateToCode();
                }.bind(this));
            h.alignDiv.right    = h.alignDiv.newButton("<img src='" + TxtWriter.IMGS + "/right.png' />", function ()
                {
                    this.addStyle([["text-align", "right"]]);
                    this.updateToCode();
                }.bind(this));
            h.alignDiv.justify  = h.alignDiv.newButton("<img src='" + TxtWriter.IMGS + "/justify.png' />", function ()
                {
                    this.addStyle([["text-align", "justify"]]);
                    this.updateToCode();
                }.bind(this));

            h.exports = h.newNode("div", "exports"); 
            h.exports.showCode = h.exports.newButton("<img src='" + TxtWriter.IMGS + "/code.png' />", this.toggleCode.bind(this), "code");
            h.exports.showCode.title = "Éditer le code HTML."
            h.exports.html = h.exports.newButton("<img src='" + TxtWriter.IMGS + "/html.png' />", this.codeToNewWin.bind(this));
            h.exports.html.title = "Exporter en html.";
        }

        else if (this.version == TXT_WRITER_SMALL_VERSION)
        {
            h.newButton(Icons.byName("picture"), () => this.addImage());
            h.newButton(Icons.byName("link-symbol"), () => this.addLink());
            h.newButton(Icons.byName("youtube-logo"), () => this.showYoutube());
            h.newButton(Icons.byName("vimeo-square-logo"), () => this.showVimeo());

            if (location.href.includes("H3D2") || location.href.includes("file:") || location.href.includes("01-h3d2") || location.href.includes("mlt-tools") || location.href.includes("mlt-teach"))
            {
                let fileIcon = Icons.byName("file"); 
                fileIcon.title = "Envoyer des fichiers (max 500 MB)";
                h.newButton(fileIcon, () => this.uploadFiles());
            }
        }

        else if (this.version == TXT_WRITER_WEB_VERSION)
            this.div.header.remove();

        this.div.progress = this.div.newNode("div", "progress");
    }

    updateSelection()
    {
        if (this.div.writer != D.activeElement)
            return;
        this.selection.set(window.getSelection());
    }

    setForme()
    {
        let val = this.div.header.forme.hs.getValue();
        if (val != "aucune")
            D.execCommand("formatBlock", false, val); 
        else
        {
            this.replaceFormat("span", [], true);
        }
    }

    removeStyle(node)
    {
        if (node != this.div.writer)
            node.removeAttribute("style"); 

        for (let c of node.children)
            this.removeStyle(c);
    }

    removeStyleFromSelection()
    {
        this.removeStyle(this.selection.currentNode);
    }

    removeAllBalises()
    {
        this.selection.currentNode.innerText = this.selection.currentNode.innerText;
        this.removeStyle(this.selection.currentNode);
        this.updateToCode();
    }

    removeBalises(node)
    {
        if (node == this.div.writer)
            return; 
        if (node.tagName == "IMG" ||
            node.tagName == "A")
        {
            this.removeStyle(node);
            return;
        }

        let textNode = D.createTextNode(node.innerText);
        node.replaceWith(textNode);

    }

    currentHtml()
    {
        return this.selection.currentNode.innerHTML;
    }

    setCurrentHtml(html)
    {
        this.selection.currentNode.innerHTML = html;
    }

    insert(html)
    {
        let node = D.createElement("span"); 
        node.innerHTML = html; 
        this.selection.range.insertNode(node); 
        this.updateToCode();
    }

    static replaceTxtInSelection(txt)
    {
        if (!D.activeElement)
            return;
        const sel = new Selection; 
        sel.set(window.getSelection());
        const node = D.createTextNode(txt);
        
        sel.range.deleteContents();
        sel.range.insertNode(node);
    }

    static moveCursor(val, elmt=D.activeElement)
    {
        if (!elmt)
            return;
        elmt.selectionStart = elmt.selectionEnd = elmt.selectionEnd + val;
    }

    insertNode(node, replace=true, range = null)
    {
        if (!range)
            range = this.selection.range;

        if (typeof(range) == "undefined")
        {
            this.div.writer.append(node); 
            this.updateToCode();
            return;
        }

        if (replace)
            range.deleteContents();
        range.insertNode(node);
        this.updateToCode();
    }

    insertTxt(txt)
    {

    }

    htmlInSelection()
    {
        let c = this.currentHtml();
        let _r = c.slice(this.selection.start, this.selection.end);
        return _r;
    }

    currentTxt()
    {
        let frag = null;
        if (!this.selection.range)
            return "";

        frag = this.selection.range.cloneContents() 
        let txt = ""; 
        for (let c of frag.childNodes)
        {
            if (getType(c) == "Text")
                txt += c.wholeText; 
            else 
                txt += c.innerText;
        }

        return txt;
    }

    clean(node)
    {
        for (let c of node.children)
        {
            if (c.getAttribute("style") == "")
                c.removeAttribute("style");

            if (c.innerHTML == "" && 
                c.tagName != "IMG" && 
                c.tagName != "BR" && 
                c.tagName != "INPUT" &&
                c.tagName != "IFRAME")
                c.remove();

            this.clean(c);
        }
    }

    clear()
    {
        this.div.writer.innerHTML = "";
        this.updateToCode();
    }

    cleanAll()
    {
        this.clean(this.div.writer);
        this.cleanStyle(this.div.writer);
    }

    cleanStyle(parent)
    {
        for (const c of parent.deepChildren())
        {
            c.style.fontFamily = "";
            c.style.fontSize = "";
            c.style.color = "";
            c.style.backgroundColor = "";
        }
    }

    // balise format : "div" not "<div>".
    // style as array of arrays [["css-property", "value"], [..., ...]]
    //     exemple : [["color", "red"]];
    format(balise, style = [])
    {
        let elmt = D.createElement(balise); 
        elmt.style = this.styleAsStr(style);

        this.selection.range.surroundContents(elmt);
        this.selection.currentNode = elmt;
        this.selection.range.selectNode(elmt);
        this.selection.setFromRange();
        this.updateToCode();
    }

    getAsHtml(balise, style = [])
    {
        let b = balise.replace("<", "");
        b = b.replace(">", "");
        b = b.replace("/", "");

        let In = "<" + b + ">";
        if (style.length>0)
        {
            In = In.replace(">", " style='" + this.styleAsStr(style) + "' >");
        }

        let out = "</" + b + ">";

        return [In, out];
    }

    styleAsStr(style=[])
    {
        let s = "";
        if (style.length>0)
        {
            for (let prop of style)
            {
                s += prop[0] + " : " + prop[1] + ";\n";
            }
        }
        return s;
    }

    replaceFormat(balise, style=[], force=false)
    {
        if (this.selection.currentNode == this.div.writer)
            this.format(balise, style);

        let c = this.currentHtml();

        let newNode = D.createElement(balise);
        newNode.innerHTML = c;

        this.selection.currentNode.replaceWith(newNode);
        let strStyle = this.styleAsStr(style);

        this.selection.currentNode.style = strStyle;
        this.updateToCode();
    }

    containPropStyle(style, prop)
    {
        for (let p of style)
        {
            if (p[0] == prop)
                return true;
        }

        return false;
    }

    // return if yes or no an entire node is selected. 
    // true : an entire node is selected 
    // false : juste a part of the node is selected
    isANodeSelected()
    {
        if (this.selection.currentNode == this.div.writer)
            return false;

        let frag = this.selection.range.cloneContents(); 

        let select = frag.textContent;
        let node = this.selection.currentNode.innerText;

        select = select.replace(/\n/g, "");
        select = select.replace(/\r/g, "");

        node = node.replace(/\n/g, "");
        node = node.replace(/\r/g, "");

        if (select == node)
            return true;
        else
            return false;

    }

    addStyle(style = [], reccursive=true)
    {
        if (!this.isANodeSelected())
        { 
            if (this.containPropStyle(style, "text-align"))
                this.format("div", style);
            else
                this.format("span", style);

            return;
        }

        for (let prop of style)
        {
            this.selection.currentNode.style.setProperty(prop[0], prop[1]);
        }

        if (reccursive)
        {
            for (let c of this.div.writer.children)
            {
                if (getSelection().containsNode(c, true))
                {
                    this.setRecStyleToChildren(c, style);
                }
            }
        }
        this.updateToCode();
    }	

    // style as [["prop-name", "value"]]
    setRecStyleToChildren(node, style)
    {
        this.setStyleToNode(node, style);
        for (let c of node.children)
        {
            this.setStyleToNode(c, style);
            this.setRecStyleToChildren(c, style);
        }
    }

    // style as [["prop-name", "value"]]
    setStyleToNode(node, style)
    {
        for (let prop of style)
        {
            if (node.style.getPropertyValue(prop[0]) != "")
            {
                node.style.setProperty(prop[0], prop[1]);
            }
        }
    }

    setFontSize(val = -1)
    {
        let style = []; 
        if (val == -1)
            style = [["font-size", this.div.header.font.size.getValue()]];
        else
        {
            try{val = val.toString();}catch(e){}; 
            try
            {
                if (!val.includes("px"))
                    val += "px";
            }
            catch(e){};

            style = [["font-size", val]];
        }

        this.addStyle(style);
    }

    showYoutube()
    {
        if (!this.ytWin)
        {
            const yt = D.createElement("div");
            yt.link = yt.newInput("text", "" , "yt"); 
            yt.link.placeholder = "Lien youtube"; 
            yt.link.title = "Lien youtube"; 

            this.ytWin = this.wm.message(yt, () => this.insertYoutube(this.rangeFromLastSelection()), "Ajouter une vidéo Youtube", true);
            this.ytWin.setSize(624, 162);
        }
        else 
            this.ytWin.show();
        this.ytWin.center();
    }

    showVimeo()
    {
        if (!this.vimeoWin)
        {
            const vimeo = D.createElement("div");
            vimeo.link = vimeo.newInput("text", "" , "vimeo"); 
            vimeo.link.placeholder = "Lien viméo"; 
            vimeo.link.title = "Lien viméo"; 

            this.vimeoWin = this.wm.message(vimeo, () => this.insertVimeo(this.rangeFromLastSelection()), "Ajouter une vidéo Viméo", true);
            this.vimeoWin.setSize(624, 162);
        }
        else 
            this.vimeoWin.show();
        this.vimeoWin.center();
    }

    insertYoutube(range)
    {
        let lk = this.ytWin.getContent().link.value;
        if (lk.includes(" ")     || 
            !lk.includes("http") || 
            !lk.includes("youtu"))
        {
            alert ("Erreur dans l'url fournie.");
            return;
        }

        let id = lk.idFromVideo();
        let iframe = D.createElement("iframe");
        iframe.classList.add("player");
        iframe.src ="https://www.youtube.com/embed/" + id;
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        this.insertNode(iframe, true, range);
        
        this.ytWin.hide();
        this.updateToCode();
    }

    insertVimeo(range)
    {
        let lk = this.vimeoWin.getContent().link.value;
        if (lk.includes(" ")     || 
            !lk.includes("http") || 
            !lk.includes("vimeo.com/"))
        {
            alert ("Erreur dans l'url fournie.");
            return;
        }

        let id = lk.idFromVideo();
        let iframe = D.createElement("iframe");
        iframe.classList.add("vimeo");
        iframe.classList.add("player");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        iframe.src = "https://player.vimeo.com/video/" + id;
        this.insertNode(iframe, true, range);
        this.vimeoWin.hide();
        this.updateToCode();
    }

    addLink()
    {
        if (!this.wLink)
        {
            const ct = D.createElement("div");
            ct.link = ct.newInput("text");
            ct.link.placeholder = "Adresse du lien";
            ct.link.title = "Adresse du lien";
            ct.txt = ct.newInput("text");
            ct.txt.placeholder = "Texte du lien";
            ct.txt.title = "Texte du lien";
            this.wLink = this.wm.message(ct, () => this.insertLink(this.rangeFromLastSelection()), "<img src='" + TxtWriter.FM + "/js/floatWindow/images/link.png' /> Ajouter un lien.", true);
            this.wLink.setSize(522, 240);
        }
        else 
            this.wLink.show();
        this.wLink.center();
        this.wLink.getContent().txt.value = this.currentTxt();
    }

    insertLink(range)
    {
        let link = D.createElement("a");
        const ct = this.wLink.getContent();
        link.href = ct.link.value; 
        let txt = ct.txt.value;
        if (txt == "")
            link.innerText = link;
        else
            link.innerText = txt; 
        this.insertNode(link, true, range);
    }

    addImage()
    {
        if (!this.imgLink)
        {
            const ct = D.createElement("div");
            ct.tabs = ct.newNode("div", "tabs"); 
            ct.tabs.localButton = ct.tabs.newButton("<img src='" + TxtWriter.FM + "/js/floatWindow/images/local.png' />", function () 
                {
                    ct.local.show();
                    ct.internet.hide();
                    if (ct.tabs.internetButton.classList.contains("active"))
                        ct.tabs.internetButton.classList.remove("active")
                    if (!ct.tabs.localButton.classList.contains("active"))
                        ct.tabs.localButton.classList.add("active");
                });
            ct.tabs.localButton.title = "Depuis l'ordinateur";
            ct.tabs.internetButton = ct.tabs.newButton("<img src='" + TxtWriter.FM + "/js/floatWindow/images/internet.png' />", function () 
                {
                    ct.internet.show();
                    ct.local.hide();
                    if (ct.tabs.localButton.classList.contains("active"))
                        ct.tabs.localButton.classList.remove("active")
                    if (!ct.tabs.internetButton.classList.contains("active"))
                        ct.tabs.internetButton.classList.add("active");
                });

            ct.tabs.internetButton.title = "Depuis internet";

            ct.local = ct.newNode("div");
            ct.local.file = ct.local.newInput("file");

            ct.internet = ct.newNode("div");
            ct.internet.file = ct.internet.newInput("text");
            ct.internet.file.placeholder = "Lien vers l'image";
            ct.internet.file.title = "Lien vers l'image";

            ct.local.hide();
            ct.internet.hide();

            ct.alt = ct.newInput("text");
            ct.alt.placeholder = "Attribut alt";
            ct.alt.title = "Attribut alt";
            if (this.version == TXT_WRITER_SMALL_VERSION)
                ct.alt.hide();

            ct.link = ct.newInput("text");
            ct.link.placeholder = "Lien sortant (seulement pour une image cliquable)";
            ct.link.title = "Lien sortant si l'image est aussi un lien. Sinon laisser vide.";

            this.imgLink = this.wm.message(ct, () => this.insertImg(this.rangeFromLastSelection()), "<img src='" + TxtWriter.FM + "/js/floatWindow/images/image.png' /> Ajouter une image", true);
            this.imgLink.setSize(600,342);
        }

        else 
            this.imgLink.show();
        this.imgLink.center();
    }

    onProgress(xhr, e)
    {
        let val = parseFloat(e.loaded*1.0 /e.total); 
        this.progress.setValue(val);

        this.manageError(xhr.status);
    }

    onLoaded(xhr, e)
    {
        this.progress.remove(); 
        this.progress = null;

        this.manageError(xhr.status);
    }

    onError(xhr)
    {
        testlog(xhr);
        if (xhr.status == 0)
            return;
        this.progress.remove(); 
        this.progress = null;
        this.uploading = false;
        this.manageError(xhr.status);
    }

    manageError(code)
    {
        if (code == 200 || code == 0)
            return;
        if (!this.wm)
        {
            if (window.WM)
                this.wm = window.WM
            else 
                this.wm = window.WM = new WindowsManager;
        }

        if (code == 413)
            this.wm.message("Erreur : le fichier envoyé est trop lourd (plus de 500Mo)<br>Tu peux passer par weTransfer ou Google Drive pour régler ce probème");
        else if (code != 200)
            this.wm.message("Erreur : le fichier n'a pas pu être téléchargé.<br>Code d'erreur : " + code);
    }

    insertImg(range)
    { 
        this.uploading = true;
        let src = "";
        let img = D.createElement("img"); 
        if (this.imgLink.getContent().tabs.localButton.classList.contains("active"))
        {
            img.src = URL.createObjectURL(this.imgLink.getContent().local.file.files[0]);
            let fd = new FormData; 
            fd.append("img", this.imgLink.getContent().local.file.files[0]); 
            fd.append("func", "uploadImg");

            let xhr = HttpRequest();
            xhr.addEventListener("error", () => this.onError(xhr));
            xhr.addEventListener("abort", () => this.onAbort(xhr));
            xhr.open('POST', TXT_WRITER_AJAX_PATH); 

            xhr.upload.onprogress = (e) => this.onProgress(xhr, e)
            xhr.upload.onload = (e) => this.onLoaded(xhr, e);


            xhr.onreadystatechange = () =>
            {
                if (xhr.readyState == 4 && xhr.status == 200)
                {
                    img.src = "https://motion-live.com/frameworks/saves/txtWriter/uploads/" + xhr.responseText;
                    this.uploading = false;
                }
                else if (xhr.status != 200)
                    this.onError(xhr);
            }

            xhr.send(fd);
            this.progress = new ProgressBar(this.div.progress);
        }
        else
        {
            src = this.imgLink.getContent().internet.file.value;
            img.src = src;
            this.uploading = false;
        }

        let alt = this.imgLink.getContent().alt.value;
        img.alt = alt; 
        if (this.version == TXT_WRITER_COMPLETE_VERSION)
            img.classList.add("edit");
        if (this.imgLink.getContent().link.value != "")
        {
            let a = D.createElement("a"); 
            a.href = this.imgLink.getContent().link.value; 
            a.append(img); 
            this.insertNode(a, true, range);
        }
        else
            this.insertNode(img, true, range);

        if (this.t && this.version == TXT_WRITER_COMPLETE_VERSION)
            img.ondblclick = function() {this.showImgParams(img)}.bind(this);
        this.imgLink.hide();
    }

    uploadFiles()
    {
        let f = this.form = D.createElement("form"); 
        f.action = ""; 
        f.method = "post"; 
        f.setAttribute("enctype", "multipart/form-data");
        f.files = f.newInput("file", "files[]");
        f.files.setAttribute("multiple", true);
        f.files.addEventListener("change", () => this.sendFiles()); 
        f.files.click();

        this.fileInput = f.files;
    }

    tchat()
    {
        if (this.div.parentNode && this.div.parentNode.classList.contains("msg"))
            return (this.div.parentNode.tchat());

        return null;
    }

    sendFiles()
    {
        this.uploading = true;
        let data = new FormData(this.form); 
        data.append("email", email());
        data.append("prenom", prenom());
        data.append("func", "uploadFiles");
        data.append("path", MLT + "/formations/01-h3d2/messages");

        let xhr = HttpRequest(); 
        xhr.upload.onprogress = (e) => this.onProgress(xhr, e);
        xhr.upload.onload = (e) => this.onLoaded(xhr, e);
        xhr.addEventListener("error", () => this.onError(xhr));
        xhr.addEventListener("abort", () => this.onError(xhr));

        xhr.addEventListener("readystatechange", () => 
        {
            if(xhr.status != 200 && xhr.readyState === 4 )
                this.onError(xhr);
        })
        xhr.addOnRequestDone((xhr) =>
            {	
                this.uploading = false;
                if (this.progress)
                {
                    this.progress.remove()
                    this.progress = null;
                }

                for (const f of this.onUploadDoned)
                    f(xhr);
            });

        xhr.open("POST", TXT_WRITER_AJAX_PATH);
        xhr.send(data);
        this.progress = new ProgressBar(this.div.progress);
    }

    // f take one argument the xhr used to send the data
    addOnUploadDoned(f)
    {
        this.onUploadDoned.push(f);
    }

    updateImgEvents()
    {
        for (let img of D.getElementsByClassName("edit"))
        {
            if (img.tagName == "IMG")
            {
                if (!img.ondblclick)
                    img.ondblclick = function() {this.showImgParams(img.src)}.bind(this);
            }
        }
    }

    imgFromSrc(src)
    {
        for (const c of this.div.writer.deepChildren())
        {
            if (c.tagName == "IMG" && c.src == src)
                return c;
        }
        return null;
    }

    showImgParams(src)
    {
        const ct = D.createElement("div");
        ct.titre = ct.newNode("h3");
        ct.titre.innerHTML = "<img src='" + TxtWriter.FM + "/js/floatWindow/images/edit.png' /> Style de l'image.";
        ct.ui = ct.newNode("div", "left");
        ct.ui.float = ct.ui.labelSelect(floats, "Float : ");
        ct.ui.width = ct.ui.labelInput("number", "Width (px) : ");

        ct.ui.margin = ct.ui.labelInput("range", "Margin : ");
        ct.ui.margin.input.max = "100";
        ct.ui.margin.input.min = "0";

        ct.ui.padding = ct.ui.labelInput("range", "Padding : ");
        ct.ui.padding.input.max = "100";
        ct.ui.padding.input.min = "0";

        ct.ui.shadow = ct.ui.labelInput("checkbox", "Box Shadow : ");

        ct.ui.borderRadius = ct.ui.labelInput("range", "Border Radius : ");
        ct.ui.borderRadius.input.max = "1000";
        ct.ui.borderRadius.input.min = "0";

        ct.ui.float.select.oninput = () =>
        {
            const img = this.imgFromSrc(src);
            img.style.float = ct.ui.float.select.value;
        }

        ct.ui.width.input.oninput = () => 
        {
            const img = this.imgFromSrc(src);
            img.style.width = ct.ui.width.input.value + "px";
        }

        ct.ui.margin.input.oninput = () => 
        {
            const img = this.imgFromSrc(src);
            img.style.margin = ct.ui.margin.input.value + "px";
        }

        ct.ui.padding.input.oninput = () => 
        {
            const img = this.imgFromSrc(src);
            img.style.padding = ct.ui.padding.input.value + "px";
        }

        ct.ui.shadow.input.oninput = () => 
        {
            const img = this.imgFromSrc(src);
            if (ct.ui.shadow.input.checked)
                img.style.boxShadow = "1px 1px 3px #00000069";

            else
                img.style.boxShadow = "initial";
        }

        ct.ui.borderRadius.input.oninput = () => 
        {
            const img = this.imgFromSrc(src);
            img.style.borderRadius = ct.ui.borderRadius.input.value + "px";
        }

        this.wm.message(ct, null, "Paramètres de l'image", true);
    }

    replaceInSelection(search, replace)
    {

    }

    definitiveHtml()
    {
        return this.definitveHtml()
    }

    definitveHtml()
    {
        this.cleanAll();
        for (let c of this.div.writer.children)
        {
            if (c.tagName == "IMG")
            {
                if (c.classList.contains("edit"))
                    c.classList.remove("edit");
            }
        }

        let html = this.div.writer.innerHTML; 
        html = html.replace(/&nbsp;<br>/g, "<br>");
        html = html.replace(/&nbsp;<\/div>/g, "</div>");

        this.updateToCode(html);
        return this.div.code.value;	
    }

    setHtml(html)
    {
        this.div.writer.innerHTML = html;
        this.updateToCode(html);
    }

    codeToNewWin()
    {
        let win = open("", "Code"); 
        win.document.body.innerText = this.definitveHtml();
    }

    setKeyEvents()
    {
        this.div.writer.addEventListener("keydown", function (e)
            {

                if (e.key == "Enter" && e.ctrlKey)
                {
                    e.preventDefault(); 
                    return;
                }
                if (e.keyCode == 13)
                {
                    let sel = getSelection();
                    e.preventDefault();
                    let br;
                    let nxt = sel.anchorNode.nextSibling;
                    if (!nxt)
                        nxt = "DIV"; 
                    else if (nxt.nodeType == Node.TEXT_NODE)
                    {
                        let line = nxt.wholeText;
                        let rest = line.substr(sel.anchorOffset);
                        if (rest == "")
                            nxt = "DIV";
                    }
                    else 
                        nxt = nxt.tagName;

                    if (nxt == "DIV")
                    {
                        br = D.createElement("br");
                        this.insertNode(br);
                    }
                    br = D.createElement("br");
                    if (nxt == "DIV")
                        this.insertNode(br, false);
                    else 
                        this.insertNode(br);
                    sel.getRangeAt(0).setStart(br.nextSibling, 0);
                }

                else if (e.keyCode == 75 && e.ctrlKey) // ctrl + k
                {
                    e.preventDefault();
                    this.addLink();
                }

                else if (e.keyCode == 73 && e.altKey)
                {
                    e.preventDefault();
                    this.addImage();
                }

                // alt + fleche up 
                else if (e.keyCode == 38 && e.altKey)
                {
                    e.preventDefault(); 
                    let val = parseInt(this.div.header.font.size.getValue()) + 1;
                    this.setFontSize(val);
                    this.div.header.font.size.setValue(val + "px");
                }

                // alt + fleche dwn 
                else if (e.keyCode == 40 && e.altKey)
                {
                    e.preventDefault(); 
                    let val = parseInt(this.div.header.font.size.getValue()) - 1;
                    this.setFontSize(val);
                    this.div.header.font.size.setValue(val + "px");

                }

                else if (e.key == "m" && e.ctrlKey && e.altKey)
                {
                    if (this.div.writer != D.activeElement)
                        return;
                    e.preventDefault();
                    this.newComment();
                }

                else if (e.key == "h" && e.ctrlKey && e.altKey)
                {
                    if (this.div.writer != D.activeElement)
                        return;
                    e.preventDefault();
                    this.toggleComments();
                }

                else if (e.key == "ArrowUp" && e.ctrlKey)
                {
                    e.preventDefault();
                    this.commentIndex -= 1;
                    if (this.commentIndex<0)
                        this.commentIndex = 0;
                    this.focusActiveComment();
                }

                else if (e.key == "ArrowDown" && e.ctrlKey)
                {
                    e.preventDefault();
                    this.commentIndex += 1;
                    if (this.commentIndex>= this.comments.length)
                        this.commentIndex = this.comments.length - 1;
                    this.focusActiveComment();
                }

                return false;

            }.bind(this));
    }

    createAutoLinks(html)
    {
        let words = html.split(/&nbsp;/g); 
        for (let i=0; i<words.length; i++)
        {
            if (words[i].isLink())
                words[i] = words[i].transformToA(true);
        }
        html = words.join("&nbsp;");

        words = html.split(/<br>/g); 
        for (let i=0; i<words.length; i++)
        {
            if (words[i].isLink())
                words[i] = words[i].transformToA(true);
        }
        html = words.join("<br>");

        words = html.split(/<br\/>/g); 
        for (let i=0; i<words.length; i++)
        {
            if (words[i].isLink())
                words[i] = words[i].transformToA(true);
        }
        html = words.join("<br>");

        words = html.split(/ /g); 
        for (let i=0; i<words.length; i++)
        {
            if (words[i].isLink())
                words[i] = words[i].transformToA(true);
        }
        html = words.join(" ");
        return html;
    }

    updateToCode(html = "")
    {
        if (html == "")
            html = this.div.writer.innerHTML.replace(/<br\/>/g, "<br>");
        html = html.replace(/<br>\n/g, "<br>");
        html = html.replace(/<\/div>\n/g, "</div>");

        html = html.replace(/<br>/g, "<br>\n");
        html = html.replace(/<div>/g, "<div>\n");
        html = html.replace(/<\/div>/g, "\n</div>");
        html = this.createAutoLinks(html);

        this.div.code.value = html;
    }

    updateFromCode()
    {
        this.div.writer.innerHTML = this.div.code.value;
        this.updateImgEvents();
    }

    removeDefaultText()
    {
        if (!this.div.writer.textContent.includes("Votre texte..."))
            return;
        this.div.writer.innerHTML = this.div.writer.innerHTML.replace("Votre texte...", "");		
        this.div.focus();
    }

    toClipBoard()
    {
        html2clipboard(this.definitiveHtml());
    }

    surroundSelection(nodeType)
    {
        this.selection.range.surroundContents(D.createElement(nodeType));
    }

    newComment()
    {
        if (!this.canComment)        
            return;
        
        importScripts([
        mkJs(TxtWriter.FM + "/js/txtWriter/Comment.js")], () => 
            {
                this.showComments();
                const c = new mlComment(this);
                this.comments.push(c);
            });
    }

    serializeComments()
    {
        const json = [];
        for (const c of this.comments)
            json.push(c.serialize());
        return json;
    }

    deserializeComments(json)
    {
        this.comments = [];

        importScripts([mkJs(TxtWriter.FM + "/js/txtWriter/Comment.js")], () => 
        {
            for (const c of json)
            {
                const comment = new mlComment(this, true);
                comment.deserialize(c);
                this.comments.push(comment);
            }
            this.hideComments();
        });
    }

    unFocusComments()
    {
        for (const c of this.comments)
            c.unfocus();

    }

    hideComments()
    {
        for (const c of this.comments)
            c.hide();
        this.commentsVisible = false;
    }

    showComments()
    {
        for (const c of this.comments)
            c.show();

        this.commentsVisible = true;
    }

    toggleComments()
    {
        this.commentsVisible = !this.commentsVisible;
        if (this.commentsVisible)
            this.showComments();
        else 
            this.hideComments();
    }

    focusActiveComment()
    {
        this.unFocusComments();
        this.comments[this.commentIndex].focus();
    }

    removeCommentsThatDoesNotExistsAnymore()
    {
        let ok = [];
        let toRemove = [];
        for (const c of this.comments)
        {
            if (c.findSpan())
                ok.push(c);
            else 
                toRemove.push(c);
        }

        this.comments = ok;
        for (const tr of toRemove)
            tr.remove();
    }
}

