import { Err, Ok, Result } from "@hazae41/result"
import { Buffers } from "libs/buffers/buffers.js"
import { Sized } from "../sized/sized.js"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export type BytesError =
  | BytesAllocError
  | BytesCastError

export class BytesAllocError<N extends number = number> extends Error {
  readonly #class = BytesAllocError
  readonly name = this.#class.name

  constructor(
    readonly length: N
  ) {
    super(`Could not allocate ${length}-sized bytes`)
  }

}

export class BytesCastError<N extends number = number> extends Error {
  readonly #class = BytesCastError
  readonly name = this.#class.name

  constructor(
    readonly actualLength: number,
    readonly expectedLength: N
  ) {
    super(`Could not cast ${actualLength} bytes into ${expectedLength}-sized bytes`)
  }

}

export type Bytes<N extends number = number> = Uint8Array & { length: N }

export namespace Bytes {

  /**
   * Alloc 0-lengthed Bytes using standard constructor
   * @deprecated
   * @returns `Bytes[]`
   */
  export function empty(): Bytes<0> {
    return alloc(0)
  }

  /**
   * Alloc 0-lengthed Bytes using standard constructor
   * @returns `Bytes[]`
   */
  export function tryEmpty(): Result<Bytes<0>, BytesAllocError<0>> {
    return tryAlloc(0)
  }

  /**
   * Alloc Bytes with typed length using standard constructor
   * @deprecated
   * @param length 
   * @returns `Bytes[0;N]`
   */
  export function alloc<N extends number>(length: N): Bytes<N> {
    return new Uint8Array(length) as Bytes<N>
  }

  /**
   * Alloc Bytes with typed length using standard constructor
   * @param length 
   * @returns `Bytes[0;N]`
   */
  export function tryAlloc<N extends number>(length: N): Result<Bytes<N>, BytesAllocError<N>> {
    try {
      return new Ok(new Uint8Array(length) as Bytes<N>)
    } catch (e: unknown) {
      return new Err(new BytesAllocError(length))
    }
  }

  /**
   * Alloc Bytes with typed length using Buffer.allocUnsafe
   * @deprecated
   * @param length 
   * @returns `Bytes[number;N]`
   */
  export function allocUnsafe<N extends number>(length: N): Bytes<N> {
    return fromView(Buffer.allocUnsafe(length)) as Bytes<N>
  }

  /**
   * Alloc Bytes with typed length using Buffer.allocUnsafe
   * @param length 
   * @returns `Bytes[number;N]`
   */
  export function tryAllocUnsafe<N extends number>(length: N): Result<Bytes<N>, BytesAllocError<N>> {
    try {
      return new Ok(fromView(Buffer.allocUnsafe(length)) as Bytes<N>)
    } catch (e: unknown) {
      return new Err(new BytesAllocError(length))
    }
  }

  /**
   * Create bytes from sized of length N
   * @deprecated
   * @param sized 
   * @returns `Bytes[number;N]`
   */
  export function from<N extends number>(sized: Sized<number, N>): Bytes<N> {
    return new Uint8Array(sized) as Bytes<N>
  }

  /**
   * Create bytes from sized of length N
   * @param sized 
   * @returns `Bytes[number;N]`
   */
  export function tryFrom<N extends number>(sized: Sized<number, N>): Result<Bytes<N>, BytesAllocError<N>> {
    try {
      return new Ok(new Uint8Array(sized) as Bytes<N>)
    } catch (e: unknown) {
      return new Err(new BytesAllocError(sized.length))
    }
  }

  /**
   * Alloc Bytes with typed length using Buffer.allocUnsafe and fill it with WebCrypto's CSPRNG
   * @deprecated
   * @param length 
   * @returns `Bytes[number;N]`
   */
  export function random<N extends number>(length: N): Bytes<N> {
    const bytes = allocUnsafe(length)
    crypto.getRandomValues(bytes)
    return bytes
  }

