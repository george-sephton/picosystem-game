function load_texture_list() {

	/* Clear texture list */
	$( "#texture_list .sortable" ).html( "" );
	$( "#texture_list .sortable li" ).css( "color", "#000" );

	/* Clear map editing icons */
	$( "#map_toolbar_bg_image" ).css( "display", "none" );
	$( "#map_toolbar_paint" ).css( "display", "none" );
	$( "#map_toolbar_fill" ).css( "display", "none" );
	$( "#map_toolbar_flip_h" ).css( "display", "none" );
	$( "#map_toolbar_flip_v" ).css( "display", "none" );

	/* Clear fill and paint texture icons */
	$( "#texture_fill" ).css( "display", "none" );
	$( "#texture_paint" ).css( "display", "none" );
	$( "#texture_erase" ).css( "display", "none" );
	
	/* Check if we are showing groups or textures */
	if( selected_texture.group == false ) {
		
		/* Groups */
		sort_texture_groups_by_gorder();

		$.each( project.textures, function( key, value ) {
			$( "#texture_list .sortable" ).append( '<li class="ui-state-default ui-group" g_texture_id="' + value.gid + '">' + value.name + '</li>' );
		} );

		/* Clear the current texture id */
		selected_texture.texture = false;

		/* Set the icons */
		$( "#texture_list_toolbar #toolbar_left #toolbar_new_group" ).css( "display", "block" );
		$( "#texture_list_toolbar #toolbar_left #toolbar_new_texture" ).css( "display", "none" );
		$( "#texture_list_toolbar #toolbar_left #toolbar_back" ).css( "display", "none" );
		$( "#texture_list_toolbar #toolbar_right" ).css( "display", "none" );

		/* Show the map settings */
		$( "#container #toolbar #map_settings" ).css( "display", "flex" );

	} else {
		
		/* Textures */
		sort_textures_by_order( selected_texture.group.gid );

		/* Add the group name */
		$( "#texture_list .sortable" ).append( '<li class="ui-state-default ui-state-disabled ui-group" g_texture_id="' + selected_texture.group.gid + '">' + selected_texture.group.name + '</li>' );

		$.each( selected_texture.group.textures, function( key, value ) {
			
			if( ( selected_map.bg_texture.gid == selected_texture.group.gid ) && ( selected_map.bg_texture.id == value.id ) )
				$( "#texture_list .sortable" ).append( '<li class="ui-state-default ui-bg-texture" texture_id="' + value.id + '">' + value.name + '</li>' );
			else 
				$( "#texture_list .sortable" ).append( '<li class="ui-state-default ui-texture" texture_id="' + value.id + '">' + value.name + '</li>' );
		} );

		if( selected_texture.texture == false ) {
			/* Highlight parent group */
			$( "#texture_list .sortable li[g_texture_id='" + selected_texture.group.gid + "']" ).css( "color", "#154561" );
		} else {
			/* Highlight selected texture */
			$( "#texture_list .sortable li[texture_id='" + selected_texture.texture.id + "']" ).css( "color", "#195170" );

			/* Store the texture state */
			selected_texture.texture_reverse_x = false;
			selected_texture.texture_reverse_y = false;

			/* Show map editing icons */
			$( "#map_toolbar_bg_image" ).css( "display", "block" );
			$( "#map_toolbar_paint" ).css( "display", "block" );
			$( "#map_toolbar_fill" ).css( "display", "block" );
			$( "#map_toolbar_flip_h" ).css( "display", "block" );
			$( "#map_toolbar_flip_v" ).css( "display", "block" );
		}

		/* Set the icons */
		$( "#texture_list_toolbar #toolbar_left #toolbar_new_group" ).css( "display", "none" );
		$( "#texture_list_toolbar #toolbar_left #toolbar_new_texture" ).css( "display", "block" );
		$( "#texture_list_toolbar #toolbar_left #toolbar_back" ).css( "display", "block" );
		$( "#texture_list_toolbar #toolbar_right" ).css( "display", "flex" );

		/* Hide the map settings */
		$( "#container #toolbar #map_settings" ).css( "display", "none" );
	}

	/* Add event listeners to the list */
	texture_list_event_listeners();
	
	/* Add sorting capability */
	if( drawing_functions == false ) texture_list_sortable();
	
	/* Reload texture Editor */
	load_texture_editor();

	/* Disable hovering for draw functions */
	if( drawing_functions == 1 )
		$( "#container #sidebar #texture_list #texture_list .sortable .ui-group" ).addClass( "resize_disabled" );
	else if( ( drawing_functions == 2 ) || ( drawing_functions == 3 ) )
		$( "#container #sidebar #texture_list #texture_list .sortable li" ).addClass( "resize_disabled" );

	/* Disable cursor on texture editor */
	if( drawing_functions != false )
		$( ".texture_picker" ).addClass( "auto_cursor" );
}

