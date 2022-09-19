// Include PicoSystem hardware
#include "picosystem-game.hpp"
// Include assets
#include <fonts.hpp>

namespace picosystem {

  void write_character( char character, int32_t x, int32_t y, color_t color ) {

    uint8_t *font_array_ptr, current_byte;
    int32_t _x, _bit;
    uint8_t bit_value;

    // Move the pointer to the character starting byte
    font_array_ptr = (uint8_t*)_default_font;
    font_array_ptr += ( ( character - 32 ) * 5 );

    //printf("Writing %c to %d, %d, color %x\n", character, x, y, color);
    for( _x = 0; _x < 5; _x++ ) {
      // Loop through the width of the characters first (each character is 5 pixels wide)
      current_byte = *font_array_ptr++;

      //printf("Byte: %x\n", current_byte);
      for( _bit = 7; _bit >= 0; _bit-- ) {
      // Scroll down the height of the character (each character is 8 pixels tall, contained in a single byte)
      bit_value = ( current_byte >> _bit ) & 0x1;
      if( bit_value ) {
        //printf("  Pixel (%d, %d) = 1", (_x + x), (y - _bit));
        *_dt->p((_x + x), (y - _bit)) = color;
      } else {
        //printf("  Pixel (%d, %d) = 0", (_x + x), (y - _bit));
      }
      //printf("  :: bit value = %d\n", bit_value);
      }
      //printf("\n");
    }
    //printf("done\n\n");
  }

  void write_string( char *char_array, int32_t x, int32_t y, color_t color, uint16_t char_offset ) {
    uint8_t i = 0;
    int32_t _x = x, _y = y;
    
    while( ( char_array[i] != '\0' ) && ( ( ( i < char_offset ) && ( char_offset != 0 ) ) || ( char_offset == 0 ) ) )
    {
      write_character( char_array[i], _x, _y, color );
      _x += 6; // 5 pixels for font width + 1 spacing pixel
      i++;
    }
  }

}