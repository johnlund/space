/*
/ Solar System
*/

//Debug
var debug = true;
var dDrawGrid = false;

//Stars
var aStars = new Array();
var kNumStars = 250;

//Constants
var kGrav = 6.67384*Math.pow(10,-11);
var kAries = Math.PI;

//Celestial Bodies
//Order of bodies - sun
//Order of data - 0-name, 1-orbit, 2-planetary radius, 3-mass, 4-semi-major axis, 5-eccentricity, 6-mean anomaly at epoch, 7-longitude of ascending node, 8-argument of perihelion, 9-orbital period (days), 10-orbit position, 11-position(x,y)
var aBodyData = [
	["sun", 0, 6.955*Math.pow(10,5), 1.9891*Math.pow(10,30), 0, 0, 0, 0, 0, 0, 0, [0,0]],
	["mercury", 0, 2439.7, 3.3022*Math.pow(10,23), 57909100, 0.2056, 3.05076572, 0.843535081, 0.508309691, 87.969, 1, [0,0]],
	["venus", 0, 6051.8, 4.8685*Math.pow(10,24), 108208930, 0.0067, 0.880461884, 1.33815598, 0.957353063, 224.70069, 2, [0,0]],
	["earth", 0, 6378.1, 5.9736*Math.pow(10,24), 149598261, 0.01671123, 6.23985157, 6.08665006, 1.99330267, 365.256363004, 3, [0,0]],
	["mars", 0, 3396.2, 6.4185*Math.pow(10,23), 227939100, 0.093315, 0.337832911, 0.865020084, 5.00101408, 686.971, 4, [0,0]],
	["jupiter", 0, 71492, 1.8986*Math.pow(10,27), 778547200, 0.048775, 0.328436059, 1.75391627, 4.80080736, 4331.572, 5, [0,0]],
	["saturn", 0, 60268, 5.6846*Math.pow(10,26), 1433449370, 0.055723219, 5.59110554, 1.98344122, 5.86454822, 10759.22, 6, [0,0]],
	["uranus", 0, 25559, 8.6810*Math.pow(10,25), 2876679082, 0.044405586, 2.49504795, 1.29136599, 1.68496386, 30799.095, 7, [0,0]],
	["neptune", 0, 24764, 1.0243*Math.pow(10,26), 4503443661, 0.011214269, 4.67342068, 2.30024464, 4.63641223, 60190, 8, [0,0]],
	["moon", 3, 1737.10, 7.3477*Math.pow(10,22), 384399, 0.0549, 0, 0, 0, 27.321582, 1, [0,0]]
	];
var aBodies = new Array();

//Time
var dEpoch = Date.UTC(2000, 00, 01, 11, 58, 55, 816);
var dTemp = new Date();
var dCurr = Date.UTC(dTemp.getUTCFullYear(), dTemp.getUTCMonth(), dTemp.getUTCDate(), dTemp.getUTCHours(), dTemp.getUTCMinutes(), dTemp.getUTCSeconds(), dTemp.getUTCMilliseconds());
var dDiff = (dCurr / 1000) - (dEpoch / 1000);
var dStep = 0;

//View
var mainView;

//HTML Elements
var gCanvasElement;
var gDrawingContext;

function initSolarSystem(canvasElement) {
    if (!canvasElement) {
      canvasElement = document.createElement("canvas");
			canvasElement.id = "SolarSystem_canvas";
			document.getElementById('SolarSystem').appendChild(canvasElement);
    }
    
    gCanvasElement = canvasElement;
    gCanvasElement.width = kGridX;
    gCanvasElement.height = kGridY;
    gDrawingContext = gCanvasElement.getContext("2d");

    //Start program
    //Create Stars
    createStars();
    createBodies();

		//View
		mainView = new view();
    
    //Draw Background
    //drawBG();
    //drawBodies();
    

		setInterval('updateScene()', mainView.vFrameRate);
    //setInterval('drawScene()', mainView.vFrameRate);
}

/*
/ Constructors
*/

function body(data)
{
	if (data) {
		this.name = data[0];
		this.orb = data[1];
		this.rad = data[2];
		this.mass = data[3];
		this.semi = data[4];
		this.ecc = data[5];
		this.meanA = data[6];
		this.asc = data[7];
		this.peri = data[8];
		this.orbPe = data[9];
		this.orbP = data[10];

		this.posX = data[11][0];
		this.posY = data[11][1];
	}

	this.tX = 0;
	this.tY = 0;
	this.tSize = 0;

	this.draw = drawBody;
}

function star()
{
	this.posX = Math.random() * kGridX;
	this.posY = Math.random() * kGridY;
	this.size = Math.random() * 3;
}

/*
/	Methods
*/

function drawBody()
{
	if (this.name) {
		//center position based on currently viewed body
		this.tX = kCentX + aBodies[this.orb].posX + this.posX - mainView.body.posX;
		this.tY = kCentY + aBodies[this.orb].posY + this.posY - mainView.body.posY;
		this.tSize = this.rad/mainView.vZoom;
	
		gDrawingContext.beginPath();
		gDrawingContext.arc(this.tX, this.tY, this.tSize, 0, Math.PI * 2, false);
		gDrawingContext.closePath();
		
		gDrawingContext.fillStyle = "#FF0";
		gDrawingContext.fill();
		
		gDrawingContext.textAlign = "center";
		gDrawingContext.textBaseline = "bottom";
		gDrawingContext.fillText(this.name, this.tX, this.tY + this.tSize + 10)
	}
}

