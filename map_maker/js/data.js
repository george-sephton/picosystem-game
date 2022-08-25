/* Initialise list of demo sprites */
var grass_bg = new Object();
grass_bg.name = "Grass Background";
grass_bg.order = 0;
grass_bg.id = 0;
grass_bg.data =   [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
					["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "77DD66", "77DD66"],
					["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66"],
					["77DD66", "77DD66", "77DD66", "447733", "77DD66", "77DD66", "77DD66", "77DD66"],
					["77DD66", "447733", "77DD66", "77DD66", "77DD66", "447733", "77DD66", "77DD66"],
					["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
					["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "447733", "77DD66"],
					["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"]];

var g_grass_bg = new Object();
g_grass_bg.name = "Grass Background";
g_grass_bg.gorder = 1;
g_grass_bg.gid = 0;
g_grass_bg.sprites = new Array( grass_bg );

var mat_v = new Object();
mat_v.name = "Mat Vertical";
mat_v.order = 1;
mat_v.id = 3;
mat_v.data =       [["77DD66", "FF9933", "FF9933", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
					["77DD66", "FF9933", "FF9933", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
					["77DD66", "FF9933", "FF9933", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
					["77DD66", "FF9933", "FF9933", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
					["77DD66", "FF9933", "FF9933", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
					["77DD66", "FF9933", "FF9933", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
					["77DD66", "FF9933", "FF9933", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
					["77DD66", "FF9933", "FF9933", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"]];

var mat_h = new Object();
mat_h.name = "Mat Horizontal";
mat_h.order = 0;
mat_h.id = 1;
mat_h.data =       [["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
					["FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933"],
					["FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933"],
					["EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
					["DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
					["EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
					["DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
					["EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"]];

var g_mat = new Object();
g_mat.name = "Mat";
g_mat.gorder = 0;
g_mat.gid = 1;
g_mat.sprites = new Array( mat_v, mat_h );

var bollard_1 = new Object();
bollard_1.name = "Bollard 1";
bollard_1.order = 0;
bollard_1.id = 0;
bollard_1.data =   [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
					["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "77DD66", "77DD66"],
					["77DD66", "77DD66", "77DD66", "77DD66", "000011", "000011", "000011", "000011"],
					["77DD66", "77DD66", "77DD66", "000011", "88FFBB", "447733", "88FFBB", "88FFBB"],
					["77DD66", "447733", "000011", "88FFBB", "CCFFBB", "88FFBB", "447733", "88FFBB"],
					["77DD66", "77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "447733", "88FFBB"],
					["77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "CCFFBB", "88FFBB", "447733"],
					["77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "447733"]];

var bollard_2 = new Object();
bollard_2.name = "Bollard 2";
bollard_2.order = 2;
bollard_2.id = 1;
bollard_2.data =   [["77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "447733"],
					["77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "CCFFBB", "88FFBB", "447733"],
					["77DD66", "77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "447733", "88FFBB"],
					["77DD66", "77DD66", "000011", "88FFBB", "CCFFBB", "88FFBB", "447733", "88FFBB"],
					["77DD66", "77DD66", "77DD66", "000011", "88FFBB", "447733", "88FFBB", "88FFBB"],
					["77DD66", "77DD66", "77DD66", "77DD66", "000011", "000011", "000011", "000011"],
					["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "447733", "77DD66"],
					["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"]];

var bollard_3 = new Object();
bollard_3.name = "Bollard 3";
bollard_3.order = 1;
bollard_3.id = 2;
bollard_3.data =   [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
					["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "77DD66", "77DD66"],
					["000011", "000011", "000011", "000011", "447733", "77DD66", "CCFFBB", "77DD66"],
					["447733", "88FFBB", "88FFBB", "88FFBB", "000011", "447733", "77DD66", "77DD66"],
					["88FFBB", "447733", "88FFBB", "88FFBB", "88FFBB", "000011", "447733", "77DD66"],
					["88FFBB", "447733", "88FFBB", "88FFBB", "88FFBB", "000011", "447733", "77DD66"],
					["88FFBB", "88FFBB", "447733", "88FFBB", "88FFBB", "88FFBB", "000011", "88FFBB"],
					["DDFFDD", "DDFFDD", "DDFFDD", "DDFFDD", "DDFFDD", "DDFFDD", "000011", "88FFBB"]];

var bollard_4 = new Object();
bollard_4.name = "Bollard 4";
bollard_4.order = 3;
bollard_4.id = 3;
bollard_4.data =   [["DDFFDD", "DDFFDD", "DDFFDD", "DDFFDD", "DDFFDD", "DDFFDD", "000011", "88FFBB"],
					["88FFBB", "88FFBB", "447733", "88FFBB", "88FFBB", "88FFBB", "000011", "88FFBB"],
					["88FFBB", "447733", "88FFBB", "88FFBB", "88FFBB", "000011", "88FFBB", "77DD66"],
					["88FFBB", "447733", "88FFBB", "88FFBB", "88FFBB", "000011", "88FFBB", "77DD66"],
					["447733", "88FFBB", "88FFBB", "88FFBB", "000011", "88FFBB", "77DD66", "77DD66"],
					["000011", "000011", "000011", "000011", "88FFBB", "77DD66", "77DD66", "77DD66"],
					["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "447733", "77DD66"],
					["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"]];

var g_bollard = new Object();
g_bollard.name = "Bollard";
g_bollard.gorder = 2;
g_bollard.gid = 13;
g_bollard.sprites = new Array( bollard_1, bollard_2, bollard_3, bollard_4 );

var fence = new Object();
fence.name = "Fence";
fence.order = 0;
fence.id = 0;
fence.data =       [["77DD66", "77DD66", "000011", "000011", "77DD66", "77DD66", "77DD66", "77DD66"],
					["77DD66", "000011", "77DD66", "77DD66", "000011", "000011", "CCFF88", "77DD66"],
					["000011", "77DD66", "CCFF88", "CCFF88", "77DD66", "77DD66", "000011", "000011"],
					["000011", "CCFF88", "CCFF88", "CCFF88", "CCFF88", "CCFF88", "77DD66", "000011"],
					["000011", "CCFF88", "CCFF88", "CCFF88", "CCFF88", "CCFF88", "77DD66", "000011"],
					["000011", "CCFF88", "CCFF88", "CCFF88", "CCFF88", "CCFF88", "77DD66", "000011"],
					["77DD66", "000011", "CCFF88", "77DD66", "77DD66", "000011", "000011", "77DD66"],
					["77DD66", "77DD66", "000011", "000011", "000011", "77DD66", "77DD66", "77DD66"]];

var g_fence = new Object();
g_fence.name = "Fence";
g_fence.gorder = 3;
g_fence.gid = 8;
g_fence.sprites = new Array( fence );

/* Store sprites in an array */
var demo_sprites = new Array( g_grass_bg, g_mat, g_bollard, g_fence );

/* Demo map */
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

var map1 = new Object();
map1.id = 0;
map1.order = 0;
map1.name = "Demo Map";
map1.width = 5;
map1.height = 5;
map1.data = Array.from( { length: map1.height }, () => Array.from( { length: map1.width }, () => Object.assign( {}, blank_tile ) ) );

var map2 = new Object();
map2.id = 1;
map2.order = 1;
map2.name = "Large Demo Map";
map2.width = 16;
map2.height = 12;
map2.data = Array.from( { length: map2.height }, () => Array.from( { length: map2.width }, () => Object.assign( {}, blank_tile ) ) );

/* Dev */
/*
demo_map.data[0][0].sprite_gid = 1;
demo_map.data[0][0].sprite_id = 3;

demo_map.data[0][1].sprite_gid = 1;
demo_map.data[0][1].sprite_id = 3;
demo_map.data[0][1].sprite_reverse_y = true;
demo_map.data[0][1].sprite_reverse_x = true;
*/

/* Store maps in an array */
var demo_maps = new Array( map1, map2 );


var project = new Object();
project.name = "Demo Project";
project.sprites = demo_sprites;
project.maps = demo_maps;

