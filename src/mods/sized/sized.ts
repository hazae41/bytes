import { Err, Ok, Result } from "@hazae41/result"

export type Sized<T, N extends number = number> = ArrayLike<T> & { length: N }

export namespace Sized {

  /**
   * Type guard sized of N length into Sized<T, N>
   * @param bytes 
   * @param length 
   * @returns 
   */
  export function is<T, N extends number>(sized: Sized<T>, length: N): sized is Sized<T, N> {
    return sized.length.valueOf() === length.valueOf()
  }

  /**
   * Cast view of N length into Bytes<N>
   * @param view 
   * @param length 
   * @returns 
   */
  export function cast<T, N extends number>(sized: Sized<T>, length: N): Result<Sized<T, N>> {
    if (Sized.is(sized, length))
      return new Ok(sized)

    return Err.error(`Could not cast ${sized.length}-sized into ${length}-sized`)
  }

}
