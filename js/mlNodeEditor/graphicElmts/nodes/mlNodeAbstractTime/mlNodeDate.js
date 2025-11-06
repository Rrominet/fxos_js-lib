class mlNodeDate extends mlNodeAbstractTime
{
	constructor(nodeEditor, name = "My node", x =null, y=null)
	{
		super(nodeEditor, name, x, y);
		this.type = DATE;
	}

	drawContent() 
	{
		super.drawContent(); 
		this.addOutput("Date", "purple");
	}

	initStr()
	{
		mlNode.prototype.initStr.call(this);

		let str = "$node_" + this.id + " = new mlNodeDate;\n";	
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