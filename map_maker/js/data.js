/* Initialise list of demo textures */
var grass_bg = new Object();
grass_bg.name = "Grass Background";
grass_bg.order = 0;
grass_bg.id = 0;
grass_bg.data = 	   [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66"],
						["77DD66", "77DD66", "77DD66", "447733", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "447733", "77DD66", "77DD66", "77DD66", "447733", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "447733", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"]];

var g_grass_bg = new Object();
g_grass_bg.name = "Grass Background";
g_grass_bg.gorder = 0;
g_grass_bg.gid = 0;
g_grass_bg.textures = new Array( grass_bg );

var mat_v = new Object();
mat_v.name = "Mat Vertical";
mat_v.order = 0;
mat_v.id = 0;
mat_v.data =	       [["77DD66", "FF9933", "FF9933", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
						["77DD66", "FF9933", "FF9933", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
						["77DD66", "FF9933", "FF9933", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
						["77DD66", "FF9933", "FF9933", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
						["77DD66", "FF9933", "FF9933", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
						["77DD66", "FF9933", "FF9933", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
						["77DD66", "FF9933", "FF9933", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
						["77DD66", "FF9933", "FF9933", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"]];

var mat_h = new Object();
mat_h.name = "Mat Horizontal";
mat_h.order = 1;
mat_h.id = 1;
mat_h.data =	       [["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933"],
						["FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933", "FF9933"],
						["EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
						["DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
						["EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"],
						["DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222"],
						["EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677", "EE2222", "DD6677"]];

var g_mat = new Object();
g_mat.name = "Mat";
g_mat.gorder = 1;
g_mat.gid = 1;
g_mat.textures = new Array( mat_v, mat_h );

var bollard_1 = new Object();
bollard_1.name = "Bollard 1";
bollard_1.order = 0;
bollard_1.id = 0;
bollard_1.data =	   [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "000011", "000011", "000011", "000011"],
						["77DD66", "77DD66", "77DD66", "000011", "88FFBB", "447733", "88FFBB", "88FFBB"],
						["77DD66", "447733", "000011", "88FFBB", "CCFFBB", "88FFBB", "447733", "88FFBB"],
						["77DD66", "77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "447733", "88FFBB"],
						["77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "CCFFBB", "88FFBB", "447733"],
						["77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "447733"]];

var bollard_2 = new Object();
bollard_2.name = "Bollard 2";
bollard_2.order = 1;
bollard_2.id = 1;
bollard_2.data =	   [["77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "447733"],
						["77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "CCFFBB", "88FFBB", "447733"],
						["77DD66", "77DD66", "000011", "88FFBB", "CCFFBB", "CCFFBB", "447733", "88FFBB"],
						["77DD66", "77DD66", "000011", "88FFBB", "CCFFBB", "88FFBB", "447733", "88FFBB"],
						["77DD66", "77DD66", "77DD66", "000011", "88FFBB", "447733", "88FFBB", "88FFBB"],
						["77DD66", "77DD66", "77DD66", "77DD66", "000011", "000011", "000011", "000011"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "447733", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"]];

var bollard_3 = new Object();
bollard_3.name = "Bollard 3";
bollard_3.order = 2;
bollard_3.id = 2;
bollard_3.data =	   [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
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
bollard_4.data =	   [["DDFFDD", "DDFFDD", "DDFFDD", "DDFFDD", "DDFFDD", "DDFFDD", "000011", "88FFBB"],
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
g_bollard.gid = 2;
g_bollard.textures = new Array( bollard_1, bollard_2, bollard_3, bollard_4 );

var tree_top_l = new Object();
tree_top_l.name = "Tree Top L";
tree_top_l.order = 0;
tree_top_l.id = 0;
tree_top_l.data =	   [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66"],
						["77DD66", "77DD66", "77DD66", "447733", "77DD66", "77DD66", "000011", "000011"],
						["77DD66", "447733", "77DD66", "77DD66", "000011", "000011", "CCFFBB", "227733"],
						["77DD66", "77DD66", "000011", "000011", "000011", "33BB44", "CCFFBB", "33BB44"],
						["77DD66", "000011", "000011", "77DD66", "CCFFBB", "77DD66", "227733", "CCFFBB"],
						["000011", "000011", "33BB44", "CCFFBB", "CCFFBB", "CCFFBB", "77DD66", "77DD66"]];

var tree_top_r = new Object();
tree_top_r.name = "Tree Top R";
tree_top_r.order = 1;
tree_top_r.id = 1;
tree_top_r.data =	   [["000011", "000011", "33BB44", "CCFFBB", "CCFFBB", "CCFFBB", "77DD66", "77DD66"],
						["77DD66", "000011", "000011", "77DD66", "CCFFBB", "77DD66", "227733", "CCFFBB"],
						["77DD66", "77DD66", "000011", "000011", "000011", "33BB44", "CCFFBB", "33BB44"],
						["77DD66", "77DD66", "77DD66", "77DD66", "000011", "000011", "CCFFBB", "227733"],
						["77DD66", "447733", "77DD66", "77DD66", "77DD66", "77DD66", "000011", "000011"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "447733", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"]];

var tree_mid_l = new Object();
tree_mid_l.name = "Tree Middle L";
tree_mid_l.order = 2;
tree_mid_l.id = 2;
tree_mid_l.data =	   [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "000011", "000011", "000011", "000011", "000011"],
						["000011", "000011", "000011", "CCFFBB", "33BB44", "33BB44", "33BB44", "447733"],
						["227733", "447733", "447733", "77DD66", "CCFFBB", "447733", "77DD66", "33BB44"],
						["227733", "33BB44", "447733", "447733", "33BB44", "CCFFBB", "CCFFBB", "33BB44"],
						["33BB44", "227733", "227733", "33BB44", "447733", "77DD66", "CCFFBB", "77DD66"],
						["227733", "227733", "33BB44", "33BB44", "447733", "33BB44", "33BB44", "77DD66"]];

var tree_mid_r = new Object();
tree_mid_r.name = "Tree Middle R";
tree_mid_r.order = 3;
tree_mid_r.id = 3;
tree_mid_r.data =	   [["227733", "227733", "33BB44", "33BB44", "447733", "33BB44", "33BB44", "77DD66"],
						["33BB44", "227733", "227733", "33BB44", "447733", "77DD66", "CCFFBB", "77DD66"],
						["227733", "33BB44", "447733", "447733", "33BB44", "CCFFBB", "CCFFBB", "33BB44"],
						["227733", "447733", "447733", "77DD66", "CCFFBB", "77DD66", "77DD66", "33BB44"],
						["000011", "000011", "000011", "CCFFBB", "33BB44", "33BB44", "33BB44", "447733"],
						["77DD66", "77DD66", "77DD66", "000011", "000011", "000011", "000011", "000011"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "447733", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"]];

var tree_bot_l = new Object();
tree_bot_l.name = "Tree Bottom L";
tree_bot_l.order = 4;
tree_bot_l.id = 4;
tree_bot_l.data =	   [["77DD66", "000011", "000011", "000011", "77DD66", "77DD66", "77DD66", "77DD66"],
						["000011", "000011", "33BB44", "227733", "000011", "77DD66", "77DD66", "77DD66"],
						["000011", "33BB44", "33BB44", "227733", "227733", "000011", "CCFFBB", "77DD66"],
						["33BB44", "447733", "447733", "227733", "227733", "000011", "77DD66", "77DD66"],
						["447733", "447733", "77DD66", "77DD66", "227733", "227733", "000011", "77DD66"],
						["33BB44", "447733", "77DD66", "77DD66", "227733", "227733", "227733", "000011"],
						["33BB44", "447733", "447733", "77DD66", "77DD66", "227733", "227733", "000011"],
						["447733", "447733", "447733", "77DD66", "77DD66", "227733", "227733", "000011"]];

var tree_bot_r = new Object();
tree_bot_r.name = "Tree Bottom R";
tree_bot_r.order = 5;
tree_bot_r.id = 5;
tree_bot_r.data =	   [["447733", "447733", "447733", "77DD66", "77DD66", "227733", "227733", "000011"],
						["33BB44", "447733", "447733", "77DD66", "77DD66", "227733", "227733", "000011"],
						["33BB44", "447733", "77DD66", "77DD66", "227733", "227733", "227733", "000011"],
						["447733", "447733", "77DD66", "77DD66", "227733", "227733", "000011", "77DD66"],
						["33BB44", "447733", "447733", "227733", "227733", "000011", "77DD66", "77DD66"],
						["000011", "33BB44", "33BB44", "227733", "227733", "000011", "77DD66", "77DD66"],
						["000011", "000011", "33BB44", "227733", "000011", "77DD66", "447733", "77DD66"],
						["77DD66", "000011", "000011", "000011", "77DD66", "77DD66", "77DD66", "77DD66"]];

var tree_stump_l = new Object();
tree_stump_l.name = "Tree Stump L";
tree_stump_l.order = 6;
tree_stump_l.id = 6;
tree_stump_l.data =    [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "DDEE77", "77DD66", "77DD66", "CCFFBB", "77DD66"],
						["77DD66", "77DD66", "DDEE77", "AABB00", "DDEE77", "77DD66", "77DD66", "77DD66"],
						["77DD66", "DDEE77", "AABB00", "AABB00", "AABB00", "DDEE77", "77DD66", "77DD66"],
						["AABB00", "AABB00", "000011", "AABB00", "AABB00", "AABB00", "DDEE77", "77DD66"],
						["000011", "000011", "994499", "000011", "AABB00", "AABB00", "DDEE77", "77DD66"],
						["663300", "663300", "663300", "994499", "000011", "AABB00", "DDEE77", "77DD66"]];

var tree_stump_r = new Object();
tree_stump_r.name = "Tree Stump R";
tree_stump_r.order = 7;
tree_stump_r.id = 7;
tree_stump_r.data =    [["663300", "663300", "663300", "994499", "000011", "AABB00", "DDEE77", "77DD66"],
						["000011", "000011", "994499", "000011", "AABB00", "AABB00", "DDEE77", "77DD66"],
						["AABB00", "AABB00", "000011", "AABB00", "AABB00", "AABB00", "DDEE77", "77DD66"],
						["77DD66", "DDEE77", "AABB00", "AABB00", "AABB00", "DDEE77", "77DD66", "77DD66"],
						["77DD66", "447733", "DDEE77", "AABB00", "DDEE77", "447733", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "DDEE77", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "CCFFBB", "77DD66", "77DD66", "447733", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"]];

var tree_mid_2_l = new Object();
tree_mid_2_l.name = "Tree Middle 2 L";
tree_mid_2_l.order = 8;
tree_mid_2_l.id = 8;
tree_mid_2_l.data =	   [["447733", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "77DD66", "77DD66", "000011", "000011", "000011", "000011", "000011"],
						["000011", "000011", "000011", "CCFFBB", "33BB44", "33BB44", "000011", "000011"],
						["227733", "447733", "447733", "77DD66", "000011", "000011", "CCFFBB", "227733"],
						["227733", "33BB44", "000011", "000011", "000011", "33BB44", "CCFFBB", "33BB44"],
						["33BB44", "000011", "000011", "77DD66", "CCFFBB", "77DD66", "227733", "CCFFBB"],
						["000011", "000011", "33BB44", "CCFFBB", "CCFFBB", "CCFFBB", "77DD66", "77DD66"]];

var tree_mid_2_r = new Object();
tree_mid_2_r.name = "Tree Middle 2 R";
tree_mid_2_r.order = 9;
tree_mid_2_r.id = 9;
tree_mid_2_r.data =	   [["000011", "000011", "33BB44", "CCFFBB", "CCFFBB", "CCFFBB", "77DD66", "77DD66"],
						["33BB44", "000011", "000011", "77DD66", "CCFFBB", "77DD66", "227733", "CCFFBB"],
						["227733", "33BB44", "000011", "000011", "000011", "33BB44", "CCFFBB", "33BB44"],
						["227733", "447733", "447733", "77DD66", "000011", "000011", "CCFFBB", "227733"],
						["000011", "000011", "000011", "CCFFBB", "33BB44", "33BB44", "000011", "000011"],
						["77DD66", "77DD66", "77DD66", "000011", "000011", "000011", "000011", "000011"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "447733", "77DD66"],
						["77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66", "77DD66"]];

var tree_top_2_l = new Object();
tree_top_2_l.name = "Tree Top 2 L";
tree_top_2_l.order = 10;
tree_top_2_l.id = 10;
tree_top_2_l.data =	   [["77DD66", "000011", "000011", "000011", "77DD66", "77DD66", "77DD66", "77DD66"],
						["000011", "000011", "33BB44", "227733", "000011", "77DD66", "77DD66", "77DD66"],
						["000011", "33BB44", "33BB44", "000011", "000011", "000011", "000011", "000011"],
						["000011", "000011", "000011", "CCFFBB", "33BB44", "33BB44", "000011", "000011"],
						["227733", "447733", "447733", "77DD66", "000011", "000011", "CCFFBB", "227733"],
						["227733", "33BB44", "000011", "000011", "000011", "33BB44", "CCFFBB", "33BB44"],
						["33BB44", "000011", "000011", "77DD66", "CCFFBB", "77DD66", "227733", "CCFFBB"],
						["000011", "000011", "33BB44", "CCFFBB", "CCFFBB", "CCFFBB", "77DD66", "77DD66"]];

var tree_top_2_r = new Object();
tree_top_2_r.name = "Tree Top 2 R";
tree_top_2_r.order = 11;
tree_top_2_r.id = 11;
tree_top_2_r.data =	   [["000011", "000011", "33BB44", "CCFFBB", "CCFFBB", "CCFFBB", "77DD66", "77DD66"],
						["33BB44", "000011", "000011", "77DD66", "CCFFBB", "77DD66", "227733", "CCFFBB"],
						["227733", "33BB44", "000011", "000011", "000011", "33BB44", "CCFFBB", "33BB44"],
						["227733", "447733", "447733", "77DD66", "000011", "000011", "CCFFBB", "227733"],
						["000011", "000011", "000011", "CCFFBB", "33BB44", "33BB44", "000011", "000011"],
						["000011", "33BB44", "33BB44", "000011", "000011", "000011", "000011", "000011"],
						["000011", "000011", "33BB44", "227733", "000011", "77DD66", "447733", "77DD66"],
						["77DD66", "000011", "000011", "000011", "77DD66", "77DD66", "77DD66", "77DD66"]];

var tree_bot_2_l = new Object();
tree_bot_2_l.name = "Tree Bottom 2 L";
tree_bot_2_l.order = 12;
tree_bot_2_l.id = 12;
tree_bot_2_l.data =	   [["77DD66", "000011", "000011", "000011", "77DD66", "77DD66", "77DD66", "77DD66"],
						["000011", "000011", "33BB44", "227733", "000011", "77DD66", "77DD66", "77DD66"],
						["000011", "33BB44", "33BB44", "000011", "000011", "000011", "000011", "000011"],
						["000011", "000011", "000011", "CCFFBB", "33BB44", "33BB44", "33BB44", "447733"],
						["227733", "447733", "447733", "77DD66", "CCFFBB", "447733", "77DD66", "33BB44"],
						["227733", "33BB44", "447733", "447733", "33BB44", "CCFFBB", "CCFFBB", "33BB44"],
						["33BB44", "227733", "227733", "33BB44", "447733", "77DD66", "CCFFBB", "77DD66"],
						["227733", "227733", "33BB44", "33BB44", "447733", "33BB44", "33BB44", "77DD66"]];

var tree_bot_2_r = new Object();
tree_bot_2_r.name = "Tree Bottom 2 R";
tree_bot_2_r.order = 13;
tree_bot_2_r.id = 13;
tree_bot_2_r.data =	   [["227733", "227733", "33BB44", "33BB44", "447733", "33BB44", "33BB44", "77DD66"],
						["33BB44", "227733", "227733", "33BB44", "447733", "77DD66", "CCFFBB", "77DD66"],
						["227733", "33BB44", "447733", "447733", "33BB44", "CCFFBB", "CCFFBB", "33BB44"],
						["227733", "447733", "447733", "77DD66", "CCFFBB", "77DD66", "77DD66", "33BB44"],
						["000011", "000011", "000011", "CCFFBB", "33BB44", "33BB44", "33BB44", "447733"],
						["000011", "33BB44", "33BB44", "000011", "000011", "000011", "000011", "000011"],
						["000011", "000011", "33BB44", "227733", "000011", "77DD66", "447733", "77DD66"],
						["77DD66", "000011", "000011", "000011", "77DD66", "77DD66", "77DD66", "77DD66"]];

var g_tree = new Object();
g_tree.name = "Tree";
g_tree.gorder = 3;
g_tree.gid = 3;
g_tree.textures = new Array( tree_top_l, tree_top_r, tree_mid_l, tree_mid_r, tree_bot_l, tree_bot_r, tree_stump_l, tree_stump_r, tree_mid_2_l, tree_mid_2_r, tree_top_2_l, tree_top_2_r, tree_bot_2_l, tree_bot_2_r );

var fence = new Object();
fence.name = "Fence";
fence.order = 0;
fence.id = 0;
fence.data =	       [["77DD66", "77DD66", "000011", "000011", "77DD66", "77DD66", "77DD66", "77DD66"],
						["77DD66", "000011", "77DD66", "77DD66", "000011", "000011", "CCFFBB", "77DD66"],
						["000011", "77DD66", "CCFFBB", "CCFFBB", "77DD66", "77DD66", "000011", "000011"],
						["000011", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "77DD66", "000011"],
						["000011", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "77DD66", "000011"],
						["000011", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "CCFFBB", "77DD66", "000011"],
						["77DD66", "000011", "CCFFBB", "77DD66", "77DD66", "000011", "000011", "77DD66"],
						["77DD66", "77DD66", "000011", "000011", "000011", "77DD66", "77DD66", "77DD66"]];

var g_fence = new Object();
g_fence.name = "Fence";
g_fence.gorder = 4;
g_fence.gid = 4;
g_fence.textures = new Array( fence );

/* Store textures in an array */
var demo_textures = new Array( g_grass_bg, g_mat, g_bollard, g_tree, g_fence );

/* Demo map */
var blank_tile = new Object();
blank_tile.can_walk = [true, true, true, true];
blank_tile.texture_gid = 0;
blank_tile.texture_id = 0;
blank_tile.texture_reverse_x = false;
blank_tile.texture_reverse_y = false;
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

/* Store maps in an array */
var demo_maps = new Array( map1, map2 );

var demo_project = new Object();
demo_project.name = "Demo Project";
demo_project.textures = demo_textures;
demo_project.maps = demo_maps;

var empty_project = new Object();
empty_project.name = "New Project";
empty_project.textures = new Array();
empty_project.maps = new Array();

var project = empty_project;

/* Load demo project */
var project = demo_project;

function export_data() {

	/* Convert our data to the correct format for the Picosystem */
	var output = ""

	output += "#pragma once\n\n";
	output += "namespace picosystem {\n\n";

	/* Start by exporting all the textures */
	sort_groups_by_gorder();

	/* Loop through each texture group */
	$.each( project.textures , function( gi, group ) {

		output += "  const uint16_t " + group.name.toLowerCase().replace( / /g, "_" ) + "[" +  ( group.textures.length * 64 ) + "] = {\n";
		
		sort_textures_by_order( group.gid );

		$.each( group.textures, function( si, texture ) {

			/* Convert pixel values for Picosystem */
			var convert_texture = new Array();
			$.extend( true, convert_texture, texture.data ); /* Clone array */

			/* Loop through each row of the texture */
			$.each( convert_texture, function( ri, texture_row ) {

				/* Loop through each pixel */
				$.each( texture_row, function( ci, texture_cell ) {

					/* Convert to int */
					var texture_cell_int = parseInt(texture_cell, 16);
					/* Convert 24-bit colour to 12-bit colour for the Picosystem */
					texture_cell_int = ( ((texture_cell_int & 0xF0) >> 4) | ((texture_cell_int & 0xF000) >> 8) | ((texture_cell_int & 0xF00000) >> 12) );
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
	});

	output += "  const uint16_t* _texture_map[" + project.textures.length + "] {\n";

	/* Loop through each texture group */
	$.each( project.textures , function( i, group ) {

		output += "    " + group.name.toLowerCase().replace( / /g, "_" ) + ", // " + i + "\n";
	});

	output += "  };\n\n";

	/* Next let's export the maps */
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

				/* Add in the data for each cell */
				output += "{";
				output += Number(cell.can_walk[0]) + ", " + Number(cell.can_walk[1]) + ", " + Number(cell.can_walk[2]) + ", " + Number(cell.can_walk[3]) + ", ";
				output += Number(cell.texture_gid) + ", " + Number(cell.texture_id) + ", " + Number(cell.texture_reverse_x) + ", " + Number(cell.texture_reverse_y) + ", ";
				output += Number(cell.exit_tile) + ", " + Number(cell.exit_map_id) + ", {";
				output += cell.exit_map_dir[0] + ", " + cell.exit_map_dir[1] + "}, {";
				output += cell.exit_map_pos[0] + ", " + cell.exit_map_pos[1] + "} ";
				output += "}, "
			} );

			output += "},\n";
		} );

		output += "  };\n";
  		output += "  struct map " + map_name_conv + " = { " + map.id + ", *_" + map_name_conv + ", " + map.height + ", " + map.width + " };\n\n"

	} );

	output += "  map map_list[" + project.maps.length + "] {\n";

	/* Loop through each map */
	$.each( project.maps , function( i, map ) {

		output += "    " + map.name.toLowerCase().replace( / /g, "_" ) + ", // " + i + "\n";
	});

	output += "  };\n\n";
	output += "}";

	var blob = new Blob( [output], { type: "text/plain" } );
	var file = document.createElement( "a" );
	file.download = project.name.toLowerCase().replace( / /g, "_" ) + ".hpp";
	file.href = window.URL.createObjectURL( blob );
	file.click();
}