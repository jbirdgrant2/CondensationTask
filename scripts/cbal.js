//AUDIO PLAYBACK WORKS IN CHROME BUT NOT FIREFOX.
//LOCAL STORAGE IN BOTH CHROME AND FIREFOX.
// HTML local storage provides two objects for storing data on the client:
//window.localStorage - stores data with no expiration date
//window.sessionStorage - stores data for one session (data is lost when the tab is closed)

//var srUser = true;   // assume screen reader user by default.

//var animation1;
//var animation2;

var text_areas = [];

// Assumes a maximum of 3 radio groups per screen.
var radio_buttons_grp1 = [];
var radio_buttons_grp2 = [];
var radio_buttons_grp3 = [];

$(document).ready(function () {
	
	// If session storage for screen reader user has not yet been created, create it and set it to true.
	if (sessionStorage.getItem('srUser') == null) {
		sessionStorage.setItem('srUser', 'true');
		// Make sure the secret check box is also checked.
		$('#chk_atmode').attr('checked', 'checked');
	}
	// If session storage for screen reader user has already been created...
	else {
		// If it is true, make sure the secret check box is checked.
		if (sessionStorage.getItem('srUser') == 'true') {
			$('#chk_atmode').attr('checked', 'checked');
		}
		// If it is false, make sure the secret check box is unchecked.
		else {
			$('#chk_atmode').removeAttr('checked');
		}
	}
	
	// Add handling for animation play buttons.
	var play_button1 = new pb1('playButton1');
	var play_button2 = new pb2('playButton2');
	
    // Add handling for next button.
    var nbutton = new nb('nextButton');

    // Add handling for back button.
    var bbutton = new bb('backButton');

    // Add handling for stop button.
    var stopbutton = new sb('stopButton');

    // Add handling for data button.
    var databutton = new db('dataButton');
    
    // Add handling for textarea.
    $('textarea').each(function (index) {
        var textarea = new ta($(this).attr('id'));
    });
    
    // Add handling for radio buttons (with checkbox behavior).
    $('li[role="checkbox"]').each(function(index) {
        var rbutton = new rb($(this).attr('id'));
    });

    // Add handling for rollovers.
    $('span[class="rollover"]').each(function (index) {
        var rover = new ro($(this).attr('id'));
    });

    // Add handling for audio buttons.
    $('input[class="audiobutton"]').each(function (index) {
        var audbtn = new ab($(this).attr('id'));
    });
	
	// Grab the exposed question/screen.
    qlist = $('.question');
    // Get the question id.
    qid = qlist.attr('id');
    // Figure out (from the question id) what text should go in the purple box and put it there.
    var li = qid.lastIndexOf('_') + 1;
    var ptext = qid.substring(li, qid.length);
    $('.purplebox_2').html(ptext);
	
	// Populate answers (if any).
	// Get the screen number.
    var qnum = qid.substring(1, qid.lastIndexOf('_')) - 1; // zero-based.
	switch(qnum + 1) {
		// Only screens 2, 4, 7, 9, 11, 13, and 14 have questions on them.
		case 2:
		case 7:
		case 14: {
			populateTextResponse(qnum);
			populateRGroup1Response(qnum);
			break;
		}
		case 4: {
			populateRGroup1Response(qnum);
			break;
		}
		case 9:
		case 11: {
			populateTextResponse(qnum);
			break;
		}
		case 13: {
			populateRGroup1Response(qnum);
			populateRGroup2Response(qnum);
			populateRGroup3Response(qnum);
			break;
		}		
	}
	
	// Clear any previously shown alert messages.
    $('.alertbox_rg').html('');
    $('.alertbox_ta').html('');
	
	// By default...
	// Disable and hide the data button.
	$('#dataButton').attr('disabled', 'disabled').attr('src', './images/dataButtonDisabled.jpg');
	$('#dataButton').parent().attr('class', 'nolist menuitem navbutton hidden');
	// Enable the stop, next, and back buttons.
    $('#stopButton').attr('src', './images/stopButtonEnabled.jpg').removeAttr('disabled');
    $('#nextButton').attr('src', './images/nextButtonEnabled.jpg').removeAttr('disabled');
	$('#backButton').attr('src', './images/backButtonEnabled.jpg').removeAttr('disabled');
    
	// If you're on the first screen, log start time and disable the back button.
    if (qid == 'q1_ENGAGE') {
		// First, check for existing start time (e.g., retrieved the first time you visited this page).
		var stime = sessionStorage.getItem('starttime');
		if ((stime != null) && (stime != '')) {
			// do nothing.
		}
		else {
			sessionStorage.setItem('starttime', getStartTime());
		}
		$('#backButton').attr('src', './images/backButtonDisabled.jpg').attr('disabled', 'disabled');
    }
	
	// Create animations, if applicable.
	if (qid == 'q8_EXPLORE') {
	    //animation1 = new Condensation();
		toggleAnimationButtons();        
	}
	
	if (qid == 'q10_EXPLORE') {
	    //animation2 = new Condensation2();
	    toggleAnimationButtons();
	}
	
	// If you are on the last slide, disable the next button, as well as the stop button.
    if (qid == 'q15_GOOD-BYE') {
		sessionStorage.setItem('endtime', getEndTime());
		$('#nextButton').attr('disabled', 'disabled').attr('src', './images/nextButtonDisabled.jpg');
        $('#stopButton').attr('disabled', 'disabled').attr('src', './images/stopButtonDisabled.jpg');
		// Enable the data button.
        $('#dataButton').removeAttr('disabled').attr('src', './images/dataButtonEnabled.jpg');
        $('#dataButton').parent().attr('class', 'nolist menuitem navbutton');        
    }
	
	// If you are on the data screen...
    if (qid == 'q16_DATA') {		
		// Populate the student data.
		displayData();
		// Disable the stop button.
		$('#stopButton').attr('disabled', 'disabled').attr('src', './images/stopButtonDisabled.jpg');	
		// Disable the next button.
		$('#nextButton').attr('disabled', 'disabled').attr('src', './images/nextButtonDisabled.jpg');	
		// Disable and hide the data button.
		$('#dataButton').parent().attr('class', 'nolist menuitem navbutton hidden');
		$('#dataButton').attr('disabled', 'disabled').attr('src', './images/dataButtonDisabled.jpg');
		// Make sure details are open.
		$('#studentAnswers').attr('open', 'open');
	}
	
});