function clear_texture_list_event_listeners() {
	
	$( "#texture_list .sortable li" ).unbind( "click" );
	$( "#texture_list" ).unbind( "click" ); /* For click out - not implemented */
}

function texture_list_event_listeners() {
	
	/* Remove existing event listeners */
	clear_texture_list_event_listeners();

	/* Add onClick event listeners */
	$( "#texture_list .sortable li" ).on( "click" , function( e ) {

		/* Ignore clicks on the items in the texture list when controls are disabled */
		if( ( ( controls_disabled == false ) && ( drawing_functions != 2 ) ) || ( ( controls_disabled == true ) && ( drawing_functions == 1 ) ) ){

			if( selected_texture.group == false ) {

				/* Top level click, no texture or group selected */
				selected_texture.group = project.textures.find( obj => obj.gid == $( this ).attr( "g_texture_id" ) );
				load_texture_list();
			} else {

				/* Group level click - either texture or parent group selected */
				if( ( $( this ).hasClass( "ui-group" ) ) && ( drawing_functions == 1 ) ) {
					/* Ignore clicks on groups when drawing */
				} else {

					if( $( this ).attr( "texture_id" ) != undefined) {
						/* Set selected texture */
						selected_texture.texture = selected_texture.group.textures.find( obj => obj.id == $( this ).attr( "texture_id" ) );
					} else {	
						/* Clear selected texture */
						selected_texture.texture = false;
					}

					/* Reload texture list */
					load_texture_list();
				}
			}
		}
	});
}

function clear_texture_paint_preview() {
	
	/* Clear the texture paint preview */
	$( "#container #toolbar #map_paint_preview" ).html( "" );
	$( "#container #toolbar #map_paint_preview" ).css( "display", "none" );
}

function load_texture_preview() {

	/* Setup the texture paint preview */
	$( "#container #toolbar #map_paint_preview" ).css( "display", "block" );
	$( "#container #toolbar #map_paint_preview" ).html( "<table></table>" );

	$( "#container #toolbar #map_settings" ).css( "display", "none" );
	
	/* Add 8 rows */
	for(i=0; i<8; i++)
		$( "#map_paint_preview table" ).append( '<tr row_id="' + i + '"></tr>' );

	/* Add 8 cells for each row and set background color */
	$( "#map_paint_preview table" ).children().each( function() {

		for(i=0; i<8; i++) {

			/* Deal with it being flipped */
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

			$( '<td col_id="'+i+'"></td>' ).appendTo( $(this) ).css( "background", "#" + selected_texture.texture.data[col_sel][row_sel]);
		}
	} );

	/* Add styling if painting */
	if( ( drawing_functions == 1 ) || ( drawing_functions == 3 ) ) set_map_tile_settings_styles();
}

