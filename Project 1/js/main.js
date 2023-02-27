//TODO: don't let y scale update after filter (if I have time)

//global variables
let planetFilter = [];
let ogData, data, sy_snum, sy_pnum, st_spectype, discovery, habitable, distance_from_earth, year_linechart, scatter, table, orbital; //global variable for data, each chart
let modal; //global variable for modal object

modal = document.getElementById("myModal");
span = document.getElementById("btnCloseModal");

//Add data
d3.csv('data/exoplanets.csv')
    .then(_data => {
        //convert types where needed
        _data.forEach(element => {
            element.pl_rade = +element.pl_rade; //convert radius from string to num
            element.pl_bmasse = +element.pl_bmasse; //convert mass from string to num
            element.type = "exoplanet";
        })
        
        ogData = _data; //save unfiltered data as ogData
        data = _data;
        
        includeMissingData(); //filter data
        console.log("Data loading complete.");

        //1 - sy_snum
        console.log("Loading first barchart")
        sy_snum = new Barchart({ 
            'parentElement': '#chart1',   
        }, data, "pl_name", "sy_snum");
        sy_snum.updateVis();


        //2 - sy_num
        console.log("Loading second barchart")
        sy_pnum = new Barchart({ 
            'parentElement': '#chart2',
        }, data, "pl_name", "sy_pnum");
        sy_pnum.updateVis();


        //3 - st_spectype
        console.log("Loading third barchart")
        st_spectype = new Barchart({ 
            'parentElement': '#chart3',
        }, data, "pl_name", "star_type");
        st_spectype.updateVis();


        // //4 - discovery methods
        console.log("Loading fourth barchart")
        discovery = new Barchart({ 
            'parentElement': '#chart4',
            'containerWidth': 650,
            'containerHeight': 200,
        }, data, "pl_name", "discoverymethod");
        discovery.updateVis();


        // //5 - Habitable vs not
        console.log("Loading fifth barchart")
        data = data.filter(d => d.pl_orbsmax != "");
        data.forEach(element => {
            if (element.pl_orbsmax != "" && element.st_spectype != ""){
                let e = [element.pl_orbsmax, element.star_type];
                let insertValue = "";
                switch(e[1]) {
                    case "A":
                        insertValue = (e[0] >= 8.5 && e[0] <= 12.5) ? "habitable" : "inhabitable";
                      break;
                    case "F":
                        insertValue = (e[0] >= 1.5 && e[0] <= 2.2) ? "habitable" : "inhabitable";
                      break;
                    case "G":
                        insertValue = (e[0] >= 0.95 && e[0] <= 1.4) ? "habitable" : "inhabitable";
                      break;
                    case "K":
                        insertValue = (e[0] >= 0.38 && e[0] <= 0.56) ? "habitable" : "inhabitable";
                      break;
                    case "M":
                        insertValue = (e[0] >= 0.08 && e[0] <= 0.12) ? "habitable" : "inhabitable";
                      break;
                }
                element.habitable = insertValue;
            }
        })
        habitable = new Barchart({ 
            'parentElement': '#chart5',
        }, data, "pl_name", "habitable");
        habitable.updateVis();

        //6 - Distance from Earth
        console.log("Loading sixth histogram")
        distance_from_earth = new Histogram({ 
            'parentElement': '#chart6',
            'containerWidth': 650,
            'containerHeight': 200,
        }, data, "pl_name", "sy_dist");
        distance_from_earth.updateVis();
        
        //7 - Discovery by year
        console.log("Loading seventh line chart")
        year_linechart = new LineChart({ 
            'parentElement': '#chart7',
            'containerWidth': 650,
            'containerHeight': 200,
        }, data, "pl_name", "disc_year");
        year_linechart.updateVis();


        //8 - Exoplanet radius by Exoplanet mass
        console.log("Loading eighth scatter chart")
        scatter = new Scatterplot({ 
            'parentElement': '#chart8',
            'containerWidth': 650,
            'containerHeight': 200,
        }, data, "pl_name", "pl_rade", "pl_bmasse");
        scatter.updateVis();


        //9 - Table (using Tabulator library)
        console.log("Populating table with values")
        table = new Table({
            'containerWidth': 625,
            'containerHeight': 410,
        }, data, "pl_name");
        table.updateVis();

        console.log("Creating orbital chart for modal_browser")
        orbital = new Modal_Orbital({ 
            'parentElement': '#orbital',
            'containerWidth': 800,
            'containerHeight': 400,
        }, data, null);
 })
 .catch(error => console.error(error));


