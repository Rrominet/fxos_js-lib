onmessage = function(e)
{
    if (e.data == "perf")
        postMessage(calculPerf());
}

function calculPerf()
{
    let s = performance.now();
    for (let i=0; i<100000000; i++)
    {
        let a = Math.sqrt(42);
    }
    let e = performance.now();
    let perf = (1/(e-s));
    return perf;
}
