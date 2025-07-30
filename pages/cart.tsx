// pages/cart.tsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const savedCart = localStorage.getItem('eventCart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('eventCart', JSON.stringify(cart));
    }, [cart]);

    const handleRemove = (cartKey) => {
        setCart(cart.filter((item) => item.cartKey !== cartKey));
    };

    const handleQuantityChange = (cartKey, quantity) => {
        setCart((prev) =>
            prev.map((item) =>
                item.cartKey === cartKey ? { ...item, quantity: Number(quantity) } : item
            )
        );
    };

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <>
            <Header cart={cart} />
            <main className="pt-24 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center text-purple-700">Your Cart</h1>

                {cart.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
                ) : (
                    <div className="space-y-6">
                        {cart.map((item) => (
                            <div key={item.cartKey} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                                <div className="flex items-center space-x-6">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                                        {item.type && <p className="text-sm text-indigo-500">Type: {item.type}</p>}
                                        <p className="text-sm text-gray-500">${item.price} × {item.quantity}</p>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.cartKey, e.target.value)}
                                        className="w-16 px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-center"
                                    />
                                    <button
                                        onClick={() => handleRemove(item.cartKey)}
                                        className="text-sm font-medium text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 mt-6">
                            <p className="text-2xl font-bold text-gray-800">Total: ${totalAmount.toFixed(2)}</p>
                            <button
                                onClick={() => alert('Proceeding to payment...')}
                                className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default CartPage;
