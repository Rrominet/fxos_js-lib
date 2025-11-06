class MultiWord
{
    // speed is the interval en seconds between 2 words
    constructor (elmt, words, speed = 2.0)
    {
        this.elmt = elmt; 
        this.words = words;
        this.index = 0;
        this.speed = speed;
        this.setStyle();
        this.setTimer();
    }

    setStyle()
    {
        if (innerWidth>840)
            this.elmt.style.minWidth = this.width() + "em";
        this.elmt.style.transition = "opacity 0.5s";
    }

    width()
    {
        let longer = "";
        for (const w of this.words)
            if (w.length > longer.length)
                longer = w;
        return parseFloat(longer.length) * 0.5;
    }

    setTimer()
    {
        this.timer = setInterval(() => this.changeWorld(), this.speed * 1000);
    }

    changeWorld()
    {
        this.index ++;
        if (this.index >= this.words.length)
            this.index = 0;
        this.elmt.style.opacity = 0;
        setTimeout(() => 
            {
                this.elmt.innerHTML = this.words[this.index];
                this.elmt.style.opacity = 1;
            }, 500);
    }
}
