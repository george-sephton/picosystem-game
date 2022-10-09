/* Removed from <head>
<link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css" />
Causes issues with sortable lists if including a local version for some reason.
*/

function load_project_view() {

	/* Show project view elements */
	$( "#container #sidebar" ).css( "display", "none" );
	$( "#container #sidebar #texture_list_toolbar_rename" ).css( "display", "none" );
	$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "none" );

	$( "#container #content" ).css( "max-width", "100%" );

	$( "#container #content #toolbar #upload_settings" ).css( "display", "none" );
	$( "#container #content #toolbar #settings" ).css( "display", "flex" );
	$( "#container #content #toolbar #settings #name_input_container" ).css( "display", "flex" );
	$( "#container #content #toolbar #settings #name_input_container #name_input" ).attr( "disabled", "disabled" );
	$( "#container #content #toolbar #settings #name_input_container #name_input" ).val( "" );

	$( "#container #toolbar #map_settings" ).css( "display", "none" );

	$( "#container #content #toolbar #settings #controls" ).css( "display", "flex" );
	$( "#container #content #toolbar #settings #map_confirm" ).css( "display", "none" );

	$( "#container #content #toolbar #map_paint_preview" ).css( "display", "none" );
	$( "#container #content #toolbar #map_paint_settings" ).css( "display", "none" );
	$( "#container #content #toolbar #map_size_settings" ).css( "display", "none" );

	$( "#container #content #project_view #sprite_editor_container #sprite_editor" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_editor_container #sprite_editor_empty" ).css( "display", "flex" );

	$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar" ).css( "display", "flex" );
	$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar #toolbar_right" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar #toolbar_new_sprite" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar #toolbar_back" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar #sprite_list_toolbar_new_group" ).css( "display", "none" );

	$( "#container #content #project_view" ).css( "display", "flex" );
	$( "#container #content #project_view #sprite_editor_container" ).css( "display", "flex" );
	$( "#container #content #project_view #sprite_list_container" ).css( "display", "flex" );

	$( "#container #content #project_view #map_list_container" ).css( "display", "flex" );
	$( "#container #content #project_view #map_list_container #map_list_toolbar" ).css( "display", "flex" );
	$( "#container #content #project_view #map_list_container #map_list_new_map_name" ).css( "display", "none" );

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

	/* Toolbar event listeners */
	project_toolbar_event_listeners();
	sprite_toolbar_event_listeners();

	/* Load sprite list */
	load_sprite_list();
}

function close_project_view() {

	/* Clear all event listeners */
	clear_map_list_event_listeners();
	clear_project_toolbar_event_listeners();
	clear_map_list_sortable();

	/* Close any open sprites */
	selected_sprite.group = false;
	selected_sprite.sprite = false;

	/* Clear project elements */
	$( "#container #content #map_list .sortable" ).html( "" );

}

