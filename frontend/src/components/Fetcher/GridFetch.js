async function GetAllGrids() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const res = await fetch("http://localhost:4000/grid/get", requestOptions);
  return await res.json();
}

async function GetGrid(id) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const res = await fetch(
    "http://localhost:4000/grid/get/" + id,
    requestOptions
  );
  return await res.json();
}

async function AddGrid(params) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const raw = JSON.stringify(params);

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow",
  };

  const res = await fetch("http://localhost:4000/grid/add/", requestOptions);
  return await res.json();
}

async function UpdateGrid(id, params) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const raw = JSON.stringify(params);

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: raw,
    redirect: "follow",
  };

  const res = await fetch(
    "http://localhost:4000/grid/update/" + id,
    requestOptions
  );
  return await res.json();
}

async function DeleteGrid(id) {
  const requestOptions = {
    method: "POST",
    redirect: "follow",
  };

  const res = await fetch(
    "http://localhost:4000/grid/delete/" + id,
    requestOptions
  );
  return await res.json();
}

export { GetAllGrids, GetGrid, UpdateGrid, DeleteGrid, AddGrid };
