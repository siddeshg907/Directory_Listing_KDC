import React, { useState, useEffect } from 'react';
import ProductTable from '../components/ProductTable';
import AddProducts from '../components/AddProducts';
import Modal from '../components/Modal';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique product types from the last word of the title and materials
        const productTypesSet = new Set();
        const materialsSet = new Set();
        data.forEach(product => {
          const productType = product.title.split(' ').slice(-1)[0];
          productTypesSet.add(productType);
          materialsSet.add(product.material);
        });
        setProductTypes(Array.from(productTypesSet));
        setMaterials(Array.from(materialsSet));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedProduct = await response.json();
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === id ? { ...product, ...updatedProduct } : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = () => {
    const filtered = products.filter(product =>
      (selectedProduct === '' || product.title.split(' ').slice(-1)[0] === selectedProduct) &&
      (selectedMaterial === '' || product.material === selectedMaterial)
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleOpenModal}
        >
          + Add Products
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 mr-2"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="bg-blue-500 text-white py-2 px-4 rounded">Search</button>
      </div>
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <select
            className="border p-2"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">All Products</option>
            {productTypes.map((productType, index) => (
              <option key={index} value={productType}>{productType}</option>
            ))}
          </select>
          <select
            className="border p-2"
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="">All Materials</option>
            {materials.map((material, index) => (
              <option key={index} value={material}>{material}</option>
            ))}
          </select>
          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleFilter}>
            Filter
          </button>
        </div>
      </div>
      <ProductTable products={filteredProducts} onUpdate={handleUpdate} />
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <AddProducts onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default Home;
