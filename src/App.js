/* 
 * Copyright (c) 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */
import React, { Component } from 'react'
import Globe from 'worldwind-react-globe'
import { 
  CardColumns, 
  Container } from 'reactstrap'
import { 
  LayersCard, 
  MarkersCard, 
  NavBar, 
  NavBarItem, 
  SearchBox, 
  SettingsCard, 
  Tools } from 'worldwind-react-globe-bs4'

import './App.css'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.globeRef = React.createRef()
    this.layersRef = React.createRef()
    this.markersRef = React.createRef()
    this.settingsRef = React.createRef()
  }
  
  componentDidMount() {
    // Get the component with the WorldWindow after mounting
    this.setState({globe: this.globeRef.current})
  }

  render() {
    const globe = this.globeRef.current
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const lat = params.get('lat');
    const lon = params.get('lon');
    const alt = params.get('alt');
    this.state = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      alt: alt ? parseInt(alt) : 20e6,
      globe: null,
      selectedMarkerImage: 'https://files.worldwind.arc.nasa.gov/artifactory/web/0.9.0/images/pushpins/castshadow-red.png'
    }

    const layers = [
      {layer: 'blue-marble', options: {category: 'base', enabled: true}},
      {layer: 'blue-marble-landsat', options: {category: 'base', enabled: false}},
      {layer: 'bing-aerial', options: {category: 'base', enabled: false}},
      {layer: 'bing-aerial-labels', options: {category: 'base', enabled: false}},
      {layer: 'eox-sentinal2', options: {category: 'base', enabled: false}},
      {layer: 'eox-sentinal2-labels', options: {category: 'base', enabled: true}},
      {layer: 'eox-openstreetmap', options: {category: 'overlay', enabled: false, opacity: 0.8}},
      {layer: 'bing-roads', options: {category: 'overlay', enabled: false, opacity: 0.8}},
      {layer: 'renderables', options: {category: 'data', enabled: true, displayName: 'Markers'}},
      {layer: 'compass', options: {category: 'setting', enabled: false}},
      {layer: 'coordinates', options: {category: 'setting', enabled: true}},
      {layer: 'view-controls', options: {category: 'setting', enabled: false}},
      {layer: 'stars', options: {category: 'setting', enabled: false}},
      {layer: 'atmosphere-day-night', options: {category: 'setting', enabled: false}}
    ]

    const position = {
      latitude: this.state.lat,
      longitude: this.state.lon,
    }
    //render markup
    if (globe) {
      const WorldWind = window.WorldWind
      let attributes = new WorldWind.PlacemarkAttributes(null);
      attributes.imageScale = 4.8;
      attributes.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.3, WorldWind.OFFSET_FRACTION, 0.0);
      attributes.imageColor = WorldWind.Color.WHITE;
      attributes.labelAttributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 1.0);
      attributes.labelAttributes.color = WorldWind.Color.YELLOW;
      attributes.drawLeaderLine = true;
      attributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
      attributes.imageSource = this.state.selectedMarkerImage;

      let placeMark = new WorldWind.Placemark(position, /*eyeDistanceScaling*/true, attributes);
      // placeMark.label = "Lat " + position.latitude.toPrecision(4).toString() + "\nLon " + position.longitude.toPrecision(5).toString();
      placeMark.altitudeMode = WorldWind.CLAMP_TO_GROUND;
      placeMark.eyeDistanceScalingThreshold = 2500000;

      let layer = globe.getLayer("Markers");
      if (layer) {
        layer.addRenderable(placeMark);
      }
    }


    return (
      <div className='fullscreen'>
        <Globe
          ref={this.globeRef}
          latitude={this.state.lat}
          longitude={this.state.lon}
          altitude={this.state.alt}
          layers={layers}/>
        />
      </div>
    )
  }
}
