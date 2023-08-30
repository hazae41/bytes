import { Err, Ok } from "@hazae41/result";
import { Blobs } from "libs/blobs/blobs.js";

export namespace Base64 {

  export async function encode(bytes: Uint8Array) {
    const data = await Blobs.readAsDataURL(new Blob([bytes]))
    return data.slice(data.indexOf(",") + 1)
  }

  export async function decode(text: string) {
    const res = await fetch("data:application/octet-binary;base64," + text)
    return new Uint8Array(await res.arrayBuffer())
  }

  export async function tryEncode(bytes: Uint8Array) {
    const data = await Blobs.tryReadAsDataURL(new Blob([bytes]))

    if (data.isErr())
      return data

    return new Ok(data.inner.slice(data.inner.indexOf(",") + 1))
  }

  export async function tryDecode(text: string) {
    const res = await fetch("data:application/octet-binary;base64," + text)

    if (!res.ok)
      return new Err(new DOMException())

    return new Ok(new Uint8Array(await res.arrayBuffer()))
  }

}