import React from 'react';
import { loadModules } from 'esri-loader';

class MyMapView extends React.Component {

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

componentDidMount() {
    loadModules(['esri/Map', 'esri/views/MapView', 'esri/Graphic', 'esri/geometry/Point', 'esri/symbols/SimpleMarkerSymbol', 'esri/PopupTemplate'], { css: true })
      .then(([ArcGISMap, MapView, Graphic, Point, SimpleMarkerSymbol, PopupTemplate]) => {
        const map = new ArcGISMap({
          basemap: 'topo-vector'
        });

        //a - display a map zoomed on Israe
        this.view = new MapView({
          container: this.mapRef.current,
          map: map,
          zoom: 7,                         
          center: [34.8516, 31.0461]      
        });

        //b - display capital cities from all over the world
        const cities = [
            { name: 'Jerusalem', latitude: 31.7767, longitude: 35.2345, population: "9.5m" },
            { name: 'Amman', latitude: 31.9454, longitude: 35.9284, population: "11.3m"  },
          ];
  
          // c - capital cities will display with red symbols
          const markerSymbol = new SimpleMarkerSymbol({
            color: [255, 0, 0],  // red
            outline: { // autocasts as new SimpleLineSymbol()
              color: [255, 255, 255],  // white
              width: 2
            }
          });
  
          //d- clicking on the point of a city a popup will display the name of the city
          const popupTemplate = new PopupTemplate({
            title: "{name}",
            content: "This is the capital city: {name}. population: {population}"
          });
  
          // b + c + d
          cities.forEach(city => {
            const point = new Point({
              longitude: city.longitude,
              latitude: city.latitude
            });
  
            const pointGraphic = new Graphic({
              geometry: point,
              symbol: markerSymbol,
              attributes: city,
              popupTemplate: popupTemplate
            });

            this.view.graphics.add(pointGraphic);
          });

      }) 
      .catch((err) => {
        console.error('Failed to load modules or initialize map:', err);
      });
  }

  componentWillUnmount() {
    if (this.view) {
       this.view.destroy();
    }
   }

  render() {
    return <div style={{height:800}} ref={this.mapRef}/>;
  }
}
export default MyMapView;