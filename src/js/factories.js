import {SCREEN_WIDTH, SCREEN_HEIGHT, GAP_SIZE} from './config'

// () -> Bird
export const birdFactory = () => ({
  color: 'red',
  x: SCREEN_WIDTH / 2,
  y: SCREEN_HEIGHT / 2,
  accl: 0,
  width: 30,
  height: 30
})

// Number -> [Pipe]
const createPipe = gap => [
  {
    color: 'green',
    x: SCREEN_WIDTH,
    y: 0,
    width: 50,
    height: gap - GAP_SIZE / 2
  },
  {
    color: 'green',
    x: 800,
    y: (gap + GAP_SIZE / 2),
    width: 50,
    height: SCREEN_HEIGHT - (gap + 50)
  }
]

// () -> [Pipe]
export const pipeFactory = () => createPipe((Math.random() * (SCREEN_HEIGHT - 2 * GAP_SIZE)) + GAP_SIZE)
