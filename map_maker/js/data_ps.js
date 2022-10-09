function export_data_ps() {

	/* Convert our data to the correct format for the Picosystem */
	var output = "";
	var h_output = "";

	output += "#pragma once\n\n";
	output += "namespace picosystem {\n\n";

	/* Start by exporting all the sprites */
	output += "  /*********************************************************************************\n";
	output += "    Sprites\n";
	output += "  *********************************************************************************/\n";

	h_output += "// sprites\n";

	sort_sprite_groups_by_gorder();

	/* Loop through each sprite group */
	$.each( project.sprites , function( gi, group ) {

		output += "  const uint16_t " + group.name.toLowerCase().replace( / /g, "_" ) + "[" +  ( group.sprites.length * group.size * group.size ) + "] = {\n";
		h_output += "const extern uint16_t " + group.name.toLowerCase().replace( / /g, "_" ) + "[" +  ( group.sprites.length * group.size * group.size ) + "];\n"
		
		sort_sprites_by_order( group.gid );

		$.each( group.sprites, function( si, sprite ) {

			/* Convert pixel values for Picosystem, clone to avoid altering the original */
			var convert_sprite = new Array();
			$.extend( true, convert_sprite, sprite.data ); /* Clone array */

			/* Loop through each row of the texture */
			$.each( convert_sprite, function( ri, sprite_row ) {

				/* Loop through each pixel */
				$.each( sprite_row, function( ci, sprite_cell ) {

					/* Check for transparent pixels */
					if( ( sprite_cell == "" ) || ( sprite_cell == undefined ) ) {

						/* Transparent pixel */
						sprite_cell_int = 0;
					} else {

						/* Convert value to int */
						var sprite_cell_int = parseInt( sprite_cell, 16 );
						/* Convert 24-bit colour to 12-bit colour for the Picosystem */
						sprite_cell_int = ( ((sprite_cell_int & 0xF0) >> 4) | ((sprite_cell_int & 0xF000) >> 8) | ((sprite_cell_int & 0xF00000) >> 12) );

						if ( sprite_cell_int == 0 ) {

							/* We need to convert black to not quite black, otherwise it'll be treated like a transparent pixel */
							sprite_cell_int = 0x01;
						}
					}

					/* Add to the output */
					convert_sprite[ri][ci] = "0x"+sprite_cell_int.toString(16).padStart(3, '0');
				} );
			} );

			/* Now convert array of values to string */
			var sprite_array = convert_sprite.toString();
			sprite_array = sprite_array.replace( /,/g, ", " );

			/* Add line breaks depending on sprite size */
			if( group.size == 16 )
				sprite_array = sprite_array.replace( /((?:.*?\s){15}.*?)\s/g, "$1\n    " )
			else
				sprite_array = sprite_array.replace( /((?:.*?\s){7}.*?)\s/g, "$1\n    " )

			output += "    " + sprite_array + ",\n";
		} );

		output += "  };\n\n";
	} );

	/* Next export all the textures */
	output += "  /*********************************************************************************\n";
	output += "    Textures\n";
	output += "  *********************************************************************************/\n";

	h_output += "\n// textures\n";

	sort_texture_groups_by_gorder();

	/* Loop through each texture group */
	$.each( project.textures , function( gi, group ) {

		output += "  const uint16_t " + group.name.toLowerCase().replace( / /g, "_" ) + "[" +  ( group.textures.length * 64 ) + "] = {\n";
		h_output += "const extern uint16_t " + group.name.toLowerCase().replace( / /g, "_" ) + "[" +  ( group.textures.length * 64 ) + "];\n";
		
		sort_textures_by_order( group.gid );

		$.each( group.textures, function( ti, texture ) {

			/* Convert pixel values for Picosystem, clone to avoid altering the original */
			var convert_texture = new Array();
			$.extend( true, convert_texture, texture.data ); /* Clone array */

			/* Loop through each row of the texture */
			$.each( convert_texture, function( ri, texture_row ) {

				/* Loop through each pixel */
				$.each( texture_row, function( ci, texture_cell ) {

					/* Check for transparent pixels */
					if( ( texture_cell == "" ) || ( texture_cell == undefined ) ) {

						/* Transparent pixel */
						texture_cell_int = 0;
					} else {

						/* Convert value to int */
						var texture_cell_int = parseInt( texture_cell, 16 );
						/* Convert 24-bit colour to 12-bit colour for the Picosystem */
						texture_cell_int = ( ((texture_cell_int & 0xF0) >> 4) | ((texture_cell_int & 0xF000) >> 8) | ((texture_cell_int & 0xF00000) >> 12) );

						if ( texture_cell_int == 0 ) {

							/* We need to convert black to not quite black, otherwise it'll be treated like a transparent pixel */
							texture_cell_int = 0x01;
						}
					}

					/* Add to the output */
					convert_texture[ri][ci] = "0x"+texture_cell_int.toString(16).padStart(3, '0');
				} );
			} );

			/* Now convert array of values to string */
			var texture_array = convert_texture.toString();
			texture_array = texture_array.replace( /,/g, ", " );
			texture_array = texture_array.replace( /((?:.*?\s){7}.*?)\s/g, "$1\n    " )
			output += "    " + texture_array + ",\n";
		} );

		output += "  };\n\n";
	} );

	output += "  const uint16_t* _texture_map[" + project.textures.length + "] = {\n";

	/* Loop through each texture group */
	$.each( project.textures , function( i, group ) {

		output += "    " + group.name.toLowerCase().replace( / /g, "_" ) + ", // " + i + "\n";
	} );

	h_output += "\n// texture map\n";
	h_output += "const extern uint16_t* _texture_map[" + project.textures.length + "];\n";
	

	output += "  };\n\n";

	/* Next let's export the maps */
	output += "  /*********************************************************************************\n";
	output += "    Maps\n";
	output += "  *********************************************************************************/\n";

	sort_maps_by_order();

	/* Loop through each map */
	$.each( project.maps , function( i, map ) {

		var map_name_conv = map.name.toLowerCase().replace( / /g, "_" );
		output += "  const struct map_tile _" + map_name_conv + "[" + map.height + "][" + map.width + "] = {\n";

		/* Loop through the map, one row at a time */
		$.each( map.data, function( ri, row ) {

			output += "    { ";
			
			/* Add each cell */
			$.each( row, function( ci, cell ) {


				output += "{ ";
				/* Get the selected texture and map as we need to print the order not the ID */
				if( cell.texture_gid != undefined ) {

					/* Get cell */
					var cell_output_texture_group = project.textures.find( obj => obj.gid == cell.texture_gid );
					var cell_output_texture = cell_output_texture_group.textures.find( obj => obj.id == cell.texture_id );
					var cell_output_map = project.maps.find( obj => obj.id == cell.exit_map_id );

					/* Add in the data for each cell */
					output += Number(cell.top_layer) + ", ";
					output += Number(cell.can_walk[0]) + ", " + Number(cell.can_walk[1]) + ", " + Number(cell.can_walk[2]) + ", " + Number(cell.can_walk[3]) + ", ";
					output += Number(cell_output_texture_group.gorder) + ", " + Number(cell_output_texture.order) + ", ";
					output += Number(cell.texture_reverse_x) + ", " + Number(cell.texture_reverse_y) + ", ";
					output += Number(cell.interact_en) + ", " + Number(cell.interact_id) + ", ";
					output += Number(cell.npc_en) + ", " + Number(cell.npc_id) + ", ";
					output += Number(cell.exit_tile) + ", " + Number(cell_output_map.order) + ", {";
					output += cell.exit_map_dir[0] + ", " + cell.exit_map_dir[1] + "}, {";
					output += cell.exit_map_pos[0] + ", " + cell.exit_map_pos[1] + "} ";
				} else {

					/* Empty cell */
					output += "0, 1, 1, 1, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, {0, 0}, {0, 0} ";
				}
				output += "}, ";		
			} );

			output += "},\n";
		} );

		output += "  };\n";

		if( map.bg_texture.gid != undefined ) {

			/* Get the background texture */
			var map_output_bg_texture_gid = project.textures.find( obj => obj.gid == map.bg_texture.gid );
			var map_output_bg_texture_id = map_output_bg_texture_gid.textures.find( obj => obj.id == map.bg_texture.id );
		} else {
			var map_output_bg_texture_gid = -1;
			var map_output_bg_texture_id = -1
		}

  		output += "  struct map " + map_name_conv + " = { " + Number(map.id) + ", *_" + map_name_conv + ", " + Number(map.height) + ", " + Number(map.width) + ", " + Number(map.can_run) + ", " + Number(map_output_bg_texture_gid.gorder) + ", " + Number(map_output_bg_texture_id.order) + " };\n\n"

	} );

	output += "  map map_list[" + project.maps.length + "] = {\n";

	/* Loop through each map */
	$.each( project.maps , function( i, map ) {

		output += "    " + map.name.toLowerCase().replace( / /g, "_" ) + ", // " + i + "\n";
	} );

	output += "  };\n\n";
	output += "}";

	//console.log( output );

	var blob = new Blob( [output], { type: "text/plain" } );
	var file = document.createElement( "a" );
	file.download = project.name.toLowerCase().replace( / /g, "_" ) + ".hpp";
	file.href = window.URL.createObjectURL( blob );
	file.click();

	//console.log( h_output ); // Not used
	console.log( project );
}