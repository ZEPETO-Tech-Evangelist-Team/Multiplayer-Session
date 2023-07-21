Shader "Unlit/CloudScroll"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _BGTex ("Background Texture", 2D) = "white" {}
        _ScrollX ("Scroll X Direction", Float) = 0
        _ScrollY ("Scroll Y Direction", Float) = 0
        _ColorMain("Background", Color) = (1, 1, 1, 1)
        _ScrollXBG ("BG Scroll X Direction", Float) = 0
        _ScrollYBG ("BG Scroll Y Direction", Float) = 0
        _ColorShift("Background Shift", Color) = (1, 1, 1, 1)
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            // make fog work
            #pragma multi_compile_fog

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                float2 uv_still : TEXCOORD1;

            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float2 uv_still : TEXCOORD1;
                UNITY_FOG_COORDS(1)
                float4 vertex : SV_POSITION;
            };

            sampler2D _MainTex;
            sampler2D _BGTex;
            float4 _BGTex_ST;
            float4 _MainTex_ST;
            float _ScrollX;
            float _ScrollY;
            float _ScrollXBG;
            float _ScrollYBG;
            fixed4 _ColorMain;
            fixed4 _ColorShift;

            v2f vert (appdata v)
            {

                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);

                float2 scroll;
                scroll.x = _ScrollX;
                scroll.y = _ScrollY;
                float2 uv = v.uv;
                uv.x = uv.x + scroll.x * _Time.y;
                uv.y = uv.y + scroll.y * _Time.y;

                float2 uvBG = v.uv;
                uvBG.x = uvBG.x + _ScrollYBG * _Time.y;
                uvBG.y = uvBG.y + _ScrollXBG * _Time.y;

                o.uv_still = TRANSFORM_TEX(uvBG, _BGTex);
                o.uv = TRANSFORM_TEX(uv, _MainTex);
                UNITY_TRANSFER_FOG(o,o.vertex);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                fixed4 col = tex2D(_MainTex, i.uv);
                fixed4 col_bg = tex2D(_BGTex, i.uv_still)
                // apply fog
                UNITY_APPLY_FOG(i.fogCoord, col);

                if(col.w > 0)
                {
                    return col;
                }
                else if(col_bg.w > 0)
                {
                    return col_bg;
                }
                else
                {
                    return _ColorMain + (.2 * _CosTime.z * _ColorShift);
                }
            }
            ENDCG
        }
    }
}
