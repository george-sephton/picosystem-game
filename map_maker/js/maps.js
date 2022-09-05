function load_map_editing_view() {

	/* Show project view elements */
	$( "#container #sidebar" ).css( "display", "flex" );
	$( "#container #sidebar #texture_list_toolbar_rename" ).css( "display", "none" );
	$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "none" );

	$( "#container #content" ).css( "max-width", "calc(100vw - 430px)" );

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

	$( "#container #content #project_view #sprite_editor_container #sprite_editor" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_editor_container #sprite_editor_empty" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_editor_container #sprite_list_toolbar" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_editor_container #sprite_list_toolbar #toolbar_right" ).css( "display", "none" );

	$( "#container #content #project_view" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_editor_container" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_list_container" ).css( "display", "none" );
	$( "#container #content #project_view #map_list_container" ).css( "display", "none" );

	$( "#container #content #map_editor_container" ).css( "display", "flex" );
	$( "#container #content #map_editor_container #map_editor" ).css( "display", "none" );

	$( "#container #content #map_list" ).css( "display", "none" );
	$( "#container #content #project_upload" ).css( "display", "none" );

	/* Show project icons */
	$( ".project_functions" ).css( "display", "none" );
	$( ".map_editing_functions" ).css( "display", "block" );

	/* Set variables */
	selected_texture.texture = false;
	selected_texture.group = false;

	drawing_functions = false;
	controls_disabled = false;

	/* Load map editor */
	load_map_editor();

	/* Load texture list */
	load_texture_list();

	/* Load toolbar event listeners */
	map_toolbar_event_listeners();
	texture_toolbar_event_listeners();
}

function close_map_editing_view() {

	/* Clear all event listeners */
	clear_map_toolbar_event_listeners();
	clear_texture_toolbar_event_listeners();
	clear_texture_list_event_listeners();
	clear_map_editor_event_listeners();

	/* Disable sorting on texture list */
	clear_texture_list_sortable();

	/* Clear variables */
	selected_texture.texture = false;
	selected_texture.group = false;
	selected_map = false;
	drawing_functions = false;
	controls_disabled = false;

	/* Clear map editing elements */
	$( "#container #sidebar #texture_list .sortable" ).html( "" );
	$( "#container #content #map_editor_container #map_editor" ).html( "" );
}

function load_map_editor() {

	/* Change editor position */
	$( "#container #map_editor_container" ).css( "justify-content", "center" );
	$( "#container #map_editor_container" ).css( "align-items", "center" );

	/* Fill map name */
	$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", selected_map.name );

	/* Setup map editor */
	$( "#container #map_editor_container #map_editor" ).html( '<table id="map_editor_table"></table>' );

	/* Add map rows */
	var show_rows = controls_disabled ? map_resizing.new_height : selected_map.height;
	for(i=0; i<show_rows; i++)
		$( "#map_editor_table" ).append( '<tr row_id="' + i + '" class="map_editor_table_row"></tr>' );

	/* Add map cells for each row */
	var show_cols = controls_disabled ? map_resizing.new_width : selected_map.width;
	$( "#map_editor_table" ).children().each( function() {
		for(i=0; i<show_cols; i++)
			$( '<td col_id="'+i+'" class="map_editor_table_cell"></td>' ).appendTo( $(this) );
	} );

	/* Add texture to each cell */
	$( "#map_editor_table tr td" ).each( function() {
		
		/* Store tile information */
		var tile_info = new Object();
		tile_info.row = $( this ).parent().attr( "row_id" );
		tile_info.col = $( this ).attr( "col_id" );

		/* Get the texture flip info */
		if( ( tile_info.col >= selected_map.width ) || ( tile_info.row >= selected_map.height ) ) {
			tile_info.texture_reverse_x = false;
			tile_info.texture_reverse_y = false;
		} else {
			tile_info.texture_reverse_x = selected_map.data[tile_info.row][tile_info.col].texture_reverse_x;
			tile_info.texture_reverse_y = selected_map.data[tile_info.row][tile_info.col].texture_reverse_y;
		}

		/* If we are looking for a newly added row, outside of the exisiting map bounds, return an empty tile */
		if( ( tile_info.col >= selected_map.width ) || ( tile_info.row >= selected_map.height ) ) tile_info.texture_gid = undefined;
		else tile_info.texture_gid = selected_map.data[tile_info.row][tile_info.col].texture_gid;
		/* If we are looking for a newly added column, outside of the exisiting map bounds, return an empty tile */
		if( ( tile_info.col >= selected_map.width ) || ( tile_info.row >= selected_map.height ) ) tile_info.texture_gid = undefined;
		else tile_info.texture_id = selected_map.data[tile_info.row][tile_info.col].texture_id;
		
		var texture_obj = undefined;
		/* Get the texture */
		if( ( tile_info.texture_gid != undefined ) && ( tile_info.texture_id != undefined ) ) {
			var group_obj = project.textures.find( obj => obj.gid == tile_info.texture_gid );
			if( group_obj != undefined ) {
				texture_obj = group_obj.textures.find( obj => obj.id == tile_info.texture_id );
			} else {
				texture_obj = undefined;
			}
		}
		
		if( texture_obj == undefined ) {
			$( this ).css( "background", "#ccc" );
		} else {

			/* Whilst resizing, don't render the texture */
			if(controls_disabled == true) {	
				$( this ).css( "background", "#327da8" );
			} else {
				/* Add the texture table */
				$( this ).html( '<table class="texture_table"></table>' );

				/* Add 8 rows */
				for(i=0; i<8; i++)
					$( this ).find( ".texture_table" ).append( '<tr row_id="' + i + '"></tr>' );

				/* Add 8 cells for each row */
				$( this ).find( ".texture_table tr" ).each( function() {
					for(i=0; i<8; i++) {
							
						/* Draw texture */
						var row_sel = $( this ).attr( "row_id" );
						var col_sel = i;

						if( tile_info.texture_reverse_y == true ) {
							/* Flip vertically */
							row_sel = 7 - ( $( this ).attr( "row_id" ) );
						}
						if( tile_info.texture_reverse_x == true ) {
							/* Flip horizontally */
							col_sel = 7 - i;
						}

						if( texture_obj.data[col_sel][row_sel] != "" ) 
							$( '<td col_id="'+i+'"></td>' ).appendTo( $(this) ).css( "background", "#" + texture_obj.data[col_sel][row_sel] );
						else
							$( '<td col_id="'+i+'"></td>' ).appendTo( $(this) ).css( "background", "#ccc" );	
					}
				} );

				/* Clear all borders first */
				$( this ).find( ".texture_table" ).css( "border-top", "0" );
				$( this ).find( ".texture_table" ).css( "border-right", "0" );
				$( this ).find( ".texture_table" ).css( "border-bottom", "0" );
				$( this ).find( ".texture_table" ).css( "border-left", "0" );
				$( this ).find( ".texture_table" ).css( "border", "0" );

				/* Update CSS based on can_walk */
				if( !selected_map.data[tile_info.row][tile_info.col].can_walk[0] ) $( this ).find( ".texture_table" ).css( "border-top", "3px solid #f00" );
				if( !selected_map.data[tile_info.row][tile_info.col].can_walk[1] ) $( this ).find( ".texture_table" ).css( "border-right", "3px solid #f00" );
				if( !selected_map.data[tile_info.row][tile_info.col].can_walk[2] ) $( this ).find( ".texture_table" ).css( "border-bottom", "3px solid #f00" );
				if( !selected_map.data[tile_info.row][tile_info.col].can_walk[3] ) $( this ).find( ".texture_table" ).css( "border-left", "3px solid #f00" );

				if( selected_map.data[tile_info.row][tile_info.col].exit_tile ) {
					/* Update CSS for exit tiles */
					switch( selected_map.data[tile_info.row][tile_info.col].exit_map_dir.join() ) {
						case "0,0":  /* Exit any direction */
							$( this ).find( ".texture_table" ).css( "border", "3px solid #ff0" );
							break;
						case "0,1": /* Exit when walking north */
							$( this ).find( ".texture_table" ).css( "border-top", "3px solid #ff0" );
							break;
						case "1,0": /* Exit when walking east */
							$( this ).find( ".texture_table" ).css( "border-right", "3px solid #ff0" );
							break;
						case "0,-1": /* Exit when walking south */
							$( this ).find( ".texture_table" ).css( "border-bottom", "3px solid #ff0" );
							break;
						case "-1,0": /* Exit when walking west */
							$( this ).find( ".texture_table" ).css( "border-left", "3px solid #ff0" );
							break;
					}
				}
			}
		}
		
	} );

	/* Show map editor */
	$( "#container #map_editor_container #map_editor" ).css( "display", "flex" );

	/* Change editor position */
	$( "#container #map_editor_container" ).css( "justify-content", "flex-start" );
	$( "#container #map_editor_container" ).css( "align-items", "flex-start" );

	/* Set zoom level on load */
	$( "#map_editor_table .map_editor_table_row .map_editor_table_cell" ).css( "min-width", (map_cell_size * 5)+"px" );
	$( "#map_editor_table .map_editor_table_row .map_editor_table_cell" ).css( "height", (map_cell_size * 5)+"px" );
}

