/*	CONTACTS_LIST                    = 0; 
    EMAIL                            = 1; 
    MIX_CONTACTS_LIST                = 2; 
    PREVENT_DOUBLE_EMAILS            = 3; 
    */

class mlNodeEditor
{
    constructor ()
    {
        //attributes // 
        this.nodesList = [];
        this.view = null;
        this.mouseEdge = null;
        this.edges = [];
        this.selectRect = null;
        this.zoomFactor = 1;
        this.moving = false;
        this.elmts = [];
        this.outFocus = false;

        this.lastSelected = null;

        this.mode = -1;

        this.xhr = HttpRequest();
        // end-attributes // 


        this.createInterface();
        this.menu = new mlNodeEditorMenu;
        this.readFileFromUrl();

        window.addEventListener("beforeunload", (e) => this.onClose(e));
    }

    uniqueId()
    {
        let id = Math.floor(Math.random() * 100000000);
        while(!this.isIdUnique())
            this.uniqueId();

        return id;
    }

    isIdUnique(id)
    {
        for (let n of this.elmts)
        {
            if (n.id == id)
                return false; 
        }

        return true;
    }

    getFromId(id)
    {
        for (let n of this.elmts)
        {
            if (n.id == id)
                return n; 

            for (let input of n.inputs)
            {
                if (input.id == id)
                    return input; 
            }

            for (let output of n.outputs)
            {
                if (output.id == id)
                    return output; 
            }
        }

        return null;
    }

    createView()
    {
        this.view = D.createElement("div"); 
        this.view.classList.add("nodeView");
        B.appendChild(this.view);

        this.view.addEventListener("mousemove", this.onGrab.bind(this));
        this.view.addEventListener("contextmenu", this.onContext.bind(this));
        this.view.addEventListener("mousedown", this.onMouseDwn.bind(this));
        this.view.addEventListener("mouseup", this.onMouseUp.bind(this));
        B.addEventListener("keydown", this.keyboard.bind(this));

        this.view.style.width = (10*innerWidth) + "px"; 
        this.view.style.height = (10*innerHeight) + "px"; 
    }

    createNodesContainer() 
    {
        this.view.nodes = newNode("div", this.view);
        this.view.nodes.classList.add("nodes");
    }

    setViewToCenter() 
    {
        let w = parseInt(this.view.style.width);
        let h = parseInt(this.view.style.height);

        window.scrollTo(w/2 - innerWidth, h/2 - innerHeight);
    }

    createServerButton()
    {
        this.serverButton = B.newNode("button", ["mlNodeEditor", "server"]); 
        this.serverButton.innerText = "Send to server"; 

        this.serverButtonStatus = B.newNode("label", ["mlNodeEditor", "server"]);
        this.serverButtonStatus.hidden = true;
        this.serverButtonStatus.innerText = "Not sended yet.";

        this.serverButton.addEventListener("click", function ()
            {
                this.executeToServer()
            }.bind(this));

        this.excecuteButton = B.newButton("Execute", this.executeOnce.bind(this), ["mlNodeEditor", "server", "execute"]); 
        this.testButton = B.newButton("Test", this.test.bind(this), ["mlNodeEditor", "server", "test"]); 
    }

    createSaveLabel() 
    {
        this.saveLabel = B.newNode("label", ["mlNodeEditor", "save"]); 
        this.saveLabel.innerText = "File saved.";
        this.saveLabel.hidden = true;
    }

    createInterface()
    {
        this.createView();
        this.createNodesContainer();
        this.setContextMenu();
        this.setViewToCenter();
        this.createServerButton();
        this.createSaveLabel();
    }

