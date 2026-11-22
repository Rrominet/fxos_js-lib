function addCss() 
{
	newCss(FM + "/css/chrono.css");
}

function loadJs()
{
	let xhr = D.createElement("script"); 
	xhr.src = FM + "/js/HttpRequest.js"; 

	let Chrono = D.createElement("script"); 
	Chrono.src = FM + "/js/chrono/Chrono.js"; 


	// APPEND // 
		xhr.addEventListener("load", function () {B.append(Chrono)}); 

		B.append(xhr);
	//  
}

addCss();
loadJs();