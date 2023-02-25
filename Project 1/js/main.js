//TODO: don't let y scale update after filter

//global variables
let planetFilter = [];
let data, sy_snum, sy_pnum, st_spectype, discovery, habitable, distance_from_earth, year_linechart, scatter, table;

//Add data
d3.csv('data/exoplanets.csv')
    .then(_data => {
        //TODO: filter data ahead of time here to remove all undefined values
       _data = _data.filter(d => d.pl_rade != "")

        //convert types where needed
        _data.forEach(element => {
            element.pl_rade = +element.pl_rade; //convert radius from string to num
            element.pl_bmasse = +element.pl_bmasse; //convert mass from string to num
            element.type = "exoplanet";
        })        
        data = _data;
        console.log(data)
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
        data = data.filter(d => d.st_spectype != "");
        star_types = ["A", "F", "G", "K", "M"];
        data = data.filter(d => star_types.includes(d.st_spectype[0].toUpperCase().trim()));
        data.forEach(element => {
            let c = element.st_spectype[0].toUpperCase().trim();
            element.star_type = c; 
        })
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
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
        // let data9 = [];
        // data.forEach(element =>{
        //     data9.push({"exoplanet": element.pl_name, "sysname": element.sys_name, "year": element.disc_year,
        //     "facility": element.disc_facility, "spectype": element.st_spectype, "distance": element.sy_dist}) 
        // })

        table = new Table({
            'containerWidth': 625,
            'containerHeight': 410,
        }, data, "pl_name", );
        table.updateVis();

 })
 .catch(error => console.error(error));


//Make filter for linked data
function filterData() {
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
    }
    sy_snum.updateVis();
    sy_pnum.updateVis();
    st_spectype.updateVis();
    discovery.updateVis();
    habitable.updateVis();
    distance_from_earth.updateVis();
    year_linechart.updateVis();
    scatter.updateVis();
}