function populateTextResponse(n) {
	// Populate text response.
	var answer = sessionStorage.getItem('ta_' + n);
	if ((answer == null) || (answer == undefined)) {
	    // do nothing.        
	}
	else {
		var ta = $('textarea');
		ta.html(answer);
	}
}

function populateRGroup1Response(n) {	
	var answer = sessionStorage.getItem('rg1_' + n);
	switch (answer) {
		case null:
		case undefined:
		case 'no radio group 1':
		case 'no radio button group': {
			// do nothing.
			break;
		}
	    case '': {
	        // Clear all radio button choices in this group.
	        var rg = $('.radiogroup')[0];
	        var rgid = rg.getAttribute('id');
	        var el = $('#' + rgid + '');
	        var myli = el.find('li')[0];
	        myli.setAttribute('aria-checked', 'false');
	        var myliid = myli.getAttribute('id');
	        var myliimg = $('#' + myliid + '').find('img');
	        myliimg.attr('src', 'images/rb_unselected.jpg');

	        var myli2 = el.find('li')[1];
	        myli2.setAttribute('aria-checked', 'false');
	        var myliid2 = myli2.getAttribute('id');
	        var myliimg2 = $('#' + myliid2 + '').find('img');
	        myliimg2.attr('src', 'images/rb_unselected.jpg');
	        break;
	    }
		default: {
			var rg = $('.radiogroup')[0];
			var rgid = rg.getAttribute('id');
			var el = $('#' + rgid + '');
			if (answer == 'a') {
				var myli = el.find('li')[0];
				myli.setAttribute('aria-checked', 'true');
				var myliid = myli.getAttribute('id');
				var myliimg = $('#' + myliid + '').find('img');
				myliimg.attr('src', 'images/rb_selected.jpg');
			}
			else {
				var myli = el.find('li')[1];
				myli.setAttribute('aria-checked', 'true');
				var myliid = myli.getAttribute('id');
				var myliimg = $('#' + myliid + '').find('img');
				myliimg.attr('src', 'images/rb_selected.jpg');
			}
			break;
		}
	}
}

function populateRGroup2Response(n) {	
	var answer = sessionStorage.getItem('rg2_' + n);
	switch (answer) {
		case null:
		case undefined:
		case 'no radio group 2':
		case 'no radio button group': {
			// do nothing.
			break;
		}
	    case '': {
	        var rg = $('.radiogroup')[1];
	        var rgid = rg.getAttribute('id');
	        var el = $('#' + rgid + '');
	        var myli = el.find('li')[0];
	        myli.setAttribute('aria-checked', 'false');
	        var myliid = myli.getAttribute('id');
	        var myliimg = $('#' + myliid + '').find('img');
	        myliimg.attr('src', 'images/rb_unselected.jpg');

	        var myli2 = el.find('li')[1];
	        myli2.setAttribute('aria-checked', 'false');
	        var myliid2 = myli2.getAttribute('id');
	        var myliimg2 = $('#' + myliid2 + '').find('img');
	        myliimg2.attr('src', 'images/rb_unselected.jpg');
	        break;
	    }
		default: {
			var rg = $('.radiogroup')[1];
			var rgid = rg.getAttribute('id');
			var el = $('#' + rgid + '');
			if (answer == 'a') {
				var myli = el.find('li')[0];
				myli.setAttribute('aria-checked', 'true');
				var myliid = myli.getAttribute('id');
				var myliimg = $('#' + myliid + '').find('img');
				myliimg.attr('src', 'images/rb_selected.jpg');
			}
			else {
				var myli = el.find('li')[1];
				myli.setAttribute('aria-checked', 'true');
				var myliid = myli.getAttribute('id');
				var myliimg = $('#' + myliid + '').find('img');
				myliimg.attr('src', 'images/rb_selected.jpg');
			}
			break;
		}
	}
}

function populateRGroup3Response(n) {
	var answer = sessionStorage.getItem('rg3_' + n);
	switch (answer) {
		case null:
		case undefined:
		case 'no radio group 3':
		case 'no radio button group': {
			// do nothing.
			break;
		}
	    case '': {
	        var rg = $('.radiogroup')[2];
	        var rgid = rg.getAttribute('id');
	        var el = $('#' + rgid + '');
	        var myli = el.find('li')[0];
	        myli.setAttribute('aria-checked', 'false');
	        var myliid = myli.getAttribute('id');
	        var myliimg = $('#' + myliid + '').find('img');
	        myliimg.attr('src', 'images/rb_unselected.jpg');

	        var myli2 = el.find('li')[1];
	        myli2.setAttribute('aria-checked', 'false');
	        var myliid2 = myli2.getAttribute('id');
	        var myliimg2 = $('#' + myliid2 + '').find('img');
	        myliimg2.attr('src', 'images/rb_unselected.jpg');
	        break;
	    }
		default: {
			var rg = $('.radiogroup')[2];
			var rgid = rg.getAttribute('id');
			var el = $('#' + rgid + '');
			if (answer == 'a') {
				var myli = el.find('li')[0];
				myli.setAttribute('aria-checked', 'true');
				var myliid = myli.getAttribute('id');
				var myliimg = $('#' + myliid + '').find('img');
				myliimg.attr('src', 'images/rb_selected.jpg');
			}
			else {
				var myli = el.find('li')[1];
				myli.setAttribute('aria-checked', 'true');
				var myliid = myli.getAttribute('id');
				var myliimg = $('#' + myliid + '').find('img');
				myliimg.attr('src', 'images/rb_selected.jpg');
			}
			break;
		}
	}
}

function logStartTime() {
	var sa = $('#studentAnswers');
	var newhtml = sa.html() + '<p>Start: ' + sessionStorage.getItem('starttime') + '</p>';
	sa.html(newhtml);		
}

function logEndTime() {
	var sa = $('#studentAnswers');
	var newhtml = sa.html() + '<p>End: ' + sessionStorage.getItem('endtime') + '</p>';
	sa.html(newhtml);
}

function appendScreenNumber(i) {
	$('#studentAnswers').append('<p>Screen ' + (i + 1) + ':<ul id="sa_list' + i + '"></ul></p>');
}

