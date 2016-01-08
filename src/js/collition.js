import {any} from './util'
const outOfScreen = ({y, height}) => (y + height > 600) || y < 0

const boxCollision = a => b =>
  (a.x + a.width > b.x && a.x < b.x + b.width) &&
  (a.y + a.height > b.y) && (a.y < b.y + b.height)

const hitPipe = (bird, pipes) => any(boxCollision(bird), pipes)

export default ({bird, pipes}) => outOfScreen(bird) || hitPipe(bird, pipes)
