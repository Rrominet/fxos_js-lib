function loadPaths() 
{
	let paths = document.createElement("script"); 
	if (navigator.onLine)
		paths.src = "https://motion-live.com/frameworks/js/paths.js";
	else 
		paths.src = "http://localhost/motion-live/frameworks/js/paths.js";

	paths.addEventListener("load", loadUtils);
	document.body.append(paths);
}

function loadUtils()
{
	let utils = document.createElement("script"); 
	utils.src = FM + "/js/utils.js";
	utils.addEventListener("load", loadDependencies);
	document.body.append(utils);
}

function loadDependencies()
{
	let Message = mkJs(FM + "/js/tchat/Message.js");
	let Conv = mkJs(FM + "/js/tchat/Conv.js");
	let ConvMulti = mkJs(FM + "/js/tchat/ConvMulti.js");
	let TchatLabel = mkJs(FM + "/js/tchat/TchatLabel.js");
	let Tchat = mkJs(FM + "/js/tchat/Tchat.js");

	let scripts = 
	[
		Message,
		Conv,
		ConvMulti,
		TchatLabel,
		Tchat
	];

	importScripts(scripts);
}

function init() 
{
    newCss(FM + "/css/tchat.css");
	loadDependencies();
}

function test()
{
    STREAM = Tchat.createMulti("conference-30-09-2020");
}

init();
