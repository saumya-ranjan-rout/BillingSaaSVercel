// packages/frontend/src/components/auth/RequireAuth.tsx
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser, selectCurrentToken } from "../../features/auth/authSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.replace("/auth/login"); // redirect if not logged in
    }
  }, [user, token, router]);

  if (!user || !token) {
    return null; // optional: loading spinner
  }

  return <>{children}</>;
};

export default RequireAuth;