function roundNumber(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function drawScene()
{
	//draw new positions
	
	//TODO Draw orbits
	//drawOrbits();
}

function updateScene()
{
	drawBG();
	drawBodies();
	//drawOrbits(aBodies[8]);
	
	//update positions
	mainView.vZoom = mainView.vCurr*Math.pow(10,mainView.vCurrPow);
	
	updateTime();
	
	for (var i = 0; i <= aBodies.length - 1; i++) {
		//for each celestial body, calculate position
		if (i > 0) {
			var tOrb = aBodies[i].orb;
			var n = Math.sqrt(kGrav * (aBodies[tOrb].mass + aBodies[i].mass) / Math.pow((aBodies[i].semi * 1000),3));
			var M = aBodies[i].meanA + (n * dDiff);
			//TODO Use higher accuracy equation?
			var v = M + 2 * aBodies[i].ecc * Math.sin(M) + 1.25 * Math.pow(aBodies[i].ecc,2) * Math.sin(2 * M);
			var r = aBodies[i].semi * (1 - Math.pow(aBodies[i].ecc, 2)) / (1 + aBodies[i].ecc * Math.cos(M));
			//take radians and distance and plot a point
			var tV = v + aBodies[i].asc + aBodies[i].peri + kAries;
			aBodies[i].posX = Math.sin(tV) * (r / mainView.vZoom);
			aBodies[i].posY = Math.cos(tV) * (r / mainView.vZoom);

			drawOrbits(aBodies[i]);
		}

		//debug
		if (debug) {
			$("#debug").html("<p>GameTime (UTC) = "+dGame.getUTCFullYear()+"/"+(dGame.getUTCMonth()+1)+"/"+dGame.getUTCDate()+" "+dGame.getUTCHours()+":"+dGame.getUTCMinutes()+":"+dGame.getUTCSeconds()+"<br />Zoom = "+mainView.vZoom+"</p>");
		}
	}
}

function updateTime()
{
	//Start date at current time
	dTemp = new Date();
	
	//Return milliseconds since 1970
	dCurr = Date.UTC(dTemp.getUTCFullYear(), dTemp.getUTCMonth(), dTemp.getUTCDate(), dTemp.getUTCHours(), dTemp.getUTCMinutes(), dTemp.getUTCSeconds(), dTemp.getUTCMilliseconds());

	//Get slider value to calculate gameTime
	dStep += $('#time').slider('value') * Math.pow(10, 7);
	dGame = new Date(dStep + dCurr);
	
	//Get time since epoch in seconds by subtracting (milliseconds from 1970 to epoch) from (milliseconds from 1970 to now)
	dDiff = (dGame / 1000) - (dEpoch / 1000);
}

function drawBG()
{
	//If debug - draw grid is on, draw a grid
	if(dDrawGrid) {
		gDrawingContext.strokeStyle = "#333";
	}

	//Draw black background
	gDrawingContext.fillStyle = "#000";
	gDrawingContext.fillRect(0, 0, kGridX, kGridY);

	//Draw stars
	for (var i in aStars) {
		gDrawingContext.beginPath();
		gDrawingContext.arc(aStars[i].posX, aStars[i].posY, (aStars[i].size/2), 0, Math.PI * 2, false);
		gDrawingContext.closePath();

		gDrawingContext.fillStyle = "#FFF";
		gDrawingContext.fill();
	}
}

function drawBodies()
{
	for (var i in aBodies) {
		//only draw bodies that are orbiting current mainView.center (no moons)
		if (aBodies[i].orb == mainView.body.orb || aBodies[i].orb == mainView.body.orbP) {
			aBodies[i].draw();
		}
	}
}

function drawOrbits(body)
{
	gDrawingContext.beginPath();
	
	for (var i = 0; i <= body.orbPe; i++) {
		//TODO Make this a function so we can use it in both draw orbits and update positions
		var n = Math.sqrt(kGrav * (aBodies[body.orb].mass + body.mass) / Math.pow((body.semi * 1000),3));
		var M = body.meanA + (n * (i * 86400));
		var v = M + 2 * body.ecc * Math.sin(M) + 1.25 * Math.pow(body.ecc,2) * Math.sin(2 * M);
		var tV = v + body.asc + body.peri + kAries;
		var r = body.semi * (1 - Math.pow(body.ecc, 2)) / (1 + body.ecc * Math.cos(M));

		if (i == 0)	{
			var x1 = Math.sin(tV) * (r / mainView.vZoom) + kCentX + aBodies[body.orb].posX - mainView.body.posX;
			var y1 = Math.cos(tV) * (r / mainView.vZoom) + kCentY + aBodies[body.orb].posY - mainView.body.posY;

			gDrawingContext.moveTo(x1, y1);
		}
		else {
			var x2 = Math.sin(tV) * (r / mainView.vZoom) + kCentX + aBodies[body.orb].posX - mainView.body.posX;
			var y2 = Math.cos(tV) * (r / mainView.vZoom) + kCentY + aBodies[body.orb].posY - mainView.body.posY;
			
			gDrawingContext.lineTo(x2, y2);
		}
	}

	gDrawingContext.closePath();

	gDrawingContext.strokeStyle = "#FF0";
	gDrawingContext.stroke();
}

function createBodies()
{
	for (var i in aBodyData) {
		var gBody = new body(aBodyData[i]);
		aBodies.push(gBody);
	}
}

function createStars()
{
	for (var i = 0; i < kNumStars; i++) {
		var gStar = new star();
		aStars.push(gStar);
	}
}
