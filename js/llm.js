if (location.href.includes('localhost'))
    window.llm_url = "http://localhost:11111";
else
    window.llm_url = "https://ai.motion-live.com";

class llm
{
    static ask(input, context = "", previous_messages = [])
    {
        const xhr = HttpRequest();
        const messages = [...previous_messages];
        messages.push({role: "user", content: input});

        const data = {
            messages: messages,
            email: email()
        };

        if (context != "")
            data.context = context;

        return new Promise((resolve, reject) =>
            {
                xhr.sendJsonAsPost(window.llm_url + "/send", data, (xhr) =>
                    {
                        try
                        {
                            console.log(xhr.responseText);
                            const res = JSON.parse(xhr.responseText);
                            console.log(res);
                            if (!res.success)
                            {
                                reject(res.message);
                                return;
                            }

                            let r = "";

                            if ("data" in res)
                            {
                                for (const m of res.data)
                                {
                                    if (m.type == "text")
                                    {
                                        r += m.text + "\n";
                                        console.log(r);
                                    }
                                }
                            }

                            console.log(r);

                            resolve(r);
                        }
                        catch (e)
                        {
                            reject(e);
                        }
                    });
            });
    }}
