function load_sprite_list() {

	/* Clear sprite list */
	$( "#sprite_list .sortable" ).html( "" );
	$( "#sprite_list .sortable li" ).css( "color", "#000" );

	/* Clear map editing icons */
	$( "#map_toolbar_paint" ).css( "display", "none" );
	$( "#map_toolbar_fill" ).css( "display", "none" );
	$( "#map_toolbar_flip_h" ).css( "display", "none" );
	$( "#map_toolbar_flip_v" ).css( "display", "none" );
	
	/* Check if we are showing groups or sprites */
	if( selected_sprite.group == false ) {
		/* Groups */
		sort_groups_by_gorder();

		$.each( project.sprites, function( key, value ) {
			$( "#sprite_list .sortable" ).append( '<li class="ui-state-default ui-group" g_sprite_id="'+value.gid+'">'+value.gorder+': '+value.name+' ('+value.gid+')</li>' );
		} );

		/* Clear the current sprite id */
		selected_sprite.sprite = false;

		/* Set the icons */
		$( "#toolbar_new_group" ).css( "display", "block" );
		$( "#toolbar_new_sprite" ).css( "display", "none" );
		$( "#toolbar_back" ).css( "display", "none" );
		$( "#container #sidebar #sprite_list_toolbar #toolbar_right" ).css( "display", "none" );


	} else {
		/* Sprites */
		sort_sprites_by_order( selected_sprite.group.gid );

		/* Add the group name */
		$( "#sprite_list .sortable" ).append( '<li class="ui-state-default ui-state-disabled ui-group" g_sprite_id="'+selected_sprite.group.gid+'">'+selected_sprite.group.name+' ('+selected_sprite.group.gid+')</li>' );

		$.each( selected_sprite.group.sprites, function( key, value ) {
			$( "#sprite_list .sortable" ).append( '<li class="ui-state-default ui-sprite" sprite_id="'+value.id+'">'+value.order+': '+value.name+' ('+value.id+')</li>' );
		} );

		if( selected_sprite.sprite == false ) {
			/* Highlight parent group */
			$( "#sprite_list .sortable li[g_sprite_id='"+selected_sprite.group.gid+"']" ).css( "color", "#154561" );
		} else {
			/* Highlight selected sprite */
			$( "#sprite_list .sortable li[sprite_id='"+selected_sprite.sprite.id+"']" ).css( "color", "#195170" );

			/* Store the sprite state */
			selected_sprite.sprite_reverse_x = false;
			selected_sprite.sprite_reverse_y = false;

			/* Show map editing icons */
			$( "#map_toolbar_paint" ).css( "display", "block" );
			$( "#map_toolbar_fill" ).css( "display", "block" );
			$( "#map_toolbar_flip_h" ).css( "display", "block" );
			$( "#map_toolbar_flip_v" ).css( "display", "block" );
		}

		/* Set the icons */
		$( "#toolbar_new_group" ).css( "display", "none" );
		$( "#toolbar_new_sprite" ).css( "display", "block" );
		$( "#toolbar_back" ).css( "display", "block" );
		$( "#container #sidebar #sprite_list_toolbar #toolbar_right" ).css( "display", "flex" );
	}

	/* Add event listeners to the list */
	sprite_list_event_listeners();
	
	/* Add sorting capability */
	if( drawing_functions == false ) sprite_list_sortable();
	
	/* Reload Sprite Editor */
	load_sprite_editor();

	/* Disable hovering for draw functions */
	if( drawing_functions == 1 )
		$( "#container #sidebar #sprite_list #sprite_list .sortable .ui-group" ).addClass( "resize_disabled" );
	else if( drawing_functions == 2 )
		$( "#container #sidebar #sprite_list #sprite_list .sortable li" ).addClass( "resize_disabled" );

	/* Disable cursor on sprite editor */
	if( drawing_functions != false )
		$( ".picker" ).addClass( "auto_cursor" );
}

function clear_sprite_list_event_listeners() {
	
	$( "#sprite_list .sortable li" ).unbind( "click" );
	$( "#sprite_list" ).unbind( "click" ); /* For click out - not implemented */
}

