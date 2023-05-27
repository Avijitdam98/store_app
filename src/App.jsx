import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((json) => {
        setProducts(json);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, []);
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBuyNow = (product) => {
    alert(`Buying ${product.title}`);
    setCartItems([...cartItems, product]);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  const handleToggleDescription = (productId) => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            showFullDescription: !product.showFullDescription,
          };
        }
        return product;
      });
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === null || product.category === selectedCategory)
  );

  const groupProductsByCategory = () => {
    const groupedProducts = {};

    products.forEach((product) => {
      if (groupedProducts[product.category]) {
        groupedProducts[product.category].push(product);
      } else {
        groupedProducts[product.category] = [product];
      }
    });

    return groupedProducts;
  };

  const groupedProducts = groupProductsByCategory();

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="category-buttons">
        <button
          className={selectedCategory === null ? 'active' : ''}
          onClick={() => handleCategoryClick(null)}
        >
          All
        </button>
        {Object.keys(groupedProducts).map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-container">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product">
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            <div className="description">
              {product.showFullDescription ? (
                <p>{product.description}</p>
              ) : (
                <p>{product.description.slice(0, 100)}...</p>
              )}
              <button
                className="toggle-description"
                onClick={() => handleToggleDescription(product.id)}
              >
                {product.showFullDescription ? 'Less' : 'More'}
              </button>
            </div>
            <div className="category">
              <p>Category: {product.category}</p>
              <img src={product.image} alt={product.image} />
            </div>
            <div className="rate">
              <p>Rate: {product.rating.rate}</p>
            </div>
            <button className="buy-now" onClick={() => handleBuyNow(product)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.title}{' '}
                <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
