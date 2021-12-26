#ifndef MEMOISATION_JOBMANAGER_H
#define MEMOISATION_JOBMANAGER_H

#include "Grid.h"
#include "Utility/TSList.h"

class JobManager {
public:
    JobManager();
    void Start();
    void Stop();


private:
    TSList grids;
    void FetcherLoop();
    void FetcherCycle();
    void ComputationLoop();
    void ComputationCycle();
    bool running;
};


#endif
