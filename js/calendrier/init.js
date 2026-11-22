function loadCss()
{
	newCss("https://motion-live.com/frameworks/css/FloatWindow.css");
	newCss("https://motion-live.com/frameworks/css/Calendrier.css");
}

function loadScripts() 
{
	loadCss();

	let FloatWindow = B.newNode("script"); 
	FloatWindow.src = "https://motion-live.com/frameworks/js/FloatWindow.js";

	let Hour = B.newNode("script"); 
	Hour.src = "https://motion-live.com/frameworks/js/calendrier/Hour.js";

	let Day = B.newNode("script"); 
	Day.src = "https://motion-live.com/frameworks/js/calendrier/Day.js";

	let Calendrier = B.newNode("script"); 
	Calendrier.src = "https://motion-live.com/frameworks/js/calendrier/Calendrier.js";

	FloatWindow.addEventListener("load", function() {B.append(Hour)});
	Hour.addEventListener("load", function() {B.append(Day)});
	Day.addEventListener("load", function() {B.append(Calendrier)});

	B.append(FloatWindow);
}

loadScripts();