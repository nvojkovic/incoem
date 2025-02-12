import config from "./config";
import { Client, ScenarioSettings, UserInfo } from "src/types";
// import config from "./config";

const API = config.API_URL;

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

export const getClient = (id: string) => {
  return fetch(API + `client/${id}`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getPrintClient = async (id: any) => {
  const base =
    import.meta.env.VITE_ENV === "local" ? "http://im-server:3000/" : API;
  // const base = "http://localhost:3000/";
  const res = await fetch(base + `print/client/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

export const updateData = (id: string, data: Client) => {
  return fetch(API + `client/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const applyToAll = (name: string, value: boolean) => {
  return fetch(API + `user/featureToggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, value }),
  });
};

export const updateScenarios = (id: number, data: ScenarioSettings[]) => {
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

export const updateSettings = (settings: UserInfo) => {
  const result = settings;
  delete (result as any).email;
  return fetch(API + "settings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });
};

export const uploadLogo = (logo: File) => {
  const formData = new FormData();
  formData.append("logo", logo);

  return fetch(API + "user/logo", {
    method: "POST",
    body: formData,
  });
};
