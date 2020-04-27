import {
	BufferAttribute,
	BufferGeometry,
	Geometry,
	Intersection,
	LineSegments,
	Matrix4,
	Object3D,
	Ray,
	Raycaster,
	Sphere,
	Vector3
} from "three";
import { MeshLineUtils } from "./MeshlineUtils";

export interface MeshLineAttributes
{
	next: BufferAttribute;
	uv: BufferAttribute;
	side: BufferAttribute;
	previous: BufferAttribute;
	counters: BufferAttribute;
	width: BufferAttribute;
	index: BufferAttribute;
	position: BufferAttribute;
}

export class MeshLine extends Object3D
{
	public matrixWorld: Matrix4;

	private positions: number[];

	private previous: number[];

	private next: number[];

	private width: number[];

	private indices_array: number[];

	private uvs: number[];

	private counters: number[];

	public geometry: BufferGeometry | Geometry;

	private widthCallback: Function;

	private side: number[];

	public attributes: MeshLineAttributes;

	public constructor()
	{
		super();
		this.positions = [];

		this.previous = [];
		this.next = [];
		this.side = [];
		this.width = [];
		this.indices_array = [];
		this.uvs = [];
		this.counters = [];
		this.geometry = new BufferGeometry();

		this.widthCallback = null;

		// Used to raycast
		this.matrixWorld = new Matrix4();
	}

	public setMatrixWorld(matrixWorld): void
	{
		this.matrixWorld = matrixWorld;
	}

	public setGeometry(g: Geometry | BufferGeometry, c: Function = undefined)
	{
		this.widthCallback = c;

		this.positions = [];
		this.counters = [];
		// g.computeBoundingBox();
		// g.computeBoundingSphere();

		// set the normals
		// g.computeVertexNormals();
		if (g instanceof Geometry)
		{
			for (let j = 0; j < g.vertices.length; j++)
			{
				const v = g.vertices[j];
				const c = j / g.vertices.length;
				this.positions.push(v.x, v.y, v.z);
				this.positions.push(v.x, v.y, v.z);
				this.counters.push(c);
				this.counters.push(c);
			}
		}

		if (g instanceof BufferGeometry)
		{
			// read attribute positions ?
		}

		if (g instanceof Float32Array || g instanceof Array)
		{
			for (let j = 0; j < g.length; j += 3)
			{
				const c = j / g.length;
				this.positions.push(g[j], g[j + 1], g[j + 2]);
				this.positions.push(g[j], g[j + 1], g[j + 2]);
				this.counters.push(c);
				this.counters.push(c);
			}
		}

		this.process();

	};