  /**
   * Alloc Bytes with typed length using Buffer.allocUnsafe and fill it with WebCrypto's CSPRNG
   * @param length 
   * @returns `Bytes[number;N]`
   */
  export function tryRandom<N extends number>(length: N): Result<Bytes<N>, BytesAllocError<N>> {
    const result = tryAllocUnsafe(length)
    result.inspectSync(bytes => crypto.getRandomValues(bytes))
    return result
  }

  /**
   * Type guard bytes of N length into Bytes<N>
   * @param bytes 
   * @param length 
   * @returns 
   */
  export function is<N extends number>(bytes: Bytes, length: N): bytes is Bytes<N> {
    return bytes.length.valueOf() === length.valueOf()
  }

  /**
   * Equality check using Buffer.equals
   * @param a 
   * @param b 
   * @returns 
   */
  export function equals<N extends number, M extends N>(a: Bytes<N>, b: Bytes<M>): a is Bytes<M> {
    return Buffers.fromView(a).equals(Buffers.fromView(b))
  }

  /**
   * Equality check using Buffer.equals
   * @param a 
   * @param b 
   * @returns 
   */
  export function equals2<N extends M, M extends number>(a: Bytes<N>, b: Bytes<M>): b is Bytes<N> {
    return Buffers.fromView(a).equals(Buffers.fromView(b))
  }

  /**
   * Try to cast bytes of N length into Bytes<N>
   * @param view 
   * @param length 
   * @returns 
   */
  export function tryCast<N extends number>(bytes: Bytes, length: N): Result<Bytes<N>, BytesCastError<N>> {
    if (Bytes.is(bytes, length))
      return new Ok(bytes)
    return new Err(new BytesCastError(bytes.length, length))
  }

  /**
   * Try to cast bytes of N length into Bytes<N>
   * @param view 
   * @param length 
   * @returns 
   */
  export function tryCastFrom<N extends number>(array: ArrayLike<number>, length: N): Result<Bytes<N>, BytesCastError<N>> {
    return tryCast(new Uint8Array(array), length)
  }

  /**
   * Zero-copy conversion from ArrayBufferView of N length into Bytes<N>
   * @param view 
   * @param length 
   * @returns 
   */
  export function tryCastFromView<N extends number>(view: ArrayBufferView, length: N): Result<Bytes<N>, BytesCastError<N>> {
    return tryCast(fromView(view), length)
  }

  /**
   * Zero-copy conversion from ArrayBufferView into unknown-sized Bytes
   * @param view 
   * @returns 
   */
  export function fromView(view: ArrayBufferView): Bytes {
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
  }

  /**
   * Utf8 encoding using standard encoder
   * @param text 
   * @returns 
   */
  export function fromUtf8(text: string): Bytes {
    return encoder.encode(text)
  }

  /**
   * Utf8 decoding using standard decoder
   * @param text 
   * @returns 
   */
  export function toUtf8(bytes: Bytes): string {
    return decoder.decode(bytes)
  }

  /**
   * https://github.com/nodejs/node/issues/24491
   * @param text 
   * @returns 
   */
  export function fromHexSafe(text: string): Bytes {
    return fromHex((text.length % 2) ? `0${text}` : text)
  }

  /**
   * Hex decoding using Buffer.from
   * @param text 
   * @returns 
   */
  export function fromHex(text: string): Bytes {
    return fromView(Buffer.from(text, "hex"))
  }

  /**
   * Hex encoding using Buffer.toString
   * @param bytes 
   * @returns 
   */
  export function toHex(bytes: Bytes): string {
    return Buffers.fromView(bytes).toString("hex")
  }

  /**
   * Base64 decoding using Buffer.from
   * @param text 
   * @returns 
   */
  export function fromBase64(text: string): Bytes {
    return fromView(Buffer.from(text, "base64"))
  }

