class animations
{
    static load()
    {
        return scripts.import(FM + "js/tweens.js");
    }

    // res is an object with {attrtoAnimation : valueAtThe animation end}
    // time in miliseconds
    static animate(obj, res, time, onFinished=null, onUpdate=null, easing=TWEEN.Easing.Quadratic.InOut)
    {
        let _r = new TWEEN.Tween(obj)
            .to(res, time)
            .easing(easing)
            .onComplete(() => {if (onFinished) onFinished();});

        if (onUpdate)
            _r.onUpdate((res) => onUpdate(_r, res));

        _r.start();
        return _r;
    }
}
