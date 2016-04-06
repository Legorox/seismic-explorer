import React, { Component } from 'react'
import pureRender from 'pure-render-decorator'
import { magnitudeToRadius, depthToColor } from '../custom-leaflet/earthquake-sprite'

import '../../css/map-key.less'

@pureRender
export default class MapKey extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false
    }
    this.open = this.open.bind(this)
    this.hide = this.hide.bind(this)
  }

  open() {
    this.setState({opened: true})
  }

  hide() {
    this.setState({opened: false})
  }

  render() {
    const { showBoundariesInfo } = this.props
    const { opened } = this.state
    return !opened ?
      <div className='map-key map-button' onClick={this.open}><i className='fa fa-info'/></div>
      :
      <div className='map-key map-key-content'>
        <i onClick={this.hide} className='map-key-close fa fa-close'/>
        <table className='magnitude-density'>
          <tbody>
            <tr><th colSpan='2'>Magnitude</th><th colSpan='2'>Depth</th></tr>
            <tr><td>{circle(3)}</td><td>3</td><td>{earthquakeColor(50)}</td><td>0-100 km</td></tr>
            <tr><td>{circle(4)}</td><td>4</td><td>{earthquakeColor(150)}</td><td>100-200 km</td></tr>
            <tr><td>{circle(5)}</td><td>5</td><td>{earthquakeColor(250)}</td><td>200-300 km</td></tr>
            <tr><td>{circle(6)}</td><td>6</td><td>{earthquakeColor(350)}</td><td>300-400 km</td></tr>
            <tr><td>{circle(7)}</td><td>7</td><td>{earthquakeColor(450)}</td><td>400-500 km</td></tr>
            <tr><td>{circle(8)}</td><td>8</td><td>{earthquakeColor(550)}</td><td>> 500 km</td></tr>
          </tbody>
        </table>
        { showBoundariesInfo &&
          <table className='boundaries'>
            <tbody>
            <tr><th colSpan='2'>Plate boundaries</th></tr>
            <tr><td>{boundaryColor('#ffffff')}</td><td>Continental Convergent Boundary</td></tr>
            <tr><td>{boundaryColor('#a83800')}</td><td>Continental Transform Fault</td></tr>
            <tr><td>{boundaryColor('#ffff00')}</td><td>Continental Rift Boundary</td></tr>
            <tr><td>{boundaryColor('#e600a9')}</td><td>Oceanic Convergent Boundary</td></tr>
            <tr><td>{boundaryColor('#38a800')}</td><td>Oceanic Transform Fault</td></tr>
            <tr><td>{boundaryColor('#bf2026')}</td><td>Oceanic Spreading Rift</td></tr>
            <tr><td>{boundaryColor('#508fcb')}</td><td>Subduction Zone</td></tr>
            </tbody>
          </table>
        }
      </div>
  }
}

function circle(magnitude) {
  return <svg xmlns='http://www.w3.org/2000/svg' width='34' height='34'>
           <circle cx='17' cy='17' r={magnitudeToRadius(magnitude)} stroke='black' fill='rgba(0,0,0,0)'/>
         </svg>
}

function earthquakeColor(depth) {
  return <div className='earthquake-color' style={{backgroundColor: toHexStr(depthToColor(depth))}}></div>
}

function boundaryColor(color) {
  return <div className='boundary-color' style={{backgroundColor: color}}></div>
}

function toHexStr(d) {
  const hex = Number(d).toString(16)
  return "#000000".substr(0, 7 - hex.length) + hex
}