export default f => {
  let i = 0
  const loop = () => {
    window.requestAnimationFrame(loop)
    f(i++)
  }

  loop()
}
