#ifndef MEMOISATION_TSLIST_H
#define MEMOISATION_TSLIST_H

#include <list>
#include <mutex>

#include "../Grid.h"

class TSList {
public:
    TSList();
    void PushBack(Grid grid);
    void PopFront();
    void Sort();
    Grid Front();
    bool Empty();

private:
    std::list<Grid> tsList;
    std::mutex m ;
};


#endif
