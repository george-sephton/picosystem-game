target_include_directories(picosystem INTERFACE ${CMAKE_CURRENT_LIST_DIR})

target_sources(picosystem INTERFACE
  ${CMAKE_CURRENT_LIST_DIR}/display_animations.cpp
  ${CMAKE_CURRENT_LIST_DIR}/display.cpp
  ${CMAKE_CURRENT_LIST_DIR}/text.cpp
)

picosystem_executable(
  picosystem-game
  picosystem-game.cpp
)