import { Bytes } from "index.js";
import { IsGreaterOrEquals, IsLessOrEquals, Range, add, greater, subtract } from "./number.js";

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

const n = 150 as Range<100, 200>

function accept(range: Range<0, 200>) {

}

function rerange<Min extends number, Max extends number, Min2 extends number, Max2 extends number>(range: Range<IsGreaterOrEquals<Min, Min2> extends true ? Min : never, IsLessOrEquals<Max, Max2> extends true ? Max : never>): Range<Min2, Max2> {
  return range as any
}

accept(rerange(n))