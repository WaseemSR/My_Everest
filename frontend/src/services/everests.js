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

// get users everests for their profile page
export async function getUserEverests(userId, token) {

    const opts = { method: "GET", headers: { Authorization: `Bearer ${token}` } };
    const res = await fetch(`${BACKEND_URL}/users/${userId}/everests`, opts);

    if (!res.ok) {
        const err = new Error("Failed to fetch user everests");
        err.status = res.status;
        throw err;
    }
    return res.json();
}


export async function createeverest(name, details, startDate, endDate, milestone,) {

    const token = localStorage.getItem("token"); 
    
    const payload = {
        name: name,
        details: details,
        startDate: startDate,
        endDate: endDate,
        milestone: milestone,
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