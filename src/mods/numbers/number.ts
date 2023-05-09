import { Decrement } from "./decrement.js";
import { Decrement10 } from "./decrement10.js";
import { Increment } from "./increment.js";
import { Increment10 } from "./increment10.js";
import { Ten } from "./ten.js";

export type Add10<X extends number, Y extends Ten> =
  Y extends 0 ? X : (
    Add10<Increment<X>, Decrement<Y>>
  )

export type Add<X extends number, Y extends number> =
  Y extends Ten ? Add10<X, Y> : (
    Add<Increment10<X>, Decrement10<Y>>
  )

export type Greater10<X extends Ten, Y extends Ten> =
  X extends 0 ? false : (
    Y extends 0 ? true : (
      Greater10<Decrement<X>, Decrement<Y>>
    )
  )

export type Greater<X extends number, Y extends number> =
  Y extends Ten ? (
    X extends Ten ? (
      Greater10<X, Y>
    ) : true
  ) : (
    Greater<Decrement10<X>, Decrement10<Y>>
  )

export type GreaterThanOrEquals10<X extends number, Y extends number> =
  Y extends 0 ? true : (
    X extends 0 ? false : (
      GreaterThanOrEquals10<Decrement<X>, Decrement<Y>>
    )
  )

export type Subtract10<X extends number, Y extends Ten> =
  GreaterThanOrEquals10<X, Y> extends true ? never : (
    Y extends 0 ? X : (
      Subtract10<Decrement<X>, Decrement<Y>>
    )
  )

export function add<X extends number, Y extends number>(x: X, y: Y): Add<X, Y> {
  return x + y as any
}

function subtract10<X extends number, Y extends Ten>(x: X, y: Y): Subtract10<X, Y> {
  return x - y as any
}

function greaterOrEquals10<X extends number, Y extends Ten>(x: X, y: Y): GreaterThanOrEquals10<X, Y> {
  return x >= y as any
}

function greater10<X extends Ten, Y extends Ten>(x: X, y: Y): Greater10<X, Y> {
  return x > y as any
}

export function greater<X extends number, Y extends number>(x: X, y: Y): Greater<X, Y> {
  return x > y as any
}

subtract10(1, 2)

greaterOrEquals10(5, 3)

greater10(5, 3)