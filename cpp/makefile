CPP_COMP = cl
CPP_FLAGS = /c /EHsc

CUDA_COMP = nvcc
CUDA_FLAGS = -c

TARGET = main

SRC_DIR = src
OBJ_DIR = obj
LIB_DIR = lib

H_FILES = $(wildcard $(SRC_DIR)/*.h) $(wildcard $(SRC_DIR)/*/*.h) $(wildcard $(SRC_DIR)/*/*/*.h) $(wildcard $(SRC_DIR)/*/*/*/*.h) $(wildcard $(SRC_DIR)/*/*/*/*/*.h)
CUH_FILES = $(wildcard $(SRC_DIR)/*.cuh) $(wildcard $(SRC_DIR)/*/*.cuh) $(wildcard $(SRC_DIR)/*/*/*.cuh) $(wildcard $(SRC_DIR)/*/*/*/*.cuh) $(wildcard $(SRC_DIR)/*/*/*/*/*.cuh)

TARGET_CPP_DEPS = $(H_FILES:.h=.o)
TARGET_CUDA_DEPS = $(CUH_FILES:.cuh=.obj)

CPP_OBJ_FILES = $(addprefix $(OBJ_DIR)\,$(notdir $(TARGET_CPP_DEPS:.o=.obj)))
CUDA_OBJ_FILES = $(addprefix $(OBJ_DIR)\,$(notdir $(TARGET_CUDA_DEPS)))

LIBS = "C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.3\lib\x64\cuda.lib" "C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.3\lib\x64\cudart.lib" "C:\Users\harry\Downloads\curl-7.79.0\builds\libcurl-vc-x64-release-dll-ipv6-sspi-schannel\lib\libcurl.lib"
DEPS = $(LIB_DIR)\curl.h $(LIB_DIR)\curlver.h $(LIB_DIR)\easy.h $(LIB_DIR)\multi.h $(LIB_DIR)\options.h $(LIB_DIR)\system.h $(LIB_DIR)\urlapi.h $(LIB_DIR)\json.hpp

default: $(TARGET) run

%.o: %.cpp $(H_FILES) $(CUH_FILES) $(DEPS)
	$(CPP_COMP) $(CPP_FLAGS) /Fo$(OBJ_DIR)\ $<

%.obj: %.cu $(H_FILES) $(CUH_FILES) $(DEPS)
	$(CUDA_COMP) $(CUDA_FLAGS) -o $(OBJ_DIR)/$(notdir $@) $<

$(TARGET): $(SRC_DIR)\$(TARGET).o $(TARGET_CPP_DEPS) $(TARGET_CUDA_DEPS)
	cl /Fe$(OBJ_DIR)\$(TARGET).exe $(OBJ_DIR)\$(TARGET).obj $(CPP_OBJ_FILES) $(CUDA_OBJ_FILES) $(LIBS)

run:
	$(OBJ_DIR)\$(TARGET).exe

clean:
	del /Q obj\*