function appendTextResponse(i) {
						
	var answer = sessionStorage.getItem('ta_' + i);
	
	switch (answer) {
		case null:
		case undefined:
		case '': {
			$('#sa_list' + i + '').append('<li>Text Response: not answered</li>');
			break;
		}
		case 'no textarea': {
			$('#sa_list' + i + '').append('<li>No text response area found</li>');
			break;
		}
		default: {
			$('#sa_list' + i + '').append('<li>Text Response: ' + sessionStorage.getItem('ta_' + i) + '</li>');
			break;
		}
	}
}

function appendRGroup1Response(i) {
	
	var answer = sessionStorage.getItem('rg1_' + i);
	
	var mykey = '';
	switch(i + 1) {
		case 2:
		case 4:
		case 14: {
			mykey = "a";
			break;
		}
		case 7:
		case 13: {
			mykey = "b";
			break;
		}
	}
	switch (answer) {
		case null:
	    case undefined:
        case 'undefined':
		case '': {
			$('#sa_list' + i + '').append('<li>Radio Button Group Response: not answered&semi; Key: ' + mykey + '</li>');
			break;
		}
		case 'no radio group 1':
		case 'no radio button group': {
			$('#sa_list' + i + '').append('<li>Radio Button Group Response: No radio group found&semi; Key: ' + mykey + '</li>');
			break;
		}
		default: {
			$('#sa_list' + i + '').append('<li>Radio Button Group Response: ' + answer + '&semi; Key: ' + mykey + '</li>');
			break;
		}
	}				
}

function appendRGroup2Response(i) {	
	var answer = sessionStorage.getItem('rg2_' + i);
	var mykey = '';
	switch(i + 1) {
		case 13: {
			mykey = "b";
			break;
		}
	}	
	switch (answer) {
		case null:
	    case undefined:
	    case 'undefined':
		case '': {
			$('#sa_list' + i + '').append('<li>Radio Button Group Response: not answered&semi; Key: ' + mykey + '</li>');
			break;
		}
		case 'no radio group 1':
		case 'no radio button group': {
			$('#sa_list' + i + '').append('<li>Radio Button Group Response: No radio group found&semi; Key: ' + mykey + '</li>');
			break;
		}
		default: {
			$('#sa_list' + i + '').append('<li>Radio Button Group Response: ' + answer + '&semi; Key: ' + mykey + '</li>');
			break;
		}
	}
}

function appendRGroup3Response(i) {	
	var answer = sessionStorage.getItem('rg3_' + i);
	var mykey = '';
	switch(i + 1) {
		case 13: {
			mykey = "a";
			break;
		}
	}	
	switch (answer) {
		case null:
	    case undefined:
	    case 'undefined':
		case '': {
			$('#sa_list' + i + '').append('<li>Radio Button Group Response: not answered&semi; Key: ' + mykey + '</li>');
			break;
		}
		case 'no radio group 1':
		case 'no radio button group': {
			$('#sa_list' + i + '').append('<li>Radio Button Group Response: No radio group found&semi; Key: ' + mykey + '</li>');
			break;
		}
		default: {
			$('#sa_list' + i + '').append('<li>Radio Button Group Response: ' + answer + '&semi; Key: ' + mykey + '</li>');
			break;
		}
	}
}

