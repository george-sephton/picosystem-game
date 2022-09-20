/*
https://www.youtube.com/watch?v=aF1Yw_wu2cM
https://www.youtube.com/watch?v=ZI50XUeN6QE
https://www.youtube.com/watch?v=gwF0L55kIgg

https://binji.github.io/posts/pokegb/
https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red/Blue:RAM_map
*/

/* Include PicoSystem hardware */
#include <picosystem.hpp>
#include <picosystem-game.hpp>

/* Include project assets */
#include <demo_project.hpp>

using namespace picosystem;

// ---------------------------------------------------------------------------------
// DEBUGGING DEFINITIONS
// ---------------------------------------------------------------------------------
#define map_rendering_offsets         false    // Displays player position on map and no of calculated empty rows & columns
#define map_rendering_scroll          false    // Displays player position on map and no of calculated extra pixels to render 
#define player_movement               false    // Displays player position
#define player_position               false    // Draws coloured boxes to indicate if player can move or if there are obstacles, edge of map or exit tiles
#define interaction_info              false    // Displays information about interaction tiles
#define exit_map_info                 false    // Displays information about the map to load if exiting current map
#define animation_info                false    // Displays information about the running animation
#define textbox_info                  false    // Displays information about the current textbox

#define player_movement_delay_val     5        // Delay value before a player will start walking, to allow them to change the direction they're facing without walking

char demo_text1[][20] = { "This is a test of", "the textbox", "mechanism.", "Does it work", "alright? Or could", "we improve it?" };
char demo_text2[][20] = { "This is another", "test of the", "textbox mechanism." };

// ---------------------------------------------------------------------------------
// GLOBAL VARIABLES
// ---------------------------------------------------------------------------------

/* Player movement variables */
uint8_t _offset_n, _offset_e, _offset_s, _offset_w;
uint8_t _scroll_offset_n, _scroll_offset_e, _scroll_offset_s, _scroll_offset_w;
dir_vec map_pos;
dir_en allowed_movement, exit_tile, interaction_tile;
int16_t interaction_tile_id[4];
uint8_t player_animation_tick, player_movement_delay;

/* Movement scrolling animation */
bool scroll_movement;
uint16_t scroll_counter;
dir_vec upcoming_map_pos;
int8_t _scroll_x, _scroll_y;

/* Textbox variables */
bool textbox_running;
uint8_t scroll_arrow_count, scroll_arrow_offset, total_textbox_lines, textbox_line, textbox_button_delay;
uint8_t write_text_line_count, write_text_char_count;
char (*text_ptr)[20], write_text[20];

/* Development */
map *_current_map;

// ---------------------------------------------------------------------------------
// MAIN FUNCTIONS
// ---------------------------------------------------------------------------------

/* Initialise the world */
void init() {
  
  /* Play a bougie sound */
  play(1000, 500, 100);

  /* Load the map and set our initial location */
  //_current_map = &map_list[0];
  //map_pos = {3, 4};

  _current_map = &map_list[2];
  map_pos = {3, 7};
  
  /* Initialise movement variables  */
  player_movement_delay = 0;
  scroll_movement = false;
  scroll_counter = 0;
  upcoming_map_pos.x = 0;
  upcoming_map_pos.y = 0;

  player.walk_dir.x = 0;
  player.walk_dir.y = 0;
  /* Facing south */
  player.face_dir.x = 0;
  player.face_dir.y = -1;

  /* Initialise walking animation variables  */
  player.reverse_walking_render = false;
  player_animation_tick = 0;
  
  /* Initialise textbox variables */
  textbox_running = false;

  scroll_arrow_count = 0;
  scroll_arrow_offset = 0;
  textbox_line = 0;
  textbox_button_delay = 0;

  write_text_line_count = 0;
  write_text_char_count = 1;
  
  /* Initialise animation variables - none in progress */
  animation.running = false;
  /* We're also not about to move maps */
  exit_map.waiting_load = false;
  exit_map.waiting_show = false;
}

