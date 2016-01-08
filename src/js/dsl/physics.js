import {merge} from '../util'

// Number -> Element -> Element
export const fall = gravity => e => merge(e, {y: e.y + e.accl, accl: e.accl + gravity})

// Number -> Box -=> Boolean
export const boxHitScreenEdge = screenHeight => ({y, height}) => (y + height > screenHeight) || y < 0

// Box -> Box -> Boolean
export const boxCollision = a => b =>
  (a.x + a.width > b.x && a.x < b.x + b.width) &&
  (a.y + a.height > b.y) && (a.y < b.y + b.height)

// Number-> Element -> Element
export const offsetX = x => e => merge(e, {x: e.x + x})
