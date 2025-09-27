class Drag 
{
    constructor (el) 
    {
        el.addEventListener("touchstart", this.dragStart.bind(this))
        el.addEventListener("touchend", this.dragEnd.bind(this))
        document.body.addEventListener("touchmouve", this.drag.bind(this))

        el.addEventListener("mousedown", this.dragStart.bind(this))
        el.addEventListener("mouseup", this.dragEnd.bind(this))
        document.body.addEventListener("mousemove", this.drag.bind(this))

        this.currentX;
        this.currentY;
        this.initialX;
        this.initialY;
        this.xOffset = 0;
        this.yOffset = 0;
        this.el = el;
        this.el.activeDrag = false
    }

    static init () 
    {
        for (let el of document.getElementsByClassName("draggable"))
            Drag.mkdraggable(el);

        document.onkeydown = Drag.cancel;
    }

    static mkdraggable(el)
    {
        el.dragObject = new Drag(el);
        el.style.cursor = "grab";
    }

    // threshold in px
    // func take the MouseEvent in arg
    // func take in 2nd arg the futur dragged object
    static addOnDragStart(el, func=null, threshold=5)
    {
        el.dragging = false;
        el.wasDragging = false;
        el.dragStarted = false;
        if (typeof(el._onDragStart) == "undefined")
            el._onDragStart = [];
        if (func)
            el._onDragStart.push(func);
        const md = (e) => 
        {
            el.dragStarted = false;
            el.sx = e.clientX; el.sy = e.clientY;
        }

        const mm = (e) => 
        {
            if (!el || el.dragStarted)
                return;
            if (el.sx == -1)
                return;

            if (e.buttons == 1 && !el.dragging) 
            {
                if (Math.abs(e.clientX - el.sx) > threshold || 
                Math.abs(e.clientY - el.sy) > threshold) 
                {
                    el.dragging = true;
                    window.draggedElmt = el;
                }
            }

            if (!el.dragging)
                return;

            for (const f of el._onDragStart)
                f(e, el);
            el.dragStarted = true;
        }

        const mu = () =>
        {
            if (!el)
                return;
            el.sx = -1; el.sy = -1; testlog("sx = -1");
            if (el.dragging)
                el.wasDragging = true;
            el.dragging = false;
            setTimeout(() => {
                el.wasDragging = false;
                window.draggedElmt = null;
            }, 16);
        }

        el.addEventListener("mousedown", md);
        addEventListener("mousemove", mm);
        addEventListener("mouseup", mu);
    }

    // BUG here because if the source el is different, the drag event will begin on the NEXT mousemoove click... 
    // It need to start right away ! not sure how to do it for now...
    // /IM HERE /
    static simulateDragStart(el, x=mouseX, y=mouseY)
    {
        const mu = () =>
        {
            if (!el)
                return;
            if (el.dragging)
                el.wasDragging = true;
            el.dragging = false;
            setTimeout(() => {
                el.wasDragging = false;
                window.draggedElmt = null;
            }, 16);
        }

        addEventListener("mouseup", mu);

        el.dragStarted = true;
        el.sx = x; y;
        el.dragging = true;
        window.draggedElmt = el;
    }

    // func take on arg the mousevent and the dragged object
    static addOnDragEnd(el, func)
    {
        Drag.addOnDragStart(el); // to have the base events properties
        if (typeof(el._onDragEnd) == "undefined")
            el._onDragEnd = [];
        if (func)
            el._onDragEnd.push(func);

        const mu = (e) => 
        {
            if (el && el.wasDragging)
            {
                for (const f of el._onDragEnd)
                    f(e, el);
            }
        }

        addEventListener("mouseup", mu);
    }

    // the function take as argument the mousevent and the dropped domelement. (dropped element is the element who was proviously dragged & dropped, not the drop target (which here == el))
    static addOnDrop(el, func)
    {
        if (typeof(el._onDrop) == "undefined")
            el._onDrop = [];
        if (func)
            el._onDrop.push(func);
        const mu = (e) => 
        {
            const dragged = window.draggedElmt;
            if (!dragged)
                return;
            for (const f of el._onDrop)
                f(e, dragged);
        }

        el.addEventListener("mouseup", mu);
        return {"elmt" : el, "func" : func, "mu" : mu};
    }

    //dropEventData = {"elmt" : el, "func" : func, "mu" : mu} returned from addOnDrop
    static removeDropEvent(dropEventData)
    {
        const el = dropEventData.elmt;
        const func = dropEventData.func;
        for (const f of el._onDrop)
        {
            if (f == func)
            {
                el._onDrop.remove(f)
                break;
            }
        }

        el.removeEventListener("mouseup", dropEventData.mu);
    }

    static clerDropEvent(el)
    {
        el._onDrop = [];
    }

    // on mousemove event during the drag mode
    // if copy is true the object will not have the attribute from addOnDragStart function, useful to use with simulateDragStart
    static addOnDrag(el, func, copy=false)
    {
        if (!copy)
            Drag.addOnDragStart(el); // to have the base events properties
        if (typeof(el._onDrag) == "undefined")
            el._onDrag = [];
        if (func)
            el._onDrag.push(func);

        const mm = (e) => 
        {
            if (el && el.dragging)
            {
                for (const f of el._onDrag)
                    f(e, el);
            }
        }

        addEventListener("mousemove", mm);
    }

    static testDndEvent()
    {
        const tstElmt = B.newTitle("div", "This is a test drag event elmt.<br>You can try to drag it.<br>You should see some infos in the <b>console</b>.");
        const drpElmt = B.newTitle("div", "This is a test drop event elmt.<br>You can try to drop on it.<br>You should see some infos in the <b>console</b>.");

        Drag.addOnDragStart(tstElmt, () => console.log("Drag started."));
        Drag.addOnDrag(tstElmt, (me, elmt) => console.log("Dragging : " + elmt + " " + elmt.dragging));
        Drag.addOnDragEnd(tstElmt, () => console.log("Drag ended."));
        Drag.addOnDrop(drpElmt, (me, dropped) => console.log("Dropped : " + dropped));
    }

    dragStart (e) 
    {
        if (e.type === "touchstart")
        {
            this.initialX = e.touches[0].clientX - this.xOffset;
            this.initialY = e.touches[0].clientY - this.yOffset;
        } 
        else
        {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
        }

        this.el.activeDrag = true;
        this.el.style.cursor = "grabbing"
    }

    dragEnd(e)
    {
        this.initialX = this.currentX;
        this.initialY = this.currentY;
        this.el.activeDrag = false;
        this.el.style.cursor = "grab"
    }

    drag(e)
    {
        if (this.el.activeDrag)
        {
            e.preventDefault();
          
            if (e.type === "touchmove") {
              this.currentX = e.touches[0].clientX - this.initialX;
              this.currentY = e.touches[0].clientY - this.initialY;
            } else {
              this.currentX = e.clientX - this.initialX;
              this.currentY = e.clientY - this.initialY;
            }

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.setTranslate(this.currentX, this.currentY, this.el); 
        }

    }

    setTranslate(x,y,el)
    {
        el.style.transform = "translate3d(" + x + "px, " + y + "px, 0px)";
    }

    static cancel (e)
    {
        if (e.key === "Escape")
        {
            for (let el of document.getElementsByClassName("draggable"))
            {
                el.activeDrag = false
                el.style.cursor = "grab";
            }
        }
    }

    static createADraggableCopy(htmlelmt, me, copyParent=B)
    {
        if (!htmlelmt)
            throw "htmlelmt in null - Drag.copyOnDrag";
        const copy = htmlelmt.cloneNode(true);
        B.appendChild(copy);

        copy.classList.add("draggable");
        copy.style.left = (me.clientX-50) + "px";
        copy.style.top = (me.clientY-50) + "px";

        Drag.simulateDragStart(copy);
        Drag.addOnDrag(copy, (me) => 
            {
                copy.style.left = (me.clientX-50)+ "px";
                copy.style.top = (me.clientY-50) + "px";
            }, true);
        Drag.addOnDragEnd(copy, () => copy.remove());

        return copy;
    }
}

Drag.init()
