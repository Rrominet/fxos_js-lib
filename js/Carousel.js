class Carousel
{
    /**
    *
    *
    * @param {HTMLElement} elmt
    * @param {Object} options
    * @param {Object} options.slidesToScroll Nb d'elmts à faire défiler
    * @param {Object} options.slidesVisible Nb d'elmts visible dans un slide
    * @param {boolean} options.loop Doit on boucler en fin de slide
    */
    constructor (elmt, options = {}, exist = false)
    {
        this.elmt = elmt;
        this.children = [].slice.call(elmt.children);
        this.isMobile = false;
        this.currentItem = 0;
        this.options = Object.assign({}, 
        {
            slidesToScroll : 1,
            slidesVisible : 1,
            loop : false
        }, options);

        if (!exist)
        {
            this.root = this.createDivWithClass('carousel');
            this.container = this.createDivWithClass('carouselContainer');
            this.root.appendChild(this.container);
            this.root.setAttribute('tabindex', '0');
            this.elmt.appendChild(this.root);

            let items = []

            for (let c of this.children)
            {
                let item = this.createDivWithClass("carouselItem");
                item.appendChild(c);
                items.push(item);
                this.container.appendChild(item);
            }

            this.children = items;

            this.setStyle();
            this.createNavigation();
            this.onWindowResize();

            // set visibility // 
            for (let ind= 0; ind<this.children.length; ind++)
            {
                if (ind!==0)
                {
                    this.children[ind].style.opacity = 0;
                }

                else 
                {
                    this.children[ind].style.opacity = 1;
                }
            }
        }

        else
        {
            this.setExistingCarousel(elmt);
        }   

        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.root.addEventListener('keyup', e=>
        {
            if (e.key === 'ArrowRight' || e.key === "Right")
                this.next();
            

            else if (e.key === 'ArrowLeft' || e.key === "Left")
                this.prev();
        })
    
    }

    setExistingCarousel (elmt)
    {
        this.root = document.getElementsByClassName("carousel")[0];
        this.container = document.getElementsByClassName("carouselContainer")[0];
        this.children = document.getElementsByClassName("carouselItem");
        this.nextButton = document.getElementsByClassName("carouselNext")[0];
        this.prevButton = document.getElementsByClassName("carouselPrev")[0];

        this.nextButton.onclick =this.next.bind(this);
        this.prevButton.onclick =this.prev.bind(this);
    }

    setStyle ()
    {
        let ratio = this.children.length / this.slidesVisible;
        this.container.style.width = (ratio * 100) + "%";

        for (let c of this.children)
        {
            c.style.width = ((100/ this.slidesVisible) / ratio) + "%";
        }
    }

    createNavigation () 
    {
        this.nextButton = this.createDivWithClass("carouselNext");
        this.prevButton = this.createDivWithClass("carouselPrev");
        this.root.append (this.nextButton);
        this.root.append (this.prevButton);

        this.nextButton.onclick =this.next.bind(this);
        this.prevButton.onclick =this.prev.bind(this);
    }

    next () 
    {
        this.goToItem (this.currentItem + this.slidesToScroll);
    }

    prev() 
    {
        this.goToItem (this.currentItem - this.slidesToScroll);
    }

    goToItem (i)
    {
        if (i<0)
        {
            i = this.children.length - this.options.slidesVisible;
        }

        else if (i>= this.children.length || (this.children[this.currentItem + this.options.slidesVisible] === undefined && i>this.currentItem))
        {
            i = 0;
        }

        let translateX = i*-100/this.children.length;
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)';
        this.currentItem = i;

        for (let ind= 0; ind<this.children.length; ind++)
        {
            if (ind!==i)
            {
                this.children[ind].style.opacity = 0;
            }

            else 
            {
                this.children[ind].style.opacity = 1;
            }
        }

        if (location.href.includes(".html") || location.href.includes("proposition-commerciale"))
        {
            if(!location.href.includes("index.html"))
                window.scrollTo(0,0);
        }
    }

    createDivWithClass (className) 
    {
        let div = document.createElement("div");
        div.className = className; 
        return div;
    }

    onWindowResize () 
    {
        let mobile = window.innerWidth <800;

        if (mobile !==  this.isMobile)
        {
            this.isMobile = mobile ; 
            this.setStyle();
        }
    }

    get slidesToScroll () 
    {
        if (this.isMobile)
            return 1; 
        else 
            return this.options.slidesToScroll;
    }

    get slidesVisible () 
    {
        if (this.isMobile)
            return 1; 
        else 
            return this.options.slidesVisible;
    }
}
