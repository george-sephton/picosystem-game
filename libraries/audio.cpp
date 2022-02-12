#include "picosystem.hpp"

namespace picosystem {

  uint32_t _ms;
  uint32_t _frequency;
  uint32_t _duration;
  uint32_t _volume = 100;
  uint32_t _music_current_note = 0;

  struct music_note {
    enum note play_note;
    uint32_t duration;
    uint32_t volume;
  };

  struct music_note music_track[] = {
    {C5, 500, 100}, {D5, 500, 100}, {E5, 500, 100}, {F5, 500, 100}
  };

  void play(uint32_t frequency, uint32_t duration, uint32_t volume) {
    _frequency = frequency;
    _duration = duration;
    _volume = volume;
    _ms = 0;
  }

  int32_t position() {
    return (_ms > _duration) ? -1 : _ms;
  }

  bool playing() {
    return position() != -1;
  }

  uint8_t audio_sample(uint32_t ms) {
    
    uint32_t sample = 0;

    if(_music_current_note < 4)
    {
      if(ms < _duration) {
        // grab volume as start point for sample
        sample = _volume;

        sample *= (100 << 8) / 100;
        sample >>= 8;
      } else {
        //_ms = 0;
        //_music_current_note++;

        
      }
    }

    return sample;
  }

  void _update_audio() {
    // Called every 1ms
    uint32_t sample = audio_sample(_ms++);
    _play_note(_frequency, sample);
  }
}
