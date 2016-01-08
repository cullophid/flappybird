import {merge, map, filter, compose} from './util'
import {pipeFactory} from './factories'

const simulateBird = bird => merge(bird, {y: bird.y + bird.accl, accl: bird.accl + 0.25})
const addPipe = pipes => Math.random() > 0.995 ? [...pipes, ...pipeFactory()] : pipes
const filterPipes = pipes => filter(({x, width}) => x + width >= 0, pipes)
const movePipes = pipes => map(pipe => merge(pipe, {x: pipe.x - 2}), pipes)
const simulatePipes = compose(filterPipes, compose(movePipes, addPipe))

export default m =>
  merge(m, {bird: simulateBird(m.bird), pipes: simulatePipes(m.pipes)})
