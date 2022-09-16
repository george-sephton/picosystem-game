/*
https://www.youtube.com/watch?v=aF1Yw_wu2cM
https://www.youtube.com/watch?v=ZI50XUeN6QE
https://www.youtube.com/watch?v=gwF0L55kIgg

https://binji.github.io/posts/pokegb/
https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red/Blue:RAM_map
*/

// Include PicoSystem hardware
#include <picosystem.hpp>
#include <picosystem-game.hpp>
// Include assets
#include <demo_project.hpp>

using namespace picosystem;

// ---------------------------------------------------------------------------------
// DEBUGGING DEFINITIONS
// ---------------------------------------------------------------------------------
#define map_rendering_offsets         false    // Displays player position on map and no of calculated empty rows & columns
#define map_rendering_scroll          true    // Displays player position on map and no of calculated extra pixels to render 
#define player_movement               false    // Displays player position
#define player_position               false    // Draws coloured boxes to indicate if player can move or if there are obstacles, edge of map or exit tiles
#define exit_map_info                 false    // Displays information about the map to load if exiting current map
#define animation_info                false    // Displays information about the running animation

char write_text[30];
  
// ---------------------------------------------------------------------------------
// GLOBAL VARIABLES
// ---------------------------------------------------------------------------------

// Player movement variables
uint8_t _offset_n, _offset_e, _offset_s, _offset_w;
uint8_t _scroll_offset_n, _scroll_offset_e, _scroll_offset_s, _scroll_offset_w;
dir_vec map_pos;
dir_en allowed_movement;
dir_en exit_tile;

// Movement scrolling animation
bool scroll_movement;
uint16_t scroll_counter;
dir_vec upcoming_map_pos;

// Development
map *_current_map;

// ---------------------------------------------------------------------------------
// MAIN FUNCTIONS
// ---------------------------------------------------------------------------------

void init() {
  // initialise the world

  play(1000, 500, 100);

  // Load the map
  _current_map = &map_list[2];

  // Set our initial location
  //map_pos = {3, 3};
  //map_pos = {20, 19};
  map_pos = {14, 14};
  // We're not moving
  player.walk_dir.x = 0;
  player.walk_dir.y = 0;

  scroll_movement = false;
  scroll_counter = 0;
  upcoming_map_pos.x = 0;
  upcoming_map_pos.y = 0;
  // Facing south
  player.face_dir.x = 0;
  player.face_dir.y = -1;
  // Initialise
  player.reverse_walking_render = false;
  // No animations in progress
  animation.running = false;
  // We're not about to move maps
  exit_map.waiting_load = false;
  exit_map.waiting_show = false;
}

