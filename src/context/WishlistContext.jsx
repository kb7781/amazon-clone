import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(
    () => JSON.parse(localStorage.getItem('amazonWishlist')) || []
  );

  useEffect(() => {
    localStorage.setItem('amazonWishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isWishlisted = (id) => wishlistItems.some((i) => i.id === id);

  const toggleWishlist = (product) => {
    if (isWishlisted(product.id)) {
      setWishlistItems((prev) => prev.filter((i) => i.id !== product.id));
      toast('Removed from wishlist', { icon: '💔' });
    } else {
      setWishlistItems((prev) => [...prev, product]);
      toast('Added to wishlist!', { icon: '❤️' });
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
