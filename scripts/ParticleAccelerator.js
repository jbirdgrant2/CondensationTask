
// ------------------------------------------------------------------------------------ ParticleAccelerator
function ParticleAccelerator(canvasID, gravity, extraRandom){

    //console.log(canvasID);

    if(!gravity){gravity = 0;}

    if(extraRandom){
        this.extraRandom = 80;
    }else{
        this.extraRandom = 0;
    }

    this.SCALE = 30; // pixels per meter
    this.PARTICLE_SPEED = 1.1;

    this.canvasID = canvasID;
    this.canvas = document.getElementById(canvasID);



    this.stage = new cjs.Stage(this.canvas);
    this.world = new b2World(new b2Vec2(0,gravity), true); // gravity, allow "sleep" (don't simulate inactive bodies)

    var self = this;
    cjs.Ticker.setFPS(0);
    cjs.Ticker.setPaused(true);
    cjs.Ticker.addEventListener("tick", function(){ self.animate(); });
    // see: startAnime FPS will be set to 60

    this.actors = [];
    this.debugDrawing = false;

    this.evaporation = false;
    this.evaporationList = [];
    this.evaporationTweens = [];
    this.evaporationCallback = null;
    this.evaporationCount = 0;

    this.condensation = false;
    this.condensationList = [];
    this.condensationTweens = [];
    this.stickyBox;
    this.stickyFrequency = 0;
    this.stickyInterior = false;
}  


// ------------------------------------------------------------------------------------ setSpeed
ParticleAccelerator.prototype.setSpeed = function(s){

    this.PARTICLE_SPEED = s;
}


// ------------------------------------------------------------------------------------ animate
ParticleAccelerator.prototype.animate = function(){
    
    if(cjs.Ticker.getPaused()){return;};

    if(this.evaporation){ this.evaporateList(); };
    if(this.condensation){ this.condensateList(); };

    this.world.Step(
        1/60  // frame-rate
        ,2   // velocity iterations, how strongly to correct velocity
        ,2   // position iterations, how strongly to correct position
    );

    if(this.debugDrawing){ this.world.DrawDebugData(); };

    this.world.ClearForces();

    for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
        if (b.GetUserData() != null) {
            
            var velocity = b.GetLinearVelocity();
            var speed = velocity.Length();
            
            if (speed < .1) { // it's possible to get a speed of zero
                b.SetLinearVelocity(new b2Vec2(this.PARTICLE_SPEED, this.PARTICLE_SPEED));
            } else {
                var ratio = this.PARTICLE_SPEED / speed;
                velocity.Multiply(ratio);
                b.SetLinearVelocity(velocity);
            };
            
            if(this.extraRandom){
                var rand = randomFromInterval(0,100);
                if(rand > this.extraRandom){
                    var angle = (Math.random() * 2 * Math.PI);
                    b.SetLinearVelocity(new b2Vec2(this.PARTICLE_SPEED * Math.cos(angle), this.PARTICLE_SPEED * Math.sin(angle)));
                };
            };
        };
    };
    
    for(var i=0; i < this.actors.length; i++) {
        this.actors[i].update();
    };

    if(!this.debugDrawing){ this.stage.update(); }; // Easel
};



// ------------------------------------------------------------------------------------ startAnime
ParticleAccelerator.prototype.startAnime = function(){
    
    cjs.Ticker.setPaused(false);
    cjs.Ticker.setFPS(60);
};


// ------------------------------------------------------------------------------------ stopAnime
ParticleAccelerator.prototype.stopAnime = function(){

    cjs.Ticker.setPaused(true);
    cjs.Ticker.setFPS(0);
    
};


// ------------------------------------------------------------------------------------ step
ParticleAccelerator.prototype.step = function(steps){

    cjs.Ticker.setPaused(false);
    for(var i=0; i < steps; i++){
        this.animate();
    }
    cjs.Ticker.setPaused(true);
}


