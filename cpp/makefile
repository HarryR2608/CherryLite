CC = g++
CFLAGS = -g

TARGET = main

all: $(TARGET) run

$(TARGET): $(TARGET).cpp
	$(CC) $(CFLAGS) -o $(TARGET) $(TARGET).cpp

run: $(TARGET)
	./$(TARGET)
