import { CanvasLayer } from './canvas-layer'
import { DomUtil, DomEvent } from 'leaflet'
import VolcanoView from '../volcanos/volcano-view'

export const VolcanoCanvasLayer = CanvasLayer.extend({
  initialize: function (options) {
    CanvasLayer.prototype.initialize.call(this, options)
    this.draw = this.draw.bind(this)
    this.latLngToPoint = this.latLngToPoint.bind(this)
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onMouseClick = this._onMouseClick.bind(this)
  },

  _initCanvas: function () {
    this.externalView = new VolcanoView()
    CanvasLayer.prototype._initCanvas.call(this, this.externalView.canvas)
    DomUtil.addClass(this._canvas, 'volcanos-canvas-layer')
  },

  onAdd: function (map) {
    CanvasLayer.prototype.onAdd.call(this, map)
    DomEvent.on(this._canvas, 'mousemove', this._onMouseMove, this)
    DomEvent.on(this._canvas, 'mouseup', this._onMouseClick, this)
    DomEvent.on(this._canvas, 'touchend', this._onMouseClick, this)
  },

  onRemove: function (map) {
    CanvasLayer.prototype.onRemove.call(this, map)
    DomEvent.off(this._canvas, 'mousemove', this._onMouseMove)
    DomEvent.off(this._canvas, 'mouseup', this._onMouseClick)
    DomEvent.off(this._canvas, 'touchend', this._onMouseClick)
    // Very important, without it, there's a significant memory leak (each time this layer is added and removed,
    // what may happen quite often).
    this.externalView.destroy()
  },

  _onMouseMove: function (e) {
  },

  _onMouseClick: function (e) {
  },

  setVolcanoPoints: function (points) {
    this._volcanoPoints = points
    this.scheduleRedraw()
  },

  _reset: function () {
    let topLeft = this._map.containerPointToLayerPoint([0, 0])
    DomUtil.setPosition(this._canvas, topLeft)

    let size = this._map.getSize()
    this.externalView.setSize(size.x, size.y)
    this.externalView.invalidatePositions()
    this._redraw()
  },

  // This function is expensive
  // Try to limit position recalculation
  latLngToPoint: function(latLng) {
    return this._map.latLngToContainerPoint(latLng)
  },

  draw: function () {
    if (this._volcanoPoints) {
      this.externalView.setProps({VolcanoPoints: this._volcanoPoints, latLngToPoint: this.latLngToPoint})
      this._volcanoPoints = null
    }
    const transitionInProgess = this.externalView.render()
    if (transitionInProgess) {
      this.scheduleRedraw()
    }
  }
})

export function volcanoCanvasLayer() {
  return new VolcanoCanvasLayer();
}