function load_texture_editor_colour_pickers() {

	/* Variable to store which cell is being update as the colour picker library sometimes bugs out */
	var selected_picker = false;

	/* Setup the texture editor and colour pickers, function should only be called once */
	$( "#texture_editor" ).html( "<table></table>" );
	
	/* Add 8 rows */
	for(i=0; i<8; i++)
		$( "#texture_editor table" ).append( '<tr row_id="' + i + '"></tr>' );

	/* Add 8 cells for each row and set background color */
	$( "#texture_editor table" ).children().each( function() {
		for(i=0; i<8; i++)
			$( '<td col_id="'+i+'" class="texture_picker"></td>' ).appendTo( $(this) );
	} );

	/* Add in the colour pickers */
	$( '#sidebar .texture_picker' ).colpick( {
		layout: "hex",
		submit: "OK",
		onShow: function( e ) {

			/* Set the selected picker */
			selected_picker = $( this );

			if( ( controls_disabled == true ) || ( drawing_functions != false ) ) {
				
				/* Clear the drawing function now that we've avoided it re-opening after the user has finished with the paint tool */
				if( drawing_functions == 4 )
					drawing_functions = false;

				/* Hide the colour picker */
				return false;
			}

			/* Set the colour picker to show the currently selected colour, ignore if it's the fill icon */
			if( ( $( this ).attr( "id" ) != "texture_fill" ) && ( $( this ).attr( "id" ) != "texture_paint" ) ) {
				
				if( selected_texture.texture.data == undefined ) {
					/* We had an error */
					alert( "Error: Colour Picker not initialised correctly.\n\nPlease reload the Map Maker to fix, remember to save your work first!" );
				}
				
				$( this ).colpickSetColor( selected_texture.texture.data[ $( this ).attr( "col_id" ) ][ $( this ).parent().attr( "row_id" ) ], true );
			}
		},
		onSubmit: function( hsb, hex, rgb, e ) {

			var texture_fill = false;

			if( selected_picker.attr( "id" ) == "texture_fill" ) {
				
				/* We're filling the entire texture with the selected colour */
				selected_texture.texture.data = Array.from( { length: 8 }, () => Array.from( { length: 8 }, () => hex ) );
				texture_fill = true;
				
				/* Update the texture editor */
				$( "#texture_editor table tr td" ).css("background", "#" + hex );
				$( "#texture_editor table tr td" ).removeClass( "trans_background" );
			} else if( selected_picker.attr( "id" ) == "texture_paint" ) {

				/* We're painting the texture  */
				drawing_functions = 3;

				/* Show colour indicator briefly */
				$( "#container #sidebar #texture_list_toolbar #colour_ind" ).css( "display", "block" );
				$( "#container #sidebar #texture_list_toolbar #colour_ind" ).css( "color", "#"+hex );
				$( "#container #sidebar #texture_list_toolbar #colour_ind" ).fadeOut( 750 );

				/* Reset toolbar for a clean start */
				map_editor_toolbar_reset();
				
				/* Disable controls */
				disable_controls( false );

				/* Set paint brush as selected tool */
				$( ".texture_picker" ).removeClass( "auto_cursor" );
				$( "#texture_paint" ).removeClass( "resize_disabled" );
				$( "#texture_paint" ).addClass( "selected_tool" );

				/* Add hover functionality to map editor */
				$( "#texture_editor table tr td" ).addClass( "map_editor_table_cell_draw" );

				/* Add event listeners to the cells of the texture editor */
				$( "#texture_editor table tr td" ).on( "mouseup", function( e ) {

					if( e.which == 3) {

						/* Right click, let's switch colours */
						var cell_colour = selected_texture.texture.data[ $( this ).attr( "col_id" ) ][ $( this ).parent().attr( "row_id" ) ];

						if( ( cell_colour != "" ) && ( cell_colour != undefined ) ) {
							
							hex = cell_colour;

							/* Show colour indicator briefly */
							$( "#container #sidebar #texture_list_toolbar #colour_ind" ).css( "display", "block" );
							$( "#container #sidebar #texture_list_toolbar #colour_ind" ).css( "color", "#"+hex );
							$( "#container #sidebar #texture_list_toolbar #colour_ind" ).fadeOut( 750 );
						}
					} else {

						/* Carry on as normal and update the cell background */
						$( this ).css("background", "#" + hex );
						$( this ).removeClass( "trans_background" );

						/* Get the row and column */
						var texture_row = $( this ).parent().attr( "row_id" );
						var texture_col = $( this ).attr( "col_id" );

						/* Set the colour in the local array */
						selected_texture.texture.data[ texture_col ][ texture_row ] = hex;

						/* Update the preview and the map */
						texture_update( texture_fill, hex, texture_row, texture_col );

						/* Reset the selected picker */
						selected_picker = false;
					}
				} );

				/* Remove default context menu when drawing */
				$( "#texture_editor table tr td" ).on( "contextmenu" , function( e ) { return false; } );

				/* Add event listener to paint icon to stop the painting */
				$( "#texture_paint" ).on( "mouseup", function() {

					/* Re-enable controls */
					enable_controls();

					/* Reset the selected picker */
					selected_picker = false;

					/* Remove paint brush as selected tool */
					$( "#texture_paint" ).removeClass( "selected_tool" );
					$( "#texture_editor table tr td" ).removeClass( "map_editor_table_cell_draw" );

					/* Unbind event listeners */
					$( "#texture_paint" ).unbind( "mouseup" );
					$( "#texture_editor table tr td" ).unbind( "mouseup" );
					$( "#texture_editor table tr td" ).unbind( "contextmenu" );

					/* Set to 4 as this click will trigger the colour picker to re-open, and we don't want that to happen */
					drawing_functions = 4;
				} );
			} else {

				/* We've selected a pixel colour, update the cell background */
				selected_picker.css("background", "#" + hex );
				selected_picker.removeClass( "trans_background" );

				/* Get the row and column */
				var texture_row = selected_picker.parent().attr( "row_id" );
				var texture_col = selected_picker.attr( "col_id" );

				/* Set the colour in the local array */
				selected_texture.texture.data[ texture_col ][ texture_row ] = hex;

				/* Reset the selected picker */
				selected_picker = false;
			}
			
			if( !drawing_functions )
				texture_update( texture_fill, hex, texture_row, texture_col );
				
			/* Hide the colour picker */
			$( e ).colpickHide();
		}
	} );
}

