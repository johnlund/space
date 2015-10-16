//UI For Solar System

//Dimensions
var kGridX = 800;
var kGridY = 600;
var kCentX = kGridX/2;
var kCentY = kGridY/2;
var kTileSize = 25;

function view()
{
	this.body = aBodies[0];
	
	this.vCurr = 3;
	this.vCurrPow = 5;
	this.vZoom = this.vCurr*Math.pow(10,this.vCurrPow);
	
	this.vFrameRate = 100;
	
	this.center = viewCenter;
	this.zoom = viewZoomInOut;
	this.click = viewHandleClick;
}

function viewCenter(newBody)
{
	this.body = newBody;

	//Set the (0,0) to the current position of the body
}

function viewHandleClick(event)
{
	var xNorm = event.pageX - gCanvasElement.offsetLeft;
	var yNorm = event.pageY - gCanvasElement.offsetTop;

	//go through celestial bodies and see if click if within bounds of one
	for (var i in aBodies) {
		//clickX is less than boxRightX and greater than boxLeftX
		if ((xNorm <= (aBodies[i].tX + aBodies[i].tSize + 25)) && (xNorm >= (aBodies[i].tX - aBodies[i].tSize - 25)) && (yNorm <= (aBodies[i].tY + aBodies[i].tSize + 10)) && (yNorm >= (aBodies[i].tY - aBodies[i].tSize - 10))) {
			//Only center on planets orbiting the sun
			if (aBodies[i].orb == 0) {
				//center the view on the position of the clicked body
				this.center(aBodies[i]);
				//Set specific zoom levels for centered bodies
				switch (aBodies[i].name) {
					case "earth":
						mainView.vCurr = 3;
						mainView.vCurrPow = 3;
				}
			}
		}
	}
}

function viewZoomInOut(delta)
{
	if (delta < 0) {
		if (this.vCurr == 9) {
			this.vCurrPow += 1;
			this.vCurr = 1;
		}
		else {
			this.vCurr += 1;
		}
	}
	if (delta > 0) {
		if (this.vCurr == 1) {
			this.vCurrPow -= 1;
			this.vCurr = 9;
		}
		else {
			this.vCurr -= 1;
		}
	}
}
