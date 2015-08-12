// Text-to-Speech Menu
// Author: J Grant

//var customNum = 0;	// Custom highlight counter.

// Look for voices every second.
var seekVoices = window.setInterval(getVoices, 1000);

$(document).ready(function () {

	// Page has loaded.

    // TODO: FALLBACK IF NOT SUPPORTED.
	// If text-to-speech is supported by the browser...
	//if ('speechSynthesis' in window) {
	
		//// and if the HTML5 'details' element is supported by the browser...
		//if ('open' in document.createElement('details')) {
		
		//	// create the TTS menu.
		//	createTTSMenu();
		//}
    //} 	
});

//function disableControls() {

//    // Disable all menu controls.
//    document.getElementById("ttsStopButton").disabled = true;
//    document.getElementById("ttsStartButton").disabled = true;
//    document.getElementById("ttsVoices").disabled = true;
//    document.getElementById("ttsHighlights").disabled = true;	
//	document.getElementById("ttsSpeed").disabled = true;	
//	document.getElementById("ttsAddHighlightStyle").disabled = true;	
//}

//function enableControls() {

//    // Enable all menu controls.
//    document.getElementById("ttsStopButton").disabled = false;
//    document.getElementById("ttsStartButton").disabled = false;
//    document.getElementById("ttsVoices").disabled = false;
//    document.getElementById("ttsHighlights").disabled = false;	
//	document.getElementById("ttsSpeed").disabled = false;	
//	document.getElementById("ttsAddHighlightStyle").disabled = false;	
//}

//function createTTSMenu() {

//    // Creates the TTS menu.

//    // Grab the ETS TTS div.
//    var etstts = document.getElementById("etsTTS");

//    // Create the menu div.
//    var menuDiv = document.createElement("details");
//    menuDiv.setAttribute("id", "ttsMenu");
//    menuDiv.setAttribute("class", "ttsmenu");
//    etstts.appendChild(menuDiv);
    
//    // Add a summary to the menu.
//    var menuSummary = document.createElement("summary");
//	menuSummary.setAttribute("id", "ttsSummary");
//    menuSummary.innerHTML = "Text-To-Speech Controls";
//    menuDiv.appendChild(menuSummary);

//    // Add a voice drop-down list, with label.
//    addVoiceDD(menuDiv);

//    // Add a highlighting drop-down list, with label.
//    addHighlightDD(menuDiv);

//    // Add a button for custom highlight menu.
//    addCustomHighlightButton(menuDiv);
	
//	// Add a custom highlight menu. This will be hidden until needed.
//	addCustomHighlightMenu(menuDiv)
	
//	// Add a speed drop-down list, with label.
//	addSpeedDD(menuDiv);
   
//    // Add a start button.
//    addStartButton(menuDiv);
      
//    // Add a stop button.
//    addStopButton(menuDiv);
	
//	// Disable all TTS menu controls until all voices are found.
//	disableControls();
//}

//function addLineBreak(menuDiv) {

//    // Add a line break.
//    var lb = document.createElement("br");
//    menuDiv.appendChild(lb);
//}

//function addCustomHighlightButton(menuDiv) {

//	// Adds the custom highlighting button.
//    var b = document.createElement("input");
//    b.setAttribute("type", "button");
//    b.setAttribute("value", "+");
//    b.setAttribute("id", "ttsAddHighlightStyle");
//	b.setAttribute("title", "add custom highlight");
//    b.setAttribute("onclick", "toggleCustomHighlightMenu('open')");
//    menuDiv.appendChild(b);
//}

//function addStopButton(menuDiv) {

//    // Add a stop button.
//    var stopButton = document.createElement("input");
//    stopButton.setAttribute("type", "button");
//    stopButton.setAttribute("value", "Stop reading");
//    stopButton.setAttribute("id", "ttsStopButton");
//    stopButton.setAttribute("onclick", "stop()");
//    menuDiv.appendChild(stopButton);
//}

