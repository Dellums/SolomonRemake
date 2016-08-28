 import System.Collections.Generic;

var speed : float = 6.0;
var backSpeed : float = 2.0;
var rotateSpeed : float = 3.0;
var jumpSpeed : float = 8.0;
var gravity : float = 20.0;


var SpellsGui : UI.Image[];

var MaxHealth : float = 100;
private var damage : float = 0;
var healthRegenRate: float = 0.2;
var manaRegenRate:float = 0.2;
var HealthBar : UI.Image;
var ManaBar : UI.Image;
public static var killedEnemies : int = 0;
var KillCounter : UI.Text;
var hitcount : float = 0;
var m_Animator: Animator;
private var canMove :boolean = true;
private var moveDirection : Vector3 = Vector3.zero;

var castLoc: Transform[];
var spellCast: float = 10;
var selectVal = 0;
class spellSelection extends System.Object {

	public var _spell: GameObject[];
	public var _spellCost: float[];
	public var _spellImages:Sprite[];
	public var _spellNames = new Array("MagicMissile", "FireBall", "FrostJet", "Lightning");
	// public var _spellNames = new Array();
}

public var SpellSelect = spellSelection();

private var spell:GameObject;
private var spellCost:float;
private var spell_image:Sprite;
private var spellName:String;
private var FrostJetHold:Transform;

function Awake(){
	// for(var gOs in SpellSelect._spell){
	// 	SpellSelect._spellNames.push(gOs.name);
	// }
	// print(SpellSelect._spellNames);
	_FrostJet = Instantiate(SpellSelect._spell[2], transform.position, transform.rotation);
	_FrostJet.transform.parent = transform;
	_FrostJet.name = "FrostJetHolder";
	FrostJetHold = transform.Find("FrostJetHolder");

	var spellinfo = SpellCheck();
	spell = spellinfo[0];
	spellCost = spellinfo[1];
	spell_image = spellinfo[2];
	spellName = spellinfo[3];
	SpellsGui[1].sprite = spell_image; 
}



function Update() {
	ScrollSelect();
	KillCounter.text = String.Format("{0} {1}", "Kills: ", killedEnemies.ToString());
	if(ManaBar.fillAmount != 1){
		ManaBar.fillAmount = ManaBar.fillAmount + manaRegenRate * Time.deltaTime;//.003;
	}
	if(HealthBar.fillAmount != 1){
		HealthBar.fillAmount = HealthBar.fillAmount + healthRegenRate * Time.deltaTime;//.003;
	}
	if (Input.GetButton("Fire1")) {
		CastSpell(spell, spellCost, spellName);
	}
	else{
		FrostJetHold.gameObject.SetActive(false);
	}

	MoveCharacter();
}
function ScrollSelect(){
	// 0 = Up one, 1 = selected, 2 = Down one
	if (Input.GetAxis("Mouse ScrollWheel") > 0f ) // Up
	{
		if(selectVal < SpellSelect._spellNames.length-1){
			selectVal += 1;
		}
		else if(selectVal == SpellSelect._spellNames.length-1){
			selectVal = 0;
		}
	}
	else if (Input.GetAxis("Mouse ScrollWheel") < 0f ) // Down
	{
		if(selectVal == 0){
			selectVal = SpellSelect._spellNames.length - 1;
		}
		else{
			selectVal -= 1;
		}
	}
	var spellinfo = SpellCheck();
	spell = spellinfo[0];
	spellCost = spellinfo[1];
	spell_image = spellinfo[2];
	spellName = spellinfo[3];
	spellNum = spellinfo[4];
	var spellNumUp = spellNum + 1; 
	var spellNumDown = spellNum - 1;

	if(spellNumUp > SpellSelect._spellNames.length - 1){
		spellNumUp = 0;
	}
	if(spellNumDown < 0){
		spellNumDown = SpellSelect._spellNames.length - 1;
	}
	SpellsGui[0].sprite = SpellSelect._spellImages[spellNumUp]; 
	SpellsGui[1].sprite = spell_image; 
	SpellsGui[2].sprite = SpellSelect._spellImages[spellNumDown];
}

