import { Future } from "@hazae41/future"
import { Err, Ok, Result } from "@hazae41/result"

export namespace Blobs {

  export async function readAsDataURL(blob: Blob) {
    const future = new Future<string>()
    const reader = new FileReader()

    const onLoad = () => {
      future.resolve(reader.result as string)
    }

    const onError = () => {
      future.reject(reader.error)
    }

    try {
      reader.addEventListener("load", onLoad, { passive: true })
      reader.addEventListener("error", onError, { passive: true })

      reader.readAsDataURL(blob)

      return await future.promise
    } finally {
      reader.removeEventListener("load", onLoad)
      reader.removeEventListener("error", onError)
    }
  }

  export async function tryReadAsDataURL(blob: Blob) {
    const future = new Future<Result<string, DOMException>>()
    const reader = new FileReader()

    const onLoad = () => {
      future.resolve(new Ok(reader.result as string))
    }

    const onError = () => {
      future.resolve(new Err(reader.error!))
    }

    try {
      reader.addEventListener("load", onLoad, { passive: true })
      reader.addEventListener("error", onError, { passive: true })

      reader.readAsDataURL(blob)

      return await future.promise
    } finally {
      reader.removeEventListener("load", onLoad)
      reader.removeEventListener("error", onError)
    }
  }

}