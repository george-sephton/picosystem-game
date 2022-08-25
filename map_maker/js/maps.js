function map_editor_toolbar_reset() {
	/* Deselect the paint/erase tool */
	$( "#map_toolbar_info" ).removeClass( "selected_tool" );
	$( "#map_toolbar_paint" ).removeClass( "selected_tool" );
	$( "#map_toolbar_erase" ).removeClass( "selected_tool" );

	/* Remove restrictions on sprite panel */
	$( "#container #sidebar #sprite_list_toolbar i" ).removeClass( "resize_disabled" );
	$( "#container #sidebar #sprite_list #sortable li" ).removeClass( "resize_disabled" );
	/* Re-enable colour picker */
	$( ".picker" ).removeClass( "auto_cursor" );

	/* Re-add sorting to the sprite list */
	sprite_list_sortable();

	/* Hide the tile settings */
	$( "#container #toolbar #map_paint_settings" ).css( "display", "none" );
	
	/* Remove event listener from map editor */
	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell_draw" ).unbind( "click" );
	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell_draw" ).unbind( "contextmenu" );
	/* Remove hover functionality from map editor */
	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell" ).removeClass( "map_editor_table_cell_draw" );

	/* Trigger changes to update UI */
	$( "#exit_tile_en" ).trigger( "change" );

	/* Reset preview panel */
	$( "#container #toolbar #map_paint_preview table" ).css( "border", "2px solid #000" );

	/* Re-show flip icons and sprite preview */
	if( selected_sprite.sprite != false ) {
		$( "#map_toolbar_flip_h" ).css( "display", "block" );
		$( "#map_toolbar_flip_v" ).css( "display", "block" );
		$( "#map_paint_preview" ).css( "display", "block" );
	} else {
		$( "#map_toolbar_flip_h" ).css( "display", "none" );
		$( "#map_toolbar_flip_v" ).css( "display", "none" );
		$( "#map_paint_preview" ).css( "display", "none" );
	}

}

function map_editor_start_drawing() {
	/* Disable sprite list toolbar */
	$( "#container #sidebar #sprite_list_toolbar i" ).addClass( "resize_disabled" );
	/* Disable colour picker */
	$( ".picker" ).addClass( "auto_cursor" );

	/* Disable sorting on sprite list */
	$( "#sortable" ).sortable( "destroy" );

	/* Add hover functionality to map editor */
	$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell" ).addClass( "map_editor_table_cell_draw" );
}