void update( uint32_t tick ) {

  /* Update function
   * Contains all game mechanics
   */
  
  bool start_exit_animation = false;

  // Advance the animation, if running and not finished
  /*if((animation.running) && (!animation.finished)) 
    animation.tick++;*/
  
  /*
   * Player movement functionality
   */

  /* Start by calculating our movement restructions */
  const struct map_tile (*current_map_tile_ptr) = _current_map->map_tiles_ptr; // Get a pointer to the current tile
  current_map_tile_ptr += map_pos.y * _current_map->map_width; // Move to the correct y value
  current_map_tile_ptr += map_pos.x; // Move to the correct x value

  /* See if we're stood on an exit tile or not */
  exit_tile = { false, false, false, false };

  if( (*current_map_tile_ptr).exit_tile ) {

    /* We're stood on an exit tile, let's check which direction the exit is */
    if( (*current_map_tile_ptr).exit_map_dir.y == 1 ) {
      exit_tile.travel_n = true;
    } else if( (*current_map_tile_ptr).exit_map_dir.x == 1 ) {
      exit_tile.travel_e = true;
    } else if( (*current_map_tile_ptr).exit_map_dir.y == -1 ) {
      exit_tile.travel_s = true;
    } else if( (*current_map_tile_ptr).exit_map_dir.x == -1 ) {
      exit_tile.travel_w = true;
    }

    /* Now store the details of the map to load if we exit this one */
    exit_map.exit_map_id = (*current_map_tile_ptr).exit_map_id;
    exit_map.exit_map_pos = (*current_map_tile_ptr).exit_map_pos;
  }

  /* Now see which directions we're allowed to walk in */
  allowed_movement = {false, false, false, false};

  if( map_pos.y != 0 ) {
    current_map_tile_ptr -= _current_map->map_width; // Move pointer up a row
    allowed_movement.travel_n = (*current_map_tile_ptr).can_walk_s;
    current_map_tile_ptr += _current_map->map_width; // Move pointer back to same row as player
  }
  if( map_pos.x != ( _current_map->map_width - 1 ) ) {
    current_map_tile_ptr++; // Move pointer to next column along
    allowed_movement.travel_e = (*current_map_tile_ptr).can_walk_w;
    current_map_tile_ptr--; // Move pointer back to same column as player
  }
  if( map_pos.y != ( _current_map->map_height - 1 ) ) {
    current_map_tile_ptr += _current_map->map_width; // Move pointer down a row
    allowed_movement.travel_s = (*current_map_tile_ptr).can_walk_n;
    current_map_tile_ptr -= _current_map->map_width; // Move pointer back to same row as player
  }
  if( map_pos.x != 0 ) {
    current_map_tile_ptr--; // Move pointer back a column
    allowed_movement.travel_w = (*current_map_tile_ptr).can_walk_e;
    current_map_tile_ptr++; // Move pointer back to same column as player
  }

  /* Check input presses as they happen, unless there's an animation running, in which case we don't care */
  if( !animation.running ){

    if( button( UP ) ) { // Switch player's direction to N

      player.walk_dir.x = 0;
      player.walk_dir.y = 1;

      player.face_dir.x = 0;
      player.face_dir.y = 1;
    } else if( button( RIGHT ) ) { // Switch player's direction to E

      player.walk_dir.x = 1;
      player.walk_dir.y = 0;

      player.face_dir.x = 1;
      player.face_dir.y = 0;
    } else if( button( DOWN ) ) { // Switch player's direction to S

      player.walk_dir.x = 0;
      player.walk_dir.y = -1;

      player.face_dir.x = 0;
      player.face_dir.y = -1;
    } else if( button( LEFT ) ) { // Switch player's direction to W

      player.walk_dir.x = -1;
      player.walk_dir.y = 0;

      player.face_dir.x = -1;
      player.face_dir.y = 0;
    } else { // Player's not moving

      player.walk_dir.x = 0;
      player.walk_dir.y = 0;
    }
  }

  // Advance scroll animation
  /*if(scroll_movement){
    
    
    
    if(scroll_counter >= 8) {
      
      // End animation and set new user position
      scroll_counter = 0;
      map_pos.x += upcoming_map_pos.x;
      map_pos.y += upcoming_map_pos.y;
      
      scroll_movement = false;
      upcoming_map_pos.x = 0;
      upcoming_map_pos.y = 0;
    }
      
  }*/

  /* All other movement functions to be restricted to game tick, this controls player's movement speed */
  if( ( tick % 23 ) == 0 ) {
    
    // Development: Advance scroll animation
    scroll_counter++;
    if(scroll_counter >= 8) {
      scroll_counter = 0;
    }

    /* If the player is walking, let's make their little legs move */
    if( ( ( player.walk_dir.x != 0 ) || ( player.walk_dir.y != 0 ) ) && ( ( !animation.running ) || ( scroll_movement ) ) ) {
      player.reverse_walking_render = !player.reverse_walking_render;
    }

    /* Move the player according to button inputs and movement restrictions */
    if( !animation.running ) { // Don't alter movement if an animation is running

      /* Player is moving north */
      if( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == 1 ) ) {

        if( exit_tile.travel_n ) {
          
          /* Map exit, start animation and load new map */
          start_exit_animation = true;
        } else {

          /* Move to a new tile, check if they're allowed there */
          if( allowed_movement.travel_n ) {

            /* Start the scroll animation and set the new tile position */
            //upcoming_map_pos.y = -1;
            //scroll_movement = true;
            if( button( B ) ) map_pos.y--;
          }
        }

      /* Player is moving east */
      } else if( ( player.walk_dir.x == 1 ) && ( player.walk_dir.y == 0 ) ) {
        
        if( exit_tile.travel_e ) {
          
          /* Map exit, start animation and load new map */
          start_exit_animation = true;
        } else {

          /* Move to a new tile, check if they're allowed there */
          if( allowed_movement.travel_e ) {
            
            /* Start the scroll animation and set the new tile position */
            //upcoming_map_pos.x = 1;
            //scroll_movement = true;
            if( button( B ) ) map_pos.x++;
          }
        }
      
      /* Player is moving south */
      } else if( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == -1 ) ) {
      
        if( exit_tile.travel_s ) {
          
          /* Map exit, start animation and load new map */
          start_exit_animation = true;
        } else {

          /* Move to a new tile, check if they're allowed there */
          if( allowed_movement.travel_s)  {
            
            /* Start the scroll animation and set the new tile position */
            //upcoming_map_pos.y = 1;
            //scroll_movement = true;
            if( button( B ) ) map_pos.y++;
          }
        }

      /* Player is moving west */
      } else if( ( player.walk_dir.x == -1 ) && ( player.walk_dir.y == 0 ) ) {
        
        if( exit_tile.travel_w ) {
          
          /* Map exit, start animation and load new map */
          start_exit_animation = true;
        } else {

          /* Move to a new tile, check if they're allowed there */
          if( allowed_movement.travel_w ) {
            
            /* Start the scroll animation and set the new tile position */
            //upcoming_map_pos.x = -1;
            //scroll_movement = true;
            if( button( B ) ) map_pos.x--;
          }
        }
      }
    }

    // Check if it's time to start the fade out animation
    /*if(start_exit_animation) {
      exit_map.waiting_load = true;
      start_animation(fade_screen, 3, false);
    }*/
  }
}

