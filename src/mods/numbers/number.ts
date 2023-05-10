import { Bytes } from "index.js";
import { Decrement } from "./decrement.js";
import { Decrement10 } from "./decrement10.js";
import { Decrement100 } from "./decrement100.js";
import { Decrement1000 } from "./decrement1000.js";
import { Increment } from "./increment.js";
import { Increment10 } from "./increment10.js";
import { Increment100 } from "./increment100.js";
import { Increment1000 } from "./increment1000.js";

export type Lower1000<X extends number> =
  Decrement1000<X> extends 0 ? true : false

export type Lower100<X extends number> =
  Decrement100<X> extends 0 ? true : false

export type Lower10<X extends number> =
  Decrement10<X> extends 0 ? true : false

export type Add<X extends number, Y extends number> =
  Lower1000<Y> extends true ? (
    Lower100<Y> extends true ? (
      Lower10<Y> extends true ? (
        Y extends 0 ? (
          X
        ) : (
          Add<Increment<X>, Decrement<Y>>
        )
      ) : (
        Add<Increment10<X>, Decrement10<Y>>
      )
    ) : (
      Add<Increment100<X>, Decrement100<Y>>
    )
  ) : (
    Add<Increment1000<X>, Decrement1000<Y>>
  )

export type Subtract<X extends number, Y extends number> =
  Lower1000<Y> extends true ? (
    Lower100<Y> extends true ? (
      Lower10<Y> extends true ? (
        Y extends 0 ? (
          X
        ) : (
          Subtract<Decrement<X>, Decrement<Y>>
        )
      ) : (
        Subtract<Decrement10<X>, Decrement10<Y>>
      )
    ) : (
      Subtract<Decrement100<X>, Decrement100<Y>>
    )
  ) : (
    Subtract<Decrement1000<X>, Decrement1000<Y>>
  )

export type IsGreater<X extends number, Y extends number> =
  Lower1000<X> extends true ? (
    Lower1000<Y> extends true ? (
      Lower100<X> extends true ? (
        Lower100<Y> extends true ? (
          Lower10<X> extends true ? (
            Lower10<Y> extends true ? (
              X extends 0 ? (
                false
              ) : (
                Y extends 0 ? (
                  true
                ) : (
                  IsGreater<Decrement<X>, Decrement<Y>>
                )
              )
            ) : (
              false
            )
          ) : (
            Lower10<Y> extends true ? (
              true
            ) : (
              IsGreater<Decrement10<X>, Decrement10<Y>>
            )
          )
        ) : (
          false
        )
      ) : (
        Lower100<Y> extends true ? (
          true
        ) : (
          IsGreater<Decrement100<X>, Decrement100<Y>>
        )
      )
    ) : (
      false
    )
  ) : (
    Lower1000<Y> extends true ? (
      true
    ) : (
      IsGreater<Decrement1000<X>, Decrement1000<Y>>
    )
  )

export type IsGreaterOrEquals<X extends number, Y extends number> =
  Lower1000<X> extends true ? (
    Lower1000<Y> extends true ? (
      Lower100<X> extends true ? (
        Lower100<Y> extends true ? (
          Lower10<X> extends true ? (
            Lower10<Y> extends true ? (
              X extends 0 ? (
                Y extends 0 ? (
                  true
                ) : (
                  false
                )
              ) : (
                Y extends 0 ? (
                  true
                ) : (
                  IsGreaterOrEquals<Decrement<X>, Decrement<Y>>
                )
              )
            ) : (
              false
            )
          ) : (
            Lower10<Y> extends true ? (
              true
            ) : (
              IsGreaterOrEquals<Decrement10<X>, Decrement10<Y>>
            )
          )
        ) : (
          false
        )
      ) : (
        Lower100<Y> extends true ? (
          true
        ) : (
          IsGreaterOrEquals<Decrement100<X>, Decrement100<Y>>
        )
      )
    ) : (
      false
    )
  ) : (
    Lower1000<Y> extends true ? (
      true
    ) : (
      IsGreaterOrEquals<Decrement1000<X>, Decrement1000<Y>>
    )
  )

export type Greater<X extends number, Y extends number> =
  IsGreater<X, Y> extends true ? X : never

export type Smaller<X extends number, Y extends number> =
  IsGreater<Y, X> extends true ? X : never

export type GreaterOrEquals<X extends number, Y extends number> =
  IsGreaterOrEquals<X, Y> extends true ? X : never

export type Range<X extends number, Min extends number, Max extends number> =
  Greater<X, Min> & Smaller<X, Max>

export function increment<X extends number>(x: X): Increment<X> {
  return x + 1
}

export function decrement<X extends number>(x: X): Decrement<X> {
  return x - 1
}

export function add<X extends number, Y extends number>(x: X, y: Y): Add<X, Y> {
  return x + y as any
}

export function subtract<X extends number, Y extends number>(x: X, y: Y): Subtract<X, Y> {
  return x - y as any
}

export function greaterOrEquals<X extends number, Y extends number>(x: X, y: Y): IsGreaterOrEquals<X, Y> {
  return x >= y as any
}

export function greater<X extends number, Y extends number>(x: X, y: Y): IsGreater<X, Y> {
  return x > y as any
}

function incrementRange<X extends number>(x: Range<X, 100, 200>) {
  return add(x, 1)
}

incrementRange(123)

class Cursor<T extends Bytes, R extends number> {

  constructor(
    readonly inner: T,
    readonly remaining: R
  ) { }

  static create<N extends number>(inner: Bytes<N>): Cursor<Bytes<N>, N> {
    return new Cursor(inner, inner.length)
  }

}

function read5<T extends Bytes, R extends number>(value: Cursor<T, GreaterOrEquals<R, 5>>): Cursor<T, Subtract<R, 5>> {
  return new Cursor(value.inner.slice(0, 5), value.remaining - 5) as any
}

function read1024<T extends Bytes, R extends number>(value: Cursor<T, GreaterOrEquals<R, 1024>>): Cursor<T, Subtract<R, 1024>> {
  return new Cursor(value.inner.slice(0, 1024), value.remaining - 1024) as any
}



const cursor1024 = read1024(Cursor.create(Bytes.random(1024)))