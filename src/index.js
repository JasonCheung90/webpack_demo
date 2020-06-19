import './index.css'
import React from 'react'
import ReactDOM from 'react-dom'

// webpack模块懒加载
import(/* webpackChunkName: 'addition'*/ './add').then( (result) => {
  console.log(result.add(1, 5))
})

// eslint-disable-next-line require-jsdoc
async function getLodash() {
  const {default: _} = await import(/* webpackChunkName: 'lodash' */ 'lodash')
  const res = _.join('[a,b,c,d,e]', '~')
  console.log(res)
}

getLodash()

console.log(React, ReactDOM);

const nOBJ = Object.assign({age: 18}, {job: 'drive'})
console.log(nOBJ);

const arr = [5125, 54, 15, 12154]
for (const item of arr.keys()) {
  console.log(item);
}
