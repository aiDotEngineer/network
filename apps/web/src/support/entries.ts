/**
 * This is just a slightly stricter form of Object.entries()
 */
export function entries<T extends object>(object: T) {
  return Object.entries(object) as Array<[keyof T, T[keyof T]]>;
}
