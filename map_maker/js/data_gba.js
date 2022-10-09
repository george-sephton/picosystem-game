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

	/* Create the texture colour palette array */
	var texture_colour_palette = new Array();
	var texture_colour_palette_output = new Array();

	/* Add default pixels */
	texture_colour_palette[0] = 0xff00ff;			// Transparent
	texture_colour_palette_output[0] = "0x7c1f";
	texture_colour_palette[1] = 0x000000;			// Black
	texture_colour_palette_output[1] = "0x0000";
	texture_colour_palette[2] = 0xFFFFFF;			// White
	texture_colour_palette_output[2] = "0xFFFF";
	texture_colour_palette[3] = 0xFF0000;			// Red
	texture_colour_palette_output[3] = "0x001F";

	/* Create the sprite colour palette array */
	var sprite_colour_palette = new Array();
	var sprite_colour_palette_output = new Array();

	/* Add default pixels */
	sprite_colour_palette[0] = 0xff00ff;			// Transparent
	sprite_colour_palette_output[0] = "0x7c1f";
	sprite_colour_palette[1] = 0x000000;			// Black
	sprite_colour_palette_output[1] = "0x0000";
	sprite_colour_palette[2] = 0xFFFFFF;			// White
	sprite_colour_palette_output[2] = "0xFFFF";

	output += "#ifndef PROJECT_ASSETS_H_INCLUDED\n#define PROJECT_ASSETS_H_INCLUDED\n\n";

	/* Start by exporting all the sprites */
	output += "/*********************************************************************************\n";
	output += "\tSprites\n";
	output += "*********************************************************************************/\n";

	/* Calculate total number of sprites */
	var total_sprites = 0;
	$.each( project.sprites , function( gi, group ) {
		total_sprites += ( group.sprites.length * ( ( group.size == 16 ) ? 4 : 1 ) );
	} );

	output += "const uint16_t _sprite_map[ " + ( total_sprites * 32 ) + " ] = {\n";

	sort_sprite_groups_by_gorder();

	/* Loop through each sprite group */
	$.each( project.sprites , function( gi, group ) {

		output += "\t/* " + group.name + " */\n";
		
		sort_sprites_by_order( group.gid );

		$.each( group.sprites, function( si, sprite ) {

			/* If the sprite size is 16x16, we need to split it into 4 separate 8x8 sprites */
			if( group.size == 16 ) {
				
				var convert_sprite_8 = Array.from( { length: 4 }, () => Array.from( { length: 8 }, () => "0" ) );

				/* Loop through each row and add to our new array */
				for( var i = 0; i < 8; i++ ) {

					convert_sprite_8[ 0 ][ i ] = sprite.data[ i ].slice( 0, 8 );
					convert_sprite_8[ 1 ][ i ] = sprite.data[ i + 8 ].slice( 0, 8 );
					convert_sprite_8[ 2 ][ i ] = sprite.data[ i ].slice( 8, 16 );
					convert_sprite_8[ 3 ][ i ] = sprite.data[ i + 8 ].slice( 8, 16 );
				}
			} else {
				
				var convert_sprite_8 = Array.from( { length: 1 }, () => Array.from( { length: 8 }, () => "0" ) );
				$.extend( true, convert_sprite_8[0], sprite.data ); /* Clone array */
			}

			$.each( convert_sprite_8, function( s8i, sprite8 ) {

				/* Convert pixel values for Gameboy Advance, first we need to re-map the pixels */
				var gba_sprite = Array.from( { length: 8 }, () => Array.from( { length: 8 }, () => "0" ) );

				var _row, _col;
				/* Loop through the rows of the sprite */
				for( _row = 0; _row < 8; _row++ ) {

					/* Loop through the columns of the sprite */
					for( _col = 0; _col < 8; _col++ ) {

						/* Re-map */
						gba_sprite[ _row ][ _col ] = sprite8[ _col ][ _row ];
					}
				}

				/* Loop through each row of the sprite */
				$.each( gba_sprite, function( ri, sprite_row ) {

					/* Loop through each pixel */
					$.each( sprite_row, function( ci, sprite_cell ) {

						/* Check for transparent pixels */
						if( ( sprite_cell == "" ) || ( sprite_cell == undefined ) ) {

							/* Add transparent texture to the output */
							gba_sprite[ri][ci] = 0;
						} else {

							/* Convert value to int */
							var sprite_cell_int = parseInt( sprite_cell, 16 );

							/* Add colour to colour palette if not already there */
							if( $.inArray( sprite_cell_int, sprite_colour_palette ) == -1 ) {
								
								sprite_colour_palette.push( sprite_cell_int );

								/* Also add to the output */
								var sprite_cell_int_convert = "0x" + rgb( sprite_cell_int ).toString( 16 ).padStart( 4, '0' );
								sprite_colour_palette_output.push( sprite_cell_int_convert );
							}						

							/* Add texture to the output */
							gba_sprite[ri][ci] = $.inArray( sprite_cell_int, sprite_colour_palette );
						}
					} );
				} );

				/* Convert array to 8bpp tiles */
				var convert_sprite_8pp = "";

				/* Loop through each row of the texture */
				$.each( gba_sprite, function( ri, sprite_row ) {

					/* Loop through each pixel */
					$.each( sprite_row, function( ci, sprite_cell ) {

						/* Skip over every other cell */
						if( ( ci % 2) == 0 ) {

							/* Join 2 cells together and convert to hex */
							convert_sprite_8pp += "0x" + sprite_row[ ci + 1 ].toString( 16 ).padStart(2, '0') + sprite_row[ ci ].toString( 16 ).padStart(2, '0') + ", ";

						}

					} );

					/* Add a line break every other line */
					if( ( ( ri % 2) == 1 ) && ( ri != 7 ) ) {
						convert_sprite_8pp += "\n\t" ;
					}

				} );

				/* Add texture to output */
				output += "\t" + convert_sprite_8pp + "\n";

				if( _count < ( total_sprites - 1 ) )
					output += "\n";
				
				_count++;
			} );
		} );
	} );

	output += "};\n\n";

	/* Next export the sprite colour palette */
	output += "/*********************************************************************************\n";
	output += "\tSprite Colour Palette\n";
	output += "*********************************************************************************/\n";

	var _sprite_colour_palette_output = sprite_colour_palette_output.toString();
	_sprite_colour_palette_output = _sprite_colour_palette_output.replace( /,/g, ", " );
	_sprite_colour_palette_output = _sprite_colour_palette_output.replace( /((?:.*?\s){7}.*?)\s/g, "$1\n\t" )
	
	output += "const uint16_t _sprite_colour_palette[ " + ( sprite_colour_palette_output.length ) + " ] = {\n";
	output += "\t" + _sprite_colour_palette_output + ",\n";
	output += "};\n\n";

	/* Next export all the textures */
	output += "/*********************************************************************************\n";
	output += "\tTextures\n";
	output += "*********************************************************************************/\n";

	/* First add in our transparent tile and black tile */
	var _default_tile_1 = new Object();
	_default_tile_1.name = "Transparent";
	_default_tile_1.order = 0;
	_default_tile_1.id = 0;
	_default_tile_1.data = [["FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF"],
							["FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF"],
							["FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF"],
							["FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF"],
							["FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF"],
							["FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF"],
							["FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF"],
							["FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF", "FF00FF"]];

	var _default_tile_2 = new Object();
	_default_tile_2.name = "Black";
	_default_tile_2.order = 1;
	_default_tile_2.id = 1;
	_default_tile_2.data = [["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"],
							["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"],
							["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"],
							["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"],
							["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"],
							["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"],
							["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"],
							["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"]];

	var default_tiles = new Object();
	default_tiles.name = "Default Tiles";
	default_tiles.gorder = -1;
	default_tiles.gid = 0;
	default_tiles.textures = new Array( _default_tile_1, _default_tile_2 );	

	/* Create a new array for our export */
	var export_textures = new Array();
	$.extend( true, export_textures, project.textures ); /* Clone array */

	export_textures.push( default_tiles );
	sort_texture_array_by_gorder( export_textures );

	/* Calculate total number of textures */
	var total_textures = 0;
	$.each( export_textures , function( gi, group ) {
		total_textures += group.textures.length;
	} );

	output += "const uint16_t _texture_map[ " + ( total_textures * 32 ) + " ] = {\n";

	sort_texture_groups_by_gorder();

	/* Loop through each texture group */
	var _count = 0;
	$.each( export_textures , function( gi, group ) {

		output += "\t/* " + group.name + " */\n";
		
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

			/* Loop through each row of the texture */
			$.each( gba_texture, function( ri, texture_row ) {

				/* Loop through each pixel */
				$.each( texture_row, function( ci, texture_cell ) {

					/* Check for transparent pixels */
					if( ( texture_cell == "" ) || ( texture_cell == undefined ) ) {

						/* Add transparent texture to the output */
						gba_texture[ri][ci] = 0;
					} else {

						/* Convert value to int */
						var texture_cell_int = parseInt( texture_cell, 16 );

						/* Add colour to colour palette if not already there */
						if( $.inArray( texture_cell_int, texture_colour_palette ) == -1 ) {
							
							texture_colour_palette.push( texture_cell_int );

							/* Also add to the output */
							var texture_cell_int_convert = "0x" + rgb( texture_cell_int ).toString( 16 ).padStart( 4, '0' );
							texture_colour_palette_output.push( texture_cell_int_convert );
						}						

						/* Add texture to the output */
						gba_texture[ri][ci] = $.inArray( texture_cell_int, texture_colour_palette );
					}
				} );
			} );

			/* Convert array to 8bpp tiles */
			var convert_texture_8pp = "";

			/* Loop through each row of the texture */
			$.each( gba_texture, function( ri, texture_row ) {

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

	output += "};\n\n";

	/* Add the sizes of all the texture groups */
	output += "const uint16_t _texture_lengths[" + export_textures.length + "] = {\n\t";

	/* Loop through each texture group */
	$.each( export_textures, function( i, group ) {
		output += "" + group.textures.length + ", ";
	} );

	output += "\n};\n\n";

	/* Next export the texture colour palette */
	output += "/*********************************************************************************\n";
	output += "\tTexture Colour Palette\n";
	output += "*********************************************************************************/\n";

	var _texture_colour_palette_output = texture_colour_palette_output.toString();
	_texture_colour_palette_output = _texture_colour_palette_output.replace( /,/g, ", " );
	_texture_colour_palette_output = _texture_colour_palette_output.replace( /((?:.*?\s){7}.*?)\s/g, "$1\n\t" )
	
	output += "const uint16_t _texture_colour_palette[ " + ( texture_colour_palette_output.length ) + " ] = {\n";
	output += "\t" + _texture_colour_palette_output + ",\n";
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
					var cell_output_texture_group = export_textures.find( obj => obj.gid == cell.texture_gid );
					var cell_output_texture = cell_output_texture_group.textures.find( obj => obj.id == cell.texture_id );
					var cell_output_map = project.maps.find( obj => obj.id == cell.exit_map_id );

					/* Add in the data for each cell */
					output += Number(cell.top_layer) + ", ";
					output += Number(cell.can_walk[0]) + ", " + Number(cell.can_walk[1]) + ", " + Number(cell.can_walk[2]) + ", " + Number(cell.can_walk[3]) + ", ";
					output += Number(cell_output_texture_group.gorder + 1) + ", " + Number(cell_output_texture.order) + ", ";
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
			var map_output_bg_texture_gid = export_textures.find( obj => obj.gid == map.bg_texture.gid );
			var map_output_bg_texture_id = map_output_bg_texture_gid.textures.find( obj => obj.id == map.bg_texture.id );
		} else {
			var map_output_bg_texture_gid = -1;
			var map_output_bg_texture_id = -1
		}

  		output += "const struct map " + map_name_conv + " = { " + Number(map.id) + ", *_" + map_name_conv + ", " + Number(map.height) + ", " + Number(map.width) + ", " + Number(map.can_run) + ", " + Number(map_output_bg_texture_gid.gorder + 1) + ", " + Number(map_output_bg_texture_id.order) + " };\n\n"

	} );

	output += "struct map map_list[" + project.maps.length + "] = {\n";

	/* Loop through each map */
	$.each( project.maps , function( i, map ) {

		output += "\t" + map.name.toLowerCase().replace( / /g, "_" ) + ", // " + i + "\n";
	} );

	output += "};\n\n";
	output += "#endif";

	//console.log( output );

	var blob = new Blob( [output], { type: "text/plain" } );
	var file = document.createElement( "a" );
	file.download = project.name.toLowerCase().replace( / /g, "_" ) + ".h";
	file.href = window.URL.createObjectURL( blob );
	file.click(); 

	console.log( project );
}