//function addStartButton(menuDiv) {

//    // Add a start button.
//    var startButton = document.createElement("input");
//    startButton.setAttribute("type", "button");
//    startButton.setAttribute("value", "Start reading");
//    startButton.setAttribute("id", "ttsStartButton");
//    startButton.setAttribute("onclick", "speak()");
//    menuDiv.appendChild(startButton);
//}

//function addSpeedDD(menuDiv) {

//    // Add a speed drop-down list, with label.
//    var speedDDLbl = document.createElement("label");
//    speedDDLbl.setAttribute("for", "ttsSpeed");
//    speedDDLbl.setAttribute("id", "ttsSpeedLbl");
//    speedDDLbl.innerHTML = "Select speed ";
//    menuDiv.appendChild(speedDDLbl);
//    var speedDD = document.createElement("select");
//    speedDD.setAttribute("id", "ttsSpeed");
	
//	// Create speed options (1 to 10);
//	for (i = 1; i <= 10; i++) {
//		var opt = document.createElement("option");
//		opt.setAttribute("value", i);
//		opt.innerHTML = i;
//		speedDD.appendChild(opt);
//	}
	
//    menuDiv.appendChild(speedDD);
//}

//function addVoiceDD(menuDiv) {

//    // Add a voice drop-down list, with label.
//    var voiceDDLbl = document.createElement("label");
//    voiceDDLbl.setAttribute("for", "ttsVoices");
//    voiceDDLbl.setAttribute("id", "ttsVoiceLbl");
//    voiceDDLbl.innerHTML = "Select voice ";
//    menuDiv.appendChild(voiceDDLbl);
//    var voiceDD = document.createElement("select");
//    voiceDD.setAttribute("id", "ttsVoices");
//    menuDiv.appendChild(voiceDD);
//}

//function toggleCustomHighlightMenu(val) {

//	// Toggles custom highlighting menu open or closed.
//	if (val == "open") {
//		$("#ttsCustomHighlightMenu").removeClass("ttshighlightmenuhidden");
//		$("#ttsCustomHighlightMenu").addClass("ttshighlightmenu");
//	}
//	else {
//		$("#ttsCustomHighlightMenu").removeClass("ttshighlightmenu");
//		$("#ttsCustomHighlightMenu").addClass("ttshighlightmenuhidden");
//	}
//}

//function addCustomHighlightMenu(menuDiv) {

//	// Create a custom highlight menu, but keep it hidden until needed.
//    var hmDiv = document.createElement("details");
//    hmDiv.setAttribute("id", "ttsCustomHighlightMenu");
//    hmDiv.setAttribute("class", "ttshighlightmenuhidden");
//	hmDiv.setAttribute("open", "");
//	menuDiv.appendChild(hmDiv);
    
//    // Add a summary to the menu.
//    var hmSummary = document.createElement("summary");
//	hmSummary.setAttribute("id", "ttsCustomHighlightSummary");
//    hmSummary.innerHTML = "Custom Highlight";
//    hmDiv.appendChild(hmSummary);
	
//	// Add a color picker for the background color.
//	var bcpl = document.createElement("label");
//	bcpl.innerHTML = "Background color ";
//	bcpl.setAttribute("class", "ttsHighlightLabel");
//	bcpl.setAttribute("for", "ttsHighlightBColor");
//	hmDiv.appendChild(bcpl);
	
//	var bcp = document.createElement("input");
//	bcp.setAttribute("id", "ttsHighlightBColor");
//	bcp.setAttribute("type", "color");
//	bcp.setAttribute("class", "ttsHighlightPicker");
//	bcp.setAttribute("name", "ttsHighlightBColor");
//	hmDiv.appendChild(bcp);
	
//	addLineBreak(hmDiv);	
	
