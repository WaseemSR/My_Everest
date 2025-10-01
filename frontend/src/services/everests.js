// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getEverests(token) {
    const requestOptions = {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(`${BACKEND_URL}/everests`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch everests");
    }
    const data = await response.json();
    return data;
}

export async function getOneEverest(id, token) {
    const requestOptions = {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(`${BACKEND_URL}/everests/${id}`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch everest");
    }
    const data = await response.json();
    return data;
}


export async function getUserEverests(userId, token) {
    const res = await fetch(`${BACKEND_URL}/users/${userId}/everests`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch user everests (status ${res.status})`);
    }
    return res.json();
}

export async function createEverest(name, details, startDate, endDate, milestones, everestImageUrl) {

    const token = localStorage.getItem("token"); 
    
    const payload = {
        name: name,
        details: details,
        startDate: startDate,
        endDate: endDate,
        milestones: milestones,
        everestImageUrl: everestImageUrl,
    };

    const requestOptions = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    };

    let response = await fetch(`${BACKEND_URL}/everests`, requestOptions);

    // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
    if (response.status === 201) {
        return await response.json();

    } else {
        throw new Error(
        `Received status ${response.status} when creating an everest. Expected 201`
        );
    }
}
export async function updateEverest(token, everestId, name, details, startDate, endDate, everestImageUrl) {
    const body = { name, details, startDate, endDate };

    if (everestImageUrl) body.everestImageUrl = everestImageUrl;
  
    const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, details, startDate, endDate }),
  };

  const response = await fetch(`${BACKEND_URL}/everests/${everestId}`, requestOptions);
  if (response.status !== 200) throw new Error("Unable to update Everest");
  return await response.json();
}