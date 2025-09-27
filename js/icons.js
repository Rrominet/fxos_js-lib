if (location.href.includes("file:///"))
    ICONS_PATH = "images/icons";
else 
    ICONS_PATH = MLT + "/images/icons";


class Icons
{
    static byName(name, alt="", invert=false)
    {
        let img = D.createElement("img"); 
        const tmp = name.split(".");
        if (tmp.last() == "jpg" || tmp.last() == "png" || tmp.last() == "svg" || tmp.last() == "webp")
            img.src = ICONS_PATH + "/" + name;
        else 
            img.src = ICONS_PATH + "/" + name + ".png";
        img.title = img.alt = alt;
        img.classList.add("icon");
        if (invert)
            img.classList.add("invert");

        return img;
    }

    static add(name, parent=B, alt="", invert=false)
    {
        const img = Icons.byName(name, alt, invert);
        parent.appendChild(img);
    }

    static fromName(name, alt="")
    {
        return Icons.byName(name, alt);
    }
}

