import { Decrement } from "./decrement.js";
import { Decrement10 } from "./decrement10.js";
import { Decrement100 } from "./decrement100.js";
import { Decrement1000 } from "./decrement1000.js";
import { Digit } from "./digit.js";
import { Increment } from "./increment.js";
import { Increment10 } from "./increment10.js";
import { Increment100 } from "./increment100.js";
import { Increment1000 } from "./increment1000.js";

export type Add<X extends number, Y extends number> =
  Decrement1000<Y> extends 0 ? (
    Decrement100<Y> extends 0 ? (
      Y extends Digit ? (
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
  Decrement1000<Y> extends 0 ? (
    Decrement100<Y> extends 0 ? (
      Y extends Digit ? (
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

export type Greater<X extends number, Y extends number> =
  Decrement1000<Y> extends 0 ? (
    Decrement1000<X> extends 0 ? (
      Decrement100<Y> extends 0 ? (
        Decrement100<X> extends 0 ? (
          Decrement10<Y> extends 0 ? (
            Decrement10<X> extends 0 ? (
              X extends 0 ? (
                false
              ) : (
                Y extends 0 ? (
                  true
                ) : (
                  Greater<Decrement<X>, Decrement<Y>>
                )
              )
            ) : (
              true
            )
          ) : (
            Decrement10<X> extends 0 ? (
              false
            ) : (
              Greater<Decrement10<X>, Decrement10<Y>>
            )
          )
        ) : (
          true
        )
      ) : (
        Decrement100<X> extends 0 ? (
          false
        ) : (
          Greater<Decrement100<X>, Decrement100<Y>>
        )
      )
    ) : (
      true
    )
  ) : (
    Decrement1000<X> extends 0 ? (
      false
    ) : (
      Greater<Decrement1000<X>, Decrement1000<Y>>
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

export type Range<X extends number, Min extends number, Max extends number> =
  Greater<X, Min> extends true ? (
    Greater<Max, X> extends true ? (
      X
    ) : never
  ) : never

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

export function greaterOrEquals<X extends number, Y extends number>(x: X, y: Y): GreaterOrEquals<X, Y> {
  return x >= y as any
}

export function greater<X extends number, Y extends number>(x: X, y: Y): Greater<X, Y> {
  return x > y as any
}

function incrementRange<X extends number>(x: Range<X, 100, 200>) {
  return add(x, 1)
}

incrementRange(123)

class Holder<N extends number> {
  constructor(readonly inner: N) { }
}

function incrementRangeHolder<X extends number>(holder: Holder<Range<X, 100, 200>>) {
  return new Holder(add(holder.inner, 1))
}

incrementRangeHolder(new Holder(123))

class RangeClass<X extends number> {
  constructor(readonly inner: Range<X, 100, 200>) { }

  increment() {
    increment(this.inner)
  }
}