// Display data.
function displayData() {
	
	logStartTime();
	
	// Loop through all the screens...
	for (i = 0; i < 15; i++) {
        switch (i + 1) {			
            // Only screens 2, 4, 7, 9, 11, 13, and 14 have questions on them.
            case 2:
			case 7:
			case 14: {
				appendScreenNumber(i);
				appendTextResponse(i);
				appendRGroup1Response(i);
                break;
			}
            case 4: {
				appendScreenNumber(i);
				appendRGroup1Response(i);
                break;
			}           
            case 9:
			case 11: {
				appendScreenNumber(i);
				appendTextResponse(i);
                break;
			}
            case 13: {
				appendScreenNumber(i);
				appendRGroup1Response(i);
				appendRGroup2Response(i);
				appendRGroup3Response(i);
                break;
			}
        }
    }
	logEndTime();
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getStartTime() {
	var currentdate = new Date(); 
	var datetime = 	
		currentdate.getMonth() + 1  + "/" 
		+ currentdate.getDate() + "/"
        + currentdate.getFullYear() + " "  
        + addZero(currentdate.getHours()) + ":"  
        + addZero(currentdate.getMinutes()) + ":" 
        + addZero(currentdate.getSeconds());
	return datetime;
}

function getEndTime() {
	var currentdate = new Date(); 
	var datetime = 	
		currentdate.getMonth() + 1  + "/" 
		+ currentdate.getDate() + "/"
        + currentdate.getFullYear() + " "  
        + addZero(currentdate.getHours()) + ":"  
        + addZero(currentdate.getMinutes()) + ":" 
        + addZero(currentdate.getSeconds());
	return datetime;
}

function showATMode() {
    if ($('#chk_atmode').attr('class') == 'none') {
        $('#chk_atmode').removeAttr('class');
        $('#atmode_lbl').removeAttr('class');        
    }
    else {
        $('#chk_atmode').attr('class', 'none');
        $('#atmode_lbl').attr('class', 'none');        
    }
    
}

function setATUser(el) {
	
	if (el.checked) {
		sessionStorage.setItem('srUser', 'true');		
	}
	else {
		sessionStorage.setItem('srUser', 'false');
	}
    //srUser = el.checked;
    toggleAnimationButtons();    
}

function toggleAnimationButtons() {
	// If user is using a screen reader...
	if (sessionStorage.getItem('srUser') == 'true') {
	//if (srUser == true) {
	    $('.sr_btn').removeAttr('style');
        $('.alternates').removeAttr('style');
		
        $('#q10_shortdesc').attr('class', 'enabled').removeAttr('tabindex');
        $('#q10_longdesc').attr('class', 'enabled').removeAttr('tabindex');
        $('#q10_tactile').attr('class', 'enabled').removeAttr('tabindex');
    }
    // User is not using a screen reader...
    else {
		$('.sr_btn').attr('style', 'display: none;');
        $('.alternates').attr('style', 'display: none;');
		
        $('#q10_shortdesc').attr('class', 'offscreen').attr('tabindex', '-1');
        $('#q10_longdesc').attr('class', 'offscreen').attr('tabindex', '-1');
        $('#q10_tactile').attr('class', 'offscreen').attr('tabindex', '-1');
    }
}

function keyCodes() {
    this.enter = 13;
    this.space = 32;
    this.left = 37;
    this.up = 38;
    this.right = 39;
    this.down = 40;
}

// ===================================================================================
// next button
// ===================================================================================

// constructor
function nb(buttonid) {
    this.$id = $('#' + buttonid);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
nb.prototype.bindHandlers = function () {

    var thisObj = this;

    this.$id.click(function (e) {
        return thisObj.handleClick(e);
    });

    this.$id.keydown(function (e) {
        return thisObj.handleKeyDown(e);
    });

    this.$id.keypress(function (e) {
        return thisObj.handleKeyPress(e);
    });
}

// handle click
nb.prototype.handleClick = function (e) {

    this.nextScreen();
    return true;
}

// handle key down
nb.prototype.handleKeyDown = function (e) {
	switch (e.keyCode) {
	    case this.keys.enter:
        case this.keys.space: {
	        this.nextScreen();
            e.stopPropagation();
            return false;
			break;
        }
    }
    return true;
}

// Consume keypress events. This function is necessary to prevent some browsers (such as Opera) from performing window manipulation 
// on keypress events. Returns true if propagating; false if not. 
nb.prototype.handleKeyPress = function (e) {

    if (e.altKey || e.ctrlKey || e.shiftKey) {
        // do nothing 
        return true;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down: {
            e.stopPropagation();
            return false;
        }
    }
    return true;
}

nb.prototype.showAlert_ta = function (e) {
    this.removeAlert_ta();
    this.removeAlert_rg();
    $('.question').find('.alertbox_ta').attr('role', 'alert').html('Please answer the text response question.');
    $('.question').find('.alertbox_rg').removeAttr('role').html('');
}

nb.prototype.showAlert_rg = function (e) {
    this.removeAlert_ta();
    this.removeAlert_rg();
    $('.question').find('.alertbox_rg').attr('role', 'alert').html('Please answer the multiple choice question.');
    $('.question').find('.alertbox_ta').removeAttr('role').html('');
}

nb.prototype.removeAlert_ta = function (e) {
    // Remove alert box, if it is showing.
    $('.question').find('.alertbox_ta').removeAttr('role').html('');
}

nb.prototype.removeAlert_rg = function (e) {
    // Remove alert box, if it is showing.
    $('.question').find('.alertbox_rg').removeAttr('role').html('');
}

nb.prototype.saveData = function (e) {
    // Grab the exposed question/screen.
    var qlist = $('.question');

    // Get the question id.
    var qid = qlist.attr('id');

    // Get the screen number.
    var qnum = qid.substring(1, qid.lastIndexOf('_')) - 1;

    // Save textarea (if any) answer for this screen.
    text_areas[qnum] = this.getTRAnswer(qlist);

    // Save text response to session storage.	
    sessionStorage.setItem('ta_' + qnum, text_areas[qnum]);

    // Save radio button answers.
    // How many radio button groups are there on the page?
    var rglist = qlist.find('.radiogroup');
    switch (rglist.length) {
        case 0: {
            radio_buttons_grp1[qnum] = 'no radio group 1';
            radio_buttons_grp2[qnum] = 'no radio group 2';
            radio_buttons_grp3[qnum] = 'no radio group 3';
            break;
        }
        case 1: {
            radio_buttons_grp1[qnum] = this.getRGAnswer(rglist[0]);
            radio_buttons_grp2[qnum] = 'no radio group 2';
            radio_buttons_grp3[qnum] = 'no radio group 3';
            break;
        }
        case 2: {
            radio_buttons_grp1[qnum] = this.getRGAnswer(rglist[0]);
            radio_buttons_grp2[qnum] = this.getRGAnswer(rglist[1]);
            radio_buttons_grp3[qnum] = 'no radio group 3';
            break;
        }
        case 3: {
            radio_buttons_grp1[qnum] = this.getRGAnswer(rglist[0]);
            radio_buttons_grp2[qnum] = this.getRGAnswer(rglist[1]);
            radio_buttons_grp3[qnum] = this.getRGAnswer(rglist[2]);
            break;
        }
    }
    // Save to session storage.
    sessionStorage.setItem('rg1_' + qnum, radio_buttons_grp1[qnum]);
    sessionStorage.setItem('rg2_' + qnum, radio_buttons_grp2[qnum]);
    sessionStorage.setItem('rg3_' + qnum, radio_buttons_grp3[qnum]);

}

nb.prototype.getTRAnswer = function (qlist) {

    // Save textarea (if any) answer for this screen.
    // If there is a textarea on the screen (assumes only one potential textarea per page)...
    if (qlist.find('textarea').length > 0) {
        var ta_answer = qlist.find('textarea').val();
        return ta_answer;        
    }
        // If there is no textarea on the screen...
    else {
        //text_areas[qnum] = 'no textarea';
        return 'no textarea';
    }
}

nb.prototype.getRGAnswer = function (rglist) {
    var l = '';
    // Loop through all the radio buttons/checkboxes in the radiogroup...
    var rgid = rglist.getAttribute('id');
    var rg = $('#' + rgid + '');
    rg.find('li[role="checkbox"]').each(function (index) {
        // If you find a checked answer...
        if ($(this).attr('aria-checked') == 'true') {
            // Get the letter of the selected answer (assumes only "a" or "b").
            switch (index) {
                case 0: {
                    l = 'a';
                    break;
                }
                case 1: {
                    l = 'b';
                    break;
                }
            }
        }
    });
    return l;
}

// Go to next screen
nb.prototype.nextScreen = function (e) {

    // Grab the exposed question/screen.
    var qlist = $('.question');
    
	// Get the question id.
    var qid = qlist.attr('id');
    
    // Save the screen number.
    var qnum = qid.substring(1, qid.lastIndexOf('_')) - 1;    
    
	// =====================================================================
	// Answer Validation
    // If you find a textarea with no text, show error message and stay.
	if (qlist.find('textarea').length > 0) {
		var ta_val = qlist.find('textarea').val();
		ta_val = $.trim(ta_val);
		if (ta_val == '') {
			this.showAlert_ta();
			qlist.find('textarea').focus();
			return;
		}
	}
    // Check for missing answers in radio button groupings.
    var missing = 0;	// number of radio groups missing an answer.
    var first_missing = '';	// first radio group missing an answer.
    // Loop through each radiogroup on the screen...
    qlist.find('.radiogroup').each(function (index) {
        var rb_answer = false; 	// assume user did not select a radio button.		
        // Loop through all the radio buttons/checkboxes in the radiogroup...
        $(this).find('li[role="checkbox"]').each(function (index) {
            // If you find a checked answer, this radiogroup has been answered.
            if ($(this).attr('aria-checked') == 'true') {
                rb_answer = true;
            }
        });
        // If no answer was checked in this radiogroup...
        if (rb_answer == false) {
            // increment the number of radiogroups missing an answer
            missing += 1;
            // determine the first radiogroup on the page that is missing an answer
            if (first_missing == '') {
                first_missing = $(this).attr('id');
            }
        }
    });
    // If there is at least one radiogroup that is missing an answer...
    if (missing > 0) {
        // show the error message
        this.showAlert_rg();
        // set focus to the first radio button in the first radiogroup that is missing an answer
        $('#' + first_missing + '').find('li[role="checkbox"]')[0].focus();
        return;
    }
	// =====================================================================

	// Save the data.
	this.saveData();

    // Move to the next screen.
    qnum = qnum + 2;	
    var docname = 'condensation' + qnum.toString() + '.html';    
    location.href = docname;
    return;
}

// ===================================================================================
// radio button
// ===================================================================================

// constructor
function rb(buttonid) {
    
    this.$id = $('#' + buttonid);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
rb.prototype.bindHandlers = function () {

    var thisObj = this;

    this.$id.click(function (e) {
        return thisObj.handleClick(e);
    });

    this.$id.keydown(function (e) {
        return thisObj.handleKeyDown(e);
    });

    this.$id.keypress(function (e) {
        return thisObj.handleKeyPress(e);
    });
}

// handle click
rb.prototype.handleClick = function (e) {

    this.toggleState();
    return true;
}

// handle key down
rb.prototype.handleKeyDown = function (e) {

    switch (e.keyCode) {
        case this.keys.enter:
        case this.keys.space: {

            this.toggleState();

            e.stopPropagation();
            return false;
        }
        case this.keys.left:
        case this.keys.up: {
            var $prev = this.$id.prev(); // the previous button 

            if (e.shiftKey || e.ctrlKey) {
                // do nothing 
                return true;
            }
            // give the previous button focus 
            $prev.focus();

            e.stopPropagation();
            return false;
        }
        case this.keys.right:
        case this.keys.down: {

            var $next = this.$id.next(); // the next button 

            if (e.shiftKey || e.ctrlKey) {
                // do nothing 
                return true;
            }
            
            // give the next button focus 
            $next.focus();

            e.stopPropagation();
            return false;
        }
    }

    return true;
}

// Consume keypress events. This function is necessary to prevent some browsers (such as Opera) from performing window manipulation 
// on keypress events. Returns true if propagating; false if not. 
rb.prototype.handleKeyPress = function (e) {

    if (e.altKey || e.ctrlKey || e.shiftKey) {
        // do nothing 
        return true;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down: {
            e.stopPropagation();
            return false;
        }
    }

    return true;
}

rb.prototype.removeAlert_rg = function (e) {
    // Remove alert box, if it is showing.
    $('.question').find('.alertbox_rg').removeAttr('role').html('');
}

// toggle radio button state
rb.prototype.toggleState = function (e) {

    // If something has been selected or de-selected, clear any existing alerts.
    this.removeAlert_rg();

    // Deselect all other options.
    this.$id.siblings().attr('aria-checked', 'false');
    this.$id.siblings().find('img').attr('src', 'images/rb_unselected.jpg');

    var $img = this.$id.find('img');

    // If the radio button is already selected, de-select it.
    if (this.$id.attr('aria-checked') == 'true') {
        this.$id.attr('aria-checked', 'false');
        $img.attr('src', 'images/rb_unselected.jpg');
    }
    // If the radio button is not selected, select it.
    else {
        this.$id.attr('aria-checked', 'true');
        $img.attr('src', 'images/rb_selected.jpg');
    }
}

// ===================================================================================
// rollovers
// ===================================================================================

// constructor
function ro(spanid) {
    this.$id = $('#' + spanid);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
ro.prototype.bindHandlers = function () {

    var thisObj = this;

    this.$id.mouseover(function (e) {
        return thisObj.handleMouseOver(e);
    });

    this.$id.mouseleave(function (e) {
        return thisObj.handleMouseLeave(e);
    });
}

// handle mouseover
ro.prototype.handleMouseOver = function (e) {

    // When mousing over the rollover, show the rollover content.
    this.showRollover(); 
    return true;
}

// handle mouseleave
ro.prototype.handleMouseLeave = function (e) {

    // When mouse is leaving the rollover, hide the rollover content.
    this.hideRollover();
    return true;
}

// show rollover content
ro.prototype.showRollover = function (e) {

    // Grab the id attribute of the rollover span.
    var ro_id = this.$id.attr('id');

    // Figure out which text matches it, based on id.
    var txt_id = ro_id + '_txt';
    var ro_id_txt = $('#' + txt_id + '');

    // If the rollover text is not showing...
    if (ro_id_txt.attr('class') == 'hidden') {

        // hide all the other rollover text
        ro_id_txt.siblings().attr('class', 'hidden');
        // show the rollover text
        ro_id_txt.attr('class', 'rollover_text');
    } 
}

// hide rollover content
ro.prototype.hideRollover = function (e) {
    // Grab the id attribute of the rollover span.
    var ro_id = this.$id.attr('id');

    // Figure out which text matches it, based on id.
    var txt_id = ro_id + '_txt';
    var ro_id_txt = $('#' + txt_id + '');

    ro_id_txt.attr('class', 'hidden');
}

// ===================================================================================
// audio buttons
// ===================================================================================

// constructor
function ab(spanid) {
    this.$id = $('#' + spanid);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
ab.prototype.bindHandlers = function () {

    var thisObj = this;

	this.$id.focus(function (e) {
        return thisObj.handleFocus(e);
    });
	
	this.$id.blur(function (e) {
        return thisObj.handleBlur(e);
    });
	
    this.$id.click(function (e) {
        return thisObj.handleClick(e);
    });

    this.$id.keydown(function (e) {
        return thisObj.handleKeyDown(e);
    });

    this.$id.keypress(function (e) {
        return thisObj.handleKeyPress(e);
    });
}

// handle focus
ab.prototype.handleFocus = function (e) {

    this.showDefinition();
    return true;
}

// handle blur
ab.prototype.handleBlur = function (e) {

    this.hideDefinition();
    return true;
}

// handle click
ab.prototype.handleClick = function (e) {

    this.playAudio();
    return true;
}

// handle key down
ab.prototype.handleKeyDown = function (e) {

    switch (e.keyCode) {
        case this.keys.enter:
        case this.keys.space: {
            this.playAudio();
            e.stopPropagation();
            return false;
        }
    }
    return true;
}

// Consume keypress events. This function is necessary to prevent some browsers (such as Opera) from performing window manipulation 
// on keypress events. Returns true if propagating; false if not. 
ab.prototype.handleKeyPress = function (e) {

    if (e.altKey || e.ctrlKey || e.shiftKey) {
        // do nothing 
        return true;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down: {
            e.stopPropagation();
            return false;
        }
    }
    return true;
}

ab.prototype.playAudio = function (e) {

    var p = this.$id.prev();
	//var p = this.$id.next();
    var myid = p.attr('id') + '_txt';
    var myel = $('#' + myid + '');
    BeneSpeak.stop();
    BeneSpeak.speak(myel);
}

ab.prototype.showDefinition = function (e) {

	// Grab the id attribute of the rollover span.
	var ro_id = this.$id.prev().attr('id');

    // Figure out which text matches it, based on id.
    var txt_id = ro_id + '_txt';
    var ro_id_txt = $('#' + txt_id + '');

    // If the rollover text is not showing...
    if (ro_id_txt.attr('class') == 'hidden') {

        // hide all the other rollover text
        ro_id_txt.siblings().attr('class', 'hidden');
        // show the rollover text
        ro_id_txt.attr('class', 'rollover_text');
    } 
}

ab.prototype.hideDefinition = function (e) {
	
	// Grab the id attribute of the rollover span.
	var ro_id = this.$id.prev().attr('id');

    // Figure out which text matches it, based on id.
    var txt_id = ro_id + '_txt';
    var ro_id_txt = $('#' + txt_id + '');

    ro_id_txt.attr('class', 'hidden');
}

// ===================================================================================
// back button
// ===================================================================================

// constructor
function bb(buttonid) {
    this.$id = $('#' + buttonid);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
bb.prototype.bindHandlers = function () {

    var thisObj = this;

    this.$id.click(function (e) {
        return thisObj.handleClick(e);
    });

    this.$id.keydown(function (e) {
        return thisObj.handleKeyDown(e);
    });

    this.$id.keypress(function (e) {
        return thisObj.handleKeyPress(e);
    });
}

// handle click
bb.prototype.handleClick = function (e) {

    this.prevScreen();
    return true;
}

// handle key down
bb.prototype.handleKeyDown = function (e) {
    switch (e.keyCode) {
        case this.keys.enter:
        case this.keys.space: {
            this.prevScreen();
            e.stopPropagation();
            return false;
            break;
        }
    }
    return true;
}

// Consume keypress events. This function is necessary to prevent some browsers (such as Opera) from performing window manipulation 
// on keypress events. Returns true if propagating; false if not. 
bb.prototype.handleKeyPress = function (e) {

    if (e.altKey || e.ctrlKey || e.shiftKey) {
        // do nothing 
        return true;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down: {
            e.stopPropagation();
            return false;
        }
    }
    return true;
}

bb.prototype.saveData = function (e) {
    // Grab the exposed question/screen.
    var qlist = $('.question');
   
    // Get the question id.
    var qid = qlist.attr('id');

    // Get the screen number.
    var qnum = qid.substring(1, qid.lastIndexOf('_')) - 1;

    // Save textarea (if any) answer for this screen.

    text_areas[qnum] = this.getTRAnswer(qlist);

    // Save text response to session storage.	
    sessionStorage.setItem('ta_' + qnum, text_areas[qnum]);
	
    // Save radio button answers.
    // How many radio button groups are there on the page?
    var rglist = qlist.find('.radiogroup');
    switch (rglist.length) {
        case 0: {   
            radio_buttons_grp1[qnum] = 'no radio group 1';
            radio_buttons_grp2[qnum] = 'no radio group 2';
            radio_buttons_grp3[qnum] = 'no radio group 3';
            break;
        }
        case 1: {
            radio_buttons_grp1[qnum] = this.getRGAnswer(rglist[0]);
            radio_buttons_grp2[qnum] = 'no radio group 2';
            radio_buttons_grp3[qnum] = 'no radio group 3';
            break;
        }
        case 2: {
            radio_buttons_grp1[qnum] = this.getRGAnswer(rglist[0]);
            radio_buttons_grp2[qnum] = this.getRGAnswer(rglist[1]);
            radio_buttons_grp3[qnum] = 'no radio group 3';
            break;
        }
        case 3: {
            radio_buttons_grp1[qnum] = this.getRGAnswer(rglist[0]);
            radio_buttons_grp2[qnum] = this.getRGAnswer(rglist[1]);
            radio_buttons_grp3[qnum] = this.getRGAnswer(rglist[2]);
            break;
        }
    }        
    // Save to session storage.
    sessionStorage.setItem('rg1_' + qnum, radio_buttons_grp1[qnum]);
    sessionStorage.setItem('rg2_' + qnum, radio_buttons_grp2[qnum]);
    sessionStorage.setItem('rg3_' + qnum, radio_buttons_grp3[qnum]);	
}

bb.prototype.getTRAnswer = function (qlist) {

    // Save textarea (if any) answer for this screen.
    // If there is a textarea on the screen (assumes only one potential textarea per page)...
    if (qlist.find('textarea').length > 0) {
        var ta_answer = qlist.find('textarea').val();
        return ta_answer;        
    }
        // If there is no textarea on the screen...
    else {
        return 'no textarea';
    }

}

bb.prototype.getRGAnswer = function (rglist) {
    var l = '';
    // Loop through all the radio buttons/checkboxes in the radiogroup...
    var rgid = rglist.getAttribute('id');
    var rg = $('#' + rgid + '');
    rg.find('li[role="checkbox"]').each(function (index) {
        // If you find a checked answer...
        if ($(this).attr('aria-checked') == 'true') {
            // Get the letter of the selected answer (assumes only "a" or "b").
            switch (index) {
                case 0: {
                    l = 'a';
                    break;
                }
                case 1: {
                    l = 'b';
                    break;
                }
            }
        }
    });
    return l;
}

// Go to previous screen/question.
bb.prototype.prevScreen = function (e) {

    // Grab the exposed question/screen.
    var qlist = $('.question');
	
	// Get the question id.
    var qid = qlist.attr('id');
	
    // Save the screen number.
    var qnum = qid.substring(1, qid.lastIndexOf('_'));
	
    // Save user's answers.
    if ((qid != 'q16_DATA') && (qid != 'q15_GOOD-BYE')) {
        this.saveData();
    }
    
    // Move to the previous screen.
    qnum = qnum - 1;
    var docname = 'condensation' + qnum.toString() + '.html';    
    location.href = docname;
    return;
}

// ===================================================================================
// textarea
// ===================================================================================

// constructor
function ta(id) {
    this.$id = $('#' + id);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
ta.prototype.bindHandlers = function () {

    var thisObj = this;

    this.$id.keydown(function (e) {
        return thisObj.handleKeyDown(e);
    });

    this.$id.keypress(function (e) {
        return thisObj.handleKeyPress(e);
    });
}

// handle key down
ta.prototype.handleKeyDown = function (e) {
    this.removeAlert_ta();
    return true;
}

// Consume keypress events. This function is necessary to prevent some browsers (such as Opera) from performing window manipulation 
// on keypress events. Returns true if propagating; false if not. 
ta.prototype.handleKeyPress = function (e) {

    if (e.altKey || e.ctrlKey || e.shiftKey) {
        // do nothing 
        return true;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down: {
            e.stopPropagation();
            return false;
        }
    }
    return true;
}

ta.prototype.removeAlert_ta = function (e) {
    // Remove alert box, if it is showing.
    $('.question').find('.alertbox_ta').removeAttr('role').html('');
}


// ===================================================================================
// stop button
// ===================================================================================

// constructor
function sb(buttonid) {
    this.$id = $('#' + buttonid);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
sb.prototype.bindHandlers = function () {

    var thisObj = this;

    this.$id.click(function (e) {
        return thisObj.handleClick(e);
    });

    this.$id.keydown(function (e) {
        return thisObj.handleKeyDown(e);
    });

    this.$id.keypress(function (e) {
        return thisObj.handleKeyPress(e);
    });
}

// handle click
sb.prototype.handleClick = function (e) {

    this.stopTest();
    return true;
}

// handle key down
sb.prototype.handleKeyDown = function (e) {
    switch (e.keyCode) {
        case this.keys.enter:
        case this.keys.space: {
            this.stopTest();

            e.stopPropagation();
            return false;
            break;
        }
    }
    return true;
}

// Consume keypress events. This function is necessary to prevent some browsers (such as Opera) from performing window manipulation 
// on keypress events. Returns true if propagating; false if not. 
sb.prototype.handleKeyPress = function (e) {

    if (e.altKey || e.ctrlKey || e.shiftKey) {
        // do nothing 
        return true;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down: {
            e.stopPropagation();
            return false;
        }
    }
    return true;
}

sb.prototype.getTRAnswer = function (qlist) {

    // Save textarea (if any) answer for this screen.
    // If there is a textarea on the screen (assumes only one potential textarea per page)...
    if (qlist.find('textarea').length > 0) {
        var ta_answer = qlist.find('textarea').val();
        return ta_answer;
    }
    // If there is no textarea on the screen...
    else {
        return 'no textarea';
    }
}

sb.prototype.getRGAnswer = function (rglist) {
        var l = '';
        // Loop through all the radio buttons/checkboxes in the radiogroup...
        var rgid = rglist.getAttribute('id');
        var rg = $('#' + rgid + '');
        rg.find('li[role="checkbox"]').each(function (index) {
            // If you find a checked answer...
            if ($(this).attr('aria-checked') == 'true') {
                // Get the letter of the selected answer (assumes only "a" or "b").
                switch (index) {
                    case 0: {
                        l = 'a';
                        break;
                    }
                    case 1: {
                        l = 'b';
                        break;
                    }
                }
            }
        });
        return l;
  
}

// Save data.
sb.prototype.saveData = function (e) {
    // Save data to local storage.

    // Grab the exposed question/screen.
    var qlist = $('.question');

    // Get the question id.
    var qid = qlist.attr('id');

    // Get the screen number.
    var qnum = qid.substring(1, qid.lastIndexOf('_')) - 1;

    // Save textarea (if any) answer for this screen.
    text_areas[qnum] = this.getTRAnswer(qlist);
	sessionStorage.setItem('ta_' + qnum, text_areas[qnum]);

    // Save radio button answers.
    // How many radio button groups are there on the page?
	var rglist = qlist.find('.radiogroup');
	switch (rglist.length) {
	    case 0: {
	        radio_buttons_grp1[qnum] = 'no radio group 1';
	        radio_buttons_grp2[qnum] = 'no radio group 2';
	        radio_buttons_grp3[qnum] = 'no radio group 3';
	        break;
	    }
	    case 1: {
	        radio_buttons_grp1[qnum] = this.getRGAnswer(rglist[0]);
	        radio_buttons_grp2[qnum] = 'no radio group 2';
	        radio_buttons_grp3[qnum] = 'no radio group 3';
	        break;
	    }
	    case 2: {
	        radio_buttons_grp1[qnum] = this.getRGAnswer(rglist[0]);
	        radio_buttons_grp2[qnum] = this.getRGAnswer(rglist[1]);
	        radio_buttons_grp3[qnum] = 'no radio group 3';
	        break;
	    }
	    case 3: {
	        radio_buttons_grp1[qnum] = this.getRGAnswer(rglist[0]);
	        radio_buttons_grp2[qnum] = this.getRGAnswer(rglist[1]);
	        radio_buttons_grp3[qnum] = this.getRGAnswer(rglist[2]);
	        break;
	    }
	}
    // Save to session storage.
	sessionStorage.setItem('rg1_' + qnum, radio_buttons_grp1[qnum]);
	sessionStorage.setItem('rg2_' + qnum, radio_buttons_grp2[qnum]);
	sessionStorage.setItem('rg3_' + qnum, radio_buttons_grp3[qnum]);
}

// Stop the test.
sb.prototype.stopTest = function (e) {
	
	// Grab the exposed question/screen.
    var qlist = $('.question');
    // Get the question id.
    var qid = qlist.attr('id');    
    // Save the screen number.
    var qnum = qid.substring(1, qid.lastIndexOf('_'));    

	// Save data before going to last screen.
    this.saveData();
	
	// Show the GOOD-BYE screen.
	location.href = 'condensation15.html';
    return;
	
}

// ===================================================================================
// data button
// ===================================================================================

// constructor
function db(id) {
    this.$id = $('#' + id);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
db.prototype.bindHandlers = function () {

    var thisObj = this;

    this.$id.click(function (e) {
        return thisObj.handleClick(e);
    });

    this.$id.keydown(function (e) {
        return thisObj.handleKeyDown(e);
    });

    this.$id.keypress(function (e) {
        return thisObj.handleKeyPress(e);
    });
}

// handle click
db.prototype.handleClick = function (e) {

    this.showDataScreen();
    return true;
}

// handle key down
db.prototype.handleKeyDown = function (e) {
    switch (e.keyCode) {
        case this.keys.enter:
        case this.keys.space: {
            this.showDataScreen();
            e.stopPropagation();
            return false;
            break;
        }
    }
    return true;
}

// Consume keypress events. This function is necessary to prevent some browsers (such as Opera) from performing window manipulation 
// on keypress events. Returns true if propagating; false if not. 
db.prototype.handleKeyPress = function (e) {

    if (e.altKey || e.ctrlKey || e.shiftKey) {
        // do nothing 
        return true;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down: {
            e.stopPropagation();
            return false;
        }
    }
    return true;
}

db.prototype.showDataScreen = function (e) {

	// Grab the exposed question/screen.
    var qlist = $('.question');
    
    // Get the question id.
    var qid = qlist.attr('id');
    
    // Save the screen number.
    var qnum = qid.substring(1, qid.lastIndexOf('_')) - 1;
	
    // Move to the next screen.
    qnum = qnum + 2;	
    var docname = 'condensation' + qnum.toString() + '.html';    
    location.href = docname;
    return;
}

// ===================================================================================
// play button 1
// ===================================================================================

// constructor
function pb1(buttonid) {
    this.$id = $('#' + buttonid);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
pb1.prototype.bindHandlers = function () {

    var thisObj = this;

    this.$id.click(function (e) {
        return thisObj.handleClick(e);
    });

    this.$id.keydown(function (e) {
        return thisObj.handleKeyDown(e);
    });

    this.$id.keypress(function (e) {
        return thisObj.handleKeyPress(e);
    });
}

// handle click
pb1.prototype.handleClick = function (e) {

    this.$id.removeAttr('class');
    this.$id.attr('disabled', 'disabled');
    var ifrm = document.getElementById("frmAnimation1");
    var cw = (ifrm.contentWindow || ifrm.contentDocument);    
    cw.animation1.play();
    return true;
}

// handle key down
pb1.prototype.handleKeyDown = function (e) {
	switch (e.keyCode) {
	    case this.keys.enter:
        case this.keys.space: {
	        
            this.$id.removeAttr('class');
            this.$id.attr('disabled', 'disabled');
            var ifrm = document.getElementById("frmAnimation1");
            var cw = (ifrm.contentWindow || ifrm.contentDocument);
            cw.animation1.play();
			//animation1.play();
			
            e.stopPropagation();
            return false;
			break;
        }
    }
    return true;
}

// Consume keypress events. This function is necessary to prevent some browsers (such as Opera) from performing window manipulation 
// on keypress events. Returns true if propagating; false if not. 
pb1.prototype.handleKeyPress = function (e) {

    if (e.altKey || e.ctrlKey || e.shiftKey) {
        // do nothing 
        return true;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down: {
            e.stopPropagation();
            return false;
        }
    }
    return true;
}

// ===================================================================================
// play button 2
// ===================================================================================

// constructor
function pb2(buttonid) {
    this.$id = $('#' + buttonid);
    this.keys = new keyCodes();
    this.bindHandlers();
}

// bind handlers
pb2.prototype.bindHandlers = function () {

    var thisObj = this;

    this.$id.click(function (e) {
        return thisObj.handleClick(e);
    });

    this.$id.keydown(function (e) {
        return thisObj.handleKeyDown(e);
    });

    this.$id.keypress(function (e) {
        return thisObj.handleKeyPress(e);
    });
}

// handle click
pb2.prototype.handleClick = function (e) {

    this.$id.removeAttr('class');
    this.$id.attr('disabled', 'disabled');

    var ifrm = document.getElementById("frmAnimation2");
    var cw = (ifrm.contentWindow || ifrm.contentDocument);
    cw.animation2.play();
    return true;

    //animation2.play();
    //return true;
}

// handle key down
pb2.prototype.handleKeyDown = function (e) {
	switch (e.keyCode) {
	    case this.keys.enter:
        case this.keys.space: {
	        
            this.$id.removeAttr('class');
            this.$id.attr('disabled', 'disabled');

            var ifrm = document.getElementById("frmAnimation2");
            var cw = (ifrm.contentWindow || ifrm.contentDocument);
            cw.animation2.play();
			//animation2.play();
			
            e.stopPropagation();
            return false;
			break;
        }
    }
    return true;
}

// Consume keypress events. This function is necessary to prevent some browsers (such as Opera) from performing window manipulation 
// on keypress events. Returns true if propagating; false if not. 
pb2.prototype.handleKeyPress = function (e) {

    if (e.altKey || e.ctrlKey || e.shiftKey) {
        // do nothing 
        return true;
    }

    switch (e.keyCode) {
        case this.keys.esc:
        case this.keys.enter:
        case this.keys.left:
        case this.keys.up:
        case this.keys.right:
        case this.keys.down: {
            e.stopPropagation();
            return false;
        }
    }
    return true;
}


