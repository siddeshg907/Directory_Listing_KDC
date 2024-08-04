// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, updateProduct } from '../redux/Slices/productsSlice';
import ProductTable from '../components/ProductTable';
import AddProducts from '../components/AddProducts';
import Modal from '../components/Modal';

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.products);
  const status = useSelector(state => state.products.status);
  const error = useSelector(state => state.products.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products);

      const productTypesSet = new Set();
      const materialsSet = new Set();
      products.forEach(product => {
        if (product.title) {
          const productType = product.title.split(' ').slice(-1)[0];
          productTypesSet.add(productType);
        }
        if (product.material) {
          materialsSet.add(product.material);
        }
      });
      setProductTypes(Array.from(productTypesSet));
      setMaterials(Array.from(materialsSet));
    }
  }, [products]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = () => {
    const filtered = products.filter(product =>
      (selectedProduct === '' || (product.title && product.title.split(' ').slice(-1)[0] === selectedProduct)) &&
      (selectedMaterial === '' || product.material === selectedMaterial)
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const filtered = products.filter(product =>
      product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleUpdate = async (id, updatedData) => {
    await dispatch(updateProduct({ id, ...updatedData }));
  };

  const displayedProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleOpenModal}
          >
            + Add Products
          </button>
          
          <span className="ml-4 text-gray-700 border border-gray-300 rounded-full bg-color-white p-2">{filteredProducts.length}/100  Products</span>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="border p-2 mr-2"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="mb-4 flex items-center justify-between space-x-4">
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
        <div className="flex items-center space-x-2">
          <select className="border p-2">
            <option value="">Bulk Action</option>
            <option value="action1">Action 1</option>
            <option value="action2">Action 2</option>
          </select>
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            Apply
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <h3>{"Products"+" "}</h3>
          <select
            className="border p-2"
            value={displayCount}
            onChange={(e) => setDisplayCount(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>
      <ProductTable products={displayedProducts} onUpdate={handleUpdate} />
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <AddProducts onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default Home;
