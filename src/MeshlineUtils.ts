export class MeshLineUtils
{
	public static memcpy(src: Float32Array, srcOffset: number, dst: Float32Array, dstOffset: number,
		length: number): Float32Array
	{
		let i;

		const srcBuffer = src.subarray || src.slice ? src : src.buffer;
		const dstBuffer = dst.subarray || dst.slice ? dst : dst.buffer;

		src = srcOffset ? src.subarray ?
			src.subarray(srcOffset, length && srcOffset + length) :
			src.slice(srcOffset, length && srcOffset + length) : src;

		if (dst.set)
		{
			dst.set(src, dstOffset)
		}
		else
		{
			for (i = 0; i < src.length; i++)
			{
				dst[i + dstOffset] = src[i];
			}
		}

		return dst;
	}
}
