// Include PicoSystem hardware
#include "picosystem-game.hpp"

// Note: Pixels are stored in the display buffer as GBAR

namespace picosystem {

  void clear_screen(color_t fill) {

    // Clear the display buffer
    int32_t _x, _y;

    for(_x=0; _x < 120; _x++) {    
      for(_y = 0; _y < 120; _y++) {
        *_dt->p(_x, _y) = rgb(fill);
      }
    }
  }

  void invert_screen(void) {
    
    uint16_t _x, _y;

    // Loop through the display buffer to alter each pixel
    for(_x = 0; _x < 120; _x++) {
      for(_y = 0; _y < 120; _y++) {
        if(*_dt->p(_x, _y) != 0x000)
          *_dt->p(_x, _y) = (0xFF0F ^ *_dt->p(_x, _y));
      }
    }
  }

  void draw_sprite(uint16_t* sprite_ptr, uint8_t sprite_offset, bool draw_reverse_x, bool draw_reverse_y, int32_t x, int32_t y, uint8_t size) {

    uint16_t *_sprite_ptr, current_byte;
    int32_t _x, _y, _temp_x, _temp_y, _draw_x, _draw_y, _bit;
    uint8_t bit_value;
    uint16_t paint_color;

    // Move the pointer to the character starting byte
    _sprite_ptr = (uint16_t*) sprite_ptr;
    _sprite_ptr += (sprite_offset * (size * size));
    
    if(!draw_reverse_x) _temp_x = 0;
    else _temp_x = size - 1;


    for(_x=0; _x < size; _x++) {
      // Loop through the width of the sprite first (each sprite is 16 pixels wide)
      if(!draw_reverse_y) _temp_y = 0;
      else _temp_y = size - 1;

      //printf("Byte: %x\n", current_byte);
      for(_y = 0; _y < size; _y++) {
        
        current_byte = *_sprite_ptr++;
        if(current_byte != 0) {
          if(current_byte == 0x1) {
            paint_color = 0x0000;
          } else {
            paint_color = rgb(current_byte);
          }

          _draw_x = (x + _temp_x);
          _draw_y = (y + _temp_y);

          // Check the sprite is being drawn within the display bounds
          if( ((_draw_x >= 0) && (_draw_x <= 120)) && ((_draw_y >= 0) && (_draw_y <= 120)) ) {
            *_dt->p(_draw_x, _draw_y) = paint_color;
          }
        }

        if(!draw_reverse_y) _temp_y++;
        else _temp_y--;
      }

      if(!draw_reverse_x) _temp_x++;
      else _temp_x--;
    }
  }

  void draw_rec(int32_t x, int32_t y, int32_t w, int32_t h, color_t color) {

    // Temporary function, used for debugging
    uint16_t *_sprite_ptr, current_byte;
    int32_t _x, _y, _temp_x, _draw_x, _draw_y, _bit;
    uint8_t bit_value;

    for(_x=0; _x < w; _x++) {

      for(_y = 0; _y < h; _y++) {

        _draw_x = (x + _x);
        _draw_y = (y + _y);
        
        // Check the rectangle is being drawn within the display bounds
        if( ((_draw_x >= 0) && (_draw_x <= 120)) && ((_draw_y >= 0) && (_draw_y <= 120)) ) {
          *_dt->p(_draw_x, _draw_y) = color;
        }

      }
    }
  }
}