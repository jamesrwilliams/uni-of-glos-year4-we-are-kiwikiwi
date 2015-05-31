	var map, i, output, test_marker;

	var polygons = [];

	function drawHex(width, lat, lng){
	
		var x = 0.0001;
		
		var output = [  
		
			[ lat + (x*1), lng + 0				], 		//1
			[ lat + (x*3), lng + 0				],		//2
			[ lat + (x*4), lng + ((x*1)*2.7)	],		//3
			[ lat + (x*3), lng + ((x*2)*2.7) 	],		//4
			[ lat + (x*1), lng + ((x*2)*2.7) 	],		//5
			[ lat + (x*0), lng + ((x*1)*2.7)	]		//6	
		];
		
		return output;
		
	}
	
	function isNumber(n){
	
	   return n == parseFloat(n);
	   
	}
	function isEven(n){
		
	   return isNumber(n) && (n % 2 === 0);
	   
	}
	
	function isOdd(n){
		
	   return isNumber(n) && (Math.abs(n) % 2 === 1);
	   
	}
	
	function drawFences(origin_lat, origin_lng, game){
	

		var length = 10;
		var iter = 10;
		
		var offset = 0.000300;
		var oddTab = 0.000270;
		
		/*	
		 *	Generate the Grid System 
		 */
		 
		for(count = 0; count < game.setup.height; count++){
			
			if(isEven(count)){
				
				for(i = 0; i < game.setup.width; i++){
	
					var lat_offset = (i * 0);
					var lng_offset = (i * -0.00054);
			
					polygons.push(map.drawPolygon({ 
						
						paths: drawHex(1, origin_lat - (offset*count), 
						(origin_lng - lng_offset)), 
						strokeColor: game.grid.strokeColour, 
						strokeOpacity: game.grid.strokeWeight, 
						strokeWeight: 0.4, 
						fillColor: game.style.fillColor, 
						fillOpacity: game.style.fillOpactiy
					
					}));			
				
				}
				
			}
			
			else if(isOdd(count)){
				
				for(i = 0; i < game.setup.width-1; i++){
	
					var lat_offset = (i * 0);
					var lng_offset = (i * -0.00054);
			
					polygons.push(map.drawPolygon({ 
						
						paths: drawHex(1, origin_lat - (offset*count), 
						((origin_lng+oddTab) - lng_offset)), 
						strokeColor: game.grid.strokeColour, 
						strokeOpacity: game.grid.strokeWeight, 
						strokeWeight: game.grid.strokeOpacity, 
						fillColor: game.style.fillColor, 
						fillOpacity: game.style.fillOpactiy					
						
					}));	
						
				
				}
			
			}
		
		}
	
	}

function refreshMap(){
			
	$.ajax({
	    
	    /* 2 */   
        type: "get",
        url: "http://www.jamesrwilliams.co.uk/hybrid/api.php?request=fetch_game",
        dataType: "json",
        success: function(data) {
            
           if(data.charAt(0) === '"' && data.charAt(data.length-1)){
				
				/* TODO - Remove Bug in PHP that adds quotes
				 * when claiming outside the game grid */
				
				initialise(JSON.parse(data.substring(1, data.length-1)));
				
			}else{
				
				// Initialise the game - see Lib.js
				initialise(JSON.parse(data));
				
			}
			
			//console.log(data);
			// initialise(JSON.parse(data));
			
			
          
        },
	    error: function(){ 
		
			console.log("Error");
		    
		}    
	});
	
}
		
function initialise(_data){
	
	var game = _data;
	
	polygons = [];
		
	// GMAPS Docs - https://hpneo.github.io/gmaps/documentation.html
	
	map = new GMaps({
		zoom: 18,
		div: '#map-canvas',
		lat: 51.887180,
		lng: -2.088669,
		disableDefaultUI: true
	});	
		
		
	var styles = [
	
		{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},
		{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},
		{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
		{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},
		{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},
		{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"},{"lightness":"100"}]},
		{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},
		{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},
		{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"lightness":"7"}]},
		{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},
		{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#48d1af"}]},
		{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#66b0ff"}]},
		{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},
		{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},
		{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},
		{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},
		{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"off"}]},
		{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"lightness":"100"},{"visibility":"off"}]},
		{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},
		{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},
		{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},
		{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"on"}]},
		{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"lightness":"100"},{"visibility":"on"}]},
		{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},
		{"featureType":"transit.station.bus","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"}]},
		{"featureType":"water","elementType":"geometry","stylers":[{"color":"#4aceae"},{"lightness":17}]},
		{"featureType":"water","elementType":"geometry.fill","stylers":[{"lightness":"100"}]}
		
	];
	
	var alt_styles = [
		
		{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}
		
	];
		
	map.setOptions({styles: alt_styles});
		
	drawFences(51.888094, -2.091802, game);
		
		/*
		
			- 1 Vampire
			- 2 Werewolf
			- 3 Ghost
			- 4 Zombie
			- 5 OTS
			- 6 Free	
			
		*/
		
	console.log(polygons.length);	
		
	for(i=0; i < polygons.length; i++){
		
		// console.log("Grid: " + i + " - " + game.grid[i]);
		
		if(game.grid[i] == "1"){
			
			// Vampires
			polygons[i].setOptions({fillColor: game.style.vampire, fillOpacity: 0.2, strokeWeight: 0.1});
			
	
		}else if(game.grid[i] == "2"){
			
			// Werewolf
			polygons[i].setOptions({fillColor: game.style.werewolf, fillOpacity: 0.2, strokeWeight: 0.1});

			
		}else if(game.grid[i] == "3"){
			
			// Ghost
			polygons[i].setOptions({fillColor: game.style.ghost, fillOpacity: 0.2, strokeWeight: 0.1});
			
		}else if(game.grid[i] == "4"){
			
			// Zombie
			polygons[i].setOptions({fillColor: game.style.zombie, fillOpacity: 0.2, strokeWeight: 0.1});
			
		}else {
			
			// Not Occupied
			polygons[i].setOptions({fillColor: "#FFFFFF", fillOpacity: 0.1, strokeWeight: 0.1});
			
		}
		
	}
	
}