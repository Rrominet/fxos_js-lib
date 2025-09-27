class Time 
{
    static sleep (ms)
    {
        return new Promise(function (resolve, reject)
        {
            setTimeout(function () {resolve(0)}, ms);
        });
    }

    static getTime (str)
    {   
        str = str.replace(/\./g, "");
        let tmp = str.split(" "); 
        if (tmp.length<2)
        {
            return new Date(str);
        }

        let d = tmp[0]; 
        let m = "Jan";

        if (tmp[1] == "JANV")
            m = "Jan";
        else if (tmp[1] == "FÉVR")
            m = "Feb";
        else if (tmp[1] == "MARS")
            m = "Mar";
        else if (tmp[1] == "AVR")
            m = "Apr";
        else if (tmp[1] == "MAI")
            m = "May";
        else if (tmp[1] == "JUIN")
            m = "Jun";
        else if (tmp[1] == "JUIL")
            m = "JUIL";
        else if (tmp[1] == "AOÛT")
            m = "Aug";
        else if (tmp[1] == "SEPT")
            m = "Sep";
        else if (tmp[1] == "OCT")
            m = "Oct";
        else if (tmp[1] == "NOV")
            m = "Nov";
        else if (tmp[1] == "DÉC")
            m = "Dec";

        let da = new Date (); 
        let y = da.getFullYear(); 
        let date = new Date(d + " " + m + " " + y);
        return date;
    }

    //format could be classic or letters
    static readableFromSecs(seconds, format="classic")
    {
        let hours = 0;
        let min = 0;
        let sec = 0;

        hours = parseInt(seconds/3600);

        min = parseInt((seconds-hours*3600)/60);

        sec = parseInt(seconds%60);

        sec = sec.toString().padStart(2, '0');;
        min = min.toString().padStart(2, '0');;
        hours = hours.toString().padStart(2, '0');;

        if (sec == "NaN" || min == "NaN" || hours == "NaN")
        {   
            if (format == "classic")
                return "00:00:00";
            else if (format == "letters")
                return "0 secondes";
        }

        if (format == "classic")
            return hours + ":" + min + ":" + sec;
        else if (format == "letters")
        {
            let _r = "";
            if (hours != "00" && hours != "NaN")
                _r += hours + " h, ";
            if (min != "00" && min != "NaN")
                _r += min + " min, ";
            if (sec != "00" && sec != "NaN")
                _r += sec + "s";
            return _r
            
        }
    }

    static readableFromMiliSecs(miliseconds)
    {
        return Time.readableFromSecs(miliseconds/1000);
    }
}

try{
module.exports = Time;
}catch(e){}
