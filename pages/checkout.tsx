import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { FiChevronLeft, FiCreditCard, FiLock, FiCheck, FiCopy, FiArrowLeft, FiClock } from 'react-icons/fi';
import Image from 'next/image';

const CheckoutPage = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
    const [verificationStarted, setVerificationStarted] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const cartData = JSON.parse(localStorage.getItem('eventCart') || '[]');
            setCart(cartData);
            setTotalAmount(cartData.reduce((acc, item) => acc + item.price * item.quantity, 0));
        }
    }, []);

    useEffect(() => {
        let timer;
        if (verificationStarted && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (verificationStarted && timeLeft === 0) {
            setIsVerifying(false);
            setOrderComplete(true);
            localStorage.removeItem('eventCart');
        }
        return () => clearTimeout(timer);
    }, [verificationStarted, timeLeft]);

    const paymentMethods = [
        {
            id: 'bank_transfer',
            name: 'Bank Transfer',
            icon: '/images/bank.png',
            description: 'Direct bank transfer to our account',
            details: {
                bankName: 'International Commerce Bank',
                accountName: 'EventHorizon Tickets Ltd',
                accountNumber: '9876543210',
                iban: 'ICBK0019876543210',
                swift: 'ICBKUS33',
                reference: `EVENT-${Date.now().toString().slice(-6)}`
            }
        },
        {
            id: 'paypal',
            name: 'PayPal',
            icon: '/images/paypal.png',
            description: 'Pay with your PayPal account',
            details: {
                email: 'payments@eventhorizon.com',
                note: 'Include transaction ID in payment notes'
            }
        },
        {
            id: 'wise',
            name: 'Wise Transfer',
            icon: '/images/wise.png',
            description: 'International money transfer',
            details: {
                email: 'eventhorizon@wise.com',
                accountNumber: 'US9876543210',
                reference: `EVENT-${Date.now().toString().slice(-6)}`
            }
        },
        {
            id: 'alipay',
            name: 'Alipay',
            icon: '/images/alipay.png',
            description: 'Popular Chinese payment method',
            details: {
                qrCode: '/payments/alipay-qr.png',
                account: 'eventhorizon@alipay.com',
                note: 'Scan QR code to pay'
            }
        },
        {
            id: 'wechat',
            name: 'WeChat Pay',
            icon: '/images/wechat.png',
            description: 'Pay through WeChat app',
            details: {
                qrCode: '/payments/wechat-qr.png',
                account: 'EventHorizon-Tickets',
                note: 'Scan QR code in WeChat app'
            }
        },
        {
            id: 'gcash',
            name: 'GCash',
            icon: '/images/gcash.png',
            description: 'Philippines mobile wallet',
            details: {
                number: '+639123456789',
                name: 'EventHorizon PH',
                reference: `EVENT-${Date.now().toString().slice(-6)}`
            }
        },
        {
            id: 'paymaya',
            name: 'PayMaya',
            icon: '/images/paymaya.png',
            description: 'Philippines digital wallet',
            details: {
                number: '+639987654321',
                name: 'EventHorizon PH',
                reference: `EVENT-${Date.now().toString().slice(-6)}`
            }
        },
        {
            id: 'upi',
            name: 'UPI',
            icon: '/images/upi.png',
            description: 'Indian Unified Payments Interface',
            details: {
                id: 'eventhorizon@upi',
                name: 'EventHorizon India',
                note: 'Use any UPI app to pay'
            }
        }
    ];

    const handlePaymentSelection = (methodId) => {
        setSelectedPayment(methodId);
        setTransactionId('');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmitPayment = () => {
        if (!transactionId.trim()) {
            alert('Please enter your transaction ID/reference');
            return;
        }
        setIsVerifying(true);
        setShowPaymentModal(true);
        setVerificationStarted(true);
    };

    const handleContinueShopping = () => {
        router.push('/');
    };

    if (orderComplete) {
        return (
            <>
                <Header />
                <main className="pt-24 px-4 sm:px-6 max-w-4xl mx-auto pb-12">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheck className="h-10 w-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Verified!</h1>
                        <p className="text-gray-600 mb-8">
                            Thank you for your payment. Your tickets have been confirmed.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mb-8">
                            <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
                            {cart.map(item => (
                                <div key={item.cartKey} className="flex justify-between py-2 border-b border-gray-100">
                                    <span>{item.title} ({item.type}) × {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between font-bold pt-2">
                                <span>Total</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleContinueShopping}
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </main>
            </>
        );
    }

    const selectedMethod = paymentMethods.find(method => method.id === selectedPayment);

    return (
        <>
            <Header />
            <main className="pt-24 px-4 sm:px-6 max-w-4xl mx-auto pb-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
                >
                    <FiChevronLeft className="mr-1" />
                    Back to Cart
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Order Summary */}
                    <div className="md:w-2/5">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.cartKey} className="flex items-start">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 mr-4"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                                            <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(item.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">${item.price} × {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Service Fee</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Tax</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
                                    <span>Total</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="md:w-3/5">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {paymentMethods.map(method => (
                                    <div
                                        key={method.id}
                                        onClick={() => handlePaymentSelection(method.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === method.id
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center mr-4">
                                                <Image
                                                    src={method.icon}
                                                    alt={method.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{method.name}</h3>
                                                <p className="text-sm text-gray-500">{method.description}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id
                                                ? 'bg-purple-500 border-purple-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {selectedPayment === method.id && (
                                                    <FiCheck className="h-3 w-3 text-white" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Details */}
                        {selectedPayment && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                                <h3 className="font-medium text-gray-900 mb-4">Payment Instructions</h3>

                                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                                    <p className="text-purple-700 font-medium">Please send exactly <span className="font-bold">${totalAmount.toFixed(2)}</span> using the details below</p>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(selectedMethod.details).map(([key, value]) => (
                                        key === 'qrCode' ? (
                                            <div key={key} className="flex flex-col items-center">
                                                <div className="w-48 h-48 bg-white p-2 border border-gray-200 rounded-lg mb-2">
                                                    <Image
                                                        src={value}
                                                        alt="Payment QR Code"
                                                        width={192}
                                                        height={192}
                                                        className="object-contain"
                                                    />
                                                </div>
                                                <p className="text-sm text-gray-500 capitalize">{selectedMethod.details.note}</p>
                                            </div>
                                        ) : (
                                            <div key={key} className="flex justify-between items-center">
                                                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                <div className="flex items-center">
                                                    <span className="font-medium">{value}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(value)}
                                                        className="ml-2 text-purple-600 hover:text-purple-800"
                                                        title="Copy to clipboard"
                                                    >
                                                        <FiCopy className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter your Transaction ID/Reference:
                                    </label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="e.g. bank reference, PayPal transaction ID"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This helps us verify your payment quickly
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <FiLock className="mr-2 text-purple-500" />
                                <span>Your payment is secure and encrypted</span>
                            </div>
                            <button
                                onClick={handleSubmitPayment}
                                disabled={!selectedPayment || !transactionId.trim()}
                                className={`w-full ${(!selectedPayment || !transactionId.trim())
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                                    } text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center`}
                            >
                                <FiCreditCard className="mr-2" />
                                Verify Payment
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Processing Modal */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    {isVerifying ? (
                                        <svg className="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <FiCheck className="h-10 w-10 text-purple-600" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {isVerifying ? 'Verifying Payment' : 'Payment Verified!'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {isVerifying
                                        ? 'We are verifying your payment. This may take up to 30 minutes.'
                                        : 'Your payment has been successfully verified!'}
                                </p>

                                {isVerifying && (
                                    <>
                                        <div className="flex items-center justify-center text-purple-600 mb-4">
                                            <FiClock className="mr-2" />
                                            <span className="font-medium">Time remaining: {formatTime(timeLeft)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                            <div
                                                className="bg-purple-600 h-2.5 rounded-full"
                                                style={{ width: `${((1800 - timeLeft) / 1800) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-6">
                                            You can safely close this window. We'll notify you by email when verification is complete.
                                        </p>
                                    </>
                                )}

                                {!isVerifying ? (
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsVerifying(false);
                                            setVerificationStarted(false);
                                            setShowPaymentModal(false);
                                        }}
                                        className="mt-4 flex items-center justify-center text-gray-600 hover:text-gray-800"
                                    >
                                        <FiArrowLeft className="mr-1" />
                                        Back to payment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Copied notification */}
                {copied && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
                        Copied to clipboard!
                    </div>
                )}
            </main>
        </>
    );
};

export default CheckoutPage;