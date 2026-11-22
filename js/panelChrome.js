function createPanel()  
{
	var div = document.createElement ("div"); 
	div.classList.add("googlePanels"); 
	div.innerHTML = "Notre site fonctionne mieux sur le navigateur <a href='https://www.google.com/chrome/' target='_blank' >Google Chrome</a>.<br/>Avec votre navigateur actuel, certaines fonctionnalités risquent de ne pas fonctionner correctement.<br><a href='https://www.google.com/chrome/' target='_blank' ><img src='https://motion-live.com/images/chrome.png' class='googlePanels'></a>";

	var okButton = document.createElement("button");
	okButton.classList.add("googlePanels"); 
	okButton.innerText = "J'ai compris";
	okButton.onclick = function () {close(div)};

	document.body.prepend(div);
	div.append(okButton);
}

function isOnChrome() 
{
	if (window.chrome == undefined)
		return false; 
	else 
		return true;
}

if (!isOnChrome() && (localStorage["hasChromePanel"] == undefined || localStorage["hasChromePanel"] == "false")) 
	createPanel();

function close(div)
{
	div.parentNode.removeChild(div);
	localStorage["hasChromePanel"] = "true";
}