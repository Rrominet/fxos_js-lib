class mlNodeContactsList extends mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = CONTACTS_LIST;
	}

	drawContent() 
	{
		this.content.list = newNode("select", this.content, "content");

		this.content.list.op1 = newNode("option", this.content.list);
		this.content.list.op1.value = "abonnes";
		this.content.list.op1.innerText = "Abonnés";

		this.content.list.op39 = newNode("option", this.content.list);
		this.content.list.op39.value = "abonnes-en";
		this.content.list.op39.innerText = "Abonnés (english)";

		this.content.list.op7 = newNode("option", this.content.list);
		this.content.list.op7.value = "abonnes7Erreurs";
		this.content.list.op7.innerText = "Abonnés - 7 erreurs";

		this.content.list.op24 = newNode("option", this.content.list);
		this.content.list.op24.value = "abonnesPipeline";
		this.content.list.op24.innerText = "Abonnés - Pipeline";

		this.content.list.op9 = newNode("option", this.content.list);
		this.content.list.op9.value = "abonnesFirstImg";
		this.content.list.op9.innerText = "Abonnés - Première Image";

		this.content.list.op10 = newNode("option", this.content.list);
		this.content.list.op10.value = "abonnesPlus1An";
		this.content.list.op10.innerText = "Abonnés - 1 an et + d'experience";

		this.content.list.op11 = newNode("option", this.content.list);
		this.content.list.op11.value = "abonnesBlenderVsMaya";
		this.content.list.op11.innerText = "Abonnés - Blender VS Maya";

		this.content.list.op12 = newNode("option", this.content.list);
		this.content.list.op12.value = "inscritsConference";
		this.content.list.op12.innerText = "Inscrits à la conférence en ligne";

		this.content.list.op23 = newNode("option", this.content.list);
		this.content.list.op23.value = "inscritsPortesOuvertes";
		this.content.list.op23.innerText = "Inscrits à la porte ouverte H3D2";

		this.content.list.op13 = newNode("option", this.content.list);
		this.content.list.op13.value = "presentsConference";
		this.content.list.op13.innerText = "Présents à la conférence en ligne";

		this.content.list.op20 = newNode("option", this.content.list);
		this.content.list.op20.value = "inscritsRdv";
		this.content.list.op20.innerText = "Inscrits au moins 1 fois à un RDV";

		this.content.list.op14 = newNode("option", this.content.list);
		this.content.list.op14.value = "inscritGroupeTravail";
		this.content.list.op14.innerText = "Inscrits aux groupes de travail";

		this.content.list.op15 = newNode("option", this.content.list);
		this.content.list.op15.value = "groupeTravail";
		this.content.list.op15.innerText = "Dans un groupe de travail";

		this.content.list.op2 = newNode("option", this.content.list);
		this.content.list.op2.value = "clients";
		this.content.list.op2.innerText = "Clients";

		this.content.list.op3 = newNode("option", this.content.list);
		this.content.list.op3.value = "h3d2";
		this.content.list.op3.innerText = "Clients H3D2";

		this.content.list.op3 = newNode("option", this.content.list);
		this.content.list.op3.value = "h3d2Candidats";
		this.content.list.op3.innerText = "Candidats à H3D2";

		this.content.list.op4 = newNode("option", this.content.list);
		this.content.list.op4.value = "101";
		this.content.list.op4.innerText = "Clients 101 erreurs";

		this.content.list.op22 = newNode("option", this.content.list);
		this.content.list.op22.value = "decollage";
		this.content.list.op22.innerText = "Clients Décollage";

		this.content.list.op19 = newNode("option", this.content.list);
		this.content.list.op19.value = "STP";
		this.content.list.op19.innerText = "Clients Starter to PRO";

		this.content.list.op25 = newNode("option", this.content.list);
		this.content.list.op25.value = "canGroupeTravail";
		this.content.list.op25.innerText = "Clients ayant accès aux groupes de travail";

		this.content.list.op5 = newNode("option", this.content.list);
		this.content.list.op5.value = "noh3d2";
		this.content.list.op5.innerText = "H3D2 - Abonnés non intéressés";

		this.content.list.op15 = newNode("option", this.content.list);
		this.content.list.op15.value = "no101";
		this.content.list.op15.innerText = "101 Erreurs - Abonnés non intéressés";

		this.content.list.op16 = newNode("option", this.content.list);
		this.content.list.op16.value = "nodecollage";
		this.content.list.op16.innerText = "Décollage - Abonnés non intéressés";

		this.content.list.op21 = newNode("option", this.content.list);
		this.content.list.op21.value = "noSTP";
		this.content.list.op21.innerText = "Starter to PRO - non intéressés";

		this.content.list.op17 = newNode("option", this.content.list);
		this.content.list.op17.value = "dernierRappel";
		this.content.list.op17.innerText = "101 Erreurs - Dernier Rappel";

		this.content.list.op26 = newNode("option", this.content.list);
		this.content.list.op26.value = "spacewarpBetaAsked";
		this.content.list.op26.innerText = "SpaceWarp - Inscrits pour devenir bêta-testeur";

		this.content.list.op27 = newNode("option", this.content.list);
		this.content.list.op27.value = "spacewarpNotInterested";
		this.content.list.op27.innerText = "SpaceWarp - Non-intéressés";

		this.content.list.op28 = newNode("option", this.content.list);
		this.content.list.op28.value = "h3d2-list-attente";
		this.content.list.op28.innerText = "H3D2 - Sur liste d'attente";

		this.content.list.op29 = newNode("option", this.content.list);
		this.content.list.op29.value = "abc-before";
		this.content.list.op29.innerText = "Avant (ordre alphabétique)";

		this.content.list.op30 = newNode("option", this.content.list);
		this.content.list.op30.value = "abc-after";
		this.content.list.op30.innerText = "Après (ordre alphabétique)";

		this.content.list.op31 = newNode("option", this.content.list);
		this.content.list.op31.value = "h3d2-free";
		this.content.list.op31.innerText = "H3D2 - version d'essaie";

		this.content.list.op32 = newNode("option", this.content.list);
		this.content.list.op32.value = "sw-pgr";
		this.content.list.op32.innerText = "Spacewarp (progress)";

		this.content.list.op33 = newNode("option", this.content.list);
		this.content.list.op33.value = "sw-beta";
		this.content.list.op33.innerText = "Spacewarp - Bêta-testeurs";

		this.content.list.op34 = newNode("option", this.content.list);
		this.content.list.op34.value = "sw-players";
		this.content.list.op34.innerText = "Spacewarp - Joueurs";

		this.content.list.op35 = newNode("option", this.content.list);
		this.content.list.op35.value = "po-lead-magnet";
		this.content.list.op35.innerText = "A regardé au moins 1 vidéo des '7 Meilleures Vidéos'";

		this.content.list.op36 = newNode("option", this.content.list);
		this.content.list.op36.value = "teachers";
		this.content.list.op36.innerText = "Enseignants";

		this.content.list.op37 = newNode("option", this.content.list);
		this.content.list.op37.value = "survey";
		this.content.list.op37.innerText = "A répondu au sondage";

		this.content.list.op38 = newNode("option", this.content.list);
		this.content.list.op38.value = "live-inscrits";
		this.content.list.op38.innerText = "Inscrits à un live";

        this.content.version = this.content.newNode("select", "content");
        this.content.version.setOptions([
           ["Toutes", "all"],
           ["Les Indispensables", "indispensables"],
           ["Version Complète", "complet"],
           ["Version Ultime", "ultime"],
        ])

        this.content.version.hide();

		this.content.useDate = this.content.newLabelInput("checkbox", "Filtrer par rapport à la date d'inscription");

		this.content.date = this.content.newNode("div", "date");
		this.content.date.select = this.content.date.newNode("select", "content"); 
		this.content.date.hidden = true;

		this.content.date.select.op1 = this.content.date.select.newNode("option");
		this.content.date.select.op1.value = "before";
		this.content.date.select.op1.innerText = "Garder si inscrits avant la date";

		this.content.date.select.op2 = this.content.date.select.newNode("option");
		this.content.date.select.op2.value = "after";
		this.content.date.select.op2.innerText = "Garder si inscrits après la date";

        this.content.abcEmail = this.content.addInput("email", "l'email cible");
        this.content.abcEmail.style.display = "block";
        this.content.abcEmail.style.width = "100%";
        this.content.abcEmail.hide();

        this.content.survey = this.content.addInput("text", "L'id du sondage");
        this.content.survey.style.display = "block";
        this.content.survey.style.width = "100%";
        this.content.survey.hide();

        this.content.live = this.content.addInput("text", "L'id du live");
        this.content.live.style.display = "block";
        this.content.live.style.width = "100%";
        this.content.live.hide();

		// events // 
		this.content.list.addEventListener("change", function () 
		{
			for (let c of this.content.list.children)
            {
                if (c.value == this.content.list.value)
                {
                    this.content.label.innerText = c.innerText;        
                }
            }

            if (this.content.list.value == "h3d2" || 
            this.content.list.value == "STP")
                this.content.version.show();
            else 
                this.content.version.hide();

            if (this.content.list.value == "abc-before" || this.content.list.value == "abc-after")
                this.content.abcEmail.show()
            else 
                this.content.abcEmail.hide()

            if (this.content.list.value == "survey")
                this.content.survey.show()
            else 
                this.content.survey.hide();

            if (this.content.list.value == "live-inscrits")
                this.content.live.show()
            else 
                this.content.live.hide();
		
		}.bind(this))

		this.content.useDate.addEventListener("change", this.toggleDate.bind(this));

		// events //

		this.content.label.innerText = this.content.list.op1.innerText;
		this.addInput("Date", "purple");
		this.inputs[0].hide();
		this.addOutput("List");
	}

	toggleDate()
	{
		this.content.date.hidden = !this.content.useDate.input.checked;
		this.inputs[0].setVisible(this.content.useDate.input.checked);		
	}

	serialize() 
	{
		let json = super.serialize();
		json.list = this.content.list.value;
        json.survey = this.content.survey.value;
		json.useDate = this.content.useDate.input.checked;
		json.filterDate = this.content.date.select.value;
        json.version = this.content.version.value;
        json.abcEmail = this.content.abcEmail.value;
        json.live = this.content.live.value;

		return json;
	}

	deserialize(json, useId=true)
	{
		super.deserialize(json, useId);
		this.content.list.value = json.list;
		this.content.useDate.input.checked = json.useDate;
		this.content.date.select.value = json.filterDate; 
        if (json.version)
            this.content.version.value = json.version;

        if (this.content.list.value == "h3d2" || this.content.list.value == "STP")
            this.content.version.show();

        if (json.abcEmail)
            this.content.abcEmail.value = json.abcEmail;

        if (this.content.list.value == "abc-before" || this.content.list.value == "abc-after")
            this.content.abcEmail.show()

        if ("survey" in json)
            this.content.survey.value = json.survey;
        if (this.content.list.value == "survey")
            this.content.survey.show()

        if ("live" in json)
            this.content.live.value = json.live;
        if (this.content.list.value == "live-inscrits")
            this.content.live.show()

		this.toggleDate();
	}

	initStr()
	{
		super.initStr();

		let str = "$node_" + this.id + " = new mlNodeContactsList;\n";
		str += "$node_" + this.id + "->data['list'] = '" + this.content.list.value + "';\n" ;
		str += "$node_" + this.id + "->data['survey'] = '" + this.content.survey.value + "';\n" ;
		str += "$node_" + this.id + "->data['live'] = '" + this.content.live.value + "';\n" ;
		str += "$node_" + this.id + "->data['version'] = '" + this.content.version.value + "';\n" ;
        if (this.content.list.value == "abc-before" || this.content.list.value == "abc-after")
            str += "$node_" + this.id + "->data['abcEmail'] = '" + this.content.abcEmail.value + "';\n" ;
		if (this.content.useDate.input.checked)
		{
			str += "$node_" + this.id + "->data['useDate'] = true;\n";
			str += "$node_" + this.id + "->data['filterDate'] = '" + this.content.date.select.value + "';\n" ;
		}
		else 
			str += "$node_" + this.id + "->data['useDate'] = false;\n";

		return str;
	}

	executeStr()
	{
		if (this.inputs[0].isConnected())
		{
			return super.executeStr(); 
		}
		
		if (this.executed)
			return "";

		this.executed = true;
		return "$res_" + this.id + " = $node_" + this.id + "->execute();\n";
	}
}
