// ✅ Use your deployed backend URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");

async function handleResponse(res, defaultError = "Request failed") {
  if (!res.ok) {
    let message;
    try {
      const data = await res.json();
      message = data.error || defaultError;
    } catch {
      message = await res.text();
    }
    throw new Error(`${defaultError}: ${res.status} - ${message}`);
  }
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res, "Login failed");
}

export async function register(username, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(res, "Registration failed");
}

export async function sendChatMessage(token, messages, threadID) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, threadID }),
  });
  return handleResponse(res, "Chat API failed");
}

export async function fetchHistory(token, threadID, page = 1, limit = 30) {
  const res = await fetch(
    `${BASE_URL}/history/${threadID}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return handleResponse(res, "Fetch history failed");
}

export async function fetchThreads(token) {
  const res = await fetch(`${BASE_URL}/threads`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Fetch threads failed");
}