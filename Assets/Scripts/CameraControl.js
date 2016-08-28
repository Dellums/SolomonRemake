var target : Transform;
var distance :float = 10.0;
var height: float = 5.0;
var rotationDamping:float;
var heightDamping:float;
var distanceOffset : float;
private var Flip : boolean = false;

function Update(){
	var relativePos = transform.position - (target.position);
	var watPos = target.position - (transform.position);
	var hit : RaycastHit;
	if (!Flip && Physics.Raycast (target.position, relativePos, hit, distance+1)) {
		// Debug.DrawLine(target.position,hit.point, Color.blue);
		distanceOffset = distance - hit.distance + 0.1;
		distanceOffset = Mathf.Clamp(distanceOffset,0,distance);
		if(distanceOffset < 5.1 && distanceOffset > 1.5){
			distanceOffset+=3.5;
			Flip = true;
		}
		else{
			distanceOffset = Mathf.Clamp(distanceOffset,0,distance);
		}
	}
	else if (Flip && Physics.Raycast (transform.position, watPos, hit, distance+1.5)) {
		if (Physics.Raycast (target.position, relativePos, hit, distance+1)) {
			// Debug.DrawLine(target.position,hit.point, Color.red);
			distanceOffset = distance + hit.distance + 0.1;
			distanceOffset = Mathf.Clamp(distanceOffset,0,6);
		}
	}
	else{
		Flip = false;
		distanceOffset=0;
	}
}

function LateUpdate(){
	// Calculate the current rotation angles
	var wantedRotationAngle = target.eulerAngles.y;
	var wantedHeight = target.position.y + height;

	var currentRotationAngle = transform.eulerAngles.y;
	var currentHeight = transform.position.y;

	// Damp the rotation around the y-axis
	currentRotationAngle = Mathf.LerpAngle(currentRotationAngle, wantedRotationAngle, rotationDamping * Time.deltaTime/Time.timeScale);

	// Damp the height
	currentHeight = Mathf.Lerp(currentHeight, wantedHeight, heightDamping * Time.deltaTime/Time.timeScale);

	// Convert the angle into a rotation
	var currentRotation = Quaternion.Euler(0, currentRotationAngle, 0);

	// Set the position of the camera on the x-z plane to:
	// distance meters behind the target
	transform.position = target.position;
	transform.position -= currentRotation * Vector3.forward * (distance - distanceOffset);

	// Set the height of the camera
	transform.position = new Vector3(transform.position.x ,currentHeight , transform.position.z);

	// Always look at the target
	transform.LookAt(target);
}