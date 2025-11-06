if (typeof(window.ML) != "undefined")
{

}
else 
{
    window.ML = ""; 
    window.FM = "";
    window.MLT = "";
    window.MLP = "";
    window.SW = "";
    window.MLT_FORUM = "";
    window.LPQFLV = ""; 
    window.H3D2 = ""; 
    window.HAL_URL = ""; 


    if (location.href.includes("localhost/") ||
        location.href.includes("caisse-epargne.fr") || 
        location.href.includes("192.168") || 
        location.href.includes("s22958608.onlinehome-server.info/"))
    {
        if ((location.href.includes("localhost") || location.href.includes("caisse-epargne.fr")))
            ML = location.href.split(":")[0] + "://localhost/motion-live"; 
        else if (location.href.includes("192.168"))
        {
            let ip = location.origin.split("://")[1];
            ML = "http://" + ip + "/motion-live"; 
        }
        else if (location.href.includes("s22958608.onlinehome-server.info/"))
            ML = "http://s22958608.onlinehome-server.info/motion-live";

        if (location.href.includes("https") && !ML.includes("https"))
            ML = ML.replace("http", "https");

        MLT = ML + "/site-teach";
        H3D2 = MLT + "/h3d2";
        MLP = ML + "/site-pictures";
        MLT_FORUM = MLT + "/forum";
        FM = ML + "/frameworks";

        LPQFLV = ML + "/softwares/lpqflv"; 
        SW = ML + "/spacewarp";
        SWP = ML + "/progress/sites/spacewarp";
        HAL_URL = "http://localhost:8888";
    }

    else
    {
        ML = "motion-live.com"; 
        MLT = "teach.motion-live.com"; 
        H3D2 = "h3d2.school"; 
        MLP = "pictures.motion-live.com";
        MLT_FORUM = "forum.teach.motion-live.com"; 
        LPQFLV = "lpqflv.com"; 
        SW = "spacewarp.fr";
        SWP = "progress.spacewarp.fr";
        HAL_URL = "hal.motion-live.com";

        if (location.href.includes(ML))
            FM = ML + "/frameworks";
        if (location.href.includes(MLT))
            FM = MLT + "/frameworks"; 
        if (location.href.includes(MLP))
            FM = MLP + "/frameworks";
        if (location.href.includes(MLT_FORUM))
            FM = MLT_FORUM + "/frameworks";
        if (location.href.includes(LPQFLV))
            FM = LPQFLV + "/frameworks";
        if (location.href.includes(H3D2))
            FM = H3D2 + "/frameworks";
        if (location.href.includes(SWP))
            FM = SWP + "/frameworks";
        if (location.href.includes(SW))
            FM = SW + "/frameworks";

        ML  = "https://" + ML ; 
        MLT  = "https://" + MLT ; 
        H3D2  = "https://" + H3D2 ; 
        MLP  = "https://" + MLP ;
        MLT_FORUM  = "https://" + MLT_FORUM ; 
        LPQFLV  = "https://" + LPQFLV ; 
        SW  = "https://" + SW ;
        SWP  = "https://" + SWP ;
        HAL_URL  = "https://" + HAL_URL ;
        FM  = "https://" + FM ;
    }

    if (location.href.includes("dev-"))
    {
        ML = ML.replace("https://", "https://dev-");
        MLT = MLT.replace("https://", "https://dev-");
        H3D2 = H3D2.replace("https://", "https://dev-");
        MLP = MLP.replace("https://", "https://dev-");
        MLT_FORUM = MLT_FORUM.replace("https://", "https://dev-");
        LPQFLV = LPQFLV.replace("https://", "https://dev-");
        SW = SW.replace("https://", "https://dev-");
        SWP = SWP.replace("https://", "https://dev-");
        HAL_URL = HAL_URL.replace("https://", "https://dev-");
        FM = FM.replace("https://", "https://dev-");
    }
}

if (typeof(Paths) == "undefined")
{
    Paths = null;
}

if (!Paths)
{
    Paths = class
    {
        static rootRemoved(path)
        {
            let tmp = path.split("public_html/"); 
            if (tmp.length>1)
                path = tmp[1];

            path = path.replace("/mnt/pc-fixe", "");
            path = path.replace("/var/www/html/", "");
            path = path.replace("http://localhost/", "");
            path = path.replace("motion-live/site-teach/", "");
            path = path.replace("motion-live/site-pictures/", "");
            path = path.replace("motion-live/", "");
            path = path.replace("https://teach.motion-live.com/", "");
            path = path.replace("https://motion-live.com/", "");
            path = path.replace("https://pictures.motion-live.com/", "");
            path = path.replace("https://h3d2.com/", "");
            path = path.replace("https://h3d2.school/", "");
            path = path.replace("https://spacewarp.fr/", "");
            return path;
        }

        static globalToLocal(global)
        {
            let local = Paths.rootRemoved(global);
            local = local.replace(/ /g, "%20");
            local = local.replace(Paths.rootRemoved(location.pathname).substr(1), "");
            return local;
        }
    }
}