    onGrab(e)
    {
        if (e.buttons == 4) 
        {
            window.scrollBy(-(e.movementX*1.0)/devicePixelRatio, 
                -(e.movementY*1.0)/devicePixelRatio);
        }

        else if (e.buttons == 1)
        {
            if (this.selectRect !==null)
            {
                this.drawSelectRect(e);
                return;
            }

            if (!this.isMouseOnElmt() && 
                !this.isMouseOnEdge() && 
                this.mouseEdge === null && 
                !this.isSomethingSelected())
            {
                this.drawSelectRect(e);
                return;
            }

            if (this.mode == RESIZE_MODE)
            {
                for (let el of this.elmts)
                {
                    if (el.type == CONTAINER)
                    {
                        el.resize(e.movementX, e.movementY); 
                        return;
                    }
                }
            }

            this.moveSelected(e.movementX, e.movementY);
            this.createEdgesFromSelectedSockets(e);
            this.udpateEdges();
        }

        else if (this.moving)
        {
            this.moveSelected(e.movementX, e.movementY);
            this.udpateEdges();
        }
    }

    onMouseUp(e)
    {
        this.mode = -1;

        this.moving = false;
        this.validEdge();

        for (let n of this.nodesList)
            n.clearSocketsSelection();

        if (this.selectRect !== null)
        {
            this.selectInRect(e);
            this.selectRect.parentNode.removeChild(this.selectRect); 
            this.selectRect = null;
        }

        if (this.mouseEdge === null)
            return; 
        else 
        {
            this.mouseEdge.destroy();
            this.mouseEdge = null;
        }
    }

    validEdge()
    {
        let fSocket = this.firstSocket();
        let lSocket = this.socketMouseOn();

        if (!fSocket || !lSocket)
            return;

        if (fSocket.type == lSocket.type)
            return;

        if (fSocket.node == lSocket.node)
            return;

        if (lSocket.isConnected())
        {
            for (let e of lSocket.edges)
                e.destroy();
        }

        let inSocket = null;
        let outSocket = null;

        if (fSocket.type == INPUT_SOCKET)
        {
            inSocket = fSocket; 
            outSocket = lSocket;
        }

        if (fSocket.type == OUTPUT_SOCKET)
        {
            inSocket = lSocket; 
            outSocket = fSocket;
        }

        let e = new mlEdge(this, inSocket, outSocket);
        this.edges.push(e);
    }

    moveSelected(x, y) 
    {
        for (let n of this.selectedEmts())
            n.move(x, y);
    }

    createEdgesFromSelectedSockets(e)
    {
        for (let n of this.nodesList)
        {
            this.drawTmpEdgesFromSocketList(n.inputs, e);
            this.drawTmpEdgesFromSocketList(n.outputs, e);
        }
    }

    drawTmpEdgesFromSocketList(list, e)
    {
        for (let socket of list)
        {
            if (socket.selected)
            {
                if (this.mouseEdge === null)
                {
                    this.mouseEdge  = new mlEdge(this,null, null); 
                    this.view.nodes.appendChild(this.mouseEdge.line);
                }

                mlEdge.drawWithMouse(e, socket, this.mouseEdge.line);
            }
        }
    }

    firstSocket() 
    {
        for (let n of this.nodesList)
        {
            for (let socket of n.inputs)
            {
                if (socket.selected)
                    return socket;
            }

            for (let socket of n.outputs)
            {
                if (socket.selected)
                    return socket;
            }
        }
        return null;
    }

    socketMouseOn()
    {
        for (let n of this.nodesList)
        {
            for (let socket of n.inputs)
            {
                if (socket.mouseOn)
                    return socket;
            }

            for (let socket of n.outputs)
            {
                if (socket.mouseOn)
                    return socket;
            }
        }
        return null;
    }

    udpateEdges()
    {
        for (let n of this.selectedNodes())
        {
            n.updateEdges();
        }

        for (let e of this.selectedEmts())
        {
            if (e.type == CONTAINER)
            {
                for (let n of e.children)
                {
                    n.updateEdges();
                }
            }
        }
    }

    onMouseDwn(e)
    {
        if (e.button == 1)
            return;

        if (!this.isMouseOnElmt())
        {
            this.deselectAllElmts();
            this.hideAllModifies();
        }

        if (!this.isMouseOnEdge())
        {
            this.deselectAllEdges();
        }

        for (let e of this.elmts)
        {
            if (e.onResize)
            {
                this.mode = RESIZE_MODE;
                return;
            }
        }
    }

