HTMLElement.prototype.createLoader = function ()
{
    const loader = this.newNode("div", "loader");
    for (let i=0; i<4; i++)
        loader.newNode("div");
    return loader;
}
HTMLElement.prototype.newLoader = HTMLElement.prototype.createLoader;


// remove the content (but keep it in the attr oldHTML)
// and crate a loader instead
HTMLElement.prototype.mkLoading = function(disable=true)
{
    this.oldHTML = this.innerHTML;
    this.innerHTML = "";
    this.createLoader();
    if (disable)
        this.disabled = true;
}
HTMLElement.prototype.makeLoading = HTMLElement.prototype.mkLoading;

HTMLElement.prototype.stopLoading = function()
{
    this.innerHTML = this.oldHTML;
    this.removeAttribute("oldHTML");
    if (this.disabled)
        this.disabled = false;
}
