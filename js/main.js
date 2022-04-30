'use strict';

const styles = {
    greater100: {
        iconShape: "doughnut",
        borderWidth: 5,
        borderColor: "#009a4b"
    },
    range40To100: {
        iconShape: "doughnut",
        borderWidth: 5,
        borderColor: "#FFEA00"
    },
    range20To40: {
        iconShape: "doughnut",
        borderWidth: 5,
        borderColor: "#F08000"
    },
    lower20: {
        iconShape: "doughnut",
        borderWidth: 5,
        borderColor: "#FF0000"
    },
    noData: {
        iconShape: "doughnut",
        borderWidth: 5,
        borderColor: "#8A90B4"
    }
}

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
                stockStyle = styles.greater100;
            } else if ( stock >= 40 && stock <= 100 ){
                stockStyle = styles.range40To100;
            } else if ( stock >= 20 && stock < 40 ){
                stockStyle = styles.range20To40;
            } else if ( stock < 20 && stock >= 0 ){
                stockStyle = styles.lower20;
            } else {
                stockStyle = styles.noData;
            }

            return L.marker( latlng, {
                icon: L.BeautifyIcon.icon( stockStyle )
            } );
        }
    }).addTo( state.map );
}

const loadBackend = () => {
    fetch('https://vipcube.github.io/opendata.gov.tw/rapidTestStock.json')
        .then( response => response.json() )
        .then( json => {
            console.log( json );
            if ( state.overLayers['健保藥局庫存'] ){
                const layer = state.overLayers['健保藥局庫存'];
                layer.clearLayers();
                layer.addData( json );
            }
        });
}
