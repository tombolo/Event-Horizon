import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiDollarSign } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const Header = ({ cart = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Fetch user balance when session changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (session?.user?.email) {
        setBalanceLoading(true);
        try {
          const response = await fetch('/api/user/balance');
          const data = await response.json();
          if (response.ok) {
            setUserBalance(data.balance);
          } else {
            console.error('Failed to fetch balance:', data.error);
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        } finally {
          setBalanceLoading(false);
        }
      } else {
        setUserBalance(null);
      }
    };

    fetchBalance();
  }, [session]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = async () => {
    setIsLoading(true);
    try {
      if (session) {
        await signOut({ callbackUrl: '/' });
      } else {
        await signIn('credentials', { callbackUrl: '/' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (balance: number | null) => {
    if (balance === null) return '--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(balance);
  };

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo & Brand Name */}
          <motion.div
            onClick={() => router.push('/')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md"
              >
                <span className="text-lg">EH</span>
              </motion.div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EventHorizon
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="font-medium text-gray-700 hover:text-purple-600 transition flex items-center group"
            >
              Concerts
              <span className="ml-1 text-purple-500 opacity-0 group-hover:opacity-100 transition">→</span>
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="font-medium text-gray-700 hover:text-purple-600 transition flex items-center group"
            >
              Sports
              <span className="ml-1 text-purple-500 opacity-0 group-hover:opacity-100 transition">→</span>
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="font-medium text-gray-700 hover:text-purple-600 transition flex items-center group"
            >
              Festivals
              <span className="ml-1 text-purple-500 opacity-0 group-hover:opacity-100 transition">→</span>
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="font-medium text-gray-700 hover:text-purple-600 transition flex items-center group"
            >
              Theater
              <span className="ml-1 text-purple-500 opacity-0 group-hover:opacity-100 transition">→</span>
            </motion.a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FiSearch className="h-5 w-5 text-gray-600" />
            </motion.button>
            <motion.button
              onClick={() => router.push('/cart')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition relative"
            >
              <FiShoppingCart className="h-5 w-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </motion.button>

            {status === 'loading' ? (
              <div className="animate-pulse h-10 w-24 rounded bg-gray-200"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {/* Balance Display */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center bg-gradient-to-r from-green-50 to-green-100 px-3 py-1.5 rounded-lg border border-green-200"
                >
                  <FiDollarSign className="text-green-600 mr-1.5" />
                  <span className="text-sm font-medium text-green-800">
                    {balanceLoading ? (
                      <span className="inline-block h-3 w-12 bg-green-200 rounded animate-pulse"></span>
                    ) : (
                      formatBalance(userBalance)
                    )}
                  </span>
                </motion.div>

                {/* User Profile */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="User profile"
                        width={32}
                        height={32}
                        className="rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
                        <FiUser className="h-4 w-4" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                      {session.user?.name || session.user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAuthClick}
                    disabled={isLoading}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing out...
                      </>
                    ) : (
                      <>
                        <FiLogOut className="mr-1" />
                        Sign Out
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAuthClick}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiUser className="mr-2" />
                    Sign In
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => router.push('/cart')}
              className="p-2 rounded-full hover:bg-gray-100 transition relative"
            >
              <FiShoppingCart className="h-5 w-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                Concerts
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                Sports
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                Festivals
              </motion.a>
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 border-b border-gray-100"
              >
                Theater
              </motion.a>

              <div className="pt-4 border-t border-gray-200">
                {status === 'authenticated' ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center px-3 py-2">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="User profile"
                          width={40}
                          height={40}
                          className="rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                          <FiUser className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-sm text-gray-500">{session.user?.email}</p>
                      </div>
                    </div>

                    {/* Mobile Balance Display */}
                    <div className="flex items-center justify-between px-3 py-2 bg-green-50 rounded-lg mx-2">
                      <div className="flex items-center">
                        <FiDollarSign className="text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Balance</span>
                      </div>
                      <span className="text-sm font-bold text-green-700">
                        {balanceLoading ? (
                          <span className="inline-block h-3 w-16 bg-green-200 rounded animate-pulse"></span>
                        ) : (
                          formatBalance(userBalance)
                        )}
                      </span>
                    </div>

                    <button
                      onClick={handleAuthClick}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing out...
                        </>
                      ) : (
                        <>
                          <FiLogOut className="mr-2" />
                          Sign Out
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuthClick}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <FiUser className="mr-2" />
                        Sign In
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;