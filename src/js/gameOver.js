import {SCREEN_HEIGHT} from './config'
import {any} from './util'
import {boxHitScreenEdge, boxCollision} from './dsl/physics'

// Box -> Boolean
const boxHitEdge = boxHitScreenEdge(SCREEN_HEIGHT)

// Model -> Boolean
export default ({bird, pipes}) => boxHitEdge(bird) || any(boxCollision(bird), pipes)
