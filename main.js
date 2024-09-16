// OpenLayers map initialization
const map = new ol.Map({
    target: 'map',
    view: new ol.View({
        center: ol.proj.fromLonLat([-73.8896, 40.7607]),
        zoom: 12
    })
});

// fetch data with the API endpoint
fetchDataAndDisplay('https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%0A%20%20%60unique_key%60%2C%0A%20%20%60created_date%60%2C%0A%20%20%60closed_date%60%2C%0A%20%20%60agency%60%2C%0A%20%20%60agency_name%60%2C%0A%20%20%60complaint_type%60%2C%0A%20%20%60descriptor%60%2C%0A%20%20%60location_type%60%2C%0A%20%20%60incident_zip%60%2C%0A%20%20%60incident_address%60%2C%0A%20%20%60street_name%60%2C%0A%20%20%60cross_street_1%60%2C%0A%20%20%60cross_street_2%60%2C%0A%20%20%60intersection_street_1%60%2C%0A%20%20%60intersection_street_2%60%2C%0A%20%20%60address_type%60%2C%0A%20%20%60city%60%2C%0A%20%20%60landmark%60%2C%0A%20%20%60facility_type%60%2C%0A%20%20%60status%60%2C%0A%20%20%60due_date%60%2C%0A%20%20%60resolution_description%60%2C%0A%20%20%60resolution_action_updated_date%60%2C%0A%20%20%60community_board%60%2C%0A%20%20%60bbl%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60x_coordinate_state_plane%60%2C%0A%20%20%60y_coordinate_state_plane%60%2C%0A%20%20%60open_data_channel_type%60%2C%0A%20%20%60park_facility_name%60%2C%0A%20%20%60park_borough%60%2C%0A%20%20%60vehicle_type%60%2C%0A%20%20%60taxi_company_borough%60%2C%0A%20%20%60taxi_pick_up_location%60%2C%0A%20%20%60bridge_highway_name%60%2C%0A%20%20%60bridge_highway_direction%60%2C%0A%20%20%60road_ramp%60%2C%0A%20%20%60bridge_highway_segment%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60location%60%2C%0A%20%20%60%3A%40computed_region_efsh_h5xi%60%2C%0A%20%20%60%3A%40computed_region_f5dn_yrer%60%2C%0A%20%20%60%3A%40computed_region_yeji_bk3q%60%2C%0A%20%20%60%3A%40computed_region_92fq_4b7q%60%2C%0A%20%20%60%3A%40computed_region_sbqj_enih%60%2C%0A%20%20%60%3A%40computed_region_7mpf_4k6g%60%0AWHERE%0A%20%20(%60created_date%60%0A%20%20%20%20%20BETWEEN%20%222019-01-01T00%3A00%3A00%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20%20AND%20%222024-12-31T23%3A45%3A00%22%20%3A%3A%20floating_timestamp)%0A%20%20AND%20caseless_eq(%60agency%60%2C%20%22DOT%22)%0AORDER%20BY%20%60created_date%60%20DESC%20NULL%20FIRST');








// Fetch and display data points based on the selected year range
function fetchDataAndDisplay(url) {
    $.getJSON(url, function(data) {
        // Clear existing markers (if any)
        clearMapMarkers();

        // Loop through the data and create markers for each point
        data.forEach(function(item) {
            var lat = item.latitude;
            var lng = item.longitude;
            var marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
            });

            // Add markers to the map
            addMarkerToMap(marker);
        });
    });
}

// Function to refresh map layers based on the selected year range
function refreshMapLayers(startYear, endYear) {
    // filter by the selected year range with this query
    var url = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%20unique_key,latitude,longitude,created_date,closed_date,status,complaint_type,descriptor,borough%20WHERE%20caseless_eq(agency,%22DOT%22)%20AND%20year(created_date)%20BETWEEN%20' + startYear + '%20AND%20' + endYear;
    
    fetchDataAndDisplay(url);
}

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
    refreshMapLayers(startYear, endYear);  // Update map markers
}

// Helper functions to clear and add markers
function clearMapMarkers() {
    // Implementation to clear existing markers from the map
}

function addMarkerToMap(marker) {
    // Implementation to add a marker to the map
}










