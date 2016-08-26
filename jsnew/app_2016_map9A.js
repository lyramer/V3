
      
      

       var language;

        
        $('#confirmLoc').css('display', 'none');
        var exception = false;
        var hideConf;
        var centre = {lat: 43.6532, lng: -79.3832};

       function CenterControl(controlDiv, map) {

      // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.margin = '10px';
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
         if (language == "FR"){
        controlUI.title = 'Cliquer pour centrer la carte';
         }else{
        controlUI.title = 'Click to recenter the map';
        };
        controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        //controlText.innerHTML = 'Center Map';
        controlText.id = 'home';
        controlUI.appendChild(controlText);

      // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
        map.setCenter(centre);
        map.setZoom(13);
       });

      }





      // this is the function that creates the map
      function initMap1() {
         console.log("this is 1");
         //store page language
         language = $('#_lang').val();
         //This keeps the callweb form from submitting when the return key is pressed on the autocomplete
        
        $('form').keypress(function(event){
             if(event.which == 13){
              event.preventDefault();
             }
         });
        var map = new google.maps.Map(document.getElementById('map'), {
      //center map on TO
          center: centre,
          zoom: 13,
          disableDoubleClickZoom: true
        });

        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);


        var input = /** @type {!HTMLInputElement} */(document.getElementById('pac-input'));
       
        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
         
        var geocoder = new google.maps.Geocoder();

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29),
          draggable: true
        });

         // make a fallback geocoder------------------------------------------------------------

        function geocodeIntersection(geocoder, resultsMap) {
        var address = document.getElementById('pac-input').value;
        geocoder.geocode({
            address: address,
            componentRestrictions:{
              country: 'CA',
              administrativeArea: 'Ontario'
            }
        }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            
            console.log(results[0].types[0]);
            console.log(results[0].formatted_address);
          // amber light 
          // adjust this to refine filter on route
          if (results[0].types[0] == 'intersection'|| results[0].types[0] == 'neighborhood' || (results[0].types[0] == 'route' && results[0].types[1] != 'street_address')){
             $('#confirmLoc').css('display', 'none');
             resultsMap.setCenter(results[0].geometry.location);
              marker.setPosition(results[0].geometry.location);
              marker.setVisible(true);

    //lang intersection

              if (language == "FR"){
                 $('#response').append(
                  $('<p>').attr('id', "mapError").html("Google Maps a rep&eacute;r&eacute; l&rsquo;intersection <span style='color:darkblue;'>"+results[0].formatted_address+"</span> Veuillez glisser l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
                );
              }
              else{
                $('#response').append(
                  $('<p>').attr('id', "mapError").html("Google maps located the intersection: <span style='color:darkblue;'>"+results[0].formatted_address+"</span> Please move the marker to a more precise location or try your search again").fadeIn()
                );
              };
          //red lights
          }else if (results[0].types[0] == 'administrative_area_level_2' || results[0].types[0] == 'locality' || results[0].types[0] == 'administrative_area_level_1'){
               $('#confirmLoc').css('display', 'none');
               resultsMap.setCenter(centre);
               marker.setVisible(false);
                if (language == "FR"){
                  $('#response').append(
                  $('<p>').attr('id', "mapError").html("Google Maps ne peut rep&eacute;rer l&rsquo;endroit indiqu&eacute;. Veuillez recommencer votre recherche.").fadeIn()
                  );
                }else{
                  $('#response').append(
                  $('<p>').attr('id', "mapError").html("Google maps could not come up with a location. Please try your search again").fadeIn()
                  );
                };
              //green lights
              // allow street address secondary
          }else if (results[0].types[1] == 'street_address' || results[0].types[0] == 'point_of_interest' || results[0].types[0] == 'establishment' || results[0].types[0] == 'parking' || results[0].types[0] == 'bus_station' || results[0].types[0] == 'train_station'|| results[0].types[0] == 'premise' || results[0].types[0] == 'subpremise'|| results[0].types[0] == 'transit_station'|| results[0].types[0] == 'airport'|| results[0].types[0] == 'natural_feature'|| results[0].types[0] == 'street_address'|| results[0].types[0] == 'postal_code'|| results[0].types[0] == 'park'){
               $('#searchBoxResults').remove();
               $('#confirmLoc').css('display', 'inline');
               resultsMap.setCenter(results[0].geometry.location);
               marker.setPosition(results[0].geometry.location);
               marker.setVisible(true);
               if (language == "FR"){
  
                  $('#confirmLoc').prepend(
                    $('<p>').attr('id', "searchBoxResults").html("Votre recherche a rep&eacute;r&eacute;: <span style ='color:darkblue;'>"+results[0].formatted_address+".  </span><br>Si ce n&rsquo;est pas l&rsquo;endroit recherch&eacute;, cliquez et glissez l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
                  );

                 }else{
                  
                 
                 $('#confirmLoc').prepend(
                   $('<p>').attr('id', "searchBoxResults").html("Your search returned: <span style ='color:darkblue;'>"+results[0].formatted_address+".  </span><br>If this is not correct, drag the marker to the precise location, or search again.").fadeIn()
                  );
                };

                //fill vars

            var arrAddress = results[0].address_components;
                            $.each(arrAddress, function (i, address_component) {
                              if (address_component.types[0] == "locality"){
                              console.log("town:"+address_component.long_name);
                              city = address_component.long_name;
                             }
                            });
           // clear fields if filled with "drag marker" data
           //ADD a city field
           $('#ADRAG_CITY_MAP11').val(" ");
           //------------------------------
           $('#ADRAG_ADDR_MAP11').val(" ");
           $('#ADRAG_LAT_MAP11').val(" ");
           $('#ADRAG_LON_MAP11').val(" ");
           // fill fields with new place
           //----------------------------
           $('#ASEARCH_CITY_MAP11').val(city);
           $('#ASEARCH_ADDR_MAP11').val(results[0].formatted_address);
           $('#ASEARCH_LAT_MAP11').val(marker.getPosition().lat());
           $('#ASEARCH_LON_MAP11').val(marker.getPosition().lng());
           //SETTING VALUE OF 'HOME'
           $('#AHOME_LAT1').val(marker.getPosition().lat());
           $('#AHOME_LON1').val(marker.getPosition().lng());
           //clear out the click data ----------------------------------//new
           $('#ACLICK_CITY_MAP11').val(" ");
           $('#ACLICK_ADDR_MAP11').val(" ");
           $('#ACLICK_LAT_MAP11').val(" ");
           $('#ACLICK_LON_MAP11').val(" ");
           // add the search terms from the server
           $('#ASEARCHTYPE_MAP11').val(place.types.toString());
           // reveal confirm checkbox


          }else{
               $('#confirmLoc').css('display', 'inline');
               resultsMap.setCenter(results[0].geometry.location);
               marker.setPosition(results[0].geometry.location);
               marker.setVisible(true);
               if (language == "FR"){
                $('#response').append(
              $('<p>').attr('id', "mapError").html("Google Maps a rep&eacute;r&eacute;: <span style='color:darkblue;'>"+results[0].formatted_address+".</span> Veuillez glisser l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
              );
               }else{
             $('#response').append(
              $('<p>').attr('id', "mapError").html("Google maps located: <span style='color:darkblue;'>"+results[0].formatted_address+".</span> Please move the marker to a more precise location or try your search again.").fadeIn()
              );
           };
          }




          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
 //----------------------------------------------------------------------------------end fallback geocoder
         autocomplete.addListener('place_changed', function() {
          //managing confirm
           $('#confirmLoc').css('display', 'close');
           infowindow.close();
           marker.setVisible(false);
         var place = autocomplete.getPlace();
         console.log(place);
         //remove error message
         $('#mapError').remove();
           if (!place.geometry) { 
              

              //insert call to fallback geocoder
             geocodeIntersection(geocoder,map);

               
              

              //clear previous search data

              $('#ASEARCH_PLACE_MAP11').val(" ");
              $('#ASEARCH_ADDR_MAP11').val(" ");
              $('#ASEARCH_LAT_MAP11').val(" ");
              $('#ASEARCH_LON_MAP11').val(" ");

              //hide confirm
              $('#confirmLoc').css('display', 'none');
             
            }
             


            //adjust this filter
             if (place.types.indexOf('locality')!==-1 || place.types.indexOf('political')!==-1 || (place.types.indexOf('route') === 0 && place.types.indexOf('street_address') !== 1)) {
               if (language == "FR"){
              $('#response').append(
                $('<p>').attr('id', "mapError").html("Votre recherche a rep&eacute;r&eacute;: <span style ='color:darkblue;'> "+place.name+".  </span>Nous avons besoin d&rsquo;endroits pr&eacute;cis afin de comprendre les tendances dans les d&eacute;placements. Veuillez glisser l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche").fadeIn()
              );
            }else{
                 $('#response').append(
                $('<p>').attr('id', "mapError").html("Your search returned:<span style ='color:darkblue;'> "+place.name+".  </span>We need precise locations to understand where people travel to and from. Please drag the marker to the precise location. Or use the search box to try another search.").fadeIn()
              );
            };
              //hide confirm
               $('#confirmLoc').css('display', 'none');
              
               exception = true;
               //clear SEARCH data

              $('#ASEARCH_PLACE_MAP11').val(" ");
              $('#ASEARCH_ADDR_MAP11').val(" ");
              $('#ASEARCH_LAT_MAP11').val(" ");
              $('#ASEARCH_LON_MAP11').val(" ");

              
              
            }else{
              exception = false;
            }
           
             
          

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.setCenter(place.geometry.location);
            map.setZoom(15); 
            console.log(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);  // Why 17? Because it looks good.
          }
          // marker.setIcon(/** @type {google.maps.Icon} */({
          //   // url: place.icon,
          //   size: new google.maps.Size(71, 71),
          //   origin: new google.maps.Point(0, 0),
          //   anchor: new google.maps.Point(17, 34),
          //   scaledSize: new google.maps.Size(35, 35)
          // }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          //show if it doesn't meet the exception
          if (exception == true){
          hideConf = true;
          }else{
          hideConf = false;
          }

          
          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }
            console.log(place.types.indexOf('street_address'));

           if (place.types.indexOf('street_address') === 0 || place.types.indexOf('street_address') === 1 ){
                infowindow.setContent('<div>' + place.formatted_address + '<span style="color:blue;"><br><strong> Drag marker to set new location</strong></span>');
                 infowindow.open(map, marker);
                //new thing
                $('#searchBoxResults').remove();

                 if (language == "FR"){
                  infowindow.setContent('<div>' + place.formatted_address + '<span style="color:blue;"><br><strong> Glisser l&rsquo;indicateur pour s&eacute;lectionner un nouvel emplacement</strong></span>');
                  $('#confirmLoc').prepend(
                    $('<p>').attr('id', "searchBoxResults").html("Votre recherche a rep&eacute;r&eacute;: <span style ='color:darkblue;'>"+place.formatted_address+".  </span><br>Si ce n&rsquo;est pas l&rsquo;endroit recherch&eacute;, cliquez et glissez l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
                  );

                 }else{
                
                 $('#confirmLoc').prepend(
                   $('<p>').attr('id', "searchBoxResults").html("Your search returned: <span style ='color:darkblue;'>"+place.formatted_address+".  </span><br>If this is not correct, drag the marker to the precise location, or search again.").fadeIn()
                  );
                };
                // blank out the place name if place is a searched address
                $('#ASEARCH_PLACE_MAP11').val(" ");

          }else{ 
               infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.formatted_address + '<span style="color:blue;"><br><strong> Drag marker to set new location</strong></span>');
                 infowindow.open(map, marker);
                //new thing
                $('#searchBoxResults').remove();

                if (language == "FR"){
                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.formatted_address + '<span style="color:blue;"><br><strong> Glisser l&rsquo;indicateur pour s&eacute;lectionner un nouvel emplacement</strong></span>');
                   $('#confirmLoc').prepend(
                    $('<p>').attr('id', "searchBoxResults").html("Votre recherche a rep&eacute;r&eacute;:<span style ='color:darkblue;'> "+place.name+", "+place.formatted_address+".  </span><br>Si ce n&rsquo;est pas l&rsquo;endroit recherch&eacute;, cliquez et glissez l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
                 );

                }else{

                 $('#confirmLoc').prepend(
                  $('<p>').attr('id', "searchBoxResults").html("Your search returned:<span style ='color:darkblue;'> "+place.name+", "+place.formatted_address+".  </span><br>If this is not correct, drag the marker to the precise location, or search again.").fadeIn()
                 );
                };
                 // fill place name if place is an establishment
                $('#ASEARCH_PLACE_MAP11').val(place.name);
          }
          
          // parse me a city!
          

           var arrAddress = place.address_components;
           var city ='';
            $.each(arrAddress, function (i, address_component) {
              
               if (address_component.types[0] == "locality"){
                  console.log("town:"+address_component.long_name);
                  city = address_component.long_name;
                }

            });
            console.log(city);
           // clear fields if filled with "drag marker" data
           //ADD a city field
           $('#ADRAG_CITY_MAP11').val(" ");
           //------------------------------
           $('#ADRAG_ADDR_MAP11').val(" ");
           $('#ADRAG_LAT_MAP11').val(" ");
           $('#ADRAG_LON_MAP11').val(" ");
           // fill fields with new place
           //----------------------------
           $('#ASEARCH_CITY_MAP11').val(city);
           $('#ASEARCH_ADDR_MAP11').val(place.formatted_address);
           $('#ASEARCH_LAT_MAP11').val(marker.getPosition().lat());
           $('#ASEARCH_LON_MAP11').val(marker.getPosition().lng());
           //SETTING VALUE OF 'HOME'
           $('#AHOME_LAT1').val(marker.getPosition().lat());
           $('#AHOME_LON1').val(marker.getPosition().lng());
           //clear out the click data ----------------------------------//new
           $('#ACLICK_CITY_MAP11').val(" ");
           $('#ACLICK_ADDR_MAP11').val(" ");
           $('#ACLICK_LAT_MAP11').val(" ");
           $('#ACLICK_LON_MAP11').val(" ");
           // add the search terms from the server
           $('#ASEARCHTYPE_MAP11').val(place.types.toString());
           // reveal confirm checkbox
           if (hideConf == true){
              $('#confirmLoc').css('display', 'none');
            }
            else{
              $('#confirmLoc').css('display', 'inline');
            }

        });
      

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
          });
        }

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        // setupClickListener('changetype-geocode', ['geocode']);
       
        google.maps.event.addListener(marker, 'dragend', function () {
                geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            infowindow.close();
                            if (language == "FR"){

                                infowindow.setContent('<div><strong>' + '<span style="color:blue;">Nouvel emplacement:</span>' + '</strong><br>' + results[0].formatted_address );

                              }else{

                                infowindow.setContent('<div><strong>' + '<span style="color:blue;">New Location:</span>' + '</strong><br>' + results[0].formatted_address );
                              };
                            infowindow.open(map, marker);
//----------------------------------------------------------------------------------parse addr city
                            var arrAddress = results[0].address_components;
                            $.each(arrAddress, function (i, address_component) {
                              if (address_component.types[0] == "locality"){
                              console.log("town:"+address_component.long_name);
                              city = address_component.long_name;
                             }
                            });
                             console.log(city);

                            $('#pac-input').val(" ");
                            $('#ADRAG_ADDR_MAP11').val(results[0].formatted_address);
                            $('#ADRAG_CITY_MAP11').val(city);
                            $('#ADRAG_LAT_MAP11').val(marker.getPosition().lat());
                            $('#ADRAG_LON_MAP11').val(marker.getPosition().lng());
                            //this is the home position used for the other maps
                            $('#AHOME_LAT1').val(marker.getPosition().lat());
                            $('#AHOME_LON1').val(marker.getPosition().lng());

                            //remove previous searchbox results

                            $('#searchBoxResults').remove();

                            //remove error message

                            $('#mapError').remove();
                            //reveal confirm checkbox
                            $('#confirmLoc').css('display', 'inline');

                            console.log(marker.getPosition().lat());
                            console.log(marker.getPosition().lng());
                            console.log(results[0].address_components);
                            
                        }
                    }
                });
          });
        
      // the click and pan function

        function placeMarkerAndPanTo(latLng, map) {

          marker.setPosition(latLng);

          map.panTo(latLng);
        
          geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            
                            infowindow.close();
                            if (language == "FR"){
                              infowindow.setContent('<div><strong>' + '<span style="color:blue;">Vous avez s&eacute;lectionn&eacute;:</span>' + '</strong><br>' + results[0].formatted_address + '<span style="color:green;"><br><strong> Glisser l&rsquo;indicateur pour s&eacute;lectionner un nouvel emplacement</strong></span>');
                              }else{
                              infowindow.setContent('<div><strong>' + '<span style="color:blue;">You clicked on:</span>' + '</strong><br>' + results[0].formatted_address + '<span style="color:green;"><br><strong> Drag marker to set new location</strong></span>');
                            };
                            infowindow.open(map, marker);
                            $('#mapError').remove();

                            //remove previous searchbox results
                            $('#searchBoxResults').remove();
                            //----------------------------------------------------------------------------------parse addr city
                            var arrAddress = results[0].address_components;
                            $.each(arrAddress, function (i, address_component) {
                              if (address_component.types[0] == "locality"){
                              console.log("town:"+address_component.long_name);
                              city = address_component.long_name;
                             }
                            });
                             console.log(city);



                            $('#pac-input').val(" ");
                            $('#ACLICK_ADDR_MAP11').val(results[0].formatted_address);
                            $('#ACLICK_CITY_MAP11').val(city);
                            $('#ACLICK_LAT_MAP11').val(marker.getPosition().lat());
                            $('#ACLICK_LON_MAP11').val(marker.getPosition().lng());
                             //this is the home position used for the other maps
                            $('#AHOME_LAT1').val(marker.getPosition().lat());
                            $('#AHOME_LON1').val(marker.getPosition().lng());
                            //CLEARS OUT ANY ORIGINAL SEARCH WHEN CLICKED
                            $('#ASEARCH_CITY_MAP11').val(" ");
                            $('#ASEARCH_PLACE_MAP11').val(" ");
                            $('#ASEARCH_ADDR_MAP11').val(" ");
                            $('#ASEARCH_LAT_MAP11').val(" ");
                            $('#ASEARCH_LON_MAP11').val(" ");

                            // clear fields if filled with "drag marker" data

                            $('#ADRAG_ADDR_MAP11').val(" ");
                            $('#ADRAG_LAT_MAP11').val(" ");
                            $('#ADRAG_LON_MAP11').val(" ");
                            $('#ADRAG_CITY_MAP11').val(" "); //new!!

                            //remove error message
                            $('#mapError').remove();
                            //reveal confirm checkbox
                            $('#confirmLoc').css('display', 'inline');

                            console.log(marker.getPosition().lat());
                            console.log(marker.getPosition().lng());
                            console.log(results[0].formatted_address);
                            
                        }
                    }
                });






        }


        // add marker on click -- event listener
        google.maps.event.addListener(map,'dblclick', function(e) {
        
          placeMarkerAndPanTo(e.latLng, map);

        });
        
      }


    

  // this is the function that creates the map
      function initMap2() {
        console.log("this is 2");
         //store page language
        language = $('#_lang').val();
  // storing the "home" location here -- you need to put hidden boxes in the form
      
        if ($('#AHOME_LAT1').text() === "") {
          centre = {lat: 43.6532, lng: -79.3832}
       
      }else{
          var homeLat = parseFloat($('#AHOME_LAT1').val());
         var homeLon = parseFloat($('#AHOME_LON1').val());
        centre = {lat: homeLat, lng: homeLon};
          
       }

      
   //This keeps the callweb form from submitting when the return key is pressed on the autocomplete

        $('form').keypress(function(event){
             if(event.which == 13){
              event.preventDefault();
             }
         });
        
        var map = new google.maps.Map(document.getElementById('map'), {
      //center map on new home location
          center: centre,
          zoom: 13,
          disableDoubleClickZoom: true
        });

        var homeMarker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29),
          position:centre,
          icon:'cwTEST_RM/images/map_pin_home.png',
          title:'Home'
        });


        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);


        var input = /** @type {!HTMLInputElement} */(document.getElementById('pac-input'));
       
        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
         
        var geocoder = new google.maps.Geocoder();

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29),
          draggable: true
        });

        // make a fallback geocoder------------------------------------------------------------

        function geocodeIntersection(geocoder, resultsMap) {
        var address = document.getElementById('pac-input').value;
        geocoder.geocode({
            address: address,
            componentRestrictions:{
              country: 'CA',
              administrativeArea: 'Ontario'
            }
        }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            
            console.log(results[0].types[0]);
            console.log(results[0].formatted_address);
          // amber light
          if (results[0].types[0] == 'intersection'|| results[0].types[0] == 'neighborhood' || (results[0].types[0] == 'route' && results[0].types[1] != 'street_address')){
             $('#confirmLoc').css('display', 'none');
             resultsMap.setCenter(results[0].geometry.location);
              marker.setPosition(results[0].geometry.location);
              marker.setVisible(true);

    //lang intersection

              if (language == "FR"){
                 $('#response').append(
                  $('<p>').attr('id', "mapError").html("Google Maps a rep&eacute;r&eacute; l&rsquo;intersection <span style='color:darkblue;'>"+results[0].formatted_address+"</span> Veuillez glisser l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
                );
              }
              else{
                $('#response').append(
                  $('<p>').attr('id', "mapError").html("Google maps located the intersection: <span style='color:darkblue;'>"+results[0].formatted_address+"</span> Please move the marker to a more precise location or try your search again").fadeIn()
                );
              };
          //red lights
          }else if (results[0].types[0] == 'administrative_area_level_2' || results[0].types[0] == 'locality' || results[0].types[0] == 'administrative_area_level_1'){
               $('#confirmLoc').css('display', 'none');
               resultsMap.setCenter(centre);
               marker.setVisible(false);
                if (language == "FR"){
                  $('#response').append(
                  $('<p>').attr('id', "mapError").html("Google Maps ne peut rep&eacute;rer l&rsquo;endroit indiqu&eacute;. Veuillez recommencer votre recherche.").fadeIn()
                  );
                }else{
                  $('#response').append(
                  $('<p>').attr('id', "mapError").html("Google maps could not come up with a location. Please try your search again").fadeIn()
                  );
                };
              //green lights
          }else if (results[0].types[1] == 'street_address' || results[0].types[0] == 'point_of_interest' || results[0].types[0] == 'establishment' || results[0].types[0] == 'parking' || results[0].types[0] == 'bus_station' || results[0].types[0] == 'train_station'|| results[0].types[0] == 'premise' || results[0].types[0] == 'subpremise'|| results[0].types[0] == 'transit_station'|| results[0].types[0] == 'airport'|| results[0].types[0] == 'natural_feature'|| results[0].types[0] == 'street_address'|| results[0].types[0] == 'postal_code'|| results[0].types[0] == 'park'){
               $('#searchBoxResults').remove();
               $('#confirmLoc').css('display', 'inline');
               resultsMap.setCenter(results[0].geometry.location);
               marker.setPosition(results[0].geometry.location);
               marker.setVisible(true);
               if (language == "FR"){
  
                  $('#confirmLoc').prepend(
                    $('<p>').attr('id', "searchBoxResults").html("Votre recherche a rep&eacute;r&eacute;: <span style ='color:darkblue;'>"+results[0].formatted_address+".  </span><br>Si ce n&rsquo;est pas l&rsquo;endroit recherch&eacute;, cliquez et glissez l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
                  );

                 }else{
                  
                 
                 $('#confirmLoc').prepend(
                   $('<p>').attr('id', "searchBoxResults").html("Your search returned: <span style ='color:darkblue;'>"+results[0].formatted_address+".  </span><br>If this is not correct, drag the marker to the precise location, or search again.").fadeIn()
                  );
                };

                //fill vars

            var arrAddress = results[0].address_components;
                            $.each(arrAddress, function (i, address_component) {
                              if (address_component.types[0] == "locality"){
                              console.log("town:"+address_component.long_name);
                              city = address_component.long_name;
                             }
                            });
           // clear fields if filled with "drag marker" data
           //ADD a city field
           $('#ADRAG_CITY_MAP21').val(" ");
           //------------------------------
           $('#ADRAG_ADDR_MAP21').val(" ");
           $('#ADRAG_LAT_MAP21').val(" ");
           $('#ADRAG_LON_MAP21').val(" ");
           // fill fields with new place
           //----------------------------
           $('#ASEARCH_CITY_MAP21').val(city);
           $('#ASEARCH_ADDR_MAP21').val(results[0].formatted_address);
           $('#ASEARCH_LAT_MAP21').val(marker.getPosition().lat());
           $('#ASEARCH_LON_MAP21').val(marker.getPosition().lng());
           //SETTING VALUE OF 'HOME'
           $('#AHOME_LAT1').val(marker.getPosition().lat());
           $('#AHOME_LON1').val(marker.getPosition().lng());
           //clear out the click data ----------------------------------//new
           $('#ACLICK_CITY_MAP21').val(" ");
           $('#ACLICK_ADDR_MAP21').val(" ");
           $('#ACLICK_LAT_MAP21').val(" ");
           $('#ACLICK_LON_MAP21').val(" ");
           // add the search terms from the server
           $('#ASEARCHTYPE_MAP21').val(place.types.toString());
           // reveal confirm checkbox


          }else{
               $('#confirmLoc').css('display', 'inline');
               resultsMap.setCenter(results[0].geometry.location);
               marker.setPosition(results[0].geometry.location);
               marker.setVisible(true);
               if (language == "FR"){
                $('#response').append(
              $('<p>').attr('id', "mapError").html("Google Maps a rep&eacute;r&eacute;: <span style='color:darkblue;'>"+results[0].formatted_address+".</span> Veuillez glisser l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
              );
               }else{
             $('#response').append(
              $('<p>').attr('id', "mapError").html("Google maps located: <span style='color:darkblue;'>"+results[0].formatted_address+".</span> Please move the marker to a more precise location or try your search again.").fadeIn()
              );
           };
          }




          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
 //----------------------------------------------------------------------------------end fallback geocoder

         autocomplete.addListener('place_changed', function() {
           infowindow.close();
           marker.setVisible(false);
         var place = autocomplete.getPlace();
         console.log(place);
         //remove error message
         $('#mapError').remove();
           if (!place.geometry) { 
              
               //insert call to fallback geocoder
             geocodeIntersection(geocoder,map);

              //clear previous search data

              $('#ASEARCH_PLACE_MAP21').val(" ");
              $('#ASEARCH_ADDR_MAP21').val(" ");
              $('#ASEARCH_LAT_MAP21').val(" ");
              $('#ASEARCH_LON_MAP21').val(" ");

              //hide confirm
              $('#confirmLoc').css('display', 'none');
             
            }

             if (place.types.indexOf('locality')!==-1 || place.types.indexOf('political')!==-1 || (place.types.indexOf('route') === 0 && place.types.indexOf('street_address') !== 1)) {

                if (language == "FR"){
              $('#response').append(
                $('<p>').attr('id', "mapError").html("Votre recherche a rep&eacute;r&eacute;: <span style ='color:darkblue;'> "+place.name+".  </span>Nous avons besoin d&rsquo;endroits pr&eacute;cis afin de comprendre les tendances dans les d&eacute;placements. Veuillez glisser l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche").fadeIn()
              );
            }else{
                 $('#response').append(
                $('<p>').attr('id', "mapError").html("Your search returned:<span style ='color:darkblue;'> "+place.name+".  </span>We need precise locations to understand where people travel to and from. Please drag the marker to the precise location. Or use the search box to try another search.").fadeIn()
              );
            };
              //hide confirm
               $('#confirmLoc').css('display', 'none');
              
               exception = true;
               //clear SEARCH data

              $('#ASEARCH_PLACE_MAP21').val(" ");
              $('#ASEARCH_ADDR_MAP21').val(" ");
              $('#ASEARCH_LAT_MAP21').val(" ");
              $('#ASEARCH_LON_MAP21').val(" ");

              
              
            }else{
              exception = false;
            }
           
             
          

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.setCenter(place.geometry.location);
            map.setZoom(15); 
            console.log(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);  // Why 17? Because it looks good.
          }
          // marker.setIcon(/** @type {google.maps.Icon} */({
          //   // url: place.icon,
          //   size: new google.maps.Size(71, 71),
          //   origin: new google.maps.Point(0, 0),
          //   anchor: new google.maps.Point(17, 34),
          //   scaledSize: new google.maps.Size(35, 35)
          // }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          //show if it doesn't meet the exception
          if (exception == true){
          hideConf = true;
          }else{
          hideConf = false;
          }

          
          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

           if (place.types.indexOf('street_address')!==-1){
                infowindow.setContent('<div>' + place.formatted_address + '<span style="color:blue;"><br><strong> Drag marker to set new location</strong></span>');
                 infowindow.open(map, marker);
                //new thing
                $('#searchBoxResults').remove();

                  if (language == "FR"){

                  $('#confirmLoc').prepend(
                    $('<p>').attr('id', "searchBoxResults").html("Votre recherche a rep&eacute;r&eacute;: <span style ='color:darkblue;'>"+place.formatted_address+".  </span><br>Si ce n&rsquo;est pas l&rsquo;endroit recherch&eacute;, cliquez et glissez l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
                  );

                 }else{

                 $('#confirmLoc').prepend(
                   $('<p>').attr('id', "searchBoxResults").html("Your search returned: <span style ='color:darkblue;'>"+place.formatted_address+".  </span><br>If this is not correct, drag the marker to the precise location, or search again.").fadeIn()
                  );
                };
                 // blank out the place name if place is a searched address
                $('#ASEARCH_PLACE_MAP21').val(" ");
          }else{ 
               infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.formatted_address + '<span style="color:blue;"><br><strong> Drag marker to set new location</strong></span>');
                 infowindow.open(map, marker);
                //new thing
                $('#searchBoxResults').remove();
                  if (language == "FR"){
                   $('#confirmLoc').prepend(
                    $('<p>').attr('id', "searchBoxResults").html("Votre recherche a rep&eacute;r&eacute;:<span style ='color:darkblue;'> "+place.name+", "+place.formatted_address+".  </span><br>Si ce n&rsquo;est pas l&rsquo;endroit recherch&eacute;, cliquez et glissez l&rsquo;indicateur jusqu&rsquo;&agrave; l&rsquo;endroit plus pr&eacute;cis, ou recommencer la recherche.").fadeIn()
                 );

                }else{

                 $('#confirmLoc').prepend(
                  $('<p>').attr('id', "searchBoxResults").html("Your search returned:<span style ='color:darkblue;'> "+place.name+", "+place.formatted_address+".  </span><br>If this is not correct, drag the marker to the precise location, or search again.").fadeIn()
                 );
                };
                $('#ASEARCH_PLACE_MAP21').val(place.name);
          }
           // parse me a city!
          

           var arrAddress = place.address_components;
           var city ='';
            $.each(arrAddress, function (i, address_component) {
              
               if (address_component.types[0] == "locality"){
                  console.log("town:"+address_component.long_name);
                  city = address_component.long_name;
                }

            });
            console.log(city);
           
           //ADD a city field
           $('#ADRAG_CITY_MAP21').val(" ");
           //------------------------------


           // clear fields if filled with "drag marker" data
           $('#ADRAG_ADDR_MAP21').val(" ");
           $('#ADRAG_LAT_MAP21').val(" ");
           $('#ADRAG_LON_MAP21').val(" ");
           // fill fields with new place
           //-------------------------------
           $('#ASEARCH_CITY_MAP21').val(city);
           $('#ASEARCH_ADDR_MAP21').val(place.formatted_address);
           $('#ASEARCH_LAT_MAP21').val(marker.getPosition().lat());
           $('#ASEARCH_LON_MAP21').val(marker.getPosition().lng());
           //clear out the click data
           $('#ACLICK_CITY_MAP21').val(" ");
           $('#ACLICK_ADDR_MAP21').val(" ");
           $('#ACLICK_LAT_MAP21').val(" ");
           $('#ACLICK_LON_MAP21').val(" ");
           // add the search terms from the server
           $('#ASEARCHTYPE_MAP21').val(place.types.toString());
           // reveal confirm checkbox
           if (hideConf == true){
              $('#confirmLoc').css('display', 'none');
            }
            else{
              $('#confirmLoc').css('display', 'inline');
            }

        });
      

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
          });
        }

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        // setupClickListener('changetype-geocode', ['geocode']);
       
        google.maps.event.addListener(marker, 'dragend', function () {
                geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            infowindow.close();
                            if (language == "FR"){

                                infowindow.setContent('<div><strong>' + '<span style="color:blue;">Nouvel emplacement:</span>' + '</strong><br>' + results[0].formatted_address );

                              }else{

                                infowindow.setContent('<div><strong>' + '<span style="color:blue;">New Location:</span>' + '</strong><br>' + results[0].formatted_address );
                              };
                            infowindow.open(map, marker);
//----------------------------------------------------------------------------------parse addr city
                            var arrAddress = results[0].address_components;
                            $.each(arrAddress, function (i, address_component) {
                              if (address_component.types[0] == "locality"){
                              console.log("town:"+address_component.long_name);
                              city = address_component.long_name;
                             }
                            });
                             console.log(city);


                            $('#pac-input').val(" ");
                            $('#ADRAG_ADDR_MAP21').val(results[0].formatted_address);
                            $('#ADRAG_CITY_MAP21').val(city);
                            $('#ADRAG_LAT_MAP21').val(marker.getPosition().lat());
                            $('#ADRAG_LON_MAP21').val(marker.getPosition().lng());

                            //remove previous searchbox results
                            $('#searchBoxResults').remove();

                            //remove error message
                            $('#mapError').remove();

                            //reveal confirm checkbox
                            $('#confirmLoc').css('display', 'inline');

                            console.log(marker.getPosition().lat());
                            console.log(marker.getPosition().lng());
                            console.log(results[0].formatted_address);
                            
                        }
                    }
                });
          });
        
      // the click and pan function

        function placeMarkerAndPanTo(latLng, map) {

          marker.setPosition(latLng);

          map.panTo(latLng);
        
          geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            
                            infowindow.close();
                            if (language == "FR"){
                              infowindow.setContent('<div><strong>' + '<span style="color:blue;">Vous avez s&eacute;lectionn&eacute;:</span>' + '</strong><br>' + results[0].formatted_address + '<span style="color:green;"><br><strong> Glisser l&rsquo;indicateur pour s&eacute;lectionner un nouvel emplacement</strong></span>');
                              }else{
                              infowindow.setContent('<div><strong>' + '<span style="color:blue;">You clicked on:</span>' + '</strong><br>' + results[0].formatted_address + '<span style="color:green;"><br><strong> Drag marker to set new location</strong></span>');
                            };                            infowindow.open(map, marker);
                            // remove results message
                            $('#searchBoxResults').remove();

                            // remove error message
                            $('#mapError').remove();
                            //----------------------------------------------------------------------------------parse addr city
                            var arrAddress = results[0].address_components;
                            $.each(arrAddress, function (i, address_component) {
                              if (address_component.types[0] == "locality"){
                              console.log("town:"+address_component.long_name);
                              city = address_component.long_name;
                             }
                            });
                             console.log(city);



                            $('#pac-input').val(" ");
                            $('#ACLICK_ADDR_MAP21').val(results[0].formatted_address);
                            $('#ACLICK_CITY_MAP21').val(city);
                            $('#ACLICK_LAT_MAP21').val(marker.getPosition().lat());
                            $('#ACLICK_LON_MAP21').val(marker.getPosition().lng());

                            //CLEARS OUT ANY ORIGINAL SEARCH WHEN CLICKED
                            $('#ASEARCH_CITY_MAP21').val(" ");
                            $('#ASEARCH_PLACE_MAP21').val(" ");
                            $('#ASEARCH_ADDR_MAP21').val(" ");
                            $('#ASEARCH_LAT_MAP21').val(" ");
                            $('#ASEARCH_LON_MAP21').val(" ");

                            // clear fields if filled with "drag marker" data

                            $('#ADRAG_ADDR_MAP21').val(" ");
                            $('#ADRAG_LAT_MAP21').val(" ");
                            $('#ADRAG_LON_MAP21').val(" ");
                            $('#ADRAG_CITY_MAP21').val(" "); //new!!
                            //remove error message
                            $('#mapError').remove();
                            //reveal confirm checkbox
                            $('#confirmLoc').css('display', 'inline');

                            console.log(marker.getPosition().lat());
                            console.log(marker.getPosition().lng());
                            console.log(results[0].formatted_address);
                            
                        }
                    }
                });






        }


        // add marker on click -- event listener
        google.maps.event.addListener(map,'dblclick', function(e) {
        
          placeMarkerAndPanTo(e.latLng, map);

        });
        
      }

     // this is the function that creates the map
      function initMap3() {

     // storing the "home" location here -- you need to put hidden boxes in the form
      var homeLat = parseFloat($('#AHOME_LAT1').val());
      var homeLon = parseFloat($('#AHOME_LON1').val());
      centre = {lat: homeLat, lng: homeLon};
     //This keeps the callweb form from submitting when the return key is pressed on the autocomplete

        $('form').keypress(function(event){
             if(event.which == 13){
              event.preventDefault();
             }
         });
      var map = new google.maps.Map(document.getElementById('map'), {
      //center map on HOME location
          center: centre,
          zoom: 13,
          disableDoubleClickZoom: true
        });

       var homeMarker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29),
          position:centre,
          icon:'cwTEST_RM/images/map_pin_home.png',
          title:'Home'
        });

        // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);


        var input = /** @type {!HTMLInputElement} */(document.getElementById('pac-input'));
       
        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
         
        var geocoder = new google.maps.Geocoder();

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29),
          draggable: true
        });

