
// f take one arg an event object {direction, ...}
SWIPE_LEFT = 1;
SWIPE_RIGHT = 2;
HTMLElement.prototype.addOnSwipe = function (f)
{
    if (!this._onswipe)
    {
        this._onswipe = [];
        this._swipex = null;
        this.addEventListener("touchstart", (e) => 
            {
                this._swipex = e.changedTouches[0].clientX;
            });
        this.addEventListener("touchend", (e) => 
            {
                if (!this._swipex)
                    return;

                let x = e.changedTouches[0].clientX;
                let diff = x-this._swipex;

                const ce = {};

                ce.size = diff;
                if (diff<-10)
                    ce.direction = SWIPE_RIGHT;
                else if (diff >10)
                    ce.direction = SWIPE_LEFT;
                else 
                    return;

                for (const f of this._onswipe)
                    f(ce);
            })
    }
    this._onswipe.push(f);
}

function distFromTouches(touches)
{
    if (touches.length<2)
        return 0;

    let dx = touches[1].clientX-touches[0].clientX;
    let dy = touches[1].clientY-touches[0].clientY;

    return Math.sqrt(dx*dx+dy*dy);
}

HTMLElement.prototype.addOnZoom = function (f)
{
    this._oldZoomEvent = null;
    this.addEventListener("touchstart", (e) => 
        {
            if (e.touches.length > 1)  
            {
                e.preventDefault();
                this._oldZoomEvent = e;
            }
        }, { passive: false });

    this.addEventListener("touchmove", (e) => 
        {
            if (e.touches.length > 1)  
            {
                e.preventDefault();
                if (!this._oldZoomEvent)
                {
                    this._oldZoomEvent = e;
                    return;
                }

                const oldDist = distFromTouches(this._oldZoomEvent.touches);
                const newDist = distFromTouches(e.touches);
                this._oldZoomEvent = e;

                f(newDist-oldDist);
            }
        }, { passive: false });

    
    this.addEventListener("touchend", (e) => 
        {
            this._oldZoomEvent = null;
        });
}
