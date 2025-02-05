import { Client } from "src/types";

const API = import.meta.env.VITE_API_URL;

export const helpUrl = `${API}help`;

const fetchApi = async (url: string, options: any) => {
  try {
    const resp = await window.fetch(url, options);
    if (!resp.ok) {
      throw resp.status;
    }
    return await resp.json();
  } catch (e) {
    console.error("aaaaaa", e);
  }
};

export const createClient = (client: Client) => {
  return fetch(API + "clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });
};

export const deleteClient = (client: Client) => {
  return fetch(API + `client/${client.id}`, {
    method: "DELETE",
  });
};

export const duplicateClient = (client: Client, name: string) => {
  return fetch(API + `client/${client.id}/duplicate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
};

export const getClients = () => {
  return fetchApi(API + "clients", {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getClient = (id: any) => {
  return fetch(API + `client/${id}`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getPrintClient = (id: any) => {
  const base =
    import.meta.env.VITE_ENV === "local" ? "http://im-server:3000/" : API;
  return fetch(base + `print/client/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateData = (id: any, data: any) => {
  return fetch(API + `client/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const applyToAll = (name: any, value: any) => {
  return fetch(API + `user/featureToggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, value }),
  });
};

export const updateScenarios = (id: any, data: any) => {
  return fetch(API + `client/scenarios/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
};

export const getUser = () => {
  return fetch(API + "user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateSettings = (settings: any) => {
  const result = settings;
  delete result.email;
  return fetch(API + "settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });
};

export const uploadLogo = (logo: any) => {
  const formData = new FormData();
  formData.append("logo", logo);

  return fetch(API + "user/logo", {
    method: "POST",
    body: formData,
  });
};
