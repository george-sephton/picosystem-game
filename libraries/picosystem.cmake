add_library(picosystem INTERFACE)

pico_generate_pio_header(picosystem ${CMAKE_CURRENT_LIST_DIR}/screen_double.pio)

target_sources(picosystem INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/picosystem.cpp
  ${CMAKE_CURRENT_LIST_DIR}/audio.cpp
  ${CMAKE_CURRENT_LIST_DIR}/hardware.cpp
)

target_include_directories(picosystem INTERFACE ${CMAKE_CURRENT_LIST_DIR})

target_link_libraries(picosystem INTERFACE pico_stdlib pico_stdio hardware_pio hardware_spi hardware_pwm hardware_dma hardware_irq hardware_adc hardware_interp)

function(picosystem_executable NAME SOURCES)
  add_executable(
    ${NAME}
    ${SOURCES}
    ${ARGN}
  )

  # Pull in pico libraries that we need
  target_link_libraries(${NAME} picosystem)

  # pico_enable_stdio_usb(picosystem-game 1)
  # pico_enable_stdio_uart(picosystem-game 0)

  # create map/bin/hex file etc.
  pico_add_extra_outputs(${NAME})

  install(FILES ${CMAKE_CURRENT_BINARY_DIR}/${NAME}.uf2 DESTINATION .)
endfunction()