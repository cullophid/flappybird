
export default f => {
  const loop = () => {
    window.requestAnimationFrame(loop)
    f()
  }
  loop()
}
