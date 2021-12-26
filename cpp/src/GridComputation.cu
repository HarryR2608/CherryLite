#include "GridComputation.cuh"

#include <string>
#include <iostream>
#include <cuda.h>
#include <cuda_runtime.h>

__global__ void ComputeGrid(int* grid, int* memory, bool* direction, int width, int height) {
    memory[0] = grid[0];
    for (int j = 0; j < height; j++) {
        for (int i = 0; i < width; i++) {
            if (j == 0 && i != 0) {
                memory[i] = memory[i-1] + grid[i];
                direction[i] = true;
            }
            else if (i == 0 && j != 0)
            {
                memory[j * width] = memory[(j - 1) * width] + grid[j * width];
                direction[j * width] = false;
            }
            else if (i != 0 && j != 0)
            {
                if (memory[((j - 1) * width) + i] < memory[(j * width) + i - 1]) {
                    memory[(j * width) + i] = memory[((j - 1) * width) + i] + grid[(j * width) + i];
                    direction[(j * width) + i] = false;
                }
                else {
                    memory[(j * width) + i] = memory[(j * width) + i - 1] + grid[(j * width) + i];
                    direction[(j * width) + i] = true;
                }
            }
        }
    }
}

std::string GridComputation::Execute(std::string gridString) {

    //DIRECTION 1 means FROM THE LEFT, 0 means FROM THE TOP

    int width = 1;
    int height = 1;
    for (char element : gridString) {
        if (element == '_') {
            width++;
            height++;
        }
        else if (element == '-') {
            width++;
        }
    }
    width /= height;

    //Host variables
    int* grid;
    int* memory;
    bool* direction;

    //Device variables
    int* d_grid;
    int* d_memory;
    bool* d_direction;

    //Allocate host memory
    grid = (int*)malloc(sizeof(int) * width * height);
    memory = (int*) malloc(sizeof(int) * width * height);
    direction = (bool*) malloc(sizeof(bool) * width * height);

    //Initialise grid
    size_t elementPosition;
    size_t rowPosition;
    std::string elementDelimiter = "-";
    std::string rowDelimiter = "_";
    std::string element;
    std::string row;
    int i = 0;
    while((rowPosition = gridString.find(rowDelimiter)) != std::string::npos) {
        row = gridString.substr(0, rowPosition);

        while ((elementPosition = row.find(elementDelimiter)) != std::string::npos) {
            element = row.substr(0, elementPosition);
            grid[i] = std::stoi(element);
            i++;
            row.erase(0, elementPosition + elementDelimiter.length());
        }
        grid[i] = std::stoi(row);
        i++;
        gridString.erase(0, rowPosition + rowDelimiter.length());
    }
    while ((elementPosition = gridString.find(elementDelimiter)) != std::string::npos) {
        element = gridString.substr(0, elementPosition);
        grid[i] = std::stoi(element);
        i++;
        gridString.erase(0, elementPosition + elementDelimiter.length());
    }
    grid[i] = std::stoi(gridString);

    //Allocate device memory
    cudaMalloc((void**)&d_grid, sizeof(int) * width * height);
    cudaMalloc((void**)&d_memory, sizeof(int) * width * height);
    cudaMalloc((void**)&d_direction, sizeof(bool) * width * height);

    //Copy data to device
    cudaMemcpy(d_grid, grid, sizeof(int) * width * height, cudaMemcpyHostToDevice);

    //Execute kernel
    ComputeGrid<<<1,1>>>(d_grid, d_memory, d_direction, width, height);

    //Copy data to host
    cudaMemcpy(direction, d_direction, sizeof(bool) * width * height, cudaMemcpyDeviceToHost);

    //Calculate route
    int currentI = width - 1;
    int currentJ = height - 1;
    std::string route = "";
    for (int a = 0; a < width + height - 2; a++) {
        route = (direction[currentJ * width + currentI] ? "1" : "0") + route;
        if (direction[currentJ * width + currentI]) {
            currentI--;
        } else {
            currentJ--;
        }
    }

    // Deallocate device memory
    cudaFree(d_grid);
    cudaFree(d_memory);
    cudaFree(d_direction);

    // Deallocate host memory
    free(grid);
    free(memory);
    free(direction);

    return route;
}