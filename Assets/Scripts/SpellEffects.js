#pragma strict
enum HitEffect {FireBallHit, LightningHit, FrostJetHit}
var hitEffect : HitEffect;
var Effects:GameObject[];
private var effect:GameObject;

function Update () {
	if(hitEffect == hitEffect.FireBallHit){
		effect = Effects[0];
	}
	else if(hitEffect == hitEffect.LightningHit){
		effect = Effects[1];
	}
	else if(hitEffect == hitEffect.FrostJetHit){
		effect = Effects[2];
	}
}

function OnDestroy () {
	var clone : GameObject;
	playerInput.MagicMissleCount -= 1;
	clone = Instantiate(effect, transform.position, transform.rotation);
}