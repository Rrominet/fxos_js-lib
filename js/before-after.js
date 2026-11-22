class BeforeAfter
{
	// img1 and img1 as string for images src
	constructor (img1, img2, afterNode)
	{
		this.css();
		this.img1 = document.createElement("img");
		this.img1.src = img1;
		this.img1.classList.add("ba-befores");

		this.img2 = document.createElement("img");
		this.img2.src = img2;
		this.img2.classList.add("ba-afters");

		this.container = document.createElement("div"); 
		this.container.classList.add("ba-containers");

		this.container.appendChild(this.img1);
		this.createInterface();

		this.container.appendChild(this.img2);

		this.msDown = false;

		afterNode.parentNode.insertBefore(this.container, afterNode);

		window.addEventListener("load", this.resize.bind(this));
		window.addEventListener("resize", this.resize.bind(this));
		window.addEventListener("load", function () 
		{
			this.drag(200);
		}.bind(this));
	}

	css()
	{
		newCss(FM + "/css/before-after-style.css");
	}

	createInterface() 
	{
		this.line = document.createElement("div"); 
		this.line.classList.add("ba-interfaces");
		this.line.classList.add("ba-lines");

		this.line.taker = document.createElement("div");
		this.line.taker.classList.add("ba-interfaces");
		this.line.taker.classList.add("ba-takers");

		for (let i=0; i<4; i++)
		{
			let dot = document.createElement("div"); 
			dot.classList.add("ba-dots"); 
			this.line.taker.appendChild(dot);
		}

		this.line.appendChild(this.line.taker); 
		this.container.appendChild(this.line);

		this.container.onmousemove = function (event) 
		{
			this.onMouseMove(event);
		}.bind(this);

		this.img1.onmousemove = function (event) 
		{
			this.onMouseMove(event);
		}.bind(this);

		this.line.onmousemove = function (event) 
		{
			this.onMouseMove(event);
		}.bind(this);

		this.line.taker.onmousemove = function (event) 
		{
			this.onMouseMove(event);
		}.bind(this);

		this.container.ontouchstart = function (event) 
		{
			this.onMouseMove(event, true);
		}.bind(this);

		this.img1.ontouchstart = function (event) 
		{
			this.onMouseMove(event, true);
		}.bind(this);

		this.line.ontouchstart = function (event) 
		{
			this.onMouseMove(event, true);
		}.bind(this);

		this.line.taker.ontouchstart = function (event) 
		{
			this.onMouseMove(event, true);
		}.bind(this);

		this.container.ontouchmove = function (event) 
		{
			this.onMouseMove(event, true);
		}.bind(this);

		this.img1.ontouchmove = function (event) 
		{
			this.onMouseMove(event, true);
		}.bind(this);

		this.line.ontouchmove = function (event) 
		{
			this.onMouseMove(event, true);
		}.bind(this);

		this.line.taker.ontouchmove = function (event) 
		{
			this.onMouseMove(event, true);
		}.bind(this);

	}

	resize()
	{
		let w = this.container.offsetWidth; 
		let h = this.container.offsetHeight;

		this.img1.style.width =  w+ "px";
		this.line.style.width = w/200 + "px";			
		this.line.style.height =  h+ "px";

		let tLeft = this.line.taker.offsetWidth/2 - this.line.offsetWidth/2;
		this.line.taker.style.left = "-" + tLeft + "px";

		let tTop = h/2 - this.line.taker.offsetHeight/2;
		this.line.taker.style.top = tTop + "px";
	}

	onMouseMove(event, touch=false)
	{

		if (!touch)
		{
			if (event.buttons === 1)
				this.msDown = true;
			else 
				this.msDown = false;
			
			if (this.msDown)
			{
				let cursorPos = event.clientX - this.container.offsetLeft; 
				if (cursorPos<0)
					cursorPos = 0; 
				else if (cursorPos>this.container.offsetWidth)
					cursorPos = this.container.offsetWidth;

				this.drag(cursorPos);
			}
		}

		else 
		{
			let cursorPos = event.changedTouches[0].clientX - this.container.offsetLeft; 
			if (cursorPos<0)
				cursorPos = 0; 
			else if (cursorPos>this.container.offsetWidth)
				cursorPos = this.container.offsetWidth;

			this.drag(cursorPos);
		}


	}

	drag(pos)
	{
		this.line.style.marginLeft = pos + "px";

		let factor = parseFloat(pos/this.container.offsetWidth)*100.0;
		this.img2.style.clipPath = "inset(0px 0px 0px " + factor + "%)";
	}

	
}