class Rect
{
	constructor (x0=0, y0=0, x1=0, y1=0)
	{
		if (x0<x1)
		{
			this.x0 = x0;
			this.x1 = x1;
		}

		else 
		{
			this.x0 = x1;
			this.x1 = x0;
		}

		if (y0<y1)
		{
			this.y0 = y0;
			this.y1 = y1;
		}

		else 
		{
			this.y0 = y1;
			this.y1 = y0;
		}
	}

	intersect (elmt)
	{
		let domRect = elmt.getBoundingClientRect();

		let v0 = [domRect.left + scrollX, domRect.top + scrollY];
		let v1 = [domRect.right + scrollX, domRect.top + scrollY];
		let v2 = [domRect.left + scrollX, domRect.bottom + scrollY];
		let v3 = [domRect.right + scrollX, domRect.bottom + scrollY];

		if (
			this.inIt(v0) || 
			this.inIt(v1) || 
			this.inIt(v2) || 
			this.inIt(v3)   ) 
			return true; 
		
		return false;
	}

	inIt(point)
	{
		if (point[0]>=this.x0 && 
			point[1]>=this.y0 &&
			point[0]<=this.x1 &&
			point[1]<=this.y1 )
			return true; 
		return false;
	}
}