document.getElementById('applyFilters').addEventListener('click', function() {
    const borough = document.getElementById('borough').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const status = document.getElementById('status').value;

    // Construct the API query URL based on selected filters
    let apiUrl = `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%0A%20%20%60unique_key%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60created_date%60%2C%0A%20%20%60closed_date%60%2C%0A%20%20%60status%60%2C%0A%20%20%60complaint_type%60%2C%0A%20%20%60descriptor%60%2C%0A%20%20%60borough%60%0AWHERE%0A%20%20(%60created_date%60%0A%20%20%20%20BETWEEN%20%22${startDate}T00%3A00%3A00%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20AND%20%22${endDate}T23%3A59%3A59%22%20%3A%3A%20floating_timestamp)%0A%20%20AND%20caseless_eq(%60agency%60%2C%20%22DOT%22)`;

    if (borough) {
        apiUrl += `%20AND%20caseless_eq(%60borough%60%2C%20%22${borough}%22)`;
    }

    if (status) {
        apiUrl += `%20AND%20caseless_eq(%60status%60%2C%20%22${status}%22)`;
    }

    console.log('API URL:', apiUrl); // Log the constructed API URL


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Filtered data:', data); // Verify the filtered data in console

            // Clear existing markers on the map
            const vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: new ol.Collection()
                })
            });

            // Add markers to the map based on filtered data
            data.forEach(item => {
                const lonLat = ol.proj.fromLonLat([parseFloat(item.longitude), parseFloat(item.latitude)]);
                const marker = new ol.Feature({
                    geometry: new ol.geom.Point(lonLat),
                    name: item.complaint_type,
                    description: item.descriptor,
                    status: item.status,
                    createdDate: item.created_date,
                    closedDate: item.closed_date,
                    borough: item.borough
                });
                vectorLayer.getSource().addFeature(marker);
            });

            // Add or replace the vector layer with markers on the map
            const mapLayers = map.getLayers();
            mapLayers.clear(); // Clear existing layers
            mapLayers.push(new ol.layer.Tile({
                source: new ol.source.OSM()
            }));
            mapLayers.push(vectorLayer); // Add the vector layer with markers

            // Fit the map view to the extent of the vector layer
            map.getView().fit(vectorLayer.getSource().getExtent());
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
