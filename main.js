//2.6 comment
// const clusterStyleFunction = (feature) => {
//     const features = feature.get('features'); // Get the features property
//     const size = features ? features.length : 1; // If features is undefined, default size to 1

//     if (!features) {
//         // If this is not a cluster, apply a fallback style for individual points
//         return new ol.style.Style({
//             image: new ol.style.Circle({
//                 radius: 6,
//                 fill: new ol.style.Fill({ color: 'rgba(0, 153, 255, 0.8)' }),
//                 stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
//             }),
//         });
//     }

//     return new ol.style.Style({
//         image: new ol.style.Circle({
//             radius: 10 + size, // Cluster radius grows with size
//             fill: new ol.style.Fill({ color: 'rgba(255, 153, 0, 0.8)' }),
//             stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
//         }),
//         text: new ol.style.Text({
//             text: size.toString(), // Display cluster size as text
//             font: 'bold 12px Arial',
//             fill: new ol.style.Fill({ color: '#fff' }),
//             stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.6)', width: 3 }),
//         }),
//     });
// };









// const detailedStyleFunction = (feature) => {
//     return new ol.style.Style({
//         image: new ol.style.Circle({
//             radius: 6, // Fixed size for individual points
//             fill: new ol.style.Fill({ color: 'rgba(0, 153, 255, 0.8)' }),
//             stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
//         }),
//         text: new ol.style.Text({
//             text: feature.get('complaint_type') || '', // Display complaint type if available
//             font: '10px Arial',
//             offsetY: -15, // Position text above the point
//             fill: new ol.style.Fill({ color: '#333' }),
//             stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
//         })
//     });
// };




const clusterStyleFunction = (feature) => {
    const features = feature.get('features');
    const size = features ? features.length : 1;

    if (!features) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: 'rgba(0, 153, 255, 0.8)' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
            }),
        });
    }

    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10 + size,
            fill: new ol.style.Fill({ color: 'rgba(255, 153, 0, 0.8)' }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
        }),
        text: new ol.style.Text({
            text: size.toString(),
            font: 'bold 12px Arial',
            fill: new ol.style.Fill({ color: '#fff' }),
            stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0.6)', width: 3 }),
        }),
    });
};

const detailedStyleFunction = (feature) => {
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: 'rgba(0, 153, 255, 0.8)' }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
        }),
        text: new ol.style.Text({
            text: feature.get('complaint_type') || '',
            font: '10px Arial',
            offsetY: -15,
            fill: new ol.style.Fill({ color: '#333' }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 }),
        }),
    });
};








//I didn't see a difference uncommented. 2.23
// // Initially fetch and display data for both layers
// fetchDataAndDisplay(jsonApiUrl, clusterLayer, clusterStyleFunction);
// fetchDataAndDisplay(jsonApiUrl, detailedLayer, detailedStyleFunction);


// // Function to fetch and display data dynamically
// function fetchDataAndDisplay(url, layer, styleFunction) {
//     fetch(url)
//         .then(response => response.json())  // Fetch the raw JSON data
//         .then(data => {
//             // Convert JSON data into OpenLayers features
//             const features = data.map(item => {
//                 const coordinates = ol.proj.fromLonLat([item.longitude, item.latitude]);  
//                 const feature = new ol.Feature({
//                     geometry: new ol.geom.Point(coordinates),  
//                     name: item.complaint_type,
//                        description: item.descriptor,
//                        status: item.status,
//                        createdDate: item.created_date,
//                        closedDate: item.closed_date,
//                        borough: item.borough

//                 });
//                 return feature;
//             });
//         })}

            






// //             //creating vector source for the layer
// //             const vectorSource = new ol.source.Vector({
// //                 features: features
// //             });

// //             //layer's source and style
// //             layer.setSource(vectorSource);
// //             layer.setStyle(styleFunction);  
// //         })
// //         .catch(error => console.error("Error fetching data:", error));
// // }










// basemap and vector layer setup
const baseMaps = {
    'CartoDBPositron': new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
        })
    }),
    'Satellite': new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=izHJpXfFaixU8kReKlKU'
        })
    })
};







//unified source for all data
const dataSource = new ol.source.Vector(); 
const detailedLayer = new ol.layer.Vector({
    source: dataSource,
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: 'rgba(0, 153, 255, 0.8)' }),
            stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
        })
    })
});



//initialize map
const map = new ol.Map({
    target: 'map',
    layers: [baseMaps['CartoDBPositron'], detailedLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat([-74.0060, 40.7128]),
        zoom: 10
    })
});






// basemap switcher functionality
document.getElementById('basemapSwitcher').addEventListener('click', (e) => {
    const basemap = e.target.getAttribute('data-basemap');
    let baseLayer;

    if (basemap === 'CartoDBPositron') {
        baseLayer = baseMaps['CartoDBPositron'];
    } else if (basemap === 'Satellite') {
        baseLayer = baseMaps['Satellite'];
    }

    if (baseLayer) {
        // Remove the current base map layer
        map.getLayers().forEach(layer => {
            if (layer instanceof ol.layer.Tile) {
                map.removeLayer(layer);
            }
        });

        // Add the selected base map layer
        map.addLayer(baseLayer);
    }
});


//API URLs for both JSON and CSV
//jsonapiurl2020: https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%0A%20%20%60unique_key%60%2C%0A%20%20%60created_date%60%2C%0A%20%20%60closed_date%60%2C%0A%20%20%60agency%60%2C%0A%20%20%60agency_name%60%2C%0A%20%20%60complaint_type%60%2C%0A%20%20%60descriptor%60%2C%0A%20%20%60location_type%60%2C%0A%20%20%60incident_zip%60%2C%0A%20%20%60incident_address%60%2C%0A%20%20%60street_name%60%2C%0A%20%20%60cross_street_1%60%2C%0A%20%20%60cross_street_2%60%2C%0A%20%20%60intersection_street_1%60%2C%0A%20%20%60intersection_street_2%60%2C%0A%20%20%60address_type%60%2C%0A%20%20%60city%60%2C%0A%20%20%60landmark%60%2C%0A%20%20%60facility_type%60%2C%0A%20%20%60status%60%2C%0A%20%20%60due_date%60%2C%0A%20%20%60resolution_description%60%2C%0A%20%20%60resolution_action_updated_date%60%2C%0A%20%20%60community_board%60%2C%0A%20%20%60bbl%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60x_coordinate_state_plane%60%2C%0A%20%20%60y_coordinate_state_plane%60%2C%0A%20%20%60open_data_channel_type%60%2C%0A%20%20%60park_facility_name%60%2C%0A%20%20%60park_borough%60%2C%0A%20%20%60vehicle_type%60%2C%0A%20%20%60taxi_company_borough%60%2C%0A%20%20%60taxi_pick_up_location%60%2C%0A%20%20%60bridge_highway_name%60%2C%0A%20%20%60bridge_highway_direction%60%2C%0A%20%20%60road_ramp%60%2C%0A%20%20%60bridge_highway_segment%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60location%60%0AWHERE%0A%20%20(%60created_date%60%20%3E%20%222020-01-01T00%3A00%3A00%22%20%3A%3A%20floating_timestamp)%0A%20%20AND%20caseless_eq(%60agency%60%2C%20%22DOT%22)%0AORDER%20BY%20%60created_date%60%20DESC%20NULL%20LAST