	public raycast(): Function
	{
		const inverseMatrix = new Matrix4();
		const ray = new Ray();
		const sphere = new Sphere();

		return (raycaster: Raycaster, intersects: Intersection[]) =>
		{

			const precision = raycaster.params.Line.threshold;
			const precisionSq = precision * precision;
			const interRay = new Vector3();

			const geometry = this.geometry;

			if (geometry.boundingSphere === null)
			{
				geometry.computeBoundingSphere();
			}

			// Checking boundingSphere distance to ray

			sphere.copy(geometry.boundingSphere);
			sphere.applyMatrix4(this.matrixWorld);

			if (!raycaster.ray.intersectSphere(sphere, interRay))
			{
				return;
			}

			inverseMatrix.getInverse(this.matrixWorld);
			ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

			const vStart = new Vector3();
			const vEnd = new Vector3();
			const interSegment = new Vector3();
			const step = this instanceof LineSegments ? 2 : 1;

			if (geometry instanceof BufferGeometry)
			{

				const index = geometry.index;
				const attributes = geometry.attributes;

				if (index !== null)
				{

					const indices = index.array;
					const positions = attributes.position.array;

					for (let i = 0, l = indices.length - 1; i < l; i += step)
					{
						const a = indices[i];
						const b = indices[i + 1];

						vStart.fromArray(positions, a * 3);
						vEnd.fromArray(positions, b * 3);

						const distSq = ray.distanceSqToSegment(vStart, vEnd, interRay,
							interSegment);

						if (distSq > precisionSq)
						{
							continue;
						}

						interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

						const distance = raycaster.ray.origin.distanceTo(interRay);

						if (distance < raycaster.near || distance > raycaster.far)
						{
							continue;
						}

						intersects.push({

							distance: distance,
							// What do we want? intersection point on the ray or on the segment??
							// point: raycaster.ray.at( distance ),
							point: interSegment.clone().applyMatrix4(this.matrixWorld),
							index: i,
							face: null,
							faceIndex: null,
							object: this

						});

					}

				}
				else
				{

					const positions = attributes.position.array;

					for (let i = 0, l = positions.length / 3 - 1; i < l; i += step)
					{

						vStart.fromArray(positions, 3 * i);
						vEnd.fromArray(positions, 3 * i + 3);

						const distSq = ray.distanceSqToSegment(vStart, vEnd, interRay,
							interSegment);

						if (distSq > precisionSq)
						{
							continue;
						}

						interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

						const distance = raycaster.ray.origin.distanceTo(interRay);

						if (distance < raycaster.near || distance > raycaster.far)
						{
							continue;
						}

						intersects.push({

							distance: distance,
							// What do we want? intersection point on the ray or on the segment??
							// point: raycaster.ray.at( distance ),
							point: interSegment.clone().applyMatrix4(this.matrixWorld),
							index: i,
							face: null,
							faceIndex: null,
							object: this

						});

					}

				}

			}
			else if (geometry instanceof Geometry)
			{
				const vertices = geometry.vertices;
				const nbVertices = vertices.length;

				for (let i = 0; i < nbVertices - 1; i += step)
				{
					const distSq = ray.distanceSqToSegment(vertices[i], vertices[i + 1], interRay,
						interSegment);

					if (distSq > precisionSq)
					{
						continue;
					}

					interRay.applyMatrix4(this.matrixWorld); //Move back to world space for distance calculation

					const distance = raycaster.ray.origin.distanceTo(interRay);

					if (distance < raycaster.near || distance > raycaster.far)
					{
						continue;
					}

					intersects.push({

						distance: distance,
						// What do we want? intersection point on the ray or on the segment??
						// point: raycaster.ray.at( distance ),
						point: interSegment.clone().applyMatrix4(this.matrixWorld),
						index: i,
						face: null,
						faceIndex: null,
						object: this

					});

				}

			}

		};

	}

	public compareV3(a, b): boolean
	{
		const aa = a * 6;
		const ab = b * 6;
		return (this.positions[aa] === this.positions[ab]) &&
		       (this.positions[aa + 1] === this.positions[ab + 1]) &&
		       (this.positions[aa + 2] === this.positions[ab + 2]);

	};

