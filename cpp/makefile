CPP_COMP = cl
CPP_FLAGS = /c /EHsc

CUDA_COMP = nvcc
CUDA_FLAGS = -c

TARGET = main

SRC_DIR = src
OBJ_DIR = obj
OUT_DIR = out
DEP_DIR = dep
LIB_DIR = lib

H_FILES = $(wildcard $(SRC_DIR)/*.h) $(wildcard $(SRC_DIR)/*/*.h) $(wildcard $(SRC_DIR)/*/*/*.h) $(wildcard $(SRC_DIR)/*/*/*/*.h) $(wildcard $(SRC_DIR)/*/*/*/*/*.h)
CUH_FILES = $(wildcard $(SRC_DIR)/*.cuh) $(wildcard $(SRC_DIR)/*/*.cuh) $(wildcard $(SRC_DIR)/*/*/*.cuh) $(wildcard $(SRC_DIR)/*/*/*/*.cuh) $(wildcard $(SRC_DIR)/*/*/*/*/*.cuh)

TARGET_CPP_DEPS = $(H_FILES:.h=.o)
TARGET_CUDA_DEPS = $(CUH_FILES:.cuh=.obj)

CPP_OBJ_FILES = $(addprefix $(OBJ_DIR)\,$(notdir $(TARGET_CPP_DEPS:.o=.obj)))
CUDA_OBJ_FILES = $(addprefix $(OBJ_DIR)\,$(notdir $(TARGET_CUDA_DEPS)))

LIBS = $(LIB_DIR)\cuda.lib $(LIB_DIR)\cudart.lib $(LIB_DIR)\libcurl.lib
DEPS = $(DEP_DIR)\curl.h $(DEP_DIR)\curlver.h $(DEP_DIR)\easy.h $(DEP_DIR)\multi.h $(DEP_DIR)\options.h $(DEP_DIR)\system.h $(DEP_DIR)\urlapi.h $(DEP_DIR)\json.hpp

default: $(TARGET) run

%.o: %.cpp $(H_FILES) $(CUH_FILES) $(DEPS)
	$(CPP_COMP) $(CPP_FLAGS) /Fo$(OBJ_DIR)\ $<

%.obj: %.cu $(H_FILES) $(CUH_FILES) $(DEPS)
	$(CUDA_COMP) $(CUDA_FLAGS) -o $(OBJ_DIR)/$(notdir $@) $<

$(TARGET): $(SRC_DIR)\$(TARGET).o $(TARGET_CPP_DEPS) $(TARGET_CUDA_DEPS)
	cl /Fe$(OUT_DIR)\$(TARGET).exe $(OBJ_DIR)\$(TARGET).obj $(CPP_OBJ_FILES) $(CUDA_OBJ_FILES) /link $(LIBS)

run:
	$(OUT_DIR)\$(TARGET).exe

clean:
	del /Q $(OBJ_DIR)\*
	del /Q $(OUT_DIR)\$(TARGET).exe