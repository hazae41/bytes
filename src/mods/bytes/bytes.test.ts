import { assert, test } from "@hazae41/phobos";
import { Sized } from "../sized/sized.js";
import { Bytes } from "./bytes.js";

function doNotRun() {
  const bytesX = Bytes.fromView(new Uint8Array(8)) // Bytes<number>

  const bytes8 = Bytes.alloc(8) // Bytes<8>

  if (Bytes.equals(bytesX, bytes8))
    bytesX // Bytes<8>
  else
    bytesX // Bytes<number>

  if (bytesX.length === bytes8.length)
    bytesX.length // Bytes<number>.length: 8
  else
    bytesX // Bytes<number>

  if (Bytes.is(bytesX, 8))
    bytesX // Bytes<8>
  else
    bytesX // Bytes<number>

  if (Bytes.is(bytes8, 16))
    bytes8 // never
  else
    bytes8 // Bytes<8>

  Bytes.tryCastFromView(bytesX, 16).unwrap() // Bytes<16>
  Bytes.tryCastFromView(bytes8, 16).unwrap() // Bytes<16>

  function test(sized: Sized<number, 8>) {
    sized.length // 8
  }

  test(Sized.cast([1, 2, 3, 4, 5, 6, 7, 8], 8).unwrap())
  test(bytes8)
}

await test("padStart", async ({ message }) => {
  const bytes = new Uint8Array([1, 2, 3, 4])

  const identity = Bytes.padStart(bytes, 2)
  const padded = Bytes.padStart(bytes, 6)

  assert(Bytes.equals(identity, Bytes.from(Sized.cast([1, 2, 3, 4], 4).unwrap())))
  assert(Bytes.equals(padded, Bytes.from(Sized.cast([0, 0, 1, 2, 3, 4], 6).unwrap())))

  console.log(message)
})

await test("sliceOrPadStart", async ({ message }) => {
  const bytes = Bytes.from(Sized.cast([1, 2, 3, 4], 4).unwrap())

  const sliced = Bytes.sliceOrPadStart(bytes, 2)
  const padded = Bytes.sliceOrPadStart(bytes, 6)

  assert(Bytes.equals(sliced, Bytes.from(Sized.cast([3, 4], 2).unwrap())))
  assert(Bytes.equals(padded, Bytes.from(Sized.cast([0, 0, 1, 2, 3, 4], 6).unwrap())))

  console.log(message)
})