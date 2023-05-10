import { Bytes } from "index.js";
import { GreaterOrEquals, Range, Subtract, add, greater, greaterOrEquals, subtract } from "./number.js";

const x = add(30_010, 30_000)
const y = subtract(5_800, 5_700)

const p = greater(1, 1)
const p2 = greaterOrEquals(10_003, 10_002)

class Cursor<T extends Bytes, R extends number> {

  constructor(
    readonly inner: T,
    readonly remaining: R
  ) { }

  static create<N extends number>(inner: Bytes<N>): Cursor<Bytes<N>, N> {
    return new Cursor(inner, inner.length)
  }

}

function read5<T extends Bytes, R extends number>(value: Cursor<T, R & GreaterOrEquals<5>>): Cursor<T, Subtract<R, 5>> {
  return new Cursor(value.inner.slice(0, 5), value.remaining - 5) as any
}

function read1024<T extends Bytes, R extends number>(value: Cursor<T, R & GreaterOrEquals<1024>>): Cursor<T, Subtract<R, 1024>> {
  return new Cursor(value.inner.slice(0, 1024), value.remaining - 1024) as any
}

// @ts-ignore
function readN<T extends Bytes, R extends number, N extends number>(value: Cursor<T, GreaterOrEquals<R, N>>, length: N): Cursor<T, Subtract<R, N>> {
  return new Cursor(value.inner.slice(0, length), value.remaining - length) as any
}

const cursor1024 = read1024(Cursor.create(Bytes.random(2048)))

function test(x: Range<100, 200>): any {
  return undefined as any
}

test(101)
test(50)