function sprite_list_event_listeners() {
	
	/* Remove existing event listeners */
	clear_sprite_list_event_listeners();

	/* Add onClick event listeners */
	$( "#sprite_list .sortable li" ).on( "click" , function( e ) {

		/* Ignore clicks on the items in the sprite list when resizing the canvas or erasing */
		if( ( map_resizing.en == false ) && ( drawing_functions != 2 ) ) {

			if( selected_sprite.group == false ) {
				/* Top level click, no sprite or group selected */
				selected_sprite.group = project.sprites.find( obj => obj.gid == $( this ).attr( "g_sprite_id" ) );
				load_sprite_list();
			} else {
				/* Group level click - either sprite or parent group selected */
				if( ( $( this ).hasClass( "ui-group" ) ) && ( drawing_functions == 1 ) ) {
					/* Ignore clicks on groups when drawing */
				} else {
					if( $( this ).attr( "sprite_id" ) != undefined) {
						/* Set selected sprite */
						selected_sprite.sprite = selected_sprite.group.sprites.find( obj => obj.id == $( this ).attr( "sprite_id" ) );
					} else {	
						/* Clear selected sprite */
						selected_sprite.sprite = false;
					}

					/* Reload sprite list */
					load_sprite_list();
				}
			}
		}
	});
}

function load_sprite_preview() {

	/* Setup the sprite paint preview */
	$( "#container #toolbar #map_paint_preview" ).css( "display", "block" );
	$( "#container #toolbar #map_paint_preview" ).html( "<table></table>" );
	
	/* Add 8 rows */
	for(i=0; i<8; i++)
		$( "#map_paint_preview table" ).append( '<tr row_id="' + i + '"></tr>' );

	/* Add 8 cells for each row and set background color */
	$( "#map_paint_preview table" ).children().each( function() {

		for(i=0; i<8; i++) {

			/* Deal with it being flipped */
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

			$( '<td col_id="'+i+'" class="picker"></td>' ).appendTo( $(this) ).css( "background", "#" + selected_sprite.sprite.data[col_sel][row_sel]);
		}
	} );

	/* Add styling if painting */
	if( ( drawing_functions == 1 ) ) set_map_tile_settings_styles();
}

function clear_sprite_paint_preview() {
	
	/* Clear the sprite paint preview */
	$( "#container #toolbar #map_paint_preview" ).html( "" );
	$( "#container #toolbar #map_paint_preview" ).css( "display", "none" );
}

function clear_sprite_editor_colour_pickers() {
	
	$( '.colpick_hex' ).remove();
}