// Function to add points to the map
function addPoints(data) {
    const features = data.map((point) => {
      return new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([point.longitude, point.latitude])),
        name: point.name
      });
    });
  
    const vectorSource = new ol.source.Vector({
      features: features
    });
  
    const vectorLayer = new ol.layer.Vector({
      source: vectorSource
    });
  
    map.addLayer(vectorLayer);
  }
  
  // Fetch data and add points
  fetch('https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%0A%20%20%60unique_key%60%2C%0A%20%20%60created_date%60%2C%0A%20%20%60closed_date%60%2C%0A%20%20%60agency%60%2C%0A%20%20%60agency_name%60%2C%0A%20%20%60complaint_type%60%2C%0A%20%20%60descriptor%60%2C%0A%20%20%60location_type%60%2C%0A%20%20%60incident_zip%60%2C%0A%20%20%60incident_address%60%2C%0A%20%20%60street_name%60%2C%0A%20%20%60cross_street_1%60%2C%0A%20%20%60cross_street_2%60%2C%0A%20%20%60intersection_street_1%60%2C%0A%20%20%60intersection_street_2%60%2C%0A%20%20%60address_type%60%2C%0A%20%20%60city%60%2C%0A%20%20%60landmark%60%2C%0A%20%20%60facility_type%60%2C%0A%20%20%60status%60%2C%0A%20%20%60due_date%60%2C%0A%20%20%60resolution_description%60%2C%0A%20%20%60resolution_action_updated_date%60%2C%0A%20%20%60community_board%60%2C%0A%20%20%60bbl%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60x_coordinate_state_plane%60%2C%0A%20%20%60y_coordinate_state_plane%60%2C%0A%20%20%60open_data_channel_type%60%2C%0A%20%20%60park_facility_name%60%2C%0A%20%20%60park_borough%60%2C%0A%20%20%60vehicle_type%60%2C%0A%20%20%60taxi_company_borough%60%2C%0A%20%20%60taxi_pick_up_location%60%2C%0A%20%20%60bridge_highway_name%60%2C%0A%20%20%60bridge_highway_direction%60%2C%0A%20%20%60road_ramp%60%2C%0A%20%20%60bridge_highway_segment%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60location%60%2C%0A%20%20%60%3A%40computed_region_efsh_h5xi%60%2C%0A%20%20%60%3A%40computed_region_f5dn_yrer%60%2C%0A%20%20%60%3A%40computed_region_yeji_bk3q%60%2C%0A%20%20%60%3A%40computed_region_92fq_4b7q%60%2C%0A%20%20%60%3A%40computed_region_sbqj_enih%60%2C%0A%20%20%60%3A%40computed_region_7mpf_4k6g%60%0AWHERE%0A%20%20(%60created_date%60%0A%20%20%20%20%20BETWEEN%20%222019-01-01T00%3A00%3A00%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20%20AND%20%222024-12-31T23%3A45%3A00%22%20%3A%3A%20floating_timestamp)%0A%20%20AND%20caseless_eq(%60agency%60%2C%20%22DOT%22)%0AORDER%20BY%20%60created_date%60%20DESC%20NULL%20FIRST')
    .then(response => response.json())
    .then(data => {
      addPoints(data);
    })
    .catch(error => console.error('Error fetching data:', error));
  


// Base map options
const baseMaps = {
    'CartoDBPositron': {
        layer: new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
            })
        }),
        markerStyle: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({ color: 'rgba(200, 0, 100, 0.8)' }),
                stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.8)', width: 2 })
            })
        })
    },
    'Satellite': {
        layer: new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            })
        }),
        markerStyle: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({ color: 'rgba(200, 0, 100, 0.8)' }),
                stroke: new ol.style.Stroke({ color: 'rgba(255, 255, 255, 0.8)', width: 2 })
            })
        })
    }
};









// Default base map as CartoDB Positron (Grayscale Street Map)
let currentBaseMap = baseMaps['CartoDBPositron'];
map.addLayer(currentBaseMap.layer);


// Highlight style
const highlightStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({ color: 'rgba(255, 255, 0, 0.8)' }),
        stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 0, 1)', width: 2 })
    })
});

// Function to update marker style based on current base map
function updateMarkerStyle() {
    const vectorLayer = map.getLayers().getArray().find(layer => layer instanceof ol.layer.Vector);
    if (vectorLayer) {
        vectorLayer.getSource().getFeatures().forEach(feature => {
            feature.setStyle(currentBaseMap.markerStyle); // Apply current base map style
        });
    }
}

// Basemap switcher functionality
document.getElementById('basemapSwitcher').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
        const basemap = event.target.getAttribute('data-basemap');
        switchBasemap(basemap);
        updateMarkerStyle();
    }
});

// Function to change basemap
function switchBasemap(basemap) {
    console.log('Changing basemap to:', basemap);
    const newBaseMap = baseMaps[basemap];
    if (newBaseMap) {
        map.getLayers().getArray().forEach(layer => {
            if (layer instanceof ol.layer.Tile) {
                map.removeLayer(layer);
            }
        });
        map.addLayer(newBaseMap.layer);
        currentBaseMap = newBaseMap;
    }
}


const vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
});
map.addLayer(vectorLayer);







