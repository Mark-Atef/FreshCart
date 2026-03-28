import { createContext , useState } from "react";


export const AuthenticationContext = createContext();

export function AuthenticationProvider({ children }) {


    const [token, setToken] = useState(localStorage.getItem("token"));
  
    return <AuthenticationContext.Provider value={{ token, setToken }}>
    
    {children}

    </AuthenticationContext.Provider>

}