// //just commented out for now but this is the one. 3.9
// const jsonApiUrl = 
// 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?' +
//   '$query=SELECT ' +
//     '`unique_key`, ' +
//     '`created_date`, ' +
//     '`closed_date`, ' +
//     '`agency`, ' +
//     '`agency_name`, ' +
//     '`complaint_type`, ' +
//     '`descriptor`, ' +
//     '`location_type`, ' +
//     '`incident_zip`, ' +
//     '`incident_address`, ' +
//     '`street_name`, ' +
//     '`cross_street_1`, ' +
//     '`cross_street_2`, ' +
//     '`intersection_street_1`, ' +
//     '`intersection_street_2`, ' +
//     '`address_type`, ' +
//     '`city`, ' +
//     '`landmark`, ' +
//     '`facility_type`, ' +
//     '`status`, ' +
//     '`due_date`, ' +
//     '`resolution_description`, ' +
//     '`resolution_action_updated_date`, ' +
//     '`community_board`, ' +
//     '`bbl`, ' +
//     '`borough`, ' +
//     '`x_coordinate_state_plane`, ' +
//     '`y_coordinate_state_plane`, ' +
//     '`open_data_channel_type`, ' +
//     '`park_facility_name`, ' +
//     '`park_borough`, ' +
//     '`vehicle_type`, ' +
//     '`taxi_company_borough`, ' +
//     '`taxi_pick_up_location`, ' +
//     '`bridge_highway_name`, ' +
//     '`bridge_highway_direction`, ' +
//     '`road_ramp`, ' +
//     '`bridge_highway_segment`, ' +
//     '`latitude`, ' +
//     '`longitude`, ' +
//     '`location` ' +
//   'WHERE ' +
//     '(`created_date` > "2020-01-01T00:00:00"::floating_timestamp) ' +
//     'AND caseless_eq(`agency`, "DOT") ' +
//   'ORDER BY ' +
//     '`created_date` DESC NULL LAST' ;



//const csvApiUrl = 'https://data.cityofnewyork.us/resource/erm2-nwe9.csv?$query=SELECT%20unique_key,created_date,closed_date,agency,agency_name,complaint_type,descriptor,location_type,incident_zip,incident_address,street_name,cross_street_1,cross_street_2,intersection_street_1,intersection_street_2,address_type,city,landmark,facility_type,status,due_date,resolution_description,resolution_action_updated_date,community_board,bbl,borough,x_coordinate_state_plane,y_coordinate_state_plane,open_data_channel_type,park_facility_name,park_borough,vehicle_type,taxi_company_borough,taxi_pick_up_location,bridge_highway_name,bridge_highway_direction,road_ramp,bridge_highway_segment,latitude,longitude,location%20WHERE%20caseless_contains(agency,%20%22dot%22)%20AND%20(created_date%20BETWEEN%20%222019-01-01T00:00:00%22::floating_timestamp%20AND%20%222024-09-21T16:10:08%22::floating_timestamp)%20ORDER%20BY%20created_date%20DESC%20NULL%20FIRST';



// //add csv file 1st attempt
// function plotPointsOnMap(points) {
//     const features = points.map(point => {
//       if (!isNaN(point.latitude) && !isNaN(point.longitude)) {
//         return new ol.Feature({
//           geometry: new ol.geom.Point(
//             ol.proj.fromLonLat([point.longitude, point.latitude])
//           )
//         });
//       }
//     }).filter(Boolean);}

// fetch('openlayer_webmap/311_Service_Requests_from_2010_to_Present_20240519.csv')
//   .then(response => response.text())
//   .then(csvData => {
//     const points = parseCSV(csvData);
//     plotPointsOnMap(points);
//   })
//   .catch(error => console.error("Error loading CSV:", error));

// function parseCSV(csvText) {
//   const rows = csvText.trim().split('\n');
//   const headers = rows[0].split(',');
  
//   const latIndex = headers.indexOf('Latitude');
//   const lonIndex = headers.indexOf('Longitude');

//   if (latIndex === -1 || lonIndex === -1) {
//     console.error("Latitude and Longitude columns not found in CSV");
//     return [];
//   }

//   return rows.slice(1).map(row => {
//     const cols = row.split(',');
//     return {
//       latitude: parseFloat(cols[latIndex]),
//       longitude: parseFloat(cols[lonIndex]),
//     };
//   });
// }

// function createFeaturesFromData(points) {
//     return points.map(point => {
//       if (!isNaN(point.latitude) && !isNaN(point.longitude)) {
//         return new ol.Feature({
//           geometry: new ol.geom.Point(
//             ol.proj.fromLonLat([point.longitude, point.latitude])
//           )
//         });
//       }
//     }).filter(Boolean); // Remove invalid points
//   }
 







// //add csv - 2nd attempt
//   // Define function to create features from points
// function createFeaturesFromData(points) {
//     return points.map(point => {
//       const lat = parseFloat(point.Latitude);
//       const lon = parseFloat(point.Longitude);
  
//       if (!isNaN(lat) && !isNaN(lon)) {
//         return new ol.Feature({
//           geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
//         });
//       }
//     }).filter(Boolean); 
//   }
  
//   // Load CSV and plot points
//   function loadAndPlotCSV() {
//     const csvFilePath = 'openlayer_webmap/311_Service_Requests_from_2010_to_Present_20240519.csv'; 
  
//     Papa.parse(csvFilePath, {
//       download: true,
//       header: true, 
//       complete: function (results) {
//         if (results.errors.length > 0) {
//           console.error("Error parsing CSV:", results.errors);
//           return;
//         }

  
  
//add csv 3rd attempt - no papaparse
// //using papaparse to load sample csv instead
// const csvFilePath = './data/nyc_data.csv';

// Papa.parse(/Users/nw/Desktop, {
//     download: true,
//     header: true,
//     skipEmptyLines: true,
//     complete: function(results) {
//         const data = results.data;
//         console.log("Parsed CSV data:", data);
//         addPointsToMap(data); 
//     }
// });






// //testing multiple calls 1000row limit 3.6.1
// async function fetchData(offset) {
//     const limit = 999; // maximum allowed rows per request
//     const apiUrl = `${jsonApiUrl}&$limit=${limit}&$offset=${offset}`;

//     const response = await fetch(apiUrl);
//     if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);
    
//     return response.json();
// }

// async function loadData() {
//     try {
//         const limit = 999;
//         const totalRows = 10000; // adjust this
//         const requests = [];

//         // Create an array of promises to fetch pages in parallel
//         for (let offset = 0; offset < totalRows; offset += limit) {
//             requests.push(fetchData(offset));
//         }

//         // Fetch all pages in parallel
//         const results = await Promise.all(requests);
        
//         const allData = results.flat();
//         dataSource.clear();

//         allData.forEach((item) => {
//             if (item.latitude && item.longitude) {
//                 const feature = new ol.Feature({
//                     geometry: new ol.geom.Point(ol.proj.fromLonLat([
//                         parseFloat(item.longitude),
//                         parseFloat(item.latitude)
//                     ])),
//                     properties: item
//                 });

//                 dataSource.addFeature(feature);
//             }
//         });

//         console.log(`Loaded ${dataSource.getFeatures().length} points onto the map.`);
//     } catch (error) {
//         console.error('Error fetching or processing data:', error);
//     }
// }

// loadData();











// //testing limit multiple calls 3.6.2
// async function fetchData(afterDate) {
//     const limit = 1000;
//     const apiUrl = `${jsonApiUrl}&$limit=${limit}&$where=created_date > "${afterDate}"`;


