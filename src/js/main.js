import tick from './dsl/tick'
import {merge} from './util'
import render from './render'
import simulate from './simulate'
import {birdFactory} from './factories'
import gameOver from './gameOver'
import {FLAP_POWER} from './config'
// Model -> Boolean

let model = {
  bird: birdFactory(),
  pipes: []
}

const flap = () =>
  model = merge(model, {bird: merge(model.bird, {accl: FLAP_POWER})})

document.addEventListener('click', flap)
document.addEventListener('keypress', flap)

tick(i => {
  model = simulate(i, model)
  if (gameOver(model)) window.location.reload()
  render(model)
})