// make a fallback geocoder------------------------------------------------------------

        function geocodeIntersection(geocoder, resultsMap) {
        var address = document.getElementById('pac-input').value;
        geocoder.geocode({
            address: address,
            componentRestrictions:{
              country: 'CA',
              administrativeArea: 'Toronto Division'
            }
        }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            
            console.log(results[0].types[0]);
            console.log(results[0].formatted_address);
          if (results[0].types[0] == 'intersection'){
             resultsMap.setCenter(results[0].geometry.location);
              marker.setPosition(results[0].geometry.location);
              marker.setVisible(true);
            $('#response').append(
              $('<p>').attr('id', "mapError").html("Google maps located the intersection: <span style='color:darkblue;'>"+results[0].formatted_address+"</span> Please move the marker to a more precise location or try your search again").fadeIn()
              );
          }else if (results[0].types[0] == 'administrative_area_level_2'){
               resultsMap.setCenter(centre);
               marker.setVisible(false);
               $('#response').append(
               $('<p>').attr('id', "mapError").html("Google maps could not come up with a location. Please try your search again").fadeIn()
              );
          }else{
               resultsMap.setCenter(results[0].geometry.location);
               marker.setPosition(results[0].geometry.location);
               marker.setVisible(true);
             $('#response').append(
              $('<p>').attr('id', "mapError").html("Google maps located: <span style='color:darkblue;'>"+results[0].formatted_address+".</span> Please move the marker to a more precise location or try your search again").fadeIn()
              );
          }




          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
 //----------------------------------------------------------------------------------end fallback geocoder

         autocomplete.addListener('place_changed', function() {
           infowindow.close();
           marker.setVisible(false);
         var place = autocomplete.getPlace();
         console.log(place);
         //remove error message
         $('#mapError').remove();
           if (!place.geometry) { 
              
               //insert call to fallback geocoder
             geocodeIntersection(geocoder,map);

              //clear previous search data

              $('#ASEARCH_PLACE_MAP31').val(" ");
              $('#ASEARCH_ADDR_MAP31').val(" ");
              $('#ASEARCH_LAT_MAP31').val(" ");
              $('#ASEARCH_LON_MAP31').val(" ");

              //hide confirm
              $('#confirmLoc').css('display', 'none');
             
            }

             if (place.types.indexOf('locality')!==-1 || place.types.indexOf('political')!==-1 || place.types.indexOf('route')!==-1) {
              
              $('#response').append(
                $('<p>').attr('id', "mapError").html("Your search returned:<span style ='color:darkblue;'> "+place.name+".  </span>We need precise locations to understand where people travel to and from. Please drag the marker to the precise location. Or use the search box to try another search.").fadeIn()
              );
              //hide confirm
               $('#confirmLoc').css('display', 'none');
              
               exception = true;
               //clear SEARCH data

              $('#ASEARCH_PLACE_MAP31').val(" ");
              $('#ASEARCH_ADDR_MAP31').val(" ");
              $('#ASEARCH_LAT_MAP31').val(" ");
              $('#ASEARCH_LON_MAP31').val(" ");

              
              
            }else{
              exception = false;
            }
           
             
          

         // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.setCenter(place.geometry.location);
            map.setZoom(15); 
            console.log(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);  // Why 17? Because it looks good.
          }
          // marker.setIcon(/** @type {google.maps.Icon} */({
          //   // url: place.icon,
          //   size: new google.maps.Size(71, 71),
          //   origin: new google.maps.Point(0, 0),
          //   anchor: new google.maps.Point(17, 34),
          //   scaledSize: new google.maps.Size(35, 35)
          // }));
          marker.setPosition(place.geometry.location);
          marker.setVisible(true);
          //show if it doesn't meet the exception
          if (exception == true){
          hideConf = true;
          }else{
          hideConf = false;
          }

          
          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

           if (place.types.indexOf('street_address')!==-1){
                infowindow.setContent('<div>' + place.formatted_address + '<span style="color:blue;"><br><strong> Drag marker to set new location</strong></span>');
                 infowindow.open(map, marker);
                //new thing
                $('#searchBoxResults').remove();

                 $('#confirmLoc').prepend(
                $('<p>').attr('id', "searchBoxResults").html("Your search returned: <span style ='color:darkblue;'>"+place.formatted_address+".  </span><br>If this is not correct, drag the marker to the precise location, or search again.").fadeIn()
              );
                  // blank out the place name if place is a searched address
                $('#ASEARCH_PLACE_MAP31').val(" ");

          }else{ 
               infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.formatted_address + '<span style="color:blue;"><br><strong> Drag marker to set new location</strong></span>');
                 infowindow.open(map, marker);
                //new thing
                $('#searchBoxResults').remove();

                 $('#confirmLoc').prepend(
                $('<p>').attr('id', "searchBoxResults").html("Your search returned:<span style ='color:darkblue;'> "+place.name+", "+place.formatted_address+".  </span><br>If this is not correct, drag the marker to the precise location, or search again.").fadeIn()
              );

                $('#ASEARCH_PLACE_MAP31').val(place.name);
          }
           // parse me a city!
          

           var arrAddress = place.address_components;
           var city ='';
            $.each(arrAddress, function (i, address_component) {
              
               if (address_component.types[0] == "locality"){
                  console.log("town:"+address_component.long_name);
                  city = address_component.long_name;
                }

            });
            console.log(city);
           

           // clear fields if filled with "drag marker" data
           $('#ADRAG_CITY_MAP31').val(" ");
           //------------------------------
           $('#ADRAG_ADDR_MAP31').val(" ");
           $('#ADRAG_LAT_MAP31').val(" ");
           $('#ADRAG_LON_MAP31').val(" ");
           // fill fields with new place
            //----------------------------
           $('#ASEARCH_CITY_MAP31').val(city);
           $('#ASEARCH_ADDR_MAP31').val(place.formatted_address);
           $('#ASEARCH_LAT_MAP31').val(marker.getPosition().lat());
           $('#ASEARCH_LON_MAP31').val(marker.getPosition().lng());
           //clear out the click data
           $('#ACLICK_CITY_MAP31').val(" ");
           $('#ACLICK_ADDR_MAP31').val(" ");
           $('#ACLICK_LAT_MAP31').val(" ");
           $('#ACLICK_LON_MAP31').val(" ");
           // add the search terms from the server
           $('#ASEARCHTYPE_MAP31').val(place.types.toString());
           // reveal confirm checkbox
           if (hideConf == true){
              $('#confirmLoc').css('display', 'none');
            }
            else{
              $('#confirmLoc').css('display', 'inline');
            }

        });
      

        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        function setupClickListener(id, types) {
          var radioButton = document.getElementById(id);
          radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
          });
        }

        setupClickListener('changetype-all', []);
        setupClickListener('changetype-address', ['address']);
        setupClickListener('changetype-establishment', ['establishment']);
        // setupClickListener('changetype-geocode', ['geocode']);
       
        google.maps.event.addListener(marker, 'dragend', function () {
                geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            infowindow.close();
                              if (language == "FR"){

                                infowindow.setContent('<div><strong>' + '<span style="color:blue;">Nouvel emplacement:</span>' + '</strong><br>' + results[0].formatted_address );

                              }else{

                                infowindow.setContent('<div><strong>' + '<span style="color:blue;">New Location:</span>' + '</strong><br>' + results[0].formatted_address );
                              };
                            infowindow.open(map, marker);
//----------------------------------------------------------------------------------parse addr city
                            var arrAddress = results[0].address_components;
                            $.each(arrAddress, function (i, address_component) {
                              if (address_component.types[0] == "locality"){
                              console.log("town:"+address_component.long_name);
                              city = address_component.long_name;
                             }
                            });
                             console.log(city);

                            $('#pac-input').val(" ");
                            $('#ADRAG_CITY_MAP31').val(city);
                            $('#ADRAG_ADDR_MAP31').val(results[0].formatted_address);
                            $('#ADRAG_LAT_MAP31').val(marker.getPosition().lat());
                            $('#ADRAG_LON_MAP31').val(marker.getPosition().lng());
                            //remove searchbox result message
                             $('#searchBoxResults').remove();
                            //remove error message
                            $('#mapError').remove();
                            //reveal confirm checkbox
                            $('#confirmLoc').css('display', 'inline');

                            console.log(marker.getPosition().lat());
                            console.log(marker.getPosition().lng());
                            console.log(results[0].formatted_address);
                            
                        }
                    }
                });
          });
        
      // the click and pan function

        function placeMarkerAndPanTo(latLng, map) {

          marker.setPosition(latLng);

          map.panTo(latLng);
        
          geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            
                            infowindow.close();
                            infowindow.setContent('<div><strong>' + '<span style="color:blue;">You clicked on:</span>' + '</strong><br>' + results[0].formatted_address + '<span style="color:green;"><br><strong> Drag marker to set new location</strong></span>');
                            infowindow.open(map, marker);
                            // remove results message
                            $('#searchBoxResults').remove();
                           
                            //clear out the error message
                            $('#mapError').remove();
                            //----------------------------------------------------------------------------------parse addr city
                            var arrAddress = results[0].address_components;
                            $.each(arrAddress, function (i, address_component) {
                              if (address_component.types[0] == "locality"){
                              console.log("town:"+address_component.long_name);
                              city = address_component.long_name;
                             }
                            });
                             console.log(city);


                            $('#pac-input').val(" ");
                            $('#ACLICK_ADDR_MAP31').val(results[0].formatted_address);
                            $('#ACLICK_CITY_MAP31').val(city);
                            $('#ACLICK_LAT_MAP31').val(marker.getPosition().lat());
                            $('#ACLICK_LON_MAP31').val(marker.getPosition().lng());
 
                            //CLEARS OUT ANY ORIGINAL SEARCH WHEN CLICKED
                            $('#ASEARCH_CITY_MAP31').val(" ");
                            $('#ASEARCH_PLACE_MAP31').val(" ");
                            $('#ASEARCH_ADDR_MAP31').val(" ");
                            $('#ASEARCH_LAT_MAP31').val(" ");
                            $('#ASEARCH_LON_MAP31').val(" ");

                            // clear fields if filled with "drag marker" data

                            $('#ADRAG_ADDR_MAP31').val(" ");
                            $('#ADRAG_LAT_MAP31').val(" ");
                            $('#ADRAG_LON_MAP31').val(" ");
                            $('#ADRAG_CITY_MAP11').val(" "); //new!!
                            //remove error message
                            $('#mapError').remove();
                            //reveal confirm checkbox
                            $('#confirmLoc').css('display', 'inline');

                            console.log(marker.getPosition().lat());
                            console.log(marker.getPosition().lng());
                            console.log(results[0].formatted_address);
                            
                        }
                    }
                });






        }


        // add marker on click -- event listener
        google.maps.event.addListener(map,'dblclick', function(e) {
        
          placeMarkerAndPanTo(e.latLng, map);

        });
        
      }