// ------------------------------------------------------------------------------------ addWall
ParticleAccelerator.prototype.addWall = function(pX, pY, w, h, a) {

    var bodyDef = new b2BodyDef();
    bodyDef.position.Set((pX + (w/2))/this.SCALE, (pY + (h/2))/this.SCALE);
    bodyDef.type = b2Body.b2_staticBody; // static
    if(a){ bodyDef.angle = a; }

    var polygonShape = new b2PolygonShape();
    polygonShape.SetAsBox((w/2)/this.SCALE, (h/2)/this.SCALE);

    var fixtureDef = new b2FixtureDef();
    fixtureDef.shape = polygonShape;
    fixtureDef.density = 1;
    fixtureDef.restitution = 0;
    fixtureDef.friction = 0;

    var body = this.world.CreateBody(bodyDef);
    body.CreateFixture(fixtureDef);
    return body;
}


// ------------------------------------------------------------------------------------ makeBox
ParticleAccelerator.prototype.makeBox = function(x,y,w,h){

    var t = this.addWall(x,y,w,2,0);     // top
    this.setTopWall(t);
    var r = this.addWall((x+w),y,2,h,0); // right
    var b = this.addWall(x,(y+h),w,2,0); // bottom
    var l = this.addWall(x,y,2,h,0);     // left
    
    return [t,r,b,l];
}


// ------------------------------------------------------------------------------------ makeAngleBox
// adds diagonals to corners
ParticleAccelerator.prototype.makeAngleBox = function(x,y,w,h,cornerDistance){

    var bodies = this.makeBox(x,y,w,h);

    var d = cornerDistance;
    var tl = this.makeAngleCorner(x,y,d, 2.35); 
    var tr = this.makeAngleCorner(x+w-(2*d),y,d, -2.35); 
    var bl = this.makeAngleCorner(x,y+h-(2*d),d, -2.35); 
    var br = this.makeAngleCorner(x+w-(2*d),y+h-(2*d),d, 2.35); 

    // this.makeBox(x+d,y+d,w-(2*d),h-(2*d));//an internal box
    bodies.push(tl,tr,bl,br);

    return {bodies:bodies, dim: {
        x:(x+d),
        y:(y+d),
        w:(w-(2*d)),
        h:(h-(2*d)),
        maxX:((x+d) + (w-(2*d))),
        maxY:((y+d) + (h-(2*d))) }};
}


// ------------------------------------------------------------------------------------ makeAngleCorner
// creates a diagonal wall
ParticleAccelerator.prototype.makeAngleCorner = function(x,y,d,a){

    var d2 = Math.pow(d, 2);
    var c = Math.sqrt(d2 + d2); // hypotenuse

    var bodyDef = new b2BodyDef();
    bodyDef.position.Set((x + d)/this.SCALE, (y + d)/this.SCALE);
    bodyDef.type = b2Body.b2_staticBody; // static
    bodyDef.fixedRotation = true;
    bodyDef.angle = a;

    var polygonShape = new b2PolygonShape();
    polygonShape.SetAsBox(c/this.SCALE, 1/this.SCALE);

    var fixtureDef = new b2FixtureDef();
    fixtureDef.shape = polygonShape;
    fixtureDef.density = 1;
    fixtureDef.restitution = 0;
    fixtureDef.friction = 0;

    var body = this.world.CreateBody(bodyDef);
    body.CreateFixture(fixtureDef);
    return body;
}


// ------------------------------------------------------------------------------------ removeBodies
ParticleAccelerator.prototype.removeBodies = function(arr){

    for(var i=0; i < arr.length; i++){
        this.world.DestroyBody(arr[i]);
    };
}


// ------------------------------------------------------------------------------------ addParticleAtRandomLocation
ParticleAccelerator.prototype.addParticleAtRandomLocation = function(type, boxObj, size, easelObj){

    var randX = randomFromInterval(boxObj.dim.x, boxObj.dim.maxX)/this.SCALE;
    var randY = randomFromInterval(boxObj.dim.y, boxObj.dim.maxY)/this.SCALE;

    this.addParticle(type, randX, randY, size, easelObj);
}


// ------------------------------------------------------------------------------------ makeParticle
ParticleAccelerator.prototype.makeParticle = function(radius, color1, color2){

    var newParticle = new cjs.Shape();
    newParticle.graphics.rf([color1, color2], [0, 1], radius, radius-4, 0, radius, radius/4, (2 * radius)).dc(radius,radius,radius);
    newParticle.regX = radius;
    newParticle.regY = radius;
    
    newParticle.getCachedClone = function(){

        var size = (2 * radius);
        var clone = this.clone(false);
        clone.cache(0,0,size,size);
        return clone;
    };

    return newParticle;
}


