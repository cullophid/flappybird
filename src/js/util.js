// [a] -> a
export const head = list => list[0]
// [a] -> [a]
export const tail = list => list.slice(1)
// {k:v} -> {k:v} -> {k:v}
export const merge = (a, b) => Object.assign({}, a, b)

// ((y -> z), (a...x -> y)) -> (a...x -> z)
export const compose = (f, g) => (...args) => f(g(...args))

// ((a, b) -> a) -> a -> [b] -> a
export const reduce = (f, init, list) =>
  list.length === 0 ? init : reduce(f, f(init, head(list)), tail(list))

// ((a -> b), [a]) -> [b]
export const map = (f, list) => reduce((r, e) => [...r, f(e)], [], list)
// ((a -> Boolean), [a]) -> [a]
export const filter = (f, list) =>
  reduce((r, e) => f(e) ? [...r, e] : r, [], list)

// ((a -> Boolean), [a]) -> Boolean
export const any = (f, list) => reduce((r, e) => r || f(e), false, list)