//Make filter for linked data
function filterData(dataCol) {
    console.log("FilterData was called")
    //console.log(planetFilter)
    if (planetFilter.length == 0) {
        sy_snum.data = data;
        st_spectype.data = data;
        discovery.data = data;
        habitable.data = data;
        sy_pnum.data = data;
        distance_from_earth.data = data;
        year_linechart.data = data; //fix
        scatter.data = data;
        table.data = data;
    } 
    else {
        sy_snum.data = data.filter(d => planetFilter.includes(d.pl_name));
        st_spectype.data = data.filter(d => planetFilter.includes(d.pl_name));
        discovery.data = data.filter(d => planetFilter.includes(d.pl_name));
        habitable.data = data.filter(d => planetFilter.includes(d.pl_name));
        sy_pnum.data = data.filter(d => planetFilter.includes(d.pl_name));
        distance_from_earth.data = data.filter(d => planetFilter.includes(d.pl_name));
        year_linechart.data = data.filter(d => planetFilter.includes(d.pl_name))
        scatter.data = data.filter(d => planetFilter.includes(d.pl_name));
        table.data = data.filter(d => planetFilter.includes(d.pl_name));
    }
    console.log(dataCol)
    if (dataCol != "sy_snum") sy_snum.updateVis();
    if (dataCol != "sy_pnum") sy_pnum.updateVis();
    if (dataCol != "star_type") st_spectype.updateVis();
    if (dataCol != "discoverymethod") discovery.updateVis(); 
    if (dataCol != "habitable") habitable.updateVis(); 
    if (dataCol != "sy_dist") distance_from_earth.updateVis();
    year_linechart.updateVis();
    scatter.updateVis();
    table.updateVis();
}

//Make filter for if user wants/doesn't want to see missing data
function includeMissingData(fromCheckbox) {
    console.log("Missing data function called")
    //Filtering data to remove all missing info on charts   
    var checkbox = document.getElementById("includeMissing");

    if (checkbox.checked != true){
        console.log("checkbox not clicked")
        data = data.filter(d => d.pl_rade != "") //remove missing radius
        data = data.filter(d => d.pl_orbsmax != "") //remove missing planet orbitals
        data = data.filter(d => d.pl_bmasse != "") //remove missing planet masses
        data = data.filter(d => +d.pl_orbeccen >= 0) //remove negative eccentricity bc it's not possible and could mean the whole row is compromised
        data = data.filter(d => d.st_spectype != "")  //remove missing spectral types
        data = data.filter(d => d.st_rad != "") //remove missing system radius
        data = data.filter(d => d.st_mass != "") //remove missing system mass
        data = data.filter(d => d.sy_dist != "") //remove missing system distance
        star_types = ["A", "F", "G", "K", "M"];
        data = data.filter(d => star_types.includes(d.st_spectype[0].toUpperCase().trim()));
        data.forEach(element => {
            let c = element.st_spectype[0].toUpperCase().trim();
            element.star_type = c; 
        })
        
    }
    else{
        console.log("Checkbox clicked")
        data = ogData;

    }
    if(fromCheckbox){
        sy_snum.data = data;
        st_spectype.data = data;
        discovery.data = data;
        habitable.data = data;
        sy_pnum.data = data;
        distance_from_earth.data = data;
        year_linechart.data = data;
        scatter.data = data;
        table.data = data;
        sy_snum.updateVis();
        sy_pnum.updateVis();
        st_spectype.updateVis();
        discovery.updateVis();
        habitable.updateVis();
        distance_from_earth.updateVis();
        year_linechart.updateVis();
        scatter.updateVis();
        console.log("I may have two errors above. Ignore.") //TODO suppress errors
        table.updateVis();
    }  
}





/////////////////////////// Functions for Modal Broswer window 
function openModalBrowser(selectedData) {
    modal.style.display = "block";
    // Modal - scatterplot/orbital chart for modal_browser
    orbital.data = selectedData;
    orbital.updateVis();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    console.log("User clicked (x), close modal")
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    console.log("User clicked out, close modal")
    if (event.target == modal) {
    modal.style.display = "none";
    }
}