function load_map_list() {

	/* Clear texture list */
	$( "#map_list .sortable" ).html( "" );
	$( "#map_list .sortable li" ).css( "color", "#000" );

	/* Add project name */
	$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", decodeURI( project.name ) );
	
	if( project.maps.length != 0 ) {

	 	/* Sort maps into order */
		sort_maps_by_order();

		/* Add all the maps to the list */
		$.each( project.maps, function( key, value ) {
			$( "#map_list .sortable" ).append( '<li class="ui-state-default" map_id="' + value.id + '">' + value.name + '</li>' );
		} );

		/* Add event listeners to the list */
		map_list_event_listeners();
	
		/* Add sorting capability */
		map_list_sortable();	
	}

	/* Set the icons */
	$( "#toolbar_new_group" ).css( "display", "block" );
	$( "#toolbar_new_texture" ).css( "display", "none" );
	$( "#toolbar_back" ).css( "display", "none" );
	$( "#container #sidebar #texture_list_toolbar #toolbar_right" ).css( "display", "none" );
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
		
		/* Ignore clicks on the items in the sprite list when controls are disabled */
		if( controls_disabled == false ) {
			
			/* Set the map */
			var map_obj = project.maps.find( obj => obj.id == $( this ).attr( "map_id" ) );
			selected_map = map_obj;

			/* Close the project view */
			close_project_view();

			/* Open the map editor view */
			load_map_editing_view();
		}
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
	$( "#container #toolbar #settings #controls i, #container #content #project_view #map_list_container #map_list_toolbar i" ).on( "click", function() {

		/* Check if functions are disabled */
		if( controls_disabled == false ) {

			var func = $( this ).attr( "func" );

			switch( func ) {
				case "new-map":
					
					/* Reset toolbar for a clean start */
					map_editor_toolbar_reset();

					/* Disable controls - don't hide the name input */
					disable_controls( false );

					$( "#container #content #project_view #map_list_container #map_list_toolbar" ).css( "display", "none" );
					$( "#container #content #project_view #map_list_container #map_list_new_map_name" ).css( "display", "flex" );

					$( "#container #content #project_view #map_list_container #map_list_new_map_name #new_map_name" ).val( "" );
					$( "#container #content #project_view #map_list_container #map_list_new_map_name #new_map_name" ).attr( "placeholder", "Enter new map name" );
					$( "#container #content #project_view #map_list_container #map_list_new_map_name #new_map_name" ).focus();

					/* Add event listeners */
					$( "#container #content #project_view #map_list_container #map_list_new_map_name #new_map_name" ).on( "keyup blur", function( e ) {

						/* Save the change */
						if( e.key == "Enter" ) {

							var map_name_value = sanitise_input( $( this ).val() );

							if( map_name_value.match( /^\d/ ) ) {
								
								alert( "Map name cannot start with a number" );
							} else {

								/* Check if name already exists */
								var check_name = map_name_value.toLowerCase().replace( / /g, "_" );
								var check_array = project.maps.map( function( val ) {
									return val.name.toLowerCase().replace( / /g, "_" );;
								} );

								if( check_array.indexOf( check_name ) !== -1 ) {

									alert( "Map name already exits" );
								} else {

									if( map_name_value != "" ) {

										/* Duplicate current map */
										new_map = new Object();
										
										/* Set the new name */
										new_map.name = map_name_value;

										/* Give it a blank canvas */
										var blank_tile = new Object();
										blank_tile.can_walk = [true, true, true, true];
										blank_tile.texture_gid = undefined;
										blank_tile.texture_id = undefined;
										blank_tile.texture_reverse_x = false;
										blank_tile.texture_reverse_y = false;
										blank_tile.exit_tile = false;
										blank_tile.exit_map_id = false;
										blank_tile.interact_en = false;
										blank_tile.interact_id = false;
										blank_tile.npc_en = false;
										blank_tile.npc_id = false;
										blank_tile.top_layer = false;
										blank_tile.exit_map_dir = [0, 0];
										blank_tile.exit_map_pos = [0, 0];

										new_map.width = 8;
										new_map.height = 8;
										new_map.can_run = false;
										new_map.bg_texture = new Object();
										new_map.bg_texture.gid = undefined;
										new_map.bg_texture.id = undefined;
										new_map.data = Array.from( { length: new_map.height }, () => Array.from( { length: new_map.width }, () => Object.assign( {}, blank_tile ) ) );

										/* Get new ID value */
										sort_maps_by_id();
										new_map.id = ( project.maps.length != 0 ) ? ( project.maps[project.maps.length - 1].id + 1 ) : 0;

										/* Get new order value */
										sort_maps_by_order();
										new_map.order = ( project.maps.length != 0 ) ? ( project.maps[project.maps.length - 1].order + 1 ) : 0;
										/* Note we sort by order 2nd so the array goes back to the correct order */

										/* Add the duplicated map to the array */
										project.maps.push( new_map );

										/* Close the project view */
										close_project_view();

										/* Open the map editor view */
										selected_map = project.maps.find( obj => obj.id == new_map.id );
										load_map_editing_view();
									}
								}
							}

							/* Put things back the way they were */
							$( "#container #content #project_view #map_list_container #map_list_toolbar" ).css( "display", "flex" );
							$( "#container #content #project_view #map_list_container #map_list_new_map_name" ).css( "display", "none" );
							$( "#container #content #project_view #map_list_container #map_list_new_map_name #new_map_name" ).val( "" );

							/* Re-enable controls */
							enable_controls();

							/* Remove event listeners */
							$( "#container #content #project_view #map_list_container #map_list_new_map_name #new_map_name" ).unbind( "keyup blur" );
						}

						/* Discard change */
						if( ( e.key == "Escape" ) || ( e.type == "blur" ) ) {

							/* Re-enable controls */
							enable_controls();

							/* Remove event listeners */
							$( "#container #content #project_view #map_list_container #map_list_new_map_name #new_map_name" ).unbind( "keyup blur" );
							
							/* Put things back the way they were */
							$( "#container #content #project_view #map_list_container #map_list_toolbar" ).css( "display", "flex" );
							$( "#container #content #project_view #map_list_container #map_list_new_map_name" ).css( "display", "none" );
							$( "#container #content #project_view #map_list_container #map_list_new_map_name #new_map_name" ).val( "" );
						}
					} );
					break;
				case "rename-project":
					
					/* Reset toolbar for a clean start */
					map_editor_toolbar_reset();

					/* Disable controls - don't hide the name input */
					disable_controls( false );

					$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "placeholder", decodeURI( project.name ) );
					$( "#container #toolbar #settings #name_input_container #name_input" ).val( decodeURI( project.name ) );
					$( "#container #toolbar #settings #name_input_container #name_input" ).attr( "disabled", false );
					$( "#container #toolbar #settings #name_input_container #name_input" ).focus();

					/* Add event listeners */
					$( "#container #toolbar #settings #name_input_container #name_input" ).on( "keyup blur", function( e ) {

						/* Save the change */
						if( e.key == "Enter" ) {

							var project_name_value = sanitise_input( $( this ).val() );

							if( project_name_value.match( /^\d/ ) ) {
								
								alert( "Project name cannot start with a number" );
							} else {
							
								if( project_name_value != "" ) {
									
									project.name = project_name_value;
								}
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

					/* Hide any confirmation prompts */
					$( "#container #sidebar #texture_list_toolbar_rename" ).css( "display", "none" );
					$( "#container #sidebar #texture_list_toolbar_delete" ).css( "display", "none" );

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
							$( "#container #content #toolbar #upload_settings" ).css( "display", "flex" );
							$( "#container #content #project_upload" ).css( "display", "flex" );

							$( "#container #content #project_view" ).css( "display", "none" );

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
					
					/* Disable controls */
					disable_controls();

					/* Show the confirmation prompt */
					$( "#container #toolbar #settings #map_export #map_export_prompt" ).html( "What format would you like to export?" );
					$( "#container #toolbar #settings #map_export #map_done" ).css( "display", "none" );

					$( "#container #toolbar #settings #map_export" ).css( "display", "flex" );

					/* Add event listeners */
					$( "#container #toolbar #settings #map_export input[type=button]" ).on( "click" , function( e ) {
						
						/* Which format are we exporting */
						if( $( this ).attr( "id" ) == "map_export_gba" ) {
							export_data_gba();
						} else if( $( this ).attr( "id" ) == "map_export_ps" ) {
							export_data_ps();
						}

						/* Re-enable controls */
						enable_controls();

						/* Remove event listeners */
						$( "#container #toolbar #settings #map_export input[type=button]" ).unbind( "click" );

						/* Hide the confirmation prompt */
						$( "#container #toolbar #settings #map_export #map_export_prompt" ).html( "" );
						$( "#container #toolbar #settings #map_export" ).css( "display", "none" );
					} );
					break;
			}
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
		$.each( $( "#map_list .sortable" ).children(), function( k, v ) {
			
			/* Get texture objects in sort order */
			var map_obj = project.maps.find( obj => obj.id == $( v ).attr( "map_id" ) );

			/* Give it it's new order and increment */
			map_obj.order = i;
			i++;

			/* Add it to the temporary array */
			newOrderArray.push( map_obj );
		} );

		/* Set the new order in the local array */
		project.maps = newOrderArray;
					
		/* Reload texture list */
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

function load_sprite_list() {

	/* Clear texture list */
	$( "#sprite_list .sortable" ).html( "" );
	$( "#sprite_list .sortable li" ).css( "color", "#000" );

	/* Clear fill and paint texture icons */
	$( "#sprite_fill" ).css( "display", "none" );
	$( "#sprite_paint" ).css( "display", "none" );
	$( "#sprite_erase" ).css( "display", "none" );
	
	/* Check if we are showing groups or sprites */
	if( selected_sprite.group == false ) {
		
		/* Groups */
		sort_sprite_groups_by_gorder();

		$.each( project.sprites, function( key, value ) {
			$( "#sprite_list .sortable" ).append( '<li class="ui-state-default ui-group" g_sprite_id="' + value.gid + '">' + value.gorder + ': ' + value.name + ' (' + value.gid + ')</li>' );
		} );

		/* Clear the current sprite id */
		selected_sprite.sprite = false;

		/* Set the icons */
		$( "#sprite_list_toolbar #toolbar_new_group" ).css( "display", "block" );
		$( "#sprite_list_toolbar #toolbar_new_sprite" ).css( "display", "none" );
		$( "#sprite_list_toolbar #toolbar_back" ).css( "display", "none" );
		$( "#sprite_editor_toolbar" ).css( "display", "none" );

	} else {

		/* Sprites */
		sort_sprites_by_order( selected_sprite.group.gid );

		/* Add the group name */
		$( "#sprite_list .sortable" ).append( '<li class="ui-state-default ui-state-disabled ui-group" g_sprite_id="' + selected_sprite.group.gid + '">' + selected_sprite.group.name + ' (' + selected_sprite.group.gid + ')</li>' );

		$.each( selected_sprite.group.sprites, function( key, value ) {
			$( "#sprite_list .sortable" ).append( '<li class="ui-state-default ui-sprite" sprite_id="' + value.id + '">' + value.order + ': ' + value.name + ' (' + value.id + ')</li>' );
		} );

		if( selected_sprite.sprite == false ) {
			/* Highlight parent group */
			$( "#sprite_list .sortable li[g_sprite_id='" + selected_sprite.group.gid + "']" ).css( "color", "#154561" );
		} else {
			/* Highlight selected sprite */
			$( "#sprite_list .sortable li[sprite_id='" + selected_sprite.sprite.id + "']" ).css( "color", "#195170" );
		}

		/* Set the icons */
		$( "#sprite_list_toolbar #toolbar_new_group" ).css( "display", "none" );
		$( "#sprite_list_toolbar #toolbar_new_sprite" ).css( "display", "block" );
		$( "#sprite_list_toolbar #toolbar_back" ).css( "display", "block" );
		$( "#sprite_editor_toolbar" ).css( "display", "flex" );
	}

	/* Add event listeners to the list */
	sprite_list_event_listeners();
	
	/* Add sorting capability */
	sprite_list_sortable();
	
	/* Reload sprite Editor */
	load_sprite_editor();

	/* Disable hovering for draw functions */
	/*if( drawing_functions == 1 )
		$( "#container #sidebar #texture_list #texture_list .sortable .ui-group" ).addClass( "resize_disabled" );
	else if( ( drawing_functions == 2 ) || ( drawing_functions == 3 ) )
		$( "#container #sidebar #texture_list #texture_list .sortable li" ).addClass( "resize_disabled" );*/

	/* Disable cursor on texture editor */
	//if( drawing_functions != false )
	//	$( ".sprite_picker" ).addClass( "auto_cursor" );
}

function clear_sprite_list_event_listeners() {
	
	$( "#sprite_list .sortable li" ).unbind( "click" );
	$( "#sprite_lis" ).unbind( "click" ); /* For click out - not implemented */
}

function sprite_list_event_listeners() {
	
	/* Remove existing event listeners */
	clear_sprite_list_event_listeners();

	/* Add onClick event listeners */
	$( "#sprite_list .sortable li" ).on( "click" , function( e ) {

		/* Ignore clicks on the items in the sprite list when controls are disabled */
		if( controls_disabled == false ) {

			if( selected_sprite.group == false ) {

				/* Top level click, no sprite or group selected */
				selected_sprite.group = project.sprites.find( obj => obj.gid == $( this ).attr( "g_sprite_id" ) );
				load_sprite_list();
			} else {

				/* Group level click - either texture or parent group selected */
				if( $( this ).attr( "sprite_id" ) != undefined) {
					/* Set selected sprite */
					selected_sprite.sprite = selected_sprite.group.sprites.find( obj => obj.id == $( this ).attr( "sprite_id" ) );
				} else {	
					/* Clear selected sprite */
					selected_sprite.sprite = false;
				}

				/* Reload texture list */
				load_sprite_list();
			}
		}
	});
}

function load_sprite_editor() {
	
	/* Hide delete and new group confirmation prompt and show the toolbar */
	$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group" ).css( "display", "none" );
	$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name" ).css( "display", "none" );
	
	if( selected_sprite.group == false ) {
		$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar" ).css( "display", "none" );
	}

	if( selected_sprite.sprite != false ) {

		/* Show fill and paint texture icons */
		$( "#sprite_fill" ).css( "display", "block" );
		$( "#sprite_paint" ).css( "display", "block" );
		$( "#sprite_erase" ).css( "display", "block" );

		/* Show the editor */
		$( "#container #content #project_view #sprite_editor_container #sprite_editor" ).css( "display", "flex" );
		$( "#container #content #project_view #sprite_editor_container #sprite_editor_empty" ).css( "display", "none" );

		/* Setup the texture editor */
		$( "#sprite_editor table tr" ).children().each( function() {

			/* Display pixels within bounds of the size */
			if( ( ( selected_sprite.group.size == 8 ) && ( ( $( this ).parent().attr( "row_id" ) < 8 ) && ( $( this ).attr( "col_id" ) < 8 ) ) ) || ( selected_sprite.group.size == 16 ) ){
				var pixel_value = selected_sprite.sprite.data[ $( this ).attr( "col_id" ) ][ $( this ).parent().attr( "row_id" ) ];
			
				/* Check if it's not a transparent pixel */
				if( pixel_value != "" ) {
					$( this ).css( "background", "#" + pixel_value );
					$( this ).removeClass( "trans_background" );
				} else {
					$( this ).css( "background", "#fff" );
					$( this ).addClass( "trans_background" );
				}

				/* Make sure the in0bounds cell has the correct classes */
				$( this ).removeClass( "oob" );
			} else {

				/* Make sure the out of bounds cell has the correct classes for a 8 x 8 sprite */
				$( this ).css( "background", "#ccc" );
				$( this ).removeClass( "trans_background" );
				$( this ).addClass( "oob" );
			}
		} );
	} else {

		/* Clear the editor */
		$( "#container #content #project_view #sprite_editor_container #sprite_editor" ).css( "display", "none" );
		$( "#container #content #project_view #sprite_editor_container #sprite_editor_empty" ).css( "display", "flex" );

		/* Clear fill and paint texture icons */
		$( "#texture_fill" ).css( "display", "none" );
		$( "#texture_paint" ).css( "display", "none" );

		/* Clear the paint preview */
		clear_texture_paint_preview();
	}
}

function clear_sprite_toolbar_event_listeners() {
	
	$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar i:not( .sprite_picker ), #container #content #project_view #sprite_list_container #sprite_list_toolbar i" ).unbind( "click" );
}

function sprite_toolbar_event_listeners() {

	/* Remove all event listeners */
	clear_sprite_toolbar_event_listeners();

	/* texture toolbar event listeners */
	$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar i:not( .sprite_picker ), #container #content #project_view #sprite_list_container #sprite_list_toolbar i" ).click(function() {
		
		var func = $( this ).attr( "func" );
		var new_group_size = false;

		/* Ignore clicks if controls are disabled, unless deselecting the eraser tool */
		if( ( ( controls_disabled == false ) && ( drawing_functions == false ) ) || ( ( drawing_functions == 2 ) && ( func == "sprite-erase" ) ) ) {

			switch( func ) {
				case "back": /* Return to list of sprite groups */

					selected_sprite.texture = false;
					selected_sprite.group = false;
					
					/* Reload sprite list */
					load_sprite_list();
					break;
				case "new": /* Create a new sprite */
				case "new-group": /* Create a new sprite group */
					$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar" ).css( "display", "none" );
				case "rename": /* Rename selected sprite */
				case "duplicate": /* Duplicated selected sprite */

					/* Disable controls - don't hide the name input */
					disable_controls( false );

					/* Clear the name inputs */
					$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename" ).val( "" );
					$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name #texture_group_name" ).val( "" );
					
					/* Set the placeholder if we're renaming the selected sprite */
					if( func == "rename" ) {
					
						/* Show the rename input and focus */
						$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename" ).css( "display", "flex" );
						$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename" ).focus();

						if( selected_sprite.sprite == false ) {
							/* We're renaming the group name */
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename" ).attr( "placeholder", selected_sprite.group.name );
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename" ).val( selected_sprite.group.name );
						} else {
							/* We're renaming the texture name */
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename" ).attr( "placeholder", selected_sprite.sprite.name );
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename" ).val( selected_sprite.sprite.name );
						}
					} else if( func == "new" ) {

						/* Creating a new sprite */
						$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name" ).css( "display", "flex" );
						$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name #texture_group_name" ).focus();

						$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name #texture_group_name" ).attr( "placeholder", "New sprite name" );
					} else if( func == "new-group" ) {

						/* Creating a new group, first prompt if it's an 8x8 or 16x16 sprite */
						$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group" ).css( "display", "flex" );

						/* Add event listners for escape key to discard change */
						$( document ).on( "keyup", function( e ) {
							
							if( e.key == "Escape" ) {
								/* Exit new group confirmation */
								$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group" ).css( "display", "none" );
								$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar" ).css( "display", "flex" );
								
								/* Unbind event listeners */
								$( document ).unbind( "keyup" );
								$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group input[type=button]" ).unbind( "click" );

								/* Enable controls */
								enable_controls();
							}
						});

						/* Add event listeners for buttons */
						$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group input[type=button]" ).click( function() {

							if( $( this ).attr( "id" ) == "sprite_new_group_cancel" ) {
								
								/* Cancel making the new sprite */
								$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group" ).css( "display", "none" );
								$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar" ).css( "display", "flex" );

								/* Reload sprite list */
								load_sprite_list();

								/* Enable controls */
								enable_controls();
								
								/* Unbind event listeners */
								$( document ).unbind( "keyup" );
								$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group input[type=button]" ).unbind( "click" );

							} else {
								
								if( $( this ).attr( "id" ) == "sprite_new_group_8" )
									new_group_size = 8;
								else 
									new_group_size = 16;

								/* Exit delete texture confirmation */
								$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group" ).css( "display", "none" );
								
								/* Unbind event listeners */
								$( document ).unbind( "keyup" );
								$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group input[type=button]" ).unbind( "click" );

								/* Show the rename input and focus */
								$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name" ).css( "display", "flex" );
								$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name #texture_group_name" ).focus();
								$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name #texture_group_name" ).attr( "placeholder", "New group name" );
							}
						} );

					} else {

						/* Show the rename input and focus */
						$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename" ).css( "display", "flex" );
						$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename" ).focus();
						
						/* Set the placeholder if we're creating/duplicating a new sprite or group */
						if(( selected_sprite.sprite != false ) || ( func == "new" ) ) $( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename" ).attr( "placeholder", "New sprite name" );
						else $( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename" ).attr( "placeholder", "New group name" );
					}
							
					/* Unbind exisiting event listeners */
					$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename, #container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name #texture_group_name" ).unbind( "keyup blur" );
					
					/* Add event listners to either save or discard change */
					$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename #texture_rename, #container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name #texture_group_name" ).on( "keyup blur", function( e ) {
						
						/* Save the change */
						if( e.key == "Enter" ) {

							/* Get entered name */
							var new_name = sanitise_input( $( this ).val() );

							if( new_name.match( /^\d/ ) ) {
								
								alert( "Sprite name cannot start with a number" );
							} else {

								/* Check if name already exists */
								var check_name = new_name.toLowerCase().replace( / /g, "_" );
								var check_array = project.sprites.map( function( val ) {
									return val.name.toLowerCase().replace( / /g, "_" );;
								} );

								if( ( ( ( check_array.indexOf( check_name ) !== -1 ) && ( func != "rename" ) ) || ( ( check_array.indexOf( check_name ) !== -1 ) && ( func == "rename" ) && ( check_name != selected_sprite.group.name.toLowerCase().replace( / /g, "_" ) ) ) ) && ( selected_sprite.sprite == false ) ) {
									
									alert( "Sprite name already exits" );
								} else {

									if( ( new_name != "" ) && ( new_name != undefined ) ) {

										if( ( func == "new" ) || ( func == "new-group" ) || ( func == "duplicate" ) ) {
											
											if(( selected_sprite.group == false ) || ( ( selected_sprite.sprite == false ) && ( func == "duplicate" ) ) ) {
												
												/* We are creating a new group or duplicating an exisiting group */
												var new_group = new Object();
												new_group.name = new_name;

												/* Get new ID value */
												sort_sprite_groups_by_gid();
												new_group.gid = ( project.sprites.length != 0 ) ? ( project.sprites[project.sprites.length - 1].gid + 1 ) : 0;

												/* Get new order value */
												sort_sprite_groups_by_gorder();
												new_group.gorder = ( project.sprites.length != 0 ) ? ( project.sprites[project.sprites.length - 1].gorder + 1 ) : 0;
												/* Note we sort by order 2nd so the array goes back to the correct order */

												if( ( selected_sprite.sprite == false ) && ( func == "duplicate" ) ) {
													
													/* Duplicate existing textures into our new group */
													new_group.sprites = new Array();
													$.extend( true, new_group.sprites, selected_sprite.group.sprites ); /* Clone array */

													/* Add size */
													new_group.size = selected_sprite.group.size;
												} else {

													/* Create a blank texture to initialise the group */
													var new_sprite = new Object();
													new_sprite.name = new_name;
													new_sprite.id = 0;
													new_sprite.order = 0;
													new_sprite.data = Array.from( { length: new_group_size }, () => Array.from( { length: new_group_size }, () => "" ) );

													/* Add size */
													new_group.size = new_group_size;

													/* Add the blank texture to the array */
													new_group.sprites = new Array();
													new_group.sprites.push( new_sprite );
												}

												/* Add the new texture into the local array*/
												project.sprites.push( new_group );

												/* Let's also update the selected group to be our new one */
												selected_sprite.group = new_group;

											} else {

												/* We are creating or duplicating a texture */
												var new_sprite = new Object();
												new_sprite.name = new_name;

												/* Get new ID value */
												sort_sprites_by_id( selected_sprite.group.gid );
												new_sprite.id = selected_sprite.group.sprites[selected_sprite.group.sprites.length - 1].id + 1;

												/* Get new order value */
												sort_sprites_by_order( selected_sprite.group.gid );
												new_sprite.order = selected_sprite.group.sprites[selected_sprite.group.sprites.length - 1].order + 1;
												/* Note we sort by order 2nd so the array goes back to the correct order */

												if( func == "duplicate" ) {
													/* Copy selected texture */
													new_sprite.data = new Array();
													$.extend( true, new_sprite.data, selected_sprite.sprite.data ); /* Clone array */
												} else {
													/* Create a blank canvas */
													new_sprite.data = Array.from( { length: selected_sprite.group.size }, () => Array.from( { length: selected_sprite.group.size }, () => "" ) );
												}

												/* Add the new texture into the local array*/
												selected_sprite.group.sprites.push( new_sprite );

												/* Select newly created texture */
												selected_sprite.sprite = new_sprite;
											}
										}

										if( func == "rename" ) {
											if( selected_sprite.sprite == false ) {
												/* Rename current group in local array */
												selected_sprite.group.name = new_name;
											} else {
												/* Rename current texture in local array */
												selected_sprite.sprite.name = new_name;								
											}
										}
									}
								}
							}
							
							/* Exit new sprite creation */
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename" ).css( "display", "none" );
							$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar" ).css( "display", "flex" );

							/* Reload sprite list */
							load_sprite_list();

							/* Enable controls */
							enable_controls();
						}

						/* Discard change */
						if( ( e.key == "Escape" ) || ( e.type == "blur" ) ) {
							/* Exit new sprite creation */
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_rename" ).css( "display", "none" );
							$( "#container #content #project_view #sprite_list_container #sprite_editor_toolbar_new_group_name" ).css( "display", "none" );
							$( "#container #content #project_view #sprite_list_container #sprite_list_toolbar" ).css( "display", "flex" );

							/* Enable controls */
							enable_controls();

						}
					});
					break;
				case "delete": /* Delete the selected sprite */

					/* Disable controls - don't hide the name input */
					disable_controls( false );

					/* Show the confirmation prompt */
					$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete" ).css( "display", "flex" );

					/* Add event listners for escape key to discard change */
					$( document ).on( "keyup", function( e ) {
						
						if( e.key == "Escape" ) {
							/* Exit delete sprite confirmation */
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete" ).css( "display", "none" );
							
							/* Enable controls */
							enable_controls();
							
							/* Unbind event listeners */
							$( document ).unbind( "keyup" );
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete input[type=button]" ).unbind( "click" );
						}
					});

					/* Add event listeners for buttons */
					$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete #sprite_delete_y" ).click( function() {

						if( selected_sprite.sprite == false ) {

							/* Delete selected sprite group from local array */
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

								/* Reorder the textures in local array */
								var i = 0;
								$.each( selected_sprite.group.sprites, function( k, v ) {

									/* Give it it's new order and increment */
									v.order = i;
									i++;
								} );
							}

							/* Clear the selected texture */
							selected_sprite.sprite = false;
						}

						/* Exit delete sprite confirmation */
						$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete" ).css( "display", "none" );

						/* Enable controls */
						enable_controls();
						
						/* Unbind event listeners */
						$( document ).unbind( "keyup" );
						$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete input[type=button]" ).unbind( "click" );
						
						/* Reload texture list */
						load_sprite_list();
					} );

					$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete #sprite_delete_n" ).click( function() {

						/* Exit delete sprite confirmation */
						$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete" ).css( "display", "none" );

						/* Enable controls */
						enable_controls();
						
						/* Unbind event listeners */
						$( document ).unbind( "keyup" );
						$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar_delete input[type=button]" ).unbind( "click" );
					} );
					break;
				case "sprite-erase":
					
					if( drawing_functions != 2 ) {

						/* Switch to sprite erasing */
						drawing_functions = 2;

						/* Reset toolbar for a clean start */
						map_editor_toolbar_reset();
						
						/* Disable controls */
						disable_controls( false );

						/* Set eraser as selected tool */
						$( ".sprite_picker:not( .oob )" ).removeClass( "auto_cursor" );
						$( "#sprite_erase" ).removeClass( "resize_disabled" );
						$( "#sprite_erase" ).addClass( "selected_tool" );

						/* Add hover functionality to map editor */
						$( "#sprite_editor table tr td:not( .oob )" ).addClass( "map_editor_table_cell_draw" );

						/* Add event listener for the erase tool */
						$( "#sprite_editor .map_editor_table_cell_draw:not( .oob )" ).on( "mouseup" , function( e ) {

							/* Clear the pixel in the editor */
							$( this ).css( "background", false );
							$( this ).addClass( "trans_background" );

							/* Get the row and column */
							var pixel_row = $( this ).parent().attr( "row_id" );
							var pixel_col = $( this ).attr( "col_id" );

							/* Clear the pixel in the local array */
							selected_sprite.sprite.data[ pixel_col ][ pixel_row ] = "";
						} );

					} else {
						/* Clear erase tool */				
						drawing_functions = false;

						/* Re-enable controls */
						enable_controls();

						/* Remove event listener */
						$( "#sprite_editor .map_editor_table_cell_draw:not( .oob )" ).unbind( "mouseup" );

						/* Remove paint brush as selected tool */
						$( "#sprite_erase" ).removeClass( "selected_tool" );
						$( "#sprite_editor table tr td:not( .oob )" ).removeClass( "map_editor_table_cell_draw" );
					}
					break;
			}
		}
	});
}

