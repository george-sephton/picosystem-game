#pragma once

#include <picosystem.hpp>


namespace picosystem {
  
  // ---------------------------------------------------------------------------------
  // GLOBAL STRUCTURE DEFINITIONSS
  // ---------------------------------------------------------------------------------

  // Position structures
  struct dir_vec {
    int16_t x, y;
  };

  struct dir_en {
    bool travel_n, travel_e, travel_s, travel_w;
  };

  // Player structures
  struct {
    dir_vec walk_dir, face_dir;
    bool reverse_walking_render;
  } player;

  // Animation structures
  typedef void (*animation_function)(void);

  struct animation_settings{
    bool running;
    bool finished;
    bool reverse;
    uint8_t tick;
    uint8_t occurance;
    uint8_t step;
    animation_function animation_ptr;
  };

  // Map structures
  struct map_tile {
    bool can_walk_n, can_walk_e, can_walk_s, can_walk_w; // ie can walk FROM the n/e/s/w
    uint16_t sprite;
    uint16_t sprite_offset = 0;
    bool sprite_reverse_x = false;
    bool sprite_reverse_y = false;
    bool exit_tile = false;
    uint16_t exit_map_id = 0;
    dir_vec exit_map_dir = {0, 0};
    dir_vec exit_map_pos = {0, 0};
  };

  struct {
    bool waiting_load = false;
    bool waiting_show = false;
    uint16_t exit_map_id = 0;
    dir_vec exit_map_pos = {0, 0};
  } exit_map;

  struct map {
    uint16_t map_id;
    const struct map_tile (*map_tiles_ptr);
    uint16_t map_height;
    uint16_t map_width;
  };


  // ---------------------------------------------------------------------------------
  // EXTERNAL ASSETS
  // ---------------------------------------------------------------------------------
  
  // fonts
  const extern uint8_t _default_font[480];

  // sprites
  const extern uint16_t _player_m_sprite[1536];
  const extern uint16_t _player_f_sprite[1536];
  const extern uint16_t _exit_arrow_sprite[128];

  // textures
  const extern uint16_t _grass_texture[64];
  const extern uint16_t _fence_texture[64];
  const extern uint16_t _fence_bollard_texture[256];
  const extern uint16_t _door_mat_texture[128];
  const extern uint16_t _large_tree_texture[896];
  // texture map
  const extern uint16_t* _texture_map[5];

  extern animation_settings animation;
  
  // ---------------------------------------------------------------------------------
  // FUNCTION PROTOTYPES
  // ---------------------------------------------------------------------------------

  // Display functions
  void extern clear_screen(color_t fill);
  void extern invert_screen(void);
  void extern draw_sprite(uint16_t* sprite_ptr, uint8_t sprite_offset, bool draw_reverse_x, bool draw_reverse_y, int32_t x, int32_t y, uint8_t size);
  void extern draw_rec(int32_t x, int32_t y, int32_t w, int32_t h, color_t color);

  // Display animation functions
  void extern start_animation(animation_function func_ptr, uint8_t occurance, bool reverse);
  void extern stop_animation(void);
  void extern reset_animation(void);
  
  void extern fade_screen(void);
  void extern bars_transition(void);

  // Text functions
  void extern write_character(char character, int32_t x, int32_t y, color_t color);
  void extern write_string(char *char_array, int32_t x, int32_t y, color_t color);

  // 

}
