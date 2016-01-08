import {map} from './util'
import {clear, drawRect} from './canvas'

const drawPipe = drawRect
const drawBird = drawRect

export default model => {
  clear()
  map(drawPipe, model.pipes)
  drawBird(model.bird)
}
