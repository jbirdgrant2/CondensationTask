//Word-level highlighting support for Chrome TTS API

//This source code is being made available under the Revised BSD or The BSD 3-Clause License.
//Copyright (c) 2011-2013, Benetech Inc. All rights reserved.
//Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials 
//provided with the distribution.
//Neither the name of Benetech nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF 
//MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
//SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
//HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, 
//EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Edits were made to work with the ETS text-to-speech menu.

var BeneSpeak = {
    
    'BLOCK_DELIMITERS' : ['p', 'div', 'pagenum', 'td', 'table', 'li', 'ul', 'ol', 'strong', 'em', 'h2', 'input'],
    //'BOUNDARY_PUNCTUATION' : [',', ';', '.', '-', 'Ð', 'Ñ', '?', '!'],
    //'IGNORABLE_PUNCTUATION': ['"', '\'', 'Ò', 'Ó', 'Ô', 'Õ'],
    //'BOUNDARY_PUNCTUATION': [',', ';', '.', '--', 'ï¿½', 'ï¿½', '?', '!', ')', '('],

    // Boundary punctuation was altered to include mdash and '--'.
    'BOUNDARY_PUNCTUATION': [',', ';', '.', '—', 'ï¿½', 'ï¿½', '?', '!', ')', '(', '"', '--'],
    'IGNORABLE_PUNCTUATION' : ['"', '\'', 'ï¿½', 'ï¿½', 'ï¿½', 'ï¿½'],

    '_tokenize': function (element) {
        var r = { 'src' : element, 'spanMap' : {}, 'text' : "", 'ttsMarkup' : "", 'markup' : element.innerHTML, 'lastOffset' : null};
        var t = {
            inTag : false,
            counter : 0,
            wsIdx : -1,
            weIdx : -1,
            text : '',
            markup : '',
            word : '',
            html : ''
        }
        
        //var raw = element.innerHTML;
        var raw = element.html();
        var limit = raw.length;
        var i = 0;
        while (i <= limit) {
            if (t.inTag) {
                t.html += raw[i];
                if (raw[i] == ">") {
                    t.inTag = false;
                    // if it's a block element delimiter, flush
                    var blockCheck = t.html.match(/<\/(.*?)>$/);
                    if (blockCheck != null) {
                        if (this.BLOCK_DELIMITERS.indexOf(blockCheck[1]) > -1) {
                            this._flush(t, r);
                            t.text += ' ';
                        }
                    }
                }
            } else {
                if (i == limit || raw[i].match(/\s/)) {
                    this._flush(t, r);
                    
                    // append the captured whitespace
                    if (i < limit) {
                        t.text += raw[i];
                        t.markup += raw[i];
                    }
                }
                else if (this.BOUNDARY_PUNCTUATION.indexOf(raw[i]) > -1) {
                    this._flush(t, r);
                    
                    t.wsIdx = t.html.length;
                    t.weIdx = t.html.length + 1;
                    t.word += raw[i];
                    t.html += raw[i];
                    
                    this._flush(t, r);
                    
                } else if (raw[i] == "<") {
                    t.inTag = true;
                    t.html += raw[i];
                } else {
                    if (t.word.length == 0) {
                        t.wsIdx = t.html.length;
                    }
                    t.weIdx = t.html.length + 1;
                    t.word += raw[i];
                    t.html += raw[i];
                }
            }
            i++;
        }
        
        r.text = t.text;
        r.ttsMarkup = t.markup;

        return r;
    },
    
    '_flush' : function(t, r) {
        if (t.word.length > 0) {
            var pos = t.text.length;
            r.spanMap[pos] = t.counter;
            t.text += t.word;
            t.markup += t.html.substring(0, t.wsIdx) +
                        '<span class="ttshlf" id="tts_' + t.counter + '">' +
                        t.html.substring(t.wsIdx, t.weIdx) +
                        '</span>' + t.html.substring(t.weIdx, t.html.length);
            t.word = "";
            t.html = "";
            t.wsIdx = -1;
            t.weIdx = -1;
            t.counter++;
        }
    },
    
    'speak' : function(element, callback) {
        var status = this._tokenize(element);        
        element.innerHTML = status.ttsMarkup;		
        this._forTTS = new SpeechSynthesisUtterance(status.text);
    	
        //// Look for available voices.
		//var voices = window.speechSynthesis.getVoices();
        
		//// Use the voice selected at the drop-down list.
        //this._forTTS.voice = voices[document.getElementById("ttsVoices").selectedIndex];
        //this._forTTS.voiceURI = 'native';
		
		//// Set the rate to that selected at the speed drop-down list.
		//this._forTTS.rate = document.getElementById("ttsSpeed").selectedIndex + 1;
		
        //// Remove any existing text highlights first.
        //var matches = document.querySelectorAll("span.ttsDefault, span.ttsBorder, span.ttsCustom1, span.ttsCustom2, span.ttsCustom3, span.ttsCustom4, span.ttsCustom5, span.ttsCustom6, span.ttsCustom7, span.ttsCustom8, span.ttsCustom9, span.ttsCustom10");
        //for (i = 0; i < matches.length; i++) {
          //  matches[i].className = "ttshlf";
        //}
        
        this._forTTS.onboundary = this._getEventListener(element, status, callback);	

		try {
			speechSynthesis.speak(this._forTTS);
		}
		catch (serr) {
			alert(serr.message);
		}
    },
    
    'stop': function (j) {
        speechSynthesis.cancel();        
    },
    
    '_getEventListener' : function(element, status, callback) {
        return function (event) {

            // Set highlighting style, depending on user selection at drop-down.
            var hltClass = "tts" + document.getElementById("ttsHighlights")[document.getElementById("ttsHighlights").selectedIndex].value;
			
            if (event.name == 'word') {
                // look up the offset in the map
                if (status.spanMap.hasOwnProperty(event.charIndex)) {
                    if (status.lastOffset != null) {
                        var os = document.getElementById('tts_' + status.spanMap[status.lastOffset])
                        //os.className = os.className.replace('ttshln', 'ttshlf');
                        os.className = os.className.replace(hltClass, 'ttshlf');
                    }
                    var ts = document.getElementById('tts_' + status.spanMap[event.charIndex]);
                    //ts.className = ts.className.replace('ttshlf', 'ttshln');
                    ts.className = ts.className.replace('ttshlf', hltClass);
                    status.lastOffset = event.charIndex;
                    // Highlighted text should scroll into view.
                    ts.scrollIntoView(true);
                }
            // need to fix this next using onend event
            } else if (event.name == 'interrupted' || event.name == 'end') {
                element.innerHTML = status.markup;
                if (callback != null) {
                    callback();
                }
            }
        };
    },
}
