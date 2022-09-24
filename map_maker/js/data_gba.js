function rgb( colour ) {

	/* Converts 32-bit RGB to 15-bit BGR */
	return 0x0 | ( ( ( ( ( colour >> 16 ) & 0xFF) / 8 ) << 0 ) | ( ( ( ( colour >> 8 ) & 0xFF) / 8 ) << 5 ) | ( ( ( colour & 0xFF) / 8 ) << 10 ) );

	/* JS Fiddle:
	var color = 0x447733 // We want to get 0x19c8 (r 0x8, g 0xe, b 0x6)

	var rgbRed  = parseInt( ( (color >> 16 ) & 0xFF) / 8 )
	var rgbGreen= parseInt( ( (color >> 8 ) & 0xFF) / 8 )
	var rgbBlue = parseInt( ( color & 0xFF) / 8 )

	var rgb = ( rgbRed << 0 ) | ( rgbGreen << 5 ) | (rgbBlue << 10 );


	console.log( color.toString(16) + " = " + rgbRed.toString(16) + ", " + rgbGreen.toString(16) + ", " + rgbBlue.toString(16) )
	console.log( rgb.toString(16) )
	*/
}

function export_data_gba() {

	/* Convert our data to the correct format for the Gameboy Advance */
	var output = "";

	/* Create the colour palette array */
	var colour_palette = new Array();
	var colour_palette_output = new Array();

	/* Add a transparent pixel */
	colour_palette[0] = 0xff00ff;
	colour_palette_output[0] = "0x7c1f";

	/* Add a black pixel */
	colour_palette[1] = 0x000000;
	colour_palette_output[1] = "0x0000";

	/* Add a red pixel */
	colour_palette[2] = 0xFF0000;
	colour_palette_output[2] = "0x001F";

	output += "#ifndef PROJECT_ASSETS_H_INCLUDED\n#define PROJECT_ASSETS_H_INCLUDED\n\n";

	/* Next export all the textures */
	output += "/*********************************************************************************\n";
	output += "\tTextures\n";
	output += "*********************************************************************************/\n";

	/* Calculate total number of textures */
	var total_textures = 0;
	$.each( project.textures , function( gi, group ) {
		total_textures += group.textures.length;
	} );

	output += "const uint16_t _texture_map[ " + ( total_textures * 32 ) + " ] = {\n";

	sort_texture_groups_by_gorder();

	/* Loop through each texture group */
	var _count = 0;
	$.each( project.textures , function( gi, group ) {

		output += "\t/*" + group.name + "*/\n";
		
		sort_textures_by_order( group.gid );

		$.each( group.textures, function( ti, texture ) {

			/* Convert pixel values for Gameboy Advance, first we need to re-map the pixels */
			var gba_texture = Array.from( { length: 8 }, () => Array.from( { length: 8 }, () => "0" ) );

			var _row, _col;
			/* Loop through the rows of the texture */
			for( _row = 0; _row < 8; _row++ ) {

				/* Loop through the columns of the texture */
				for( _col = 0; _col < 8; _col++ ) {

					/* Re-map */
					gba_texture[ _row ][ _col ] = texture.data[ _col ][ _row ];
				}
			}

			/* Now convert our re-mapped texture */
			var convert_texture = new Array();
			$.extend( true, convert_texture, gba_texture ); /* Clone array */

			/* Loop through each row of the texture */
			$.each( convert_texture, function( ri, texture_row ) {

				/* Loop through each pixel */
				$.each( texture_row, function( ci, texture_cell ) {

					/* Check for transparent pixels */
					if( ( texture_cell == "" ) || ( texture_cell == undefined ) ) {

						/* Add transparent texture to the output */
						convert_texture[ri][ci] = 0;
					} else {

						/* Convert value to int */
						var texture_cell_int = parseInt( texture_cell, 16 );

						/* Add colour to colour palette if not already there */
						if( $.inArray( texture_cell_int, colour_palette ) == -1 ) {
							
							colour_palette.push( texture_cell_int );

							/* Also add to the output */
							var texture_cell_int_convert = "0x" + rgb( texture_cell_int ).toString( 16 ).padStart( 4, '0' );
							colour_palette_output.push( texture_cell_int_convert );
						}						

						/* Add texture to the output */
						convert_texture[ri][ci] = $.inArray( texture_cell_int, colour_palette );
					}
				} );
			} );

			/* Convert array to 8bpp tiles */
			var convert_texture_8pp = "";

			/* Loop through each row of the texture */
			$.each( convert_texture, function( ri, texture_row ) {

				/* Loop through each pixel */
				$.each( texture_row, function( ci, texture_cell ) {

					/* Skip over every other cell */
					if( ( ci % 2) == 0 ) {

						/* Join 2 cells together and convert to hex */
						convert_texture_8pp += "0x" + texture_row[ ci + 1 ].toString( 16 ).padStart(2, '0') + texture_row[ ci ].toString( 16 ).padStart(2, '0') + ", ";

					}

				} );

				/* Add a line break every other line */
				if( ( ( ri % 2) == 1 ) && ( ri != 7 ) ) {
					convert_texture_8pp += "\n\t" ;
				}

			} );

			/* Add texture to output */
			output += "\t" + convert_texture_8pp + "\n";

			if( _count < ( total_textures - 1 ) )
				output += "\n";
			
			_count++;
		} );
	} );

	/* Add texture to output */
	output += "};\n\n";

	/* Next export the colour palette */
	output += "/*********************************************************************************\n";
	output += "\tColour Palette\n";
	output += "*********************************************************************************/\n";

	var _colour_palette_output = colour_palette_output.toString();
	_colour_palette_output = _colour_palette_output.replace( /,/g, ", " );
	_colour_palette_output = _colour_palette_output.replace( /((?:.*?\s){7}.*?)\s/g, "$1\n\t" )
	
	output += "const uint16_t _colour_palette[ " + ( colour_palette_output.length ) + " ] = {\n";
	output += "\t" + _colour_palette_output + ",\n";
	output += "};\n\n";

	/* Next let's export the maps */
	output += "/*********************************************************************************\n";
	output += "\tMaps\n";
	output += "*********************************************************************************/\n";

	sort_maps_by_order();

	/* Loop through each map */
	$.each( project.maps , function( i, map ) {

		var map_name_conv = map.name.toLowerCase().replace( / /g, "_" );
		output += "const struct map_tile _" + map_name_conv + "[" + map.height + "][" + map.width + "] = {\n";

		/* Loop through the map, one row at a time */
		$.each( map.data, function( ri, row ) {

			output += "\t{ ";
			
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

		output += "};\n";

		if( map.bg_texture.gid != undefined ) {

			/* Get the background texture */
			var map_output_bg_texture_gid = project.textures.find( obj => obj.gid == map.bg_texture.gid );
			var map_output_bg_texture_id = map_output_bg_texture_gid.textures.find( obj => obj.id == map.bg_texture.id );
		} else {
			var map_output_bg_texture_gid = -1;
			var map_output_bg_texture_id = -1
		}

  		output += "const struct map " + map_name_conv + " = { " + Number(map.id) + ", *_" + map_name_conv + ", " + Number(map.height) + ", " + Number(map.width) + ", " + Number(map.can_run) + ", " + Number(map_output_bg_texture_gid.gorder) + ", " + Number(map_output_bg_texture_id.order) + " };\n\n"

	} );

	output += "struct map map_list[" + project.maps.length + "] = {\n";

	/* Loop through each map */
	$.each( project.maps , function( i, map ) {

		output += "\t" + map.name.toLowerCase().replace( / /g, "_" ) + ", // " + i + "\n";
	} );

	output += "};\n\n";
	output += "#endif";

	console.log( output );
	
}