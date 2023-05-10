import { Bytes } from "index.js";
import { Range, add, greater, subtract } from "./number.js";

const x = add(30_010, 30_000)
const y = subtract(5_800, 5_700)

const p = greater(1, 1)
// const p2 = greaterOrEquals(10_003, 10_002)

class Cursor<T extends Bytes> {

  constructor(
    readonly inner: T,
    readonly offset: number
  ) { }

  static create<Min extends number, Max extends number>(inner: Bytes<Range<Min, Max>>): Cursor<Bytes<Range<Min, Max>>> {
    return new Cursor(inner, inner.length)
  }

}

// function read5<T extends Bytes, R extends number>(value: Cursor<T, R & GreaterOrEquals<5>>): Cursor<T, Subtract<R, 5>> {
//   return new Cursor(value.inner.slice(0, 5), value.remaining - 5) as any
// }

// function read1024<T extends Bytes, R extends number>(value: Cursor<T, R & GreaterOrEquals<1024>>): Cursor<T, Subtract<R, 1024>> {
//   return new Cursor(value.inner.slice(0, 1024), value.remaining - 1024) as any
// }

// function readN<T extends Bytes, R extends number, N extends number>(value: Cursor<T, GreaterOrEquals<R, N>>, length: N): Cursor<T, Subtract<R, N>> {
//   return new Cursor(value.inner.slice(0, length), value.remaining - length) as any
// }

// const cursor1024 = read1024(Cursor.create(Bytes.random(2048)))

const b = Bytes.random(1024) as Bytes<Range<100, 200>>
const c = Cursor.create(b)

function test<Min extends number, Max extends number>(c: Range<Min, Max>): {

}