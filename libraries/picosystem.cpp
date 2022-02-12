#include <stdio.h>
#include <cstdlib>

#include <math.h>

#include "picosystem.hpp"


namespace picosystem {

  stat_t stats;

  color_t _pen;
  uint8_t _a = 15;

  int32_t _tx = 0, _ty = 0;
  int32_t _tlh = 8, _tls = 1;
  int32_t _tlw = -1;

  int32_t _camx = 0, _camy = 0;
  uint32_t _io = 0, _lio = 0;

  buffer_t* buffer(uint32_t w, uint32_t h, void *data) {
    buffer_t *b = new buffer_t();
    b->w = w;
    b->h = h;
    b->data = data ? (color_t *)data : new color_t[w * h];
    return b;
  }

  color_t _fb[120 * 120] __attribute__ ((aligned (4))) = { };
  buffer_t *SCREEN = buffer(120, 120, _fb);
  int32_t _cx = 0, _cy = 0, _cw = 120, _ch = 120;

  buffer_t *_dt = SCREEN;

  color_t rgb(uint16_t rgb) {
    // Converts xRGB to //GBxR - ignoring alpha channels
    return 0x0 | ((rgb << 8) & 0xFF00) | ((rgb >> 8) & 0x0F);
  }
}

using namespace picosystem;

// main entry point - the users' code will be automatically
// called when they implement the init(), update(), and render()
// functions in their project

int main() {
  _init_hardware();
  _start_audio();

  // Keep the screen off...
  backlight(0);
  // Screen buffer is initialized clear; just flip it.
  _flip();
  // Wait for the DMA transfer to finish
  while (_is_flipping());
  // wait for the screen to update
  _wait_vsync();
  _wait_vsync();
  // Turn the screen on
  backlight(75);

  // call users init() function so they can perform any needed
  // setup for world state etc
  init();

  uint32_t tick = 0;
  uint32_t last_frame_ms = 0;
  uint32_t start_flip = 0;

  _io = _gpio_get();

  while(true) {
    uint32_t start_tick_us = time_us();

    // store previous io state and get new io state
    _lio = _io;
    _io = _gpio_get();

    // call users update() function
    uint32_t start_update_us = time_us();
    update(tick++);
    stats.update_us = time_us() - start_update_us;

    // if we're currently transferring the the framebuffer to the screen then
    // wait until that is complete before allowing the user to do their drawing
    uint32_t wait_us = 0;
    uint32_t start_wait_flip_us = time_us();
    while(_is_flipping()) {}
    stats.flip_us = time_us() - start_flip;
    wait_us += time_us() - start_wait_flip_us;

    // call user render function to draw world
    uint32_t start_draw_us = time_us();
    draw(tick);
    stats.draw_us = time_us() - start_draw_us;

    // wait for the screen to vsync before triggering flip
    // to ensure no tearing
    uint32_t start_wait_vsync_us = time_us();
    _wait_vsync();
    wait_us += time_us() - start_wait_vsync_us;

    // flip the framebuffer to the screen
    start_flip = time_us();
    _flip();

    tick++;

    stats.tick_us = time_us() - start_tick_us;

    // calculate fps and round to nearest value (instead of truncating/floor)
    stats.fps = (1000000 - 1) / stats.tick_us + 1;

    if(stats.fps > 40) {
      // if fps is high enough then we definitely didn't miss vsync
      stats.idle = (wait_us * 100) / stats.tick_us;
    }else{
      // if we missed vsync then we overran the frame time and hence had
      // no idle time
      stats.idle = 0;
    }
  }

}