// Function to fetch data and display markers
function fetchDataAndDisplay(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);

            // Clear existing markers
            vectorLayer.getSource().clear();

            data.forEach((item) => {
                if (item.latitude && item.longitude) {
                    const marker = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.longitude), parseFloat(item.latitude)])),
                        name: item.complaint_type,
                        description: item.descriptor,
                        status: item.status,
                        createdDate: item.created_date,
                        closedDate: item.closed_date,
                        borough: item.borough,
                    });
            
                    // Add marker to the source
                    vectorSource.addFeature(marker);
                }
            });
            


            
            document.getElementById('data-counter').textContent = data.length;
        })
        .catch(error => console.error('Error fetching data:', error));
}






// display info in the information tab
function displayInfoInTab(feature) {
    const infoTab = document.getElementById('information-tab');
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

// display feature information with map click
map.on('click', function (event) {
    let featureFound = false;
    map.forEachFeatureAtPixel(event.pixel, function (feature) {
        featureFound = true;
        displayInfoInTab(feature);
        resetFeatureStyles();
        feature.setStyle(highlightStyle);
    });

    if (!featureFound) {
        const infoTab = document.getElementById('information-tab');
        infoTab.innerHTML = '<p>Select a feature on the map to see its details here.</p>';
    }
});

// Function to reset the styles of all features
function resetFeatureStyles() {
    vectorLayer.getSource().getFeatures().forEach(feature => {
        feature.setStyle(currentBaseMap.markerStyle);
    });
}












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
            
            
            
            
            

            // update map layers
            const mapLayers = map.getLayers();
            mapLayers.clear(); // Clears existing layers
            mapLayers.push(currentBaseMap.layer); // Adds the current base map again
            mapLayers.push(vectorLayer); // Add vector layer with markers

            // fit map view to the extent of the vector layer
            if (vectorLayer.getSource().getFeatures().length > 0) {
                map.getView().fit(vectorLayer.getSource().getExtent(), { padding: [50, 50, 50, 50] });
            }




         
         
         
         
         
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
              
              
              


 

 

 $(document).ready(function () {
    // Initialize Select2 for the borough filter
    $('#borough').select2({
        placeholder: "Select Borough(s)",
        allowClear: true,
        width: '200px'
    });

    // Handle borough selection changes
    $('#borough').on('change', function () {
        const selectedBoroughs = $(this).val();
        filterMarkersByBorough(selectedBoroughs);
    });
});

function filterMarkersByBorough(selectedBoroughs) {
    // clears the current markers
    vectorLayer.getSource().clear();

    // fetch new data filtered by borough
    let boroughQuery = '';
    if (selectedBoroughs && selectedBoroughs.length > 0) {
        
        boroughQuery = selectedBoroughs.map(borough => `caseless_eq(borough,%22${borough}%22)`).join(' OR ');
    }
    
    // fetch data with the borough filter applied
    fetchDataAndDisplay(`https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT unique_key,latitude,longitude,created_date,closed_date,status,complaint_type,descriptor,borough WHERE caseless_eq(agency,%22DOT%22)${boroughQuery ? ` AND (${boroughQuery})` : ''}`);
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
  



  $(document).ready(function() {
    //initialize range slider
    $("#range-slider").ionRangeSlider({
        type: "double",
        min: 2019, 
        max: 2024, 
        from: 2019, 
        to: 2024, 
        grid: true, 
        onFinish: function(data) {
            updateMapWithRange(data.from, data.to); 
        }
    });

    //update the map with selected range
    function updateMapWithRange(fromYear, toYear) { 
        // API query URL with the selected date range
        const queryUrl = `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%20unique_key,created_date,closed_date,agency,agency_name,complaint_type,descriptor,location_type,incident_zip,incident_address,street_name,cross_street_1,cross_street_2,intersection_street_1,intersection_street_2,address_type,city,landmark,facility_type,status,due_date,resolution_description,resolution_action_updated_date,community_board,bbl,borough,x_coordinate_state_plane,y_coordinate_state_plane,open_data_channel_type,park_facility_name,park_borough,vehicle_type,taxi_company_borough,taxi_pick_up_location,bridge_highway_name,bridge_highway_direction,road_ramp,bridge_highway_segment,latitude,longitude,location,:@computed_region_efsh_h5xi,:@computed_region_f5dn_yrer,:@computed_region_yeji_bk3q,:@computed_region_92fq_4b7q,:@computed_region_sbqj_enih,:@computed_region_7mpf_4k6g%20WHERE%20(created_date%20BETWEEN%20%22${fromYear}-01-01T00:00:00%22::floating_timestamp%20AND%20%22${toYear}-12-31T23:59:59%22::floating_timestamp)%20AND%20caseless_eq(agency,%22DOT%22)%20ORDER%20BY%20created_date%20DESC%20NULL%20FIRST`;

        fetchDataAndDisplay(queryUrl);
    }})