void update( uint32_t tick ) {

  /* Update function
   * Contains all game mechanics
   */
  
  bool start_exit_animation = false;

  /* Advance the animation, if running and not finished */
  if( ( animation.running ) && ( !animation.finished ) ) 
    animation.tick++;
  
  // ---------------------------------------------------------------------------------
  // Player movement functionality
  // ---------------------------------------------------------------------------------

  /* Start by calculating our movement restructions */
  const struct map_tile (*current_map_tile_ptr) = _current_map->map_tiles_ptr; // Get a pointer to the current tile
  current_map_tile_ptr += map_pos.y * _current_map->map_width; // Move to the correct y value
  current_map_tile_ptr += map_pos.x; // Move to the correct x value

  /* See if we're stood on an exit tile or not */
  exit_tile = { false, false, false, false };

  /* We're stood on an exit tile, let's check which direction the exit is */
  if( (*current_map_tile_ptr).exit_tile ) {

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

  /* Store which directions we're allowed to walk in the nearest tiles and if there are any interaction tiles */
  allowed_movement = { false, false, false, false };
  interaction_tile = { false, false, false, false };

  if( map_pos.y != 0 ) {

    current_map_tile_ptr -= _current_map->map_width; // Move pointer up a row
    
    allowed_movement.travel_n = (*current_map_tile_ptr).can_walk_s;
    interaction_tile.travel_n = (*current_map_tile_ptr).interact_tile;

    if( interaction_tile.travel_n ) interaction_tile_id[0] = (*current_map_tile_ptr).interact_id;
    else interaction_tile_id[0] = 0;

    current_map_tile_ptr += _current_map->map_width; // Move pointer back to same row as player
  }
  if( map_pos.x != ( _current_map->map_width - 1 ) ) {

    current_map_tile_ptr++; // Move pointer to next column along

    allowed_movement.travel_e = (*current_map_tile_ptr).can_walk_w;
    interaction_tile.travel_e = (*current_map_tile_ptr).interact_tile;

    if( interaction_tile.travel_e ) interaction_tile_id[1] = (*current_map_tile_ptr).interact_id;
    else interaction_tile_id[1] = 0;

    current_map_tile_ptr--; // Move pointer back to same column as player
  }
  if( map_pos.y != ( _current_map->map_height - 1 ) ) {

    current_map_tile_ptr += _current_map->map_width; // Move pointer down a row

    allowed_movement.travel_s = (*current_map_tile_ptr).can_walk_n;
    interaction_tile.travel_s = (*current_map_tile_ptr).interact_tile;

    if( interaction_tile.travel_s ) interaction_tile_id[2] = (*current_map_tile_ptr).interact_id;
    else interaction_tile_id[2] = 0;

    current_map_tile_ptr -= _current_map->map_width; // Move pointer back to same row as player
  }
  if( map_pos.x != 0 ) {

    current_map_tile_ptr--; // Move pointer back a column

    allowed_movement.travel_w = (*current_map_tile_ptr).can_walk_e;
    interaction_tile.travel_w = (*current_map_tile_ptr).interact_tile;

    if( interaction_tile.travel_w ) interaction_tile_id[3] = (*current_map_tile_ptr).interact_id;
    else interaction_tile_id[3] = 0;

    current_map_tile_ptr++; // Move pointer back to same column as player
  }

  /* Add movement restrictions based on interaction tiles */
  if( interaction_tile.travel_n ) allowed_movement.travel_n = false;
  if( interaction_tile.travel_e ) allowed_movement.travel_e = false;
  if( interaction_tile.travel_s ) allowed_movement.travel_s = false;
  if( interaction_tile.travel_w ) allowed_movement.travel_w = false;

  /* Stop scrolling motion if we're can't continue, either because of allowed movement or an exit tile */
  if( ( ( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == 1 ) && ( !allowed_movement.travel_n ) ) || 
        ( ( player.walk_dir.x == 1 ) && ( player.walk_dir.y == 0 ) && ( !allowed_movement.travel_e ) ) ||
        ( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == -1 ) && ( !allowed_movement.travel_s ) ) ||
        ( ( player.walk_dir.x == -1 ) && ( player.walk_dir.y == 0 ) && ( !allowed_movement.travel_w ) ) ) ||
      ( ( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == 1 ) && ( exit_tile.travel_n ) ) || 
        ( ( player.walk_dir.x == 1 ) && ( player.walk_dir.y == 0 ) && ( exit_tile.travel_e ) ) ||
        ( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == -1 ) && ( exit_tile.travel_s ) ) ||
        ( ( player.walk_dir.x == -1 ) && ( player.walk_dir.y == 0 ) && ( exit_tile.travel_w ) ) )
  ) {

    scroll_counter = 0;  
    scroll_movement = false;
    upcoming_map_pos.x = 0;
    upcoming_map_pos.y = 0;

    player.walk_dir.x = 0;
    player.walk_dir.y = 0;
  }

  /* Check input presses as they happen, unless there's an animation running, in which case we don't care */
  if( ( !animation.running ) && ( !scroll_movement ) && ( !textbox_running ) ) {

    if( ( button( UP ) ) || ( button( RIGHT ) ) || ( button( DOWN ) ) || ( button( LEFT ) ) ) {

      if( player_movement_delay < player_movement_delay_val ) player_movement_delay++;

      if( button( UP ) ) {
        
        /* Switch player's direction to N */
        player.walk_dir.x = 0;
        player.walk_dir.y = 1;

        player.face_dir.x = 0;
        player.face_dir.y = 1;
      } else if( button( RIGHT ) ) {
        
        /* Switch player's direction to E */
        player.walk_dir.x = 1;
        player.walk_dir.y = 0;

        player.face_dir.x = 1;
        player.face_dir.y = 0;
      } else if( button( DOWN ) ) {
        
        /* Switch player's direction to S */
        player.walk_dir.x = 0;
        player.walk_dir.y = -1;

        player.face_dir.x = 0;
        player.face_dir.y = -1;
      } else if( button( LEFT ) ) {
        
        /* Switch player's direction to W */
        player.walk_dir.x = -1;
        player.walk_dir.y = 0;

        player.face_dir.x = -1;
        player.face_dir.y = 0;
      }
    } else {
      
      /* Player's not moving */
      player.walk_dir.x = 0;
      player.walk_dir.y = 0;

      /* Reset the delay counter */
      player_movement_delay = 0;
    }
  }

  /* Advance scrolling animation */
  if( scroll_movement ) {
  
    /* If holding B, make the player run (move twice as fast), if the map allows running */
    if( ( button( B ) ) && ( _current_map->running_en ) ) scroll_counter += 2;
    else scroll_counter++;

    if(scroll_counter >= 8) {

      /* Reset the counter and move the player to their new space */
      scroll_counter = 0;
      map_pos.x += upcoming_map_pos.x;
      map_pos.y += upcoming_map_pos.y;

      /* If the player isn't holding down a button, let's stop moving */
      if( ( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == 1 ) && ( !button( UP ) ) ) || 
          ( ( player.walk_dir.x == 1 ) && ( player.walk_dir.y == 0 ) && ( !button( RIGHT ) ) ) ||
          ( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == -1 ) && ( !button( DOWN ) ) ) ||
          ( ( player.walk_dir.x == -1 ) && ( player.walk_dir.y == 0 ) && ( !button( LEFT ) ) )
        ) {
  
        scroll_movement = false;
        upcoming_map_pos.x = 0;
        upcoming_map_pos.y = 0;

        player.walk_dir.x = 0;
        player.walk_dir.y = 0;
      }
    }
  }
    
  /* Move the player according to button inputs and movement restrictions */
  if( ( !animation.running ) && ( !textbox_running ) && ( !scroll_movement ) && ( player_movement_delay >= player_movement_delay_val ) ) { // Don't alter movement if an animation is running

    /* Player is moving north */
    if( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == 1 ) ) {

      /* Map exit, start animation and load new map */
      if( exit_tile.travel_n ) {  
        start_exit_animation = true;
      } else {

        /* Move to a new tile, check if they're allowed there */
        if( allowed_movement.travel_n ) {

          /* Start the scroll animation and set the new tile position */
          upcoming_map_pos.y = -1;
          scroll_movement = true;
          player_animation_tick = 0;
          //if( button( B ) ) map_pos.y--;
        }
      }

    /* Player is moving east */
    } else if( ( player.walk_dir.x == 1 ) && ( player.walk_dir.y == 0 ) ) {
      
      /* Map exit, start animation and load new map */
      if( exit_tile.travel_e ) {
        start_exit_animation = true;
      } else {

        /* Move to a new tile, check if they're allowed there */
        if( allowed_movement.travel_e ) {
          
          /* Start the scroll animation and set the new tile position */
          upcoming_map_pos.x = 1;
          scroll_movement = true;
          player_animation_tick = 0;
          //if( button( B ) ) map_pos.x++;
        }
      }
    
    /* Player is moving south */
    } else if( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == -1 ) ) {
    
      /* Map exit, start animation and load new map */
      if( exit_tile.travel_s ) {
        start_exit_animation = true;
      } else {

        /* Move to a new tile, check if they're allowed there */
        if( allowed_movement.travel_s)  {
          
          /* Start the scroll animation and set the new tile position */
          upcoming_map_pos.y = 1;
          scroll_movement = true;
          player_animation_tick = 0;
          //if( button( B ) ) map_pos.y++;
        }
      }

    /* Player is moving west */
    } else if( ( player.walk_dir.x == -1 ) && ( player.walk_dir.y == 0 ) ) {

      /* Map exit, start animation and load new map */
      if( exit_tile.travel_w ) {
        start_exit_animation = true;
      } else {

        /* Move to a new tile, check if they're allowed there */
        if( allowed_movement.travel_w ) {
          
          /* Start the scroll animation and set the new tile position */
          upcoming_map_pos.x = -1;
          scroll_movement = true;
          player_animation_tick = 0;
          //if( button( B ) ) map_pos.x--;
        }
      }
    }

    /* Check if it's time to start the fade out animation */
    if( start_exit_animation ) {

      exit_map.waiting_load = true;
      start_animation( fade_screen, 3, false );
    }
  }

  /* If the player is walking, let's make their little legs move or make them run if holding B */
  if( ( !animation.running ) || ( ( player.walk_dir.x != 0 ) || ( player.walk_dir.y != 0 ) ) ) {
    
    player_animation_tick++;

    /* If holding B, make the player run, if the map allows running */
    if( ( ( player_animation_tick >= 6 ) && ( ( ( !button( B ) ) && ( _current_map->running_en ) ) || ( !_current_map->running_en ) ) ) || ( ( player_animation_tick >= 3 ) && ( button( B ) ) && ( _current_map->running_en ) ) ) {

      player_animation_tick = 0;
      player.reverse_walking_render = !player.reverse_walking_render;
    }
  }

  // ---------------------------------------------------------------------------------
  // Interactions functionality
  // ---------------------------------------------------------------------------------

  if( ( ( ( interaction_tile.travel_n ) && ( player.face_dir.x == 0 ) && ( player.face_dir.y == 1 ) ) ||
        ( ( interaction_tile.travel_e ) && ( player.face_dir.x == 1 ) && ( player.face_dir.y == 0 ) ) ||
        ( ( interaction_tile.travel_s ) && ( player.face_dir.x == 0 ) && ( player.face_dir.y == -1 ) ) ||
        ( ( interaction_tile.travel_w ) && ( player.face_dir.x == -1 ) && ( player.face_dir.y == 0 ) ) ) &&
      ( button( A ) ) && ( textbox_button_delay == 0 ) && ( !textbox_running ) ) {
    
    /* User pressed the A Button at an interaction */
    open_textbox( demo_text1, ( sizeof( demo_text1 ) / 20 ) );
  }
}

