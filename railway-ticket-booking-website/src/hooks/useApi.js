import { useState, useCallback } from "react";
import api from "../helpers/api";

/**
 * Custom hook for making API calls with built-in loading and error handling
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url,
      };

      if (data) {
        config.data = data;
      }

      const response = await api(config);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.errorMessage ||
        err.response?.data?.error ||
        err.message ||
        "An error occurred";

      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url) => request("GET", url), [request]);
  const post = useCallback(
    (url, data) => request("POST", url, data),
    [request],
  );
  const put = useCallback((url, data) => request("PUT", url, data), [request]);
  const patch = useCallback(
    (url, data) => request("PATCH", url, data),
    [request],
  );
  const del = useCallback((url) => request("DELETE", url), [request]);

  return { loading, error, get, post, put, patch, delete: del };
};

export default useApi;