//     const response = await fetch(apiUrl);
//     if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`);

//     return response.json();
// }

// async function loadData() {
//     try {
//         dataSource.clear();
//         let afterDate = "2020-01-01T00:00:00"; // Start from this date
//         let keepFetching = true;

//         while (keepFetching) {
//             const data = await fetchData(afterDate);

//             if (data.length === 0) {
//                 keepFetching = false; // Stop when no more data
//             } else {
//                 // Add features to the map
//                 data.forEach((item) => {
//                     if (item.latitude && item.longitude) {
//                         const feature = new ol.Feature({
//                             geometry: new ol.geom.Point(ol.proj.fromLonLat([
//                                 parseFloat(item.longitude),
//                                 parseFloat(item.latitude)
//                             ])),
//                             properties: item
//                         });
//                         dataSource.addFeature(feature);
//                     }
//                 });

//                 console.log(`Loaded ${dataSource.getFeatures().length} points onto the map.`);

//                 // Set afterDate to the last record’s date for the next batch
//                 afterDate = data[data.length - 1].created_date;
//             }
//         }
//     } catch (error) {
//         console.error('Error fetching or processing data:', error);
//     }
// }

// // Call the function to load data
// loadData();









// //multiple calls 3.6.3
// async function fetchData(offset) {
//     const url = `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=1000&$offset=${offset}&$where=created_date%20%3E%20%222020-01-01T00:00:00%22`;

//     try {
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         return await response.json();
//     } catch (error) {
//         console.error(`Error fetching data at offset ${offset}:`, error);
//         return [];
//     }
// }

// async function loadData() {
//     let offset = 0;
//     let allData = [];
//     let batchSize = 1000;
//     let keepFetching = true;

//     while (keepFetching) {
//         // Fetch multiple pages in parallel (5 pages at a time)
//         const requests = [];
//         for (let i = 0; i < 5; i++) {
//             requests.push(fetchData(offset + i * batchSize));
//         }

//         // Wait for all requests to complete
//         const results = await Promise.all(requests);

//         // Flatten results and add to allData
//         const batchData = results.flat();
//         allData.push(...batchData);

//         console.log(`Fetched ${batchData.length} records from offset ${offset}`);

//         // If a batch returns less than 1000 rows, we are done
//         if (batchData.length < batchSize * 5) {
//             keepFetching = false;
//         }

//         // Move to next batch
//         offset += batchSize * 5;
//     }

//     console.log(`Total records fetched: ${allData.length}`);

//     // Clear previous data on the map
//     dataSource.clear();

//     // Add features to the map
//     allData.forEach(item => {
//         if (item.latitude && item.longitude) {
//             const feature = new ol.Feature({
//                 geometry: new ol.geom.Point(ol.proj.fromLonLat([
//                     parseFloat(item.longitude),
//                     parseFloat(item.latitude)
//                 ])),
//                 properties: item
//             });
//             dataSource.addFeature(feature);
//         }
//     });

//     console.log(`Loaded ${dataSource.getFeatures().length} points onto the map.`);
// }

// // Call the function to load data
// loadData();











// //multiple calls 3.6.4. wouldn't stop loading! but best result so far. 
// const jsonApiUrl = "https://data.cityofnewyork.us/resource/erm2-nwe9.json";

// async function fetchData(offset) {
//     const url = `${jsonApiUrl}?$limit=1000&$offset=${offset}&$where=created_date%20%3E%20%222020-01-01T00:00:00%22`;

//     try {
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         return await response.json();
//     } catch (error) {
//         console.error(`Error fetching data at offset ${offset}:`, error);
//         return [];
//     }
// }

// async function loadData() {
//     let offset = 0;
//     let allData = [];
//     let batchSize = 1000;
//     let keepFetching = true;

//     while (keepFetching) {
//         const requests = [];
//         for (let i = 0; i < 5; i++) {
//             requests.push(fetchData(offset + i * batchSize));
//         }

//         const results = await Promise.all(requests);
//         const batchData = results.flat();

//         console.log(`Fetched ${batchData.length} records from offset ${offset}`);

//         // Stop fetching if no new data is returned
//         if (batchData.length === 0) {
//             console.log("No more data to fetch. Stopping.");
//             keepFetching = false;
//             break;
//         }

//         allData.push(...batchData);
//         offset += batchSize * 5; // Move to the next batch
//     }

//     console.log(`Total records fetched: ${allData.length}`);

//     // Clear previous data on the map
//     dataSource.clear();

//     // Add features to the map
//     allData.forEach(item => {
//         if (item.latitude && item.longitude) {
//             const feature = new ol.Feature({
//                 geometry: new ol.geom.Point(ol.proj.fromLonLat([
//                     parseFloat(item.longitude),
//                     parseFloat(item.latitude)
//                 ])),
//                 properties: item
//             });
//             dataSource.addFeature(feature);
//         }
//     });

//     console.log(`Loaded ${dataSource.getFeatures().length} points onto the map.`);
// }

// // **Call the function to start fetching and displaying data**
// loadData();




//3.9.1 below 



//Explaination of making multiple requests in parallel

//Start with the API request given by NYC Open Data 
const jsonApiUrl = "https://data.cityofnewyork.us/resource/erm2-nwe9.json";

//3.9 added to get sample size
let totalFetched = 0; // Track total records fetched