// ------------------------------------------------------------------------------------ addParticle
ParticleAccelerator.prototype.addParticle = function(type, x, y, size, easelObj){
    
    var randomAngle = (Math.random() * 2 * Math.PI);

    var circBody = this.makeCircleBody(size, x, y, randomAngle);
    var skin = easelObj;
    this.stage.addChild(skin);  // Easel

    var actor = new Actor(type, circBody, skin, this);
    circBody.SetUserData({"actor":actor});

    this.actors.push(actor);
}


// ------------------------------------------------------------------------------------ removeParticle
ParticleAccelerator.prototype.removeParticle = function(actorID){

    var index = null;
    for(var i=0; i < this.actors.length; i++){
        if(this.actors[i].id == actorID){
            index = i;
            
            this.stage.removeChild(this.actors[i].skin);
            this.world.DestroyBody(this.actors[i].body);

            this.actors[i].skin.uncache();
        };
    };
    this.actors.splice(index,1);
}


// ------------------------------------------------------------------------------------ evaporateList
ParticleAccelerator.prototype.evaporateList = function(){

    for(var i=0; i < this.evaporationList.length; i++){
        var id = this.evaporationList[i];
        this.evaporateParticle(id);
    };
    
    this.evaporationList = [];
};


// ------------------------------------------------------------------------------------ evaporateParticle
ParticleAccelerator.prototype.evaporateParticle = function(actorID){

    this.evaporationCount++;

    var index = null;
    var skin = null;
    for(var i=0; i < this.actors.length; i++){
        if(this.actors[i].id == actorID){
            index = i;
            skin = this.actors[i].skin;
            body = this.actors[i].body;
            body.SetActive(false);
            this.actors[i].active = false;
            if(this.evaporationCallback){this.evaporationCallback();}
        };
    };

    var self = this;
    cjs.Tween.get(skin).to({y:(skin.y - 100), x:(skin.x + randomFromInterval(-50,50))}, 1500).call(function(){
        self.stage.removeChild(skin);
        skin.uncache();
    });

    this.evaporationTweens.push(skin);
}



// ------------------------------------------------------------------------------------ removeAllParticles
ParticleAccelerator.prototype.removeAllParticles = function(){

    while(this.actors.length){
        this.removeParticle(this.actors[0].id);
    };

    this.actors = [];
}


// ------------------------------------------------------------------------------------ makeCircleBody
// there are 3 pieces to create a BOX2D "body": 
// shape, fixture, body def
ParticleAccelerator.prototype.makeCircleBody = function(size, x, y, angle){

    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody; // dynamic
    bodyDef.position.Set(x, y);

    var circleShape = new b2CircleShape((size/2)/this.SCALE);

    var fixtureDef = new b2FixtureDef();
    fixtureDef.density = 1;
    fixtureDef.friction = 0;
    fixtureDef.restitution = 1;
    fixtureDef.shape = circleShape;

    var body = this.world.CreateBody(bodyDef);
    body.CreateFixture(fixtureDef);

    body.SetLinearVelocity(new b2Vec2(this.PARTICLE_SPEED * Math.cos(angle), this.PARTICLE_SPEED * Math.sin(angle)));
    return body;
}


// ------------------------------------------------------------------------------------ startOver
ParticleAccelerator.prototype.startOver = function(){

    this.stopAnime();

    for(var i=0; i < this.evaporationTweens.length; i++){
        cjs.Tween.removeTweens(this.evaporationTweens[i]);
    };
    this.evaporationTweens = [];
    this.evaporationList = [];
    this.evaporationCount = 0;

    for(var i=0; i < this.condensationTweens.length; i++){
        cjs.Tween.removeTweens(this.condensationTweens[i]);
    };
    this.condensationTweens = [];
    this.condensationList = [];


    this.removeAllParticles(); 

    if(this.debugDrawing){
        this.world.DrawDebugData();
    }else{ 
        this.stage.update();
    };


};


// ------------------------------------------------------------------------------------ useDebugDraw
ParticleAccelerator.prototype.useDebugDraw = function() {

    this.debugDrawing = true;

    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(this.canvas.getContext("2d"));
    debugDraw.SetDrawScale(this.SCALE);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

    this.world.SetDebugDraw(debugDraw); 
}


