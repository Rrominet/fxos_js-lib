const COLOR = 1; 
const BACKGROUND_COLOR = 2;

class Color
{
	constructor (r=0, g=0, b=0, a=1)
	{
		if (r>1)
			r = parseFloat(r/255);
		if (g>1)
			g = parseFloat(r/255);
		if (b>1)
			b = parseFloat(r/255);
		if (a>1)
			a = parseFloat(r/255);

		this.r = r; 
		this.g = g; 
		this.b = b;
		this.a = a;
	}

	// css string could be "rgb(#,#,#)"
	// css string could be "#ad0055042"
	// css string could be "red"
	static createFromCss(cssString)
	{
		let css = cssString; 
		if (css.includes("(") && css.includes(")"))
		{
			let tmp = rgb.split('('); 
			tmp[1] = tmp[1].replace(")", ""); 
			let tmp2 = tmp[1].split(","); 

			let r = parseInt(tmp2[0]); 
			let g = parseInt(tmp2[1]); 
			let b = parseInt(tmp2[2]); 
			let a = 0;
			if (tmp2.legth>3)
				a = parseInt(tmp2[3]);

			return new Color(r,g,b,a);
		}

		else if (css.includes("#"))
		{
			let res = Color.hexToRgb(css);
			if (res) 
				return new Color(res.r, res.g, res.b, res.a);
			else
				return new Color;
		}
	}

	static generateRgb(minr, maxr, ming, maxg, minb, maxb, mina=255, maxa=255)
	{
		minr = parseFloat(minr/255.0);
		maxr = parseFloat(maxr/255.0);
		ming = parseFloat(ming/255.0);
		maxg = parseFloat(maxg/255.0);
		minb = parseFloat(minb/255.0);
		maxb = parseFloat(maxb/255.0);
		mina = parseFloat(mina/255.0);
		maxa = parseFloat(maxa/255.0);

		return Color.generateRgbFromFloat(minr, maxr, ming, maxg, minb, maxb, mina, maxa);
	}

	static generateRgbFromFloat(minr, maxr, ming, maxg, minb, maxb, mina=1, maxa=1)
	{
		let c = new Color; 

		c.r = randomFloat(minr, maxr);
		c.g = randomFloat(ming, maxg);
		c.b = randomFloat(minb, maxb);
		c.a = randomFloat(mina, maxa);

		return c
	}

	static generate(min, max, mina=255, maxa=255)
	{
		return Color.generateRgb(min, max, min, max, min, max, mina, maxa);
	}

	static componentToHex(c) 
	{
	  let hex = c.toString(16);
	  return hex.length == 1 ? "0" + hex : hex;
	}

	//(0-255 int)
	static rgbToHex(r, g, b, a=0) 
	{
	  return "#" + Color.componentToHex(r) + Color.componentToHex(g) + Color.componentToHex(b) + Color.componentToHex(a);
	}

	static hexToRgb(hex) 
	{
        if (hex.includes("#"))
            hex = hex.slice(1);

        const _r = {};

        _r.r = parseInt(hex.slice(0, 2), 16);
        _r.g = parseInt(hex.slice(2, 4), 16);
        _r.b = parseInt(hex.slice(4, 6), 16);
        if (hex.length>6)
            _r.a = parseInt(hex.slice(6, 8), 16);
        else 
            _r.a = 255;

        for (let k in _r)
        {
            _r[k] = parseFloat(_r[k]);
            _r[k] = _r[k]/255.0;
        }

        return _r;

	}

	//elmt is a dom elmt
	applyTo(elmt, type = COLOR)
	{
		if (type == COLOR)
			elmt.style.color = this.toCss();
		else if (type == BACKGROUND_COLOR)
			elmt.style.backgroundColor = this.toCss();
	}

	toCss()
	{
		let css = "rgba(";
		css += parseInt(this.r*255) + ",";
		css += parseInt(this.g*255) + ",";
		css += parseInt(this.b*255) + ",";
		css += this.a + ")";

		return css;
	}

    asCss()
    {
        return this.toCss();
    }
}
