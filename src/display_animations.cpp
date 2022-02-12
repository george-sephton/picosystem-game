// Include PicoSystem hardware
#include "picosystem-game.hpp"

// Note: Pixels are stored in the display buffer as GBAR

namespace picosystem {

  animation_settings animation;

  void start_animation(animation_function func_ptr, uint8_t occurance, bool reverse) {
    animation.running = true;
    animation.finished = false;
    animation.reverse = reverse;
    animation.animation_ptr = func_ptr;
    animation.step = 0;
    animation.tick = 1; // Set to 1 to avoid triggering straight away - I might change this later
    animation.occurance = occurance;
  }

  void stop_animation(void) {
    animation.finished = true;
  }

  void reset_animation(void) {
    animation.running = false;
    animation.finished = false;
    animation.animation_ptr = 0;
    animation.step = 0;
    animation.tick = 0;
    animation.occurance = 0;
  }

  void fade_screen(void) {
    
    uint16_t _x, _y;
    uint8_t r, g, b;
    uint8_t step;

    // Get the current step 
    if(animation.reverse) step = animation.step;
    else step = (0x7 ^ animation.step) - 3;

    if((animation.step >= 0) && (animation.step <= 4)) {
      
      // Loop through the display buffer to alter each pixel
      for(_x = 0; _x < 120; _x++) {
        for(_y = 0; _y < 120; _y++) {
          // Extract each colour channel - not necessary but easier to see
          r = *_dt->p(_x, _y) & 0xF;
          g = (*_dt->p(_x, _y) >> 12) & 0xF;
          b = (*_dt->p(_x, _y) >> 8) & 0xF;

          // Reduce values down by 25% x step
          r = (r*step)/4;
          g = (g*step)/4;
          b = (b*step)/4;

          // Set new colour in the display buffer
          *_dt->p(_x, _y) = (0x0 | (g << 12) | (b << 8) | r);
        }
      }

      if(!(animation.tick % animation.occurance)) {
        // Advance the animation, unless it's finished
        if(animation.step == 4) stop_animation();
        else animation.step++;
      }
    }
  }

  void bars_transition(void) {
    
    uint16_t _x, _y, _y2;

    // Get the current step 
    uint8_t step = animation.step;

    if(step <= 15) {
      
      // Loop through the display buffer to alter each pixel
      for(_x = 0; _x < (step * 8); _x++) {
        // Bars from the left
        for(_y = 0; _y < 15; _y+=2) {
          for(_y2 = 0; _y2 < 8; _y2++) {
            *_dt->p(_x, (_y * 8) + _y2) = 0x000;
          }
        }

        // Bars from the right
        for(_y = 1; _y < 15; _y+=2) {
          for(_y2 = 0; _y2 < 8; _y2++) {
            *_dt->p((119-_x), (_y * 8) + _y2) = 0x000;
          }
        }
      }

    }
  }

}