Shader "Toon/Basic Outline AlphaCutoff" {
	Properties {
		_Color ("Main Color", Color) = (.5,.5,.5,1)
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_ToonShade ("ToonShader Cubemap(RGB)", CUBE) = "" { }
		_OutlineColor ("Outline Color", Color) = (0,0,0,1)
		_Outline ("Outline width", Range (.002, 0.03)) = .005
		_MainTex ("Base (RGB) RefStrength+Gloss (A)", 2D) = "white" {}
		_Cutoff ("Alpha cutoff", Range(0,1)) = 0.5
	}

	SubShader {
	    Cull Off
	    Tags
	    {
	        "Queue" = "Transparent"
	        "IgnoreProjector" = "True"
	        "RenderType" = "TransparentCutoff"
	    }
		Pass {
			Name "BASE"
			Cull Off
			
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma multi_compile_fog

			#include "UnityCG.cginc"

			sampler2D _MainTex;
			samplerCUBE _ToonShade;
			float4 _MainTex_ST;
			float4 _Color;

			struct appdata {
				float4 vertex : POSITION;
				float2 texcoord : TEXCOORD0;
				float3 normal : NORMAL;
			};
			
			struct v2f {
				float4 pos : SV_POSITION;
				float2 texcoord : TEXCOORD0;
				float3 cubenormal : TEXCOORD1;
				UNITY_FOG_COORDS(2)
			};

			v2f vert (appdata v)
			{
				v2f o;
				o.pos = mul (UNITY_MATRIX_MVP, v.vertex);
				o.texcoord = TRANSFORM_TEX(v.texcoord, _MainTex);
				o.cubenormal = mul (UNITY_MATRIX_MV, float4(v.normal,0));
				UNITY_TRANSFER_FOG(o,o.pos);
				return o;
			}

			fixed4 frag (v2f i) : SV_Target
			{
				fixed4 col = _Color * tex2D(_MainTex, i.texcoord);
				fixed4 cube = texCUBE(_ToonShade, i.cubenormal);
				fixed4 c = fixed4(2.0f * cube.rgb * col.rgb, col.a);
				UNITY_APPLY_FOG(i.fogCoord, c);
				return c;
			}
			ENDCG			

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

	Fallback "Toon/Basic"
}


