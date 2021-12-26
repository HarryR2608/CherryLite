#include <iostream>
#include <thread>
#include <chrono>

#include "JobManager.h"
#include "DataManager.h"
#include "GridComputation.cuh"

JobManager::JobManager() {
    running = false;
}

void JobManager::FetcherLoop() {
    int count = 0;
    while (count < 120) {
        std::cout << "Fetcher loop " << count << std::endl;
        count++;
        FetcherCycle();
        std::this_thread::sleep_for(std::chrono::seconds(5));
    }
}

void JobManager::FetcherCycle() {
    json waitingJobs = DataManager::GetWaitingGrids();
    for (json job : waitingJobs) {
        Grid grid = Grid::FromJson(job);
        grids.PushBack(grid);
        grids.Sort();
        DataManager::UpdateToFetchedGrid(grid.id);
    }
}

void JobManager::ComputationLoop() {
    int count = 0;
    while (count < 600) {
        std::cout << "Computation loop " << count << std::endl;
        count++;
        ComputationCycle();
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
}

void JobManager::ComputationCycle() {
    if (!grids.Empty()) {
        while (!grids.Empty()) {
            Grid grid = grids.Front();
            grid.grid_status = "calculating";
            DataManager::UpdateToCalculatingGrid(grid.id);
            grid.grid_solution = GridComputation::Execute(grid.grid_grid);
            grid.grid_status = "completed";
            auto completion = std::chrono::system_clock::now();
            auto completionSeconds = std::chrono::time_point_cast<std::chrono::seconds>(completion);
            auto epochCompletion = completionSeconds.time_since_epoch();
            grid.grid_completed = std::to_string(epochCompletion.count());
            DataManager::UpdateToCompletedGrid(grid.id, grid.grid_solution, grid.grid_completed);
            grids.PopFront();
            std::cout << grid.id << " has been computed" << std::endl;
        }
    }
}

void JobManager::Start() {
    if (!running) {
        running = true;
        std::cout << "Start" << std::endl;
        std::thread fetcherThread(&JobManager::FetcherLoop, this);
        std::thread computationThread(&JobManager::ComputationLoop, this);

        fetcherThread.join();
        computationThread.join();
        std::cout << "End" << std::endl;
    }
}

void JobManager::Stop() {
    running = false;
}