	public copyV3(a): number[]
	{

		var aa = a * 6;
		return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]];
	};

	public process(): void
	{
		const l = this.positions.length / 6;

		this.previous = [];
		this.next = [];
		this.side = [];
		this.width = [];
		this.indices_array = [];
		this.uvs = [];

		for (let j = 0; j < l; j++)
		{
			this.side.push(1);
			this.side.push(-1);
		}

		let w;
		for (let j = 0; j < l; j++)
		{
			if (this.widthCallback)
			{
				w = this.widthCallback(j / (l - 1));
			}
			else
			{
				w = 1;
			}
			this.width.push(w);
			this.width.push(w);
		}

		for (let j = 0; j < l; j++)
		{
			this.uvs.push(j / (l - 1), 0);
			this.uvs.push(j / (l - 1), 1);
		}

		let v;

		if (this.compareV3(0, l - 1))
		{
			v = this.copyV3(l - 2);
		}
		else
		{
			v = this.copyV3(0);
		}
		this.previous.push(v[0], v[1], v[2]);
		this.previous.push(v[0], v[1], v[2]);
		for (let j = 0; j < l - 1; j++)
		{
			v = this.copyV3(j);
			this.previous.push(v[0], v[1], v[2]);
			this.previous.push(v[0], v[1], v[2]);
		}

		for (let j = 1; j < l; j++)
		{
			v = this.copyV3(j);
			this.next.push(v[0], v[1], v[2]);
			this.next.push(v[0], v[1], v[2]);
		}

		if (this.compareV3(l - 1, 0))
		{
			v = this.copyV3(1);
		}
		else
		{
			v = this.copyV3(l - 1);
		}
		this.next.push(v[0], v[1], v[2]);
		this.next.push(v[0], v[1], v[2]);

		for (let j = 0; j < l - 1; j++)
		{
			let n = j * 2;
			this.indices_array.push(n, n + 1, n + 2);
			this.indices_array.push(n + 2, n + 1, n + 3);
		}

		if (!this.attributes)
		{
			this.attributes = {
				position: new BufferAttribute(new Float32Array(this.positions), 3),
				previous: new BufferAttribute(new Float32Array(this.previous), 3),
				next: new BufferAttribute(new Float32Array(this.next), 3),
				side: new BufferAttribute(new Float32Array(this.side), 1),
				width: new BufferAttribute(new Float32Array(this.width), 1),
				uv: new BufferAttribute(new Float32Array(this.uvs), 2),
				index: new BufferAttribute(new Uint16Array(this.indices_array), 1),
				counters: new BufferAttribute(new Float32Array(this.counters), 1)
			}
		}
		else
		{
			this.attributes.position.copyArray(new Float32Array(this.positions));
			this.attributes.position.needsUpdate = true;
			this.attributes.previous.copyArray(new Float32Array(this.previous));
			this.attributes.previous.needsUpdate = true;
			this.attributes.next.copyArray(new Float32Array(this.next));
			this.attributes.next.needsUpdate = true;
			this.attributes.side.copyArray(new Float32Array(this.side));
			this.attributes.side.needsUpdate = true;
			this.attributes.width.copyArray(new Float32Array(this.width));
			this.attributes.width.needsUpdate = true;
			this.attributes.uv.copyArray(new Float32Array(this.uvs));
			this.attributes.uv.needsUpdate = true;
			this.attributes.index.copyArray(new Uint16Array(this.indices_array));
			this.attributes.index.needsUpdate = true;
		}

		if (this.geometry instanceof BufferGeometry)
		{
			this.geometry.setAttribute('position', this.attributes.position);
			this.geometry.setAttribute('previous', this.attributes.previous);
			this.geometry.setAttribute('next', this.attributes.next);
			this.geometry.setAttribute('side', this.attributes.side);
			this.geometry.setAttribute('width', this.attributes.width);
			this.geometry.setAttribute('uv', this.attributes.uv);
			this.geometry.setAttribute('counters', this.attributes.counters);

			this.geometry.setIndex(this.attributes.index);
		}

	}

	/**
	 * Fast method to advance the line by one position.  The oldest position is removed.
	 * @param position
	 */

	public advance(position): void
	{

		const positions = <Float32Array>this.attributes.position.array;
		const previous = <Float32Array>this.attributes.previous.array;
		const next = <Float32Array>this.attributes.next.array;
		const l = positions.length;

		// PREVIOUS
		MeshLineUtils.memcpy(positions, 0, previous, 0, l);

		// POSITIONS
		MeshLineUtils.memcpy(positions, 6, positions, 0, l - 6);

		//@ts-ignore
		positions[l - 6] = position.x;
		positions[l - 5] = position.y;
		positions[l - 4] = position.z;
		positions[l - 3] = position.x;
		positions[l - 2] = position.y;
		positions[l - 1] = position.z;

		// NEXT
		MeshLineUtils.memcpy(positions, 6, next, 0, l - 6);

		next[l - 6] = position.x;
		next[l - 5] = position.y;
		next[l - 4] = position.z;
		next[l - 3] = position.x;
		next[l - 2] = position.y;
		next[l - 1] = position.z;

		this.attributes.position.needsUpdate = true;
		this.attributes.previous.needsUpdate = true;
		this.attributes.next.needsUpdate = true;
	};
}
