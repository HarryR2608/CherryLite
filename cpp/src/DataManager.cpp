#include "DataManager.h"

#include <iostream>

size_t DataManager::WriteCallBack(void *contents, size_t size, size_t nmemb, void *userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

json DataManager::GetGrids(json jsonFilter) {
    CURL *curl;
    std::string res;

    std::string stringFilter = jsonFilter.dump();
    std::string filter;
    std::remove_copy(stringFilter.begin(), stringFilter.end(), std::back_inserter(filter), '/');

    curl = curl_easy_init();
    if (curl) {
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "GET");
        curl_easy_setopt(curl, CURLOPT_URL, "localhost:4000/grid/get");
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, filter.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, DataManager::WriteCallBack);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &res);

        curl_easy_perform(curl);
    }
    curl_easy_cleanup(curl);
    json result = json::parse(res);
    return result;

}

void DataManager::UpdateGrid(std::string id, json newGrid) {
    CURL *curl;

    std::string res;

    std::string stringGrid = newGrid.dump();
    std::string grid;
    std::remove_copy(stringGrid.begin(), stringGrid.end(), std::back_inserter(grid), '/');

    curl = curl_easy_init();

    if (curl) {
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_easy_setopt(curl, CURLOPT_URL, ("localhost:4000/grid/update/" + id).c_str());
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1l);
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, grid.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, DataManager::WriteCallBack);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &res);

        curl_easy_perform(curl);
    }

    curl_easy_cleanup(curl);

}

json DataManager::GetAllGrids() {
    json jsonFilter = "{}"_json;
    return GetGrids(jsonFilter);
}

json DataManager::GetWaitingGrids() {
    json jsonFilter;
    jsonFilter["grid_status"] = "waiting";
    return GetGrids(jsonFilter);
}

void DataManager::UpdateToFetchedGrid(std::string id) {
    json jsonFilter;
    jsonFilter["grid_status"] = "fetched";
    UpdateGrid(id, jsonFilter);
}

void DataManager::UpdateToCalculatingGrid(std::string id) {
    json jsonFilter;
    jsonFilter["grid_status"] = "calculating";
    UpdateGrid(id, jsonFilter);
}

void DataManager::UpdateToCompletedGrid(std::string id, std::string solution, std::string completed) {
    json jsonFilter;
    jsonFilter["grid_status"] = "completed";
    jsonFilter["grid_solution"] = solution;
    jsonFilter["grid_completed"] = completed;
    UpdateGrid(id, jsonFilter);
}