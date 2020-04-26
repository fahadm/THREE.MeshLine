import {ShaderChunk} from "three";

export class MeshlineFragmentShader
{
	public static SHADER: string = [
		'',
		ShaderChunk.fog_pars_fragment,
		ShaderChunk.logdepthbuf_pars_fragment,
		'',
		'uniform sampler2D map;',
		'uniform sampler2D alphaMap;',
		'uniform float useMap;',
		'uniform float useAlphaMap;',
		'uniform float useDash;',
		'uniform float dashArray;',
		'uniform float dashOffset;',
		'uniform float dashRatio;',
		'uniform float visibility;',
		'uniform float alphaTest;',
		'uniform vec2 repeat;',
		'',
		'varying vec2 vUV;',
		'varying vec4 vColor;',
		'varying float vCounters;',
		'',
		'void main() {',
		'',
		ShaderChunk.logdepthbuf_fragment,
		'',
		'    vec4 c = vColor;',
		'    if( useMap == 1. ) c *= texture2D( map, vUV * repeat );',
		'    if( useAlphaMap == 1. ) c.a *= texture2D( alphaMap, vUV * repeat ).a;',
		'    if( c.a < alphaTest ) discard;',
		'    if( useDash == 1. ){',
		'        c.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));',
		'    }',
		'    gl_FragColor = c;',
		'    gl_FragColor.a *= step(vCounters, visibility);',
		'',
		ShaderChunk.fog_fragment,
		'}'
	].join('\r\n');
}