function SpellCheck(){
	if(SpellSelect._spellNames[selectVal] == "MagicMissile"){
		return [SpellSelect._spell[0], SpellSelect._spellCost[0], SpellSelect._spellImages[0], SpellSelect._spellNames[0], 0];
	}
	else if(SpellSelect._spellNames[selectVal] == "FireBall"){
		return [SpellSelect._spell[1], SpellSelect._spellCost[1], SpellSelect._spellImages[1], SpellSelect._spellNames[1], 1];
	}
	else if(SpellSelect._spellNames[selectVal] == "FrostJet"){
		return [SpellSelect._spell[2], SpellSelect._spellCost[2], SpellSelect._spellImages[2], SpellSelect._spellNames[2], 2];
	}
	else if(SpellSelect._spellNames[selectVal] == "Lightning"){
		return [SpellSelect._spell[3], SpellSelect._spellCost[3], SpellSelect._spellImages[3], SpellSelect._spellNames[3], 3];
	}

}

function CastSpell(_myspell, _myspellcost, _spellname){
	if (ManaBar.fillAmount * 100 >= _myspellcost){
		// Instantiate the projectile at the position and rotation of this transform
		var clone : GameObject;
		if(_spellname == "MagicMissile"){
			for(var i : int = 0; i < castLoc.length; i++)
			{
				clone = Instantiate(_myspell, castLoc[i].transform.position, transform.rotation);
				clone.GetComponent.<Rigidbody>().AddForce(clone.transform.forward * spellCast);
			}
		}
		else if(_spellname == "FireBall"){
			clone = Instantiate(_myspell, castLoc[i].transform.position, transform.rotation);
			clone.GetComponent.<Rigidbody>().AddForce(clone.transform.forward * spellCast);
		}
		else if(_spellname == "FrostJet"){
			FrostJetHold.gameObject.SetActive(true);
		}
		ManaBar.fillAmount -= _myspellcost/100;
	}
	else{
		FrostJetHold.gameObject.SetActive(false);
	}
}

function MoveCharacter(){
	var controller : CharacterController = GetComponent(CharacterController);
		//Rotate
		// transform.Rotate(0, Input.GetAxisRaw("Horizontal")*rotateSpeed, 0);

	if (controller.isGrounded) {	
		//Strafe
		moveDirection = Vector3(Input.GetAxisRaw("Horizontal"), 0, Input.GetAxisRaw("Vertical"));
		// moveDirection = Vector3(0, 0, Input.GetAxisRaw("Vertical"));
		moveDirection = transform.TransformDirection(moveDirection);
		if(Input.GetAxisRaw("Vertical")<0){
			moveDirection *= speed - backSpeed;
		}
		else{
			moveDirection *= speed;
		}
		if (Input.GetButton("Jump")) {
			moveDirection.y = jumpSpeed;
		}
	}
	// Apply gravity
	moveDirection.y -= gravity * Time.deltaTime/Time.timeScale ;
	// Move the controller
	controller.Move(moveDirection * Time.deltaTime/Time.timeScale );
	m_Animator.SetBool("Falling", !controller.isGrounded);
	m_Animator.SetFloat("Strafe", Input.GetAxisRaw("Horizontal"));
	m_Animator.SetFloat("Back", Input.GetAxisRaw("Vertical"));
	if(Input.GetKey("space")){
		m_Animator.SetBool("Jump", true);
	}
	else{
		m_Animator.SetBool("Jump", true);
	}
}

function OnTriggerEnter (other : Collider) {
	if(other.gameObject.tag == "Enemy_Spell"){
		hitcount = hitcount +1;
		damage = (MaxHealth - hitcount*.5);
		// print(damage/100);
		HealthBar.fillAmount = damage/100;
	}
}
function OnTriggerExit(collider:Collider){

}
function OnCollisionStay(collision : Collision){

}
function OnCollisionExit(collision : Collision){

}
