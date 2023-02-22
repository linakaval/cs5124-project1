
 var map = L.map('map').setView([0,0],2);//[-41.2858, 174.7868], 2);
        mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
                
    /* Initialize the SVG layer */
    map._initPathRoot()    

    /* We simply pick up the SVG from the map object */
    var svg = d3.select("#map").select("svg"),
    g = svg.append("g");


  //   d3.csv('data/occurences.csv')
  //     .then(data => {
  //       console.log(data);
  //     })
  // .catch(error => console.error(error));

    // d3.csv("data/occurences.csv")
    // .then(_data => {
    //     data = _data;

    //     data.forEach(function(d) {
    //         d.LatLng = new L.LatLng(d.decimalLatitude,
    //                                 d.decimalLongitude);
    //     })
        
        // var feature = g.selectAll("circle")
        //     .data( data )//collection.objects)
        //     .enter().append("circle")
        //     .style("stroke", "black")  
        //     .style("opacity", .6) 
        //     .style("fill", "red")
        //     .attr("r", 5)
        //     .on('mouseover', (event,d) => {
        //   d3.select('#tooltip')
        //     .style('display', 'block')
        //     .html(`
        //       <div class="tooltip-title">${event.LatLng}</div>
        //     `);
        // })
        // .on('mouseleave', () => {
        //   d3.select('#tooltip').style('display', 'none');
        // });

        // map.on("viewreset", update);
        // update();

        // function update() {
        //     feature.attr("transform", 
        //     function(d) { 
        //         return "translate("+ 
        //             map.latLngToLayerPoint(d.LatLng).x +","+ 
        //             map.latLngToLayerPoint(d.LatLng).y +")";
        //         }
        //     )
        // }

    // }); 
    
    d3.json("circles.json", function(collection) {

        data = [];
        for(var i = 0; i < 10000; i ++){
            l1 = 90*Math.random() - 180*Math.random(); //-41.28+Math.random();
            l2 = 90*Math.random() - 180*Math.random() ; //174.77+Math.random();
            obj = new L.LatLng(l1 , l2 );
            data.push( { LatLng: obj }  );
        }


        var feature = g.selectAll("circle")
            .data( data )//collection.objects)
            .enter().append("circle")
            .style("stroke", "black")  
            .style("opacity", .6) 
            .style("fill", "red")
            .attr("r", 5)
            .on('mouseover', (event,d) => {
          d3.select('#tooltip')
            .style('display', 'block')
            .html(`
              <div class="tooltip-title">${event.LatLng}</div>
            `);
        })
        .on('mouseleave', () => {
          d3.select('#tooltip').style('display', 'none');
        });

        map.on("viewreset", update);
        update();

        function update() {
            feature.attr("transform", 
            function(d) { 
                return "translate("+ 
                    map.latLngToLayerPoint(d.LatLng).x +","+ 
                    map.latLngToLayerPoint(d.LatLng).y +")";
                }
            )
        }
    })         



// // Initialize Leaflet map
// //  nyc-map = ID of parent <div> container
// //  [40.749068, -74.006712] = center of the map
// //  13 = zoom level
// const map = L.map('nyc-map').setView([40.749068, -74.006712], 12);

// // Add Open Street Map tiles to the map
// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// // Specify directory with leaflet images (e.g., markers)
// L.Icon.Default.imagePath = 'images/';

// // Add a marker (with popup) at a specific geo coordinate
// const marker = L.marker([40.713008, -74.013169])
//     .bindPopup('<strong>One World Trade Center</strong><br>New York City')
//     .addTo(map);
// /*
// // Add a circle centered at the *Four Seasons NY* with a radius of 500 meters.
// const circle = L.circle([40.762188, -73.971606], {
//     color: 'steelblue',
//     fillColor: '#ccc',
//     fillOpacity: 0.7,
//     radius: 500
// }).addTo(map);

// // Add a polygon to highlight the SoHo district
// const polygon = L.polygon(
//   [
//       [40.728328, -74.002868],
//       [40.721937, -74.005443],
//       [40.718961, -74.001280],
//       [40.725287, -73.995916]
//   ],
//   { 
//     color: 'red',
//     fillOpacity: 0.7,
//     weight: 3
//   }
// ).addTo(map);
// polygon.bindPopup("SoHo, Manhattan");*/