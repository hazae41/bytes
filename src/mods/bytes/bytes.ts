import { Buffers } from "libs/buffers/buffers.js"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export namespace Bytes {

  export function random(length: number) {
    const bytes = allocUnsafe(length)
    crypto.getRandomValues(bytes)
    return bytes
  }

  export function concat(list: Uint8Array[]) {
    return fromView(Buffer.concat(list))
  }

  export function equals(a: Uint8Array, b: Uint8Array) {
    return Buffers.fromView(a).equals(Buffers.fromView(b))
  }

  export function alloc(length: number) {
    return new Uint8Array(length)
  }

  export function allocUnsafe(length: number) {
    return fromView(Buffer.allocUnsafe(length))
  }

  export function fromView(view: ArrayBufferView) {
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
  }

  export function fromUtf8(text: string) {
    return encoder.encode(text)
  }

  export function toUtf8(bytes: Uint8Array) {
    return decoder.decode(bytes)
  }

  export function fromHexSafe(text: string) {
    return fromHex((text.length % 2) ? `0${text}` : text)
  }

  export function fromHex(text: string) {
    return fromView(Buffer.from(text, "hex"))
  }

  export function toHex(bytes: Uint8Array) {
    return Buffers.fromView(bytes).toString("hex")
  }

  export function fromBase64(text: string) {
    return fromView(Buffer.from(text, "base64"))
  }

  export function toBase64(bytes: Uint8Array) {
    return Buffers.fromView(bytes).toString("base64")
  }

  export function fromAscii(text: string) {
    return fromView(Buffer.from(text, "ascii"))
  }

  export function toAscii(bytes: Uint8Array) {
    return Buffers.fromView(bytes).toString("ascii")
  }

  export function fromBigInt(bigint: bigint) {
    return fromHexSafe(bigint.toString(16))
  }

  export function toBigInt(bytes: Uint8Array) {
    return BigInt(`0x${toHex(bytes)}`)
  }

  export function padStart(bytes: Uint8Array, length: number) {
    if (bytes.length >= length)
      return bytes

    const result = new Uint8Array(length)
    result.set(bytes, length - bytes.length)

    return result
  }

}