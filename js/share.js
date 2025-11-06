class share
{
    static facebook(text, purl="")
    {
        let  url = "https://www.facebook.com/sharer.php?";
        url +="quote=" + encodeURIComponent(text) + "&";
        url += "u=" + encodeURIComponent(purl);

        window.open(url, "", "width=480,height=280");
    }

    static linkedin(purl="")
    {
        let  url = "https://www.linkedin.com/sharing/share-offsite/?";
        url += "url=" + encodeURIComponent(purl);

        window.open(url, "", "width=480,height=380");
    }

    static twitter(text, purl="")
    {
        let url = "https://twitter.com/intent/tweet?";
        url +="text=" + encodeURIComponent(text) + "&";
        url += "url=" + encodeURIComponent(purl);

        window.open(url, "", "width=480,height=280");
    }

    static tumblr(purl="")
    {
        let  url = "https://www.tumblr.com/widgets/share/tool?";
        url += "shareSource=legacy&posttype=link";
        url += "canonicalUrl=" + encodeURIComponent(purl);

        window.open(url, "", "width=480,height=380");
    }
}
