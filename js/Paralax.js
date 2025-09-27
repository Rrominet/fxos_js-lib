class Paralax
{
    // the elmt need to be fixed !
    static make(elmt, power)
    {
        elmt.paralaxPower = power;
        elmt.intialTop = parseInt(elmt.style.marginTop);
        if (!elmt.intialTop)
            elmt.intialTop = 0;
        elmt.intialLeft = parseInt(elmt.style.marginLeft);
        if (!elmt.intialLeft)
            elmt.intialLeft = 0;

        addEventListener("scroll", () => Paralax.onScroll(elmt));
    }

    static onScroll(elmt)
    {
        elmt.style.marginTop = (-scrollY * elmt.paralaxPower + elmt.intialTop) + "px";
        elmt.style.marginLeft = (-scrollX * elmt.paralaxPower + elmt.intialLeft) + "px";
    }
}
