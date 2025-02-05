jest.mock("./services/config", () => ({
  config: {
    apiUrl: "http://localhost:mock",
  },
}));
