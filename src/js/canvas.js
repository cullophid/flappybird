const ctx = document.getElementById('main').getContext('2d')

export const clear = () => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

export const drawRect = ({color, width, height, x, y}) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}
