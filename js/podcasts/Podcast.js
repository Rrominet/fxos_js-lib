class Podcast
{
	constructor (url, container)
	{
		this.url = url; 

		let tmp = this.url.split("/");
		this.filename = tmp[tmp.length - 1]; 
		if (this.filename.split("_").length>1)
		{
			this.name = this.filename.split("_")[1]; 
			this.name = this.name.replace(".mp3", "");
		}
		else
		{
			this.name = "Fichier mp3 non trouvé";
		}
		this.container = container;

		this.interface();
        this.getComments();
	}

	interface() 
	{
        this.div = this.container.newNode("div", "podcast")
        this.div.newTitle("h3", this.name);
        this.div.sound = this.div.newNode("div", "sound");
        this.div.audio = this.div.sound.newNode("audio");

		this.div.audio.controls = true;
		this.div.audio.preload = "none";
		this.div.audio.source = this.div.audio.newNode("source");
		this.div.audio.source.type = "audio/mpeg";
		this.div.audio.source.src = this.url;

        const b = this.div.sound.newButton(Icons.byName("comment-white-oval-bubble"), () => this.comment.show(), "comment");
        b.children[0].title = "laisser un commentaire..." ;

        this.comment = this.div.newNode("div", "comment");
        this.comment.name = this.comment.addInput("text", "Prénom");
        this.comment.msg = this.comment.newNode("textarea");
        this.comment.send = this.comment.newButton("Envoyer", () => this.sendComment());
        this.comment.hide();

        this.comments = this.div.newNode("div", "comments");
	}

    sendComment()
    {
        this.comment.send.innerHTML = "...";
        this.addComment(this.comment.name.value, this.comment.msg.value.replace(/\n/g, "<br>"));

        const url = "ajax.php";
        const xhr = HttpRequest();

        const f = function (xhr)
        {
            if (xhr.responseText == "true") 
            {
                this.comment.send.innerHTML = "Envoyer";
                this.comment.hide();
            }
            else 
            {
                this.comment.send.innerHTML = "Erreur lors de l'envoi du commentaire... Réessayer ?";
                this.comments.lastChild.remove();
            }
        }.bind(this);

        const params = [
            ["func", "addCommentaire"],
            ["prenom", this.comment.name.value],
            ["msg", this.comment.msg.value],
            ["podcast", this.url],
        ];

        xhr.sendListAsPost(url, params, f);
    }

    addComment(prenom, msg)
    {
        const comment = this.comments.newNode("div", "read-comment") ;
        comment.newTitle("div", prenom, "prenom");
        comment.newTitle("div", msg, "msg");
    }

    getComments()
    {
        let filename = this.url.replace(/src\//g, "data/");
        filename = filename.replace(/.mp3/g, ".json");
        DistFile.read(filename, (xhr) =>
            {
                try
                {
                    const js = JSON.parse(xhr.responseText);
                    for (const c of js.comments)
                    {
                        const comment = this.comments.newNode("div", "read-comment") ;
                        comment.newTitle("div", c.prenom, "prenom");
                        comment.newTitle("div", c.msg.replaceAll("\n", "<br>"), "msg");
                    }
                }
                catch(e)
                {
                }
            });
    }

    hide()
    {
        this.div.hide();
    }

    show()
    {
        this.div.show();
    }
}
