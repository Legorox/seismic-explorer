import React, { PureComponent } from 'react'
import { LayerGroup, Marker, Polyline, Polygon, withLeaflet } from 'react-leaflet'
import { circleIcon } from '../custom-leaflet/icons'
import crossSectionRectangle, { pointToArray, limitDistance } from '../core/cross-section-rectangle'
import config from '../config'

const MOUSE_DOWN = 'mousedown touchstart'
const MOUSE_MOVE = 'mousemove touchmove'
const MOVE_UP = 'mouseup touchend'

export default withLeaflet(class CrossSectionDrawLayer extends PureComponent {
  constructor (props) {
    super(props)
    this.drawStart = this.drawStart.bind(this)
    this.drawEnd = this.drawEnd.bind(this)
    this.setPoint1 = this.setPoint.bind(this, 0)
    this.setPoint2 = this.setPoint.bind(this, 1)
  }

  componentDidMount () {
    const { map } = this.props.leaflet
    map.dragging.disable()
    map.on(MOUSE_DOWN, this.drawStart)
  }

  componentWillUnmount () {
    const { map } = this.props.leaflet
    map.dragging.enable()
    map.off(MOUSE_DOWN, this.drawStart)
  }

  drawStart (event) {
    const { map } = this.props.leaflet
    this.setPoint1(event)
    this.setPoint2(null)
    map.on(MOUSE_MOVE, this.setPoint2)
    map.on(MOVE_UP, this.drawEnd)
  }

  drawEnd () {
    const { map } = this.props.leaflet
    map.off(MOUSE_MOVE, this.setPoint2)
    map.off(MOVE_UP, this.drawEnd)
  }

  setPoint (index, event) {
    const { setCrossSectionPoint } = this.props
    let point = null
    if (event) {
      // Event might be either Leaflet mouse event or Leaflet drag event.
      const latLng = event.latlng ? event.latlng : event.target.getLatLng()
      point = pointToArray(latLng)
    }
    if (index === 0 && point !== null) {
      this._tempPoint1 = point
    }
    if (index === 1 && point !== null && this._tempPoint1 !== null) {
      point = limitDistance(this._tempPoint1, point, config.maxCrossSectionLength)
    }
    setCrossSectionPoint(index, point)
  }

  render () {
    const { map } = this.props.leaflet
    const { crossSectionPoints } = this.props
    const point1 = crossSectionPoints.get(0)
    const point2 = crossSectionPoints.get(1)
    const rect = crossSectionRectangle(point1, point2)
    return (
      <LayerGroup map={map}>
        {point1 && <Marker position={point1} draggable icon={circleIcon('P1')} onLeafletDrag={this.setPoint1} />}
        {point2 && <Marker position={point2} draggable icon={circleIcon('P2')} onLeafletDrag={this.setPoint2} />}
        {point1 && point2 && <Polyline clickable={false} className='cross-section-line' positions={[point1, point2]} color='#fff' opacity={1} />}
        {rect && <Polygon positions={rect} clickable={false} color='#fff' weight={2} />}
      </LayerGroup>
    )
  }
})
