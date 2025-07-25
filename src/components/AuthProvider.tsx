import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const    [loading, setLoading] = useState(true);
const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
        router.push("/");
    //   setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);


  if(loading) {
    return <div>Loading...</div>;  } 

    else if(!isAuthenticated){
        return <div>Please log in to access this page.</div>;
    }


  return (
    <>{children}</>
  );
}

export default AuthProvider;