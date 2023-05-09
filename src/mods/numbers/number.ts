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

export type GreaterOrEquals10<X extends number, Y extends number> =
  Y extends 0 ? (
    true
  ) : (
    X extends 0 ? (
      false
    ) : (
      GreaterOrEquals10<Decrement<X>, Decrement<Y>>
    )
  )

export type GreaterOrEquals<X extends number, Y extends number> =
  Y extends Digit ? (
    X extends Digit ? (
      GreaterOrEquals10<X, Y>
    ) : (
      true
    )
  ) : (
    Decrement100<Y> extends 0 ? (
      Decrement100<X> extends 0 ? (
        GreaterOrEquals<Decrement10<X>, Decrement10<Y>>
      ) : (
        true
      )
    ) : (
      GreaterOrEquals<Decrement100<X>, Decrement100<Y>>
    )
  )

export type Subtract10<X extends number, Y extends Digit> =
  Y extends 0 ? (
    X
  ) : (
    Subtract10<Decrement<X>, Decrement<Y>>
  )

export type Subtract<X extends number, Y extends number> =
  Y extends Digit ? (
    Subtract10<X, Y>
  ) : (
    Decrement100<Y> extends 0 ? (
      Subtract<Decrement10<X>, Decrement10<Y>>
    ) : (
      Subtract<Decrement100<X>, Decrement100<Y>>
    )
  )

export type Range<X extends number, Min extends number, Max extends number> =
  Greater<X, Min> extends true ? (
    Greater<Max, X> extends true ? (
      X
    ) : never
  ) : never

export function add<X extends number, Y extends number>(x: X, y: Y): Add<X, Y> {
  return x + y as any
}

export function subtract10<X extends number, Y extends Digit>(x: X, y: Y): Subtract10<X, Y> {
  return x - y as any
}

export function subtract<X extends number, Y extends number>(x: X, y: Y): Subtract<X, Y> {
  return x - y as any
}

export function greaterOrEquals<X extends number, Y extends number>(x: X, y: Y): GreaterOrEquals<X, Y> {
  return x >= y as any
}

export function greater<X extends number, Y extends number>(x: X, y: Y): Greater<X, Y> {
  return x > y as any
}

function accept<X extends number>(x: Range<X, 100, 200>) {

}

accept(199)