cmake_minimum_required(VERSION 3.12)

# Pull in PICO SDK (must be before project)
include(pico_sdk_import.cmake)

project(picosystem C CXX ASM)
set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)

# Initialize the SDK
pico_sdk_init()

# Include the PicoSystem library
include(${CMAKE_CURRENT_LIST_DIR}/libraries/picosystem.cmake REQUIRED)

# Include the game assets
include(${CMAKE_CURRENT_LIST_DIR}/src/assets/assets.cmake REQUIRED)
# Include the game soruce files
add_subdirectory(src)

# setup release packages
set(CPACK_INCLUDE_TOPLEVEL_DIRECTORY OFF)
include(CPack)