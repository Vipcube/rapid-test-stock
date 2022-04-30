'use strict';

const colors = {
    greater100: "green",
    range40To100: "blue",
    range20To40: "orange",
    lower20: "red",
    noData: "darkgreen"
}

const state = {
    overLayers: {},
    baseLayers: {},
    center: [25.0850681831, 121.564750671]
}

/**
 * Init the map.
 *
 * @param mapId
 */
const initMaps = (mapId) => {
    state.map = L.map( mapId , {
        zoom: 13,
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

    L.control.locate().addTo( state.map );

    L.control.custom({
        position: 'bottomright',
        content: `<div class="card shadow rounded map-legend-panel" style="padding: 5px"><dl>
                    <dt style="font-size: 1.25rem"><span style="color:#6FAB25">●</span>：100個以上</dt>
                    <dt style="font-size: 1.25rem"><span style="color:#36A5D6">●</span>：40個以上、低於100個</dt>
                    <dt style="font-size: 1.25rem"><span style="color:#F1942F">●</span>：20個以上、低於40個</dt>
                    <dt style="font-size: 1.25rem"><span style="color:#CD3B28">●</span>：低於20個</dt>
                    <dt style="font-size: 1.25rem"><span style="color:#446677">●</span>：目前沒有資料</dt>
                 </dl></div>`
    }).addTo( state.map );

    initGeoJsonPointLayer();
    loadBackend();

    state.map.on('move', () => {
        state.overLayers['健保藥局庫存'].clearLayers();
    });

    state.map.on('moveend', () => {
        loadBackend();
    });
}

const initGeoJsonPointLayer = () => {
    state.overLayers['健保藥局庫存'] = L.geoJson( null, {
        onEachFeature: (feature, layer) => {
            layer.bindTooltip( (layer) => {
                return `<b>藥局：</b>${layer.feature.properties.name}<br>
                    <b>電話：</b>${layer.feature.properties.phone}<br>
				    <b>地址：</b>${layer.feature.properties.address}<br>
                    <b>目前庫存：</b>${layer.feature.properties.stock}<br>
                    <b>資料時間：</b>${layer.feature.properties.updateTime}`;
            }, {
                direction:'right',
                className:"map-tooltip",
                offset:[0, 0]
            } );

            (() => {
                layer.on("click", () => {

                });
            })(layer, feature.properties);
        },
        pointToLayer: (feature, latlng) => {
            const stock = feature.properties.stock;
            let stockStyle;
            if ( stock > 100  ){
                stockStyle = colors.greater100;
            } else if ( stock >= 40 && stock <= 100 ){
                stockStyle = colors.range40To100;
            } else if ( stock >= 20 && stock < 40 ){
                stockStyle = colors.range20To40;
            } else if ( stock < 20 && stock >= 0 ){
                stockStyle = colors.lower20;
            } else {
                stockStyle = colors.noData;
            }

            return L.marker( latlng, {
                icon: L.AwesomeMarkers.icon({
                    prefix: 'fa',
                    icon: 'hospital-o',
                    markerColor:  stockStyle
                })
            } );
        }
    }).addTo( state.map );
}

const loadBackend = () => {
    const bbox = state.map.getBounds();
    const bboxPolygon = turf.bboxPolygon( [bbox._southWest.lng, bbox._northEast.lat, bbox._northEast.lng, bbox._southWest.lat] );
    fetch('https://vipcube.github.io/opendata.gov.tw/rapidTestStock.json')
        .then( response => response.json() )
        .then( features => turf.pointsWithinPolygon( features, bboxPolygon ) )
        .then( features => {
            if ( state.overLayers['健保藥局庫存'] ) {
                const layer = state.overLayers['健保藥局庫存'];
                layer.clearLayers();
                layer.addData(features);
            }
        });
}
