'use strict';

const state = {
    overLayers: {},
    baseLayers: {},
    center: [23.7035, 120.8255]
}

/**
 * Init the map.
 *
 * @param mapId
 */
const initMaps = (mapId) => {
    state.map = L.map( mapId , {
        zoom: 8,
        center: state.center,
        zoomControl: true,
        attributionControl: false
    });

    state.baseLayers["國土測繪通用版電子地圖"] = L.tileLayer('http://wmts.nlsc.gov.tw/wmts/EMAP/default/EPSG:3857/{z}/{y}/{x}', {
        attribution: '<a href="https://maps.nlsc.gov.tw/">國土測繪圖資服務雲</a>',
    }).addTo(state.map);

    state.sidebar = L.control.sidebar({
        closeButton: true,
        autopan: true,
        container: 'sidebar',
        position: 'left',
    }).addTo( state.map ).open('home');
}