//	// Add a color picker for the text color.
//	var fcpl = document.createElement("label");
//	fcpl.innerHTML = "Text color ";
//	fcpl.setAttribute("class", "ttsHighlightLabel");
//	fcpl.setAttribute("for", "ttsHighlightFColor");
//	hmDiv.appendChild(fcpl);
	
//	var fcp = document.createElement("input");
//	fcp.setAttribute("id", "ttsHighlightFColor");
//	fcp.setAttribute("type", "color");
//	fcp.setAttribute("class", "ttsHighlightPicker");
//	fcp.setAttribute("name", "ttsHighlightFColor");
//	hmDiv.appendChild(fcp);
	
//	addLineBreak(hmDiv);	
	
//	// Add a color picker for the border color.
//	var brdcpl = document.createElement("label");
//	brdcpl.innerHTML = "Border color ";
//	brdcpl.setAttribute("class", "ttsHighlightLabel");
//	brdcpl.setAttribute("for", "ttsHighlightBrdColor");
//	hmDiv.appendChild(brdcpl);
	
//	var brdcp = document.createElement("input");
//	brdcp.setAttribute("id", "ttsHighlightBrdColor");
//	brdcp.setAttribute("type", "color");
//	brdcp.setAttribute("class", "ttsHighlightPicker");
//	brdcp.setAttribute("name", "ttsHighlightBrdColor");
//	hmDiv.appendChild(brdcp);
	
//	addLineBreak(hmDiv);
		
//	// Add a border shape selector.
//	var bsl = document.createElement("label");
//	bsl.innerHTML = "Border shape ";
//	bsl.setAttribute("class", "ttsHighlightLabel");
//	bsl.setAttribute("for", "ttsHighlightBrdShape");
//	hmDiv.appendChild(bsl);
//	var bsDD = document.createElement("select");
//    bsDD.setAttribute("id", "ttsHighlightBrdShape");
	
//	var opt1 = document.createElement("option");
//	opt1.setAttribute("value", "square");
//	opt1.innerHTML = "square";
//	bsDD.appendChild(opt1);
	
//	var opt2 = document.createElement("option");
//	opt2.setAttribute("value", "rounded");
//	opt2.innerHTML = "rounded";
//	bsDD.appendChild(opt2);
	
//	hmDiv.appendChild(bsDD);
	
//	addLineBreak(hmDiv);
	
//	// Add an OK button.
//	var ob = document.createElement("input");
//    ob.setAttribute("type", "button");
//    ob.setAttribute("value", "OK");
//    ob.setAttribute("id", "ttsOKCustomHighlight");
//    ob.setAttribute("onclick", "setCustomHighlight()");
//    hmDiv.appendChild(ob);
//}

//function setStyle(cssText) {

//	// Creates custom style in internal style sheet.
//    var sheet = document.createElement('style');
//    sheet.type = 'text/css';
//    /* Optional */ window.customSheet = sheet;
//    (document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);
//    return (setStyle = function(cssText, node) {
//        if(!node || node.parentNode !== sheet)
//            return sheet.appendChild(document.createTextNode(cssText));
//        node.nodeValue = cssText;
//        return node;
//    })(cssText);	
//};

//function setCustomHighlight() {

//	var myCSS; 
	
//	// Increment custom highlight counter.
//	customNum++;
	
//	// Limit user to 10 custom highlight styles.
//	if (customNum > 10) {
//		toggleCustomHighlightMenu("closed")
//		alert("Sorry, you cannot add more than 10 custom highlight styles.");
//		return;
//	}
	
//	// Get the selected background color.
//	var bc = $("#ttsHighlightBColor").val();
	
//	// Get the text color.
//	var tc = $("#ttsHighlightFColor").val();
	
//	// Get the border color.
//	var brdc = $("#ttsHighlightBrdColor").val();
	
