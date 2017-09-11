import { MapLayer } from 'react-leaflet'
import { volcanoCanvasLayer } from '../custom-leaflet/volcano-canvas-layer'
import volcanoes from '../data/volcanoes_full.js'

let _cachedVolcanoes
function getVolcanoes (map) {
  if (!_cachedVolcanoes) {
    _cachedVolcanoes = []
    if (volcanoes) {
      for (var i = 0; i < volcanoes.length; i++) {
        // simple JSON array import
        // let lat = volcanoes[i][1]
        // let lng = volcanoes[i][0]
        // let date = volcanoes[i][2]
        // let pos = {
        //   position: { lng: lng, lat: lat },
        //   date: date
        // }

        // full JSON import
        let v = volcanoes[i]
        let lat = v.latitude
        let lng = v.longitude
        let age = v.lasteruptionyear !== 'Unknown' ? -(v.lasteruptionyear - 2017) : -15000

        let volcanoData = {
          position: {lng, lat},
          age,
          lastactivedate: v.lasteruptionyear,
          name: v.volcanoname,
          country: v.country,
          region: v.subregion,
          volcanotype: v.primaryvolcanotype
        }
        _cachedVolcanoes.push(volcanoData)
      }
    }
  }
  return _cachedVolcanoes
}

export default class VolcanoLayer extends MapLayer {
  componentWillMount () {
    super.componentWillMount()
    this.leafletElement = volcanoCanvasLayer()
    this.setLeafletElementProps()
  }

  componentDidUpdate () {
    this.setLeafletElementProps()
  }

  setLeafletElementProps () {
    const { map, volcanoClick } = this.props
    this.leafletElement.setVolcanoPoints(getVolcanoes(map))
    this.leafletElement.onVolcanoClick(volcanoClick)
  }

  render () {
    return null
  }
}