function set_map_tile_settings_styles() {

	/* Set preview to have no special borders */
	$( "#container #toolbar #map_paint_preview table" ).css( "border", "2px solid #000" );
	$( "#container #toolbar #map_paint_preview table" ).css( "border-top", "2px solid #000" );
	$( "#container #toolbar #map_paint_preview table" ).css( "border-left", "2px solid #000" );
	$( "#container #toolbar #map_paint_preview table" ).css( "border-bottom", "2px solid #000" );
	$( "#container #toolbar #map_paint_preview table" ).css( "border-right", "2px solid #000" );

	if( selected_sprite.exit_tile ) {
		/* Exit tile enabled, show the rest of the settings  */
		$( "#exit_tile_en" ).prop( "checked", true );

		$( "#container #toolbar #map_paint_settings input:not(.exit_ignore_hide)" ).css( "display", "block" );
		$( "#container #toolbar #map_paint_settings label:not(.exit_ignore_hide)" ).css( "display", "block" );
		$( "#container #toolbar #map_paint_settings select" ).css( "display", "block" );

		/* Disable the "can walk" checkboxes */
		$( ".dir_en_checkbox" ).prop( "checked", true );
		$( ".dir_en_checkbox" ).prop( "disabled", true );

		/* Set values */
		$( "#container #toolbar #map_paint_settings #exit_tile_map_id" ).val( selected_sprite.exit_map_id );
		$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).val( selected_sprite.exit_map_pos[0] );
		$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).val( selected_sprite.exit_map_pos[1] );

		/* Set styling for an exit tile and select the correct value from the dropdown menu */
		switch( selected_sprite.exit_map_dir.join() ) {
			case "0,1": /* Exit when walking north */
				$( "#container #toolbar #map_paint_preview table" ).css( "border-bottom", "2px solid #ff0" );
				$( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val( "n" );
				break;
			case "1,0": /* Exit when walking east */
				$( "#container #toolbar #map_paint_preview table" ).css( "border-left", "2px solid #ff0" );
				$( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val( "e" );
				break;
			case "0,-1": /* Exit when walking south */
				$( "#container #toolbar #map_paint_preview table" ).css( "border-top", "2px solid #ff0" );
				$( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val( "s" );
				break;
			case "-1,0": /* Exit when walking west */
				$( "#container #toolbar #map_paint_preview table" ).css( "border-right", "2px solid #ff0" );
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
		if( !selected_sprite.can_walk[0] ) {
			$( "#container #toolbar #map_paint_preview table" ).css( "border-top", "2px solid #f00" );
			$( "#exit_tile_n" ).prop( "checked", false );
		} else {
			$( "#exit_tile_n" ).prop( "checked", true );
		}
		/* Updated tile direction E */
		if( !selected_sprite.can_walk[1] ) {
			$( "#container #toolbar #map_paint_preview table" ).css( "border-right", "2px solid #f00" );
			$( "#exit_tile_e" ).prop( "checked", false );
		} else {
			$( "#exit_tile_e" ).prop( "checked", true );
		}
		/* Updated tile direction S */
		if( !selected_sprite.can_walk[2] ) {
			$( "#container #toolbar #map_paint_preview table" ).css( "border-bottom", "2px solid #f00" );
			$( "#exit_tile_s" ).prop( "checked", false );
		} else {
			$( "#exit_tile_s" ).prop( "checked", true );
		}
		/* Updated tile direction W */
		if( !selected_sprite.can_walk[3] ) {
			$( "#container #toolbar #map_paint_preview table" ).css( "border-left", "2px solid #f00" );
			$( "#exit_tile_w" ).prop( "checked", false );
		} else {
			$( "#exit_tile_w" ).prop( "checked", true );
		}
	}
}

function map_toolbar_event_listeners() {

	/* Remove all event listeners */
	$( "#container #toolbar #map_settings #map_controls i" ).unbind( "click" );

	/* Map toolbar event listeners */
	$( "#container #toolbar #map_settings #map_controls i" ).click(function() {
		
		/* Functions disabled whilst map is being re-sized */
		if( map_resizing.en == false ) {

			var func = $( this ).attr( "func" );

			if( ( func != "paint") && ( func != "erase" ) && ( func != "zoom-in" ) && ( func != "zoom-out" ) && ( func != "flip-v" ) && ( func != "flip-h" ) && ( drawing_functions != false ) ) {
								
				/* We are moving to another function whilst painting/erasing, reset everything */
				map_editor_toolbar_reset();
				/* Disable drawing functions */
				drawing_functions = false;
			}

			switch( func ) {
				case "paint":
				case "erase":

					/* Reset toolbar for a clean start */
					map_editor_toolbar_reset();
					
					/* Tool selection behaviour */
					if( ( func == "paint" ) && (drawing_functions != 1) ) {
						/* Switch to painting */
						drawing_functions = 1;
						map_editor_start_drawing();

						/* Highlight the paintbrush icon */
						$( "#map_toolbar_paint" ).addClass( "selected_tool" );

						/* Update preview and tile settings panel */
						selected_sprite.can_walk = [true, true, true, true];
						selected_sprite.exit_tile = false;
						selected_sprite.exit_map_id = false;
						selected_sprite.exit_map_dir = [0, 0];
						selected_sprite.exit_map_pos = [0, 0];

						$( "#container #toolbar #map_paint_settings" ).css( "display", "flex" );
						load_sprite_preview();

						/* Disable groups in sprite list */
						$( "#container #sidebar #sprite_list #sortable .ui-group" ).addClass( "resize_disabled" );
					} else if( ( func == "erase" ) && (drawing_functions != 2) ) {
						/* Switch to erasing */
						drawing_functions = 2;
						map_editor_start_drawing();

						/* Highlight the eraser icon */
						$( "#map_toolbar_erase" ).addClass( "selected_tool" );

						/* Hide the flip icons and preview since we aren't painting these */
						$( "#map_toolbar_flip_h" ).css( "display", "none" );
						$( "#map_toolbar_flip_v" ).css( "display", "none" );
						$( "#map_paint_preview" ).css( "display", "none" );

						/* Disable everything in sprite list */
						$( "#container #sidebar #sprite_list #sortable li" ).addClass( "resize_disabled" );
					} else {
						/* Disable all drawing functions */				
						drawing_functions = false;
					}

					/* Add map editor event listeners */
					$( "#container #map_editor_container #map_editor #map_editor_table .map_editor_table_row .map_editor_table_cell_draw" ).on( "click" , function( e ) {
		
						/* Store tile information */
						var tile_info = new Object();
						tile_info.row = $( this ).parent().attr( "row_id" );
						tile_info.col = $( this ).attr( "col_id" );

						if( func == "erase" ) {
							/* Clear the cell */
							$( this ).html( "" );
							$( this ).css( "background", "#ccc" );

							/* Update the local array */
							selected_map.data[tile_info.row][tile_info.col].sprite_gid = undefined;
							selected_map.data[tile_info.row][tile_info.col].sprite_id = undefined;
							selected_map.data[tile_info.row][tile_info.col].sprite_reverse_x = false;
							selected_map.data[tile_info.row][tile_info.col].sprite_reverse_y = false;
							selected_map.data[tile_info.row][tile_info.col].can_walk = [false, false, false, false];
							selected_map.data[tile_info.row][tile_info.col].exit_map_id = false;
							selected_map.data[tile_info.row][tile_info.col].exit_map_dir = [0, 0];
							selected_map.data[tile_info.row][tile_info.col].exit_map_pos = [0, 0];





							/* Here we need to save the changes */





						} else if( func == "paint" ) {

							/* Draw in the cell */
							$( this ).html( '<table class="sprite_table"></table>' );

							/* Add 8 rows */
							for(i=0; i<8; i++)
								$( this ).find( ".sprite_table" ).append( '<tr row_id="' + i + '"></tr>' );

							/* Add 8 cells for each row */
							$( this ).find( ".sprite_table tr" ).each( function() {
								for(i=0; i<8; i++) {
										
									/* Draw sprite */
									var row_sel = $( this ).attr( "row_id" );
									var col_sel = i;

									if( selected_sprite.sprite_reverse_y == true ) {
										/* Flip vertically */
										row_sel = 7 - ( $( this ).attr( "row_id" ) );
									}
									if( selected_sprite.sprite_reverse_x == true ) {
										/* Flip horizontally */
										col_sel = 7 - i;
									}

									$( '<td col_id="'+i+'"></td>' ).appendTo( $(this) ).css( "background", "#" + selected_sprite.sprite.data[col_sel][row_sel] );	
								}
							} );

							if( selected_sprite.exit_tile ) {
								/* We're setting an exit tile */

								selected_sprite.exit_tile = true;
								selected_sprite.exit_map_id = $( "#container #toolbar #map_paint_settings #exit_tile_map_id" ).val();
								selected_sprite.exit_map_dir = [$( "#container #toolbar #map_paint_settings #exit_tile_map_pos_x" ).val(), $( "#container #toolbar #map_paint_settings #exit_tile_map_pos_y" ).val()];
								
								switch( $( "#container #toolbar #map_paint_settings #exit_tile_map_dir" ).val() ) {
									case "a":  /* Exit any direction */
										selected_sprite.exit_map_dir = [0, 0];
										$( this ).find( ".sprite_table" ).css( "border", "3px solid #ff0" );
										break;
									case "n": /* Exit when walking north */
										$( this ).find( ".sprite_table" ).css( "border-bottom", "3px solid #ff0" );
										selected_sprite.exit_map_dir = [0, 1];
										break;
									case "e": /* Exit when walking east */
										$( this ).find( ".sprite_table" ).css( "border-left", "3px solid #ff0" );
										selected_sprite.exit_map_dir = [1, 0];
										break;
									case "s": /* Exit when walking south */
										$( this ).find( ".sprite_table" ).css( "border-top", "3px solid #ff0" );
										selected_sprite.exit_map_dir = [0, -1];
										break;
									case "w": /* Exit when walking west */
										$( this ).find( ".sprite_table" ).css( "border-right", "3px solid #ff0" );
										selected_sprite.exit_map_dir = [-1, 0];
										break;
								}

							} else {
								/* Update CSS based on can_walk */
								if(!selected_sprite.can_walk[0]) $( this ).find( ".sprite_table" ).css( "border-top", "3px solid #f00" );
								if(!selected_sprite.can_walk[1]) $( this ).find( ".sprite_table" ).css( "border-right", "3px solid #f00" );
								if(!selected_sprite.can_walk[2]) $( this ).find( ".sprite_table" ).css( "border-bottom", "3px solid #f00" );
								if(!selected_sprite.can_walk[3]) $( this ).find( ".sprite_table" ).css( "border-left", "3px solid #f00" );

								/* Update selected tile data */
								selected_sprite.exit_map_id = false;
								selected_sprite.exit_map_dir = [0, 0];
								selected_sprite.exit_map_pos = [0, 0];
							}

							/* Update the local array */
							selected_map.data[tile_info.row][tile_info.col].sprite_gid = selected_sprite.group.gid;
							selected_map.data[tile_info.row][tile_info.col].sprite_id = selected_sprite.sprite.id;

							selected_map.data[tile_info.row][tile_info.col].sprite_reverse_x = selected_sprite.sprite_reverse_x;
							selected_map.data[tile_info.row][tile_info.col].sprite_reverse_y = selected_sprite.sprite_reverse_y;

							selected_map.data[tile_info.row][tile_info.col].exit_tile = selected_sprite.exit_tile;
							selected_map.data[tile_info.row][tile_info.col].exit_map_id = selected_sprite.exit_map_id;

							selected_map.data[tile_info.row][tile_info.col].can_walk = new Array();
							$.extend( true, selected_map.data[tile_info.row][tile_info.col].can_walk, selected_sprite.can_walk ); /* Clone array */
							selected_map.data[tile_info.row][tile_info.col].exit_map_dir = new Array();
							$.extend( true, selected_map.data[tile_info.row][tile_info.col].exit_map_dir, selected_sprite.exit_map_dir ); /* Clone array */
							selected_map.data[tile_info.row][tile_info.col].exit_map_pos = new Array();
							$.extend( true, selected_map.data[tile_info.row][tile_info.col].exit_map_pos, selected_sprite.exit_map_pos ); /* Clone array */





							/* Here we need to save the changes */



		
						} else {
							/* Get sprite info */
							var cell_sprite_gid = selected_map.data[tile_info.row][tile_info.col].sprite_gid;
							var cell_sprite_id = selected_map.data[tile_info.row][tile_info.col].sprite_id;

							if( cell_sprite_gid != undefined ) {
								/* If we have a sprite to examine, load the info */
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

							/* Get sprite info */
							var cell_sprite_gid = selected_map.data[tile_info.row][tile_info.col].sprite_gid;
							var cell_sprite_id = selected_map.data[tile_info.row][tile_info.col].sprite_id;

							if( cell_sprite_gid != undefined ) {
								/* If we have a sprite to examine, load the info */
								display_tile_info( tile_info.row, tile_info.col );

								/* Cancel browser `right click` */
								return false;
							}
						}
					} );


					break;
				case "fill":
				case "clear":

					/* Disable controls */
					disable_controls();
					
					/* Show the confirmation prompt */
					if( func == "clear") $( "#container #toolbar #map_settings #map_confirm #map_confirm_prompt" ).html( "Clear the whole map?" );
					else $( "#container #toolbar #map_settings #map_confirm #map_confirm_prompt" ).html( "Paint the whole map?" );

					$( "#container #toolbar #map_settings #map_confirm input[type=button]" ).css( "display", "block" );
					$( "#container #toolbar #map_settings #map_confirm #map_done" ).css( "display", "none" );

					$( "#container #toolbar #map_settings #map_name" ).css( "display", "none" );
					$( "#container #toolbar #map_settings #map_confirm" ).css( "display", "flex" );

					/* Add event listeners */
					$( "#container #toolbar #map_settings #map_confirm input[type=button]" ).on( "click" , function( e ) {
						if( $( this ).attr( "id" ) == "map_confirm_y" ) {
							/* Fill her up! */

							/* Create tile info */
							var fill_tile = new Object();
							fill_tile.can_walk = [true, true, true, true];
							if( func == "clear" ) {
								fill_tile.sprite_gid = undefined;
								fill_tile.sprite_id = undefined;
								fill_tile.sprite_reverse_x = false;
								fill_tile.sprite_reverse_y = false;
							} else {
								fill_tile.sprite_gid = selected_sprite.group.gid;
								fill_tile.sprite_id = selected_sprite.sprite.id;
								fill_tile.sprite_reverse_x = selected_sprite.sprite_reverse_x;
								fill_tile.sprite_reverse_y = selected_sprite.sprite_reverse_y;
							}
							fill_tile.exit_tile = false;
							fill_tile.exit_map_id = false;
							fill_tile.exit_map_dir = [0, 0];
							fill_tile.exit_map_pos = [0, 0];

							/* Fill the map */
							selected_map.data = Array.from( { length: selected_map.height }, () => Array.from( { length: selected_map.width }, () => Object.assign( {}, fill_tile ) ) );






							/* Here we need to save the changes */





							/* Re-enable controls */
							enable_controls();

							/* Reload the map editor */
							load_map_editor();
						} else if( $( this ).attr( "id" ) == "map_confirm_n" ) {
							/* Re-enable controls */
							enable_controls();
						}

						/* Remove event listeners */
						$( "#container #toolbar #map_settings #map_confirm input[type=button]" ).unbind( "click" );

						/* Hide the confirmation prompt */
						$( "#container #toolbar #map_settings #map_confirm #map_confirm_prompt" ).html( "" );

						$( "#container #toolbar #map_settings #map_name" ).css( "display", "flex" );
						$( "#container #toolbar #map_settings #map_confirm" ).css( "display", "none" );
					});

					break;
				case "resize-canvas":

					if( map_resizing.en == false ) {
						
						/* Enable resizing mode */
						map_resizing.new_width = selected_map.width;
						map_resizing.new_height = selected_map.height;

						/* Disable controls */
						disable_controls();

						/* Show the resizing controls */
						$( "#container #toolbar #map_size" ).css( "display", "flex" );
						$( "#container #toolbar #map_size #cols #map_cols" ).val( map_resizing.new_width );
						$( "#container #toolbar #map_size #rows #map_rows" ).val( map_resizing.new_height );

						/* Show the warning prompt */
						$( "#container #toolbar #map_settings #map_confirm #map_confirm_prompt" ).html( "Note: resizing will delete filled tiles" );
						$( "#container #toolbar #map_settings #map_confirm input[type=button]" ).css( "display", "none" );
						$( "#container #toolbar #map_settings #map_confirm #map_done" ).css( "display", "block" );
						$( "#container #toolbar #map_settings #map_confirm" ).css( "display", "flex" );
						
						/* Add event listener for "Done" button */
						$( "#container #toolbar #map_settings #map_confirm #map_done" ).on( "click" , function( e ) {

							/* Re-enable controls */
							enable_controls();

							/* Hide the resizing controls */
							$( "#container #toolbar #map_size" ).css( "display", "none" );

							/* Hide the warning prompt */
							$( "#container #toolbar #map_settings #map_confirm #map_confirm_prompt" ).html( "" );
							$( "#container #toolbar #map_settings #map_confirm" ).css( "display", "none" );

							/* Remove event listeners */
							$( "#container #toolbar #map_settings #map_confirm input[type=button]" ).unbind( "click" );
							
							/* Remove event listeners for the controls */
							$( "#container #toolbar #map_size #cols #map_cols" ).unbind( "click" );
							$( "#container #toolbar #map_size #cols #map_rows" ).unbind( "click" );

							/* Now create a new map, start with all blank tiles */
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






							/* Here we need to save the changes */






							/* Reload map editor */
							load_map_editor();
						} );

						/* Add event listeners for the controls */
						$( "#container #toolbar #map_size #cols #map_cols" ).on( "change" , function( e ) {
							/* Columns change */
							var set_cols = parseInt( $( "#container #toolbar #map_size #cols #map_cols" ).val() );

							if( ( set_cols >= 3 ) && ( set_cols <= 40 ) ) {
								map_resizing.new_width = set_cols;
								load_map_editor();
							}
						} );

						$( "#container #toolbar #map_size #rows #map_rows" ).on( "change" , function( e ) {
							/* Rows change */
							var set_rows = parseInt( $( "#container #toolbar #map_size #rows #map_rows" ).val() );
							
							if( ( set_rows >= 3 ) && ( set_rows <= 40 ) ) {
								map_resizing.new_height = set_rows;
								load_map_editor();
							}
						} );
					}
					
					break;
				case "flip-h":
					selected_sprite.sprite_reverse_y = !selected_sprite.sprite_reverse_y;
					/* Reload preview */
					load_sprite_preview();
					break
				case "flip-v":
					selected_sprite.sprite_reverse_x = !selected_sprite.sprite_reverse_x;
					/* Reload preview */
					load_sprite_preview();
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

	/* Add event listeners to the tile settings panel */

	/* Remove all event listeners */
	$( "#container #toolbar #map_paint_settings" ).unbind( "keyup change" );

	/* Map toolbar event listeners */
	$( "#container #toolbar #map_paint_settings" ).on( "keyup change", function( e ) {
		
		/* Functions disabled whilst map is being re-sized */
		if( map_resizing.en == false ) {
			
			var element = $( e.target );

			switch( element.attr( "id" ) ) {
				case "exit_tile_en":
					/* Enable/Disable exit tile */
					if( element.prop( "checked" ) ) {
						/* Exit tile enabled */
						selected_sprite.exit_tile = true;
						selected_sprite.exit_map_id = 0;
						selected_sprite.exit_map_dir = [0, 0];
						selected_sprite.exit_map_pos = [0, 0];
					} else {
						/* Exit tile disabled */
						selected_sprite.exit_tile = false;
						selected_sprite.can_walk = [true, true, true, true];
					}
					break;
				case "exit_tile_n":
					/* Updated tile direction N */
					if( !element.prop( "checked" ) ) {
						selected_sprite.can_walk[0] = false;
					} else {
						selected_sprite.can_walk[0] = true;
					}
					break;
				case "exit_tile_e":
					/* Updated tile direction E */
					if( !element.prop( "checked" ) ) {
						selected_sprite.can_walk[1] = false;
					} else {
						selected_sprite.can_walk[1] = true;
					}
					break;
				case "exit_tile_s":
					/* Updated tile direction S */
					if( !element.prop( "checked" ) ) {
						selected_sprite.can_walk[2] = false;
					} else {
						selected_sprite.can_walk[2] = true;
					}
					break;
				case "exit_tile_w":
					/* Updated tile direction W */
					if( !element.prop( "checked" ) ) {
						selected_sprite.can_walk[3] = false;
					} else {
						selected_sprite.can_walk[3] = true;
					}
					break;
				case "exit_tile_map_dir":
					switch( element.val() ) {
						case "n": /* Exit when walking north */
							selected_sprite.exit_map_dir = [0, 1];
							break;
						case "e": /* Exit when walking east */
							selected_sprite.exit_map_dir = [1, 0];
							break;
						case "s": /* Exit when walking south */
							selected_sprite.exit_map_dir = [0, -1];
							break;
						case "w": /* Exit when walking west */
							selected_sprite.exit_map_dir = [-1, 0];
							break;
						default:  /* Exit any direction */
							selected_sprite.exit_map_dir = [0, 0];
							break;
					}
					break;
				case "exit_tile_map_id":
					selected_sprite.exit_map_id = element.val();
					break;
				case "exit_tile_map_pos_x":
					selected_sprite.exit_map_pos[0] = element.val();
					break;
				case "exit_tile_map_pos_y":
					selected_sprite.exit_map_pos[1] = element.val();
					break;
			}

			/* Reload the tile settings */
			set_map_tile_settings_styles();
		}
	} );
}


function load_map_editor() {

	/* FYI: [height, y, rows][width, x, cols] */

	/* Show loading message */
	$( "#container #map_editor_container #map_editor" ).css( "display", "none" );
	$( "#container #map_editor_container #map_editor_loading" ).css( "display", "flex" );

	/* Change editor position */
	$( "#container #map_editor_container" ).css( "justify-content", "center" );
	$( "#container #map_editor_container" ).css( "align-items", "center" );

	/* Setup map editor */
	$( "#container #map_editor_container #map_editor" ).html( '<table id="map_editor_table"></table>' );

	/* Add map rows */
	var show_rows = map_resizing.en ? map_resizing.new_height : selected_map.height;
	for(i=0; i<show_rows; i++)
		$( "#map_editor_table" ).append( '<tr row_id="' + i + '" class="map_editor_table_row"></tr>' );

	/* Add map cells for each row */
	var show_cols = map_resizing.en ? map_resizing.new_width : selected_map.width;
	$( "#map_editor_table" ).children().each( function() {
		for(i=0; i<show_cols; i++)
			$( '<td col_id="'+i+'" sprite_id="" class="map_editor_table_cell"></td>' ).appendTo( $(this) );
	} );

	/* Add sprite to each cell */
	$( "#map_editor_table tr td" ).each( function() {
		
		/* Store tile information */
		var tile_info = new Object();
		tile_info.row = $( this ).parent().attr( "row_id" );
		tile_info.col = $( this ).attr( "col_id" );

		/* Get the sprite flip info */
		if( ( tile_info.col >= selected_map.width ) || ( tile_info.row >= selected_map.height ) ) {
			tile_info.sprite_reverse_x = false;
			tile_info.sprite_reverse_y = false;
		} else {
			tile_info.sprite_reverse_x = selected_map.data[tile_info.row][tile_info.col].sprite_reverse_x;
			tile_info.sprite_reverse_y = selected_map.data[tile_info.row][tile_info.col].sprite_reverse_y;
		}

		/* If we are looking for a newly added row, outside of the exisiting map bounds, return an empty tile */
		if( ( tile_info.col >= selected_map.width ) || ( tile_info.row >= selected_map.height ) ) tile_info.sprite_gid = undefined;
		else tile_info.sprite_gid = selected_map.data[tile_info.row][tile_info.col].sprite_gid;
		/* If we are looking for a newly added column, outside of the exisiting map bounds, return an empty tile */
		if( ( tile_info.col >= selected_map.width ) || ( tile_info.row >= selected_map.height ) ) tile_info.sprite_gid = undefined;
		else tile_info.sprite_id = selected_map.data[tile_info.row][tile_info.col].sprite_id;
		
		var sprite_obj = undefined;
		/* Get the sprite */
		if( ( tile_info.sprite_gid != undefined ) && ( tile_info.sprite_id != undefined ) ) {
			var group_obj = project.sprites.find( obj => obj.gid == tile_info.sprite_gid );
			if( group_obj != undefined ) {
				sprite_obj = group_obj.sprites.find( obj => obj.id == tile_info.sprite_id );
			} else {
				sprite_obj = undefined;
			}
		}
		
		if( sprite_obj == undefined ) {
			$( this ).css( "background", "#ccc" );
		} else {

			/* Whilst resizing, don't render the sprite */
			if(map_resizing.en == true) {	
				$( this ).css( "background", "#327da8" );
			} else {
				/* Add the sprite table */
				$( this ).html( '<table class="sprite_table"></table>' );

				/* Add 8 rows */
				for(i=0; i<8; i++)
					$( this ).find( ".sprite_table" ).append( '<tr row_id="' + i + '"></tr>' );

				/* Add 8 cells for each row */
				$( this ).find( ".sprite_table tr" ).each( function() {
					for(i=0; i<8; i++) {
							
						/* Draw sprite */
						var row_sel = $( this ).attr( "row_id" );
						var col_sel = i;

						if( tile_info.sprite_reverse_y == true ) {
							/* Flip vertically */
							row_sel = 7 - ( $( this ).attr( "row_id" ) );
						}
						if( tile_info.sprite_reverse_x == true ) {
							/* Flip horizontally */
							col_sel = 7 - i;
						}

						$( '<td col_id="'+i+'"></td>' ).appendTo( $(this) ).css( "background", "#" + sprite_obj.data[col_sel][row_sel] );	
					}
				} );

				/* Clear all borders first */
				$( this ).find( ".sprite_table" ).css( "border-top", "0" );
				$( this ).find( ".sprite_table" ).css( "border-right", "0" );
				$( this ).find( ".sprite_table" ).css( "border-bottom", "0" );
				$( this ).find( ".sprite_table" ).css( "border-left", "0" );
				$( this ).find( ".sprite_table" ).css( "border", "0" );

				/* Update CSS based on can_walk */
				if( !selected_map.data[tile_info.row][tile_info.col].can_walk[0] ) $( this ).find( ".sprite_table" ).css( "border-top", "3px solid #f00" );
				if( !selected_map.data[tile_info.row][tile_info.col].can_walk[1] ) $( this ).find( ".sprite_table" ).css( "border-right", "3px solid #f00" );
				if( !selected_map.data[tile_info.row][tile_info.col].can_walk[2] ) $( this ).find( ".sprite_table" ).css( "border-bottom", "3px solid #f00" );
				if( !selected_map.data[tile_info.row][tile_info.col].can_walk[3] ) $( this ).find( ".sprite_table" ).css( "border-left", "3px solid #f00" );

				if( selected_map.data[tile_info.row][tile_info.col].exit_tile ) {
					/* Update CSS for exit tiles */
					switch( selected_map.data[tile_info.row][tile_info.col].exit_map_dir.join() ) {
						case "0,0":  /* Exit any direction */
							$( this ).find( ".sprite_table" ).css( "border", "3px solid #ff0" );
							break;
						case "0,1": /* Exit when walking north */
							$( this ).find( ".sprite_table" ).css( "border-bottom", "3px solid #ff0" );
							break;
						case "1,0": /* Exit when walking east */
							$( this ).find( ".sprite_table" ).css( "border-left", "3px solid #ff0" );
							break;
						case "0,-1": /* Exit when walking south */
							$( this ).find( ".sprite_table" ).css( "border-top", "3px solid #ff0" );
							break;
						case "-1,0": /* Exit when walking west */
							$( this ).find( ".sprite_table" ).css( "border-right", "3px solid #ff0" );
							break;
					}
				}
			}
		}
		
	} );

	/* Hide loading message */
	$( "#container #map_editor_container #map_editor" ).css( "display", "flex" );
	$( "#container #map_editor_container #map_editor_loading" ).css( "display", "none" );

	/* Change editor position */
	$( "#container #map_editor_container" ).css( "justify-content", "flex-start" );
	$( "#container #map_editor_container" ).css( "align-items", "flex-start" );

	/* Set zoom level on load */
	$( "#map_editor_table .map_editor_table_row .map_editor_table_cell" ).css( "min-width", (map_cell_size * 5)+"px" );
	$( "#map_editor_table .map_editor_table_row .map_editor_table_cell" ).css( "height", (map_cell_size * 5)+"px" );

	/* Set map name and size */
	$( "#container #toolbar #map_settings #map_name input" ).attr( "placeholder", selected_map.name );
	$( "#container #toolbar #map_settings #map_name input" ).attr( "disabled", "disabled" );
}

function display_tile_info( tile_row, tile_col ) {

	/* Update the local array */
	var cell_sprite_gid = selected_map.data[tile_row][tile_col].sprite_gid;
	var cell_sprite_id = selected_map.data[tile_row][tile_col].sprite_id;

	/* Copy group and sprite data to selected sprite */
	selected_sprite.group = project.sprites.find( obj => obj.gid == cell_sprite_gid );
	selected_sprite.sprite = selected_sprite.group.sprites.find( obj => obj.id == cell_sprite_id );

	/* Copy tile info */
	selected_sprite.exit_tile = selected_map.data[tile_row][tile_col].exit_tile;
	selected_sprite.exit_map_id = selected_map.data[tile_row][tile_col].exit_map_id;
	selected_sprite.exit_map_dir = new Array();
	$.extend( true, selected_sprite.exit_map_dir, selected_map.data[tile_row][tile_col].exit_map_dir ); /* Clone array */
	selected_sprite.exit_map_pos = new Array();
	$.extend( true, selected_sprite.exit_map_pos, selected_map.data[tile_row][tile_col].exit_map_pos ); /* Clone array */
	selected_sprite.can_walk = new Array();
	$.extend( true, selected_sprite.can_walk, selected_map.data[tile_row][tile_col].can_walk ); /* Clone array */

	/* Update sprite list */
	load_sprite_list(); /* note this function resets the flip state */

	/* Copy tile flip states */
	selected_sprite.sprite_reverse_x = selected_map.data[tile_row][tile_col].sprite_reverse_x;
	selected_sprite.sprite_reverse_y = selected_map.data[tile_row][tile_col].sprite_reverse_y;

	/* Update preview and tile settings panel */
	load_sprite_preview();
}

function disable_controls() {
	map_resizing.en = true;

	/* Disable all other controls */
	$( "#container #toolbar #map_settings #map_controls i" ).addClass( "resize_disabled" );
	$( "#container #sidebar #sprite_list_toolbar i" ).addClass( "resize_disabled" );
	$( "#container #sidebar #sprite_list #sortable li" ).addClass( "resize_disabled" );
	$( ".picker" ).addClass( "auto_cursor" );
	
	/* Remove sorting */
	$( "#sortable" ).sortable( "destroy" );

	/* Hide the other toolbar elements */
	$( "#container #toolbar #map_settings #map_name" ).css( "display", "none" );
}

function enable_controls() {
	map_resizing.en = false;

	/* Re-enable all other controls */
	$( "#container #toolbar #map_settings #map_controls i" ).removeClass( "resize_disabled" );
	$( "#container #sidebar #sprite_list_toolbar i" ).removeClass( "resize_disabled" );
	$( "#container #sidebar #sprite_list #sortable li" ).removeClass( "resize_disabled" );
	$( ".picker" ).removeClass( "auto_cursor" );

	/* Re-show flip icons and sprite preview */
	if( selected_sprite.sprite == false ) {
		$( "#map_toolbar_flip_h" ).css( "display", "none" );
		$( "#map_toolbar_flip_v" ).css( "display", "none" );
	}

	/* Re-add sorting */
	sprite_list_sortable();

	/* Show the other toolbar elements */
	$( "#container #toolbar #map_settings #map_name" ).css( "display", "flex" );
	if( selected_sprite.sprite != false )
		$( "#container #toolbar #map_paint_preview" ).css( "display", "block" );
}