/* Store the currently selected sprite */
var selected_sprite = new Object();
selected_sprite.sprite = false;
selected_sprite.group = false;

/* Store the sprite state */
selected_sprite.sprite_reverse_x = false;
selected_sprite.sprite_reverse_y = false;

/* Store tile information */
selected_sprite.can_walk = [true, true, true, true];
selected_sprite.exit_tile = false;
selected_sprite.exit_map_id = false;
selected_sprite.exit_map_dir = [0, 0];
selected_sprite.exit_map_pos = [0, 0];

/* Store current map info */
var selected_map = false;
var map_cell_size = 10;

/* Store drawing information */
var drawing_functions = false;

/* Store map resizing information */
var map_resizing = new Object();
map_resizing.en = false;
map_resizing.new_width = 0;
map_resizing.new_height = 0;

function sanitise_input( input_text ) {

	/* Function takes user input and remove any special characters that might cause issues */
	return input_text.replace(/[^a-zA-Z0-9\ _]/g, '_');
}

/* Document load */
$( function() {

	load_project_view();

	/* Debug */
	/*selected_map = project.maps.find( obj => obj.id == 3 );
	load_map_editing_view();

	selected_sprite.group = project.sprites.find( obj => obj.gid == 0 );
	selected_sprite.sprite = selected_sprite.group.sprites.find( obj => obj.id == 0 );
	load_sprite_list();*/
} );