import './index.css'
import $ from 'jquery'
import React, {Component} from 'react'
import ReactDOM, {render} from 'react-dom'

// webpack模块懒加载
import(/* webpackChunkName: 'addition'*/ "./add").then(result => {
  console.log(result.add(1,5)) 
})

 console.log(React, Component, ReactDOM, render, 'hell dll');

let nOBJ = Object.assign({age: 18}, {job: "web"})
console.log(nOBJ);

let arr = [5125,54,15,12154]
for (let item of arr.keys()) {
  console.log(item);
}