// ------------------------------------------------------------------------------------ cleanUp
ParticleAccelerator.prototype.cleanUp = function() {

    this.stopAnime();

    // remove evap tweens
    for(var i=0; i < this.evaporationTweens.length; i++){
        cjs.Tween.removeTweens(this.evaporationTweens[i]);
    };
    this.evaporationTweens = [];
    this.evaporationList = [];

    // remove cond tweens
    for(var i=0; i < this.condensationTweens.length; i++){
        cjs.Tween.removeTweens(this.condensationTweens[i]);
    };
    this.condensationTweens = [];
    this.condensationList = [];
    

    this.removeAllParticles(); // remove ALL particles

    // remove all other bodies
    for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
        this.world.DestroyBody(b);
    };
    this.world = null;

    this.stage.removeAllChildren();
    this.stage.removeAllEventListeners();
    this.stage.uncache();
    this.stage = null;

    cjs.Ticker.setPaused(false); //leave ticker unpaused
    cjs.Ticker.removeAllEventListeners("tick");
    cjs.Ticker.setFPS(0);
    cjs.Ticker.on("tick", cjs.Tween); // muy importante

}


// ------------------------------------------------------------------------------------ setTopWall
ParticleAccelerator.prototype.setTopWall = function(wall){

    this.topWall = wall;
    var pos = this.topWall.GetPosition();

    this.topWallstartX = pos.x;
    this.topWallstartY = pos.y;
}


// ------------------------------------------------------------------------------------ useEvaporation
ParticleAccelerator.prototype.useEvaporation = function(bool, freq){

    var moveTopWallUp = 17;
    var FREQUENCY = freq;

    var contListener = new b2ContactListener();
    var self = this;
    contListener.BeginContact = function(c){

        // NOTE: you can't remove a contact listener once it's been created
        if(!self.evaporation){return;}    

        var A = c.GetFixtureA().GetBody();
        var B = c.GetFixtureB().GetBody();

        if(A == self.topWall){
            if(randomFromInterval(0,100) > FREQUENCY){
                self.evaporationList.push(B.GetUserData().actor.id)
            }
        };
    };

    if(bool == true){
        this.evaporation = true;
        this.topWall.SetPosition(new b2Vec2(this.topWallstartX, this.topWallstartY - (moveTopWallUp/this.SCALE)));
        this.world.SetContactListener(contListener);
    }else{
        this.evaporation = false;
        this.topWall.SetPosition(new b2Vec2(this.topWallstartX, this.topWallstartY));
    };

}


// ------------------------------------------------------------------------------------ addStickyBox
// CONDENSATION
ParticleAccelerator.prototype.addStickyBox = function(x,y,w,h,interior){

    // add box body to world
    var bodyDef = new b2BodyDef();
    bodyDef.position.Set((x + (w/2))/this.SCALE, (y + (h/2))/this.SCALE);
    bodyDef.type = b2Body.b2_staticBody; 

    var polygonShape = new b2PolygonShape();
    polygonShape.SetAsBox((w/2)/this.SCALE, (h/2)/this.SCALE);

    var fixtureDef = new b2FixtureDef();
    fixtureDef.shape = polygonShape;
    fixtureDef.density = 1;
    fixtureDef.restitution = 1;
    fixtureDef.friction = 0;
    fixtureDef.isSensor = true;

    var body = this.world.CreateBody(bodyDef);
    var fix = body.CreateFixture(fixtureDef);

    this.stickyBox = body;
    this.stickyBoxDim = [x,y,w,h];
    if(interior){
        this.stickyBoxInterior = true;
    };

    // turn on condensation
    this.condensation = true;

    var contListener = new b2ContactListener();
    var self = this;
    contListener.BeginContact = function(c){

        var A = c.GetFixtureA().GetBody();
        var B = c.GetFixtureB().GetBody();

        if(A == self.stickyBox && B.GetUserData().actor.type == "H2O"){
            if(randomFromInterval(1,99) < self.stickyFrequency){
                self.condensationList.push(B.GetUserData().actor.id)
            };
        };

        if(B == self.stickyBox && A.GetUserData().actor.type == "H2O"){
            if(randomFromInterval(1,99) < self.stickyFrequency){
                self.condensationList.push(A.GetUserData().actor.id)
            };
        };
    };
    
    this.world.SetContactListener(contListener);

    return body;
}


