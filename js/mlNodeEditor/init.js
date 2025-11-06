function loadStyle() 
{
	newCss(FM + "/css/mlNodeEditor.css");
	newCss(FM + "/css/menus.css");
}

function loadDependencies() 
{
	// create scripts elmts // 
    //
    GLOBAL = FM + "/js/mlNodeEditor/"

	let mlEdges = D.createElement("script"); 
	mlEdges.src = GLOBAL + "mlEdge.js";

	let mlSocket = D.createElement("script"); 
	mlSocket.src = GLOBAL + "mlSocket.js";

	let mlGraphicElmt = D.createElement("script"); 
	mlGraphicElmt.src = GLOBAL + "mlGraphicElmt.js";

	let mlNode = D.createElement("script"); 
	mlNode.src = GLOBAL + "graphicElmts/mlNode.js";

	let mlNodeEvent = D.createElement("script"); 
	mlNodeEvent.src = GLOBAL + "graphicElmts/nodes/mlNodeEvent.js";

	let EmailContent = D.createElement("script"); 
	EmailContent.src = GLOBAL + "graphicElmts/nodes/mlNodeEmail/EmailContent.js";

	let mlNodeEmail = D.createElement("script"); 
	mlNodeEmail.src = GLOBAL + "graphicElmts/nodes/mlNodeEmail.js";

	let mlNodeContactsList = D.createElement("script"); 
	mlNodeContactsList.src = GLOBAL + "graphicElmts/nodes/mlNodeContactsList.js";

    let mlNodeSingleCompte = mkJs(GLOBAL + "graphicElmts/nodes/mlNodeSingleCompte.js");

	let mlNodeMixContactsList = D.createElement("script"); 
	mlNodeMixContactsList.src = GLOBAL + "graphicElmts/nodes/mlNodeMixContactsList.js";

	let mlNodePreventDoubleEmails = D.createElement("script"); 
	mlNodePreventDoubleEmails.src = GLOBAL + "graphicElmts/nodes/mlNodePreventDoubleEmails.js";

	let mlNodeAbstractTime = D.createElement("script"); 
	mlNodeAbstractTime.src = GLOBAL + "graphicElmts/nodes/mlNodeAbstractTime.js"

	let mlNodeTime = D.createElement("script"); 
	mlNodeTime.src = GLOBAL + "graphicElmts/nodes/mlNodeAbstractTime/mlNodeTime.js"

	let mlNodeDate = D.createElement("script"); 
	mlNodeDate.src = GLOBAL + "graphicElmts/nodes/mlNodeAbstractTime/mlNodeDate.js"

	let mlNodeValue = mkJs(GLOBAL + "graphicElmts/nodes/mlNodeValue.js");
	
    let mlNodeNewsletter = mkJs(GLOBAL + "graphicElmts/nodes/mlNodeNewsletter.js");
	let mlNodeDebug = mkJs(GLOBAL + "graphicElmts/nodes/mlNodeDebug.js");

	let mlContainer = D.createElement("script"); 
	mlContainer.src = GLOBAL + "graphicElmts/mlContainer.js";

	let mlNodeOptIn = D.createElement("script"); 
	mlNodeOptIn.src = GLOBAL + "graphicElmts/nodes/mlNodeEvent/mlNodeEventTest.js";

	let mlNodePageVisited = D.createElement("script"); 
	mlNodePageVisited.src = GLOBAL + "graphicElmts/nodes/mlNodePageVisited.js";

	let EmailsSeqEmailWriter = D.createElement("script"); 
	EmailsSeqEmailWriter.src = GLOBAL + "graphicElmts/nodes/mlNodeEmailsSeq/EmailsSeqEmailWriter.js";

	let EmailsSeqNode = D.createElement("script"); 
	EmailsSeqNode.src = GLOBAL + "graphicElmts/nodes/mlNodeEmailsSeq/EmailsSeqNode.js";

	let EmailsSeqFinalEmailNode = D.createElement("script"); 
	EmailsSeqFinalEmailNode.src = GLOBAL + "graphicElmts/nodes/mlNodeEmailsSeq/EmailsSeqFinalEmailNode.js";

	let EmailsSeqEmailNode = D.createElement("script"); 
	EmailsSeqEmailNode.src = GLOBAL + "graphicElmts/nodes/mlNodeEmailsSeq/EmailsSeqEmailNode.js";

	let EmailsSeqInterface = D.createElement("script"); 
	EmailsSeqInterface.src = GLOBAL + "graphicElmts/nodes/mlNodeEmailsSeq/EmailsSeqInterface.js";

	let mlNodeEmailsSeq = D.createElement("script"); 
	mlNodeEmailsSeq.src = GLOBAL + "graphicElmts/nodes/mlNodeEmailsSeq.js";

	let Rect = D.createElement("script"); 
	Rect.src = GLOBAL + "Rect.js"

	let mlFile = D.createElement("script"); 
	mlFile.src = GLOBAL + "files/File.js";

	let mlNodeEditorMenu = mkJs(GLOBAL + "mlNodeEditorMenu.js");
	let mlNodeEditorOpen = mkJs(GLOBAL + "mlNodeEditorOpen.js");

	let mlNodeEditor = D.createElement("script"); 
	mlNodeEditor.src = GLOBAL + "mlNodeEditor.js?v=42151342";

	//menus// 

	let hr = D.createElement("script");
	    hr.src = FM + "/js/HttpRequest.js";

	let menuBar = D.createElement("script");
	    menuBar.src = FM + "/js/menus/MenuBar.js";

	let menu = D.createElement("script");
	    menu.src = FM + "/js/menus/Menu.js";

	let contextMenu = D.createElement("script");
	    contextMenu.src = FM + "/js/menus/ContextMenu.js";

	let menuButton = D.createElement("script");
	    menuButton.src = FM + "/js/menus/MenuButton.js";

	let FloatWindow = D.createElement("script");
	    FloatWindow.src = FM + "/js/floatWindow/FloatWindow_v2.js";

	let UIList = mkJs(FM + "/js/UIList.js");
	let TxtWriter = mkJs(FM + "/js/txtWriter/init.js?v=4565");

	let scripts = 
	[
        mkJs(FM + "/js/mouse.js"),
        mkJs(FM + "/js/txtWriter/HtmlCleaner.js"),
		hr,
		menuBar,
		menu,
		contextMenu,
		menuButton,
		UIList,
		mkJs(FM + "/js/txtWriter/Comment.js"),
		TxtWriter,
		mlEdges,
		mlSocket,
		mlGraphicElmt,
		mlNode,
		mlNodeEvent,
		EmailContent,
		mlNodeEmail,
		mlNodeContactsList,
		mlNodeSingleCompte,
		mlNodeMixContactsList,
		mlNodePreventDoubleEmails,
		mlNodeAbstractTime,
		mlNodeTime,
		mlNodeDate,
		mlNodeValue,
		mlNodeNewsletter,
		mlNodeDebug,
		mlContainer,
		mlNodeOptIn,
		mlNodePageVisited,
		EmailsSeqNode,
		EmailsSeqEmailNode,
		EmailsSeqFinalEmailNode,
		EmailsSeqInterface,
        mkJs(FM + "/js/windows-manager/WindowsManager.js"),
        mkJs(FM + "/js/windows-manager/Window.js"),
        mkJs(FM + "/js/mlNodeEditor/graphicElmts/nodes/mlNodeEmailsSeq/EmailsSeqSnR.js"),
		mlNodeEmailsSeq,
        mkJs(FM + "/js/mlNodeEditor/graphicElmts/nodes/mlNodeEvent/mlNodeEventNewCompte.js"),
		Rect,
		mlFile,
		FloatWindow,
		mlNodeEditorOpen,
		mlNodeEditorMenu,
		mlNodeEditor
	];

	importScripts(scripts);
}

function setConstants () 
{
	CONTACTS_LIST                    = 0; 
	EMAIL                            = 1; 
	MIX_CONTACTS_LIST                = 2; 
	PREVENT_DOUBLE_EMAILS            = 3; 
	INPUT_SOCKET                     = 4;
	OUTPUT_SOCKET                    = 5;
	TIME                             = 6;
	TEST                             = 7;
	CONTAINER                        = 8;
	RESIZE_MODE                      = 9;
	NEWSLETTER                       = 10;
	OPEN                             = 11;
	SAVE_AS                          = 12;
	PAGE_VISITED                     = 13;
	DEBUG        					 = 14;
	DATE                             = 15;
	EMAILS_SEQ                       = 16;
	BLANK                            = 17;
	FINAL_EMAIL                      = 18;
    VALUE                            = 19;
    SINGLE_COMPTE                    = 20;
    INDEX_EMAIL_SEQ                  = 21; 
    DATE_EMAIL_SEQ                   = 22;
    NEW_COMPTE_EVENT                 = 23;
}

function preventDefaults() 
{
	addEventListener("mousedown", function (e)
	{
		if (e.button == 1)
			e.preventDefault();
	})
}

loadDependencies();
loadStyle();
setConstants();
preventDefaults();
