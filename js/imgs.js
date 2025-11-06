class imgs
{
    // for now only one image
    // cb take the image as a file object
    static chooseOnComputer(cb)
    {
        const input = D.createElement("input");
        input.type = "file";
        input.click();
        input.addEventListener("change", () => 
            {
                cb(input.files[0]);
            });
    }

    static asFile(uri, filename="unnamed")
    {
        const [metadata, data] = uri.split(",");
        if (!metadata.includes("base64")) {
            throw new Error("Input URI is not base64 encoded.");
        }
        const type = metadata.match(/:(.*?);/)[1];
        const decoded = atob(data);
        const buffer = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++)
            buffer[i] = decoded.charCodeAt(i);

        return new File([buffer], filename, { type });
    }

    //onRes is a func execututed on the converted image in url format
    static convertedFromFile(file, format, quality, onRes)
    {
        const url = URL.createObjectURL(file);
        imgs.converted(url, format, quality, onRes);
    }

    //onRes is a func execututed on the converted image in url format
    static converted(url, format, quality, onRes)
    {
        imgs.scaled(url, 1.0, (canvas) => 
            {
                 onRes(imgs.convertedFromCanvas(canvas, format, quality));
            });
    }

    static convertedFromCanvas(canvas, format, quality)
    {
        return canvas.toDataURL("image/" + format, quality);
    }

    static scaledFromFile(file, factor, onRes)
    {
        const url = URL.createObjectURL(file);
        imgs.scaled(url, factor, onRes);
    }

    // onRes take the canvas as arg
    static scaled(url, factor, onRes)
    { 
        const _n = imgs._canvasNImg(url);
        _n.img.onload = () => 
        {
            onRes(imgs._scaled(_n.img, _n.canvas, _n.canvas.ctx, factor));
        }
    }

    static _scaled(loadedImg, canvas, ctx, factor)
    {
        canvas.width = parseInt(loadedImg.width * factor);
        canvas.height = parseInt(loadedImg.height * factor);
        ctx.drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
        return canvas;
    }

    //onRes is actually on the canvas wich contains the images
    //you can access the ctx with canvas.ctx
    static scaledW(url, width, onRes)
    {
        const _n = imgs._canvasNImg(url);
        _n.img.onload = () => 
        {
            const factor = width/_n.img.width;
            onRes(imgs._scaled(_n.img, _n.canvas, _n.canvas.ctx, factor));
        }
    }

    //onRes is actually on the canvas wich contains the images
    //you can access the ctx with canvas.ctx
    static scaledH(url, height, onRes)
    {
        const _n = imgs._canvasNImg(url);
        _n.img.onload = () => 
        {
            const factor = height/_n.img.height;
            onRes(imgs._scaled(_n.img, _n.canvas, _n.canvas.ctx, factor));
        }
    }

    static _canvasNImg(url)
    {
        const canvas = D.createElement("canvas");
        canvas.ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = url;

        return {canvas, img};
    }

}
