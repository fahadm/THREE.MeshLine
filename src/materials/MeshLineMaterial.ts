import {Color, ShaderMaterial, Vector2} from "three";
import {MeshlineVertexShader} from "./shaders/MeshlineVertexShader";
import {MeshlineFragmentShader} from "./shaders/MeshlineFragmentShader";

export class MeshLineMaterial extends ShaderMaterial
{
	public static vertexShader = MeshlineVertexShader.SHADER;

	public  static fragmentShader = MeshlineFragmentShader.SHADER;

	public type = 'MeshLineMaterial';

	constructor(parameters)
	{
		super();
		this.uniforms["lineWidth"] = {value: 1};
		this.uniforms["map"] = {value: null};
		this.uniforms["useMap"] = {value: 0};
		this.uniforms["alphaMap"] = {value: null};
		this.uniforms["useAlphaMap"] = {value: 0};
		this.uniforms["color"] = {value: new Color(0xffffff)};
		this.opacity = 1;
		this.uniforms["resolution"] = {value: new Vector2(1, 1)};
		this.uniforms["sizeAttenuation"] = {value: 1};
		this.uniforms["near"] = {value: 1};
		this.uniforms["far"] = {value: 1};
		this.uniforms["dashArray"] = {value: 0};
		this.uniforms["dashOffset"] = {value: 0};
		this.uniforms["dashRatio"] = {value: 0.5};
		this.uniforms["useDash"] = {value: 0};
		this.visible = true;
		this.alphaTest = 0;
		this.uniforms["repeat"] = {value: new Vector2(1, 1)};

		this.setValues(parameters);
	}

	private _lineWidth;

	public get lineWidth()
	{
		return this.uniforms.lineWidth.value;
	}

	public set lineWidth(value)
	{
		this.uniforms.lineWidth.value = value;
	}

	private _map: any;

	public get map(): any
	{
		return this.uniforms.map.value;
	}

	public set map(value: any)
	{
		this.uniforms.map.value = value;
	}

	private _useMap: boolean;

	public get useMap(): boolean
	{
		return this.uniforms.useMap.value;
	}

	public set useMap(value: boolean)
	{
		this.uniforms.useMap.value = value;
	}

	private _alphaMap: number;

	public get alphaMap(): number
	{
		return this.uniforms.alphaMap.value;
	}

	public set alphaMap(value: number)
	{
		this.uniforms.alphaMap.value = value;
	}

	private _useAlphaMap: boolean;

	public get useAlphaMap(): boolean
	{
		return this.uniforms.useAlphaMap.value;
	}

	public set useAlphaMap(value: boolean)
	{
		this.uniforms.useAlphaMap.value = value;
	}

	private _color: Color;

	public get color(): Color
	{
		return this.uniforms.color.value;
	}

	public set color(value: Color)
	{
		this.uniforms.color.value = value;
	}

	private _resolution: Vector2;

	public get resolution(): Vector2
	{
		return this.uniforms.resolution.value;
	}

	public set resolution(value: Vector2)
	{
		this.uniforms.resolution.value = value;
	}

	private _sizeAttenuation: number;

	public get sizeAttenuation(): number
	{
		return this.uniforms.sizeAttenuation.value;
	}

	public set sizeAttenuation(value: number)
	{
		this.uniforms.sizeAttenuation.value = value;
	}

	private _dashArray: number;

	public get dashArray(): number
	{
		return this.uniforms.dashArray.value;
	}

	public set dashArray(value: number)
	{
		this.uniforms.dashArray.value = value;
	}

	private _dashOffset: number;

	public get dashOffset(): number
	{
		return this.uniforms.dashOffset.value;
	}

	public set dashOffset(value: number)
	{
		this.uniforms.dashOffset.value = value;
	}

	private _dashRatio: number;

	public get dashRatio(): number
	{
		return this.uniforms.dashRatio.value;
	}

	public set dashRatio(value: number)
	{
		this.uniforms.dashRatio.value = value;
	}

	private _useDash: boolean;

	public get useDash(): boolean
	{
		return this.uniforms.useDash.value;
	}

	public set useDash(value: boolean)
	{
		this.uniforms.useDash.value = value;
	}

	private _repeat: Vector2;

	public get repeat(): Vector2
	{
		return this.uniforms.repeat.value;
	}

	public set repeat(value: Vector2)
	{
		this.uniforms.repeat.value = value;
	}

	public copy(source: MeshLineMaterial)
	{

		this.copy(source);

		this._lineWidth = source._lineWidth;
		this._map = source._map;
		this._useMap = source._useMap;
		this._alphaMap = source._alphaMap;
		this._useAlphaMap = source._useAlphaMap;
		this._color.copy(source._color);
		this.opacity = source.opacity;
		this._resolution.copy(source._resolution);
		this._sizeAttenuation = source._sizeAttenuation;

		this._dashArray = source._dashArray;
		this._dashOffset = source._dashOffset;
		this._dashRatio = source._dashRatio;
		this._useDash = source._useDash;

		this.alphaTest = source.alphaTest;
		this._repeat.copy(source._repeat);

		return this;
	}

}
