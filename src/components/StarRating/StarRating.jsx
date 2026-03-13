import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

/**
 * StarRating component
 * @param {number} rating - 0 to 5
 * @param {number} count  - review count
 * @param {string} size   - 'sm' | 'md' | 'lg'
 */
export default function StarRating({ rating = 0, count, size = 'sm' }) {
  const stars = [];
  const fullStars  = Math.floor(rating);
  const halfStar   = rating % 1 >= 0.4;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const iconSize = size === 'lg' ? 20 : size === 'md' ? 16 : 13;

  for (let i = 0; i < fullStars; i++)  stars.push(<FaStar  key={`f${i}`} size={iconSize} className="star-filled" />);
  if (halfStar)                         stars.push(<FaStarHalfAlt key="h" size={iconSize} className="star-filled" />);
  for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`e${i}`} size={iconSize} className="star-empty" />);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {count !== undefined && (
        <span className="text-blue-600 text-xs hover:underline cursor-pointer">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