function load_sprite_editor() {

	/* Remove existing colour pickers */
	clear_sprite_editor_colour_pickers();
	
	/* Clear parent selector */
	$( "#sprite_parent_selector" ).html( "" );
	/* Hide delete confirmation prompt and show the toolbar */
	$( "#container #sidebar #sprite_list_toolbar_delete" ).css( "display", "none" );
	$( "#container #sidebar #sprite_list_toolbar" ).css( "display", "flex" );

	if ( selected_sprite.sprite != false ) {

		/* Setup the sprite editor */
		$( "#sprite_editor" ).html( "<table></table>" );
		
		/* Add 8 rows */
		for(i=0; i<8; i++)
			$( "#sprite_editor table" ).append( '<tr row_id="' + i + '"></tr>' );

		/* Add 8 cells for each row and set background color */
		$( "#sprite_editor table" ).children().each( function() {
			for(i=0; i<8; i++)
				$( '<td col_id="'+i+'" class="picker"></td>' ).appendTo( $(this) ).css( "background", "#" + selected_sprite.sprite.data[i][ $( this ).attr( "row_id" ) ]);
		} );

		/* Add in the colour pickers */
		$( '.picker' ).colpick( {
			layout: "hex",
			submit: "OK",
			onShow: function( e ) {
				if( ( map_resizing.en == true ) || ( drawing_functions != false ) ) {
					/* Hide the colour picker */
					return false;
				}

				/* Set the colour picker to show the currently selected colour */
				$( this ).colpickSetColor( selected_sprite.sprite.data[ $( this ).attr( "col_id" ) ][ $( this ).parent().attr( "row_id" ) ], true );
			},
			onSubmit: function( hsb, hex, rgb, e ) {

				/* After selecting the chosen colour, update the cell background */
				$( this.el ).css("background", "#" + hex );

				/* Update the local array */
				selected_sprite.sprite.data[ $( this.el ).attr( "col_id" ) ][ $( this.el ).parent().attr( "row_id" ) ] = hex;
				
				/* Update sprite paint preview */
				load_sprite_preview();






				/* Add functionality to update any sprites on the map */








				/* Hide the colour picker */
				$( e ).colpickHide();
			}
		} );

		/* Show sprite paint preview */
		load_sprite_preview();

		/* Add all the other sprites to the parent list */
		var selected_none = "";
		if( selected_sprite.parent == -1 ) {
			selected_none = " selected";
		}
		$( "#sprite_parent_selector" ).append( '<option value="-1"'+selected_none+'> - None - </option>' );

		$.each( project.sprites, function( key, value ) {
			/* Check to see if this is a child element or not */
			if( value.parent == -1) {
				/* Select the current parent (if any) */
				var selected_parent = "";
				if( selected_sprite.parent == value.id )
					selected_parent = " selected";
				
				/* Add sprite to the list */
				$( "#sprite_parent_selector" ).append( '<option value="'+value.id+'"'+selected_parent+'>'+value.name+'</option>' );
			}
		});
	} else {
		/* Clear the editor */
		$( "#sprite_editor" ).html( "Select a sprite" );

		/* Clear the paint preview */
		clear_sprite_paint_preview();
	}
}

function clear_sprite_toolbar_event_listeners() {
	
	$( "#container #sidebar #sprite_list_toolbar i" ).unbind( "click" );
}

