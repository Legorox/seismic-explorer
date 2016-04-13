import React, { Component } from 'react'
import pureRender from 'pure-render-decorator'
import { connect } from 'react-redux'
import * as actions from '../actions'
import MapKey from '../components/map-key'
import OverlayButton from '../components/overlay-button'
import { goToRegion } from '../api'

import '../../css/overlay-controls.less'

@pureRender
class OverlayControls extends Component {
  constructor(props) {
    super(props)
    this.handleGoUp = this.handleGoUp.bind(this)
    this.handleGoHome = this.handleGoHome.bind(this)
    this.set2DMode = this.set2DMode.bind(this)
    this.set3DMode = this.set3DMode.bind(this)
    this.setCrossSectionDrawMode = this.setCrossSectionDrawMode.bind(this)
  }

  handleGoUp() {
    const { regionsHistory } = this.props
    // The last entry in history is the current region, so pick the earlier one (-2 index).
    goToRegion(regionsHistory.get(-2))
  }

  handleGoHome() {
    const { regionsHistory } = this.props
    goToRegion(regionsHistory.first())
  }

  set2DMode() {
    const { setMode, setCrossSectionPoint } = this.props
    // Remove cross section points when user cancels cross-section drawing.
    setCrossSectionPoint(0, null)
    setCrossSectionPoint(1, null)
    setMode('2d')
  }

  setCrossSectionDrawMode() {
    const { setMode } = this.props
    setMode('cross-section')
  }

  set3DMode() {
    const { setMode } = this.props
    if (this.canOpen3D()) setMode('3d')
  }

  canGoBack() {
    const { regionsHistory } = this.props
    // > 1, as the last entry is the current path
    return regionsHistory.size > 1
  }

  canOpen3D() {
    const { crossSectionPoints } = this.props
    return crossSectionPoints.get(0) && crossSectionPoints.get(1)
  }

  render() {
    const { mode, layers, changedViews, resetView } = this.props
    const canGoBack = this.canGoBack()
    const canOpen3D = this.canOpen3D()
    const viewChanged = mode !== '3d' && changedViews.has('2d') || mode === '3d' && changedViews.has('3d')
    return (
      <div className='overlay-controls'>
        <div className='controls top left'>
          {mode !== '3d' && canGoBack &&
            <div>
              <OverlayButton onClick={this.handleGoHome} icon='home'/>
              <OverlayButton onClick={this.handleGoUp} icon='arrow-up'/>
            </div>
          }
        </div>
        <div className='controls bottom left'>
          {viewChanged && <OverlayButton onClick={resetView} icon='map-marker'/>}
        </div>
        <div className='controls bottom right inline'>
          {mode === '2d' &&
            <OverlayButton onClick={this.setCrossSectionDrawMode} icon='paint-brush'>
              Draw a cross section line and open 3D view
            </OverlayButton>
          }
          {mode === 'cross-section' &&
            <div>
              <OverlayButton onClick={this.set3DMode} disabled={!canOpen3D} icon='cube'>
                Open 3D view {!canOpen3D && '(draw a cross section line first!)'}
              </OverlayButton>
              <OverlayButton onClick={this.set2DMode} icon='close'>
                Cancel
              </OverlayButton>
            </div>
          }
          {mode === '3d' &&
            <OverlayButton onClick={this.set2DMode} icon='map'>
              Go back to 2D map
            </OverlayButton>
          }
        </div>
        <div className='controls top right'>
          <MapKey showBoundariesInfo={layers.get('plates') && mode !== '3d'}/>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    region: state.get('region'),
    layers: state.get('layers'),
    mode: state.get('mode'),
    regionsHistory: state.get('regionsHistory'),
    crossSectionPoints: state.get('crossSectionPoints'),
    changedViews: state.get('changedViews')
  }
}

export default connect(mapStateToProps, actions)(OverlayControls)