  /**
   * Base64 encoding using Buffer.toString
   * @param bytes 
   * @returns 
   */
  export function toBase64(bytes: Bytes): string {
    return Buffers.fromView(bytes).toString("base64")
  }

  /**
   * Ascii decoding using Buffer.from
   * @param bytes 
   * @returns 
   */
  export function fromAscii(text: string): Bytes {
    return fromView(Buffer.from(text, "ascii"))
  }

  /**
   * Ascii encoding using Buffer.toString
   * @param bytes 
   * @returns 
   */
  export function toAscii(bytes: Bytes): string {
    return Buffers.fromView(bytes).toString("ascii")
  }

  /**
   * BigInt decoding using fromHexSafe
   * @param bigint 
   * @returns 
   */
  export function fromBigInt(bigint: bigint): Bytes {
    return fromHexSafe(bigint.toString(16))
  }

  /**
   * BigInt encoding using toHex
   * @param bytes 
   * @returns 
   */
  export function toBigInt(bytes: Bytes): bigint {
    return BigInt(`0x${toHex(bytes)}`)
  }

  /**
   * Slice or pad bytes to exact length by filling 0s at the start
   * @example sliceOrPadStart([1,2,3,4], 2) = [3,4]
   * @example sliceOrPadStart([1,2,3,4], 6) = [0,0,1,2,3,4]
   * @param bytes 
   * @param length 
   * @returns 
   */
  export function sliceOrPadStart<N extends number>(bytes: Bytes, length: N): Bytes<N> {
    if (bytes.length >= length) {
      const slice = bytes.slice(bytes.length - length, bytes.length)
      return fromView(slice) as Bytes<N>
    }

    const result = Bytes.alloc(length)
    result.set(bytes, length - bytes.length)

    return result
  }

  /**
   * Slice or pad bytes to exact length by filling 0s at the start
   * @example sliceOrPadStart([1,2,3,4], 2) = [3,4]
   * @example sliceOrPadStart([1,2,3,4], 6) = [0,0,1,2,3,4]
   * @param bytes 
   * @param length 
   * @returns 
   */
  export function trySliceOrPadStart<N extends number>(bytes: Bytes, length: N): Result<Bytes<N>, BytesAllocError<N>> {
    if (bytes.length >= length) {
      const slice = bytes.slice(bytes.length - length, bytes.length)
      return new Ok(fromView(slice) as Bytes<N>)
    }

    const result = Bytes.tryAlloc(length)
    result.inspectSync(result => result.set(bytes, length - bytes.length))
    return result
  }

  /**
   * Pad bytes to minimum length by filling 0s at the start
   * @deprecated
   * @example padStart([1,2,3,4], 2) = [1,2,3,4]
   * @example padStart([1,2,3,4], 6) = [0,0,1,2,3,4]
   * @param bytes 
   * @param length 
   * @returns 
   */
  export function padStart<X extends number, N extends number>(bytes: Bytes<X>, length: N): Bytes<X> | Bytes<N> {
    if (bytes.length >= length)
      return bytes

    const result = Bytes.alloc(length)
    result.set(bytes, length - bytes.length)

    return result
  }

  /**
   * Pad bytes to minimum length by filling 0s at the start
   * @example padStart([1,2,3,4], 2) = [1,2,3,4]
   * @example padStart([1,2,3,4], 6) = [0,0,1,2,3,4]
   * @param bytes 
   * @param length 
   * @returns 
   */
  export function tryPadStart<X extends number, N extends number>(bytes: Bytes<X>, length: N): Result<Bytes<X> | Bytes<N>, BytesAllocError<N>> {
    if (bytes.length >= length)
      return new Ok(bytes)

    const result = Bytes.tryAlloc(length)
    result.inspectSync(result => result.set(bytes, length - bytes.length))
    return result
  }

  /**
   * Concatenation using Buffer.concat
   * @param list 
   * @returns 
   */
  export function concat(list: Bytes[]) {
    return fromView(Buffer.concat(list))
  }


}