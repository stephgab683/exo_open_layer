import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import {Circle, Fill, Stroke, Style} from 'ol/style';

// Fond de carte Stamen Terrain
const baseLayer = new TileLayer({
  source: new XYZ({
    url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png',
    attributions: '&copy; Stadia Maps, Stamen Design, OpenMapTiles & OpenStreetMap contributors'
  })
});

// Style pour les points de mines
const mineStyle = new Style({
  image: new Circle({
    radius: 7,
    fill: new Fill({
      color: 'rgba(255, 100, 0, 0.8)'
    }),
    stroke: new Stroke({
      color: '#8B4513',
      width: 2
    })
  })
});

// Couche vectorielle des mines
const minesLayer = new VectorLayer({
  source: new VectorSource({
    url: '../deals.geojson',
    format: new GeoJSON()
  }),
  style: mineStyle
});

// Création de la carte
const map = new Map({
  target: 'map',
  layers: [
    baseLayer,
    minesLayer  // N'oublie pas d'ajouter ta couche ici !
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

// Interaction au survol
map.on('pointermove', function(evt) {
  const pixel = map.getEventPixel(evt.originalEvent);
  const hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});

// Clic pour afficher les infos
map.on('click', function(evt) {
  map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    const properties = feature.getProperties();
    console.log('Mine sélectionnée:', properties);
    alert('Mine: ' + (properties.name || 'Sans nom'));
  });
});