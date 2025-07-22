import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { servicesAPI } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const Services = () => {
  const { addItem } = useCart();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // Get category from URL params if available
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');

    // Map URL categories to internal categories
    const categoryMap = {
      'dry-cleaning': 'suits',
      'premium-laundry': 'shirts',
      'bridal-wear': 'traditional',
      'home-essentials': 'home-essentials'
    };

    if (categoryParam && categoryMap[categoryParam]) {
      setSelectedCategory(categoryMap[categoryParam]);
    } else if (categoryParam && ['suits', 'shirts', 'traditional', 'home-essentials'].includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Load services and categories
  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await servicesAPI.getAll();
      console.log('Services API response:', response); // Debug log
      setServices(response.data.services);
    } catch (error) {
      console.error('Failed to load services:', error);
      setError('Failed to load services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await servicesAPI.getCategories();
      console.log('Categories API response:', response); // Debug log
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory);

  const handleAddToCart = async (service) => {
    try {
      console.log('Adding service to cart:', service); // Debug log
      await addItem({
        id: service._id,
        name: service.name,
        price: service.price,
        category: service.category,
        processingTime: service.processingTime
      });
      
      // Show alert message
      alert(`${service.name} added to cart - ₹${service.price}`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const categoryOptions = [
    { id: 'all', name: 'All Services', icon: '✨' },
    { id: 'suits', name: 'Suits & Formal', icon: '👔' },
    { id: 'shirts', name: 'Shirts & Tops', icon: '👕' },
    { id: 'traditional', name: 'Traditional Wear', icon: '👑' },
    { id: 'home-essentials', name: 'Home Essentials', icon: '🏠' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading services..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <ErrorMessage 
            message={error} 
            onRetry={loadServices}
          />
        </div>
      </div>
    );
  }

   return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Professional laundry and dry cleaning services with transparent pricing
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map(service => (
            <div key={service._id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>⏱️ {service.processingTime}</span>
                  <span className="capitalize">📂 {service.category}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ₹{service.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    per item
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(service)}
                  className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No services found in this category.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Service Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pickup & Delivery</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Free pickup and delivery within city limits</li>
                <li>• Same-day pickup available (before 2 PM)</li>
                <li>• Express delivery available for urgent orders</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quality Guarantee</h3>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• 100% satisfaction guarantee</li>
                <li>• Damage protection for all items</li>
                <li>• Eco-friendly cleaning products</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Services;