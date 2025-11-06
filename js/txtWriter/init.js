function importPaths()
{
	let paths = document.createElement("script");
	if (navigator.onLine)
		paths.src = "https://motion-live.com/frameworks/js/paths.js";
	else
		paths.src = "http://localhost/motion-live/frameworks/js/paths.js"; 

	paths.addEventListener("load", importUtils);
	document.body.append(paths);
}

function importUtils()
{
	let utils = document.createElement("script");
	utils.src = FM + "/js/utils.js"; 
	utils.addEventListener("load", loadcripts);

	document.body.append(utils);
}

function loadcripts()
{
	let TxtWritersc = mkJs(FM + "/js/txtWriter/TxtWriter.js?v=45");

	let scripts = [
		TxtWritersc
	];

	importScripts(scripts, () => TxtWriter.load());
}

function init()
{
	importPaths();
}

init();