//Offset of 1000 with the desired created date.
async function fetchData(offset) {
    const url = `${jsonApiUrl}?$limit=1000&$offset=${offset}&$where=created_date%20%3E%20%222020-01-01T00:00:00%22`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data at offset ${offset}:`, error);
        return [];
    }
}

async function loadData() {
    let offset = 0;
    let batchSize = 1000;
    let keepFetching = true;

    while (keepFetching) {
        const requests = [];
        
        //Fetch 5 batches at a time.
        for (let i = 0; i < 5; i++) {
            requests.push(fetchData(offset + i * batchSize));
        }

        //Solution: Parallel fetching with Promise.all
        //await Promise.all(requests) allows for 5 requests to be completed simultaneously. 
        const results = await Promise.all(requests);
        const batchData = results.flat();

        console.log(`Fetched ${batchData.length} records from offset ${offset}`);

        //Stop fetching if no new data is returned.
        if (batchData.length === 0) {
            console.log("No more data to fetch. Stopping.");
            //3.9 commented out to get sample size
            // keepFetching = false;
            break;
        }

        //Move to the next batch of 5. 
        offset += batchSize * 5; 

        //Add the current batch of points to the map.
        batchData.forEach(item => {
            if (item.latitude && item.longitude) {
                const feature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([
                        parseFloat(item.longitude),
                        parseFloat(item.latitude)
                    ])),
                    properties: item
                });
                dataSource.addFeature(feature);
                
                //3.9 Stop at 10000 points. 
                totalFetched++; //Count records.
                if (totalFetched >= 10000) {
                    console.log("Reached 10,000 points. Stopping.");
                    keepFetching = false;
                    return;
                }
            }
        });

        console.log(`Added ${batchData.length} points to the map. Total: ${dataSource.getFeatures().length}`);

        //Introduce a short delay to prevent excessive API requests.
        await new Promise(resolve => setTimeout(resolve, 100)); 
    }
}

//Calls the function to start fetching and displaying data.
loadData();











// //multiple calls 3.6.5
// // Fetch data using offset and limit
// async function fetchData(offset) {
//     const url = `${jsonApiUrl}&$limit=1000&$offset=${offset}`;

//     try {
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         return await response.json();
//     } catch (error) {
//         console.error(`Error fetching data at offset ${offset}:`, error);
//         return [];
//     }
// }

// async function loadData() {
//     let offset = 0;
//     let allData = [];
//     let batchSize = 1000;
//     let keepFetching = true;

//     while (keepFetching) {
//         const requests = [];
//         for (let i = 0; i < 5; i++) {
//             requests.push(fetchData(offset + i * batchSize));
//         }

//         const results = await Promise.all(requests);
//         const batchData = results.flat();

//         console.log(`Fetched ${batchData.length} records from offset ${offset}`);

//         // Stop fetching if no new data is returned
//         if (batchData.length === 0) {
//             console.log("No more data to fetch. Stopping.");
//             keepFetching = false;
//             break;
//         }

//         allData.push(...batchData);
//         offset += batchSize * 5; // Move to the next batch
//     }

//     console.log(`Total records fetched: ${allData.length}`);

//     // Clear previous data on the map
//     dataSource.clear();

//     // Add features to the map
//     allData.forEach(item => {
//         if (item.latitude && item.longitude) {
//             const feature = new ol.Feature({
//                 geometry: new ol.geom.Point(ol.proj.fromLonLat([
//                     parseFloat(item.longitude),
//                     parseFloat(item.latitude)
//                 ])),
//                 properties: item
//             });
//             dataSource.addFeature(feature);
//         }
//     });

//     console.log(`Loaded ${dataSource.getFeatures().length} points onto the map.`);
// }

// // **Call the function to start fetching and displaying data**
// loadData();









//testing multiple calls 3.6.6
// const jsonApiUrl = 
// 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?' +
//   '$query=SELECT ' +
//     '`unique_key`, ' +
//     '`created_date`, ' +
//     '`closed_date`, ' +
//     '`agency`, ' +
//     '`agency_name`, ' +
//     '`complaint_type`, ' +
//     '`descriptor`, ' +
//     '`location_type`, ' +
//     '`incident_zip`, ' +
//     '`incident_address`, ' +
//     '`street_name`, ' +
//     '`cross_street_1`, ' +
//     '`cross_street_2`, ' +
//     '`intersection_street_1`, ' +
//     '`intersection_street_2`, ' +
//     '`address_type`, ' +
//     '`city`, ' +
//     '`landmark`, ' +
//     '`facility_type`, ' +
//     '`status`, ' +
//     '`due_date`, ' +
//     '`resolution_description`, ' +
//     '`resolution_action_updated_date`, ' +
//     '`community_board`, ' +
//     '`bbl`, ' +
//     '`borough`, ' +
//     '`x_coordinate_state_plane`, ' +
//     '`y_coordinate_state_plane`, ' +
//     '`open_data_channel_type`, ' +
//     '`park_facility_name`, ' +
//     '`park_borough`, ' +
//     '`vehicle_type`, ' +
//     '`taxi_company_borough`, ' +
//     '`taxi_pick_up_location`, ' +
//     '`bridge_highway_name`, ' +
//     '`bridge_highway_direction`, ' +
//     '`road_ramp`, ' +
//     '`bridge_highway_segment`, ' +
//     '`latitude`, ' +
//     '`longitude`, ' +
//     '`location` ' +
//   'WHERE ' +
//     '(`created_date` > "2020-01-01T00:00:00"::floating_timestamp) ' +
//     'AND caseless_eq(`agency`, "DOT") ' +
//   'ORDER BY ' +
//     '`created_date` DESC NULL LAST';

// async function fetchData(offset) {
//     const url = `${jsonApiUrl}&$limit=1000&$offset=${offset}`;
//     try {
//         const response = await fetch(url);
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         return await response.json();
//     } catch (error) {
//         console.error(`Error fetching data at offset ${offset}:`, error);
//         return [];
//     }
// }

// async function loadData() {
//     let offset = 0;
//     let allData = [];
//     let batchSize = 1000;
//     let keepFetching = true;

//     while (keepFetching) {
//         const requests = [];
        
//         // Fetch data in smaller batches of 2 requests at a time
//         for (let i = 0; i < 2; i++) {
//             requests.push(fetchData(offset + i * batchSize));
//         }

//         try {
//             const results = await Promise.all(requests);
//             const batchData = results.flat();

//             console.log(`Fetched ${batchData.length} records from offset ${offset}`);

//             if (batchData.length === 0) {
//                 console.log("No more data to fetch. Stopping.");
//                 keepFetching = false;
//             } else {
//                 allData.push(...batchData);
//                 offset += batchSize * 2; // Move to the next batch
//             }
//         } catch (error) {
//             console.error('Error during fetching:', error);
//             keepFetching = false;
//         }
//     }

//     console.log(`Total records fetched: ${allData.length}`);

//     // Clear previous data on the map
//     dataSource.clear();

//     // Add features to the map
//     allData.forEach(item => {
//         if (item.latitude && item.longitude) {
//             const feature = new ol.Feature({
//                 geometry: new ol.geom.Point(ol.proj.fromLonLat([
//                     parseFloat(item.longitude),
//                     parseFloat(item.latitude)
//                 ])),
//                 properties: item
//             });
//             dataSource.addFeature(feature);
//         }
//     });

//     console.log(`Loaded ${dataSource.getFeatures().length} points onto the map.`);
// }

// // Call the function to start fetching and displaying data
// loadData();












// //testing 1000-row limit
// function fetchDataAndDisplay(url, layer, styleFunction) {
//     const maxLimit = 1000; 
//     let offset = 0;
//     const features = [];

//     // Recursive function to fetch data in chunks
//     function fetchChunk() {
//         const paginatedUrl = `${url}&$limit=${maxLimit}&$offset=${offset}`;
//         console.log(`Fetching data from: ${paginatedUrl}`); // Debugging info

//         return fetch(paginatedUrl)
//             .then(response => response.json())
//             .then(data => {
//                 if (data.length === 0) {
//                     // Stop when no more data is returned
//                     console.log("All data fetched!");
//                     return Promise.resolve();
//                 }

//                 // Convert data to OpenLayers features
//                 data.forEach(item => {
//                     if (item.longitude && item.latitude) {
//                         const coordinates = ol.proj.fromLonLat([item.longitude, item.latitude]);
//                         const feature = new ol.Feature({
//                             geometry: new ol.geom.Point(coordinates),
//                             name: item.complaint_type,
//                             description: item.descriptor,
//                             status: item.status,
//                             createdDate: item.created_date,
//                             closedDate: item.closed_date,
//                             borough: item.borough
//                         });
//                         features.push(feature);
//                     }
//                 });

//                 offset += maxLimit; // Move to the next batch
//                 return fetchChunk(); // Fetch the next chunk
//             });
//     }

//     // Start fetching data
//     fetchChunk().then(() => {
//         console.log(`Fetched ${features.length} features in total.`);

//         // Add features to the layer
//         const source = new ol.source.Vector({
//             features: features
//         });
//         layer.setSource(source);

//         // Apply the styling function
//         layer.setStyle(styleFunction);
//     });
// }

// // Handle zoom changes to load detailed or clustered views dynamically
// map.getView().on('change:resolution', () => {
//     const zoom = map.getView().getZoom();
//     console.log(`Zoom level: ${zoom}`); // Debugging

//     if (zoom >= 12) {
//         // Switch to detailed layer
//         if (!hasLayer(detailedLayer)) {
//             map.addLayer(detailedLayer);
//             map.removeLayer(clusterLayer);

//             // Re-fetch data for the detailed layer
//             fetchDataAndDisplay(jsonApiUrl, detailedLayer, detailedStyleFunction);
//         }
//     } else {
//         // Switch to clustered layer
//         if (!hasLayer(clusterLayer)) {
//             map.addLayer(clusterLayer);
//             map.removeLayer(detailedLayer);

//             // Re-fetch data for the cluster layer
//             fetchDataAndDisplay(jsonApiUrl, clusterLayer, clusterStyleFunction);
//         }
//     }
// });

// // Helper function to check if a layer is already added
// function hasLayer(layer) {
//     return map.getLayers().getArray().includes(layer);
// }






 
// // tina
// let vectorSource;

// // Function to add points to the map
// function addPoints(data) {
//     const features = data.map((point) => {
//       return new ol.Feature({
//         geometry: new ol.geom.Point(ol.proj.fromLonLat([point.longitude, point.latitude])),
//         name: point.name
//       });
//     });
//     //const vectorSource = new ol.source.Vector({
//     vectorSource = new ol.source.Vector({ //tina
//       features: features
//     });
//     const vectorLayer = new ol.layer.Vector({
//       source: vectorSource
//     });
//     map.addLayer(vectorLayer);
//   }
 
 
 


// function fetchDataAndDisplay(url) {
//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             console.log('Fetched data:', data);
//             // Clear existing markers
//             vectorSource = vectorLayer.getSource();
//             console.log("vectorLayer.getSource()", vectorSource);
//             vectorSource.clear();
//             console.log("vectorLayer.getSource()", vectorSource);
//             let theseFeatures = []; // Initialize an array to store features
//             data.forEach((item) => {
//                 if (item.latitude && item.longitude) {
//                     const marker = new ol.Feature({
//                         geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.longitude), parseFloat(item.latitude)])),
//                         name: item.complaint_type,
//                         description: item.descriptor,
//                         status: item.status,
//                         createdDate: item.created_date,
//                         closedDate: item.closed_date,
//                         borough: item.borough,
//                     });
//                     //console.log("marker", marker); // Log the marker for debugging
//                     theseFeatures.push(marker); // Add the marker to the features array
//                 }
//             });
//             // Add all features to the vector source
//             vectorSource.addFeatures(theseFeatures);
//             // Update the data counter
//             document.getElementById('data-counter').textContent = data.length;
//         })
//         .catch(error => console.error('Error fetching data:', error));
// }
 





// // Initial vector source - keep this one!
// let vectorSource = new ol.source.Vector();












//1.6 just uncommented
// // cluster based on zoom levels
// const CLUSTER_ZOOM_THRESHOLD = 10; // Adjust based on your requirements





    




// // cluster style function should occur before cluster layer initialization 
// const clusterStyle = function (feature) {
//     const size = feature.get('features').length;
//     return new ol.style.Style({
//         image: new ol.style.Circle({
//             radius: size > 1 ? 15 : 5,
//             fill: new ol.style.Fill({ color: 'rgba(255, 153, 0, 0.6)' }),
//             stroke: new ol.style.Stroke({ color: '#ff9900', width: 1 })
//         }),
//         text: new ol.style.Text({
//             text: size > 1 ? size.toString() : '',
//             fill: new ol.style.Fill({ color: '#000' })
//         })
//     });
// };

// //this was just uncommented. 1.6
// // //updated above
// // const clusterLayer = new ol.layer.Vector({
// //     source: clusterSource,
// //     style: clusterStyle,
// // });

// // const detailedLayer = new ol.layer.Vector({
// //     source: detailedSource,
// // });


// // let isClusteringEnabled = false; // Default to false, assuming clustering is off by default

// //implementing max min resolution 1.6
// // Define the threshold zoom level for clustering (you can adjust this value based on your needs)
// const CLUSTER_ZOOM_THRESHOLD = 10; // Example: Clustered at zoom levels below 10

// // Set the resolutions for layers based on zoom level
// const clusterLayer = new ol.layer.Vector({
//     source: clusterSource,
//     style: clusterStyle,
//     maxResolution: 200, // Visible only at lower zoom levels (for example, below zoom level 10)
// });

// const detailedLayer = new ol.layer.Vector({
//     source: detailedSource,
//     style: detailedStyle,
//     minResolution: 200, // Visible only at higher zoom levels (for example, above zoom level 10)
// });

// // Add both layers to the map
// map.addLayer(clusterLayer);
// map.addLayer(detailedLayer);

// // Optional: Initialize the map view to the desired zoom level (if needed)
// map.getView().setZoom(10); // Adjust initial zoom level as needed








// // this is a snippet of major change! uncomment it and see what happens
// // map.addLayer(clusterLayer);
// // map.addLayer(detailedLayer);
// // detailedLayer.setVisible(false); // Start with clusters

// // updated what's above
// if (isClusteringEnabled) {
//     map.addLayer(clusterLayer); // Add the clustering layer
// } else {
//     map.addLayer(detailedLayer); // Add the detailed (non-clustered) layer
// }







// // define detailed and clustered json api with zoom query
// // I removed the &zoom=low and &zoom=high! :( api does not support it
// const jsonApiUrlClusteredWithZoom = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT unique_key, created_date, closed_date, agency, agency_name, complaint_type, descriptor, location_type, incident_zip, incident_address, street_name, cross_street_1, cross_street_2, intersection_street_1, intersection_street_2, address_type, city, landmark, facility_type, status, due_date, resolution_description, resolution_action_updated_date, community_board, bbl, borough, x_coordinate_state_plane, y_coordinate_state_plane, open_data_channel_type, park_facility_name, park_borough, vehicle_type, taxi_company_borough, taxi_pick_up_location, bridge_highway_name, bridge_highway_direction, road_ramp, bridge_highway_segment, latitude, longitude, location WHERE caseless_contains(agency, 'dot') AND (created_date BETWEEN '2019-01-01T00:00:00'::floating_timestamp AND '2024-09-21T16:10:08'::floating_timestamp) ORDER BY created_date DESC NULL FIRST";
// const jsonApiUrlDetailedWithZoom = "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT unique_key, created_date, closed_date, agency, agency_name, complaint_type, descriptor, location_type, incident_zip, incident_address, street_name, cross_street_1, cross_street_2, intersection_street_1, intersection_street_2, address_type, city, landmark, facility_type, status, due_date, resolution_description, resolution_action_updated_date, community_board, bbl, borough, x_coordinate_state_plane, y_coordinate_state_plane, open_data_channel_type, park_facility_name, park_borough, vehicle_type, taxi_company_borough, taxi_pick_up_location, bridge_highway_name, bridge_highway_direction, road_ramp, bridge_highway_segment, latitude, longitude, location WHERE caseless_contains(agency, 'dot') AND (created_date BETWEEN '2019-01-01T00:00:00'::floating_timestamp AND '2024-09-21T16:10:08'::floating_timestamp) ORDER BY created_date DESC NULL FIRST";




// // function loadPointsBasedOnZoom() {
// //     const zoomLevel = map.getView().getZoom();

// //     if (zoomLevel < CLUSTER_ZOOM_THRESHOLD) {
// //         detailedLayer.setVisible(false);
// //         clusterLayer.setVisible(true);

// //         // Fetch clustered data if not already cached
// //         if (!cachedClusteredData) {
// //             fetchDataAndDisplayClustered();
// //             cachedClusteredData = true; // Mark clustered data as loaded
// //         }
// //     } else {
// //         clusterLayer.setVisible(false);
// //         detailedLayer.setVisible(true);

// //         // Fetch detailed data if not already cached
// //         if (!cachedDetailedData) {
// //             fetchDataAndDisplay();
// //             cachedDetailedData = true; // Mark detailed data as loaded
// //         }
// //     }
// // }








// // map.on('moveend', function () {
// //     loadPointsBasedOnZoom();
// // });
// //updated above
// // map.on('moveend', function () {
// //     const zoomLevel = map.getView().getZoom();
// //     clusterSource.setDistance(zoomLevel < CLUSTER_ZOOM_THRESHOLD ? 40 : 20); // Dynamic distance
// //     loadPointsBasedOnZoom();
// // });



// // // Initial load
// // loadPointsBasedOnZoom();










// // // Function to add points to the map from JSON data
// // function addPoints(data) {
// //     const features = data.map((point) => {
// //         if (point.latitude && point.longitude) {
// //             return new ol.Feature({
// //                 geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(point.longitude), parseFloat(point.latitude)])),
// //                 name: point.complaint_type,
// //                 description: point.descriptor,
// //                 status: point.status,
// //                 createdDate: point.created_date,
// //                 closedDate: point.closed_date,
// //                 borough: point.borough,
// //             });
// //         }
// //     }).filter(feature => feature !== undefined); 

// //     vectorSource.addFeatures(features); 
// // }






// function addPoints(data, source) {
//     const features = data
//         .map(item => {
//             if (item.latitude && item.longitude) {
//                 return new ol.Feature({
//                     geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.longitude), parseFloat(item.latitude)])),
//                     name: item.complaint_type || 'Unknown',
//                     description: item.descriptor || 'No description provided',
//                     status: item.status || 'Unknown',
//                     createdDate: item.created_date || 'N/A',
//                     closedDate: item.closed_date || 'N/A',
//                     borough: item.borough || 'Unknown',
//                     ...item, // Include additional properties for flexibility
//                 });
//             }
//             return null; // Skip invalid data
//         })
//         .filter(feature => feature !== null); // Remove null features

//     source.addFeatures(features); // Add all valid features to the source
// }


// // function addPoints(data, source) {
// //     const features = data.map(item => {
// //         const feature = new ol.Feature({
// //             geometry: new ol.geom.Point(ol.proj.fromLonLat([item.longitude, item.latitude])),
// //             ...item // Add other properties as needed
// //         });
// //         return feature;
// //     });
// //     source.addFeatures(features);
// // }





// //cluster stuff here
// // Cluster source that aggregates points from vectorSource based on zoom level
// let clusterSource = new ol.source.Cluster({
//     distance: 40, // distance between cluster pixels
//     source: vectorSource
// });




// let clusterLayer = new ol.layer.Vector({
//     source: clusterSource,
//     style: (feature) => {
//         const size = feature.get('features').length;
//         return new ol.style.Style({
//             image: new ol.style.Circle({
//                 radius: size > 1 ? 15 : 5,
//                 fill: new ol.style.Fill({ color: 'rgba(255, 153, 0, 0.6)' }),
//                 stroke: new ol.style.Stroke({ color: '#ff9900', width: 1 })
//             }),
//             text: new ol.style.Text({
//                 text: size > 1 ? size.toString() : '',
//                 fill: new ol.style.Fill({ color: '#000' })
//             })
//         });
//     }
// });

// // Add cluster layer to map; only display at certain zoom levels
// map.getView().on('change:resolution', () => {
//     const zoomLevel = map.getView().getZoom();
//     vectorLayer.setVisible(zoomLevel >= 12); // Show non-clustered points at higher zoom levels
//     clusterLayer.setVisible(zoomLevel < 12); // Show clusters at lower zoom levels
// });

// // Add cluster layer to map (initially hidden until below zoom threshold)
// map.addLayer(clusterLayer);
// clusterLayer.setVisible(false);




  




//DRAWING
// Adding a source and layer for drawing
const drawSource = new ol.source.Vector();

// Add a new layer for the drawing features
const drawLayer = new ol.layer.Vector({
  source: drawSource,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)', 
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33', // Yellow border
      width: 2,
    }),
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({ color: '#ffcc33' }),
    }),
  }),
});

// Add draw layer to the map
map.addLayer(drawLayer);

// Function to add drawing interaction
function addDrawingInteraction(geometryType) {
  // Remove any existing drawing interactions
  map.getInteractions().forEach((interaction) => {
    if (interaction instanceof ol.interaction.Draw) {
      map.removeInteraction(interaction);
    }
  });

  const draw = new ol.interaction.Draw({
    source: drawSource, 
    type: geometryType === 'Circle' ? 'Circle' : 'Polygon', 
  });

  draw.on('drawend', (event) => {
    const drawnFeature = event.feature;
    let dataPoints = [];

    if (geometryType === 'Polygon') {
      const extent = drawnFeature.getGeometry().getExtent();
      dataPoints = detailedSource.getFeaturesInExtent(extent).filter(feature =>
        drawnFeature.getGeometry().intersectsCoordinate(feature.getGeometry().getCoordinates())
      );
    } else if (geometryType === 'Circle') {
      const circleGeometry = drawnFeature.getGeometry();
      dataPoints = detailedSource.getFeatures().filter(feature =>
        circleGeometry.intersectsCoordinate(feature.getGeometry().getCoordinates())
      );
    }

    // Highlight matched points
    dataPoints.forEach((feature) => {
      feature.setStyle(
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({ color: 'red' }), // Highlight in red
          }),
        })
      );
    });

    console.log(`Highlighted ${dataPoints.length} points within the drawn ${geometryType}.`);
  });

  map.addInteraction(draw);
}
//this is important. i commented out just to test something. put it back later. 3.10
// // Initial drawing setup (default to Polygon)
// addDrawingInteraction('Polygon');

// // Handle geometry type selection dynamically
// document.getElementById('typeSelect').addEventListener('change', function () {
//   addDrawingInteraction(this.value);
// });

  
  











// // This right here. Functionality depends on location. 
// let draw, snap; // Draw and snap are global to easily manage interactions

// function addInteractions(type) {
    
//     if (draw) {
//         map.removeInteraction(draw);
//     }

//     // Initialize the new draw interaction
//     draw = new ol.interaction.Draw({
//         source: vectorSource,
//         type: type,
//     });
//     map.addInteraction(draw);

//     // Add snapping for more accurate placement
//     snap = new ol.interaction.Snap({source: vectorSource});
//     map.addInteraction(snap);
// }



$(document).ready(function() {
    $("#range-slider").ionRangeSlider({
        type: "double",
        min: 2019,
        max: 2024,
        from: 2019,
        to: 2024,
        grid: true,
        onChange: function(data) { 
            updateMap(data.from, data.to);  
        }
    });
});

function updateMap(startYear, endYear) {
    console.log("Filtering map data between " + startYear + " and " + endYear);
    refreshMapLayers(startYear, endYear);  // updates map markers
}









// display info in the information tab
function displayInfoInTab(feature) {
    const infoTab = document.getElementById('Information');
    if (infoTab) {
        const content = `
            <p><strong>Type:</strong> ${feature.get('name')}</p>
            <p><strong>Description:</strong> ${feature.get('description')}</p>
            <p><strong>Status:</strong> ${feature.get('status')}</p>
            <p><strong>Created Date:</strong> ${feature.get('createdDate')}</p>
            <p><strong>Closed Date:</strong> ${feature.get('closedDate') || 'N/A'}</p>
            <p><strong>Borough:</strong> ${feature.get('borough')}</p>
        `;
        infoTab.innerHTML = content;
    } else {
        console.error('Information tab element not found.');
    }
}

// // display feature information with map click
// map.on('click', function (event) {
//     let featureFound = false;
//     map.forEachFeatureAtPixel(event.pixel, function (feature) {
//         featureFound = true;
//         displayInfoInTab(feature);
//         resetFeatureStyles();
//         feature.setStyle(highlightStyle);
//     });

//     if (!featureFound) {
//         const infoTab = document.getElementById('Information');
//         infoTab.innerHTML = '<p>Select a feature on the map to see its details here.</p>';
//     }
// });















            //colors test
            $(document).ready(function() {
                // initialize Select2 for complaint 
                $('#color-select').select2({
                    placeholder: "Select Complaint",
                    allowClear: true,
                    width: '200'
                });
            
                // initialize Select2 for shape selection
                $('#shape-select').select2({
                    placeholder: "Select Description",
                    allowClear: true,
                    width: '200'
                });
            
                // handle color selection event
                $('#color-select').on('change', function() {
                    var selectedColor = $(this).val();
                    var shapeOptions = [];
            
                    // dependents
                    if (selectedColor.includes('Bus Stop Shelter')) {
                        shapeOptions.push({id: 'Broken Glass', text: 'Broken Glass'});
                        shapeOptions.push({id: 'Damaged Bench', text: 'Damaged Bench'});
                        shapeOptions.push({id: 'Lighting', text: 'Lighting'});
                    }
                    if (selectedColor.includes('Curb Condition')) {
                        shapeOptions.push({id: 'Broken Curb', text: 'Broken Curb'});
                        shapeOptions.push({id: 'Curb Defect-Metal Protruding', text: 'Curb Defect-Metal Protruding'});
                        shapeOptions.push({id: 'Defacement', text: 'Defacement'});
                    }
            
                    if (selectedColor.includes('Outdoor Dining')) {
                        shapeOptions.push({id: 'Barrier Condition', text: 'Barrier Condition'});
                        shapeOptions.push({id: 'Sidewalk Zone Blocked', text: 'Sidewalk Zone Blocked'});
                        shapeOptions.push({id: 'Site Setup Condition', text: 'Site Setup Condition'});
                        shapeOptions.push({id: 'Street Zone Blocked', text: 'Street Zone Blocked'});
                        shapeOptions.push({id: 'Unauthorized Restaurant', text: 'Unauthorized Restaurant'});
                    }

                    if (selectedColor.includes('E-Scooter')) {
                        shapeOptions.push({id: 'Damaged or Vandalized', text: 'Damaged or Vandalized'});
                        shapeOptions.push({id: 'Improperly Parked or Abandoned', text: 'Improperly Parked or Abandoned'});
                        shapeOptions.push({id: 'Parking Corral Not Maintained', text: 'Parking Corral Not Maintained'});
                    }

                    if (selectedColor.includes('Highway Condition')) {
                        shapeOptions.push({id: 'Cave-in', text: 'Cave-in'});
                        shapeOptions.push({id: 'Crash Cushion Defect', text: 'Crash Cushion Defect'});
                        shapeOptions.push({id: 'Dead Animal', text: 'Dead Animal'});
                        shapeOptions.push({id: 'Graffiti - Highway', text: 'Graffiti - Highway'});
                        shapeOptions.push({id: 'High Grass', text: 'High Grass'});
                        shapeOptions.push({id: 'Highway Fence', text: 'Highway Fence'});
                        shapeOptions.push({id: 'Painted Line/Marking', text: 'Painted Line/Marking'});
                        shapeOptions.push({id: 'Pothole - Highway', text: 'Pothole - Highway'});
                        shapeOptions.push({id: 'Sign Blocked by Tree', text: 'Sign Blocked by Tree'});
                        shapeOptions.push({id: 'Unsafe Worksite', text: 'Unsafe Worksite'});
                    }

                    if (selectedColor.includes('Street Condition')) {
                        shapeOptions.push({id: 'Blocked - Construction', text: 'Blocked - Construction'});
                        shapeOptions.push({id: 'Cave-in', text: 'Cave-in'});
                        shapeOptions.push({id: 'Crash Cushion Defect', text: 'Crash Cushion Defect'});
                        shapeOptions.push({id: 'Defective Hardware', text: 'Defective Hardware'});
                        shapeOptions.push({id: 'Dumpster - Construction Waste', text: 'Dumpster - Construction Waste'});
                        shapeOptions.push({id: 'Failed Street Repair', text: 'Failed Street Repair'});
                        shapeOptions.push({id: 'Line/Marking - After Repaving', text:'Line/Marking - After Repaving'});
                        shapeOptions.push({id: 'Plate Condition - Noisy', text: 'Plate Condition - Noisy'});
                        shapeOptions.push({id: 'Plate Condition - Shifted', text: 'Plate Condition - Shifted'});
                        shapeOptions.push({id: 'Pothole', text: 'Pothole'});
                        shapeOptions.push({id: 'Rough, Pitted or Cracked Roads', text: 'Rough, Pitted or Cracked Roads'});
                    }

                    // if no colors are selected, then hide shape filter
                    if (selectedColor.length === 0) {
                        $('#shape-select').val(null).trigger('change'); // clear selection
                        $('#shape-select').hide();
                    } else {
                        // populate the complaint dropdown with new options
                        $('#shape-select').empty(); // clear previous options
                        $.each(shapeOptions, function(index, option) {
                            $('#shape-select').append(new Option(option.text, option.id));
                        });
                        $('#shape-select').show();
                    }
                });
            });




         
         
         
         
         
//switch "active" tabs
function openCity(evt, cityName) {
//declare all variables
var i, tabcontent, tablinks;
              
 //get all elements with class="tabcontent" and hide them
tabcontent = document.getElementsByClassName("tabcontent");
for (i = 0; i < tabcontent.length; i++) {
 tabcontent[i].style.display = "none";
 }
              
 //get all elements with class="custom-button" and remove the class "active"
 tablinks = document.getElementsByClassName("custom-button");
for (i = 0; i < tablinks.length; i++) {
  tablinks[i].classList.remove("active");
}
              
//show the current tab, and add an "active" class to the button that opened the tab
 document.getElementById(cityName).style.display = "block";
evt.currentTarget.classList.add("active");
}
              
//set default open tab
document.getElementById("defaultOpen").click();
              
    





//borough filter
$(document).ready(function () {
    //initialize Select2 for the borough filter
    $('#borough').select2({
        placeholder: "Select Borough(s)",
        allowClear: true,
        width: '100%' 
    });

    $('#borough').on('change', function () {
        const selectedBoroughs = $(this).val();
        filterMarkersByBorough(selectedBoroughs);
    });
});




function filterMarkersByBorough(selectedBoroughs) {
    document.getElementById("spinner").style.display = "block";

    setTimeout(() => {
        let allFeatures = sourceVector.getFeatures(); 


        let filteredFeatures = allFeatures.filter(feature => {
            let borough = feature.get('borough');
            console.log("Feature Borough:", borough); 
            return borough && selectedBoroughs.includes(borough);
        });

        console.log("Filtered Features:", filteredFeatures.length); 

        //update the source to show only filtered features
        sourceVector.clear();
        sourceVector.addFeatures(filteredFeatures);

        document.getElementById("spinner").style.display = "none";
    }, 500);
}




    let sourceVector = new ol.source.Vector(); 


        // Hide Spinner
        document.getElementById("spinner").style.display = "none";
    500; //delayed to simulate processing




function updateDataCounter(count) {
    document.getElementById('data-counter').textContent = count;
}









// Accordion functionality and category handling
document.addEventListener('DOMContentLoaded', function () {
    const categories = document.querySelectorAll('.division-checkbox');

    categories.forEach(category => {
        category.addEventListener('change', function () {
            const subcategories = this.closest('.division-container').querySelector('.subcategories');
            if (subcategories) {
                subcategories.style.display = this.checked ? 'block' : 'none';
            }
        });
    });

    document.querySelectorAll('.accordion').forEach(accordion => {
        accordion.addEventListener('click', function () {
            this.classList.toggle('expanded');
            const panel = this.nextElementSibling;
            panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
        });
    });
});

// Modal functionality
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("infoModal");
    const infoIcon = document.querySelector(".info-icon");
    const span = document.getElementsByClassName("close")[0];

    infoIcon.onclick = function () {
        modal.style.display = "block";
    };

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Open the modal as soon as the site opens
    window.onload = function () {
        modal.style.display = "block";
    };
});

// toggle sidebar
$("#toggleBtn").click(function () {
    $("#sidebar").toggleClass("closed");
    $("#map").toggleClass("sidebar-closed");
    $("#toggleBtn").toggleClass("closed");
});

// subcategory menu functionality
const subcategories1 = {
    8: ['Cave-in', 'Defective Hardware', 'Failed Street Repair', 'Plate Condition - Noisy', 'Pothole', 'Rough, Pitted or Cracked Roads'],
    11: ['Cans', 'Bottles', 'Cartons', 'Glass'],
    9: ['Bus Stop', 'No Parking, Standing, Stopping', 'St Name - Attached to Pole', 'Other/Unknown'],
    10: ['Sidewalk Zone Blocked', 'Site Setup Condition', 'Street Zone Blocked', 'Unauthorized Restaurant'],
    1: ['Carrots', 'Broccoli', 'Spinach']
};

function updateSubCategory(categorySelect, subCategoryName) {
    const selectedCategory = categorySelect.value;
    const subCategorySelect = document.getElementsByName(subCategoryName)[0];

    // clear existing options
    subCategorySelect.innerHTML = '';

    // populate new options
    subcategories1[selectedCategory].forEach(subCat => {
        const option = document.createElement('option');
        option.textContent = subCat;
        subCategorySelect.appendChild(option);
    });
}







function updateSubCategory(checkbox, subCategoryId) {
    var subCategoryContainer = document.getElementById(subCategoryId);

    // Show or hide the subcategory based on whether the checkbox is checked
    if (checkbox.checked) {
        subCategoryContainer.style.display = 'block';
    } else {
        subCategoryContainer.style.display = 'none';
    }
}





//filter count
//filter map data and update the counter
function updateDataPointCounter(filteredData) {
    const dataPointCount = filteredData.length;
  
    // Find the HTML element by its ID and update its content
    const counterElement = document.getElementById('dataPointCounter');
    counterElement.textContent = dataPointCount.toLocaleString(); // Formats number with commas
  }
  


//this is the current range slider 2.23
//   $(document).ready(function() {
//     //initialize range slider
//     $("#range-slider").ionRangeSlider({
//         type: "double",
//         min: 2019, 
//         max: 2024, 
//         from: 2019, 
//         to: 2024, 
//         grid: true, 
//         onFinish: function(data) {
//             updateMapWithRange(data.from, data.to); 
//         }
//     });

//     //update the map with selected range
//     function updateMapWithRange(fromYear, toYear) { 
//         // API query URL with the selected date range
//         const queryUrl = `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%20unique_key,created_date,closed_date,agency,agency_name,complaint_type,descriptor,location_type,incident_zip,incident_address,street_name,cross_street_1,cross_street_2,intersection_street_1,intersection_street_2,address_type,city,landmark,facility_type,status,due_date,resolution_description,resolution_action_updated_date,community_board,bbl,borough,x_coordinate_state_plane,y_coordinate_state_plane,open_data_channel_type,park_facility_name,park_borough,vehicle_type,taxi_company_borough,taxi_pick_up_location,bridge_highway_name,bridge_highway_direction,road_ramp,bridge_highway_segment,latitude,longitude,location,:@computed_region_efsh_h5xi,:@computed_region_f5dn_yrer,:@computed_region_yeji_bk3q,:@computed_region_92fq_4b7q,:@computed_region_sbqj_enih,:@computed_region_7mpf_4k6g%20WHERE%20(created_date%20BETWEEN%20%22${fromYear}-01-01T00:00:00%22::floating_timestamp%20AND%20%22${toYear}-12-31T23:59:59%22::floating_timestamp)%20AND%20caseless_eq(agency,%22DOT%22)%20ORDER%20BY%20created_date%20DESC%20NULL%20FIRST`;

//         // fetchDataAndDisplay(queryUrl);
//     }})







    document.getElementById('reset-filters').addEventListener('click', function() {
        // Reset the multi-selects
        document.getElementById('borough').value = "";
        document.getElementById('color-select').value = "";
        
        // Reset the date inputs
        document.getElementById('createdDate').value = "";
        document.getElementById('closedDate').value = "";
    
        // Reset the status dropdown
        document.getElementById('status').value = "";
    
        // Reset the range slider
        document.getElementById('range-slider').value = "";})







//         // Cluster source for clustered display
// const clusterSource = new ol.source.Cluster({
//     distance: 40, // Distance in pixels for clustering
//     source: vectorSource
// });
        
// // Layer for displaying clusters
// const clusterLayer = new ol.layer.Vector({
//     source: clusterSource,
//     style: clusterStyle // custom style for clustered features
// });
        
   

//         const clusterStyle = function(feature) {
//             const size = feature.get('features').length;
//             return new ol.style.Style({
//                 image: new ol.style.Circle({
//                     radius: size > 1 ? 15 : 5,
//                     fill: new ol.style.Fill({ color: 'rgba(255, 153, 0, 0.6)' }),
//                     stroke: new ol.style.Stroke({ color: '#ff9900', width: 1 })
//                 }),
//                 text: new ol.style.Text({
//                     text: size > 1 ? size.toString() : '',
//                     fill: new ol.style.Fill({ color: '#000' })
//                 })
//             });
//         };
        




//  // Log the extent and zoom level for debugging
//     console.log('Current extent:', extent);
//     console.log('Current zoom level:', zoomLevel);
    






// map.on('moveend', function() {
//     console.log('Map moved or zoomed. Loading points...');
//     loadPointsBasedOnZoomAndExtent(); // Load points dynamically as the map moves
// });







// map.on('moveend', function () {
//     loadPointsBasedOnZoom();

//     // Ensure Select2 is reinitialized AFTER data and DOM changes
//     setTimeout(() => {
//         $('#color-select').select2();
//         $('#shape-select').select2();
//         $('#borough').select2();
//     }, 0);
// });

// $('#borough').select2('destroy'); // Destroy the old instance
// $('#borough').select2(); // Reinitialize


// // Initial load
// loadPointsBasedOnZoom();