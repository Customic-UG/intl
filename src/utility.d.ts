type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

type XOR<T, U> = T | U extends Object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

type AllXOR<T extends any[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
  ? AllXOR<[XOR<A, B>, ...Rest]>
  : never;

type Contra<T> = T extends any ? (arg: T) => void : never;

type InferContra<T> = [T] extends [(arg: infer I) => void] ? I : never;

type PickOne<T> = InferContra<InferContra<Contra<Contra<T>>>>;

type Union2Tuple<T> = PickOne<T> extends infer U
  ? Exclude<T, U> extends never
    ? [T]
    : [...Union2Tuple<Exclude<T, U>>, U]
  : never;

export type { AllXOR, Contra, InferContra, PickOne, Union2Tuple, Without };
