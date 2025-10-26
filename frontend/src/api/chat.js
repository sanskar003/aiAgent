const BASE_URL = "http://localhost:5000/api";

export async function login(email, password) {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // ✅ Use data.error instead of data.message
      throw new Error(data.error || "Login failed");
    }

    return data; // { token, user }
  } catch (err) {
    if (err.name === "TypeError") {
      throw new Error("Network error. Please check your connection.");
    }
    throw err;
  }
}

export const register = async (username, email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json(); // should return { token, threadID }
};

export const sendChatMessage = async (token, messages, threadID) => {
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages, threadID }) // ✅ now threadID is defined
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Chat API failed: ${res.status} - ${errorText}`);
  }

  return await res.json();
};


export async function fetchHistory(token, threadID, page = 1, limit = 30) {
  const res = await fetch(`http://localhost:5000/api/history/${threadID}?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fetch failed: ${res.status} - ${errorText}`);
  }

  return await res.json();
}