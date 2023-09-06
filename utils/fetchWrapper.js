function updateOptions(options) {
  const update = { ...options };

  const encEmployee =
    typeof window !== "undefined" && localStorage.getItem("employee")
      ? JSON.parse(localStorage.getItem("employee"))
      : null;

  if (encEmployee?.encryptedData) {
    update.headers = {
      ...update.headers,
      "Encrypted-Data": encEmployee.encryptedData,
    };
  }

  return update;
}

export default function fetcher(url, options) {
  return fetch(url, updateOptions(options));
}
