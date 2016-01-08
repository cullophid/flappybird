import {merge, map, filter, compose} from './util'
import {GRAVITY, SPEED, PIPE_MIN_SPACE, PIPE_PROBABILITY} from './config'
import {fall, moveX} from './dsl/physics'
import {pipeFactory} from './factories'

// [Pipe] -> [Pipe]
const movePipes = pipes => map(moveX(-SPEED), pipes)

// Element -> Element
const freeFall = fall(GRAVITY)

// Number -> [Pipe] -> [Pipe]
const addPipe = (tick, pipes) =>
  tick % PIPE_MIN_SPACE === 0 && Math.random() > PIPE_PROBABILITY ? [...pipes, ...pipeFactory()] : pipes

// [Pipe] -> [Pipe]
const filterPipes = pipes => filter(({x, width}) => x + width >= 0, pipes)

// Number -> Model -> [Pipe]
const simulatePipes = compose(filterPipes, compose(movePipes, addPipe))

// Number -> Model -> Model§
export default (tick, m) => ({
  bird: freeFall(m.bird),
  pipes: simulatePipes(tick, m.pipes)
})
