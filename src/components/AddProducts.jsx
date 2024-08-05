import React, { useState, useEffect } from 'react';

const AddProducts = ({ onAddProduct }) => {
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedGrades, setSelectedGrades] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://directory-api.onrender.com/Lists');
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleProductChange = (product) => {
    setSelectedProduct(product.name);
    setSelectedMaterial(''); // Reset selected material and grade when product changes
    setSelectedGrades(new Set());
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterial(material.name);
    setSelectedGrades(new Set()); // Reset selected grades when material changes
  };

  const handleGradeChange = (grade) => {
    setSelectedGrades(prevGrades => {
      const newGrades = new Set(prevGrades);
      if (newGrades.has(grade)) {
        newGrades.delete(grade);
      } else {
        newGrades.add(grade);
      }
      return newGrades;
    });
  };

  const handleSubmit = async () => {
    if (selectedProduct && selectedMaterial && selectedGrades.size > 0) {
      const gradesArray = Array.from(selectedGrades);
      
      try {
        // Use Promise.all to handle multiple asynchronous operations
        await Promise.all(gradesArray.map(async (grade) => {
          const newProduct = {
            id: Date.now().toString() + '-' + grade, // Append grade to ensure unique IDs
            title: grade,
            price: 350,
            material: selectedMaterial,
            shape: '',
            length: '',
            thickness: '',
            surfaceFinish: '',
            outsideDia: ''
          };
  
          const response = await fetch('https://directory-api.onrender.com/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
          });
  
          if (!response.ok) {
            throw new Error('Error adding product');
          }
        }));
  
        alert('Products added successfully!');
        onAddProduct(); // Call the callback function to refresh the product list
      } catch (error) {
        console.error('Error adding products:', error);
        alert('Error adding products. Please try again.');
      }
    } else {
      alert('Please select a product, material, and at least one grade.');
    }
  };

  const getProductMaterials = (productName) => {
    const product = productData.find(product => product.name === productName);
    return product ? product.materials : [];
  };

  const allMaterials = productData.flatMap(product => product.materials);
  const productMaterials = getProductMaterials(selectedProduct);
  const grades = productMaterials.find(material => material.name === selectedMaterial)?.grades || [];

  return (
    <div className="flex flex-col h-full">
      <h1 className='text-xl font-bold mb-2'>Add Product</h1>
      <div className="flex-grow flex overflow-hidden">
        {/* Products List */}
        <div className="w-1/3 border-r border-gray-200 overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-4">
            <h2 className="text-lg font-semibold mb-2">Products</h2>
          </div>
          <div className="overflow-y-auto max-h-[80vh] p-4">
            <ul className="list-none pl-0">
              {productData.map((product) => (
                <li key={product.id}>
                  <button
                    className={`block w-full text-left px-4 py-2 mb-1 rounded ${selectedProduct === product.name ? 'bg-blue-300 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
                    onClick={() => handleProductChange(product)}
                  >
                    {product.name} {selectedProduct === product.name ? `(${product.materials.length})` : ''}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Materials List */}
        <div className="w-1/3 border-r border-gray-200 overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-4">
            <h2 className="text-lg font-semibold mb-2">Materials</h2>
          </div>
          <div className="overflow-y-auto max-h-[80vh] p-4">
            <ul className="list-none pl-0">
              {allMaterials
                .filter((material, index, self) => self.findIndex(mat => mat.name === material.name) === index)
                .map((material) => (
                  <li key={material.id}>
                    <button
                      className={`block w-full text-left px-4 py-2 mb-1 rounded ${selectedMaterial === material.name ? 'bg-blue-300 text-white' : 'text-blue-500 hover:bg-blue-100'}`}
                      onClick={() => handleMaterialChange(material)}
                    >
                      {material.name} {selectedProduct && (productData.find(product => product.materials.some(mat => mat.name === material.name)) ? `(${productData.find(product => product.name === selectedProduct)?.materials.find(mat => mat.name === material.name)?.grades.length || 0})` : '')}
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        {/* Grades List */}
        <div className="w-1/3 overflow-hidden">
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-4">
            <h2 className="text-lg font-semibold mb-2">Grades</h2>
          </div>
          <div className="overflow-y-auto max-h-[80vh] p-4">
            <ul className="list-none pl-0">
              {grades.length > 0 ? (
                grades.map((grade, index) => (
                  <li key={index} className="flex items-center py-1">
                    <input
                      type="checkbox"
                      checked={selectedGrades.has(grade)}
                      onChange={() => handleGradeChange(grade)}
                      className="mr-2"
                    />
                    <label>{grade}</label>
                  </li>
                ))
              ) : (
                <li>No grades available</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="p-2 border-t border-gray-200 bg-white flex justify-center ">
        <button
          className="bg-blue-500 text-white px-10 py-3 rounded-lg  "
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddProducts;
