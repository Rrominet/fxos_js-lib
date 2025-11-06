class mlNode extends mlGraphicElmt
{
    constructor(nodeEditor, name = "My node", x =null, y=null) 
    {
        super(nodeEditor, name, x, y);
        this.executed = false;
        this.event = false;
    }

    setZIndex() 
    {
        for (let n of this.editor.nodesList)
            n.content.style.zIndex = 3;

        this.content.style.zIndex = 4;
    }

    addInput(socketName, color)
    {
        let socket = new mlSocket(this, socketName, INPUT_SOCKET, color)
        this.content.append(socket.visual);
        this.inputs.push(socket);
        return socket;
    }

    addOutput(socketName, color)
    {
        let socket = new mlSocket(this, socketName, OUTPUT_SOCKET, color)
        this.content.append(socket.visual);
        this.outputs.push(socket);
        return socket;
    }

    socketByName(socketName)
    {
        let socket = null; 
        for (let s of this.inputs)
        {
            if (s.name() == socketName)
            {
                socket = s; 
                break;
            }
        }

        if (!socket)
        {
            for (let s of this.outputs)
            {
                if (s.name() == socketName)
                {
                    socket = s; 
                    break;
                }
            }
        }

        return socket;
    }

    removeSocket(socketName)
    {
        let socket = this.socketByName(socketName);
        if (!socket)
            return false;
        
        if (socket.type == INPUT_SOCKET)
            this.inputs.remove(socket);
        else 
            this.outputs.remove(socket);

        if (socket)
            socket.remove();
        return true;
    }

    draw(name)
    {
        super.draw(name); 
        this.content.classList.add("node");
    }

    clearSocketsSelection()
    {
        for (let s of this.inputs)
            s.selected = false;
        for (let s of this.outputs)
            s.selected = false;
    }

    destroy() 
    {
        super.destroy();
        this.editor.nodesList.remove(this);

        for (let e of this.edges())
            e.destroy();
    }

    edges()
    {
        let list = [];

        for (let s of this.inputs)
        {
            for(let e of s.edges)
            {
                list.push(e);
            }
        }

        for (let s of this.outputs)
        {
            for(let e of s.edges)
            {
                list.push(e);
            }
        }

        return list;
    }

    updateEdges()
    {
        for (let s of this.inputs)
        {
            for (let edge of s.edges)
                edge.update();
        }

        for (let s of this.outputs)
        {
            for (let edge of s.edges)
                edge.update();
        }
    }

    isFirst() 
    {
        if (this.inputs.length ==0)
            return true;

        else
        {
            let edgesNumber = 0

            for (let input of this.inputs)
            {
                if (input.edges.length>0)
                    edgesNumber ++;
            }

            if (edgesNumber == 0)
                return true;
        }

        return false;
    }

    isLast()
    {
        if (this.outputs.length ==0)
            return true;

        else
        {
            let edgesNumber = 0

            for (let output of this.outputs)
            {
                if (output.edges.length>0)
                    edgesNumber ++;
            }

            if (edgesNumber == 0)
                return true;
        }

        return false;
    }

    inputsNodes()
    {
        let nodes = [];
        for (let i of this.inputs)
            nodes.push(i.connectedNode());
        return nodes;
    }

    serialize() 
    {
        let json = super.serialize();

        json.inputs = this.inputs.serialize();
        json.outputs = this.outputs.serialize();

        return json;
    }

    deserialize(json, useId=true)
    {
        super.deserialize(json, useId);
        for (let i= 0; i<this.inputs.length; i++)
            this.inputs[i].deserialize(json.inputs[i], useId);

        for (let i= 0; i<this.outputs.length; i++)
            this.outputs[i].deserialize(json.outputs[i], useId);
    }

    initStr()
    {
        this.executed = false;
    }

    executeStr(isEvent = false)
    {
        if (this.executed && !isEvent)
            return "";

        let str = ""; 
        for (let i of this.inputs)
        {
            if (i.isConnected())
                str += i.connectedNode().executeStr(isEvent);
        }

        str += "$res_" + this.id + " = $node_" + this.id + "->execute([";
        for (let i of this.inputs)
        {
            if (i.isConnected())
            {
                str += "$res_" + i.connectedNodeId();
                str += ",";
            }
        }
        str = str.slice(0, -1);
        str += "]);\n"

        this.executed = true;

        return str;
    }

    isConnectedToEvent()
    {
        if (this.deepConnectedEventNode())
            return true;
        return false;
    }

    deepConnectedEventNode()
    {
        let node = null;
        for (const i of this.inputs)
        {
            if (i.isConnected())
            {
                node = i.connectedNode();
                if (node.event == true)
                    return node;
                else 
                    node = node.deepConnectedEventNode();
            }
        }

        return node;
    }

    name()
    {
        return this.content.label.innerText;
    }
}
