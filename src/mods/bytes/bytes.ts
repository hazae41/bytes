import { Err, Ok, Result } from "@hazae41/result"
import { Buffers } from "libs/buffers/buffers.js"
import { Sized } from "../sized/sized.js"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export type Bytes<N extends number = number> = Uint8Array & { length: N }

export namespace Bytes {

  /**
   * Alloc 0-lengthed Bytes using standard constructor
   * @returns `Bytes[]`
   */
  export function empty(): Bytes<0> {
    return alloc(0)
  }

  /**
   * Alloc Bytes with typed length using standard constructor
   * @param length 
   * @returns `Bytes[0;N]`
   */
  export function alloc<N extends number>(length: N): Bytes<N> {
    return new Uint8Array(length) as Bytes<N>
  }

  /**
   * Alloc Bytes with typed length using Buffer.allocUnsafe
   * @param length 
   * @returns `Bytes[number;N]`
   */
  export function allocUnsafe<N extends number>(length: N): Bytes<N> {
    return fromView(Buffer.allocUnsafe(length)) as Bytes<N>
  }

  /**
   * Create bytes from sized of length N
   * @param sized 
   * @returns `Bytes[number;N]`
   */
  export function from<N extends number>(sized: Sized<number, N>): Bytes<N> {
    return new Uint8Array(sized) as Bytes<N>
  }

  /**
   * Alloc Bytes with typed length using Buffer.allocUnsafe and fill it with WebCrypto's CSPRNG
   * @param length 
   * @returns `Bytes[number;N]`
   */
  export function random<N extends number>(length: N): Bytes<N> {
    const bytes = allocUnsafe(length)
    crypto.getRandomValues(bytes)
    return bytes
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

  export class CastError<N extends number> extends Error {
    constructor(
      readonly bytes: Bytes,
      readonly length: N
    ) {
      super(`Could not cast ${bytes.length}-sized bytes into ${length}-sized bytes`)
    }
  }

  /**
   * Try to cast bytes of N length into Bytes<N>
   * @param view 
   * @param length 
   * @returns 
   */
  export function tryCast<N extends number>(bytes: Bytes, length: N): Result<Bytes<N>, CastError<N>> {
    if (Bytes.is(bytes, length))
      return new Ok(bytes)
    return new Err(new CastError(bytes, length))
  }

  /**
   * Cast view of N length into Bytes<N>
   * @param view 
   * @param length 
   * @returns 
   */
  export function tryCastFromView<N extends number>(view: ArrayBufferView, length: N): Result<Bytes<N>, CastError<N>> {
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
    if (length < bytes.length)
      return fromView(bytes.slice(bytes.length - length, bytes.length)) as Bytes<N>

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
  export function padStart(bytes: Bytes, length: number): Bytes {
    if (length < bytes.length)
      return bytes

    const result = Bytes.alloc(length)
    result.set(bytes, length - bytes.length)

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