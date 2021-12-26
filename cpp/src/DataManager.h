#ifndef MEMOISATION_DATAFETCHER_H
#define MEMOISATION_DATAFETCHER_H

#include <string>

#include "../lib/curl.h"
#include "../lib/json.hpp"

using json = nlohmann::json;

class DataManager {
public:
    static json GetAllGrids();
    static json GetWaitingGrids();
    static void UpdateToFetchedGrid(std::string id);
    static void UpdateToCalculatingGrid(std::string id);
    static void UpdateToCompletedGrid(std::string id, std::string solution, std::string completed);

private:
    DataManager();
    static size_t WriteCallBack(void *contents, size_t size, size_t nmemb, void *userp);
    static json GetGrids(json jsonFilter);
    static void UpdateGrid(std::string id, json jsonFilter);
};


#endif
