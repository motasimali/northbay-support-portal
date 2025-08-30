import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/",
  timeout: 15000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // redirect
    }
    return Promise.reject(error);
  }
);

export async function mockSubmit(payload) {
  console.log(payload);
  await new Promise((r) => setTimeout(r, 1000));
    // 1 out of 6 times fail (to test error UI)
    if (Math.random() < 1 / 6) {
      const err = new Error("Server is busy. Please try again.");
      err.status = 503;
      throw err;
    }
    return { id: String(Date.now()), receivedAt: new Date().toISOString() };
}
