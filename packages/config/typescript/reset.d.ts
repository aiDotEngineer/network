import '@total-typescript/ts-reset';

declare global {
  // Override the types for Object.keys() and Object.entries() to be more
  // helpful in cases where the keys are of a known set.
  interface ObjectConstructor {
    keys<T>(
      o: T,
    ): T extends Record<string, unknown>
      ? Array<keyof T & string>
      : Array<string>;

    entries<T>(
      o: T,
    ): T extends Record<string, infer U>
      ? Array<[keyof T & string, U]>
      : T extends ArrayLike<infer U>
      ? Array<[string, U]>
      : Array<[string, unknown]>;
  }

  // ===
  // The rest of these are some helpful global utility types
  // ===

  type ValueOf<T extends object> = T[keyof T];

  // This is used to "expand" an intersection of two or more objects when
  // displayed in tooltips, for example `Expand<{ a: string } & { b: string }>`
  // will expand to `{ a: string, b: string }`
  // Reference: https://stackoverflow.com/a/57683652
  type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

  type TimeoutID = ReturnType<typeof setTimeout>;
}
