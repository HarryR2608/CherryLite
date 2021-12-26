#ifndef MEMOISATION_GRID_H
#define MEMOISATION_GRID_H

#include <string>
#include "../dep/json.hpp"

using json = nlohmann::json;

class Grid {
public:
    std::string id;
    std::string grid_submitted;
    std::string grid_completed;
    std::string grid_priority;
    std::string grid_status;
    std::string grid_grid;
    std::string grid_solution;
    static json ToJson(Grid grid);
    static Grid FromJson(json jsonGrid);
};


#endif
