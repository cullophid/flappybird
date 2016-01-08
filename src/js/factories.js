const GAP = 60

export const birdFactory = () => ({
  color: 'orange',
  x: 400,
  y: 300,
  accl: 0,
  width: 30,
  height: 30
})

const createPipe = gap => [
  {
    color: 'green',
    x: 800,
    y: 0,
    width: 50,
    height: gap - GAP
  },
  {
    color: 'green',
    x: 800,
    y: (gap + GAP),
    width: 50,
    height: 600 - (gap + 50)
  }
]

export const pipeFactory = () => createPipe((Math.random() * 400) + 100)