function map_editor_toolbar_reset() {
	
	/* Deselect the paint/erase tool */
	$( "#map_toolbar_info" ).removeClass( "selected_tool" );
	$( "#map_toolbar_paint" ).removeClass( "selected_tool" );
	$( "#map_toolbar_erase" ).removeClass( "selected_tool" );

	/* Remove restrictions on texture panel */
	$( "#container #sidebar #texture_list_toolbar i" ).removeClass( "resize_disabled" );
	$( "#container #sidebar #texture_list .sortable li" ).removeClass( "resize_disabled" );
	/* Re-enable colour picker */
	$( ".sprite_picker" ).removeClass( "auto_cursor" );
	$( ".texture_picker" ).removeClass( "auto_cursor" );

	$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).val( "" );
	$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).css( "background", "#fff" );
	$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).val( "" );
	$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).css( "background", "#fff" );

	/* Re-add sorting to the texture list */
	texture_list_sortable();

	/* Hide the tile settings */
	$( "#container #toolbar #map_paint_settings" ).css( "display", "none" );
	
	/* Remove event listener from map editor */
	clear_map_editor_event_listeners();

	/* Remove hover functionality from map editor */
	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell" ).removeClass( "map_editor_table_cell_draw" );

	/* Trigger changes to update UI */
	$( "#exit_tile_en" ).prop( "checked", false );
	$( "#exit_tile_en" ).trigger( "change" );

	/* Reset preview panel */
	$( "#container #toolbar #map_paint_preview table" ).css( "border", "2px solid #000" );

	/* Re-show flip icons and texture preview */
	if( selected_texture.texture != false ) {
		$( "#map_toolbar_flip_h" ).css( "display", "block" );
		$( "#map_toolbar_flip_v" ).css( "display", "block" );
		$( "#map_paint_preview" ).css( "display", "block" );
	} else {
		$( "#map_toolbar_flip_h" ).css( "display", "none" );
		$( "#map_toolbar_flip_v" ).css( "display", "none" );
		$( "#map_paint_preview" ).css( "display", "none" );
	}
}

function clear_map_toolbar_event_listeners() {
	
	$( "#container #toolbar #settings #controls i" ).unbind( "click" );
}

