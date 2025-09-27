window.mouseScreenX = 0;
window.mouseScreenY = 0;
window.mouseX = 0;
window.mouseY = 0;

window.mvtX = 0;
window.mvtY = 0;

window.inactive=false;

// time in seconds
window.timeToBeInactiv = 30;

window.toExecOnReactive = [];
window.toExecOnInactive = [];

// time in seconds
window.timeSinceInactiviy = 0;
window.maxActiveTime = 0;
window.inactiveTimeout = false;

const mm = (e) =>
    {
        if (e.touches) e=e.touches[0];
        window.mouseScreenX = e.clientX;
        window.mouseScreenY = e.clientY; 
        window.mouseX = e.clientX + window.scrollX; 
        window.mouseY = e.clientY + window.scrollY;
        window.mvtX = e.movementX;
        window.mvtY = e.movementY;
    };

B.addEventListener("mousemove", (e) => mm(e));
B.addEventListener("touchstart", (e) => mm(e));
B.addEventListener("touchmove", (e) => mm(e));

window.clearOnReactiveEventListener = function (){window.toExecOnReactive = [];}
window.clearOnInactiveEventListener = function (){window.toExecOnInactive = [];}

window.addOnActiveEvent = function (f)
{
    this.toExecOnReactive.push(f);
}

// length of the inactivy in seconds
// WARNING : for now it work only if you call it one time !
window.addOnInactiveEvent = function (f, length)
{
    this.maxActiveTime = length;
    this.toExecOnInactive.push(f);
    this.setInactiveTimeout();
}

window.setInactiveTimeout = function ()
{
    const func = () => 
    {
        if (this.timeSinceInactiviy< this.maxActiveTime) 
        {
            setTimeout(func, this.maxActiveTime * 1005);
        }
        else 
        {
            this.inactiveTimeout = false;
            this.doOnInactive();
        }
    }
    setTimeout(func, this.maxActiveTime * 1005);
    this.inactiveTimeout = true;
}

window.doOnInactive = function()
{
    for (const f of this.toExecOnInactive)
        f();
    this.timeSinceInactiviy = 0;
}

window.doOnActive = function()
{
    if (this.timeSinceInactiviy >= this.maxActiveTime)
    {
        for (const f of this.toExecOnReactive)
            f();
    }
    this.timeSinceInactiviy = 0;
    if (!this.inactiveTimeout)
    {
        this.setInactiveTimeout();
    }
}

window.trackInactivity = function()
{
    B.addEventListener("mousemove", () => this.doOnActive());
    B.addEventListener("click", () => this.doOnActive());
    B.addEventListener("keydown", () => this.doOnActive());
}

window.stopInactivityTrack = function ()
{
    this.clearInterval(this.activityInterval);
}
