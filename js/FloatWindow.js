class FloatWindow
{
	constructor(title="")
	{
		this.setBase();
		if (title!="")
		{
			this.frame.container.pTitle = document.createElement("div"); 
			this.frame.container.pTitle.classList.add("titles");
			this.frame.container.pTitle.innerHTML = title; 
			this.frame.container.appendChild(this.frame.container.pTitle);
		}

		this.hide();

	}

	setBase()
	{
		this.cache = document.createElement("div"); 
		this.cache.classList.add("windows");
		this.cache.classList.add("caches");

		document.body.appendChild(this.cache);
		
		this.frame = document.createElement("div"); 
		this.frame.classList.add("windows");
		this.frame.classList.add("frames");

		this.cache.appendChild(this.frame);

		this.frame.close = document.createElement("button"); 
		this.frame.close.classList.add("closes");
		this.frame.close.innerHTML = "<img class='closes' src='https://pictures.motion-live.com/images/cross.png' alt='Fermer' style='filter: invert(100%);'>";
		this.frame.close.onclick = this.hide.bind(this);
		this.frame.appendChild(this.frame.close);

		this.frame.container = document.createElement("div"); 
		this.frame.container.classList.add("containers");
		this.frame.appendChild(this.frame.container);

	}

	show() 
	{
		if (this.cache.hidden)
			this.cache.hidden = false;
		// setTimeout(this.setMouseEvents.bind(this), 1000);
	}

	hide()
	{
		if (!this.cache.hidden)
			this.cache.hidden = true;

		// removeEventListener("click", this.onDocClick.bind(this));
	}

	onDocClick()
	{
		if (!this.in)
			this.hide();
	}

	setMouseEvents() 
	{
		this.frame.onmouseenter = function () 
		{
			this.in = true;
		}.bind(this);

		this.frame.onmouseleave = function () 
		{
			this.in = false;
		}.bind(this);

		addEventListener("click", this.onDocClick.bind(this));
	}
}

function floatWindow(title = "", fullHeight = false, fullWidth = false)
{
	let w = new FloatWindow(title); 
	if (fullHeight)
		w.frame.classList.add("fullHeights");
	if (fullWidth)
		w.frame.classList.add("fullWidths")
	return w;
}