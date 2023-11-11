
export type Sized<T, N extends number = number> =
  | ArrayLike<T> & { readonly length: N }

export namespace Sized {

  export type Size<T> = T extends { readonly length: infer N } ? N : never

  /**
   * Type guard sized of N length into Sized<T, N>
   * @param bytes 
   * @param length 
   * @returns 
   */
  export function is<T, N extends number>(sized: Sized<T>, length: N): sized is Sized<T, N> {
    return sized.length === length
  }

}