function sprite_toolbar_event_listeners() {

	/* Remove all event listeners */
	clear_sprite_toolbar_event_listeners();

	/* Sprite toolbar event listeners */
	$( "#container #sidebar #sprite_list_toolbar i" ).click(function() {
		
		if( ( map_resizing.en == false ) && ( drawing_functions == false ) ) {

			var func = $( this ).attr( "func" );
			
			switch( func ) {
				case "back": /* Return to list of sprite groups */

					selected_sprite.sprite = false;
					selected_sprite.group = false;
					
					/* Reload sprite list */
					load_sprite_list();
					break;

				case "new": /* Create a new sprite */
				case "new-group": /* Create a new group */
				case "rename": /* Rename selected sprite */
				case "duplicate": /* Duplicated selected sprite */

					/* Clear the name input */
					$( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).val( "" );
					
					/* Show the rename input */
					$( "#container #sidebar #sprite_list_toolbar" ).css( "display", "none" );
					$( "#container #sidebar #sprite_list_toolbar_rename" ).css( "display", "flex" );

					/* Focus on input, add placeholder text and add event listeners */
					$( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).focus();
					
					/* Set the placeholder if we're renaming the selected sprite */
					if( func == "rename" ) {
						if( selected_sprite.sprite == false ) {
							/* We're renaming the group name */
							$( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).attr( "placeholder", selected_sprite.group.name );
						} else {
							/* We're renaming the sprite name */
							$( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).attr( "placeholder", selected_sprite.sprite.name );
						}
					} else {
						/* Set the placeholder if we're creating/duplicating a new sprite or group */
						if(( selected_sprite.sprite != false ) || ( func == "new" ) ) $( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).attr( "placeholder", "New sprite name" );
						else $( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).attr( "placeholder", "New group name" );
					}
					
					/* Add event listners to either save or discard change */
					$( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).on( "keyup blur", function( e ) {
						
						/* Save the change */
						if( e.key == "Enter" ) {

							/* Get entered name */
							var new_name = $( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).val();

							if( ( func == "new" ) || ( func == "new-group" ) || ( func == "duplicate" ) ) {
								
								if(( selected_sprite.group == false ) || ( ( selected_sprite.sprite == false ) && ( func == "duplicate" ) ) ) {
									/* We are creating a new group or duplicating an exisiting group */
									var new_group = new Object();
									new_group.name = new_name;

									/* Get new GID value */
									sort_groups_by_gid();
									new_group.gid = project.sprites[project.sprites.length - 1].gid + 1;

									/* Get new order value */
									sort_groups_by_gorder();
									new_group.gorder = project.sprites[project.sprites.length - 1].gorder + 1;
									/* Note we sort by order 2nd so the array goes back to the correct order */

									if( ( selected_sprite.sprite == false ) && ( func == "duplicate" ) ) {
										/* Duplicate existing sprites into our new group */
										new_group.sprites = new Array();
										$.extend( true, new_group.sprites, selected_sprite.group.sprites ); /* Clone array */
									} else {
										/* Create a blank sprite to initialise the group */
										var new_sprite = new Object();
										new_sprite.name = new_name;
										new_sprite.id = 0;
										new_sprite.order = 0;
										new_sprite.data = Array.from( { length: 8 }, () => Array.from( { length: 8 }, () => "ffffff" ) );

										/* Add the blank sprite to the array */
										new_group.sprites = new Array();
										new_group.sprites.push( new_sprite );
									}

									/* Add the new sprite into the local array*/
									project.sprites.push( new_group );

									/* Let's also update the selected group to be our new one */
									selected_sprite.group = new_group;

								} else {
									/* We are creating or duplicating a sprite */
									var new_sprite = new Object();
									new_sprite.name = new_name;

									/* Get new GID value */
									sort_sprites_by_id( selected_sprite.group.gid );
									new_sprite.id = selected_sprite.group.sprites[selected_sprite.group.sprites.length - 1].id + 1;

									/* Get new order value */
									sort_sprites_by_order( selected_sprite.group.gid );
									new_sprite.order = selected_sprite.group.sprites[selected_sprite.group.sprites.length - 1].order + 1;
									/* Note we sort by order 2nd so the array goes back to the correct order */

									if( func == "duplicate" ) {
										/* Copy selected sprite */
										new_sprite.data = new Array();
										$.extend( true, new_sprite.data, selected_sprite.sprite.data ); /* Clone array */
									} else {
										/* Create a blank canvas */
										new_sprite.data = Array.from( { length: 8 }, () => Array.from( { length: 8 }, () => "ffffff" ) );
									}

									/* Add the new sprite into the local array*/
									selected_sprite.group.sprites.push( new_sprite );

									/* Select newly created sprite */
									selected_sprite.sprite = new_sprite;
								}
							}

							if( func == "rename" ) {
								if( selected_sprite.sprite == false ) {
									/* Rename current group in local array */
									selected_sprite.group.name = new_name;
								} else {
									/* Rename current sprite in local array */
									selected_sprite.sprite.name = new_name;								
								}
							}
							
							/* Exit new sprite creation */
							$( "#container #sidebar #sprite_list_toolbar" ).css( "display", "flex" );
							$( "#container #sidebar #sprite_list_toolbar_rename" ).css( "display", "none" );
							
							/* Unbind event listeners */
							$( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).unbind( "keyup blur" );

							/* Reload sprite list */
							load_sprite_list();
						}

						/* Discard change */
						if( ( e.key == "Escape" ) || ( e.type == "blur" ) ) {
							/* Exit new sprite creation */
							$( "#container #sidebar #sprite_list_toolbar" ).css( "display", "flex" );
							$( "#container #sidebar #sprite_list_toolbar_rename" ).css( "display", "none" );
							
							/* Unbind event listeners */
							$( "#container #sidebar #sprite_list_toolbar_rename #sprite_rename" ).unbind( "keyup blur" );
						}
					});
					break;

				case "delete": /* Delete the selected sprite */

					/* Show the confirmation prompt */
					$( "#container #sidebar #sprite_list_toolbar" ).css( "display", "none" );
					$( "#container #sidebar #sprite_list_toolbar_delete" ).css( "display", "flex" );

					/* Add event listners for escape key to discard change */
					$( document ).on( "keyup", function( e ) {
						
						if( e.key == "Escape" ) {
							/* Exit delete sprite confirmation */
							$( "#container #sidebar #sprite_list_toolbar" ).css( "display", "flex" );
							$( "#container #sidebar #sprite_list_toolbar_delete" ).css( "display", "none" );
							
							/* Unbind event listeners */
							$( document ).unbind( "keyup" );
							$( "#container #sidebar #sprite_list_toolbar_delete #sprite_delete_y" ).unbind( "click" );
						}
					});

					/* Add event listeners for buttons */
					$( "#container #sidebar #sprite_list_toolbar_delete #sprite_delete_y" ).click( function() {

						if( selected_sprite.sprite == false ) {

							/* Delete selected group from local array */
							project.sprites = project.sprites.filter(obj => obj.gid != selected_sprite.group.gid);

							/* Reorder the groups in local array */
							var i = 0;
							$.each( project.sprites, function( k, v ) {

								/* Give it it's new order and increment */
								v.gorder = i;
								i++;
							} );

							/* Clear the selected group */
							selected_sprite.group = false;

						} else {

							/* Delete selected sprite from local array */
							selected_sprite.group.sprites = selected_sprite.group.sprites.filter(obj => obj.id != selected_sprite.sprite.id);

							/* Loop through each map and remove any of these sprites */
							$.each( project.maps, function( k, map ) {

								/* Loop through each row of the map */
								$.each( map.data, function( k, map_row ) {

									/* Get the tiles with matching sprite */
									var map_tile = map_row.find( obj => ( ( obj.sprite_gid == selected_sprite.group.gid ) && ( obj.sprite_id == selected_sprite.sprite.id ) ) );
									if( map_tile != undefined ) {

										/* Matching sprite, let's remove it */
										map_tile.can_walk = [true, true, true, true];
										map_tile.sprite_gid = undefined;
										map_tile.sprite_id = undefined;
										map_tile.sprite_reverse_x = false;
										map_tile.sprite_reverse_y = false;
										map_tile.exit_tile = false;
										map_tile.exit_map_id = false;
										map_tile.exit_map_dir = [0, 0];
										map_tile.exit_map_pos = [0, 0];
									}
								} );
							} );

							/* Reload map editor */
							load_map_editor();							

							if( selected_sprite.group.sprites.length == 0 ) {

								/* We deleted the last sprite in the group, so delete the group too */
								project.sprites = project.sprites.filter(obj => obj.gid != selected_sprite.group.gid);

								/* Reorder the groups in local array */
								var i = 0;
								$.each( project.sprites, function( k, v ) {

									/* Give it it's new order and increment */
									v.gorder = i;
									i++;
								} );

								/* Clear the selected group */
								selected_sprite.group = false;

							} else {

								/* Reorder the sprites in local array */
								var i = 0;
								$.each( selected_sprite.group.sprites, function( k, v ) {

									/* Give it it's new order and increment */
									v.order = i;
									i++;
								} );
							}

							/* Clear the selected sprite */
							selected_sprite.sprite = false;
						}

						/* Exit delete sprite confirmation */
						$( "#container #sidebar #sprite_list_toolbar" ).css( "display", "flex" );
						$( "#container #sidebar #sprite_list_toolbar_delete" ).css( "display", "none" );
						
						/* Unbind event listeners */
						$( document ).unbind( "keyup" );
						$( "#container #sidebar #sprite_list_toolbar_delete #sprite_delete_y" ).unbind( "click" );
						
						/* Reload sprite list */
						load_sprite_list();
					} );

					$( "#container #sidebar #sprite_list_toolbar_delete #sprite_delete_n" ).click( function() {
						/* Exit delete sprite confirmation */
						$( "#container #sidebar #sprite_list_toolbar" ).css( "display", "flex" );
						$( "#container #sidebar #sprite_list_toolbar_delete" ).css( "display", "none" );
						
						/* Unbind event listeners */
						$( document ).unbind( "keyup" );
						$( "#container #sidebar #sprite_list_toolbar_delete #sprite_delete_y" ).unbind( "click" );
					} );
					break;
			}
		}
	});
}

