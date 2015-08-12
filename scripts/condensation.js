//var p_num1 = 19; // number of particles
var p_num1 = 30; // number of particles
//var p_speed1 = 30; // speed of particles
var p_speed1 = 10; // speed of particles
var p_size1 = 20;    // size of particles
var p_temp1 = 90;   // temperature

////// GLOBAL object
//window.condensation = {
    
//    current:null,
//    init:function(){
//        this.current = new Condensation();
//    },
//    getData:function(){
//        var d = this.current.getData();
//        this.current.cleanUp();
//        this.current = null;
//        return "NODATA";
//    },
//    setData:function(d){
//        this.current.setData(d);
//    }
//}

//$(document).ready(function () {

    
    //<img src="/images/condensation1Wall.png" aria-describedby="q8_img_desc" alt="The animation shows a model of water molecule movement at the microscopic scale. Water molecules are moving quickly in random directions outside of a plastic water bottle. There is plenty of space between each water molecule. A water particle appears to bounce when it collides with another water particle or with the wall." />
    
//window.onload = function () {
//    //var canvas = $('#condensationCanvas'); // grabs the canvas element
//    //var context = canvas.getContext('2d'); // returns the 2d context object
  
    
//    //img.attributes.setNamedItem('aria-describedby', 'q8_img_desc');
//    //img.attributes.setNamedItem('alt', 'The animation shows a model of water molecule movement at the microscopic scale. Water molecules are moving quickly in random directions outside of a plastic water bottle. There is plenty of space between each water molecule. A water particle appears to bounce when it collides with another water particle or with the wall.');
//    //context.drawImage(img, 20, 20); // draws the image at the specified x and y location

//    //var canvas = document.getElementById("condensationCanvas");
//    //var ctx = canvas.getContext("2d");
//    //var img = new Image(); //creates a variable for a new image
//    //img.src = "./images/condensation1Wall.png" // specifies the location of the image
//    ////var img = document.getElementById("scream");
//    ////background-image:url('../images/condensation1Wall.png');
//    //ctx.drawImage(img, 10, 10);
//}

//});

// ========================================================================= Condensation
function Condensation() {

    var self = this;

    this.PA = new ParticleAccelerator("condensationCanvas", 0, false);

    //this.PA.cleanUp();

    //this.PA.setSpeed(5);
    this.PA.setSpeed(p_speed1);
    //this.PA.useDebugDraw();

    //this.boxObj = this.PA.makeAngleBox(0, 0, 445, 247, 4); // x,y,w,h,cornerAmt
    this.boxObj = this.PA.makeAngleBox(-100, -100, 498, 900, 4); // x,y,w,h,cornerAmt

    //var particleSize = 10;
    var particleSize = p_size1;
    var radius = particleSize/2;
    var r = radius;
    this.particleSize = particleSize;

    this.H2O = this.PA.makeParticle(radius, "#4f87fb", "#302cd2");

    //// Soda Can's sticky box
    //this.sodaCan = this.PA.addStickyBox(192, 58, 80, 130, true); // x,y,w,h
    //this.PA.setStickyFrequency(50);

    // show some particles to start
    //for(var i=0; i < 50; i++){
    for(var i=0; i < p_num1; i++){
        this.PA.addParticleAtRandomLocation("H2O", this.boxObj, this.particleSize, this.H2O.getCachedClone());
    };
    this.PA.step(2);

    // this.playButton = $("#playButton"); //jq
    // //this.playButton.on("click", function () { window.condensation.current.play(); });
    // this.playButton.bind("click", function () {
        // //window.condensation.current.play();
        // animation1.play();
    // });
    
    //this.temp = 70;
    this.temp = p_temp1;
    //this.selectTemp = $("#selectTemp");
    //this.selectTemp.on("change", function(evt){ self.setTemp(evt.currentTarget.value); });
    //this.selectTemp.bind("change", function (evt) {
    //self.setTemp(evt.currentTarget.value);
    self.setTemp(p_temp1);

   

    //});
}

// ------------------------------------------------------------------------------------ setTemp
// (sticky frequency is inverse)
Condensation.prototype.setTemp = function(t){

//    this.temp = t;

    //switch(t){
    //case "40":
    //    this.PA.setStickyFrequency(100);
        //break;
    //case "70":
      //  this.PA.setStickyFrequency(50);
        //break;
    //case "90":
        this.PA.setStickyFrequency(0);
        //break;
    //};
}

// ------------------------------------------------------------------------------------ play
Condensation.prototype.play = function(){
		
    this.PA.startOver();

    //for(var i=0; i < 50; i++){
    for(var i=0; i < p_num1; i++){
        this.PA.addParticleAtRandomLocation("H2O", this.boxObj, this.particleSize, this.H2O.getCachedClone());
    };

    //console.log('disabling controls now...');
    this.disableControls();
    this.PA.startAnime();
    
    window.condensationtimerID = window.setTimeout(function(){ 
        //window.condensation.current.PA.stopAnime(); 
        //window.condensation.current.enableControls();
        animation1.PA.stopAnime(); 
        animation1.enableControls();

    //}, 8000);
    }, 6000);
}


// ------------------------------------------------------------------------------------ enableControls
Condensation.prototype.enableControls = function () {
    var pb = parent.document.getElementById('playButton1');
    pb.removeAttribute('disabled');
    pb.setAttribute('class', 'enabled');

    //this.playButton.attr("disabled", false);
    //this.playButton.addClass("enabled");
    //this.selectTemp.attr("disabled", false);
}

// ------------------------------------------------------------------------------------ disableControls
Condensation.prototype.disableControls = function(){
    //this.playButton.removeClass("enabled");
    $('#playButton1').removeClass("enabled");
    $('#playButton1').attr("disabled", true);    
    //this.selectTemp.attr("disabled", true);    
}

// ------------------------------------------------------------------------------------ cleanUp
Condensation.prototype.cleanUp = function(){
    //console.log('cleaning up');

    this.PA.cleanUp();
    this.PA = null;

    //this.playButton.off("click");
    $('#playButton1').off("click");

    window.clearTimeout(window.condensationtimerID);
    window.condensationtimerID = null;
}

