import { Err, Ok, Result } from "@hazae41/result"
import { Buffers } from "libs/buffers/buffers.js"
import { Sized } from "../sized/sized.js"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export type Bytes<N extends number = number> = Uint8Array & { length: N }

export namespace Bytes {

  /**
   * Create bytes from sized of length N
   * @param array 
   * @returns 
   */
  export function from<N extends number>(array: Sized<number, N>) {
    return new Uint8Array(array) as Bytes<N>
  }

  /**
   * Alloc 0-lengthed Bytes using standard constructor
   * @returns 
   */
  export function empty() {
    return alloc(0)
  }

  /**
   * Alloc Bytes with typed length using standard constructor
   * @param length 
   * @returns 
   */
  export function alloc<N extends number>(length: N) {
    return new Uint8Array(length) as Bytes<N>
  }

  /**
   * Alloc Bytes with typed length using Buffer.allocUnsafe
   * @param length 
   * @returns 
   */
  export function allocUnsafe<N extends number>(length: N) {
    return fromView(Buffer.allocUnsafe(length)) as Bytes<N>
  }

  /**
   * Alloc Bytes with typed length using Buffer.allocUnsafe and fill it with WebCrypto's CSPRNG
   * @param length 
   * @returns 
   */
  export function random<N extends number>(length: N) {
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
   * Cast bytes of N length into Bytes<N>
   * @param view 
   * @param length 
   * @returns 
   */
  export function cast<N extends number>(bytes: Bytes, length: N): Result<Bytes<N>> {
    if (Bytes.is(bytes, length))
      return new Ok(bytes)

    return Err.error(`Could not cast ${bytes.length}-sized bytes into ${length}-sized bytes`)
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
   * Concatenation using Buffer.concat
   * @param list 
   * @returns 
   */
  export function concat(list: Bytes[]) {
    return fromView(Buffer.concat(list))
  }

  /**
   * Cast view of N length into Bytes<N>
   * @param view 
   * @param length 
   * @returns 
   */
  export function castFromView<N extends number>(view: ArrayBufferView, length: N) {
    return cast(fromView(view), length)
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
  export function fromUtf8(text: string) {
    return encoder.encode(text)
  }

  /**
   * Utf8 decoding using standard decoder
   * @param text 
   * @returns 
   */
  export function toUtf8(bytes: Bytes) {
    return decoder.decode(bytes)
  }

  /**
   * https://github.com/nodejs/node/issues/24491
   * @param text 
   * @returns 
   */
  export function fromHexSafe(text: string) {
    return fromHex((text.length % 2) ? `0${text}` : text)
  }

  /**
   * Hex decoding using Buffer.from
   * @param text 
   * @returns 
   */
  export function fromHex(text: string) {
    return fromView(Buffer.from(text, "hex"))
  }

  /**
   * Hex encoding using Buffer.toString
   * @param bytes 
   * @returns 
   */
  export function toHex(bytes: Bytes) {
    return Buffers.fromView(bytes).toString("hex")
  }

  /**
   * Base64 decoding using Buffer.from
   * @param text 
   * @returns 
   */
  export function fromBase64(text: string) {
    return fromView(Buffer.from(text, "base64"))
  }

  /**
   * Base64 encoding using Buffer.toString
   * @param bytes 
   * @returns 
   */
  export function toBase64(bytes: Bytes) {
    return Buffers.fromView(bytes).toString("base64")
  }

  /**
   * Ascii decoding using Buffer.from
   * @param bytes 
   * @returns 
   */
  export function fromAscii(text: string) {
    return fromView(Buffer.from(text, "ascii"))
  }

  /**
   * Ascii encoding using Buffer.toString
   * @param bytes 
   * @returns 
   */
  export function toAscii(bytes: Bytes) {
    return Buffers.fromView(bytes).toString("ascii")
  }

  /**
   * BigInt decoding using fromHexSafe
   * @param bigint 
   * @returns 
   */
  export function fromBigInt(bigint: bigint) {
    return fromHexSafe(bigint.toString(16))
  }

  /**
   * BigInt encoding using toHex
   * @param bytes 
   * @returns 
   */
  export function toBigInt(bytes: Bytes) {
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
    if (bytes.length >= length)
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
  export function padStart(bytes: Bytes, length: number) {
    if (bytes.length >= length)
      return bytes

    const result = Bytes.alloc(length)
    result.set(bytes, length - bytes.length)

    return result
  }

}