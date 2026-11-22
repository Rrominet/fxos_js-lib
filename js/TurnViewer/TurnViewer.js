TURN_AJAX = FM + "/php/turnviewer.php";
class TurnViewer
{
    // folderPath from motion-live.com
    constructor(folderPath, parent, reverse=false)
    {
        this.folder = folderPath; 
        this.parent = parent; 
        this.reverse = reverse;
        this.drag = false;
        this.imgs = [];
        this.nimgs = 0;
        this.currentIndex = 0;
        this.loaded = false;
        this.onFirstLoaded = []
        this.interface(); 
        this.setEvents();
        this.onScroll()
        this.loadedHander = setInterval(() => this.checkIfAllIsLoaded(), 2500);
    }

    addOnFirstLoaded(f)
    {
        if (this.imgs.length >0 && this.imgs[0].loaded)
            f();
        else 
            this.onFirstLoaded.push(f);
    }

    interface()
    {
        this.div = this.parent.newNode("div", "turnviewer");
        this.div.style.display = "inline-block";
        this.div.load = this.div.newNode("div", "load"); 
        this.div.load.style.position = "absolute";
        this.div.load.style.zIndex = 10;
        this.div.load.style.width = "auto";
        this.addOnFirstLoaded(() => 
            {
                this.div.load.style.width = this.imgs[0].width + "px";
                this.div.load.style.transform = "translate(0px, " + (this.imgs[0].h()/2) + "px)";
            })
        this.div.progress = new ProgressBar(this.div.load, "#4a7399");
    }

    setEvents()
    {
        this.div.addEventListener("mousedown", () => {
            this.drag = true; 
            this.div.classList.add("dragging");
        });
        this.div.addEventListener("touchstart", () => {
            this.drag = true; 
            this.div.classList.add("dragging");
        });
        addEventListener("mouseup", () =>{
            this.drag = false;
            this.div.classList.remove("dragging"); 
        });
        addEventListener("touchend", () =>{
            this.drag = false;
            this.div.classList.remove("dragging"); 
        });
        this.div.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.div.addEventListener("touchmove", (e) => this.onTouchMove(e));

        addEventListener("scroll", () => this.onScroll());
    }

    onMouseMove(e)
    {
        if (!this.drag)
            return; 
        let x = e.movementX * 1.0; 
        this.printCorrectImage(x);
    }

    onTouchMove(e)
    {
    	let t = e.touches[0]; 
    	let gx = t.clientX; 
    	let left = this.div.getBoundingClientRect().x * 1.0; 
    	let x = gx-left;
    	this.printCorrectImage(x);
    }

    printCorrectImage(x)
    {
        let w = this.imgs[0].width;
        let coef = x/w; 
        let indexDiff = (this.imgs.length - 1) * coef;
        if (indexDiff<0 && indexDiff>-1)
            indexDiff = -1;
        else if (indexDiff>0 && indexDiff<1)
            indexDiff = 1;
        indexDiff = parseInt(indexDiff)
        this.currentIndex += indexDiff;
        if (this.currentIndex <0)
            this.currentIndex = this.nimgs + this.currentIndex;
        else if (this.currentIndex >= this.nimgs)
            this.currentIndex = 0 + indexDiff;
        for (let i of this.imgs)
            i.hide(); 

        if (this.imgs[this.currentIndex].loaded)
            this.imgs[this.currentIndex].show();
        else
            this.imgs[0].show();
    }

    load()
    {
        if (this.loaded)
            return;
        this.loaded = true;
        let json = {}; 
        json.func = "getImgs"; 
        json.folder = this.folder; 
        json.href = location.href;

        let func = function (xhr)
        {
            this.read(xhr); 
        }.bind(this); 

        let xhr = HttpRequest();
        xhr.sendJsonAsPost(TURN_AJAX, json, func);
    }

    checkIfAllIsLoaded()
    {
        this.unloaded = [];
        for (let i = 0; i<this.nimgs; i++)
        {
            if (!this.imgs[i].loaded)
                this.unloaded.push(i);
        }

        if (this.unloaded.length == 0)
        {
            clearInterval(this.loadedHander); 
            return;
        }

        for (let index of this.unloaded)
        {
           this.imgs[index].reload(); 
        }
    }

    onScroll()
    {
        if (this.div.onScreen())
            this.load(); 
    }

    read(xhr)
    {
        let data = JSON.parse(xhr.responseText);
        this.nimgs = data.length;
        if (!this.nimgs)
            return;
        if (this.reverse)
            data.reverse();
        for (let i of data)
        {
            this.createImg(ML + this.folder + "/" + i);
        }
        this.imgs[0].addEventListener("load", () => this.imgs[0].show());
        this.imgs[0].addEventListener("load", () => 
            {
                for (const f of this.onFirstLoaded)
                    f();
            })
    }

    createImg(src)
    {
        let i = this.div.newImg(src, "", "", true); 
        i.loaded = false;
        i.addEventListener("dragstart", (e) => e.preventDefault());
        i.addEventListener("load", () =>
            {
                i.loaded = true;
                if (!this.div.load)
                    return;
                let v = 0.0;
                v = (1.0)/this.nimgs;
                
                this.div.progress.add(v);
                if (this.div.progress.value > .99)
                {
                    this.div.load.remove();
                    this.div.load = null;
                }
            })
        this.imgs.push(i);
    }
}

