import collition from './collition'
import tick from './tick'
import {merge} from './util'
import render from './render'
import simulate from './simulate'
import {birdFactory} from './factories'

let model = {
  bird: birdFactory(),
  pipes: []
}
const flap = () =>
  model = merge(model, {bird: merge(model.bird, {accl: - 6})})

document.addEventListener('click', flap)
document.addEventListener('keypress', flap)

tick(() => {
  model = simulate(model)
  if (collition(model)) window.location.reload()
  render(model)
})
