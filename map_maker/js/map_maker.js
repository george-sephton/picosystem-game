/* Store the currently selected texture */
var selected_texture = new Object();
selected_texture.texture = false;
selected_texture.group = false;

/* Store the texture state */
selected_texture.texture_reverse_x = false;
selected_texture.texture_reverse_y = false;

/* Store tile information */
selected_texture.can_walk = [true, true, true, true];
selected_texture.exit_tile = false;
selected_texture.exit_map_id = false;
selected_texture.exit_map_dir = [0, 0];
selected_texture.exit_map_pos = [0, 0];
selected_texture.interact_en = false;
selected_texture.interact_id = false;
selected_texture.npc_en = false;
selected_texture.npc_id = false;
selected_texture.top_layer = false;

/* Store the currently selected sprite */
var selected_sprite = new Object();
selected_sprite.sprite = false;
selected_sprite.group = false;

/* Store current map info */
var selected_map = false;
var map_cell_size = 10;

/* Store drawing information */
var drawing_functions = false;

/* Store map resizing information */
var map_resizing = new Object();
map_resizing.new_width = 0;
map_resizing.new_height = 0;

/* Store if controls are disabled */
var controls_disabled = false;

function sanitise_input( input_text ) {

	/* Function takes user input and remove any special characters that might cause issues */
	return input_text.replace(/[^a-zA-Z0-9\ _]/g, '_');
}

/* Create empty project */
var empty_project = new Object();
empty_project.name = "New Project";
empty_project.textures = new Array();
empty_project.sprites = new Array();
empty_project.maps = new Array();
//var project = empty_project;

/* Load demo project */
var project = demo_project;

/* Document load */
$( function() {

	/* Load editors and colour pickers, only called once */
	load_texture_editor_colour_pickers();
	load_sprite_editor_colour_pickers();

	load_project_view();

	/* Debug */
	/*selected_map = project.maps.find( obj => obj.id == 0 );
	load_map_editing_view();

	selected_texture.group = project.textures.find( obj => obj.gid == 2 );
	selected_texture.texture = selected_texture.group.textures.find( obj => obj.id == 0 );
	load_texture_list();*/
} );