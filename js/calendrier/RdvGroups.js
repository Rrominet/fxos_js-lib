class RdvGroups
{
	constructor() 
	{
		this.getRdvGrpsAjax();
	}

	getRdvGrpsAjax() 
	{
		this.xhr = HttpRequest(); 
		let url = "https://motion-live.com/frameworks/php/calendrier/ajax.php";
		let params = "function=getRdvGrps";

		let func = function (xhr) 
		{
			// console.log(xhr.responseText);
			this.setRdvDivFromStr(xhr.responseText);
		}.bind(this);

		this.xhr.sendAsPost(url, params, func);
	}

	setRdvDivFromStr(str)
	{
		let t = str.split("//RDV_GROUP//"); 
		t.pop();
		for (let grp of t)
		{
			new Rdvs(grp); 
		}

	}
}

new RdvGroups();