import { Decrement } from "./decrement.js";
import { Decrement10 } from "./decrement10.js";
import { Decrement100 } from "./decrement100.js";
import { Digit } from "./digit.js";
import { Increment } from "./increment.js";
import { Increment10 } from "./increment10.js";
import { Increment100 } from "./increment100.js";

export type Add10<X extends number, Y extends Digit> =
  Y extends 0 ? (
    X
  ) : (
    Add10<Increment<X>, Decrement<Y>>
  )

export type Add<X extends number, Y extends number> =
  Y extends Digit ? (
    Add10<X, Y>
  ) : (
    Decrement100<Y> extends 0 ? (
      Add<Increment10<X>, Decrement10<Y>>
    ) : (
      Add<Increment100<X>, Decrement100<Y>>
    )
  )

export type Greater10<X extends Digit, Y extends Digit> =
  X extends 0 ? (
    false
  ) : (
    Y extends 0 ? (
      true
    ) : (
      Greater10<Decrement<X>, Decrement<Y>>
    )
  )

export type Greater<X extends number, Y extends number> =
  Y extends Digit ? (
    X extends Digit ? (
      Greater10<X, Y>
    ) : (
      true
    )
  ) : (
    Decrement100<Y> extends 0 ? (
      Decrement100<X> extends 0 ? (
        Greater<Decrement10<X>, Decrement10<Y>>
      ) : (
        true
      )
    ) : (
      Greater<Decrement100<X>, Decrement100<Y>>
    )
  )

export type GreaterThanOrEquals10<X extends number, Y extends number> =
  Y extends 0 ? (
    true
  ) : (
    X extends 0 ? (
      false
    ) : (
      GreaterThanOrEquals10<Decrement<X>, Decrement<Y>>
    )
  )

export type Subtract10<X extends number, Y extends Digit> =
  GreaterThanOrEquals10<X, Y> extends true ? never : (
    Y extends 0 ? X : (
      Subtract10<Decrement<X>, Decrement<Y>>
    )
  )

export function add<X extends number, Y extends number>(x: X, y: Y): Add<X, Y> {
  return x + y as any
}

function subtract10<X extends number, Y extends Digit>(x: X, y: Y): Subtract10<X, Y> {
  return x - y as any
}

function greaterOrEquals10<X extends number, Y extends Digit>(x: X, y: Y): GreaterThanOrEquals10<X, Y> {
  return x >= y as any
}

function greater10<X extends Digit, Y extends Digit>(x: X, y: Y): Greater10<X, Y> {
  return x > y as any
}

export function greater<X extends number, Y extends number>(x: X, y: Y): Greater<X, Y> {
  return x > y as any
}

subtract10(1, 2)

greaterOrEquals10(5, 3)

greater10(5, 3)