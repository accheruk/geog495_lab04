mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v10', // style URL
        zoom: 6.5, // starting zoom
        center: [-120, 47.5] // starting center
    }
);

async function geojsonFetch() { 
    // other operations
    let response = await fetch('assets/wa-covid-data-102521.geojson');
let covidData = await response.json();

map.on('load', function loadingData() {
    // add layer
    map.addSource('covidData', {
        type: 'geojson',
        data: covidData
    });
    
    map.addLayer({
        'id': 'covidData-layer',
        'type': 'fill',
        'source': 'covidData',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'deathPer10k'],
                '#FFEDA0',   // stop_output_0
                10,          // stop_input_0
                '#FED976',   // stop_output_1
                20,          // stop_input_1
                '#FEB24C',   // stop_output_2
                50,          // stop_input_2
                '#FD8D3C',   // stop_output_3
                100,         // stop_input_3
                '#FC4E2A',   // stop_output_4
                200,         // stop_input_4
                '#E31A1C',   // stop_output_5
                500,         // stop_input_5
                '#BD0026',   // stop_output_6
                1000,        // stop_input_6
                "#800026"    // stop_output_7
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });
    // add legend
    const layers = [
        '0-5',
        '5-9',
        '10-15',
        '15-19',
        '20-25',
        '25-29',
        '30 and more'
    ];
    const colors = [
        '#FFEDA070',
        '#FED97670',
        '#FEB24C70',
        '#FD8D3C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670'
    ];
    const legend = document.getElementById('legend');
legend.innerHTML = "<b>COVID Deaths<br>(per 10k cases)</b><br><br>";

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});
map.on('mousemove', ({point}) => {
    const covid = map.queryRenderedFeatures(point, {
        layers: ['covidData-layer']
    });
    document.getElementById('text-description').innerHTML = covid.length ?
        `<h3>${covid[0].properties.name}</h3><p><strong><em>${covid[0].properties.deathPer10k}</strong> deaths per 10k cases</em></p>` :
        `<p>Hover over a county!</p>`;
});
});
}

geojsonFetch();


