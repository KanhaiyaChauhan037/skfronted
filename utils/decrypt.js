import CryptoJS from "crypto-js";

// Decrypt function

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPT_DECRYPT_KEY;
export function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
}

export function getDecryptedEmployee() {
  const encEmployee =
    typeof window !== "undefined" && localStorage.getItem("employee")
      ? JSON.parse(localStorage.getItem("employee"))
      : null;

  let employee = null;
  if (encEmployee && encEmployee.encryptedData) {
    employee = decryptData(encEmployee.encryptedData);
  }

  return employee;
}
