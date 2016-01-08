import tick from './dsl/tick'
import {merge} from './util'
import render from './render'
import simulate from './simulate'
import {birdFactory} from './factories'
import gameOver from './gameOver'
// Model -> Boolean

let model = {
  bird: birdFactory(),
  pipes: []
}

const flap = () =>
  model = merge(model, {bird: merge(model.bird, {accl: -6})})

document.addEventListener('click', flap)
document.addEventListener('keypress', flap)

tick(i => {
  model = simulate(i, model)
  if (gameOver(model)) window.location.reload()
  render(model)
})
