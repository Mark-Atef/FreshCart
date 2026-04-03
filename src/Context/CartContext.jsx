import axios from "axios";
import { createContext } from "react";

export const CartContext = createContext();

export function CartContextProvider({ children }) {

    async function addToCart(productId) {
        const {data} = await axios.post("https://ecommerce.routemisr.com/api/v2/cart",
            {
                "productId": productId
            },
            {
                headers: {
                    token: localStorage.getItem("token")
                }
            }
        )

        return data;
    }


    return <CartContext.Provider value={{ addToCart }}>

        {children}

    </CartContext.Provider>

}