void draw( uint32_t tick ) {

  /* Draw function
   * Called immediately after update function and then followed by background transfer to display
   * Contains all the functions to draw the display
   */

  /* Clear display buffer */
  clear_screen( 0x0000 );
  
  // ---------------------------------------------------------------------------------
  // Map and player sprite rendering functionality
  // ---------------------------------------------------------------------------------

  /* Calculate how many tiles in each direction we need to draw */
  _offset_n = 0;
  _offset_e = 0;
  _offset_s = 0; 
  _offset_w = 0;

  _scroll_offset_n = 0;
  _scroll_offset_e = 0;
  _scroll_offset_s = 0;
  _scroll_offset_w = 0;

  if( map_pos.x < 8 ) {

    _offset_w = ( 7 - map_pos.x );
  } else {

    if( ( player.walk_dir.x == -1 ) && ( player.walk_dir.y == 0 ) && ( scroll_counter != 0 ) )
      _scroll_offset_w = 1;
  }
  if( ( map_pos.x + 8 ) > _current_map->map_width ) {

    _offset_e = ( map_pos.x + 8 - _current_map->map_width );
  } else { 

    if( ( player.walk_dir.x == 1 ) && ( player.walk_dir.y == 0 ) && ( scroll_counter != 0 ) )
      _scroll_offset_e = 1;
  }
  if( map_pos.y < 8 ) {

    _offset_n = ( 7 - map_pos.y );
  } else {

    if( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == 1 ) && ( scroll_counter != 0 ) )
      _scroll_offset_n = 1;
  }
  if( ( map_pos.y + 9 ) > _current_map->map_height ) {

    _offset_s = ( map_pos.y + 8 - _current_map->map_height );  
  } else {

    if( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == -1 ) && ( scroll_counter != 0 ) )
      _scroll_offset_s = 1;
  }

  /* Draw the background and map tiles */
  draw_map_tiles( false );

  /* Draw an exit arrow if we're stood on an exit tile at the edge of the map */
  if( ( exit_tile.travel_n ) && ( map_pos.y == 0 ) ) {
    draw_sprite( (uint16_t*)arrow, 0, false, true, 56, 48, 8 );
  } else if( ( exit_tile.travel_e) && ( map_pos.x == ( _current_map->map_width - 1 ) ) ) {
    draw_sprite( (uint16_t*)arrow, 1, true, false, 64, 56, 8 );
  } else if( ( exit_tile.travel_s) && ( map_pos.y == ( _current_map->map_height - 1 ) ) ) {
    draw_sprite( (uint16_t*)arrow, 0, false, false, 56, 64, 8 );
  } else if( ( exit_tile.travel_w) && ( map_pos.x == 0 ) ) {
    draw_sprite( (uint16_t*)arrow, 1, false, false, 48, 56, 8 );
  }
  

  /* Draw the player in the centre square (8, 8) */
  if( ( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == 0 ) ) || ( player_movement_delay < player_movement_delay_val ) ) {
    
    /* The player is currently stood still, let's draw them facing the right direction */
    if((player.face_dir.x == 0) && (player.face_dir.y == 1)) { // Facing N

      draw_sprite((uint16_t*)male_player, 4, false, false, 52, 52, 16);
    } else if((player.face_dir.x == -1) && (player.face_dir.y == 0)) { // Facing W

      draw_sprite((uint16_t*)male_player, 2, false, false, 52, 52, 16);
    } else if((player.face_dir.x == 1) && (player.face_dir.y == 0)) { // Facing E

      draw_sprite((uint16_t*)male_player, 2, true, false, 52, 52, 16);
    } else { // Facing S - also default value

      draw_sprite((uint16_t*)male_player, 0, false, false, 52, 52, 16);
    }

  /* Player is walking, draw the walking sprite */
  } else if( ( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == 1 ) ) ) { // Walking N

    draw_sprite( (uint16_t*)male_player, 5, player.reverse_walking_render, false, 52, 52, 16 );
  } else if( ( ( player.walk_dir.x == 1 ) && ( player.walk_dir.y == 0 ) ) ) { // Walking E

    draw_sprite( (uint16_t*)male_player, ( 2 + player.reverse_walking_render ), true, false, 52, 52, 16 );
  } else if( ( ( player.walk_dir.x == 0 ) && ( player.walk_dir.y == -1 ) ) ) { // Walking S

    draw_sprite( (uint16_t*)male_player, 1, player.reverse_walking_render, false, 52, 52, 16);
  } else if( ( ( player.walk_dir.x == -1 ) && ( player.walk_dir.y == 0 ) ) ) { // Walking W

    draw_sprite( (uint16_t*)male_player, ( 2 + player.reverse_walking_render ), false, false, 52, 52, 16 );
  }

  /* Draw the top layer tiles */
  draw_map_tiles( true );

  /* An animation is running */
  if( animation.running ) {
    
    /* Call animation function */
    animation.animation_ptr();

    /* Check if animation has finished */
    if( animation.finished ) {
      
      /* Is it time to load up the new map or show the one we've loaded */
      if( exit_map.waiting_load ) {
        
        /* Move the player to the correct position */
        map_pos = { exit_map.exit_map_pos.x, exit_map.exit_map_pos.y };
        /* Set the new map */
        _current_map = &map_list[ exit_map.exit_map_id ];
        
        /* Set map as loaded but not shown */
        exit_map.waiting_load = false;
        exit_map.waiting_show = true;
        /* and trigger the fade in animation */
        start_animation( fade_screen, 3, true );

      } else if ( exit_map.waiting_show ) {
        
        /* Time to show the newly loaded map */
        reset_animation();

        /* Make sure we don't get stuck in the doorway */
        exit_map.waiting_show = false;
        exit_map.exit_map_pos = { 0, 0 };
        animation.running = false;
      }
    }
  }

  /* Draw the textbox, if running */
  draw_textbox();

  // ---------------------------------------------------------------------------------
  // Debugging
  // ---------------------------------------------------------------------------------

  #if map_rendering_offsets
  sprintf( write_text, "P(%d,%d)O(%d,%d,%d,%d)", map_pos.x, map_pos.y, _offset_n, _offset_e, _offset_s, _offset_w );
  write_string( write_text, 8, 8, rgb(0xF00), 0 );
  #endif

  #if player_position
  sprintf( write_text,"P(%d,%d)D(%d,%d)F(%d,%d)", map_pos.x, map_pos.y, player.walk_dir.x, player.walk_dir.y, player.face_dir.x, player.face_dir.y );
  write_string( write_text, 1, 8, rgb(0xF00), 0 );

  sprintf( write_text, "D(%d)", player_movement_delay );
  write_string( write_text, 1, 16, rgb(0xF00), 0 );
  #endif

  #if map_rendering_scroll
  sprintf( write_text,"S(%d)D(%d,%d)", scroll_counter, _scroll_x, _scroll_y );
  write_string( write_text, 1, 8, rgb(0xF00), 0 );

  sprintf( write_text, "P(%d,%d)O(%d,%d,%d,%d)", map_pos.x, map_pos.y, _offset_n, _offset_e, _offset_s, _offset_w );
  write_string( write_text, 1, 16, rgb(0xF00), 0 );

  sprintf( write_text, "S(%d,%d,%d,%d)", _scroll_offset_n, _scroll_offset_e, _scroll_offset_s, _scroll_offset_w );
  write_string( write_text, 1, 24, rgb(0xF00), 0 );
  #endif

  #if exit_map_info
  sprintf( write_text, "E(%d,%d,%d)P(%d %d)", exit_map.waiting_load, exit_map.waiting_show, exit_map.exit_map_id, exit_map.exit_map_pos.x, exit_map.exit_map_pos.y );
  write_string( write_text, 1, 8, rgb(0xF00), 0 );

  sprintf( write_text, "D(%d,%d,%d,%d)", exit_tile.travel_n, exit_tile.travel_e, exit_tile.travel_s, exit_tile.travel_w );
  write_string( write_text, 1, 16, rgb(0xF00), 0 );
  #endif 

  #if animation_info
  sprintf( write_text,"R(%d,%d)F(%d)S(%d)T(%d,%d)", animation.running, animation.reverse, animation.finished, animation.step, animation.tick % animation.occurance, ( ( animation.tick % animation.occurance ) ? 0 : 1) );
  write_string( write_text, 1, 24, rgb(0xF00), 0 );
  #endif
  
  #if player_movement 
  /* Draw coloured squares to indicate player's allowed movement */
  if( exit_tile.travel_n ) {
    
    /* Blue tile since this is an exit tile */
    draw_rec( 56, 48, 8, 8, rgb(0x00F) );
  } else {

    if( map_pos.y != 0 ) {

      /* Green tile as we are allow to walk in this direction */
      if(allowed_movement.travel_n) draw_rec(56, 48, 8, 8, rgb(0x0F0)); //N
      /* Red tile as we're not allowed to walk in this direction */
      else draw_rec( 56, 48, 8, 8, rgb(0xF00) );
    } else {

      /* Yellow tile as this is the edge of the map */
      draw_rec( 56, 48, 8, 8, rgb(0xFF0) );
    }
  }
  
  if( exit_tile.travel_e ) {

    draw_rec( 64, 56, 8, 8, rgb(0x00F) );
  } else {

    if( map_pos.x != ( _current_map->map_width - 1 ) ) {

      if( allowed_movement.travel_e ) draw_rec( 64, 56, 8, 8, rgb(0x0F0) ); //E
      else draw_rec( 64, 56, 8, 8, rgb(0xF00) );
    } else {

      draw_rec( 64, 56, 8, 8, rgb(0xFF0) );
    }
  }

  if( exit_tile.travel_s ) {

    draw_rec( 56, 64, 8, 8, rgb(0x00F) );
  } else {

    if( map_pos.y != ( _current_map->map_height - 1 ) ) {

      if( allowed_movement.travel_s ) draw_rec( 56, 64, 8, 8, rgb(0x0F0) ); //S
      else draw_rec( 56, 64, 8, 8, rgb(0xF00) );
    } else {

      draw_rec( 56, 64, 8, 8, rgb(0xFF0) );
    }
  }

  if( exit_tile.travel_w ) {

    draw_rec( 48, 56, 8, 8, rgb(0x00F) ); 
  } else {

    if( map_pos.x != 0 ) {

      if( allowed_movement.travel_w ) draw_rec( 48, 56, 8, 8, rgb(0x0F0) ); //W
      else draw_rec( 48, 56, 8, 8, rgb(0xF00) ); 

    } else {

      draw_rec( 48, 56, 8, 8, rgb(0xFF0) ); 
    }
  }
  #endif

  #if interaction_info

  /* Draw coloured squares to indicate player's allowed movement */
  if( ( interaction_tile.travel_n ) && ( player.face_dir.x == 0 ) && ( player.face_dir.y == 1 ) ) {
    
    draw_rec( 56, 48, 8, 8, rgb(0x0FF) );
    sprintf( write_text,"ID(%d)", interaction_tile_id[0] );
    write_string( write_text, 1, 8, rgb(0xF00), 0 );
  }
  
  if( ( interaction_tile.travel_e ) && ( player.face_dir.x == 1 ) && ( player.face_dir.y == 0 ) ) {

    draw_rec( 64, 56, 8, 8, rgb(0x0FF) );
    sprintf( write_text,"ID(%d)", interaction_tile_id[1] );
    write_string( write_text, 1, 8, rgb(0xF00), 0 );
  }

  if( ( interaction_tile.travel_s ) && ( player.face_dir.x == 0 ) && ( player.face_dir.y == -1 ) ) {

    draw_rec( 56, 64, 8, 8, rgb(0x0FF) );
    sprintf( write_text,"ID(%d)", interaction_tile_id[2] );
    write_string( write_text, 1, 8, rgb(0xF00), 0 );
  }

  if( ( interaction_tile.travel_w ) && ( player.face_dir.x == -1 ) && ( player.face_dir.y == 0 ) ) {

    draw_rec( 48, 56, 8, 8, rgb(0x0FF) ); 
    sprintf( write_text,"ID(%d)", interaction_tile_id[3] );
    write_string( write_text, 1, 8, rgb(0xF00), 0 );
  }
  #endif

  #if textbox_info
  sprintf( write_text,"C(%d/%d)T(%d,%d)D(%d)", textbox_line, total_textbox_lines, write_text_char_count, write_text_line_count, textbox_button_delay );
  write_string( write_text, 1, 8, rgb(0xF00), 0 );
  #endif
}

