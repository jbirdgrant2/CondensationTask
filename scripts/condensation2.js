//var p_num2 = 50; // number of particles
var p_num2 = 30; // number of particles
var p_speed2 = 10; // speed of particles
var p_size2 = 20;    // size of particles
var p_sfreq2 = 100;   // sticky frequency
var p_temp2 = 40;   // temperature

var myboxobj = null;
var myH2O = null;

//// GLOBAL object
//window.condensation2 = {

//    current: null,
//    init: function () {
//        this.current = new Condensation();
//    },
//    getData: function () {
//        var d = this.current.getData();
//        this.current.cleanUp();
//        this.current = null;
//        return "NODATA";
//    },
//    setData: function (d) {
//        this.current.setData(d);
//    }
//}

// ========================================================================= Condensation
function Condensation2() {

    var self = this;

    this.PA = new ParticleAccelerator("condensationCanvas2", 0, false);


    //this.PA.startOver();

    //this.PA.setSpeed(5);
    this.PA.setSpeed(p_speed2);
    //this.PA.useDebugDraw();

    //this.boxObj = this.PA.makeAngleBox(0, 0, 445, 247, 4); // x,y,w,h,cornerAmt
    //this.boxObj = this.PA.makeAngleBox(-100, -100, 493, 900, 4); // x,y,w,h,cornerAmt
    this.boxObj = this.PA.makeAngleBox(-93, -100, 493, 900, 4); // x,y,w,h,cornerAmt
    myboxobj = this.boxObj; // Save to global variable.

    //this.boxObj = this.PA.makeAngleBox(-10, -10, 49, 90, 4); // x,y,w,h,cornerAmt

    //var particleSize = 10;
    var particleSize = p_size2;
    var radius = particleSize / 2;
    var r = radius;
    this.particleSize = particleSize;

    this.H2O = this.PA.makeParticle(radius, "#4f87fb", "#302cd2");

    myH2O = this.H2O;   // Save to global variable.

    // sticky box    
    //this.sodaCan = this.PA.addStickyBox(380, 240, 10, 120, true); // x,y,w,h
    this.sodaCan = this.PA.addStickyBox(382, 240, 10, 120, true); // x,y,w,h

    //this.PA.setStickyFrequency(50);
    this.PA.setStickyFrequency(p_sfreq2);

    // show some particles to start
    //for (var i = 0; i < 50; i++) {
    for (var i = 0; i < p_num2; i++) {
        this.PA.addParticleAtRandomLocation("H2O", this.boxObj, this.particleSize, this.H2O.getCachedClone());
    };    

    this.PA.step(2);
    
    this.playButton = $("#playButton2"); //jq
    //this.playButton.on("click", function () { window.condensation.current.play(); });
    this.playButton.bind("click", function () {
        //window.condensation.current.play();
        animation2.play();
    });

    //this.temp = 70;
    this.temp = p_temp2;
    //this.selectTemp = $("#selectTemp2");
    //this.selectTemp.on("change", function(evt){ self.setTemp(evt.currentTarget.value); });
    //this.selectTemp.bind("change", function (evt) {
    //self.setTemp(evt.currentTarget.value);
    self.setTemp(p_temp2);
    //});
}

// ------------------------------------------------------------------------------------ setTemp
// (sticky frequency is inverse)
Condensation2.prototype.setTemp = function (t) {

    //this.temp = t;

    //switch (t) {
        //case "40":
    //this.PA.setStickyFrequency(100);
    this.PA.setStickyFrequency(p_sfreq2);

          //  break;
        //case "70":
          //  this.PA.setStickyFrequency(50);
            //break;
        //case "90":
          //  this.PA.setStickyFrequency(0);
            //break;
    //};
}

// ------------------------------------------------------------------------------------ play
Condensation2.prototype.play = function () {

    this.PA.startOver();

    //for (var i = 0; i < 50; i++) {
    for(var i=0; i < p_num2; i++){
        this.PA.addParticleAtRandomLocation("H2O", this.boxObj, this.particleSize, this.H2O.getCachedClone());
    };

    this.disableControls();
    this.PA.startAnime();

    window.condensationtimerID = window.setTimeout(function () {
        //window.condensation.current.PA.stopAnime(); 
        //window.condensation.current.enableControls();
        animation2.PA.stopAnime();
        animation2.enableControls();

        //}, 8000);
        //}, 15000);
    }, 12000);
}


// ------------------------------------------------------------------------------------ enableControls
Condensation2.prototype.enableControls = function () {

    var pb = parent.document.getElementById('playButton2');
    pb.removeAttribute('disabled');
    pb.setAttribute('class', 'enabled');

    //this.playButton.attr("disabled", false);
    //this.playButton.addClass("enabled");
    //this.selectTemp.attr("disabled", false);
}

// ------------------------------------------------------------------------------------ disableControls
Condensation2.prototype.disableControls = function () {

    this.playButton.removeClass("enabled");
    this.playButton.attr("disabled", true);
    //this.selectTemp.attr("disabled", true);
}

// ------------------------------------------------------------------------------------ cleanUp
Condensation2.prototype.cleanUp = function () {

    this.PA.cleanUp();
    this.PA = null;

    this.playButton.off("click");

    window.clearTimeout(window.condensationtimerID);
    window.condensationtimerID = null;
}



