import { useRouter } from "next/router";
import { useEffect } from "react";
import { getDecryptedEmployee } from "./decrypt";

function useAuthorization(expectedRoles) {
  const employee = getDecryptedEmployee();
  const router = useRouter();
  const isAuthenticated = !!employee;
  const userRole = employee?.role;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else if (!expectedRoles.includes(userRole)) {
      router.push("/unauth");
    }
  }, [isAuthenticated, userRole, expectedRoles, router]);

  return userRole;
}

export default useAuthorization;
