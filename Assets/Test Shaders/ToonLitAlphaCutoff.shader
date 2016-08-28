Shader "Toon/Lit Outline AlphaCutoff" {
	Properties {
		_Color ("Main Color", Color) = (0.5,0.5,0.5,1)
		_OutlineColor ("Outline Color", Color) = (0,0,0,1)
		_Outline ("Outline width", Range (.002, 0.03)) = .005
		_MainTex ("Base (RGB) RefStrength+Gloss (A)", 2D) = "white" {}
		_Ramp ("Toon Ramp (RGB)", 2D) = "gray" {} 
		_Cutoff ("Alpha cutoff", Range(0,1)) = 0.5
	}

	SubShader
	{
	    Cull Off
	    Tags
	    {
	        "Queue" = "Transparent"
	        "IgnoreProjector" = "True"
	        "RenderType" = "TransparentCutoff"
	    }
	    Pass
	    {
	        Blend SrcAlpha One
	        Alphatest Greater [_Cutoff]
	        AlphaToMask True
	        ColorMask RGB


	        SetTexture [_MainTex]
	        {
	            Combine texture, texture
	        }
	        SetTexture [_MainTex] {
	            constantColor [_Color]
	            Combine previous * constant, previous * constant
	        }  
	    }
	}

	Fallback "Toon/Lit"
}
