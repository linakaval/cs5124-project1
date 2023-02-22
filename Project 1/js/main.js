//Add data
d3.csv('data/exoplanets.csv')
    .then(data => {
        console.log("Data loading complete.");

        //1 - sy_snum
        console.log("Loading first barchart")
        let data1 = [];
        data.forEach(element => {
            let a = element.sy_snum;
            let snum_index = data1.findIndex(item => item.sy_snum == a)
            if(snum_index<0){
                data1.push({"sy_snum": a, 'count': 1}) 
            }
            else{
                data1[snum_index] = {"sy_snum": a, 'count': data1[snum_index].count + 1}
            }
        })
        sy_snum = new Barchart({ 
            'parentElement': '#chart1',
            // 'containerWidth': 200,
            // 'containerHeight': 100,      
        }, data1.sort((a, b) => b.count - a.count), "sy_snum", "count");
        sy_snum.updateVis();


        //TODO need to fix
        //2 - sy_num
        console.log("Loading second barchart")
        let data2 = [];
        data.forEach(element => {
            let b = element.sy_pnum;
            let pnum_index = data2.findIndex(item => item.sy_pnum == b)
            if(pnum_index<0){
                data2.push({"sy_pnum": b, 'count': 1});
            }
            else{
                data2[pnum_index].count = data2[pnum_index].count + 1;
            }
        })
        //console.log(data2)
        sy_pnum = new Barchart({ 
            'parentElement': '#chart2',
            // 'containerHeight': 400,
            // 'containerWidth': 500
        }, data2.sort((a, b) => b.count - a.count), "sy_pnum", "count");
        sy_pnum.updateVis();



        //3 - st_spectype
        console.log("Loading third barchart")
        let data3 = [];
        data.forEach(element => {
            if (element.st_spectype != ""){
                let c = element.st_spectype[0].toUpperCase().trim();
                star_types = ["A", "F", "G", "K", "M"];
                let star_index = star_types.indexOf(c);
                if(star_index >=0){
                    if(!data3[star_index]){
                        data3[star_index] = {"type": c, 'count': 1};
                    }
                    else{
                        data3[star_index].count = data3[star_index].count + 1;
                    }
                }
            }         
        })
        //console.log(data3)
        st_spectype = new Barchart({ 
            'parentElement': '#chart3',
            // 'containerHeight': 400,
            // 'containerWidth': 500
        }, data3.sort((a, b) => b.count - a.count), "type", "count");
        st_spectype.updateVis();


        //4 - discovery methods
        console.log("Loading fourth barchart")
        let data4 = [];
        data.forEach(element => {
            let d = element.discoverymethod;
            if (d != ""){
                let discovery_index = data4.findIndex(item => item.discovery == d)
                if(discovery_index < 0){
                    data4.push({"discovery": d, 'count': 1}) 
                }
                else{
                    data4[discovery_index].count = data4[discovery_index].count + 1;
                }
            }     
        })
        data4.sort((a, b) => b.count - a.count)
        let other_discovery_count = data4.reduce(function (sum, item) {
            return sum + ((data4.indexOf(item) >= 6) ? item.count : 0);
        }, 0);
        data4.length = 6
        data4.push({'discovery': 'Other', 'count': other_discovery_count});
        discoverymethod = new Barchart({ 
            'parentElement': '#chart4',
            'containerWidth': 750,
            'containerHeight': 200,
        }, data4, "discovery", "count");
        discoverymethod.updateVis();



        //5 - Habitable vs not
        console.log("Loading fifth barchart")
        let data5 = [{'type': 'habitable', 'count': 0}, {'type': 'inhabitable', 'count': 0}];
        data.forEach(element => {
            if (element.pl_orbsmax != "" && element.st_spectype != "")
            {
                let e = [element.pl_orbsmax, element.st_spectype[0].toUpperCase()];
                if (e[1] == "A"){
                    if(e[0] >= 8.5 && e[0] <= 12.5){
                        data5[0].count = data5[0].count + 1
                    }
                    else{
                        data5[1].count = data5[1].count + 1
                    }
                }
                else if (e[1] == "F"){
                    if(e[0] >= 1.5 && e[0] <= 2.2){
                        data5[0].count = data5[0].count + 1
                    }
                    else{
                        data5[1].count = data5[1].count + 1
                    }
                }
                else if (e[1] == "G"){
                    if(e[0] >= 0.95 && e[0] <= 1.4){
                        data5[0].count = data5[0].count + 1
                    }
                    else{
                        data5[1].count = data5[1].count + 1
                    }
                }
                else if (e[1] == "K"){
                    if(e[0] >= 0.38 && e[0] <= 0.56){
                        data5[0].count = data5[0].count + 1
                    }
                    else{
                        data5[1].count = data5[1].count + 1
                    }
                }
                else if (e[1] == "M"){
                    if(e[0] >= 0.08 && e[0] <= 0.12){
                        data5[0].count = data5[0].count + 1
                    }
                    else{
                        data5[1].count = data5[1].count + 1
                    }
                }
            }
        })
        //console.log(data5)
        habitable = new Barchart({ 
            'parentElement': '#chart5',
            // 'containerHeight': 400,
            // 'containerWidth': 500
        }, data5, "type", "count");
        habitable.updateVis();


        //6 - Distance from Earth
        console.log("Loading sixth histogram")
        let data6 = [];
        data.forEach(element => {
            let f = element.sy_dist;
            if (f != ""){
                data6.push({'distance': +f});
            } 
        })
        discoverymethod = new Histogram({ 
            'parentElement': '#chart6',
            'containerWidth': 600,
            'containerHeight': 200,
        }, data6);
        discoverymethod.updateVis();
        
        //7 - Discovery by year
        console.log("Loading seventh line chart")
        let data7 = [];
        data.forEach(element => {
            let g = element.disc_year;
            let year_index = data7.findIndex(item => item.year == g)
            if(year_index<0){
                data7.push({"year": g, 'count': 1});
            }
            else{
                data7[year_index].count = data7[year_index].count + 1;
            }
        })
        //console.log(data7)
        year_linechart = new LineChart({ 
            'parentElement': '#chart7',
            'containerWidth': 600,
            'containerHeight': 200,
        }, data7.sort((a, b) => a.year - b.year), "year", "count");
        year_linechart.updateVis();


        //8 - Exoplanet radius by Exoplanet mass
        console.log("Loading eighth scatter chart")
        let data8 = [];
        data.forEach(element => {
            let rad = element.pl_rade;
            let mass = element.pl_bmasse;
            if (rad != "" && mass != ""){
                data8.push({"type": "exoplanet", "radius": +rad, "mass": +mass, "object": element.pl_name});
            }
        })
        //Source: https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html
        data8.push({"type": "milkyway", "radius": 0.383, "mass": 0.0553, "object": "Mercury"}) //mercury
        data8.push({"type": "milkyway", "radius": 0.949, "mass": 0.815, "object": "Venus"}) //venus
        data8.push({"type": "milkyway", "radius": 1, "mass": 1, "object": "Earth"}) //earth
        data8.push({"type": "milkyway", "radius": 0.2724, "mass": 0.107, "object": "Mars"}) //mars
        data8.push({"type": "milkyway", "radius": 11.21, "mass": 317.8, "object": "Jupiter"}) //jupiter
        data8.push({"type": "milkyway", "radius": 9.45, "mass": 95.2, "object": "Saturn"}) //saturn    
        data8.push({"type": "milkyway", "radius": 4.01, "mass": 14.5, "object": "Uranus"}) //uranus
        data8.push({"type": "milkyway", "radius": 3.88, "mass": 17.1, "object": "Neptune"}) //neptune
        data8.push({"type": "milkyway", "radius": 0.187, "mass": 0.0022, "object": "Pluto"}) //pluto
        scatter = new Scatterplot({ 
            'parentElement': '#chart8',
            'containerWidth': 600,
            'containerHeight': 200,
        }, data8);
        scatter.updateVis();

        
        
 })
 .catch(error => console.error(error));