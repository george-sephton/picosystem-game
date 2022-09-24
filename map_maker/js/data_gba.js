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

	output += "#pragma once\n\n";

	/* Next export all the textures */
	output += "/*********************************************************************************\n";
	output += "  Textures\n";
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

	/* Next export all the textures */
	output += "/*********************************************************************************\n";
	output += "  Colour Palette\n";
	output += "*********************************************************************************/\n";

	var _colour_palette_output = colour_palette_output.toString();
	_colour_palette_output = _colour_palette_output.replace( /,/g, ", " );
	_colour_palette_output = _colour_palette_output.replace( /((?:.*?\s){7}.*?)\s/g, "$1\n\t" )
	
	output += "const uint16_t _colour_palette[ " + ( colour_palette_output.length ) + " ] = {\n";
	output += "\t" + _colour_palette_output + ",\n";
	output += "};\n\n";

	console.log( output );
	
}