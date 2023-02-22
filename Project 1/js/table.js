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
                top: 10,
                right: 30,
                bottom: 40,
                left: 50
            },
            reverseOrder: _config.reverseOrder || false,
            tooltipPadding: _config.tooltipPadding || 15
        }
        this.data = _data;
        this.initVis();
    }
    initVis(){
        this.table = new Tabulator("#exoplanet_table", {
            height:500,
            width:600,
            data: this.data, //assign data to table
            layout:"fitColumns", //fit columns to width of table (optional)
            columns:[ //Define Table Columns
                {title:"Exoplanet", field:"exoplanet"},
                {title:"Discovery Year", field:"year"},
                {title:"Discovery Facility", field:"facility"},
                {title:"Spectral Type", field:"spectype"},
            ],
            index: "exoplanet"
       });
    }

    updateVis(){
        this.renderVis();
    }

    renderVis(){
        //trigger a on alert message when the row is clicked
        this.table.on("rowClick", function(e, row){ 
            alert("Row " + row.getData().exoplanet + " Clicked!!!!");
        })
    }
}