function map_toolbar_event_listeners() {
	
	/* Remove all event listeners */
	clear_map_toolbar_event_listeners();

	/* Map toolbar event listeners */
	$( "#container #toolbar #settings #controls i" ).click(function() {
		
		/* Check if functions are disabled */
		if( controls_disabled == false ) {

			var func = $( this ).attr( "func" );
			
			/* Hide delete confirmation prompt and show the toolbar */
			$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "none" );
			$( "#container #sidebar #texture_list_toolbar" ).css( "display", "flex" );

			if( ( func != "paint") && ( func != "erase" ) && ( func != "zoom-in" ) && ( func != "zoom-out" ) && ( func != "flip-v" ) && ( func != "flip-h" ) && ( drawing_functions != false ) ) {
								
				/* We are moving to another function whilst painting/erasing, reset everything */
				map_editor_toolbar_reset();

				/* Disable drawing functions */
				drawing_functions = false;
			}

			switch( func ) {
				case "close-map":

					/* Clear map editing content */
					close_map_editing_view();
					
					/* Load project view */
					load_project_view();

					break;
				case "rename-map":
				case "duplicate-map":

					/* Reset toolbar for a clean start */
					map_editor_toolbar_reset();

					/* Disable controls - don't hide the name input */
					disable_controls( false );
					
					/* Focus on name input */
					if( func == "rename-map" ) {
						$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", selected_map.name );
					} else {
						$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", "Enter new map name" );
					}
					$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "disabled", false );
					$( "#container #toolbar #settings #name_input_container #name_input" ).focus();

					/* Add event listeners */
					$( "#container #toolbar #settings #name_input_container #name_input" ).on( "keyup blur", function( e ) {

						/* Save the change */
						if( e.key == "Enter" ) {

							var map_name_value = sanitise_input( $( this ).val() );

							if( func == "rename-map" ) {
								if( ( map_name_value != "" ) && (map_name_value != selected_map.name ) ) {
									
									/* Change the map name */
									selected_map.name = map_name_value;
								}
							} else {
								if( map_name_value != "" ) {

									/* Duplicate current map */
									new_map = new Object();
									$.extend( true, new_map, selected_map ); /* Clone array */

									/* Set the new name */
									new_map.name = map_name_value;

									/* Get new ID value */
									sort_maps_by_id();
									new_map.id = project.maps[project.maps.length - 1].id + 1;

									/* Get new order value */
									sort_maps_by_order();
									new_map.order = project.maps[project.maps.length - 1].order + 1;
									/* Note we sort by order 2nd so the array goes back to the correct order */

									/* Add the duplicated map to the array */
									project.maps.push( new_map );

									/* Reload map editor */
									close_map_editing_view();
									selected_map = project.maps.find( obj => obj.id == new_map.id );
									load_map_editing_view();
								}
							}

							/* Re-enable controls */
							enable_controls();

							/* Remove event listeners */
							$( "#container #toolbar #settings #name_input_container #name_input" ).unbind( "keyup blur" );
							
							/* Put things back the way they were */
							$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "disabled", "disabled" );
							$( "#container #toolbar #settings #name_input_container #name_input" ).val( "" );
							$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", selected_map.name );
						}

						/* Discard change */
						if( ( e.key == "Escape" ) || ( e.type == "blur" ) ) {

							/* Re-enable controls */
							enable_controls();

							/* Remove event listeners */
							$( "#container #toolbar #settings #name_input_container #name_input" ).unbind( "keyup blur" );
							
							/* Put things back the way they were */
							$( "#container #toolbar #settings #name_input_container #name_input" ).val( "" );
							$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", selected_map.name );
							$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "disabled", "disabled" );
						}
					} );
					break;
				case "trash-map":

					/* Disable controls */
					disable_controls();

					/* Show the confirmation prompt */
					$( "#container #toolbar #settings #map_confirm #map_confirm_prompt" ).html( "Are you sure you want to delete this map?" );

					$( "#container #toolbar #settings #map_confirm input[type=button]" ).css( "display", "block" );
					$( "#container #toolbar #settings #map_confirm #map_done" ).css( "display", "none" );

					$( "#container #toolbar #settings #map_confirm" ).css( "display", "flex" );

					/* Add event listeners */
					$( "#container #toolbar #settings #map_confirm input[type=button]" ).on( "click" , function( e ) {
						
						if( $( this ).attr( "id" ) == "map_confirm_y" ) {

							/* Delete current map from local array */
							project.maps = project.maps.filter(obj => obj.id != selected_map.id);

							/* Reorder the groups in local array */
							var i = 0;
							$.each( project.maps, function( k, v ) {

								/* Give it it's new order and increment */
								v.order = i;
								i++;
							} );
							
							/* Re-enable controls */
							enable_controls();

							/* Clear map editing content */
							close_map_editing_view();

							/* Load project view */
							load_project_view();

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
				case "paint":
				case "erase":

					/* Reset toolbar for a clean start */
					map_editor_toolbar_reset();
					
					/* Tool selection behaviour */
					if( ( func == "paint" ) && (drawing_functions != 1) ) {
						/* Switch to map painting */
						drawing_functions = 1;
						map_editor_start_drawing();

						/* Highlight the paintbrush icon */
						$( "#map_toolbar_paint" ).addClass( "selected_tool" );

						/* Update preview and tile settings panel */
						selected_texture.can_walk = [true, true, true, true];
						selected_texture.exit_tile = false;
						selected_texture.exit_map_id = false;
						selected_texture.exit_map_dir = [0, 0];
						selected_texture.exit_map_pos = [0, 0];

						$( "#container #toolbar #map_paint_settings" ).css( "display", "flex" );
						load_texture_preview();

						/* Disable groups in texture list */
						$( "#container #sidebar #texture_list .sortable .ui-group" ).addClass( "resize_disabled" );
					} else if( ( func == "erase" ) && (drawing_functions != 2) ) {
						/* Switch to map erasing */
						drawing_functions = 2;
						map_editor_start_drawing();

						/* Highlight the eraser icon */
						$( "#map_toolbar_erase" ).addClass( "selected_tool" );

						/* Hide the flip icons and preview since we aren't painting these */
						$( "#map_toolbar_flip_h" ).css( "display", "none" );
						$( "#map_toolbar_flip_v" ).css( "display", "none" );
						$( "#map_paint_preview" ).css( "display", "none" );

						/* Disable everything in texture list */
						$( "#container #sidebar #texture_list .sortable li" ).addClass( "resize_disabled" );
					} else {
						/* Disable all drawing functions */				
						drawing_functions = false;
					}

					/* Load map editor event listeners */
					map_editor_event_listeners();
					break;
				case "fill":
				case "clear":

					/* Disable controls */
					disable_controls();
					
					/* Show the confirmation prompt */
					if( func == "clear") $( "#container #toolbar #settings #map_confirm #map_confirm_prompt" ).html( "Clear the whole map?" );
					else $( "#container #toolbar #settings #map_confirm #map_confirm_prompt" ).html( "Paint the whole map?" );

					$( "#container #toolbar #settings #map_confirm input[type=button]" ).css( "display", "block" );
					$( "#container #toolbar #settings #map_confirm #map_done" ).css( "display", "none" );

					$( "#container #toolbar #settings #map_confirm" ).css( "display", "flex" );

					/* Add event listeners */
					$( "#container #toolbar #settings #map_confirm input[type=button]" ).on( "click" , function( e ) {
						
						if( $( this ).attr( "id" ) == "map_confirm_y" ) {
							/* Fill her up! */

							/* Create tile info */
							var fill_tile = new Object();
							fill_tile.can_walk = [true, true, true, true];
							if( func == "clear" ) {
								fill_tile.texture_gid = undefined;
								fill_tile.texture_id = undefined;
								fill_tile.texture_reverse_x = false;
								fill_tile.texture_reverse_y = false;
							} else {
								fill_tile.texture_gid = selected_texture.group.gid;
								fill_tile.texture_id = selected_texture.texture.id;
								fill_tile.texture_reverse_x = selected_texture.texture_reverse_x;
								fill_tile.texture_reverse_y = selected_texture.texture_reverse_y;
							}
							fill_tile.exit_tile = false;
							fill_tile.exit_map_id = false;
							fill_tile.exit_map_dir = [0, 0];
							fill_tile.exit_map_pos = [0, 0];

							/* Fill the map */
							selected_map.data = Array.from( { length: selected_map.height }, () => Array.from( { length: selected_map.width }, () => Object.assign( {}, fill_tile ) ) );

							/* Re-enable controls */
							enable_controls();

							/* Reload the map editor */
							load_map_editor();
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
				case "resize-canvas":

					if( controls_disabled == false ) {
						
						/* Enable resizing mode */
						map_resizing.new_width = selected_map.width;
						map_resizing.new_height = selected_map.height;

						/* Disable controls */
						disable_controls();

						/* Show the resizing controls */
						$( "#container #toolbar #map_size_settings" ).css( "display", "flex" );
						$( "#container #toolbar #map_size_settings #cols #map_cols" ).val( map_resizing.new_width );
						$( "#container #toolbar #map_size_settings #rows #map_rows" ).val( map_resizing.new_height );

						/* Show the warning prompt */
						$( "#container #toolbar #settings #map_confirm #map_confirm_prompt" ).html( "Note: resizing will delete filled tiles" );
						$( "#container #toolbar #settings #map_confirm input[type=button]" ).css( "display", "none" );
						$( "#container #toolbar #settings #map_confirm #map_done" ).css( "display", "block" );
						$( "#container #toolbar #settings #map_confirm" ).css( "display", "flex" );
						
						/* Add event listener for "Done" button */
						$( "#container #toolbar #settings #map_confirm #map_done" ).on( "click" , function( e ) {

							/* Re-enable controls */
							enable_controls();

							/* Hide the resizing controls */
							$( "#container #toolbar #map_size_settings" ).css( "display", "none" );

							/* Hide the warning prompt */
							$( "#container #toolbar #settings #map_confirm #map_confirm_prompt" ).html( "" );
							$( "#container #toolbar #settings #map_confirm" ).css( "display", "none" );

							/* Remove event listeners */
							$( "#container #toolbar #settings #map_confirm input[type=button]" ).unbind( "click" );
							
							/* Remove event listeners for the controls */
							$( "#container #toolbar #map_size_settings #cols #map_cols" ).unbind( "click" );
							$( "#container #toolbar #map_size_settings #cols #map_rows" ).unbind( "click" );

							/* Now create a new map, start with all blank tiles */
							var blank_tile = new Object();
							blank_tile.can_walk = [true, true, true, true];
							blank_tile.texture_gid = undefined;
							blank_tile.texture_id = undefined;
							blank_tile.texture_reverse_x = false;
							blank_tile.texture_reverse_y = false;
							blank_tile.exit_tile = false;
							blank_tile.exit_map_id = false;
							blank_tile.exit_map_dir = [0, 0];
							blank_tile.exit_map_pos = [0, 0];

							/* Fill a temporary array with our blank tiles */
							temporary_map = Array.from( { length: map_resizing.new_height }, () => Array.from( { length: map_resizing.new_width }, () => Object.assign( {}, blank_tile ) ) );
							
							/* Loop through each row and column and copy to the temporary array */
							for( i = 0; i < ( ( map_resizing.new_height > selected_map.height ) ? ( selected_map.height ) : (map_resizing.new_height) ); i++ ) {
								for( j = 0; j < ( ( map_resizing.new_width > selected_map.width ) ? ( selected_map.width ) : (map_resizing.new_width) ); j++ ) {
									temporary_map[i][j] = selected_map.data[i][j];

								}
							}

							/* Copy to the local array */
							selected_map.width = map_resizing.new_width;
							selected_map.height = map_resizing.new_height;
							selected_map.data = temporary_map;

							/* Reload map editor */
							load_map_editor();
						} );

						/* Add event listeners for the controls */
						$( "#container #toolbar #map_size_settings #cols #map_cols" ).on( "change" , function( e ) {
							/* Columns change */
							var set_cols = parseInt( $( "#container #toolbar #map_size_settings #cols #map_cols" ).val() );

							if( ( set_cols >= 3 ) && ( set_cols <= 40 ) ) {
								map_resizing.new_width = set_cols;
								load_map_editor();
							}
						} );

						$( "#container #toolbar #map_size_settings #rows #map_rows" ).on( "change" , function( e ) {
							/* Rows change */
							var set_rows = parseInt( $( "#container #toolbar #map_size_settings #rows #map_rows" ).val() );
							
							if( ( set_rows >= 3 ) && ( set_rows <= 40 ) ) {
								map_resizing.new_height = set_rows;
								load_map_editor();
							}
						} );
					}
					break;
				case "flip-h":
					selected_texture.texture_reverse_y = !selected_texture.texture_reverse_y;
					/* Reload preview */
					load_texture_preview();
					break
				case "flip-v":
					selected_texture.texture_reverse_x = !selected_texture.texture_reverse_x;
					/* Reload preview */
					load_texture_preview();
					break;
				case "zoom-in":
				case "zoom-out":
					
					if( ( map_cell_size < 18 ) && ( func == "zoom-in" ) ){
						map_cell_size +=2;
					}
					
					if( ( map_cell_size > 4 ) && ( func == "zoom-out" ) ){
						map_cell_size -=2;
					}

					$( "#map_editor_table .map_editor_table_row .map_editor_table_cell" ).css( "min-width", (map_cell_size * 5)+"px" );
					$( "#map_editor_table .map_editor_table_row .map_editor_table_cell" ).css( "height", (map_cell_size * 5)+"px" );
					break;
			}
		}

	});

	/* Remove all event listeners */
	$( "#container #toolbar #map_paint_settings" ).unbind( "keyup change" );

	/* Map toolbar event listeners */
	$( "#container #toolbar #map_paint_settings" ).on( "keyup change", function( e ) {
		
		/* Functions disabled whilst map is being re-sized */
		if( controls_disabled == false ) {
			
			var element = $( e.target );

			switch( element.attr( "id" ) ) {
				case "exit_tile_en":
					/* Enable/Disable exit tile */
					if( element.prop( "checked" ) ) {
						/* Exit tile enabled */
						selected_texture.exit_tile = true;
						selected_texture.exit_map_dir = [0, 0];
						selected_texture.exit_map_pos = [0, 0];

						/* Clear the position fields */
						$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).val( "" );
						$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).css( "background", "#fff" );
						$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).val( "" );
						$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).css( "background", "#fff" );

						/* Fill the map list, but clear it first */
						$( "#exit_tile_map_id" ).empty();

						/* Sort the maps in order and then add them */
						sort_maps_by_order();
						$.each( project.maps, function( key, value ) {
							$( "#exit_tile_map_id" ).append( '<option value="' + value.id + '">' + value.name + '</option>' );
						} );

						/* Select the first map as the exit map id, just in case it isn't changed */
						selected_texture.exit_map_id = project.maps[0].id;
					} else {
						/* Exit tile disabled */
						selected_texture.exit_tile = false;
						selected_texture.can_walk = [true, true, true, true];

						$( "#exit_tile_map_id" ).empty();
					}
					break;
				case "exit_tile_n":
					/* Updated tile direction N */
					if( !element.prop( "checked" ) ) {
						selected_texture.can_walk[0] = false;
					} else {
						selected_texture.can_walk[0] = true;
					}
					break;
				case "exit_tile_e":
					/* Updated tile direction E */
					if( !element.prop( "checked" ) ) {
						selected_texture.can_walk[1] = false;
					} else {
						selected_texture.can_walk[1] = true;
					}
					break;
				case "exit_tile_s":
					/* Updated tile direction S */
					if( !element.prop( "checked" ) ) {
						selected_texture.can_walk[2] = false;
					} else {
						selected_texture.can_walk[2] = true;
					}
					break;
				case "exit_tile_w":
					/* Updated tile direction W */
					if( !element.prop( "checked" ) ) {
						selected_texture.can_walk[3] = false;
					} else {
						selected_texture.can_walk[3] = true;
					}
					break;
				case "exit_tile_map_dir":
					switch( element.val() ) {
						case "n": /* Exit when walking north */
							selected_texture.exit_map_dir = [0, 1];
							break;
						case "e": /* Exit when walking east */
							selected_texture.exit_map_dir = [1, 0];
							break;
						case "s": /* Exit when walking south */
							selected_texture.exit_map_dir = [0, -1];
							break;
						case "w": /* Exit when walking west */
							selected_texture.exit_map_dir = [-1, 0];
							break;
						default:  /* Exit any direction */
							selected_texture.exit_map_dir = [0, 0];
							break;
					}
					break;
				case "exit_tile_map_id":
					selected_texture.exit_map_id = element.val();
					break;
				case "exit_tile_map_pos_x":

					if( parseInt( element.val() ) ){

						/* They entered a number, let's check it isn't out of bounds */
						var exit_tile_pos_x = parseInt( element.val() );

						var exit_map = project.maps.find( obj => obj.id == selected_texture.exit_map_id );
						if( ( exit_tile_pos_x >= 0 ) && ( exit_tile_pos_x < exit_map.width ) ) {
							/* Position is within bounds */
							element.css( "background", "#fff" );
						} else {
							/* Show an error */
							element.css( "background", "#e8736b" );
						}
						selected_texture.exit_map_pos[0] = exit_tile_pos_x;
						
					} else {

						/* They didn't enter a number, let's correct that */
						selected_texture.exit_map_pos[0] = 0;

						/* Don't alter anything if the field is empty */
						if( element.val() != "" ) {
							element.val( "0" );
						}
					}
					
					break;
				case "exit_tile_map_pos_y":

					if( parseInt( element.val() ) ){

						/* They entered a number, let's check it isn't out of bounds */
						var exit_tile_pos_y = parseInt( element.val() );

						var exit_map = project.maps.find( obj => obj.id == selected_texture.exit_map_id );
						if( ( exit_tile_pos_y >= 0 ) && ( exit_tile_pos_y < exit_map.height ) ) {
							/* Position is within bounds */
							element.css( "background", "#fff" );
						} else {
							/* Show an error */
							element.css( "background", "#e8736b" );
						}
						selected_texture.exit_map_pos[1] = exit_tile_pos_y;
						
					} else {

						/* They didn't enter a number, let's correct that */
						selected_texture.exit_map_pos[1] = 0;

						/* Don't alter anything if the field is empty */
						if( element.val() != "" ) {
							element.val( "0" );
						}
					}
					break;
			}

			/* Reload the tile settings */
			set_map_tile_settings_styles( true );
		}
	} );
}

