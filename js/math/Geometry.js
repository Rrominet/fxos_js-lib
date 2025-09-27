class Geometry
{
    // bounds are object that represent a box with downLeft, upLeft, upRight and downRight attr
    // return the offet between to bounds.
    static boundsOffset(bounds1, bounds2)
    {
        const attrs = ["downLeft", "downRight", "upLeft", "upRight"];
        const _r = {};
        for (const key in bounds2)
        {
            if (!attrs.includes(key))
                continue;
            _r[key] = this.pointOffset(bounds1[key], bounds2[key]);
        }
        return _r;
    }

    //p1 and p2 are 2 coord point like {x : 0, y : 0}
    static pointOffset(p1, p2)
    {
        const _r = {};
        _r.x = p2.x-p1.x;
        _r.y = p2.y-p1.y;
        return _r;
    }
   
}

// TEST file and exec //
if (location.href.includes('http://localhost/'))
{
    importScripts([
        mkJs(FM + "/js/test.js"),
        mkJs("http://localhost/motion-live/frameworks/js/math/Geometry_test.js"),
    ]);
}
