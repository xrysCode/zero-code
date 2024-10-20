let funStr = `()=>{
    return arg
  }`
// console.log(funStr)
let test = () => {
  return arg
}
let r = (function () {
  const arg = 'I am inner'

  // 箭头函数可以访问 outerVar 和 innerVar
  // const greet = eval(funStr)
  const greet = () => {
    return arg
  }

  return greet
})()
console.log(r)
