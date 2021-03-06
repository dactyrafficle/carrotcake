

let data = fetch('carrotcake.csv?x=' + Math.random()).then(r => r.text()).then(d => {

 let arr = csv_string_to_array_of_objects(d); // arr of objs
 console.log(arr);
 let my_geojson_obj = arr_of_objects_into_geojson_object(arr);
 return my_geojson_obj;

}).then(x => {
  
  console.log(x);
  
 // display the map
 mapboxgl.accessToken = 'pk.eyJ1IjoicnRob21hc2lhbiIsImEiOiJjamY5NWt1MWIwZXBxMnFxb3N6NHphdHN3In0.p80Ttn1Zyoaqk-pXjMV8XA';
 let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10', // other choices: light-v9; dark-v9; streets-v10
  center: [-95.7129, 37.0902], // Hamilton, ON [-79.8711, 43.2557], US [-95.7129, 37.0902]
  zoom: 3
 });
 

 map.on('load', function() {
   
   
   map.addSource('seaports', {
     'type': 'geojson',
     'data': x,
     'cluster': true,
     'clusterRadius': 23,
     'clusterProperties': {
       'clustered-teus': ['+',['get','teus']],
       //'clustered-teus': ['+',['ln',['get','teus']]] // works, but misleading
       
     }
   });
  
  map.addLayer({
  id: 'unclustered-point',
  type: 'circle',
  source: 'seaports',
  filter: ['!', ['has', 'point_count']],
  paint: {
   'circle-color': '#0099ff',
   //'circle-radius': ['min', ['/',['/',['sqrt',['get','teus']],['pi']],10], 10],
   'circle-radius': ['ln', ['get','teus']],
   
     
     
     /*
     {   
    property: 'teus',
    'stops': [
         [0, 12],
         [68878, 17],
         [3398861, 23]  // this is the max of vancouver. how to cluster them?
        ]
    },
    */
    'circle-opacity': 0.6
  }
  });

 	map.addLayer({
		id: 'clusters',
		type: 'circle',
    source: 'seaports',
    filter: ['has', 'point_count'],  // the thing we cluster by

		layout: {
			visibility: 'visible'
		},
    
    paint: {
      'circle-radius': ['ln',['get','clustered-teus']],
      
      /* [
       'step',
       ['get', 'clustered-teus'],
       12, // 10px min
       68878,  // 2 pts - need it by total teus per cluster
       17,
       3398861,
       23,
       7000000,
       40
      ],
     */

    /*
			'circle-radius': {
        property: 'teu',
        'stops': [
         [0, 6],
         [68878, 9],
         [3398861, 15]  // this is the max of vancouver. how to cluster them?
        ]
      },
      */
      'circle-color': '#0099ff',
      /*
      'circle-color': [
       'match', ['string', ['get', 'country']],
       'USA',
       '#fbb03b',
       'CANADA',
       '#0099ff',
       '#ccc' // other
      ],
      */
			'circle-opacity': 0.6
		}
	});
  
	map.addLayer({
		id: 'textLabels',
		type: 'symbol',
		source: {
			type: 'geojson',
			data: x  // the name of the array where the data is coming from
		},
		layout: {
      "text-allow-overlap": true,
      "text-field": ["format",
        ["get","display_code"], {"font-scale":1.0}

      ],
     "text-size": [
        "interpolate", ["linear"], ["zoom"],
        // zoom is 5 (or less) -> circle radius will be 1px
        4, 3,
        // zoom is 10 (or greater) -> circle radius will be 5px
        10, 20
     ]
     
     /*
			"text-size": {
        'stops': [[4, 0], [4.1,15], [8, 30]] // the more you zoom, the bigger the text-size
      }
     */
    },
		paint: {
			"text-color": "#ffe6ff"
		}
   
    
	});
  

 })


  
});




function csv_string_to_array_of_objects(csv_string) {
  let data = csv_string.split(/\n/);
  //let n_rows = data.length;
  //console.log('n_rows: ' + n_rows);
  
  let headers = data[0].split(/,/);

  for (let i = 0; i < headers.length; i++) {
    
    // SHOW THE WORD & THE CHAR CODES OF EACH LETTER
    //console.log(headers[i] + ': ' + headers[i].length);
    let b = [];
    for (let k = 0; k < headers[i].length; k++) {
      b.push(headers[i].charCodeAt(k));
    }
    //console.log(b);
    
    // DO A REPLACE TO GET RID OF BAD CHARACTERS
    let str = headers[i].replace(String.fromCharCode(13),'');
    headers[i] = str;
    
    // SHOW THE WORD & THE CHAR CODES OF EACH LETTER
    let c = [];
    for (let k = 0; k < headers[i].length; k++) {
      c.push(headers[i].charCodeAt(k));
    }
    //console.log(c);
    //console.log(headers[i] + ': ' + headers[i].length);
    
  }
  
  for (let i = 0; i < data.length; i++) {
    data[i] = data[i].split(/,/); 
  }
  
  let n_cols = data[0].length;
  
  let arr = [];
  for (let y = 1; y < data.length; y++) {
    let obj = {};
    
    for (let x = 0; x < n_cols; x++) {
     obj[headers[x]] = data[y][x];
    }
    arr.push(obj);
  }
  
  return arr;
}



function arr_of_objects_into_geojson_object(arr) {
  let obj = {
    'type': 'FeatureCollection',
    'features': []
  };
 
// port,port_name,state,lat,lon,type_proc,tonnage
 
	/* 
	 it looks like a geojson file has 2 main objects
	 1. type
	 2. features, which is an array containing anonymous objects (each is a location) each with 3 sub-objects
		 1. type
		 2. geometry
		 3. properties
	*/

  // start iterating from 1 bc data[0] is a header row
  for (var i = 0; i < arr.length; i++) {
    let a = {
      'type': 'Feature',
      'id': i,  // added this as part of step 13
      'geometry': {
        'type': 'Point',
        'coordinates': [
          arr[i].lon,
          arr[i].lat
        ]
      },
      'properties': {
        'rowId': i,
        'country': arr[i].country_name,
        'port_id': arr[i].port_id,
        'port_code': arr[i].port_code,
        'un_locode': arr[i].un_locode,
        'display_code': arr[i].display_code,
        'port_name': arr[i].port_name,
        'state': arr[i].state,
        'tonnage_im': arr[i].tonnage_im,
        'tonnage_em': arr[i].tonnage_ex,
        'tonnage': arr[i].tonnage,
        'teus_im': parseInt(arr[i].teus_im),
        'teus_ex': parseInt(arr[i].teus_ex),
        'teus': parseInt(arr[i].teus)
      }
    }
    // inside the for loop, push the object a into the obj object
    obj.features.push(a);
  }
  return obj;
}


// show port codes and names once it gets small enough

