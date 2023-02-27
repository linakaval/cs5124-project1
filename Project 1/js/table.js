class Table {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
        // Configuration object with defaults
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 250,
            containerHeight: _config.containerHeight || 150,
            margin: _config.margin || {
                top: 20,
                right: 30,
                bottom: 40,
                left: 100
            },
            reverseOrder: _config.reverseOrder || false,
            tooltipPadding: _config.tooltipPadding || 15
        }
        this.data = _data;
        this.initVis();
        
    }
    initVis(){
        let vis = this;   
    }

    updateVis(){
        let vis = this;  
        this.renderVis();
    }

    renderVis(){
        let vis = this;  
        vis.table = new Tabulator("#exoplanet_table", {
            autoResize: false,
            height: vis.config.containerHeight,
            width: vis.config.containerWidth,
            data: vis.data,
            layout:"fitColumns",
            columns:[ //Define Table Columns
                {title:"Exoplanet", field:"pl_name"},
                {title:"Discovery Year", field:"disc_year"},
                {title:"Discovery Facility", field:"disc_facility"},
                {title:"Spectral Type", field:"st_spectype"},
            ],
            index: "exoplanet"
       });
        //trigger a on alert message when the row is clicked
        vis.table.on("rowClick", function(e, row){ 
            console.log("Open exoplanet browser")
            //console.log(row.getData())
            openModalBrowser(row.getData());   
            //alert("Row " + row.getData().exoplanet + " Clicked!!!!");
        })
    }
}