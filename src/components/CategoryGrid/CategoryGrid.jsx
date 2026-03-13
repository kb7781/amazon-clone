import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../services/api';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded shadow-sm p-4 animate-pulse">
            <div className="w-full h-32 bg-gray-200 rounded mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/products?category=${cat.id}`}
          className="bg-white rounded shadow-sm p-4 hover:shadow-md transition-shadow group"
        >
          <div className="w-full h-32 mb-3 overflow-hidden rounded">
            <img
              src={cat.image_url}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h3 className="font-semibold text-sm text-center text-gray-900 group-hover:text-amazon transition-colors">
            {cat.name}
          </h3>
        </Link>
      ))}
    </div>
  );
}