void draw_textbox( void ) {

  uint8_t box_offset;
  
  if( textbox_running ) {

    /* Draw the textbox borders */
    if( total_textbox_lines < 3 ) {
      /* 2 line textbox */
      draw_rec( 1, 92, 118, 27, rgb(0x999) );
      draw_rec( 3, 94, 114, 23, rgb(0xFFF) );
      
      box_offset = 10;
    } else {
      /* 3 line textbox */
      draw_rec( 1, 82, 118, 37, rgb(0x999) );
      draw_rec( 3, 84, 114, 33, rgb(0xFFF) ); 
      
      box_offset = 0;
    }

    /* Debug */
    //draw_rec( 6, 87, 108, 7, rgb(0xCCC) );
    //draw_rec( 6, 97, 108, 7, rgb(0xCCC) );
    //draw_rec( 6, 107, 108, 7, rgb(0xCCC) );

    /* Draw up to 3 lines of text */
    if( textbox_line < total_textbox_lines ) {
      sprintf( write_text, text_ptr[textbox_line] );
      if( write_text_line_count >= 0 )
        write_string( write_text, 6, ( 93 + box_offset ), rgb(0x000), ( ( write_text_line_count == 0 ) ? write_text_char_count : 0 ) );
    }

    if( ( textbox_line + 1 ) < total_textbox_lines ) {
      sprintf( write_text, text_ptr[textbox_line + 1] );
      if( write_text_line_count >= 1 )
        write_string( write_text, 6, ( 103 + box_offset ), rgb(0x000), ( ( write_text_line_count == 1 ) ? write_text_char_count : 0 ) );
    }

    if( ( textbox_line + 2 ) < total_textbox_lines ) {
      sprintf( write_text, text_ptr[textbox_line + 2] );
      if( write_text_line_count >= 2 )
        write_string( write_text, 6, 113, rgb(0x000), ( ( write_text_line_count == 2 ) ? write_text_char_count : 0 ) );
    }

    if( write_text_char_count < 20 )
      write_text_char_count++;

    if( ( ( write_text_char_count >= 20 ) || ( text_ptr[write_text_line_count][write_text_char_count] == '\0' ) ) && ( write_text_line_count < ( ( total_textbox_lines < 3 ) ? ( total_textbox_lines - 1 ) : 2 ) ) ) {
      write_text_char_count = 1;
      write_text_line_count++;
    }

    /* Draw a scroll arrow if needed */
    if( ( textbox_line + 3 ) < total_textbox_lines ) {
      draw_sprite((uint16_t*)text_scroll, scroll_arrow_offset, true, false, 109, 108, 8);
    }

    /* Animate the scroll arrow */
    scroll_arrow_count++;
    if( scroll_arrow_count > 10 ) {
      scroll_arrow_count = 0;

      scroll_arrow_offset++;
      if( scroll_arrow_offset > 2 ) scroll_arrow_offset = 0;

    }

    /* Deal with the button pressed */
    if( ( button( A ) ) && ( textbox_button_delay == 0 ) ) {

      if( ( textbox_line + 3 ) < total_textbox_lines ) {
        
        /* Move to the next line and type out only the last line */
        textbox_line++;
        textbox_button_delay = 10;

        write_text_char_count = 1;
      } else {

        /* Close the textbox */
        textbox_running = false;
        textbox_button_delay = 10;
      }
    }
  }

  /* Add delay after button presses */
  if( textbox_button_delay > 0 ) {
    textbox_button_delay--;
  }
}

