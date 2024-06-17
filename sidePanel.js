/**
 * SidePanel Template
 * 
 *  To use this template add a script tag adding as a source the location of sidePanel.js
 *  in your directory <script src=""></script>
 *  Use the SidePanelFunc from your main.js inside of view.when() function 
 *  Not need of importing sidePanel.js from main.js
 * 
 */


function SidePanelFunc({ 
    view, 
    searchWidget, 
    Feature, 
    layers, 
    promiseUtils, 
    // sidePanelDefaultContent,
    slider,
    featureTable,
    groupLayer,
    sketchViewModel
  }) { 
    // const defaultContent = `<p style="font-style: italic; text-align: center;">Select an element in the map to see more details about it.</p>`
    const defaultContent = `<h1>Select an element in the map to see more details about it</h1>`
  
    const graphic =  {
      popupTemplate: {
          content: defaultContent
      }
    }
  
    view.popup = {
      autoOpenEnabled: false,
      visibleElements: {
          closeButton: false
      },
      dockEnabled: true,
      dockOptions: {
          buttonEnabled: false,
      },
    }
    // console.log('view', view)
  
    const tabs = [ "Layers", "Details"];
  
    ///// Tabs //////
    let tabsContainer = document.createElement("div") // Tab Container
    tabsContainer.id = "tabsContainer"
  
    // Tab 1
    let tab1 = document.createElement("button")
    tab1.id = "tab1Button"
    const tab1Label = document.createTextNode("Details")
    tab1Label.id = "tab1Label"
    const tab1Container = document.createElement("div")
    tab1Container.id = "tab1Container" //content container
  
    // Tab 2
    let tab2 = document.createElement("button")
    tab2.id = "tab2Button"
    tab2.className = "active"
    const tab2Label = document.createTextNode("Layers")
    tab2Label.id = "tab2Label"
    const tab2Container = document.createElement("div")
    tab2Container.id = "tab2Container"
  
    // Tab 3
    // let tab3 = document.createElement("button")
    // tab3.id = "tab3Button"
    // const tab3Label = document.createTextNode("Data")
    // tab3Label.id = "tab3Label"
    // const tab3Container = document.createElement("div")
    // tab3Container.id = "tab3Container"
  
    ///// Side Panel ////
    // create div for graphic
    let sidePanelDiv = document.createElement("div");
    sidePanelDiv.id = "sidePanel";
    sidePanelDiv.className = "esri-widget"
    sidePanelDiv.style.display = "flex"
  
    let sliderContainer = document.createElement("div"); // Sidepanel Container
    sliderContainer.id = "sliderContainer";
  
    // Slider
    let sliderDiv = document.createElement("div");
    sliderDiv.id = "sliderDiv";
    const sliderLabel = document.createTextNode("Select year range:")
    sliderLabel.id = "sliderLabel"
  
    // SearchBar
    let searchBarDiv = document.createElement("div");
    searchBarDiv.id = "searchBar";
  
  
    // append Sidepanel to main HTML container
    const mainContainer = document.getElementById("mainWindow")
    const firstChild = mainContainer.firstChild
    if(firstChild) {
      mainContainer.insertBefore(sidePanelDiv, firstChild)
    } else {
      mainContainer.appendChild(sidePanelDiv)
    }
  
    // append children to sidePanelDiv
    sidePanelDiv.appendChild(tabsContainer)
    sidePanelDiv.appendChild(tab1Container)
    // sidePanelDiv.appendChild(tab3Container)
    sidePanelDiv.appendChild(tab2Container)
    
    // tab2Container.appendChild(aboutContent())
    // tab3Container.appendChild(dataTabcontent())
    
    // append Details and detail containers children
    // tab1Container.innerHTML = sidePanelDefaultContent;
    tab1Container.appendChild(searchBarDiv)
    tab1Container.appendChild(sliderContainer)
    // document.getElementById("tab3Container").appendChild(defaultLabelDetails)
  
    // append slider children
    sliderContainer.appendChild(sliderLabel)
    sliderContainer.appendChild(sliderDiv)
  
    // append tabs children and grandchildren
    tabsContainer.appendChild(tab2)
    tab2.appendChild(tab2Label)
  
    tabsContainer.appendChild(tab1)
    tab1.appendChild(tab1Label)
  
    // tabsContainer.appendChild(tab3)
    // tab3.appendChild(tab3Label)
  
  
    // set container of widgets
    // Position should be set as "manually" when adding the widget to view 
    searchWidget.container = document.getElementById("searchBar")
    slider.container = sliderDiv
  
    // Provide graphic to a new instance of a Feature widget
    const feature = new Feature({
      container: tab1Container, 
      graphic: graphic,
      map: view.map, //????
      spatialReference: view.spatialReference //????
    });
  
     // Executes after selecting a search result
    searchWidget.on("select-result", function(event){
      let highlight;
      let objectId;
  
      const searchResult = event.result.target;
      
      // make visible searchResult's layer
      const currentLayer = view.map.findLayerById(searchResult.sourceLayer.id)
      currentLayer.visible = true;
      
      if(currentLayer) {
        handleTabUpdate(tab1.id)
      }
  
      const newObjectId = event.result.key;
      
      if (!newObjectId) {
        highlight?.remove();
        objectId = feature.graphic = graphic
      } else if (objectId !== newObjectId) {
        highlight?.remove();
        objectId = newObjectId;
        feature.graphic = searchResult;
        highlight = currentLayer.highlight(searchResult);
      }
  
    });
  
    const handleTabUpdate = (currentId) => {
      const tabs = {
        [tab1.id]: tab1Container.id,
        [tab2.id]: tab2Container.id,
        // [tab3.id]: tab3Container.id,
      }
  
      for (let tabButton in tabs) {
        const isCurrentTab = tabButton == currentId
        document.getElementById(tabButton).classList = isCurrentTab
          ? "active"
          : ""
        document.getElementById(tabs[tabButton]).style.display = isCurrentTab
          ? "flex"
          : "none"
      }
    }
  
    // // onClick
    // tab3.onclick = (event) => {
    //   handleTabUpdate(event.srcElement.id)
    // }
  
    tab1.onclick = (event) => {
      handleTabUpdate(event.srcElement.id)
    }
  
    tab2.onclick = (event) => {
      handleTabUpdate(event.srcElement.id)
    }
  
    //// Create LayerViews ////
    const layersObjIdField = {}; // dict for every layer's objectIdField
  
    layers.forEach((layer) => {
      layersObjIdField[`${layer.id}`] = layer.objectIdField
      
      view.whenLayerView(layer).then((layerView) => {
        let hoverHighlight;
        let hoverObjId;
        let highlight;
        let objectId;
  
        const debouncedUpdate = promiseUtils.debounce(async (event) => {
          searchWidget.clear(); // clear searchBar
          // Perform a hitTest on the View
          const hitTest = await view.hitTest(event);
          // Make sure graphic has a popupTemplate
          const results = hitTest.results.filter((result) => {
            return result.graphic.layer.popupTemplate;
          });
          
          const result = results[0];
  
          const newObjectId = result && result.graphic.attributes[layersObjIdField[result.layer.id]];
  
          document.getElementById("select-by-rectangle").classList.contains("active")
  
          if (!newObjectId) {
            highlight?.remove();
            objectId = feature.graphic = graphic;
            featureTable.highlightIds.removeAll();
            featureTable.clearSelectionFilter()
  
          } else if (objectId !== newObjectId) {
            highlight?.remove();
            featureTable.highlightIds.removeAll();
  
            if(featureTable.layer !== result.graphic.layer){
  
              const index = groupLayer.allLayers
                  .findIndex(item => item.id === result.graphic.layer.id)
    
              if(index != null && index !== -1) {
                featureTable.layer = result.graphic.layer
                document.getElementById("layerNamesSelection").value = index
              }
            }
  
            objectId = newObjectId;
            feature.graphic = result.graphic;
  
            highlight = layerView.highlight(result.graphic);
  
            document.getElementById("sidePanel").style.display = "flex"
            document.getElementById("sidepanel-collapse-btn").className = "esri-icon-left"
            document.getElementById("viewDiv").style.width = "80%"
            handleTabUpdate(tab1.id)
  
            
          }
        });
  
        let labelContent = '';
        let newlabelContent;
  
        // Custom popup
        const debouncedPointerMoveUpdate = promiseUtils.debounce(async (event) => {
          // Perform a hitTest on the View
          const hitTest = await view.hitTest(event);
          // Make sure graphic has a popupTemplate
          const results = hitTest.results.filter((result) => {
              return result.graphic.layer?.popupTemplate;
          });
  
           //label
           const labelInfoDiv = document.getElementById("label_info")
  
          const result = results[0];
          const newHoverObjectId = result && result.graphic.attributes[layersObjIdField[result.layer.id]];
          isActiveElem = objectId == hoverObjId
  
          if (!newHoverObjectId) {
            hoverHighlight?.remove();
            hoverHighlight = undefined
            labelInfoDiv.style.display = 'none'
            labelInfoDiv.textContent = ''
            document.body.style.cursor = "default"
            hoverObjId = null;
            // layerView.layer.labelsVisible = false;
          } else if (hoverObjId !== newHoverObjectId) {
            hoverHighlight?.remove();
            hoverObjId = newHoverObjectId;
            document.body.style.cursor = "pointer"
            labelContent = ''
            const labelExpression = result.layer.labelingInfo[0]
            let attObjId;
            let query = result.layer.createQuery();
            query.set({
                where: layersObjIdField[result.layer.id] + "=" + hoverObjId,
                returnGeometry: false
            });
  
            const isCapitalProject = groupLayer.allLayers.includes(result.layer) 
            const isNTA = result.layer.id == "nta2020Districts"
            const hasLabel = isCapitalProject || isNTA;
  
            hasLabel && result.layer.queryFeatures(query).then((featureSet) => {
              const attributes = featureSet.features[0].attributes
              attObjId = attributes[layersObjIdField[result.layer.id]]
              newlabelContent = attributes[labelExpression.id] + ': ' + attributes[labelExpression.projDesc]
              if(newlabelContent !== labelContent){
                labelContent = newlabelContent
                return(labelContent)
              }
              return(null)
            }).then((results) => {
              if(results && attObjId == hoverObjId){
                // console.log('label', labelContent)
                labelInfoDiv.textContent = results
                const screenHeight = window.screen.height;
                const yCoord = event.native.y + 25 
  
                const percentage = 1 - (( screenHeight - yCoord ) / screenHeight );
                // console.log('per', percentage)
  
                labelInfoDiv.style.top = percentage > 0.75 ? yCoord - 110 : yCoord
                labelInfoDiv.style.left = event.native.x - 20 - 110
                labelInfoDiv.style.display = 'flex'
              } 
            })
            
  
            hoverHighlight = layerView.highlight(result.graphic);
          }
        });
  
        document
          .getElementById("clear-selection")
          .addEventListener("click", () => {
            highlight?.remove();
            objectId = feature.graphic = graphic;
          })
  
        // console.log(view.ui.find("clear-selection"))
        sketchViewModel.watch('state', (state) => {
          if(state !== 'disabled'){
            highlight?.remove();
            objectId = feature.graphic = graphic;
          }
        })
  
        // Listen for the pointer-move event on the View
        view.on("click", (event) => {
          const isRectSelectionActive = featureTable.highlightIds.length > 1
          highlight?.remove();
          !isRectSelectionActive && debouncedUpdate(event).catch((err) => {
                if (!promiseUtils.isAbortError(err)) {
                    throw err;
                }
            });
        });
        // Listen for the pointer-move event on the View
        view.on("pointer-move", (event) => {
          const isRectFeatActive = document.getElementById("select-by-rectangle").classList.contains("active")
            // console.log("view", view)
          !isRectFeatActive && debouncedPointerMoveUpdate(event).catch((err) => {
            if (!promiseUtils.isAbortError(err)) {
              throw err;
            }
          });
        });
      });
    });
  }
  
  
  function aboutContent() {
    const container = document.createElement("div")
    container.id = "aboutDetails"
    container.style.width = "100%"
    // container.style.overflow = "hidden"
    container.style.display = "flex"
    container.style.flexDirection = "column"
    const html2 = `
    <div id="about-content">
    <p>
    The Capital Projects Map shows capital commitments from fiscal years 2001-2024, and includes the current capital plan (January 2024). The capital plan is updated 3 times a year. The political boundaries are also available for viewing.
    </p>
    <div id="listContainer">
      <h2 style="margin: 10px 0px 5px;">Features of this map</h2>
      <div id="searchList">
        <div id="searchTitle" class="listTitle">
          <p>Search by FMS ID</p>
          <span id="searchIcon" onclick="searchFunc()" style="padding: 5px;"  class="esri-icon-down"></span>
        </div>
        <div id="searchContent">
          <p>
            The search bar is located at the top of the Details tab in the side panel. After entering the FMS ID, details related to it will show up in the Details tab, and the FMS ID will be highlighted on the map.
          </p>
          <p>
            <span style="padding: 3px;" class="esri-icon-down-arrow listButton"></span> The arrow to the left of the search bar will let you filter by project type (e.g. Bridges or Sidewalks).
          </p>
          <p style="border-left: 2px solid green; padding: 5px 10px; background-color: #E2FFD9;">
            <strong>FMS ID</strong> starts with the agency code followed by the project's ID (e.g. 850 MED-583A).
          </p>
        </div>
      </div>
      <div id="filterList">
        <div id="filterTitle" class="listTitle">
          <p>Filter Results by Year</p>
          <span id="filterIcon"  onclick="filterFunc()" style="padding: 5px;"  class="esri-icon-down"></span>
        </div>
        <div id="filterContent">
          <p>
            You can find the time slider at the bottom of the Details tab. Dragging the start or end point will filter the data within those years.
          </p>
          <p style="border-left: 2px solid red; padding: 5px 10px; background-color: #FFD9D9;">
            <strong>Note:</strong> Have at least one layer visible before using this feature.  
          </p>
        </div>
      </div>
      <div id="rectSelectList">
        <div id="rectSelectTitle" class="listTitle">
          <p>Rectangle Selection</p>
          <span onclick="rectSelectFunc()" id="rectSelectIcon" style="padding: 5px;"  class="esri-icon-down"></span>
        </div>
        <div id="rectSelectContent">
          <p>
          <span class="esri-icon-sketch-rectangle listButton" aria-label="esri-icon-sketch-rectangle" ></span> This tool allows you to draw a rectangle over the map. Any feature that falls inside the rectangle will be selected in the Feature Table. The features that weren't selected will have a blur effect to help visualize the items selected in the map.
          </p>
          <p>
            <span class="esri-icon-erase listButton" aria-label="esri-icon-erase" ></span> This button will clear your selection.
          </p>
          <p>
            <span class="esri-icon-download listButton" aria-label="esri-icon-download" ></span> This button will export your selection into a CSV file.
          </p>
          
          <p><b>Modify Selection</b></p>
          <div id="modifySelList">
            <div id="moveRecTitle" class="listTitle">
              <p>Move Rectangle</p>
              <span id="moveRecIcon"  onclick="moveRecFunc()" style="padding: 5px;"  class="esri-icon-plus"></span>
            </div>
            <div id="moveRecContent" class="contentList">
              <p>
                It is possible to move a drawn rectangle to a different location in the map view. To move a drawn rectangle click anywhere inside the rectangle, this will highlight it with a cyan color. When you hover over the highlighted rectangle your mouse should be a four-headed arrow, then click and drag the figure to your location of interest. When the rectangle is over the new location of interest, release the mouse. The feature table and the map view will automatically reload to reselect the attributes that intersect the rectangle.        
            </p>
            </div>
            <div id="resizeRecTitle" class="listTitle">
              <p>Resize Rectangle</p>
              <span id="resizeRecIcon"  onclick="resizeRecFunc()" style="padding: 5px;"  class="esri-icon-plus"></span>
            </div>
            <div id="resizeRecContent" class="contentList">
              <p>
                It is possible to increase or decrease the area of a drawn rectangle in the map view. To move or resize a drawn rectangle click anywhere inside the rectangle this will highlight it with a cyan color. When you hover over the highlighted rectangle your mouse should be a four-headed arrow.
                <br/>
                <br/>
                Hover over one of the small orange rectangles around the cyan rectangle. When your mouse changes to a two-headed arrow, click and drag your mouse until the area of interest has been reached. Then release your mouse.   
              </p>
            </div>
            <div id="modifyRecShapeTitle" class="listTitle">
              <p>Modify Shape</p>
              <span id="modifyRecShapeIcon"  onclick="modifyRecShapeFunc()" style="padding: 5px;"  class="esri-icon-plus"></span>
            </div>
            <div id="modifyRecShapeContent" class="contentList">
              <p>
                To re-shape a drawn rectangle click anywhere inside the rectangle this will highlight it with a cyan color. When you hover over the highlighted rectangle your mouse should be a four-headed arrow.
                <br/>
                <br/>
                After you have clicked the rectangle and it has a cyan highlight surrounded by smaller orange rectangles, click anywhere inside the rectangle one more time. Now the small rectangles have changed to circles. When you hover the white ones your mouse changes to default with a plus sign on the top right. When this happens, click and drag your mouse to modify the shape of the figure. For the orange circles, the mouse changes to a four-headed arrow, however, when clicked and dragged will also modify the shape of the figure. If you would like to move the figure in this mode, click an area inside of the figure that is not a small circle and drag your mouse to the location of interest.
              </p>
            </div>
            <div id="changeYearRecTitle" class="listTitle">
              <p>Same Area, Different Year Range</p>
              <span id="changeYearRecIcon"  onclick="changeYearRecFunc()" style="padding: 5px;"  class="esri-icon-plus"></span>
            </div>
            <div id="changeYearRecContent" class="contentList">
              <p>
                If you like to keep the same size of the drawn rectangle, but with attributes of a different year range than the current, it is possible to conserve the same area or size of a rectangle through different year range selections.
                With the Feature Table still on, go to the Details tab. At the bottom, you will find a time slider. Drag the start or end thumb to change the year range of your interest. The Feature Table will automatically filter your selection according to the new year range selected.
              </p>
            </div>
          </div>
  
          <p style="border-left: 2px solid red; padding: 5px 10px; background-color: #FFD9D9;">
            <strong>Note:</strong> Turn on the visibility of the layer of interested before using this feature.   
          </p>
          <p style="border-left: 2px solid red; padding: 5px 10px; background-color: #FFD9D9;">
            <strong>Note:</strong> Rectangle Selection selects features from one layer at a time. If more that one layer is visible, the Rectangle Selection would select features from the same layer that is displayed in the Feature Table. 
          </p>
        </div>
      </div>
      <div id="attTableList">
        <div id="attTableTitle" class="listTitle">
          <p>Attribute Table</p>
          <span onclick="attTableFunc()" id="attTableIcon" style="padding: 5px;"  class="esri-icon-down"></span>
        </div>
        <div id="attTableContent">
          <p>
            The attribute table displays properities of the features of a specified layer. It is automatically filtered by the features visibles on your screen. Features in the attribute table will change as you zoom in or out.
          </p>
          <p>
            <span class="esri-icon-table listButton" aria-label="esri-icon-table" ></span> This button displays the Feature Table widget.
          </p>
          <p>
            To manually toggle the feature table, check the <i>Display Feature Table</i> box inside of the Feature Table widget. To change the layer displayed in the table, select the layer of interest in the dropdown inside the widget.
          </p>
          <p style="border-left: 2px solid #8A8A8A; padding: 5px 10px; background-color: #EEEEEE;">
            <strong>Note: </strong>The Feature table will automatically be displayed after clicking the <i>Select Features by Rectangle</i> button.
          </p>
        </div>
      </div>
      <div id="exportBtnList">
        <div id="exportBtnTitle" class="listTitle">
          <p>Export Selection</p>
          <span onclick="exportBtnFunc()" id="exportBtnIcon" style="padding: 5px;"  class="esri-icon-down"></span>
        </div>
        <div id="exportBtnContent">
          <p>
            <span class="esri-icon-download listButton" aria-label="esri-icon-download" ></span> The <i>Export to CSV</i> button allows you to download the features selected through the Rectangle Selection tool, or through the Feature Table.
          </p>
          <p>
            <i>Export to CSV</i> button is disabled by default, default, but it'll be enabled after one or more features are selected.
          </p>
        </div>
      </div>
      <div id="actionBtnsList">
        <div id="actionBtnsTitle" class="listTitle">
          <p>Action Buttons</p>
          <span onclick="actionBtnsFunc()" id="actionBtnsIcon" style="padding: 5px;"  class="esri-icon-down"></span>
        </div>
        <div id="actionBtnsContent">
          <dl>
          <dt> <span class="esri-icon-plus listButton" aria-label="esri-icon-plus" ></span> Zoom in  
          <dt> <span class="esri-icon-minus listButton" aria-label="esri-icon-minus" ></span> Zoom out 
          <dt> <span class="esri-icon-left listButton" aria-label="esri-icon-left" ></span> Hide side panel
          <dt> <span class="esri-icon-basemap listButton" aria-label="esri-icon-basemap" ></span> List of basemaps available 
              <dd> Change the default <b>Light Gray Canvas</b> basemap to your own preference 
          <!-- <dt> <span class="esri-icon-layer-list listButton" aria-label="esri-icon-layer-list" ></span> Legend of Visible Layers -->
          <!--<dt> <span class="esri-icon-layers listButton" aria-label="esri-icon-layers" ></span> List of Layers
            <dd> <span class="esri-icon-visible listButton" aria-label="esri-icon-visible" ></span> Turn visibility of layers on and off -->
          <dt> <span class="esri-icon-sketch-rectangle listButton" aria-label="esri-icon-sketch-rectangle" ></span> Feature selection by rectangle
          <dt> <span class="esri-icon-erase listButton" aria-label="esri-icon-erase" ></span> Clear feature selection
          <dt> <span class="esri-icon-table listButton" aria-label="esri-icon-table" ></span> Feature table
          <dt> <span class="esri-icon-download listButton" aria-label="esri-icon-download" ></span> Export features selection to a CSV file
        <dl>
        </div>
    </div>
    </div>`
  
    const html = `
    <h2 styles="margin-top: 2px;"> About Capital Projects Map </h2>
    <p>
    ​The Capital Projects Map is a web application reflecting all historical commitments from 2001 to the present, and the current Capital Plan.  This map will be updated three times per year after the release of the January, April, and September plans  
    </p>`
  
    // container.textContent = text
    // container.innerHTML = html
    // container.innerHTML = html2
  
    // return container
    const modal = document.getElementById('modal');
    const bgModal = document.getElementById('bg-modal');
    const contentDiv = document.getElementById('content-modal');
  
    contentDiv.innerHTML += html2
  
    // modal.style.display = bgModal.style.display = 'flex'
  
  }
  
  function dataTabcontent() {
  
    const html = `
      <div id="download-content">
        <p>
          Download a complete csv file containing the data used for the creation of this map.
        </p>
        <div id="listContainer">
          <div id="attributesList">
            <div id="attributesTitle" class="listTitle">
              <p>Attributes per project type</p>
              <span id="attributesIcon" onclick="attributesFunc()" style="padding: 5px;"  class="esri-icon-down"></span>
            </div>
            <div id="attributesContent">
              <p style="width: 90%;">
                Complete attributes table to download as csv file.
              </p>
              <div class="projList">
                <p>Sidewalks Prior Notice</p>
                <span id="sidewalksBtn" class="esri-icon-download downloadBtn"></span> 
              </div>
              <div class="projList">
                <p>Resurfacing</p>
                <span id="resurfacingBtn" class="esri-icon-download downloadBtn"></span> 
              </div>
              <div class="projList">
                <p>Ferries</p>
                <span id="ferriesBtn" class="esri-icon-download downloadBtn"></span> 
              </div>
              <div class="projList">
                <p>Facilities</p>
                <span id="facilitiesBtn" class="esri-icon-download downloadBtn"></span> 
              </div>
              <div class="projList">
                <p>Bridges</p>
                <span id="bridgesBtn" class="esri-icon-download downloadBtn"></span> 
              </div>
              <div class="projList">
                <p>Pedestrian Ramps</p>
                <span id="pedRampsBtn" class="esri-icon-download downloadBtn"></span> 
              </div>
              <div class="projList" style="border-bottom: none;">
                <p>Street Reconstruction</p>
                <span id="streetsBtn" class="esri-icon-download downloadBtn"></span> 
              </div>
            </div>
          </div>
          <div id="memberList">
            <div id="memberTitle" class="listTitle">
              <p>Political representatives</p>
              <span id="memberIcon"  onclick="memberFunc()" style="padding: 5px;"  class="esri-icon-down"></span>
            </div>
            <div id="memberContent">
              <p style="width: 90%;">
                Download a complete list of state representatives by district.
              </p>
              <div id="boundariesList">
                <div id="cityCounTitle" class="listTitle">
                  <p>City Council Districts</p>
                  <span id="cityCounIcon"  onclick="cityCounFunc()" style="padding: 5px;"  class="esri-icon-plus"></span>
                </div>
                <div id="cityCounContent" class="contentList">
                  <p>Data from <a class="apiLink" target="_blank" href="https://data.cityofnewyork.us/City-Government/Council-Members/uvw5-9znb/data_preview">NYC OpenData</a>.</p>
                  <button id="cityCounBtn" class="membersBtn">Download</button>
                </div>
                <div id="senateTitle" class="listTitle">
                  <p>State Senate Districs</p>
                  <span id="senateIcon"  onclick="senateFunc()" style="padding: 5px;"  class="esri-icon-plus"></span>
                </div>
                <div id="senateContent" class="contentList">
                  <p>Data from <a class="apiLink" target="_blank" href="https://legislation.nysenate.gov/static/docs/html/members.html">Open Legislation 2.0</a> API developed by <a class="apiLink" target="_blank" href="https://www.nysenate.gov/senators-committees">The New York State Senate</a>.</p>
                  <button id="senateBtn" class="membersBtn">Download</button>
                </div>
                <div id="assemblyTitle" class="listTitle">
                  <p>State Assembly Districts</p>
                  <span id="assemblyIcon"  onclick="assemblyFunc()" style="padding: 5px;"  class="esri-icon-plus"></span>
                </div>
                <div id="assemblyContent" class="contentList">
                  <p>Data from <a class="apiLink" target="_blank" href="https://data.gis.ny.gov/datasets/nys-assembly-districts/explore?showTable=true">NYS GIS Clearinghouse</a>.</p>
                  <button id="assemblyBtn" class="membersBtn">Download</button>
                </div>
                <div id="congressTitle" class="listTitle">
                  <p>Congressional Districts</p>
                  <span id="congressIcon"  onclick="congressFunc()" style="padding: 5px;"  class="esri-icon-plus"></span>
                </div>
                <div id="congressContent" class="contentList">
                  <p>Data from <a class="apiLink" target="_blank" href="https://api.congress.gov/">Congress.gov API</a>.
                  <br>
                  Go to NY Members at <a class="apiLink" target="_blank" href="https://www.congress.gov/members?q=%7B%22congress%22%3A118%2C%22member-state%22%3A%22New+York%22%7D">Congress.gov website</a>.
                  </p>
                  <button id="congressBtn" class="membersBtn disabled">Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
    // const newDiv = document.createElement("div")
    // newDiv.id = "repContainer"
    // newDiv.innerHTML = html
  
    // return newDiv
  
    const contentDiv = document.getElementById('content-modal');
  
    contentDiv.innerHTML += html
  
    // modal.style.display = bgModal.style.display = 'flex'
  }
  
  const contentIds = {"about-content": "About Capital Projects Map", "download-content": "Download"}
  function handleModalContent(id){
    Object.keys(contentIds).forEach(contentId => {
      if(contentId !== id){
        document.getElementById(contentId).style.display = "none"
      } else {
        document.getElementById(contentId).style.display = "flex"
        document.getElementById(contentId).style.flexDirection = "column"
        document.getElementById('title-modal').textContent = contentIds[id]
      }
    });
  
    const modal = document.getElementById('modal');
    const bgModal = document.getElementById('bg-modal');
  
    modal.style.display = bgModal.style.display = 'flex'
  }
  
  function closeModal(){
    const modal = document.getElementById('modal');
    const bgModal = document.getElementById('bg-modal');
  
    modal.style.display = bgModal.style.display = 'none'
  }
  
  
  function handleLists(iconId, contentId) {
    const visibleLists = ["filterContent", "searchContent", "actionBtnsContent", "attTableContent", "rectSelectContent", "exportBtnContent"];
    const visibleBtns = ["actionBtnsIcon", "searchIcon", "filterIcon", "attTableIcon", "rectSelectIcon", "exportBtnIcon"]
  
    visibleLists.forEach(listId => {
      if(contentId !== listId){
        document.getElementById(listId).style.display = "none"
      }
    });
  
    visibleBtns.forEach(btnId => {
      if(iconId !== btnId){
        document.getElementById(btnId).classList = "esri-icon-down"
      }
    });
  
    const iconBtn = document.getElementById(iconId);
    const content = document.getElementById(contentId)
    const isCollapsed = iconBtn.classList.contains("esri-icon-down")
  
    if(isCollapsed){
      iconBtn.classList = "esri-icon-up"
      content.style.display = "flex"
      content.style.flexDirection = "column"
    } else {
      iconBtn.classList = "esri-icon-down"
      content.style.display = "none"
    }
  }
  
  
  function filterFunc() {
    handleLists("filterIcon", "filterContent")
  }
  
  function searchFunc() {
    handleLists("searchIcon", "searchContent")
  }
  
  function actionBtnsFunc() {
    handleLists("actionBtnsIcon", "actionBtnsContent")
  }
  
  function attTableFunc() {
    handleLists("attTableIcon", "attTableContent")
  }
  
  function rectSelectFunc() {
    handleLists("rectSelectIcon", "rectSelectContent")
  }
  
  function exportBtnFunc() {
    handleLists("exportBtnIcon", "exportBtnContent")
  }
  
  function handleDataLists(iconId, contentId) {
    const visibleLists = ["memberContent", "attributesContent"];
    const visibleBtns = ["memberIcon", "attributesIcon"]
  
    visibleLists.forEach(listId => {
      if(contentId !== listId){
        document.getElementById(listId).style.display = "none"
      }
    });
  
    visibleBtns.forEach(btnId => {
      if(iconId !== btnId){
        document.getElementById(btnId).classList = "esri-icon-down"
      }
    });
  
    const iconBtn = document.getElementById(iconId);
    const content = document.getElementById(contentId)
    const isCollapsed = iconBtn.classList.contains("esri-icon-down")
  
    if(isCollapsed){
      iconBtn.classList = "esri-icon-up"
      content.style.display = "flex"
      content.style.flexDirection = "column"
    } else {
      iconBtn.classList = "esri-icon-down"
      content.style.display = "none"
    }
  }
  
  function memberFunc() {
    handleDataLists("memberIcon", "memberContent")
  }
  
  function attributesFunc() {
    handleDataLists("attributesIcon", "attributesContent")
  }
  
  const membersLists = ["congressContent", "assemblyContent", "senateContent", "cityCounContent"];
  const membersBtns = ["congressIcon", "assemblyIcon", "senateIcon", "cityCounIcon"]
  const modifyRecListContents = ["moveRecContent", "resizeRecContent", "modifyRecShapeContent", "changeYearRecContent"]
  const modifyRecIcons = ["moveRecIcon", "resizeRecIcon", "modifyRecShapeIcon", "changeYearRecIcon"]
  
  function handleDataMembersubLists(iconId, contentId, visibleLists, visibleBtns) {
  
    visibleLists.forEach(listId => {
      if(contentId !== listId){
        document.getElementById(listId).style.display = "none"
      }
    });
  
    visibleBtns.forEach(btnId => {
      if(iconId !== btnId){
        document.getElementById(btnId).classList = "esri-icon-plus"
      }
    });
  
    const iconBtn = document.getElementById(iconId);
    const content = document.getElementById(contentId)
    const isCollapsed = iconBtn.classList.contains("esri-icon-plus")
  
    if(isCollapsed){
      iconBtn.classList = "esri-icon-minus"
      content.style.display = "flex"
      content.style.flexDirection = "column"
    } else {
      iconBtn.classList = "esri-icon-plus"
      content.style.display = "none"
    }
  }
  
  function congressFunc() {
    handleDataMembersubLists("congressIcon", "congressContent", membersLists, membersBtns)
  }
  
  function assemblyFunc() {
    handleDataMembersubLists("assemblyIcon", "assemblyContent", membersLists, membersBtns)
  }
  
  function senateFunc() {
    handleDataMembersubLists("senateIcon", "senateContent", membersLists, membersBtns)
  }
  
  function cityCounFunc() {
    handleDataMembersubLists("cityCounIcon", "cityCounContent", membersLists, membersBtns)
  }
  
  function moveRecFunc() {
    handleDataMembersubLists("moveRecIcon", "moveRecContent", modifyRecListContents, modifyRecIcons)
  }
  
  function resizeRecFunc() {
    handleDataMembersubLists("resizeRecIcon", "resizeRecContent", modifyRecListContents, modifyRecIcons)
  }
  
  function modifyRecShapeFunc() {
    handleDataMembersubLists("modifyRecShapeIcon", "modifyRecShapeContent", modifyRecListContents, modifyRecIcons)
  }
  
  function changeYearRecFunc() {
    handleDataMembersubLists("changeYearRecIcon", "changeYearRecContent", modifyRecListContents, modifyRecIcons)
  }