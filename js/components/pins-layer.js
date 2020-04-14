import L from 'leaflet'
import { withLeaflet } from 'react-leaflet'
import WrappingMapLayer from './wrapping-map-layer'
import config from '../config'

import '../../css/pins-layer.less'

const getPinIcon = label => L.divIcon({
  className: `map-pin-icon ${!config.allowPinDrag && 'fixed-position'}`,
  html: `<div class="map-pin-content">${label}<div class='pin fa fa-map-pin' /></div>`
})

const allPins = []

export default withLeaflet(class PinsLayer extends WrappingMapLayer {
  getData () {
    return this.props.pins.toJS() // config.pins.map(data => ({ lat: data[0], lng: data[1], label: data[2] }))
  }

  getElement (data, idx) {
    const { lat, lng, label } = data
    if (idx > allPins.length - 1) {
      const el = new L.Marker([lat, lng], {
        icon: getPinIcon(label),
        draggable: config.allowPinDrag,
        bubblingMouseEvents: !config.allowPinDrag
      })
      el.lat = lat
      el.lng = lng
      allPins.push(el)
      return el
    } else {
      const existingPin = allPins[idx]
      const newLatLng = new L.LatLng(lat, lng)
      existingPin.setLatLng(newLatLng)
      return existingPin
    }
  }
})
