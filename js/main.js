'use strict';

const state = {
    overLayers: {},
    baseLayers: {},
    center: [23.7035, 120.8255]
}

const initMaps = (mapId) => {
    state.map = L.map( mapId , {
        zoom: 8,
        center: state.center,
        zoomControl: true,
        attributionControl: false
    });

    state.baseLayers["OSM"] = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(state.map);
}
