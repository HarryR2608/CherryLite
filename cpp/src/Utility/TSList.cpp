#include "TSList.h"

TSList::TSList() {
    tsList.clear();
}

void TSList::PushBack(Grid grid) {
    std::lock_guard<std::mutex> lg(m);
    tsList.push_back(grid);
}

void TSList::PopFront() {
    std::lock_guard<std::mutex> lg(m);
    tsList.pop_front();
}

void TSList::Sort() {
    std::lock_guard<std::mutex> lg(m);
    tsList.sort([](const Grid &f, const Grid &s) {
        return f.grid_priority == s.grid_priority ? f.grid_submitted < s.grid_submitted
            : (f.grid_priority == "high" && s.grid_priority != "high") || (f.grid_priority == "medium" && s.grid_priority == "low");});
}

Grid TSList::Front() {
    std::lock_guard<std::mutex> lg(m);
    return tsList.front();
}

bool TSList::Empty() {
    std::lock_guard<std::mutex> lg(m);
    return tsList.empty();
}