void draw(uint32_t tick) {

  /* Draw function
   * Called immediately after update function and then followed by background transfer to display
   * Contains all the functions to draw the display
   */

  int16_t _draw_x, _draw_y;
  int8_t _scroll_x, _scroll_y;

  /* Clear display buffer */
  clear_screen( 0x0000 );

  /*
   * Map and player sprite rendering functionality
   */

  /* Calculate how many tiles in each direction we need to draw */
  if( 1 ) {
  _scroll_offset_n = 0;
  _scroll_offset_e = 0;
  _scroll_offset_s = 0;
  _scroll_offset_w = 0;
  
  _offset_n = 0;
  _offset_e = 0;
  _offset_s = 0; 
  _offset_w = 0;

  if( map_pos.x < 8 ) {
    _offset_w = ( 7 - map_pos.x );
  } else {
    if( ( player.walk_dir.x == -1 ) && ( player.walk_dir.y == 0 ) && ( scroll_counter != 0 ) ) {
      _scroll_offset_w = 1;
    }
  }
  if( ( map_pos.x + 8 ) > _current_map->map_width ) {
    _offset_e = (map_pos.x + 8 - _current_map->map_width);
  } else { 
    if( ( player.walk_dir.x == 1 ) && ( player.walk_dir.y == 0 ) && ( scroll_counter != 0 ) ) {
      _scroll_offset_e = 1;
    }
  }
  if( map_pos.y < 8 ) {
    _offset_n = (7 - map_pos.y);
  } else {
    if( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == 1 ) && ( scroll_counter != 0 ) ) {
      _scroll_offset_n = 1;
    }
  }
  if( ( map_pos.y + 9 ) > _current_map->map_height ) {
    _offset_s = (map_pos.y + 8 - _current_map->map_height);  
  } else {
    if( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == -1 ) && ( scroll_counter != 0 ) ) {
      _scroll_offset_s = 1;
    }
  }
   

  }



  /* If we are performing a scrolling animation, change the offsets to add an extra tile to allow the scroll to show offscreen tiles that are entering the display */
  _scroll_x = player.walk_dir.x * scroll_counter;
  _scroll_y = player.walk_dir.y * scroll_counter; 

  /* Get the current map tile pointer, starting at (0, 0) */
  const struct map_tile (*map_tiles_ptr) = _current_map->map_tiles_ptr;

  /* Move the map pointer to first column to draw, if there's a gap around the edges, we don't need to move anything */
  if( _offset_w == 0 )
    map_tiles_ptr += ( map_pos.x - 7 - _scroll_offset_w); // If we're scrolling, we need to move back a tile
  
  /* Move the map pointer to first row to draw, if there's a gap around the edges, we don't need to move anything */
  if( _offset_n == 0 )
    map_tiles_ptr += ((map_pos.y - 7 - _scroll_offset_n ) * _current_map->map_width); // If we're scrolling, we need to move back a tile

  /* Loop through each of the 15 rows of the display, add an extra row if scrolling */
  for( _draw_y = 0; _draw_y < ( 15 + _scroll_offset_n + _scroll_offset_s ); _draw_y++ ) {

    /* Ignore tiles outside of the map limits */
    if( (_draw_y >= _offset_n) && (_draw_y < (15 - _offset_s + _scroll_offset_n + _scroll_offset_s) ) ) {

      /* Loop through each of the 15 columns, add an extra column if scrolling */
      for( _draw_x = 0; _draw_x < ( 15 + _scroll_offset_w + _scroll_offset_e ); _draw_x++ ) {

        /* Again, ignore tiles outside of the map limits */
        if( (_draw_x >= _offset_w ) && ((map_pos.x + _draw_x - 6 ) <= ( _current_map->map_width + _scroll_offset_w ) ) ) {

          /* Draw the background texture if the map has one */
          if( _current_map->bg_texture != -1 )
            draw_sprite((uint16_t*)_texture_map[_current_map->bg_texture], _current_map->bg_texture_offset, 0, 0, ( ( ( _draw_x - _scroll_offset_w ) * 8 ) - _scroll_x ), ((( _draw_y - _scroll_offset_n ) * 8) + _scroll_y), 8);

          /* Draw the map texure, if any */
          if( ( (*map_tiles_ptr).texture != -1 ) && ( (*map_tiles_ptr).top_layer == false) )
            draw_sprite((uint16_t*)_texture_map[(*map_tiles_ptr).texture], (*map_tiles_ptr).texture_offset, (*map_tiles_ptr).texture_reverse_x, (*map_tiles_ptr).texture_reverse_y, ( ( ( _draw_x - _scroll_offset_w ) * 8 ) - _scroll_x ), ((( _draw_y - _scroll_offset_n ) * 8) + _scroll_y), 8);

          // If we've drawn a tile, increment the pointer (unless we're at the last column of the display, don't want to accidentally cause a hard fault)
          if((_draw_x ) != (14 + _scroll_offset_w + _scroll_offset_e)) map_tiles_ptr++;

        }
      }

      /* Increment the pointer as we move to the next row on the dislay, but we don't need to if the map width fits entirely on the display */
      if( (_offset_e == 0 ) || ( _offset_w == 0 ) ) {
        
        /* If we're drawing the last row then don't move the pointer either */
        if(_draw_y != (14 + _scroll_offset_s + _scroll_offset_n) ) 
          map_tiles_ptr += ( _current_map->map_width - 14 + _offset_w + ( ( _offset_e > 1 ) ? ( _offset_e - 1 ) : 0 ) - (  _offset_w ? 0 : _scroll_offset_w  ) - (  _offset_e ? 0 : _scroll_offset_e  ) );
      }
    }
  }

  // Draw an exit arrow if we're stood on an exit tile at the edge of the map
  if( 1 ) {
  if((exit_tile.travel_n) && (map_pos.y == 0))
    draw_sprite((uint16_t*)arrow, 0, false, true, 56, 48, 8);
  if((exit_tile.travel_e) && (map_pos.x == (_current_map->map_width - 1)))
    draw_sprite((uint16_t*)arrow, 1, true, false, 64, 56, 8);
  if((exit_tile.travel_s) && (map_pos.y == (_current_map->map_height - 1)))
    draw_sprite((uint16_t*)arrow, 0, false, false, 56, 64, 8);
  if((exit_tile.travel_w) && (map_pos.x == 0))
    draw_sprite((uint16_t*)arrow, 1, false, false, 48, 56, 8);
  }

  // Draw the player in the centre square (8, 8)
  if((player.walk_dir.x == 0) && (player.walk_dir.y == 0)) {
    
    // The player is currently stood still, let's draw them facing the right direction
    if((player.face_dir.x == 0) && (player.face_dir.y == 1)) {
      // Facing N
      draw_sprite((uint16_t*)male_player, 4, false, false, 52, 52, 16);
    } else if((player.face_dir.x == -1) && (player.face_dir.y == 0)) {
      // Facing W
      draw_sprite((uint16_t*)male_player, 2, false, false, 52, 52, 16);
    } else if((player.face_dir.x == 1) && (player.face_dir.y == 0)) {
      // Facing E
      draw_sprite((uint16_t*)male_player, 2, true, false, 52, 52, 16);
    } else {
      // Facing S - also default value
      draw_sprite((uint16_t*)male_player, 0, false, false, 52, 52, 16);
    }

  // Player is walking, draw the walking sprite
  } else if((player.walk_dir.x == 0) && (player.walk_dir.y == 1)) {
    // Walking N
    draw_sprite((uint16_t*)male_player, 5, player.reverse_walking_render, false, 52, 52, 16);
  } else if((player.walk_dir.x == 1) && (player.walk_dir.y == 0)) {
    // Walking E
    draw_sprite((uint16_t*)male_player, (2 + player.reverse_walking_render), true, false, 52, 52, 16);
  } else if((player.walk_dir.x == 0) && (player.walk_dir.y == -1)) {
    // Walking S
    draw_sprite((uint16_t*)male_player, 1, player.reverse_walking_render, false, 52, 52, 16);
  } else if((player.walk_dir.x == -1) && (player.walk_dir.y == 0)) {
    // Walking W
    draw_sprite((uint16_t*)male_player, (2 + player.reverse_walking_render), false, false, 52, 52, 16);
  }

  /*if(1) { 
  // Now draw any top layer tiles as these are rendered on top of the player
  
  // Go back to the start of the current map
  const struct map_tile (*map_tiles_ptr2) = _current_map->map_tiles_ptr;
  // Move the map pointer to the column first tile to draw
  if(_x_offset_n == 0)
    map_tiles_ptr2 += (map_pos.x - 7);
  // and move the pointer to the row of the first tile to draw
  if(_y_offset_n == 0)
     map_tiles_ptr2 += ((map_pos.y - 7) * _current_map->map_width);

  // Loopg through the 15 rows of the display (y-direction)
  for(_draw_y=0; _draw_y < 15; _draw_y++) {
    
    // Only draw if there's map tiles to be drawn
    if( (_draw_y >= _y_offset_n) && (_draw_y < (15 - _y_offset_p)) ) {
      
      // Next loop through the 15 columns of the display (x-direction)
      for(_draw_x=0; _draw_x < 15; _draw_x++) {

        // Again, make sure we're drawing the map titles in the correct places
        if( (_draw_x >= _x_offset_n) && ((map_pos.x + _draw_x - 6) <= _current_map->map_width) ) {
          
          //Make sure there's a sprite to draw
          if( ( (*map_tiles_ptr2).sprite != -1 ) && ( (*map_tiles_ptr2).top_layer == true) )
            
            //draw_rec((_draw_x * 8), (_draw_y * 8), 8, 8, rgb(0x00F));
            //draw_sprite((uint16_t*)_texture_map[(*map_tiles_ptr2).sprite], (*map_tiles_ptr2).sprite_offset, (*map_tiles_ptr2).sprite_reverse_x, (*map_tiles_ptr2).sprite_reverse_y, (_draw_x * 8), (_draw_y * 8), 8);

          // If we've drawn a tile, increment the pointer (unless we're at the last column of the display, don't want to accidentally cause a hard fault)
          if(_draw_x != 14) map_tiles_ptr2++;
        }
      }
      // Increment the pointer as we move to the next row on the dislay, but don't move the pointers if the map width fits entirely on the display
      if((_x_offset_p == 0) || (_x_offset_n == 0)) {
        // Also if we're drawing the last row, then don't move the pointer either
        if(_draw_y != 14) map_tiles_ptr2 += ( _current_map->map_width - 14 + _x_offset_n + ((_x_offset_p > 1) ? (_x_offset_p - 1) : 0) );
      }

    }
  } }*/

  // An animation is running
  /*if(animation.running) {
    animation.animation_ptr();

    // Check if animation has finished
    if(animation.finished) {
      
      if(exit_map.waiting_load) {
        // Time to load up the new map
        
        // Move the player to the correct position
        map_pos = {exit_map.exit_map_pos.x, exit_map.exit_map_pos.y};
        // Set the new map
        _current_map = &map_list[exit_map.exit_map_id];
        
        // Set map as loaded but not shown
        exit_map.waiting_load = false;
        exit_map.waiting_show = true;
        // and trigger the fade in animation
        start_animation(fade_screen, 3, true);

      } else if (exit_map.waiting_show) {
        // Time to show the newly loaded map
        reset_animation();
        // Make sure we don't get stuck in the doorway
        exit_map.waiting_show = false;
        exit_map.exit_map_pos = {0, 0};
        animation.running = false;
      }
    }*/

  // DEBUGGING
  #if map_rendering_offsets
  sprintf(write_text, "P(%d,%d)O(%d,%d,%d,%d)", map_pos.x, map_pos.y, _offset_n, _offset_e, _offset_s, _offset_w);
  write_string(write_text, 8, 8, rgb(0xF00));
  #endif

  #if player_position
  sprintf(write_text,"P(%d,%d)D(%d,%d)F(%d,%d)", map_pos.x, map_pos.y, player.walk_dir.x, player.walk_dir.y, player.face_dir.x, player.face_dir.y);
  write_string(write_text, 1, 8, rgb(0xF00));
  #endif

  #if map_rendering_scroll
  sprintf(write_text,"S(%d)D(%d,%d)", scroll_counter, _scroll_x, _scroll_y);
  write_string(write_text, 1, 8, rgb(0xF00));
  sprintf(write_text, "P(%d,%d)O(%d,%d,%d,%d)", map_pos.x, map_pos.y, _offset_n, _offset_e, _offset_s, _offset_w);
  write_string(write_text, 1, 16, rgb(0xF00));
  sprintf(write_text, "S(%d,%d,%d,%d)", _scroll_offset_n, _scroll_offset_e, _scroll_offset_s, _scroll_offset_w);
  write_string(write_text, 1, 24, rgb(0xF00));
  #endif

  #if exit_map_info
  sprintf(write_text, "E(%d,%d,%d)P(%d %d)", exit_map.waiting_load, exit_map.waiting_show, exit_map.exit_map_id, exit_map.exit_map_pos.x, exit_map.exit_map_pos.y);
  write_string(write_text, 1, 8, rgb(0xF00));
  sprintf(write_text, "D(%d,%d,%d,%d)", exit_tile.travel_n, exit_tile.travel_e, exit_tile.travel_s, exit_tile.travel_w);
  write_string(write_text, 1, 16, rgb(0xF00));
  #endif 

  #if animation_info
  sprintf(write_text,"R(%d,%d)F(%d)S(%d)T(%d,%d)", animation.running, animation.reverse, animation.finished, animation.step, animation.tick % animation.occurance, ( (animation.tick % animation.occurance) ? 0 : 1) );
  write_string(write_text, 1, 24, rgb(0xF00));
  #endif
  
  #if player_movement 
  // Draw coloured squares to indicate player's allowed movement 
  if(exit_tile.travel_n) {
    
    // Blue tile since this is an exit tile 
    draw_rec(56, 48, 8, 8, rgb(0x00F));
  } else {

    if(map_pos.y != 0) {

      // Green tile as we are allow to walk in this direction
      if(allowed_movement.travel_n) draw_rec(56, 48, 8, 8, rgb(0x0F0)); //N

      // Red tile as we're not allowed to walk in this direction
      else draw_rec(56, 48, 8, 8, rgb(0xF00));
    } else {

      // Yellow tile as this is the edge of the map
      draw_rec(56, 48, 8, 8, rgb(0xFF0));
    }
  }
  
  if(exit_tile.travel_e) {
    draw_rec(64, 56, 8, 8, rgb(0x00F));
  } else {
    if(map_pos.x != (_current_map->map_width - 1)) {
      if(allowed_movement.travel_e) draw_rec(64, 56, 8, 8, rgb(0x0F0)); //E
      else draw_rec(64, 56, 8, 8, rgb(0xF00));
    } else {
      draw_rec(64, 56, 8, 8, rgb(0xFF0));
    }
  }

  if(exit_tile.travel_s) {
    draw_rec(56, 64, 8, 8, rgb(0x00F));
  } else {
    if(map_pos.y != (_current_map->map_height - 1)) {
      if(allowed_movement.travel_s) draw_rec(56, 64, 8, 8, rgb(0x0F0)); //S
      else draw_rec(56, 64, 8, 8, rgb(0xF00));
    } else {
      draw_rec(56, 64, 8, 8, rgb(0xFF0));
    }
  }

  if(exit_tile.travel_w) {
    draw_rec(48, 56, 8, 8, rgb(0x00F)); 
  } else {
    if(map_pos.x != 0) {
      if(allowed_movement.travel_w) draw_rec(48, 56, 8, 8, rgb(0x0F0)); //W
      else draw_rec(48, 56, 8, 8, rgb(0xF00)); 

    } else {
      draw_rec(48, 56, 8, 8, rgb(0xFF0)); 
    }
  }
  #endif
}
