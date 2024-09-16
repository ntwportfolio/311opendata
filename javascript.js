// API endpoint json
const apiUrl = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%0A%20%20%60unique_key%60%2C%0A%20%20%60created_date%60%2C%0A%20%20%60closed_date%60%2C%0A%20%20%60agency%60%2C%0A%20%20%60agency_name%60%2C%0A%20%20%60complaint_type%60%2C%0A%20%20%60descriptor%60%2C%0A%20%20%60location_type%60%2C%0A%20%20%60incident_zip%60%2C%0A%20%20%60incident_address%60%2C%0A%20%20%60street_name%60%2C%0A%20%20%60cross_street_1%60%2C%0A%20%20%60cross_street_2%60%2C%0A%20%20%60intersection_street_1%60%2C%0A%20%20%60intersection_street_2%60%2C%0A%20%20%60address_type%60%2C%0A%20%20%60city%60%2C%0A%20%20%60landmark%60%2C%0A%20%20%60facility_type%60%2C%0A%20%20%60status%60%2C%0A%20%20%60due_date%60%2C%0A%20%20%60resolution_description%60%2C%0A%20%20%60resolution_action_updated_date%60%2C%0A%20%20%60community_board%60%2C%0A%20%20%60bbl%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60x_coordinate_state_plane%60%2C%0A%20%20%60y_coordinate_state_plane%60%2C%0A%20%20%60open_data_channel_type%60%2C%0A%20%20%60park_facility_name%60%2C%0A%20%20%60park_borough%60%2C%0A%20%20%60vehicle_type%60%2C%0A%20%20%60taxi_company_borough%60%2C%0A%20%20%60taxi_pick_up_location%60%2C%0A%20%20%60bridge_highway_name%60%2C%0A%20%20%60bridge_highway_direction%60%2C%0A%20%20%60road_ramp%60%2C%0A%20%20%60bridge_highway_segment%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60location%60%2C%0A%20%20%60%3A%40computed_region_efsh_h5xi%60%2C%0A%20%20%60%3A%40computed_region_f5dn_yrer%60%2C%0A%20%20%60%3A%40computed_region_yeji_bk3q%60%2C%0A%20%20%60%3A%40computed_region_92fq_4b7q%60%2C%0A%20%20%60%3A%40computed_region_sbqj_enih%60%2C%0A%20%20%60%3A%40computed_region_7mpf_4k6g%60%0AWHERE%0A%20%20(%60created_date%60%0A%20%20%20%20%20BETWEEN%20%222019-01-01T00%3A00%3A00%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20%20AND%20%222024-12-31T23%3A45%3A00%22%20%3A%3A%20floating_timestamp)%0A%20%20AND%20caseless_eq(%60agency%60%2C%20%22DOT%22)%0AORDER%20BY%20%60created_date%60%20DESC%20NULL%20FIRST';

// HTTP GET request to API endpoint
fetch(apiUrl)
  .then(response => {
    // Check if the response is successful (status code 200)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse JSON response
    return response.json();
  })
  .then(data => {
    // Process fetched data
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occur during the fetch operation
    console.error('Error fetching data:', error);
  });
alert('good morning test')

const apiUrlCouncil = "https://data.cityofnewyork.us/resource/uvw5-9znb.json";

const apiUrlAssembly = "https://services6.arcgis.com/EbVsqZ18sv1kVJ3k/arcgis/rest/services/NYS_Assembly_Districts/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson";

// const apiUrlSenate = "https://legislation.nysenate.gov/api/3/members/search?term=status:active&key=h7XFZYS7OwhCbSMeJoHtNpWTHZ6y3mQc"
const apiUrlSenate = (year) => `https://legislation.nysenate.gov/api/3/members/${year}/senate?full=true&limit=100&key=h7XFZYS7OwhCbSMeJoHtNpWTHZ6y3mQc`
// const apiUrlSenate = "https://legislation.nysenate.gov/api/3/members/2024/house?key=h7XFZYS7OwhCbSMeJoHtNpWTHZ6y3mQc"

const apiUrlCongress = "https://api.congress.gov/v3/member?api_key=YskirA9JaaO48rLhdV5iaGbqfwGO88raaiCFOfzL"
