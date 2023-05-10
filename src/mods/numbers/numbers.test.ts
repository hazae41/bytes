import { Bytes } from "index.js";
import { Greater, IsGreaterOrEquals, IsLessOrEquals, Range, Subtract, add, greater, subtract } from "./number.js";

const x = add(30_010, 30_000)
const y = subtract(5_800, 5_700)

const p = greater(1, 1)
// const p2 = greaterOrEquals(10_003, 10_002)

class Cursor<T extends Bytes, R extends number> {

  constructor(
    readonly inner: T,
    readonly remaining: R
  ) { }

  static create<N extends number>(inner: Bytes<N>): Cursor<Bytes<N>, Range<N, N>> {
    return new Cursor(inner, inner.length as any as Range<N, N>)
  }

  static rerange<T extends Bytes, Min extends number, Max extends number, Min2 extends number, Max2 extends number>(cursor: Cursor<T, Range<GreaterOrEquals2<Min, Min2>, LessOrEquals2<Max, Max2>>>): Cursor<T, Range<Min2, Max2>> {
    return cursor as any
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

function accept(range: Greater<50>) {

}

type GreaterOrEquals2<X extends number, Y extends number> =
  IsGreaterOrEquals<X, Y> extends true ? X : never
type LessOrEquals2<X extends number, Y extends number> =
  IsLessOrEquals<X, Y> extends true ? X : never

function rerange<Min extends number, Max extends number, Min2 extends number, Max2 extends number>(range: Range<GreaterOrEquals2<Min, Min2>, LessOrEquals2<Max, Max2>>): Range<Min2, Max2> {
  return range as any
}

accept(rerange(n))

function read1024<T extends Bytes, Max extends number>(cursor: Cursor<T, Range<1024, Max>>): Cursor<Bytes, Range<0, Subtract<Max, 1024>>> {
  return new Cursor(cursor.inner.slice(0, 1024), cursor.remaining - 1024) as any
}

function readN<T extends Bytes, N extends number, Max extends number>(cursor: Cursor<T, Range<N, Max>>, length: N): Cursor<Bytes, Range<0, Subtract<Max, 1024>>> {
  return new Cursor(cursor.inner.slice(0, length), cursor.remaining - length) as any
}


const c = Cursor.create(Bytes.random(2048))

read1024(Cursor.rerange(c))
readN(Cursor.rerange(c), 1024)