function clear_sprite_list_sortable() {
	
	if ( $( "#sprite_list .sortable" ).hasClass( "ui-sortable" ) ) {
		$( "#sprite_list .sortable" ).sortable( "destroy" );
	}
	$( "#sprite_list .sortable" ).unbind( "sortstart" );
	$( "#sprite_list .sortable" ).unbind( "sortstop" );
	$( "#sprite_list .sortable" ).unbind( "selectstart" );
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
		$( this ).css( "pointer-events", "none" );
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

				console.log( $( v ) );

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
		$( this ).css( "pointer-events", "auto" );
	} );
}

function load_sprite_editor_colour_pickers() {

	/* Variable to store which cell is being update as the colour picker library sometimes bugs out */
	var selected_picker = false;

	/* Setup the sprite editor and colour pickers, function should only be called once */
	$( "#sprite_editor" ).html( "<table></table>" );
	
	/* Add 16 rows */
	for(i=0; i<16; i++) 
		$( "#sprite_editor table" ).append( '<tr row_id="' + i + '"></tr>' );

	/* Add 16 cells for each row and set background color */
	$( "#sprite_editor table" ).children().each( function() {
		for(i=0; i<16; i++)
			$( '<td col_id="'+i+'" class="sprite_picker"></td>' ).appendTo( $(this) );
	} );

	/* Add in the colour pickers */
	$( '#sprite_editor_container .sprite_picker ' ).colpick( {
		layout: "hex",
		submit: "OK",
		onShow: function( e ) {

			if( !$( this ).hasClass( "oob" ) ) {
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
				if( ( $( this ).attr( "id" ) != "sprite_fill" ) && ( $( this ).attr( "id" ) != "sprite_paint" ) ) {

					if( selected_sprite.sprite.data == undefined ) {
						/* We had an error */
						alert( "Error: Colour Picker not initialised correctly.\n\nPlease reload the Map Maker to fix, remember to save your work first!" );
					}

					$( this ).colpickSetColor( selected_sprite.sprite.data[ $( this ).attr( "col_id" ) ][ $( this ).parent().attr( "row_id" ) ], true );
				}
			} else {
				return false;
			}
		},
		onSubmit: function( hsb, hex, rgb, e ) {

			var sprite_fill = false;

			if( selected_picker.attr( "id" ) == "sprite_fill" ) {
				
				/* We're filling the entire sprite with the selected colour */
				selected_sprite.sprite.data = Array.from( { length: selected_sprite.group.size }, () => Array.from( { length: selected_sprite.group.size }, () => hex ) );
				sprite_fill = true;
				
				/* Update the texture editor */
				$( "#sprite_editor table tr td:not( .oob )" ).css("background", "#" + hex );
				$( "#sprite_editor table tr td:not( .oob )" ).removeClass( "trans_background" );
			} else if( selected_picker.attr( "id" ) == "sprite_paint" ) {

				/* We're painting the texture  */
				drawing_functions = 3;

				/* Show colour indicator briefly */
				$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar #toolbar_right #colour_ind" ).css( "display", "block" );
				$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar #toolbar_right #colour_ind" ).css( "color", "#"+hex );
				$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar #toolbar_right #colour_ind" ).fadeOut( 750 );

				/* Reset toolbar for a clean start */
				map_editor_toolbar_reset();
				
				/* Disable controls */
				disable_controls( false );

				/* Set paint brush as selected tool */
				$( ".sprite_picker:not( .oob )" ).removeClass( "auto_cursor" );
				$( "#sprite_paint:not( .oob )" ).removeClass( "resize_disabled" );
				$( "#sprite_paint" ).addClass( "selected_tool" );

				/* Add hover functionality to map editor */
				$( "#sprite_editor table tr td:not( .oob )" ).addClass( "map_editor_table_cell_draw" );

				/* Add event listeners to the cells of the texture editor */
				$( "#sprite_editor table tr td:not( .oob )" ).on( "mouseup", function( e ) {

					if( e.which == 3) {

						/* Right click, let's switch colours */
						var cell_colour = selected_sprite.sprite.data[ $( this ).attr( "col_id" ) ][ $( this ).parent().attr( "row_id" ) ];

						if( ( cell_colour != "" ) && ( cell_colour != undefined ) ) {

							hex = cell_colour;

							/* Show colour indicator briefly */
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar #toolbar_right #colour_ind" ).css( "display", "block" );
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar #toolbar_right #colour_ind" ).css( "color", "#"+hex );
							$( "#container #content #project_view #sprite_editor_container #sprite_editor_toolbar #toolbar_right #colour_ind" ).fadeOut( 750 );
						}
					} else {

						/* Set the pixel in the editor */
						$( this ).css( "background", "#" + hex );
						$( this ).removeClass( "trans_background" );

						/* Get the row and column */
						var sprite_row = $( this ).parent().attr( "row_id" );
						var sprite_col = $( this ).attr( "col_id" );

						/* Set the colour in the local array */
						selected_sprite.sprite.data[ sprite_col ][ sprite_row ] = hex;

						/* Reset the selected picker */
						selected_picker = false;
					}
				} );

				/* Add event listener to paint icon to stop the painting */
				$( "#sprite_paint" ).on( "mouseup", function() {

					/* Re-enable controls */
					enable_controls();

					/* Reset the selected picker */
					selected_picker = false;

					/* Remove paint brush as selected tool */
					$( "#sprite_paint" ).removeClass( "selected_tool" );
					$( "#sprite_editor table tr td:not( .oob )" ).removeClass( "map_editor_table_cell_draw" );

					/* Unbind event listeners */
					$( "#sprite_paint" ).unbind( "mouseup" );
					$( "#sprite_editor table tr td:not( .oob )" ).unbind( "mouseup" );

					/* Set to 4 as this click will trigger the colour picker to re-open, and we don't want that to happen */
					drawing_functions = 4;
				} );

				/* Remove default context menu when drawing */
				$( "#sprite_editor table tr td:not( .oob )" ).on( "contextmenu" , function( e ) { return false; } );

			} else {

				/* We've selected a pixel colour, update the cell background */
				selected_picker.css("background", "#" + hex );
				selected_picker.removeClass( "trans_background" );

				/* Get the row and column */
				var sprite_row = selected_picker.parent().attr( "row_id" );
				var sprite_col = selected_picker.attr( "col_id" );

				/* Set the colour in the local array */
				selected_sprite.sprite.data[ sprite_col ][ sprite_row ] = hex;
			}
				
			/* Hide the colour picker */
			$( e ).colpickHide();
		}
	} );
}

function sort_sprite_groups_by_gid() {
	
	project.sprites.sort( function( a, b ) {
		return ((a.gid < b.gid) ? -1 : ((a.gid > b.gid) ? 1 : 0));
	} );
}

function sort_sprite_groups_by_gorder() {
	
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