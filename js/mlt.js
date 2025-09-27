window.mlt = {}; 

// cb is a callbak func who takes the compte object in params
mlt.compte = function(email, cb)
{
    const xhr = HttpRequest();
    const params = [["func", "compte"], ["email", email]];
    const func = function (xhr)
    {
        cb(new mltCompte(JSON.parse(xhr.responseText)));
    };

    xhr.sendListAsPost(MLT + "/ajax.php", params, func);
}

class mltCompte
{
    //data is a json from functions.php
    constructor(data)
    {
        this.email = data.email;
        this.prenom = data.prenom;
        this.formationsIndex = data.formationsIndex;
        this.inscriptionDate = data.inscriptionDate; 
        this.password = data.password; 
    }

    //cb takes the xhr
    sendEmail(object, body, cb)
    {
        const xhr = HttpRequest();
        const params = [
            ["func", "email"],
            ["email", this.email],
            ["object", object],
            ["body", body],
        ];

        xhr.sendListAsPost(MLT + "/ajax.php", params, cb);
    }
}
