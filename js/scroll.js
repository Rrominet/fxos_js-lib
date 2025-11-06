// need time.js module
HTMLElement.prototype.scrollToEnd = async function(callback=null)
{
    let prev = -10;
    let sy = this.scrollTop;
    while (true)
    {
        this.scroll(0, 100000);
        await Time.sleep(1000);

        sy = this.scrollTop; 
        if (sy<=prev)
            break;
        prev = sy;
    }

    if (callback)
        callback();
}
