let fonts  = [
 	["Sans serif", "sans-serif"],
 	["Serif", "serif"],
 	["Monospace", "monospace"],
 	["--------", ""],
 	["Ajouter une police", "add"]
];

let hs = [
	["Aucune", "aucune"],
	["H1", "<h1>"],
	["H2", "<h2>"],
	["H3", "<h3>"],
	["H4", "<h4>"],
	["H5", "<h5>"],
	["H6", "<h6>"],
	["Paragraphe", "<p>"]
];

let sizes = []; 
for (let i=1; i<75; i++)
{
	sizes.push([i, i + "px"]);
}

let floats = 
[
	["None", "none"],
	["Left", "left"],
	["Right", "right"],
	["Center", "center"]
];