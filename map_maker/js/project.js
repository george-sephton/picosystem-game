function load_project_view() {

	/* Show project view elements */
	$( "#container #sidebar" ).css( "display", "none" );
	$( "#container #sidebar #sprite_list_toolbar_rename" ).css( "display", "none" );
	$( "#container #sidebar #sprite_list_toolbar_delete" ).css( "display", "none" );

	$( "#container #content" ).css( "max-width", "100%" );

	$( "#container #content #toolbar #upload_settings" ).css( "display", "none" );
	$( "#container #content #toolbar #settings" ).css( "display", "flex" );
	$( "#container #content #toolbar #settings #name_input_container" ).css( "display", "flex" );
	$( "#container #content #toolbar #settings #name_input_container #name_input" ).attr( "disabled", "disabled" );
	$( "#container #content #toolbar #settings #name_input_container #name_input" ).val( "" );

	$( "#container #content #toolbar #settings #controls" ).css( "display", "flex" );
	$( "#container #content #toolbar #settings #map_confirm" ).css( "display", "none" );

	$( "#container #content #toolbar #map_paint_preview" ).css( "display", "none" );
	$( "#container #content #toolbar #map_paint_settings" ).css( "display", "none" );
	$( "#container #content #toolbar #map_size_settings" ).css( "display", "none" );

	$( "#container #content #map_editor_container" ).css( "display", "none" );
	$( "#container #content #map_editor_container #map_editor" ).css( "display", "none" );
	$( "#container #content #map_editor_container #map_editor_loading" ).css( "display", "none" );

	$( "#container #content #map_list" ).css( "display", "flex" );
	$( "#container #content #project_upload" ).css( "display", "none" );

	/* Show project icons */
	$( ".project_functions" ).css( "display", "block" );
	$( ".map_editing_functions" ).css( "display", "none" );

	/* Load map list */
	load_map_list();

	/* Load project event listeners */
	project_toolbar_event_listeners();
}

function close_project_view() {

	/* Clear all event listeners */
	clear_map_list_event_listeners();
	clear_project_toolbar_event_listeners();
	clear_map_list_sortable();

	/* Clear project elements */
	$( "#container #content #map_list .sortable" ).html( "" );

}

function load_map_list() {

	/* Clear sprite list */
	$( "#map_list .sortable" ).html( "" );
	$( "#map_list .sortable li" ).css( "color", "#000" );

	/* Add project name */
	$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", decodeURI( project.name ) );
	
	if( project.maps.length != 0 ) {

	 	/* Sort maps into order */
		sort_maps_by_order();

		/* Add all the maps to the list */
		$.each( project.maps, function( key, value ) {
			$( "#map_list .sortable" ).append( '<li class="ui-state-default" map_id="' + value.id + '">' + value.order + ': ' + value.name + ' (' + value.id + ')</li>' );
		} );

		/* Add event listeners to the list */
		map_list_event_listeners();
	
		/* Add sorting capability */
		map_list_sortable();	
	}

	/* Set the icons */
	$( "#toolbar_new_group" ).css( "display", "block" );
	$( "#toolbar_new_sprite" ).css( "display", "none" );
	$( "#toolbar_back" ).css( "display", "none" );
	$( "#container #sidebar #sprite_list_toolbar #toolbar_right" ).css( "display", "none" );
}

function clear_map_list_event_listeners() {
	
	$( "#container #content #map_list .sortable li" ).unbind( "click" );
	$( "#container #content #map_list" ).unbind( "click" ); /* For click out - not implemented */
}

function map_list_event_listeners() {
	
	/* Remove existing event listeners */
	clear_map_list_event_listeners();

	/* Add onClick event listeners */
	$( "#container #content #map_list .sortable li" ).on( "click" , function( e ) {

		/* Set the map */
		var map_obj = project.maps.find( obj => obj.id == $( this ).attr( "map_id" ) );
		selected_map = map_obj;

		/* Close the project view */
		close_project_view();

		/* Open the map editor view */
		load_map_editing_view();		
	});
}

function clear_project_toolbar_event_listeners() {
	
	$( "#container #toolbar #settings #controls i" ).unbind( "click" );
	$( "#container #toolbar #settings #name_input_container #name_input" ).unbind( "keyup blur" );
}

