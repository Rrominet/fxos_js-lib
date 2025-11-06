// PLayer object alow you to simply play images sequences // 

class Player
{

    constructor (folder, name, length,  ext=".jpg", playing=false, sep=".", fps=24) // name sans l'extension ni l'incrementation
    {
        this.folder = folder;
        this.name = name;
        this.fps = fps;
        this.sep = sep; 
        this.length = length;

        this.ext = "";
        this.ext = ext; 
        if (!ext.includes("."))
            this.ext = "." + this.ext;

        this.frames = [];
        this.init();

        this.isPlaying = playing;
        this.currentFrame = 0;

        let object = this;

        setInterval(function () {object.nextFrame();}, 1000/fps);
    }

    init() 
    {

        this.controller = document.createElement("div"); 
        document.body.appendChild(this.controller);

        let i = 0; 
        while (i<this.length)
        {
            let frame = document.createElement("img"); 
            let incre = i; 
            frame.src = this.folder + "/" + this.name + this.sep + incre.toString() + this.ext; 
            this.frames.push(frame);
            this.controller.appendChild(frame);
            frame.style = "position:absolute; with:100%;";
            frame.hidden = true;

            i++;
        }
    }

    nextFrame()  
    {
        if (!this.isPlaying)
            return; 
        
        for (let frame of this.frames)
            frame.hidden = true;
        
        // console.log(this.currentFrame); // temp
        this.frames[this.currentFrame].hidden = false;


        if (this.currentFrame<this.frames.length - 1)
            this.currentFrame ++;
        else 
            this.currentFrame = 0;
    }

    play()
    {
        this.isPlaying = true;
    }

    pause() 
    {
        this.isPlaying = false;
    }

}