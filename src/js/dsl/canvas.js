import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../config'
const ctx = document.getElementById('main').getContext('2d')

export const clear = () => ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

export const drawBox = ({color, width, height, x, y}) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}