void open_textbox( char (*_text_ptr)[20], uint8_t _total_lines ) {
  
    /* Set the pointer to the text to display and set the number of lines */
    text_ptr = _text_ptr;
    total_textbox_lines = _total_lines;
    
    /* Reset all variables */
    scroll_arrow_count = 0;
    scroll_arrow_offset = 0;
    textbox_line = 0;
    textbox_button_delay = 0;

    write_text_line_count = 0;
    write_text_char_count = 1;
    
    textbox_button_delay = 10;

    /* Set textbox to active */
    textbox_running = true;
}

void draw_map_tiles( bool top_layer ) {
  int16_t _draw_x, _draw_y;
  
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
    map_tiles_ptr += ( ( map_pos.y - 7 - _scroll_offset_n ) * _current_map->map_width ); // If we're scrolling, we need to move back a tile

  /* Loop through each of the 15 rows of the display, add an extra row if scrolling */
  for( _draw_y = 0; _draw_y < ( 15 + _scroll_offset_n + _scroll_offset_s ); _draw_y++ ) {

    /* Ignore tiles outside of the map limits */
    if( ( _draw_y >= _offset_n ) && ( _draw_y < ( 15 - _offset_s + _scroll_offset_n + _scroll_offset_s ) ) ) {

      /* Loop through each of the 15 columns, add an extra column if scrolling */
      for( _draw_x = 0; _draw_x < ( 15 + _scroll_offset_w + _scroll_offset_e ); _draw_x++ ) {

        /* Again, ignore tiles outside of the map limits */
        if( ( _draw_x >= _offset_w ) && ( ( map_pos.x + _draw_x - 6 ) <= ( _current_map->map_width + _scroll_offset_w ) ) ) {

          if( top_layer ) {
            
            /* We're only drawing the top layer textures */
            if( ( (*map_tiles_ptr).texture != -1 ) && ( (*map_tiles_ptr).top_layer == true) )
              draw_sprite( (uint16_t*)_texture_map[(*map_tiles_ptr).texture], (*map_tiles_ptr).texture_offset, (*map_tiles_ptr).texture_reverse_x, (*map_tiles_ptr).texture_reverse_y, ( ( ( _draw_x - _scroll_offset_w ) * 8 ) - _scroll_x ), ( ( ( _draw_y - _scroll_offset_n ) * 8 ) + _scroll_y ), 8 );

          } else if ( (*map_tiles_ptr).npc_tile ) {
            
            draw_rec( ( ( ( _draw_x - _scroll_offset_w ) * 8 ) - _scroll_x ), ( ( ( _draw_y - _scroll_offset_n ) * 8 ) + _scroll_y ), 8, 8, rgb(0xF0F) );            
            
          }else {

            /* Draw the background texture if the map has one */
            if( _current_map->bg_texture != -1 )
              draw_sprite( (uint16_t*)_texture_map[_current_map->bg_texture], _current_map->bg_texture_offset, 0, 0, ( ( ( _draw_x - _scroll_offset_w ) * 8 ) - _scroll_x ), ( ( ( _draw_y - _scroll_offset_n ) * 8 ) + _scroll_y ), 8 );

            /* Draw the map texure, if any */
            if( ( (*map_tiles_ptr).texture != -1 ) && ( (*map_tiles_ptr).top_layer == false) )
              draw_sprite( (uint16_t*)_texture_map[(*map_tiles_ptr).texture], (*map_tiles_ptr).texture_offset, (*map_tiles_ptr).texture_reverse_x, (*map_tiles_ptr).texture_reverse_y, ( ( ( _draw_x - _scroll_offset_w ) * 8 ) - _scroll_x ), ( ( ( _draw_y - _scroll_offset_n ) * 8 ) + _scroll_y ), 8 );
          }

          /* If we've drawn a tile, increment the pointer (unless we're at the last column of the display, don't want to accidentally cause a hard fault) */
          if( ( _draw_x ) != ( 14 + _scroll_offset_w + _scroll_offset_e ) ) map_tiles_ptr++;
        }
      }

      /* Increment the pointer as we move to the next row on the dislay, but we don't need to if the map width fits entirely on the display */
      if( ( _offset_e == 0 ) || ( _offset_w == 0 ) ) {
        
        /* If we're drawing the last row then don't move the pointer either */
        if( _draw_y != ( 14 + _scroll_offset_s + _scroll_offset_n ) ) 
          map_tiles_ptr += ( _current_map->map_width - 14 + _offset_w + ( ( _offset_e > 1 ) ? ( _offset_e - 1 ) : 0 ) - (  _offset_w ? 0 : _scroll_offset_w  ) - (  _offset_e ? 0 : _scroll_offset_e  ) );
      }
    }
  }
}