    setContextMenu()
    {
        this.contextMenu = new ContextMenu(this.view);
        this.contextMenu.newContactsListNode = new MenuButton(this.contextMenu, "Contacts List", this.addContactsListNode.bind(this));
        this.contextMenu.newSingleCompteNode = new MenuButton(this.contextMenu, "Single Compte", this.addSingleCompteNode.bind(this));
        this.contextMenu.newEmailNode = new MenuButton(this.contextMenu, "Email", this.addEmailNode.bind(this));
        this.contextMenu.newNewsletterNode = new MenuButton(this.contextMenu, "Newsletter", this.addNewsletterNode.bind(this));
        this.contextMenu.newSequenceEmailNode = new MenuButton(this.contextMenu, "Séquence Emails", this.addEmailsSeqNode.bind(this));
        this.contextMenu.newMixContactsListNode = new MenuButton(this.contextMenu, "Mix Contacts", this.addMixContactsListNode.bind(this));
        this.contextMenu.newPreventDoubleEmailsNode = new MenuButton(this.contextMenu, "Prevent double emails", this.addPreventDoubleEmailsNode.bind(this));
        this.contextMenu.addTimeNode = new MenuButton(this.contextMenu, "Time input", this.addTimeNode.bind(this));
        this.contextMenu.addDateNode = new MenuButton(this.contextMenu, "Date input", this.addDateNode.bind(this));
        this.contextMenu.addValueNode = new MenuButton(this.contextMenu, "Value", this.addValueNode.bind(this));
        this.contextMenu.addPageVisitedNode = new MenuButton(this.contextMenu, "Page Visited", this.addPageVisitedNode.bind(this));
        this.contextMenu.addDebugNode = new MenuButton(this.contextMenu, "Debug", this.addDebugNode.bind(this));
        this.contextMenu.separator();
        this.contextMenu.addEventTestNode = new MenuButton(this.contextMenu, "Test Event", this.addEventTestNode.bind(this));
        this.contextMenu.addEventNewCompteNode = new MenuButton(this.contextMenu, "New Compte Event", this.addEventNewCompteNode.bind(this));
    }

    onContext(e)
    {
        e.preventDefault();
    }

    addNode(mlNode)
    {
        this.nodesList.push(mlNode);
        this.elmts.push(mlNode);
    }

    addElmt (mlGraphicElmt)
    {
        this.elmts.push(mlGraphicElmt);
    }

    newNode(type, mouseEvent = null)
    {
        let n = null;

        if (type == CONTACTS_LIST)
            n = this.addContactsListNode(mouseEvent); 
        else if (type == SINGLE_COMPTE)
            n = this.addSingleCompteNode(mouseEvent); 
        else if (type == EMAIL)
            n = this.addEmailNode(mouseEvent); 
        else if (type == MIX_CONTACTS_LIST)
            n = this.addMixContactsListNode(mouseEvent); 
        else if (type == PREVENT_DOUBLE_EMAILS)
            n = this.addPreventDoubleEmailsNode(mouseEvent); 
        else if (type == TIME)
            n = this.addTimeNode(mouseEvent); 
        else if (type == DATE)
            n = this.addDateNode(mouseEvent); 
        else if (type == VALUE)
            n = this.addValueNode(mouseEvent); 
        else if (type == TEST)
            n = this.addEventTestNode(mouseEvent); 
        else if (type == PAGE_VISITED)
            n = this.addPageVisitedNode(mouseEvent); 
        else if (type == CONTAINER)
            n = this.addContainer(mouseEvent); 
        else if (type == NEWSLETTER)
            n = this.addNewsletterNode(mouseEvent); 
        else if (type == DEBUG)
            n = this.addDebugNode(mouseEvent); 
        else if (type == EMAILS_SEQ)
            n = this.addEmailsSeqNode(mouseEvent); 
        else if (type == NEW_COMPTE_EVENT)
            n = this.addEventNewCompteNode(mouseEvent);

        return n;
    }

