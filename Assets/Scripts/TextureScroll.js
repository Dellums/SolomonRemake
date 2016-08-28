var scrollSpeed : float = .5;
var offset : float;
var rotate : float;

function Update (){
	offset+= (Time.deltaTime*scrollSpeed)/10.0;
	GetComponent.<Renderer>().material.SetTextureOffset ("_MainTex", Vector2(offset,0));
	// GetComponent.<Renderer>().material.SetTextureOffset ("_MainTex", Vector2(0,-offset)); 
}