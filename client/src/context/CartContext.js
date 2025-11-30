"use client"

import { createContext, useState, useEffect } from "react"

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((item) => item._id === product._id)

    if (existing) {
      const updated = cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item,
      )
      setCart(updated)
      localStorage.setItem("cart", JSON.stringify(updated))
    } else {
      const newCart = [...cart, { ...product, quantity }]
      setCart(newCart)
      localStorage.setItem("cart", JSON.stringify(newCart))
    }
  }

  const removeFromCart = (productId) => {
    const updated = cart.filter((item) => item._id !== productId)
    setCart(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      const updated = cart.map((item) => (item._id === productId ? { ...item, quantity } : item))
      setCart(updated)
      localStorage.setItem("cart", JSON.stringify(updated))
    }
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cart")
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
