// the callback get the ip in argument
function ip(callback)
{
    if (window.IP)
    {
        callback(window.IP);
        return window.IP;
    }
    importScripts([
    mkJs(FM + "/js/HttpRequest.js")], () => 
        {
            const xhr = HttpRequest();
            const url = FM + "/php/get-ip.php";
            xhr.sendAsPost(url, null, (xhr) => {window.IP = xhr.response;
                callback(xhr.response) });
        })
}