    duplicate(mlNode)
    {
        let n = this.newNode(mlNode.type); 
        n.setPosition(mlNode.x, mlNode.y); 
        n.move(10,10);
        n.content.style.zIndex = 2;
        n.deserialize(mlNode.serialize(), false);
        return n;
    }

    duplicateSelected() 
    {
        let duplicatedNodes = []; 

        for (let n of this.selectedNodes())
        {
            let node = this.duplicate(n); 
            duplicatedNodes.push(node); 
        }

        this.deselectAllElmts();

        for (let n of duplicatedNodes)
            n.setSelected(true);
    }

    removeNode(mlNode)
    {
        mlNode.destroy();
        mlNode = null;
    }

    // NODES TYPE // 
    // -----------------// 

    addEmailNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeEmail(this, "My email");
        }
        else
        {
            n = new mlNodeEmail(this, "My email", mouseEvent.pageX, mouseEvent.pageY);
        }
        this.addNode(n);
        return n;
    }

    addNewsletterNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeNewsletter(this, "Newsletter");
        }
        else
        {
            n = new mlNodeNewsletter(this, "Newsletter", mouseEvent.pageX, mouseEvent.pageY);
        }
        this.addNode(n);
        return n;
    }

    addContactsListNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeContactsList(this, "My contacts");
        }
        else
        {
            n = new mlNodeContactsList(this, "My contacts", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addNode(n);
        return n;
    }

    addSingleCompteNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeSingleCompte(this, "Compte");
        }
        else
        {
            n = new mlNodeSingleCompte(this, "Compte", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addNode(n);
        return n;
    }

    addMixContactsListNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeMixContactsList(this, "Mix");
        }
        else
        {
            n = new mlNodeMixContactsList(this, "Mix", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addNode(n);
        return n;
    }

    addPreventDoubleEmailsNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodePreventDoubleEmails(this, "Mix");
        }
        else
        {
            n = new mlNodePreventDoubleEmails(this, "Prevent Doubles", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addNode(n);
        return n;
    }

    addTimeNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeTime(this, "Time");
        }
        else
        {
            n = new mlNodeTime(this, "Time", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addNode(n);
        return n;
    }

    addDateNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeDate(this, "Date");
        }
        else
        {
            n = new mlNodeDate(this, "Date", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addNode(n);
        return n;
    }

    addValueNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeValue(this, "Value");
        }
        else
        {
            n = new mlNodeValue(this, "Value", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addNode(n);
        return n;
    }

    addEventTestNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
            n = new mlNodeEventTest(this, "Test Event");
        else
            n = new mlNodeEventTest(this, "Test Event", mouseEvent.pageX, mouseEvent.pageY);

        this.addNode(n);
        return n;
    }

    addPageVisitedNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodePageVisited(this, "Page Visited");
        }
        else
        {
            n = new mlNodePageVisited(this, "Page Visited", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addNode(n);
        return n;
    }

    addDebugNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeDebug(this, "Debug");
        }
        else
        {
            n = new mlNodeDebug(this, "Debug", mouseEvent.pageX, mouseEvent.pageY);
        }
        this.addNode(n);
        return n;
    }

    addEmailsSeqNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeEmailsSeq(this, "Séquence Emails");
        }
        else
        {
            n = new mlNodeEmailsSeq(this, "Séquence Emails", mouseEvent.pageX, mouseEvent.pageY);
        }
        this.addNode(n);
        return n;
    }

    addContainer(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlContainer(this, "Parent");
        }
        else
        {
            n = new mlContainer(this, "Parent", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addElmt(n);
        return n;
    }

    addEventNewCompteNode(mouseEvent = null)
    {
        let n = null;
        if (mouseEvent == null)
        {
            n = new mlNodeEventNewCompte(this, "New Compte");
        }
        else
        {
            n = new mlNodeEventNewCompte(this, "New Compte", mouseEvent.pageX, mouseEvent.pageY);
        }

        this.addNode(n);
        return n;
    }

    // NODES TYPE // 
    // -----------------// 

    selectedNodes() 
    {
        let selectedList = []; 
        for (let node of this.nodesList)
        {	
            if (node.selected)
                selectedList.push(node); 
        }

        return selectedList;
    }

    selectedEmts()
    {
        let selectedList = []; 
        for (let node of this.elmts)
        {	
            if (node.selected)
                selectedList.push(node); 
        }

        return selectedList;
    }

    selectedEdges() 
    {
        let selectedList = []; 
        for (let e of this.edges)
        {	
            if (e.selected)
                selectedList.push(e); 
        }

        return selectedList;
    }

    selectAll()
    {
        for (let n of this.nodesList)
        {
            n.setSelected(true);
        }
    }

    deselectAllElmts()
    {
        for (let n of this.elmts)
        {
            n.setSelected(false);
        }
    }

    deselectAllEdges()
    {		
        for (let e of this.edges)
        {
            e.setSelected(false);
        }
    }

    deselectAll()
    {
        this.deselectAllElmts();
        this.deselectAllEdges();
    }


    isSomethingSelected()
    {
        for (let n of this.elmts)
        {
            if (n.selected)
                return true;
        }

        for (let e of this.edges)
        {
            if (e.selected)
                return true;
        }

        return false;
    }

    allElements()
    {
        let elemts = []; 
        for (let n of this.elmts)
            elemts.push(n); 

        for (let e of this.edges)
            elemts.push(e); 

        return elemts;
    }


    isMouseOnElmt()
    {
        for (let n of this.elmts)
        {
            if (n.mouseOn)
                return true;
        }

        return false;
    }

    isMouseOnEdge()
    {
        for (let e of this.edges)
        {
            if (e.mouseOn)
                return true;
        }

        return false;
    }

    clear()
    {
        for (let n of this.elmts)
            this.removeNode(n);

        while (this.view.nodes.hasChildNodes())
            this.clear(); 
    }

    removeSelected() 
    {
        for (let n of this.selectedEmts())
            this.removeNode(n);

        for (let e of this.selectedEdges())
            e.destroy();
    }

    hideAllModifies()
    {
        for (let el of D.getElementsByClassName("modify"))
            el.hidden = true;
    }

    drawSelectRect(e)
    {
        if (this.selectRect == null)
        {
            this.selectRect = newNode('div', this.view.nodes, "selectRect");

            this.selectRect.left = (e.clientX + scrollX);
            this.selectRect.top = (e.clientY + scrollY);

            this.selectRect.style.left =  this.selectRect.left + "px"; 
            this.selectRect.style.top =  this.selectRect.top + "px"; 

        }

        this.selectRect.width = (e.clientX + scrollX) - this.selectRect.left;
        this.selectRect.height = (e.clientY + scrollY) - this.selectRect.top;

        if (this.selectRect.width>0 && this.selectRect.height>0)
        {
            this.selectRect.style.width =  this.selectRect.width + "px"; 
            this.selectRect.style.height = this.selectRect.height + "px"; 
        }

        else if (this.selectRect.width<0 && this.selectRect.height>0)
        {
            this.selectRect.style.width =  (-this.selectRect.width) + "px"; 
            this.selectRect.style.height = this.selectRect.height + "px"; 

            this.selectRect.style.left = (e.clientX + scrollX) + "px"; 
        }

        else if (this.selectRect.width>0 && this.selectRect.height<0)
        {
            this.selectRect.style.width =  this.selectRect.width + "px"; 
            this.selectRect.style.height = (-this.selectRect.height) + "px"; 

            this.selectRect.style.top = (e.clientY + scrollY) + "px";
        }

        else
        {
            this.selectRect.style.width =  (-this.selectRect.width) + "px"; 
            this.selectRect.style.height = (-this.selectRect.height) + "px"; 

            this.selectRect.style.left = (e.clientX + scrollX) + "px"; 
            this.selectRect.style.top = (e.clientY + scrollY) + "px"; 
        }
    }

    selectInRect(e)
    {

        let inRect = []; 
        let x0 = this.selectRect.left; 
        let y0 = this.selectRect.top; 

        let x1 = this.selectRect.left + this.selectRect.width; 
        let y1 = this.selectRect.top + this.selectRect.height;

        let rect = new Rect(x0, y0, x1, y1); 

        for (let n of this.nodesList)
        {
            if (rect.intersect(n.content))
                n.setSelected(true);
        }

        for (let e of this.edges)
        {
            if (rect.intersect(e.line))
                e.setSelected(true);
        }
    }

    focusAll()
    {

    }

    focusSelected()
    {

    }

    serialize() 
    {
        const json = {};
        json.width = this.view.style.width;
        json.height = this.view.style.height;
        json.elmts = this.elmts.serialize();
        json.edges = this.edges.serialize();

        return json;
    }

    serializeSelection()
    {
        const json = {};
        json.elmts = [];
        json.edges = [];
        for (const e of this.selectedEmts())
            json.elmts.push(e.serialize());

        return json;
    }

    onCopy()
    {
        const data = this.serializeSelection();
        this.deselectAll();
        navigator.clipboard.writeText(JSON.stringify(data));
    }

    onPaste()
    {
        navigator.clipboard.readText().then((clipText) => 
            {
                const data = JSON.parse(clipText);
                for (const el of data.elmts)
                {
                    let n = this.newNode(el.type);
                    n.deserialize(el);
                    n.setSelected(true);
                }
            })
    }

    deserialize(json)
    {
        this.readOnly = json.readOnly;
        this.view.style.width = json.width;
        this.view.style.height = json.height;
        this.nodesList = []; 
        this.elmts = [];
        this.edges = [];

        for (let jsonN of json.elmts)
        {
            let n = this.newNode(jsonN.type);
            n.deserialize(jsonN);
        }

        for (let jsonE of json.edges)
        {
            let e = new mlEdge(this); 
            e.deserialize(jsonE);
            this.edges.push(e);
        }

        for (let e of this.elmts)
        {
            if (e.type == CONTAINER)
                e.childrenIdsToElmts();
        }

        if (this.readOnly)
        {
            if (typeof(window.WM) == "undefined")
                window.WM = new WindowsManager;
            window.WM.message("Warning: another user is already working on this file.<br>So as long as it is connected, you will not be able to save your changes.<br>Best to come back later.");
        }
    }

    save(file = "editor-00") 
    {
        let str = JSON.stringify(this.serialize()); 
        try
        {
            let localData = {};
            if (localStorage["mlNodeEditor"])
            {
                while(localStorage["mlNodeEditor"].length>5000000)
                {
                    let tmpData = JSON.parse(localStorage["mlNodeEditor"]);
                    tmpData.saves.shift();
                    localStorage["mlNodeEditor"] = JSON.stringify(tmpData);
                };
                localData = JSON.parse(localStorage["mlNodeEditor"]);
            }
            if (!localData.saves)
                localData.saves = [];
            let data = {time : new Date().getTime(), data : this.serialize()};
            let save = null;
            for (const s of localData.saves)
                if (s.name == file)
                    save = s;
            if (!save)
            {
                save = {name : file, versions : []};
                localData.saves.push(save);
            }
            save.versions.push(data);
            localStorage["mlNodeEditor"] = JSON.stringify(localData);
        }
        catch(e){console.log( "Error in local saving")}

        // xhr Settings //
        let url = FM + "/php/mlNodeEditor/ajax.php";

        let params = [
            ["function", "save"],
            ["file", file],
            ["data", str]
        ]

        let func = function (xhr) 
        {
            if (xhr.response == "false")
                this.saveLabel.innerText = "File not saved...";
            else 
                this.saveLabel.innerText = "File saved.";
            this.saveLabel.hidden = false;
            setTimeout(function () 
                {
                    this.saveLabel.hidden = true;
                }.bind(this), 3500);

        }.bind(this);

        // xhr Settings // 
        this.xhr.sendListAsPost(url, params, func);
        this.menu.menuBar.content.fileName.innerText = file;
    }

    read(file="editor-00", onDoned=null) 
    {
        this.clear();
        // xhr Settings //
        let url = FM + "/php/mlNodeEditor/ajax.php";
        let params  = "function=open";   
        params += "&file=" + file;   

        let func = function (xhr) 
        {
            let str = xhr.responseText;
            str = request.parse(str);
                this.deserialize(JSON.parse(str));
                if (onDoned)
                    onDoned();
            }.bind(this);

        // xhr Settings //
        this.xhr.sendAsPost(url, params, func);
        this.menu.menuBar.content.fileName.innerText = file;
    }

    readFileFromUrl()
    {
        importScripts([mkJs(FM + "/js/urlParameters.js")], () => 
            {
                const file = urlParameter("file");
                if (file)
                    this.read(file);
            });
    }
    firstNodes()
    {
        let firstNodesList = []

        for (let n of this.nodesList)
        {
            if (n.isFirst())
                firstNodesList.push(n); 
        }

        return firstNodesList;
    }

    lastNodes()
    {
        let lastNodesList = []

        for (let n of this.nodesList)
        {
            if (n.isLast())
                lastNodesList.push(n); 
        }

        return lastNodesList;
    }

    lastNodesWithoutEvents()
    {
        let lastNodesList = []

        for (let n of this.nodesList)
        {
            if (n.isLast() && !n.isConnectedToEvent())
                lastNodesList.push(n); 
        }

        return lastNodesList;
    }

    lastNodesWithEventsInItsHierarchy()
    {
        let lastNodesList = []

        for (let n of this.nodesList)
        {
            if (n.isLast() && n.isConnectedToEvent())
                lastNodesList.push(n); 
        }

        return lastNodesList;
    }

    executeStr(test=false)
    {
        let str = ""; 
        if (test)
            str = "$MODE = 'test'; \n"; 
        else 
            str = "$MODE = 'live'; \n";

        for (let n of this.nodesList)
            str += n.initStr();

        str += "\n";
        str += "\n";
        str += "if (!$argv || count($argv) == 1)\n";
        str += "{\n";

        for (let n of this.lastNodesWithoutEvents())
            str += n.executeStr();
        str += "\n}"

        str += "\n";
        str += "\n";

        str += "else if ($argv && count($argv) >= 2)\n";
        str += "{\n";

        let nodes = this.lastNodesWithEventsInItsHierarchy();
        for (let i=0; i<nodes.length; i++)
        {
            let n = nodes[i];
            str += n.deepConnectedEventNode().ifArgStr();
            str += n.executeStr(true);
            str += "}\n";
        }

        str += "\n}";

        str = str.replace(/\(]\)/g, "()");

        return str;
    }

    eventNodes()
    {
        let _r = [];
        for (const n of this.nodesList)
        {
            if (n.event)
                _r.push(n);
        }

        return _r;
    }

    dataEvents()
    {
        const data = {events : []};
        for (const n of this.eventNodes())
        {
            data.events.push({type : n.eventType(), id : n.id});
        }
        data.generatedPhp = this.menu.menuBar.content.fileName.innerText + ".php";
        return data;
    }

    executeToServer(executeOnce = false, test=false) 
    {

        let url = FM + "/php/mlNodeEditor/ajax.php";
        let params = [
            ["dataCron", this.executeStr(test)],
            ["dataEvent", JSON.stringify(this.dataEvents())],
            ["file", this.menu.menuBar.content.fileName.innerText],
            ["function", "execute"],
        ]; 

        let func = (xhr) => 
        {
            if (executeOnce && !test)
            {
                let w = window.open(); 
                let url =  FM + "/php/os.php?func=exec&cmd=/frameworks/php/mlNodeEditor/generated/cron/" + this.menu.menuBar.content.fileName.innerText + ".php";
                w.location.href = encodeURI(url);
            }

            else if (executeOnce && test)
            {
                let w = window.open(); 
                let url =  FM + "/php/mlNodeEditor/generated/cron/" + this.menu.menuBar.content.fileName.innerText + ".php";
                w.location.href = encodeURI(url);
            }

            let str = xhr.responseText;
            this.serverButtonStatus.innerText = str;

            setTimeout(function () 
                {
                    this.serverButtonStatus.innerText = "Not sended yet."; 
                    this.serverButtonStatus.hidden = true;
                }.bind(this), 3500);

        };

        this.xhr.sendListAsPost(url, params, func);
        this.serverButtonStatus.hidden = false;
    }

    toggleMoving()
    {
        this.moving = !this.moving;
    }

    parentSelected()
    {
        for (let e of this.selectedEmts())
        {
            if (e != this.lastSelected)
            {
                this.lastSelected.addChild(e);
            }
        }
    }

    unParentSelected()
    {
        for (let e of this.selectedEmts())
        {
            e.unParent(); 
        }
    }

    executeOnce()
    {
        let res = confirm ("Are you sure ? Execution is irreversible.");
        if (res == true)
            this.executeToServer(true);
    }

    test()
    {
        this.executeToServer(true, true);
    }


    // SHORT CUTS // 

    keyboard(e)
    {
        if (D.activeElement.tagName == "TEXTAREA" ||
            D.activeElement.contentEditable == true ||
            D.activeElement.contentEditable == "true" ||
            (D.activeElement.tagName == "INPUT" && D.activeElement.type == "text")||
            (D.activeElement.tagName == "INPUT" && D.activeElement.type == "email")||
            this.outFocus
        )
            return; 

        let c = e.keyCode;
        if (c == 88 || c==46)
            this.removeSelected();

        if (c == 65 && !e.shiftKey)
            this.selectAll();

        if (c == 65 && e.shiftKey)
            this.deselectAll();

        if (c == 70 && this.isSomethingSelected())
            this.focusSelected();

        else if (c == 70 && !this.isSomethingSelected())
            this.focusAll();

        if (c == 83 && e.ctrlKey && !e.shiftKey)
        {
            e.preventDefault();
            this.save(this.menu.menuBar.content.fileName.innerText);
        }

        if (c == 68 && e.ctrlKey)
        {
            e.preventDefault();
            this.duplicateSelected();
        }

        if (c == 71)
            this.toggleMoving();

        if (c == 27)
        {
            this.moving = false;
        }

        if (c == 80 && e.ctrlKey)
        {
            e.preventDefault();
            this.parentSelected();
        }

        if (c == 80 && e.altKey)
        {
            e.preventDefault();
            this.unParentSelected();
        }

        if (e.key == "c" && e.ctrlKey && !D.activeElement.isEditable())
        {
            e.preventDefault();
            this.onCopy();
        }

        if (e.key == "v" && e.ctrlKey && !D.activeElement.isEditable())
        {
            e.preventDefault();
            this.onPaste();
        }

    }

    onClose(e)
    {
        const xhr = HttpRequest();
        let url = FM + "/php/mlNodeEditor/ajax.php";
        const params = [["func", "delete-lock"], ["file", this.menu.menuBar.content.fileName.innerText]];
        xhr.sendListAsPost(url, params, null, true, false);
    }

    openLocal()
    {
        const ct = D.createElement("div");
        ct.list = ct.newNode("div", "list");
        const w = WM.message(ct);

        importScripts([mkJs(FM + "/js/mlNodeEditor/files/LocalDistFile.js")], () => {
            const name = this.menu.menuBar.content.fileName.innerText;
            const localData = JSON.parse(localStorage["mlNodeEditor"]);
            for (const s of localData.saves)
            {
                if (s.name == name)
                {
                    for (const v of s.versions)
                        new LocalFile(name, v.time, ct.list, w);
                }
            }
        });
    }

    createAUniqIdForEveryOne()
    {
        for (const n of this.nodesList) 
        {
            n.id = this.uniqueId();
            for (const i of n.inputs)
                i.id = this.uniqueId();
            for (const o of n.outputs)
                o.id = this.uniqueId();
        }
    }
}

let NodeEditor = new mlNodeEditor();