function texture_update( texture_fill, hex, texture_row, texture_col ) {

	/* Update texture paint preview and any cells on the map */
	load_texture_preview();

	/* Check to see if we are updating a background texture */
	var bg_texture = false;
	if( ( selected_map.bg_texture.gid == selected_texture.group.gid ) && ( selected_map.bg_texture.id == selected_texture.texture.id ) )
		bg_texture = true;

	/* Loop through each row of the map */
	$.each( selected_map.data, function( tile_row, row ) {

		/* Loop through each col of the map */
		$.each( row, function( tile_col, cell ) {

			/* Check if this tile of the map matched the one we're looking for, or if it's blank, is it the same as the background texture */
			if( ( ( cell.texture_gid == selected_texture.group.gid ) && ( cell.texture_id == selected_texture.texture.id ) ) || ( ( bg_texture ) && ( ( cell.texture_gid == undefined ) && ( cell.texture_id == undefined ) ) ) ) {

				/* Cell is the texture we're looking for, found at (tile_row, tile_col) */
				var tile = $( "#map_editor #map_editor_table .map_editor_table_row[row_id=" + tile_row + "] .map_editor_table_cell[col_id=" + tile_col + "]" );

				if( texture_fill ) {

					/* We're filling this entire cell with the same colour */
					$( tile.find( "td" ) ).css("background", "#" + hex );
				} else {

					/* Get the cell of the pixel that was changed and update it */
					var pixel = $( tile.find( ".texture_table tr[row_id=" + ( ( cell.texture_reverse_y ) ? ( 7 - texture_row ) : texture_row ) + "] td[col_id=" + ( ( cell.texture_reverse_x ) ? ( 7 - texture_col ) : texture_col ) + "]" ) );

					if( hex != "" ) 
						pixel.css("background", "#" + hex );
					else 
						pixel.css("background", "#ccc" );
				}
			}
		} );
	} );
}

function load_texture_editor() {
	
	/* Hide delete confirmation prompt and show the toolbar */
	$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "none" );
	$( "#container #sidebar #texture_list_toolbar" ).css( "display", "flex" );

	if ( selected_texture.texture != false ) {

		/* Show fill and paint texture icons */
		$( "#texture_fill" ).css( "display", "block" );
		$( "#texture_paint" ).css( "display", "block" );
		$( "#texture_erase" ).css( "display", "block" );

		/* Show the editor */
		$( "#texture_editor" ).css( "display", "flex" );
		$( "#texture_editor_empty" ).css( "display", "none" );

		/* Setup the texture editor */
		$( "#texture_editor table tr" ).children().each( function() {
			
			if( ( selected_texture.texture.data[ $( this ).attr( "col_id" ) ][ $( this ).parent().attr( "row_id" ) ] != "") && ( selected_texture.texture.data[ $( this ).attr( "col_id" ) ][ $( this ).parent().attr( "row_id" ) ] != undefined) ) {
				$( this ).css( "background", "#" + selected_texture.texture.data[ $( this ).attr( "col_id" ) ][ $( this ).parent() .attr( "row_id" ) ] );
				$( this ).removeClass( "trans_background" );
			} else {
				$( this ).css( "background", false );
				$( this ).addClass( "trans_background" );
			}
		} );

		/* Show texture paint preview */
		load_texture_preview();

		/* Add all the other textures to the parent list */
		var selected_none = "";
		if( selected_texture.parent == -1 ) {
			selected_none = " selected";
		}
		$( "#texture_parent_selector" ).append( '<option value="-1"'+selected_none+'> - None - </option>' );

		$.each( project.textures, function( key, value ) {

			/* Check to see if this is a child element or not */
			if( value.parent == -1) {
				/* Select the current parent (if any) */
				var selected_parent = "";
				if( selected_texture.parent == value.id )
					selected_parent = " selected";
				
				/* Add texture to the list */
				$( "#texture_parent_selector" ).append( '<option value="'+value.id+'"'+selected_parent+'>'+value.name+'</option>' );
			}
		});
	} else {
		/* Clear the editor */
		$( "#texture_editor" ).css( "display", "none" );
		$( "#texture_editor_empty" ).css( "display", "flex" );

		/* Clear fill and paint texture icons */
		$( "#texture_fill" ).css( "display", "none" );
		$( "#texture_paint" ).css( "display", "none" );

		/* Clear the paint preview */
		clear_texture_paint_preview();
	}
}