// ------------------------------------------------------------------------------------ setStickyFrequency
ParticleAccelerator.prototype.setStickyFrequency = function(amt){
    this.stickyFrequency = amt;
}


// ------------------------------------------------------------------------------------ condensateList
ParticleAccelerator.prototype.condensateList = function(){

    for(var i=0; i < this.condensationList.length; i++){
        var id = this.condensationList[i];
        this.condensateParticle(id);
        // J Grant. Add new particle at random location.
        this.addParticleAtRandomLocation(myH2O, myboxobj, p_size2, myH2O.getCachedClone());        
    };
    
    this.condensationList = [];
};

// ------------------------------------------------------------------------------------ condensateParticle
ParticleAccelerator.prototype.condensateParticle = function(actorID){
    //console.log(actorID);

    var index = null;
    var skin = null;
    for(var i=0; i < this.actors.length; i++){
        if(this.actors[i].id == actorID){
            index = i;
            skin = this.actors[i].skin;
            //console.log(skin == null);
            body = this.actors[i].body;
            body.SetActive(false);
            this.actors[i].active = false;
        };
    };

    var x = this.stickyBoxDim[0];
    var y = this.stickyBoxDim[1];
    var w = this.stickyBoxDim[2];
    var h = this.stickyBoxDim[3];
  
    // move particle to interior of box, then randomize movement
    if (this.stickyBoxInterior) {

        //console.log('x:');
        //console.log(randomFromInterval(x, x + w));

        //console.log('y:');
        //console.log(randomFromInterval(y, y + h));

        // TODO: BOMBING HERE.
        //cannot read property "get" of undefined.
        //console.log(cjs.Tween); // undefined.
        //console.log(cjs);
        cjs.Tween.get(skin).to({ "x": randomFromInterval(x, x + w), "y": randomFromInterval(y, y + h) }, 1000)

            // J. Grant. Have particles stop once they condensate.
            //.call(randomMovement);
    }else{
        // randomize at contact point

        // J. Grant. Have particles stop once they condensate.
        // randomMovement();
    }

    function randomMovement(){
        cjs.Tween.get(skin).to({"x":skin.x + randomFromInterval(-2,2), "y":skin.y + randomFromInterval(-2,2)}, 100).call( randomMovement );
    }

    this.condensationTweens.push(skin);
};


// ------------------------------------------------------------------------------------ Actor
function Actor(type, body, skin, particleAccelerator) {

    this.id = "actor_" + randomFromInterval(0,100000);
    this.type = type;
    this.body = body;
    this.skin = skin;
    this.active = true;
    this.particleAccelerator = particleAccelerator;
};

Actor.prototype.update = function(){

    if(!this.active){ return; };

    // translate box2d positions to pixels
    this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
    this.skin.x = this.body.GetWorldCenter().x * this.particleAccelerator.SCALE;
    this.skin.y = this.body.GetWorldCenter().y * this.particleAccelerator.SCALE;
}

Actor.prototype.restore = function(){
    this.body.SetActive(true);
    this.skin.alpha = 1;
    this.active = true;
}



// ------------------------------------------------------------------------------------ randomFromInterval
function randomFromInterval(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
};


// ------------------------------------------------------------------------------------ twoPiRad
// change radian to use positive integer 2 PI circle
function twoPiRad(r){
  if(r < 0){ return -r; } else { return (Math.PI + (Math.PI - r)); };
};


// ---------------------------------------------------------------------------- shorten BOX2D namespaces
var b2Vec2     = Box2D.Common.Math.b2Vec2,
b2BodyDef      = Box2D.Dynamics.b2BodyDef,
b2Body         = Box2D.Dynamics.b2Body,
b2FixtureDef   = Box2D.Dynamics.b2FixtureDef,
b2Fixture      = Box2D.Dynamics.b2Fixture,
b2World        = Box2D.Dynamics.b2World,
b2ContactListener = Box2D.Dynamics.b2ContactListener,
b2MassData     = Box2D.Collision.Shapes.b2MassData,
b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
b2CircleShape  = Box2D.Collision.Shapes.b2CircleShape,
b2DebugDraw    = Box2D.Dynamics.b2DebugDraw;