//	// Get the type of border.
//	var brdtype = document.getElementById("ttsHighlightBrdShape")[document.getElementById("ttsHighlightBrdShape").selectedIndex].value;	
//	if (brdtype == "rounded") {
//		myCSS = setStyle('span.ttsCustom' + customNum + ' {background-color: ' + bc + '; color: ' + tc + '; border: 1px solid ' + brdc + '; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;}');
//	}
//	else {
//		myCSS = setStyle('span.ttsCustom' + customNum + ' {background-color: ' + bc + '; color: ' + tc + '; border: 1px solid ' + brdc + ';}');
//	}
	
//	// Add the new custom style to the drop-down list.
//	var hDD = document.getElementById("ttsHighlights");
//    var o = document.createElement("option");
//    o.setAttribute("value", "Custom" + customNum);
//    o.innerHTML = "Custom" + customNum;
//    hDD.appendChild(o);
	
//	// Make sure the newly-created style is selected at the drop-down list.
//	var n = (customNum + 2) - 1;	// The number of the custom style just created, plus 2 (for default and border options), minus 1 because select box is zero-based.
//	document.getElementById("ttsHighlights").selectedIndex = n;
	
//	// Now close the custom highlight menu.
//	toggleCustomHighlightMenu("closed")
//}

//function addHighlightDD(menuDiv) {

//    // Add a highlighting drop-down list, with label.
//    var highlightDDLbl = document.createElement("label");
//    highlightDDLbl.setAttribute("for", "ttsHighlights");
//    highlightDDLbl.setAttribute("id", "ttsHighlightLbl");
//    highlightDDLbl.innerHTML = "Select highlighting ";
//    menuDiv.appendChild(highlightDDLbl);
//    var highlightDD = document.createElement("select");
//    highlightDD.setAttribute("id", "ttsHighlights");
    
//    var opt1 = document.createElement("option");
//    opt1.setAttribute("value", "Default");
//	opt1.innerHTML = "Default";
//    highlightDD.appendChild(opt1);

//    var opt2 = document.createElement("option");
//    opt2.setAttribute("value", "Border");
//	opt2.innerHTML = "Border";
//    highlightDD.appendChild(opt2);
	
//    menuDiv.appendChild(highlightDD);
//}

function getVoices() {

    // Grab all available voices.
    var voices = window.speechSynthesis.getVoices();
	
    // TODO: FALLBACK IF NO VOICES FOUND.
    // If you find at least one voice, stop looking for voices, populate the voices drop-down list, and re-enable TTS menu controls.
    if (voices.length > 0) {
        //clearInterval(seekVoices);
        //populateVoiceList(voices);
		//enableControls();
    }	
}

//function populateVoiceList(voices) {

//    // Populate the drop-down list box with available voices.
//    var voicelist = document.getElementById("ttsVoices");
    
//    // Save index of "native" voice (if found).
//    var nativeIndex = -1;
    
//    for (var i = 0; i < voices.length; i++) {
//        var opt = document.createElement("option");
//        opt.setAttribute("value", voices[i].name);
//        opt.innerHTML = voices[i].name;
//        if (voices[i].name.toUpperCase() == "NATIVE") {
//            nativeIndex = i;
//        }
//        voicelist.appendChild(opt);
//    }

//    // Default selection to "native" voice, if present.
//    if (nativeIndex != -1) {
//        voicelist.selectedIndex = nativeIndex;
//    }    
//}

function speak() {
	// Read aloud everything in the div with an "id" of "textchar."
    BeneSpeak.speak(document.getElementById('textchar'));
}

//function stop() {
//	// Stop text-to-speech.
//    BeneSpeak.stop();
//}

// document.onreadystatechange = function () {

    // // Test for TTS support.
    // if (document.readyState == "complete") {
        // if ('speechSynthesis' in window) {
            // //alert("You're good to go!");
        // } else {
            // //alert("Sorry. Text-to-speech is not supported.");
            // // Disable controls.
            // disableControls();
        // }
    // }
// }