function clear_texture_toolbar_event_listeners() {

	$( "#container #sidebar #texture_list_toolbar i:not( .texture_picker )" ).unbind( "click" );
}

function texture_toolbar_event_listeners() {

	/* Remove all event listeners */
	clear_texture_toolbar_event_listeners();

	/* texture toolbar event listeners */
	$( "#container #sidebar #texture_list_toolbar i:not( .texture_picker )" ).click(function() {
		
		/* Ignore clicks if controls are disabled */
		if( ( ( controls_disabled == false ) && ( drawing_functions == false ) ) || ( drawing_functions == 5 ) ) {

			var func = $( this ).attr( "func" );
			
			switch( func ) {
				case "back": /* Return to list of texture groups */

					selected_texture.texture = false;
					selected_texture.group = false;
					
					/* Reload texture list */
					load_texture_list();
					break;
				case "texture-erase": /* Erase pixels */

					if( drawing_functions != 5 ) {

						/* Switch to sprite erasing */
						drawing_functions = 5;

						/* Reset toolbar for a clean start */
						map_editor_toolbar_reset();
						
						/* Disable controls */
						disable_controls( false );

						/* Set eraser as selected tool */
						$( "#texture_erase" ).removeClass( "resize_disabled" );
						$( "#texture_erase" ).addClass( "selected_tool" );

						/* Add hover functionality to map editor */
						$( "#texture_editor table tr td" ).addClass( "map_editor_table_cell_draw" );

						/* Add event listener for the erase tool */
						$( "#texture_editor .map_editor_table_cell_draw" ).on( "mouseup" , function( e ) {

							/* Clear the pixel in the editor */
							$( this ).css( "background", false );
							$( this ).addClass( "trans_background" );

							/* Get the row and column */
							var pixel_row = $( this ).parent().attr( "row_id" );
							var pixel_col = $( this ).attr( "col_id" );

							/* Clear the pixel in the local array */
							selected_texture.texture.data[ pixel_col ][ pixel_row ] = undefined;

							/* Update the preview */
							texture_update( false, "", pixel_row, pixel_col )
						} );

					} else {
						/* Clear erase tool */				
						drawing_functions = false;

						/* Re-enable controls */
						enable_controls();

						/* Remove event listener */
						$( "#texture_editor .map_editor_table_cell_draw" ).unbind( "mouseup" );

						/* Remove paint brush as selected tool */
						$( "#texture_erase" ).removeClass( "selected_tool" );
						$( "#texture_editor table tr td" ).removeClass( "map_editor_table_cell_draw" );
					}
					
					
					break;
				case "new": /* Create a new texture */
				case "new-group": /* Create a new texture group */
				case "rename": /* Rename selected texture */
				case "duplicate": /* Duplicated selected texture */

					/* Clear the name input */
					$( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).val( "" );
					
					/* Show the rename input */
					$( "#container #sidebar #texture_list_toolbar" ).css( "display", "none" );
					$( "#container #sidebar #texture_list_toolbar_rename" ).css( "display", "flex" );

					/* Focus on input, add placeholder text and add event listeners */
					$( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).focus();
					
					/* Set the placeholder if we're renaming the selected texture */
					if( func == "rename" ) {
						if( selected_texture.texture == false ) {
							/* We're renaming the group name */
							$( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).attr( "placeholder", selected_texture.group.name );
							$( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).val( selected_texture.group.name );
						} else {
							/* We're renaming the texture name */
							$( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).attr( "placeholder", selected_texture.texture.name );
							$( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).val( selected_texture.texture.name );
						}
					} else {
						/* Set the placeholder if we're creating/duplicating a new texture or group */
						if(( selected_texture.texture != false ) || ( func == "new" ) ) $( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).attr( "placeholder", "New texture name" );
						else $( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).attr( "placeholder", "New group name" );
					}
					
					/* Add event listners to either save or discard change */
					$( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).on( "keyup blur", function( e ) {
						
						/* Save the change */
						if( e.key == "Enter" ) {

							/* Get entered name */
							var new_name = sanitise_input( $( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).val() );

							if( new_name.match( /^\d/ ) ) {
								
								alert( "Texture name cannot start with a number" );
							} else {

								/* Check if name already exists */
								var check_name = new_name.toLowerCase().replace( / /g, "_" );
								var check_array = project.textures.map( function( val ) {
									return val.name.toLowerCase().replace( / /g, "_" );;
								} );

								if( ( ( ( check_array.indexOf( check_name ) !== -1 ) && ( func != "rename" ) ) || ( ( check_array.indexOf( check_name ) !== -1 ) && ( func == "rename" ) && ( check_name != selected_texture.group.name.toLowerCase().replace( / /g, "_" ) ) ) ) && ( selected_texture.texture == false ) ) {
									
									alert( "Texture name already exits" );
								} else {

									if( ( func == "new" ) || ( func == "new-group" ) || ( func == "duplicate" ) ) {
										
										if(( selected_texture.group == false ) || ( ( selected_texture.texture == false ) && ( func == "duplicate" ) ) ) {
											
											/* We are creating a new group or duplicating an exisiting group */
											var new_group = new Object();
											new_group.name = new_name;

											/* Get new ID value */
											sort_texture_groups_by_gid();
											new_group.gid = ( project.textures.length != 0 ) ? ( project.textures[project.textures.length - 1].gid + 1 ) : 0;

											/* Get new order value */
											sort_texture_groups_by_gorder();
											new_group.gorder = ( project.textures.length != 0 ) ? ( project.textures[project.textures.length - 1].gorder + 1 ) : 0;
											/* Note we sort by order 2nd so the array goes back to the correct order */

											if( ( selected_texture.texture == false ) && ( func == "duplicate" ) ) {
												
												/* Duplicate existing textures into our new group */
												new_group.textures = new Array();
												$.extend( true, new_group.textures, selected_texture.group.textures ); /* Clone array */
											} else {
												
												/* Create a blank texture to initialise the group */
												var new_texture = new Object();
												new_texture.name = new_name;
												new_texture.id = 0;
												new_texture.order = 0;
												new_texture.data = Array.from( { length: 8 }, () => Array.from( { length: 8 }, () => "ffffff" ) );

												/* Add the blank texture to the array */
												new_group.textures = new Array();
												new_group.textures.push( new_texture );
											}

											/* Add the new texture into the local array*/
											project.textures.push( new_group );

											/* Let's also update the selected group to be our new one */
											selected_texture.group = new_group;

										} else {

											/* We are creating or duplicating a texture */
											var new_texture = new Object();
											new_texture.name = new_name;

											/* Get new ID value */
											sort_textures_by_id( selected_texture.group.gid );
											new_texture.id = selected_texture.group.textures[selected_texture.group.textures.length - 1].id + 1;

											/* Get new order value */
											sort_textures_by_order( selected_texture.group.gid );
											new_texture.order = selected_texture.group.textures[selected_texture.group.textures.length - 1].order + 1;
											/* Note we sort by order 2nd so the array goes back to the correct order */

											if( func == "duplicate" ) {
												
												/* Copy selected texture */
												new_texture.data = new Array();
												$.extend( true, new_texture.data, selected_texture.texture.data ); /* Clone array */
											} else {
												
												/* Create a blank canvas */
												new_texture.data = Array.from( { length: 8 }, () => Array.from( { length: 8 }, () => "ffffff" ) );
											}

											/* Add the new texture into the local array*/
											selected_texture.group.textures.push( new_texture );

											/* Select newly created texture */
											selected_texture.texture = new_texture;
										}
									}

									if( func == "rename" ) {
										if( selected_texture.texture == false ) {
											/* Rename current group in local array */
											selected_texture.group.name = new_name;
										} else {
											/* Rename current texture in local array */
											selected_texture.texture.name = new_name;								
										}
									}
								}
							}
							
							/* Exit new texture creation */
							$( "#container #sidebar #texture_list_toolbar" ).css( "display", "flex" );
							$( "#container #sidebar #texture_list_toolbar_rename" ).css( "display", "none" );
							
							/* Unbind event listeners */
							$( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).unbind( "keyup blur" );

							/* Reload texture list */
							load_texture_list();
						}

						/* Discard change */
						if( ( e.key == "Escape" ) || ( e.type == "blur" ) ) {
							/* Exit new texture creation */
							$( "#container #sidebar #texture_list_toolbar" ).css( "display", "flex" );
							$( "#container #sidebar #texture_list_toolbar_rename" ).css( "display", "none" );
							
							/* Unbind event listeners */
							$( "#container #sidebar #texture_list_toolbar_rename #texture_rename" ).unbind( "keyup blur" );
						}
					});
					break;
				case "delete": /* Delete the selected texture */

					/* Show the confirmation prompt */
					$( "#container #sidebar #texture_list_toolbar" ).css( "display", "none" );
					$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "flex" );

					/* Add event listners for escape key to discard change */
					$( document ).on( "keyup", function( e ) {
						
						if( e.key == "Escape" ) {
							/* Exit delete texture confirmation */
							$( "#container #sidebar #texture_list_toolbar" ).css( "display", "flex" );
							$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "none" );
							
							/* Unbind event listeners */
							$( document ).unbind( "keyup" );
							$( "#container #sidebar #texture_list_toolbar_delete input[type=button]" ).unbind( "click" );
						}
					});

					/* Add event listeners for buttons */
					$( "#container #sidebar #texture_list_toolbar_delete #texture_delete_y" ).click( function() {

						if( selected_texture.texture == false ) {

							/* Delete selected texture group from local array */
							project.textures = project.textures.filter(obj => obj.gid != selected_texture.group.gid);

							/* Reorder the groups in local array */
							var i = 0;
							$.each( project.textures, function( k, v ) {

								/* Give it it's new order and increment */
								v.gorder = i;
								i++;
							} );

							/* Clear the selected group */
							selected_texture.group = false;

						} else {

							/* Delete selected texture from local array */
							selected_texture.group.textures = selected_texture.group.textures.filter(obj => obj.id != selected_texture.texture.id);

							/* Loop through each map and remove any of these textures */
							$.each( project.maps, function( k, map ) {

								/* Loop through each row of the map */
								$.each( map.data, function( k, map_row ) {

									/* Get the tiles with matching texture */
									var map_tile = map_row.find( obj => ( ( obj.texture_gid == selected_texture.group.gid ) && ( obj.texture_id == selected_texture.texture.id ) ) );
									if( map_tile != undefined ) {

										/* Matching texture, let's remove it */
										map_tile.can_walk = [true, true, true, true];
										map_tile.texture_gid = undefined;
										map_tile.texture_id = undefined;
										map_tile.texture_reverse_x = false;
										map_tile.texture_reverse_y = false;
										map_tile.exit_tile = false;
										map_tile.exit_map_id = false;
										map_tile.top_layer = false;
										map_tile.exit_map_dir = [0, 0];
										map_tile.exit_map_pos = [0, 0];
									}
								} );
							} );

							/* Reload map editor */
							load_map_editor();

							if( selected_texture.group.textures.length == 0 ) {

								/* We deleted the last texture in the group, so delete the group too */
								project.textures = project.textures.filter(obj => obj.gid != selected_texture.group.gid);

								/* Reorder the groups in local array */
								var i = 0;
								$.each( project.textures, function( k, v ) {

									/* Give it it's new order and increment */
									v.gorder = i;
									i++;
								} );

								/* Clear the selected group */
								selected_texture.group = false;

							} else {

								/* Reorder the textures in local array */
								var i = 0;
								$.each( selected_texture.group.textures, function( k, v ) {

									/* Give it it's new order and increment */
									v.order = i;
									i++;
								} );
							}

							/* Clear the selected texture */
							selected_texture.texture = false;
						}

						/* Exit delete texture confirmation */
						$( "#container #sidebar #texture_list_toolbar" ).css( "display", "flex" );
						$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "none" );
						
						/* Unbind event listeners */
						$( document ).unbind( "keyup" );
						$( "#container #sidebar #texture_list_toolbar_delete input[type=button]" ).unbind( "click" );
						
						/* Reload texture list */
						load_texture_list();
					} );

					$( "#container #sidebar #texture_list_toolbar_delete #texture_delete_n" ).click( function() {

						/* Exit delete texture confirmation */
						$( "#container #sidebar #texture_list_toolbar" ).css( "display", "flex" );
						$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "none" );
						
						/* Unbind event listeners */
						$( document ).unbind( "keyup" );
						$( "#container #sidebar #texture_list_toolbar_delete input[type=button]" ).unbind( "click" );
					} );
					break;
			}
		}
	});
}