function project_toolbar_event_listeners() {

	/* Remove all event listeners */
	clear_project_toolbar_event_listeners();

	/* Project toolbar event listener */
	$( "#container #toolbar #settings #controls i" ).on( "click", function() {

		var func = $( this ).attr( "func" );
		console.log( func );

		switch( func ) {
			case "new-map":
				
				/* Reset toolbar for a clean start */
				map_editor_toolbar_reset();

				/* Disable controls - don't hide the name input */
				disable_controls( false );

				$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", "Enter new map name" );
				$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "disabled", false );
				$( "#container #toolbar #settings #name_input_container #name_input" ).focus();

				/* Add event listeners */
				$( "#container #toolbar #settings #name_input_container #name_input" ).on( "keyup blur", function( e ) {

					/* Save the change */
					if( e.key == "Enter" ) {

						var map_name_value = $( this ).val();
						console.log( map_name_value );

						if( map_name_value != "" ) {

							/* Duplicate current map */
							new_map = new Object();
							
							/* Set the new name */
							new_map.name = map_name_value;

							/* Give it a blank canvas */
							var blank_tile = new Object();
							blank_tile.can_walk = [true, true, true, true];
							blank_tile.sprite_gid = undefined;
							blank_tile.sprite_id = undefined;
							blank_tile.sprite_reverse_x = false;
							blank_tile.sprite_reverse_y = false;
							blank_tile.exit_tile = false;
							blank_tile.exit_map_id = false;
							blank_tile.exit_map_dir = [0, 0];
							blank_tile.exit_map_pos = [0, 0];

							new_map.width = 8;
							new_map.height = 8;
							new_map.data = Array.from( { length: new_map.height }, () => Array.from( { length: new_map.width }, () => Object.assign( {}, blank_tile ) ) );

							/* Get new ID value */
							sort_maps_by_id();
							new_map.id = ( project.maps.length != 0 ) ? ( project.maps[project.maps.length - 1].id + 1 ) : 0;

							/* Get new order value */
							sort_maps_by_order();
							new_map.order = ( project.maps.length != 0 ) ? ( project.maps[project.maps.length - 1].order + 1 ) : 0;
							/* Note we sort by order 2nd so the array goes back to the correct order */

							console.log( new_map );

							/* Add the duplicated map to the array */
							project.maps.push( new_map );

							/* Close the project view */
							close_project_view();

							/* Open the map editor view */
							selected_map = project.maps.find( obj => obj.id == new_map.id );
							load_map_editing_view();
						}

						/* Re-enable controls */
						enable_controls();

						/* Remove event listeners */
						$( "#container #toolbar #settings #name_input_container #name_input" ).unbind( "keyup blur" );
					}

					/* Discard change */
					if( ( e.key == "Escape" ) || ( e.type == "blur" ) ) {

						/* Re-enable controls */
						enable_controls();

						/* Remove event listeners */
						$( "#container #toolbar #settings #name_input_container #name_input" ).unbind( "keyup blur" );
						
						/* Put things back the way they were */
						$( "#container #toolbar #settings #name_input_container #name_input" ).val( "" );
						$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", decodeURI( project.name ) );
						$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "disabled", "disabled" );
					}
				} );
				break;
			case "rename-project":
				
				/* Reset toolbar for a clean start */
				map_editor_toolbar_reset();

				/* Disable controls - don't hide the name input */
				disable_controls( false );

				$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", decodeURI( project.name ) );
				$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "disabled", false );
				$( "#container #toolbar #settings #name_input_container #name_input" ).focus();

				/* Add event listeners */
				$( "#container #toolbar #settings #name_input_container #name_input" ).on( "keyup blur", function( e ) {

					/* Save the change */
					if( e.key == "Enter" ) {

						var project_name_value = encodeURI( $( this ).val() );
						
						if( project_name_value != "" ) {
							project.name = project_name_value;
						}

						/* Re-enable controls */
						enable_controls();

						/* Remove event listeners */
						$( "#container #toolbar #settings #name_input_container #name_input" ).unbind( "keyup blur" );
						
						/* Put things back the way they were */
						$( "#container #toolbar #settings #name_input_container #name_input" ).val( "" );
						$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", decodeURI( project.name ) );
						$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "disabled", "disabled" );
					}
					/* Discard change */
					if( ( e.key == "Escape" ) || ( e.type == "blur" ) ) {

						/* Re-enable controls */
						enable_controls();

						/* Remove event listeners */
						$( "#container #toolbar #settings #name_input_container #name_input" ).unbind( "keyup blur" );
						
						/* Put things back the way they were */
						$( "#container #toolbar #settings #name_input_container #name_input" ).val( "" );
						$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", decodeURI( project.name ) );
						$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "disabled", "disabled" );
					}
				} );
				break;
			case "download":
				var blob = new Blob( [ JSON.stringify( project ) ], { type: "text/json" } );
				var file = document.createElement( "a" );
				file.download = project.name.toLowerCase().replace( / /g, "_" ) + ".json";
				file.href = window.URL.createObjectURL( blob );
				file.click();
				break;
			case "open":
				/* Disable controls */
					disable_controls();

					/* Show the confirmation prompt */
					$( "#container #toolbar #settings #map_confirm #map_confirm_prompt" ).html( "Would you like to close this project and open a new one?" );

					$( "#container #toolbar #settings #map_confirm input[type=button]" ).css( "display", "block" );
					$( "#container #toolbar #settings #map_confirm #map_done" ).css( "display", "none" );

					$( "#container #toolbar #settings #map_confirm" ).css( "display", "flex" );

					/* Add event listeners */
					$( "#container #toolbar #settings #map_confirm input[type=button]" ).on( "click" , function( e ) {
						
						if( $( this ).attr( "id" ) == "map_confirm_y" ) {

							$( "#container #content #toolbar #settings" ).css( "display", "none" );
							$( "#container #content #map_list" ).css( "display", "none" );
							$( "#container #content #toolbar #upload_settings" ).css( "display", "flex" );
							$( "#container #content #project_upload" ).css( "display", "flex" );

							/* Upload toolbar event listener */
							$( "#container #toolbar #upload_settings #upload_confirm #map_done" ).on( "click", function() {

								if( $( "#container #project_upload #upload_input" ).val() != "" ) {

									/* Convert JSON to object and set as the active project */
									try {
										var uploaded_project = JSON.parse( $( "#container #project_upload #upload_input" ).val() );
										project = uploaded_project;

										/* Clear the input */
										$( "#container #project_upload #upload_input" ).val( "" )

										/* Remove event listener */
										$( "#container #toolbar #upload_settings #upload_confirm #map_done" ).unbind( "click" );

										/* Re-enable controls */
										enable_controls();

										/* Load project view */
										load_project_view();
									} 
									catch( exc ) {
										/* Clear the input */
										$( "#container #project_upload #upload_input" ).val( "" )
									}									
								}

							} );

						} else if( $( this ).attr( "id" ) == "map_confirm_n" ) {
							
							/* Re-enable controls */
							enable_controls();
						}

						/* Remove event listeners */
						$( "#container #toolbar #settings #map_confirm input[type=button]" ).unbind( "click" );

						/* Hide the confirmation prompt */
						$( "#container #toolbar #settings #map_confirm #map_confirm_prompt" ).html( "" );

						$( "#container #toolbar #settings #map_confirm" ).css( "display", "none" );
					});
				break;
			case "export":
				export_data();
				break;
		}
	} );
}

