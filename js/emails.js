class emails
{
    static host()
    {
        return "https://emails.motion-live.com";
    }
    //person = {nom (optional), prenom, email}
    //tag = postmark tag
    //variables = {*variable1*: value1, *variable2*: value2}
    static send(person, emailtpl, tag, variables, from="romain.gilliot@motion-live.com")
    {
        const data = {};
        data.nom = person.nom;
        data.prenom = person.prenom;
        data.to = person.email;
        data.from = from;
        data["email-tpl"] = emailtpl;
        data.tag = tag;
        for (const variable in variables)
            data[variable] = variables[variable];
        console.log(data);
        const xhr = HttpRequest();

        return new Promise((resolve) =>
        {
            const cb = (xhr) =>
            {
                try
                {
                    const res = JSON.parse(xhr.responseText);         
                    resolve(res);
                }catch (e)
                {
                    resolve({"success": false, "message" : e}); 
                }
            }
            xhr.sendJsonAsPost(emails.host() + "/send", data, cb);
        });
    }
}
