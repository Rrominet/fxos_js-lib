class mlNodeAbstractTime extends mlNode
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
	}

	drawContent()
	{
		this.content.time = newNode("select", this.content, "content");

		this.content.time.current = newNode("option", this.content.time);
		this.content.time.current.value = "current";
		this.content.time.current.innerText = "Current Day";

		this.content.time.current = newNode("option", this.content.time);
		this.content.time.current.value = "yesterday";
		this.content.time.current.innerText = "Yesterday";

		this.content.time.fix = newNode("option", this.content.time);
		this.content.time.fix.value = "fix";
		this.content.time.fix.innerText = "Fix Day";

		this.content.time.recursive = newNode("option", this.content.time);
		this.content.time.recursive.value = "recursive";
		this.content.time.recursive.innerText = "Recursive";

		
		// CURRENT // 
		this.content.currentUi = newNode("div", this.content, "content");
		this.content.currentUi.date = newNode("font", this.content.currentUi);  
		let d = new Date(); 
		this.content.currentUi.date.innerText = d.asFrench();

		// CURRENT // 
		
		// YESTERDAY - 1 // 
		this.content.yesterdayUi = newNode("div", this.content, "content");
		this.content.yesterdayUi.date = newNode("font", this.content.yesterdayUi);  
		let y = new Date(); 
		y.setDate(y.getDate() - 1);
		this.content.yesterdayUi.date.innerText = y.asFrench();

		// YESTERDAY // 

		// FIX // 
		this.content.fixUi = newNode("div", this.content, "content");
		this.content.fixUi.date = newNode("input", this.content.fixUi, "content");
		this.content.fixUi.date.type = "date";
		// this.content.fixUi.date.value = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
		this.content.fixUi.date.valueAsDate = d;

		// FIX // 

		// RECURSIVE // 
		this.content.recursiveUi = newNode("div", this.content, "content");
		this.content.recursiveUi.hourLabel = newNode("label", this.content.recursiveUi, "content"); 
		this.content.recursiveUi.hourLabel.innerText = "Houre : "
		this.content.recursiveUi.hour = newNode("input", this.content.recursiveUi, "content"); 
		this.content.recursiveUi.hour.placeholder = "Houre";
		this.content.recursiveUi.hour.title = "Houre";

		this.content.recursiveUi.days = newNode("div", this.content.recursiveUi, ["content", "time", "days"]); 

		this.content.recursiveUi.days.mondayLabel = newNode("label", this.content.recursiveUi.days);
		this.content.recursiveUi.days.mondayLabel.innerText = "Monday : "; 
		this.content.recursiveUi.days.monday = newNode("input", this.content.recursiveUi.days); 
		this.content.recursiveUi.days.monday.type = "checkbox"; 
		this.content.recursiveUi.days.newBr();

		this.content.recursiveUi.days.tuesdayLabel = newNode("label", this.content.recursiveUi.days);
		this.content.recursiveUi.days.tuesdayLabel.innerText = "Tuesday : "; 
		this.content.recursiveUi.days.tuesday = newNode("input", this.content.recursiveUi.days); 
		this.content.recursiveUi.days.tuesday.type = "checkbox";
		this.content.recursiveUi.days.newBr();

		this.content.recursiveUi.days.wendnesdayLabel = newNode("label", this.content.recursiveUi.days);
		this.content.recursiveUi.days.wendnesdayLabel.innerText = "Wendnesday : "; 
		this.content.recursiveUi.days.wendnesday = newNode("input", this.content.recursiveUi.days); 
		this.content.recursiveUi.days.wendnesday.type = "checkbox";
		this.content.recursiveUi.days.newBr();

		this.content.recursiveUi.days.thursdayLabel = newNode("label", this.content.recursiveUi.days);
		this.content.recursiveUi.days.thursdayLabel.innerText = "Thursday : "; 
		this.content.recursiveUi.days.thursday = newNode("input", this.content.recursiveUi.days); 
		this.content.recursiveUi.days.thursday.type = "checkbox";
		this.content.recursiveUi.days.newBr();

		this.content.recursiveUi.days.fridayLabel = newNode("label", this.content.recursiveUi.days);
		this.content.recursiveUi.days.fridayLabel.innerText = "Friday : "; 
		this.content.recursiveUi.days.friday = newNode("input", this.content.recursiveUi.days); 
		this.content.recursiveUi.days.friday.type = "checkbox";
		this.content.recursiveUi.days.newBr();

		this.content.recursiveUi.days.saterdayLabel = newNode("label", this.content.recursiveUi.days);
		this.content.recursiveUi.days.saterdayLabel.innerText = "Saterday : "; 
		this.content.recursiveUi.days.saterday = newNode("input", this.content.recursiveUi.days); 
		this.content.recursiveUi.days.saterday.type = "checkbox";
		this.content.recursiveUi.days.newBr();

		this.content.recursiveUi.days.sundayLabel = newNode("label", this.content.recursiveUi.days);
		this.content.recursiveUi.days.sundayLabel.innerText = "Sunday : "; 
		this.content.recursiveUi.days.sunday = newNode("input", this.content.recursiveUi.days); 
		this.content.recursiveUi.days.sunday.type = "checkbox";
		this.content.recursiveUi.days.newBr();


		this.content.recursiveUi.recurrence = newNode("select", this.content.recursiveUi, "content");

		this.content.recursiveUi.recurrence.eachWeek = newNode("option", this.content.recursiveUi.recurrence);
		this.content.recursiveUi.recurrence.eachWeek.value = "eachWeek";
		this.content.recursiveUi.recurrence.eachWeek.innerText = "Each week";

		this.content.recursiveUi.recurrence.twoTimes = newNode("option", this.content.recursiveUi.recurrence);
		this.content.recursiveUi.recurrence.twoTimes.value = "twoTimes";
		this.content.recursiveUi.recurrence.twoTimes.innerText = "Two times a month";

		this.content.recursiveUi.recurrence.onePerMonth = newNode("option", this.content.recursiveUi.recurrence);
		this.content.recursiveUi.recurrence.onePerMonth.value = "onePerMonth";
		this.content.recursiveUi.recurrence.onePerMonth.innerText = "One time per month";

		this.content.recursiveUi.recurrence.addEventListener("change", this.updateMonthUi.bind(this));

		
		this.content.recursiveUi.month = newNode("div", this.content.recursiveUi, ["content", "time", "month"]); 

		let days = [
			"January", 
			"February", 
			"March", 
			"April", 
			"May", 
			"June", 
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		]

		this.monthBoxes = [];

		for (let d of days)
		{
			let c = newNode("input", this.content.recursiveUi.month);
			c.type = "checkbox"; 
			c.name = d.toLowerCase();
			c.id = d.toLowerCase();

			let l = newNode("label", this.content.recursiveUi.month); 
			l.innerText = d;
			this.content.recursiveUi.month.addBr();
			this.monthBoxes.push(c)
		}

		// RECURSIVE // 



		// events // 
			this.content.time.addEventListener("change", function () 
			{
				for (let c of this.content.time.children)
					if (c.value == this.content.time.value)
					{
						if (this.type == TIME)
							this.content.label.innerText = c.innerText + " time";	
						else 	
							this.content.label.innerText = c.innerText + " date";	
					}
			
			}.bind(this))

			this.content.time.addEventListener("change", this.updateUI.bind(this));
			this.content.recursiveUi.recurrence.addEventListener("change", this.updateUI.bind(this));
		// events //


		this.content.label.innerText = this.content.time.add.innerText = " time";

		this.updateUI();
	}

	updateUI()
	{
		for (let i=0; i<this.content.children.length; i++)
		{
			if (i>2 && !this.content.children[i].classList.contains("socket"))
			{
				this.content.children[i].style.display = "none";
			}
		}

		if (this.content.time.value == "current")
		{
			this.content.currentUi.style.display = "initial";
		}

		else if (this.content.time.value == "yesterday")
		{
			this.content.yesterdayUi.style.display = "initial";
		}
		
		else if (this.content.time.value == "fix")
		{
			this.content.fixUi.style.display = "initial";
		}

		else if (this.content.time.value == "recursive")
		{
			this.content.recursiveUi.style.display = "initial";
			this.updateMonthUi();
		}

		this.updateEdges();
	}

	updateMonthUi()
	{	
		if (this.content.recursiveUi.recurrence.value == "onePerMonth")
			this.content.recursiveUi.month.style.display = "block"; 
		else 
			this.content.recursiveUi.month.style.display = "none"; 
	}

    time()
    {
        if (this.content.time.value == "current")    
            return new Date();
        else if (this.content.time.value == "yesterday")
        {
            let d = new Date(); 
            d.setDate(d.getDate() - 1);
            return d;
        }

        else if (this.content.time.value == "fix")
            return this.content.fixUi.date.valueAsDate;
    }

	serialize() 
	{
		let json = super.serialize();
		json.time = this.content.time.value;
		json.fix = this.content.fixUi.date.value;

		json.hour = this.content.recursiveUi.hour.value;
		json.monday = this.content.recursiveUi.days.monday.checked;
		json.tuesday = this.content.recursiveUi.days.tuesday.checked;
		json.wendnesday = this.content.recursiveUi.days.wendnesday.checked;
		json.thursday = this.content.recursiveUi.days.thursday.checked;
		json.friday = this.content.recursiveUi.days.friday.checked;
		json.saterday = this.content.recursiveUi.days.saterday.checked;
		json.sunday = this.content.recursiveUi.days.sunday.checked;

		json.recurrence = this.content.recursiveUi.recurrence.value; 

		json.january    = this.monthBoxes[0].checked;
		json.february   = this.monthBoxes[1].checked;
		json.march      = this.monthBoxes[2].checked;
		json.april      = this.monthBoxes[3].checked;
		json.may        = this.monthBoxes[4].checked;
		json.june       = this.monthBoxes[5].checked;
		json.july       = this.monthBoxes[6].checked;
		json.august     = this.monthBoxes[7].checked;
		json.september  = this.monthBoxes[8].checked;
		json.october    = this.monthBoxes[9].checked;
		json.november   = this.monthBoxes[10].checked;
		json.december   = this.monthBoxes[11].checked;

		return json;

	}

	deserialize(json, useId=true)
	{
		super.deserialize(json, useId);
		this.content.time.value = json.time;

		this.content.fixUi.date.value = json.fix;

		this.content.recursiveUi.hour.value = json.hour;

		this.content.recursiveUi.days.monday.checked = json.monday
		this.content.recursiveUi.days.tuesday.checked = json.tuesday
		this.content.recursiveUi.days.wendnesday.checked = json.wendnesday;
		this.content.recursiveUi.days.thursday.checked = json.thursday;
		this.content.recursiveUi.days.friday.checked = json.friday;
		this.content.recursiveUi.days.saterday.checked = json.saterday;
		this.content.recursiveUi.days.sunday.checked = json.sunday;

		this.content.recursiveUi.recurrence.value = json.recurrence; 
		this.updateUI();

		this.monthBoxes[0].checked  = json.january;
		this.monthBoxes[1].checked  = json.february;
		this.monthBoxes[2].checked  = json.march;
		this.monthBoxes[3].checked  = json.april;
		this.monthBoxes[4].checked  = json.may;
		this.monthBoxes[5].checked  = json.june;
		this.monthBoxes[6].checked  = json.july;
		this.monthBoxes[7].checked  = json.august;
		this.monthBoxes[8].checked  = json.september;
		this.monthBoxes[9].checked  = json.october;
		this.monthBoxes[10].checked = json.november;
		this.monthBoxes[11].checked = json.december;

	}

	initStr()
	{

		super.initStr();

		let str = "$node_" + this.id + " = new mlNodeTime;\n";	
		str += "$node_" + this.id + "->data['time'] = '" + this.content.time.value + "';\n" ;
		str += "$node_" + this.id + "->data['fix'] = '" + this.content.fixUi.date.value + "';\n" ; // date syntax 2020-01-24 
		str += "$node_" + this.id + "->data['recurrence'] = '" + this.content.recursiveUi.recurrence.value + "';\n" ;
		str += "$node_" + this.id + "->data['hour'] = '" + this.content.recursiveUi.hour.value + "';\n" ;
		str += "$node_" + this.id + "->data['monday'] = '" + boolToStr(this.content.recursiveUi.days.monday.checked) + "';\n" ;
		str += "$node_" + this.id + "->data['tuesday'] = '" + boolToStr(this.content.recursiveUi.days.tuesday.checked) + "';\n" ;
		str += "$node_" + this.id + "->data['thursday'] = '" + boolToStr(this.content.recursiveUi.days.thursday.checked) + "';\n" ;
		str += "$node_" + this.id + "->data['wendnesday'] = '" + boolToStr(this.content.recursiveUi.days.wendnesday.checked) + "';\n" ;
		str += "$node_" + this.id + "->data['friday'] = '" + boolToStr(this.content.recursiveUi.days.friday.checked) + "';\n" ;
		str += "$node_" + this.id + "->data['saterday'] = '" + boolToStr(this.content.recursiveUi.days.saterday.checked) + "';\n" ;
		str += "$node_" + this.id + "->data['sunday'] = '" + boolToStr(this.content.recursiveUi.days.sunday.checked) + "';\n" ;


		str += "$node_" + this.id + "->data['january'] = '" + boolToStr(this.monthBoxes[0].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['february'] = '" + boolToStr(this.monthBoxes[1].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['march'] = '" + boolToStr(this.monthBoxes[2].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['april'] = '" + boolToStr(this.monthBoxes[3].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['may'] = '" + boolToStr(this.monthBoxes[4].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['june'] = '" + boolToStr(this.monthBoxes[5].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['july'] = '" + boolToStr(this.monthBoxes[6].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['august'] = '" + boolToStr(this.monthBoxes[7].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['september'] = '" + boolToStr(this.monthBoxes[8].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['october'] = '" + boolToStr(this.monthBoxes[9].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['november'] = '" + boolToStr(this.monthBoxes[10].checked) + "';\n" ;
		str += "$node_" + this.id + "->data['december'] = '" + boolToStr(this.monthBoxes[11].checked) + "';\n" ;

		return str;
	}

	executeStr()
	{
		if (this.executed)
			return "";

		this.executed = true;
		return "$res_" + this.id + " = $node_" + this.id + "->execute();\n";
	}
}