function clear_sprite_list_sortable() {
	
	if ( $( "#sprite_list .sortable" ).hasClass( "ui-sortable" ) ) {
		$( "#sprite_list .sortable" ).sortable( "destroy" );
	
		/* Remove all event listeners */
		$( "#sprite_list .sortable" ).unbind( "sortstart" );
		$( "#sprite_list .sortable" ).unbind( "sortstop" );
		$( "#sprite_list .sortable" ).unbind( "selectstart" );
	}
}

function sprite_list_sortable() {
	
	/* Destroy existing sortable list */
	clear_sprite_list_sortable();

	if( selected_sprite.group == false ) {
		var sort_highlight_class = "ui-state-group-highlight";
	} else {
		var sort_highlight_class = "ui-state-sprite-highlight";
	}

	/* Turn sprite list into a sortable list */
	$( "#sprite_list .sortable" ).sortable( {
		placeholder: sort_highlight_class,
		items: "li:not(.ui-state-disabled)",
		delay: 200
	} );
	$( "#sprite_list .sortable" ).disableSelection();

	/* Add sortable list event listeners */
	$( "#sprite_list .sortable" ).on( "sortstart", function( e, ui ) {

		/* Temporarily ignore onClick event listener */
		$( this ).css("pointer-events", "none");
	} );
	$( "#sprite_list .sortable" ).on( "sortstop", function( e, ui ) {
		/* Once drag and drop ends, save the new order */

		/* Store the currently selected sprite */
		var temp_selected_sprite = (selected_sprite != 0) ? selected_sprite.id : -1;

		/* Create a new blank array that will temporarily hold the new order */
		var newOrderArray = new Array();

		/* Add each sprite object in order */
		var i = 0;

		if( selected_sprite.group != false ) {

			/* We're sorting sprites */
			$.each( $( "#sprite_list .sortable" ).children( ":not(.ui-state-disabled)" ), function( k, v ) {
				
				/* Get sprite objects in sort order */
				var sprite_obj = selected_sprite.group.sprites.find( obj => obj.id == $( v ).attr( "sprite_id" ) );

				/* Give it it's new order and increment */
				sprite_obj.order = i;
				i++;

				/* Add it to the temporary array */
				newOrderArray.push( sprite_obj );
			} );

			/* Set the new order in the local array */
			selected_sprite.group.sprites = newOrderArray;

		} else {

			/* We're sorting groups */
			$.each( $( "#sprite_list .sortable" ).children(), function( k, v ) {
				
				/* Get sprite objects in sort order */
				var sprite_obj = project.sprites.find( obj => obj.gid == $( v ).attr( "g_sprite_id" ) );

				/* Give it it's new order and increment */
				sprite_obj.gorder = i;
				i++;

				/* Add it to the temporary array */
				newOrderArray.push( sprite_obj );
			} );

			/* Set the new order in the local array */
			project.sprites = newOrderArray;

		}
					
		/* Reload sprite list */
		load_sprite_list();

		/* Re-instate onClick event listener */
		$( this ).css("pointer-events", "auto");
	} );
}

function sort_groups_by_gid() {
	
	project.sprites.sort( function( a, b ) {
		return ((a.gid < b.gid) ? -1 : ((a.gid > b.gid) ? 1 : 0));
	} );
}

function sort_groups_by_gorder() {
	
	project.sprites.sort( function( a, b ) {
		return ((a.gorder < b.gorder) ? -1 : ((a.gorder > b.gorder) ? 1 : 0));
	} );
}

function sort_sprites_by_id( gid ) {
	
	var sort_group = project.sprites.find( obj => obj.gid == gid );

	sort_group.sprites.sort( function( a, b ) {
		return ((a.id < b.id) ? -1 : ((a.id > b.id) ? 1 : 0));
	} );
}

function sort_sprites_by_order( gid ) {
	
	var sort_group = project.sprites.find( obj => obj.gid == gid );

	sort_group.sprites.sort( function( a, b ) {
		return ((a.order < b.order) ? -1 : ((a.order > b.order) ? 1 : 0));
	} );
}