function map_editor_start_drawing() {
	
	/* Disable texture list toolbar */
	$( "#container #sidebar #texture_list_toolbar i" ).addClass( "resize_disabled" );
	
	/* Disable colour picker */
	$( ".sprite_picker" ).addClass( "auto_cursor" );
	$( ".texture_picker" ).addClass( "auto_cursor" );

	/* Disable sorting on texture list */
	clear_texture_list_sortable();

	/* Add hover functionality to map editor */
	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell" ).addClass( "map_editor_table_cell_draw" );
}

function clear_map_editor_event_listeners() {
	
	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell_draw" ).unbind( "click" );
	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell_draw" ).unbind( "contextmenu" );
}

function map_editor_event_listeners() {

	/* Remove existing event listeners from map editor */
	clear_map_editor_event_listeners();

	/* Add map editor event listeners */
	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell_draw" ).on( "click" , function( e ) {

		/* Store tile information */
		var tile_info = new Object();
		tile_info.row = $( this ).parent().attr( "row_id" );
		tile_info.col = $( this ).attr( "col_id" );

		if( drawing_functions == 2 ) { /* Clear */
			/* Clear the cell */
			$( this ).html( "" );
			$( this ).css( "background", "#ccc" );

			/* Update the local array */
			selected_map.data[tile_info.row][tile_info.col].texture_gid = undefined;
			selected_map.data[tile_info.row][tile_info.col].texture_id = undefined;
			selected_map.data[tile_info.row][tile_info.col].texture_reverse_x = false;
			selected_map.data[tile_info.row][tile_info.col].texture_reverse_y = false;
			selected_map.data[tile_info.row][tile_info.col].can_walk = [false, false, false, false];
			selected_map.data[tile_info.row][tile_info.col].exit_map_id = false;
			selected_map.data[tile_info.row][tile_info.col].exit_map_dir = [0, 0];
			selected_map.data[tile_info.row][tile_info.col].exit_map_pos = [0, 0];

		} else if( drawing_functions == 1 ) { /* Paint */

			/* Draw in the cell */
			$( this ).html( '<table class="texture_table"></table>' );

			/* Add 8 rows */
			for(i=0; i<8; i++)
				$( this ).find( ".texture_table" ).append( '<tr row_id="' + i + '"></tr>' );

			/* Add 8 cells for each row */
			$( this ).find( ".texture_table tr" ).each( function() {
				for(i=0; i<8; i++) {
						
					/* Draw texture */
					var row_sel = $( this ).attr( "row_id" );
					var col_sel = i;

					if( selected_texture.texture_reverse_y == true ) {
						/* Flip vertically */
						row_sel = 7 - ( $( this ).attr( "row_id" ) );
					}
					if( selected_texture.texture_reverse_x == true ) {
						/* Flip horizontally */
						col_sel = 7 - i;
					}

					$( '<td col_id="'+i+'"></td>' ).appendTo( $(this) ).css( "background", "#" + selected_texture.texture.data[col_sel][row_sel] );	
				}
			} );

			if( selected_texture.exit_tile ) {

				/* We're setting an exit tile */
				selected_texture.exit_tile = true;
				selected_texture.exit_map_id = $( "#container #toolbar #map_paint_settings #exit_tile_map_id" ).val();
				selected_texture.exit_map_dir = [ parseInt( $( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).val() ), parseInt( $( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).val() ) ];
				
				switch( $( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val() ) {
					case "a":  /* Exit any direction */
						selected_texture.exit_map_dir = [0, 0];
						$( this ).find( ".texture_table" ).css( "border", "3px solid #ff0" );
						break;
					case "n": /* Exit when walking north */
						$( this ).find( ".texture_table" ).css( "border-top", "3px solid #ff0" );
						selected_texture.exit_map_dir = [0, 1];
						break;
					case "e": /* Exit when walking east */
						$( this ).find( ".texture_table" ).css( "border-right", "3px solid #ff0" );
						selected_texture.exit_map_dir = [1, 0];
						break;
					case "s": /* Exit when walking south */
						$( this ).find( ".texture_table" ).css( "border-bottom", "3px solid #ff0" );
						selected_texture.exit_map_dir = [0, -1];
						break;
					case "w": /* Exit when walking west */
						$( this ).find( ".texture_table" ).css( "border-left", "3px solid #ff0" );
						selected_texture.exit_map_dir = [-1, 0];
						break;
				}

			} else {
				/* Update CSS based on can_walk */
				if(!selected_texture.can_walk[0]) $( this ).find( ".texture_table" ).css( "border-top", "3px solid #f00" );
				if(!selected_texture.can_walk[1]) $( this ).find( ".texture_table" ).css( "border-right", "3px solid #f00" );
				if(!selected_texture.can_walk[2]) $( this ).find( ".texture_table" ).css( "border-bottom", "3px solid #f00" );
				if(!selected_texture.can_walk[3]) $( this ).find( ".texture_table" ).css( "border-left", "3px solid #f00" );

				/* Update selected tile data */
				selected_texture.exit_map_id = false;
				selected_texture.exit_map_dir = [0, 0];
				selected_texture.exit_map_pos = [0, 0];
			}

			/* Update the local array */
			selected_map.data[tile_info.row][tile_info.col].texture_gid = selected_texture.group.gid;
			selected_map.data[tile_info.row][tile_info.col].texture_id = selected_texture.texture.id;

			selected_map.data[tile_info.row][tile_info.col].texture_reverse_x = selected_texture.texture_reverse_x;
			selected_map.data[tile_info.row][tile_info.col].texture_reverse_y = selected_texture.texture_reverse_y;

			selected_map.data[tile_info.row][tile_info.col].exit_tile = selected_texture.exit_tile;
			selected_map.data[tile_info.row][tile_info.col].exit_map_id = selected_texture.exit_map_id;

			selected_map.data[tile_info.row][tile_info.col].can_walk = new Array();
			$.extend( true, selected_map.data[tile_info.row][tile_info.col].can_walk, selected_texture.can_walk ); /* Clone array */
			selected_map.data[tile_info.row][tile_info.col].exit_map_dir = new Array();
			$.extend( true, selected_map.data[tile_info.row][tile_info.col].exit_map_dir, selected_texture.exit_map_dir ); /* Clone array */
			selected_map.data[tile_info.row][tile_info.col].exit_map_pos = new Array();
			$.extend( true, selected_map.data[tile_info.row][tile_info.col].exit_map_pos, selected_texture.exit_map_pos ); /* Clone array */

		} else {
			/* Get texture info */
			var cell_texture_gid = selected_map.data[tile_info.row][tile_info.col].texture_gid;
			var cell_texture_id = selected_map.data[tile_info.row][tile_info.col].texture_id;

			if( cell_texture_gid != undefined ) {
				/* If we have a texture to examine, load the info */
				display_tile_info( tile_info.row, tile_info.col );
			}
		}
	} );

	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell_draw" ).on( "contextmenu" , function( e ) {

		if( drawing_functions == 1 ) {

			/* Get tile information */
			var tile_info = new Object();
			tile_info.row = $( this ).parent().attr( "row_id" );
			tile_info.col = $( this ).attr( "col_id" );

			/* Get texture info */
			var cell_texture_gid = selected_map.data[tile_info.row][tile_info.col].texture_gid;
			var cell_texture_id = selected_map.data[tile_info.row][tile_info.col].texture_id;

			if( cell_texture_gid != undefined ) {
				/* If we have a texture to examine, load the info */
				display_tile_info( tile_info.row, tile_info.col );

				/* Cancel browser `right click` */
				return false;
			}
		}
	} );
}