function clear_texture_list_sortable() {
	
	if ( $( "#texture_list .sortable" ).hasClass( "ui-sortable" ) ) {
		$( "#texture_list .sortable" ).sortable( "destroy" );
	
		/* Remove all event listeners */
		$( "#texture_list .sortable" ).unbind( "sortstart" );
		$( "#texture_list .sortable" ).unbind( "sortstop" );
		$( "#texture_list .sortable" ).unbind( "selectstart" );
	}
}

function texture_list_sortable() {
	
	/* Destroy existing sortable list */
	clear_texture_list_sortable();

	if( selected_texture.group == false ) {
		var sort_highlight_class = "ui-state-group-highlight";
	} else {
		var sort_highlight_class = "ui-state-texture-highlight";
	}

	/* Turn texture list into a sortable list */
	$( "#texture_list .sortable" ).sortable( {
		placeholder: sort_highlight_class,
		items: "li:not(.ui-state-disabled)",
		delay: 200
	} );
	$( "#texture_list .sortable" ).disableSelection();

	/* Add sortable list event listeners */
	$( "#texture_list .sortable" ).on( "sortstart", function( e, ui ) {

		/* Temporarily ignore onClick event listener */
		$( this ).css( "pointer-events", "none" );
	} );
	$( "#texture_list .sortable" ).on( "sortstop", function( e, ui ) {
		/* Once drag and drop ends, save the new order */

		/* Store the currently selected texture */
		var temp_selected_texture = (selected_texture != 0) ? selected_texture.id : -1;

		/* Create a new blank array that will temporarily hold the new order */
		var newOrderArray = new Array();

		/* Add each texture object in order */
		var i = 0;

		if( selected_texture.group != false ) {

			/* We're sorting textures */
			$.each( $( "#texture_list .sortable" ).children( ":not(.ui-state-disabled)" ), function( k, v ) {
				
				/* Get texture objects in sort order */
				var texture_obj = selected_texture.group.textures.find( obj => obj.id == $( v ).attr( "texture_id" ) );

				/* Give it it's new order and increment */
				texture_obj.order = i;
				i++;

				/* Add it to the temporary array */
				newOrderArray.push( texture_obj );
			} );

			/* Set the new order in the local array */
			selected_texture.group.textures = newOrderArray;
		} else {

			/* We're sorting groups */
			$.each( $( "#texture_list .sortable" ).children(), function( k, v ) {
				
				/* Get texture objects in sort order */
				var texture_obj = project.textures.find( obj => obj.gid == $( v ).attr( "g_texture_id" ) );

				/* Give it it's new order and increment */
				texture_obj.gorder = i;
				i++;

				/* Add it to the temporary array */
				newOrderArray.push( texture_obj );
			} );

			/* Set the new order in the local array */
			project.textures = newOrderArray;
		}
					
		/* Reload texture list */
		load_texture_list();

		/* Re-instate onClick event listener */
		$( this ).css( "pointer-events", "auto" );
	} );
}

function sort_texture_groups_by_gid() {
	
	project.textures.sort( function( a, b ) {
		return ((a.gid < b.gid) ? -1 : ((a.gid > b.gid) ? 1 : 0));
	} );
}

function sort_texture_groups_by_gorder() {
	
	project.textures.sort( function( a, b ) {
		return ((a.gorder < b.gorder) ? -1 : ((a.gorder > b.gorder) ? 1 : 0));
	} );
}

function sort_textures_by_id( gid ) {
	
	var sort_group = project.textures.find( obj => obj.gid == gid );

	sort_group.textures.sort( function( a, b ) {
		return ((a.id < b.id) ? -1 : ((a.id > b.id) ? 1 : 0));
	} );
}

function sort_textures_by_order( gid ) {
	
	var sort_group = project.textures.find( obj => obj.gid == gid );

	sort_group.textures.sort( function( a, b ) {
		return ((a.order < b.order) ? -1 : ((a.order > b.order) ? 1 : 0));
	} );
}

function sort_texture_array_by_gorder( array ) {
	
	array.sort( function( a, b ) {
		return ((a.gorder < b.gorder) ? -1 : ((a.gorder > b.gorder) ? 1 : 0));
	} );
}