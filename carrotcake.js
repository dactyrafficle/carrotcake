

let data = fetch('carrotcake.csv?x=' + Math.random()).then(r => r.text()).then(d => {

 let arr = csv_string_to_array_of_objects(d); // arr of objs
 let my_geojson_obj = arr_of_objects_into_geojson_object(arr);
 return my_geojson_obj;

}).then(x => {
  
  console.log(x);
  
 // display the map
 mapboxgl.accessToken = 'pk.eyJ1IjoicnRob21hc2lhbiIsImEiOiJjamY5NWt1MWIwZXBxMnFxb3N6NHphdHN3In0.p80Ttn1Zyoaqk-pXjMV8XA';
 let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9', // other choices: light-v9; dark-v9; streets-v10
  center: [-95.7129, 37.0902], // Hamilton, ON [-79.8711, 43.2557], US [-95.7129, 37.0902]
  zoom: 3
 });
 

 map.on('load', function() {

 	map.addLayer({
		id: 'locations',
		type: 'circle',
		source: {
			type: 'geojson',
			data: x  // the name of the array where the data is coming from
		},
		layout: {
			visibility: 'visible'
		},
		paint: {
			'circle-radius': {
        property: 'teu',
        'stops': [
         [0, 6],
         [68878, 9],
         [3398861, 15]  // this is the max of vancouver, biggest in Canada - also, how can I cluster them?
        ]
        /*
				'base': 4,
				'stops': [[4, 3], [12, 14]] // circles get bigger between z3 and z14
			  */
      },
      'circle-color': [
       'match', ['string', ['get', 'country']],
       'USA',
       '#fbb03b',
       'CANADA',
       '#0099ff',
       '#ccc' // other
      ],
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
        'teu_im': arr[i].teu_im,
        'teu_ex': arr[i].teu_ex,
        'teu': parseInt(arr[i].teu)
      }
    }
    // inside the for loop, push the object a into the obj object
    obj.features.push(a);
  }
  return obj;
}


// show port codes and names once it gets small enough

