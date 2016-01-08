import {map} from './util'
import {clear, drawBox} from './dsl/canvas'

export default model => {
  clear()
  map(drawBox, model.pipes)
  drawBox(model.bird)
}
