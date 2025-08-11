export const mapPromises = <T, U>(array: T[], fn: (value: T) => Promise<U>): Promise<U[]> =>
  array.reduce(
    (promise, item) => promise.then((result) => fn(item).then((value) => [...result, value])),
    Promise.resolve([] as U[])
  )

export const eachPromises = async <T>(
  array: T[],
  fn: (value: T) => Promise<void>
): Promise<void> => {
  for (const item of array) {
    await fn(item)
  }
}