function clear_map_list_sortable() {
	
	if ( $( "#map_list .sortable" ).hasClass( "ui-sortable" ) ) {
		$( "#map_list .sortable" ).sortable( "destroy" );
	}
	$( "#map_list .sortable" ).unbind( "sortstart" );
	$( "#map_list .sortable" ).unbind( "sortstop" );
	$( "#map_list .sortable" ).unbind( "selectstart" );
}

function map_list_sortable() {
	
	/* Destroy existing sortable list */
	clear_map_list_sortable();

	/* Turn map list into a sortable list */
	$( "#map_list .sortable" ).sortable( {
		placeholder: "ui-state-highlight",
		items: "li:not(.ui-state-disabled)",
		delay: 200
	} );
	$( "#map_list .sortable" ).disableSelection();

	/* Add sortable list event listeners */
	$( "#map_list .sortable" ).on( "sortstart", function( e, ui ) {

		/* Temporarily ignore onClick event listener */
		$( this ).css("pointer-events", "none");
	} );
	$( "#map_list .sortable" ).on( "sortstop", function( e, ui ) {
		/* Once drag and drop ends, save the new order */

		/* Create a new blank array that will temporarily hold the new order */
		var newOrderArray = new Array();

		/* Add each map object in order */
		var i = 0;

		/* We're sorting groups */
		$.each( $( "#map_list .sortable" ).children(), function( k, v ) {
			
			/* Get sprite objects in sort order */
			var map_obj = project.maps.find( obj => obj.id == $( v ).attr( "map_id" ) );

			/* Give it it's new order and increment */
			map_obj.order = i;
			i++;

			/* Add it to the temporary array */
			newOrderArray.push( map_obj );
		} );

		/* Set the new order in the local array */
		project.maps = newOrderArray;
					
		/* Reload sprite list */
		load_map_list();

		/* Re-instate onClick event listener */
		$( this ).css("pointer-events", "auto");
	} );
}

function sort_maps_by_order() {
	project.maps.sort( function( a, b ) {
		return ((a.order < b.order) ? -1 : ((a.order > b.order) ? 1 : 0));
	} );
}

function sort_maps_by_id() {
	
	project.maps.sort( function( a, b ) {
		return ((a.id < b.id) ? -1 : ((a.id > b.id) ? 1 : 0));
	} );
}