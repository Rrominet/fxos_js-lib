window.onHide = [];
window.onShow = [];

HTMLDocument.prototype.addOnShow = function (f)
{
    window.onShow.push(f);
}

HTMLDocument.prototype.addOnHide = function (f)
{
    window.onHide.push(f);
}

document.addEventListener("visibilitychange", () => 
    {
        if (document.visibilityState == "visible")
        {
            for (const f of window.onShow)
                f();
        }
        else 
        {
            for (const f of window.onHide)
                f();
        }
    });