function set_map_tile_settings_styles( direct_update = false ) {
	
	/* Set preview to have no special borders */
	$( "#container #toolbar #map_paint_preview table" ).css( "border", "2px solid #000" );
	$( "#container #toolbar #map_paint_preview table" ).css( "border-top", "2px solid #000" );
	$( "#container #toolbar #map_paint_preview table" ).css( "border-left", "2px solid #000" );
	$( "#container #toolbar #map_paint_preview table" ).css( "border-bottom", "2px solid #000" );
	$( "#container #toolbar #map_paint_preview table" ).css( "border-right", "2px solid #000" );

	if( selected_texture.exit_tile ) {
		/* Exit tile enabled, show the rest of the settings  */
		$( "#exit_tile_en" ).prop( "checked", true );

		$( "#container #toolbar #map_paint_settings input:not(.exit_ignore_hide)" ).css( "display", "block" );
		$( "#container #toolbar #map_paint_settings label:not(.exit_ignore_hide)" ).css( "display", "block" );
		$( "#container #toolbar #map_paint_settings select" ).css( "display", "block" );

		/* Disable the "can walk" checkboxes */
		$( ".dir_en_checkbox" ).prop( "checked", true );
		$( ".dir_en_checkbox" ).prop( "disabled", true );

		/* Set values */
		$( "#container #toolbar #map_paint_settings #exit_tile_map_id" ).val( selected_texture.exit_map_id );
		
		if( !direct_update ) {
			
			$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).val( selected_texture.exit_map_pos[0] );
			$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).val( selected_texture.exit_map_pos[1] );

			var exit_map = project.maps.find( obj => obj.id == selected_texture.exit_map_id );
			if( ( selected_texture.exit_map_pos[0] >= 0 ) && ( selected_texture.exit_map_pos[0] < exit_map.width ) )
				$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).css( "background", "#fff" );
			else
				$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).css( "background", "#e8736b" );

			if( ( selected_texture.exit_map_pos[1] >= 0 ) && ( selected_texture.exit_map_pos[1] < exit_map.height ) )
				$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).css( "background", "#fff" );
			else
				$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).css( "background", "#e8736b" );
		}

		/* Set styling for an exit tile and select the correct value from the dropdown menu */
		switch( selected_texture.exit_map_dir.join() ) {
			case "0,1": /* Exit when walking north */
				$( "#container #toolbar #map_paint_preview table" ).css( "border-top", "2px solid #ff0" );
				$( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val( "n" );
				break;
			case "1,0": /* Exit when walking east */
				$( "#container #toolbar #map_paint_preview table" ).css( "border-rightt", "2px solid #ff0" );
				$( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val( "e" );
				break;
			case "0,-1": /* Exit when walking south */
				$( "#container #toolbar #map_paint_preview table" ).css( "border-bottom", "2px solid #ff0" );
				$( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val( "s" );
				break;
			case "-1,0": /* Exit when walking west */
				$( "#container #toolbar #map_paint_preview table" ).css( "border-left", "2px solid #ff0" );
				$( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val( "w" );
				break;
			default:  /* Exit any direction */
				$( "#container #toolbar #map_paint_preview table" ).css( "border", "2px solid #ff0" );
				$( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val( "a" );
				break;
		}
		
	} else {
		/* Exit tile disabled, hide the rest of the settings  */
		$( "#exit_tile_en" ).prop( "checked", false );

		$( "#container #toolbar #map_paint_settings input:not(.exit_ignore_hide)" ).css( "display", "none" );
		$( "#container #toolbar #map_paint_settings label:not(.exit_ignore_hide)" ).css( "display", "none" );
		$( "#container #toolbar #map_paint_settings select" ).css( "display", "none" );

		/* Enable the "can walk" checkboxes */
		$( ".dir_en_checkbox" ).prop( "checked", false );
		$( ".dir_en_checkbox" ).prop( "disabled", false );

		/* Set directions player can walk into tile */

		/* Updated tile direction N */
		if( !selected_texture.can_walk[0] ) {
			$( "#container #toolbar #map_paint_preview table" ).css( "border-top", "2px solid #f00" );
			$( "#exit_tile_n" ).prop( "checked", false );
		} else {
			$( "#exit_tile_n" ).prop( "checked", true );
		}
		/* Updated tile direction E */
		if( !selected_texture.can_walk[1] ) {
			$( "#container #toolbar #map_paint_preview table" ).css( "border-right", "2px solid #f00" );
			$( "#exit_tile_e" ).prop( "checked", false );
		} else {
			$( "#exit_tile_e" ).prop( "checked", true );
		}
		/* Updated tile direction S */
		if( !selected_texture.can_walk[2] ) {
			$( "#container #toolbar #map_paint_preview table" ).css( "border-bottom", "2px solid #f00" );
			$( "#exit_tile_s" ).prop( "checked", false );
		} else {
			$( "#exit_tile_s" ).prop( "checked", true );
		}
		/* Updated tile direction W */
		if( !selected_texture.can_walk[3] ) {
			$( "#container #toolbar #map_paint_preview table" ).css( "border-left", "2px solid #f00" );
			$( "#exit_tile_w" ).prop( "checked", false );
		} else {
			$( "#exit_tile_w" ).prop( "checked", true );
		}
	}
}

function display_tile_info( tile_row, tile_col ) {

	/* Update the local array */
	var cell_texture_gid = selected_map.data[tile_row][tile_col].texture_gid;
	var cell_texture_id = selected_map.data[tile_row][tile_col].texture_id;

	/* Copy group and texture data to selected texture */
	selected_texture.group = project.textures.find( obj => obj.gid == cell_texture_gid );
	selected_texture.texture = selected_texture.group.textures.find( obj => obj.id == cell_texture_id );

	/* Fill the map list, but clear it first */
	$( "#exit_tile_map_id" ).empty();

	/* Sort the maps in order and then add them */
	sort_maps_by_order();
	$.each( project.maps, function( key, value ) {
		$( "#exit_tile_map_id" ).append( '<option value="' + value.id + '">' + value.name + '</option>' );
	} );

	/* Copy tile info */
	selected_texture.exit_tile = selected_map.data[tile_row][tile_col].exit_tile;
	selected_texture.exit_map_id = selected_map.data[tile_row][tile_col].exit_map_id;
	selected_texture.exit_map_dir = new Array();
	$.extend( true, selected_texture.exit_map_dir, selected_map.data[tile_row][tile_col].exit_map_dir ); /* Clone array */
	selected_texture.exit_map_pos = new Array();
	$.extend( true, selected_texture.exit_map_pos, selected_map.data[tile_row][tile_col].exit_map_pos ); /* Clone array */
	selected_texture.can_walk = new Array();
	$.extend( true, selected_texture.can_walk, selected_map.data[tile_row][tile_col].can_walk ); /* Clone array */

	/* Update texture list */
	load_texture_list(); /* note this function resets the flip state */

	/* Copy tile flip states */
	selected_texture.texture_reverse_x = selected_map.data[tile_row][tile_col].texture_reverse_x;
	selected_texture.texture_reverse_y = selected_map.data[tile_row][tile_col].texture_reverse_y;

	/* Update preview and tile settings panel */
	load_texture_preview();
}

function disable_controls( hide_name_input = true ) {
	
	controls_disabled = true;

	/* Disable all other controls */
	$( "#toolbar #settings #controls i" ).addClass( "resize_disabled" );
	$( "#project_view #map_list .sortable li" ).addClass( "resize_disabled" );

	$( "#sidebar #texture_list_toolbar i:not( #colour_ind )" ).addClass( "resize_disabled" );
	$( "#sidebar #texture_list .sortable li" ).addClass( "resize_disabled" );

	$( "#project_view #sprite_list_toolbar i" ).addClass( "resize_disabled" );
	$( "#project_view #sprite_list .sortable li" ).addClass( "resize_disabled" );

	$( ".sprite_picker" ).addClass( "auto_cursor" );
	$( ".texture_picker" ).addClass( "auto_cursor" );


	/* Sprites: Hide delete and new group confirmation prompt and show the toolbar */
	$( "#container #content #project_view #sprite_editor_container #sprite_list_toolbar_delete" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_editor_container #sprite_list_toolbar_new_group" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_editor_container #sprite_list_toolbar" ).css( "display", "flex" );

	/* Textures: Hide delete confirmation prompt and show the toolbar */
	$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "none" );
	$( "#container #sidebar #texture_list_toolbar" ).css( "display", "flex" );

	/* Disable sorting on texture list */
	clear_texture_list_sortable();

	/* Hide the other toolbar elements */
	if( hide_name_input )
		$( "#container #toolbar #settings #name_input_container" ).css( "display", "none" );
}

function enable_controls() {
	
	controls_disabled = false;

	/* Re-enable all other controls */
	$( "#toolbar #settings #controls i" ).removeClass( "resize_disabled" );
	$( "#project_view #map_list .sortable li" ).removeClass( "resize_disabled" );
	
	$( "#sidebar #texture_list_toolbar i" ).removeClass( "resize_disabled" );
	$( "#sidebar #texture_list .sortable li" ).removeClass( "resize_disabled" );

	$( "#project_view #sprite_list_toolbar i" ).removeClass( "resize_disabled" );
	$( "#project_view #sprite_list .sortable li" ).removeClass( "resize_disabled" );

	$( ".sprite_picker" ).removeClass( "auto_cursor" );
	$( ".texture_picker" ).removeClass( "auto_cursor" );

	/* Re-show flip icons and texture preview */
	if( selected_texture.texture == false ) {
		$( "#map_toolbar_flip_h" ).css( "display", "none" );
		$( "#map_toolbar_flip_v" ).css( "display", "none" );
	}

	/* Re-add sorting */
	//texture_list_sortable();

	/* Show the other toolbar elements */
	$( "#container #toolbar #settings #name_input_container" ).css( "display", "flex" );
	if( selected_texture.texture != false )
		$( "#container #toolbar #map_paint_preview" ).css( "display", "block" );
}