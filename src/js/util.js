export const head = list => list[0]
export const tail = list => list.slice(1)

export const reduce = (f, init, list) =>{
  return list.length === 0 ? init : reduce(f, f(init, head(list)), tail(list))
}

export const map = (f, list) => reduce((r, e) => [...r, f(e)], [], list)
export const filter = (f, list) =>
  reduce((r, e) => f(e) ? [...r, e] : r, [], list)

export const merge = (a, b) => Object.assign({}, a, b)

export const compose = (f, g) => (...args) => f(g(...args))

export const any = (f, list) => reduce((r, e) => r || f(e), false, list)
