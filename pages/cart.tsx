import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FiTrash2, FiChevronLeft, FiLogIn } from 'react-icons/fi';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        setIsClient(true);
        const savedCart = localStorage.getItem('eventCart');
        if (savedCart) setCart(JSON.parse(savedCart));
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('eventCart', JSON.stringify(cart));
        }
    }, [cart, isClient]);

    const handleRemove = (cartKey) => {
        setCart(prev => prev.filter((item) => item.cartKey !== cartKey));
    };

    const handleQuantityChange = (cartKey, quantity) => {
        const newQuantity = Math.max(1, Math.min(10, Number(quantity))) || 1;
        setCart(prev =>
            prev.map((item) =>
                item.cartKey === cartKey ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleContinueShopping = () => {
        router.push('/');
    };

    const handleCheckout = () => {
        router.push('/checkout');
    };

    const handleSignIn = () => {
        router.push('/auth/signin?callbackUrl=/cart');
    };

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (!isClient) {
        return null; // or loading spinner
    }

    return (
        <>
            <Header cart={cart} />
            <main className="pt-24 px-4 sm:px-6 max-w-4xl mx-auto pb-12">
                <button
                    onClick={handleContinueShopping}
                    className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
                >
                    <FiChevronLeft className="mr-1" />
                    Continue Shopping
                </button>

                <h1 className="text-4xl font-bold mb-6 text-center text-purple-700">Your Cart</h1>
                {totalItems > 0 && (
                    <p className="text-center text-gray-500 mb-10">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                    </p>
                )}

                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
                        <button
                            onClick={handleContinueShopping}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
                        >
                            Browse Events
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.cartKey}
                                    className="flex flex-col sm:flex-row justify-between bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                                >
                                    <div className="flex flex-1 items-start sm:items-center space-x-4">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{item.title}</h2>
                                            <p className="text-sm text-indigo-600 capitalize">
                                                {item.type === 'general' ? 'General Admission' : 'VIP'}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(item.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end sm:space-x-6">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.cartKey, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.cartKey, e.target.value)}
                                                className="w-12 px-2 py-1 border border-gray-300 rounded-md shadow-sm text-center"
                                            />
                                            <button
                                                onClick={() => handleQuantityChange(item.cartKey, item.quantity + 1)}
                                                disabled={item.quantity >= 10}
                                                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">${item.price} each</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.cartKey)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <FiTrash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Order Summary</h3>
                                <span className="text-sm text-gray-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service Fee</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span>$0.00</span>
                                </div>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-4">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
                            </div>

                            {status === 'loading' ? (
                                <button
                                    disabled
                                    className="mt-6 w-full bg-gray-300 text-white font-semibold py-3 px-8 rounded-xl shadow-lg cursor-not-allowed"
                                >
                                    Loading...
                                </button>
                            ) : session ? (
                                <button
                                    onClick={handleCheckout}
                                    className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                                >
                                    Proceed to Checkout
                                </button>
                            ) : (
                                <button
                                    onClick={handleSignIn}
                                    className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center"
                                >
                                    <FiLogIn className="mr-2" />
                                    Sign In to Checkout
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default CartPage;