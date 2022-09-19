#pragma once

#include <memory>
#include <cstdint>
#include <climits>
#include <initializer_list>

#include <string>
#include <vector>
#include <math.h>

#include <stdio.h>

void init();

void update( uint32_t tick );
void draw( uint32_t tick );

void draw_textbox( void );
void draw_map_tiles( bool top_layer );

namespace picosystem {

  extern uint32_t _debug;

  typedef uint16_t color_t;

  struct stat_t {
    uint32_t fps;       // current frames per second
    uint32_t idle;      // cpu idle time percentage
    uint32_t tick_us;   // last full tick time in microseconds
    uint32_t update_us; // last update() call time in microseconds
    uint32_t draw_us;   // last draw() call time in microseconds
    uint32_t flip_us;   // last flip time in microseconds
  };

  extern stat_t stats;

  struct buffer_t {
    int32_t w, h;
    color_t *data;

    color_t *p(int32_t x, int32_t y) {
      return data + (x + y * w);
    }
  };

  constexpr uint32_t HFLIP  = 0x01;
  constexpr uint32_t VFLIP  = 0x02;

  extern uint32_t       _io, _lio;           // io state and last io state
  extern buffer_t      * SCREEN;             // framebuffer
  extern buffer_t      *_dt;                 // drawing target

  // audio state
  extern uint32_t       _bpm;                 // beats per minute

  // audio
  void        play(
                uint32_t frequency,
                uint32_t duration = 500, uint32_t volume = 100);
  uint8_t     audio_sample(uint32_t ms);
  int32_t     position();
  bool        playing();

  // utility
  color_t     rgb(uint16_t rgb);
  buffer_t*   buffer(uint32_t w, uint32_t h, void *data = nullptr);
  uint32_t    time();
  uint32_t    time_us();
  void        sleep(uint32_t d);

  // hardware
  bool        pressed(uint32_t b);
  bool        button(uint32_t b);
  uint32_t    battery();
  void        led(uint8_t r, uint8_t g, uint8_t b);
  void        backlight(uint8_t b);

  // weird and wonderful...
  //void        screenshot();

  // internal methods - do not call directly, will change!
  void       _init_hardware();
  void       _start_audio();
  uint32_t   _gpio_get();
  float      _battery_voltage();
  void       _reset_to_dfu();
  void       _wait_vsync();
  void       _flip();
  bool       _is_flipping();
  void       _update_audio();
  void       _play_note(uint32_t f, uint32_t v);

  // input pins
  enum button {
    UP    = 23,
    DOWN  = 20,
    LEFT  = 22,
    RIGHT = 21,
    A     = 18,
    B     = 19,
    X     = 17,
    Y     = 16
  };

  enum note {
    _ = 0,
    C0 = 16, Cs0 = 17, Db0 = 17, D0 = 18, Ds0 = 19, Eb0 = 19,
    E0 = 20, F0 = 21, Fs0 = 23, Gb0 = 23, G0 = 24, Gs0 = 25,
    Ab0 = 25, A0 = 27, As0 = 29, Bb0 = 29, B0 = 30, C1 = 32,
    Cs1 = 34, Db1 = 34, D1 = 36, Ds1 = 38, Eb1 = 38, E1 = 41,
    F1 = 43, Fs1 = 46, Gb1 = 46, G1 = 49, Gs1 = 51, Ab1 = 51,
    A1 = 55, As1 = 58, Bb1 = 58, B1 = 61, C2 = 65, Cs2 = 69,
    Db2 = 69, D2 = 73, Ds2 = 77, Eb2 = 77, E2 = 82, F2 = 87,
    Fs2 = 92, Gb2 = 92, G2 = 98, Gs2 = 103, Ab2 = 103, A2 = 110,
    As2 = 116, Bb2 = 116, B2 = 123, C3 = 130, Cs3 = 138, Db3 = 138,
    D3 = 146, Ds3 = 155, Eb3 = 155, E3 = 164, F3 = 174, Fs3 = 185,
    Gb3 = 185, G3 = 196, Gs3 = 207, Ab3 = 207, A3 = 220, As3 = 233,
    Bb3 = 233, B3 = 246, C4 = 261, Cs4 = 277, Db4 = 277, D4 = 293,
    Ds4 = 311, Eb4 = 311, E4 = 329, F4 = 349, Fs4 = 369, Gb4 = 369,
    G4 = 392, Gs4 = 415, Ab4 = 415, A4 = 440, As4 = 466, Bb4 = 466,
    B4 = 493, C5 = 523, Cs5 = 554, Db5 = 554, D5 = 587, Ds5 = 622,
    Eb5 = 622, E5 = 659, F5 = 698, Fs5 = 739, Gb5 = 739, G5 = 783,
    Gs5 = 830, Ab5 = 830, A5 = 880, As5 = 932, Bb5 = 932, B5 = 987,
    C6 = 1046, Cs6 = 1108, Db6 = 1108, D6 = 1174, Ds6 = 1244, Eb6 = 1244,
    E6 = 1318, F6 = 1396, Fs6 = 1479, Gb6 = 1479, G6 = 1567, Gs6 = 1661,
    Ab6 = 1661, A6 = 1760, As6 = 1864, Bb6 = 1864, B6 = 1975, C7 = 2093,
    Cs7 = 2217, Db7 = 2217, D7 = 2349, Ds7 = 2489, Eb7 = 2489, E7 = 2637,
    F7 = 2793, Fs7 = 2959, Gb7 = 2959, G7 = 3135, Gs7 = 3322, Ab7 = 3322,
    A7 = 3520, As7 = 3729, Bb7 = 3729, B7 = 3951, C8 = 4186, Cs8 = 4434,
    Db8 = 4434, D8 = 4698, Ds8 = 4978, Eb8 = 4978, E8 = 5274, F8 = 5587,
    Fs8 = 5919, Gb8 = 5919, G8 = 6271, Gs8 = 6644, Ab8 = 6644, A8 = 7040,
    As8 = 7458, Bb8 = 7458, B8 = 7902,
  };

}
