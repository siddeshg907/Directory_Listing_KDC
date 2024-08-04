// src/components/ProductTable.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProduct } from '../redux/Slices/productsSlice';

const ProductTable = ({ products }) => {
  const dispatch = useDispatch();
  const [expandedRow, setExpandedRow] = useState(null);
  const [editData, setEditData] = useState({
    material: '',
    shape: '',
    length: '',
    thickness: '',
    surfaceFinish: '',
    outsideDia: '',
    price: ''
  });

  const handleExpand = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
      const product = products.find(p => p.id === id);
      if (product) {
        setEditData({
          material: product.material || '',
          shape: product.shape || '',
          length: product.length || '',
          thickness: product.thickness || '',
          surfaceFinish: product.surfaceFinish || '',
          outsideDia: product.outsideDia || '',
          price: product.price || ''
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (id) => {
    try {
      dispatch(updateProduct({ id, ...editData }));
      // Collapse the row after update
      setExpandedRow(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    setExpandedRow(null);
  };

  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className='bg-blue-300'>
          <th className="py-2 px-4 border-b"><input type="checkbox"/> Products</th>
          <th className="py-2 px-4 border-b">Action</th>
          <th className="py-2 px-4 border-b">Product Details</th>
          <th className="py-2 px-4 border-b">Price in Unit</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item) => (
          <React.Fragment key={item.id}>
            <tr>
              <td className="py-2 px-4 border-b"><input type="checkbox" className='m-2'/>{item.title}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-blue-500 mr-2"
                  onClick={() => handleExpand(item.id)}
                >
                  {expandedRow === item.id ? 'Collapse' : 'Quick Edit'}
                </button>
                <span>{" | "}</span>
                <button
                  className="text-blue-500"
                  onClick={() => handleExpand(item.id)}
                >
                  Add Product Details
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                {`Material: ${item.material}, Unit Length: ${item.length}, Shape: ${item.shape}, Thickness: ${item.thickness}, Surface Finish: ${item.surfaceFinish}, Outside Dia.: ${item.outsideDia}`.slice(0, 60) + '...'}
              </td>
              <td className="py-2 px-4 border-b">
                {expandedRow === item.id ? (
                  <input
                    type="text"
                    name="price"
                    value={editData.price}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  `${item.price}/KG`
                )}
              </td>
            </tr>
            {expandedRow === item.id && (
              <tr>
                <td colSpan="4" className="py-2 px-4 border-b bg-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1">Material:</label>
                      <input
                        type="text"
                        name="material"
                        value={editData.material}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Shape:</label>
                      <input
                        type="text"
                        name="shape"
                        value={editData.shape}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Length:</label>
                      <input
                        type="text"
                        name="length"
                        value={editData.length}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Thickness:</label>
                      <input
                        type="text"
                        name="thickness"
                        value={editData.thickness}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Surface Finish:</label>
                      <input
                        type="text"
                        name="surfaceFinish"
                        value={editData.surfaceFinish}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Outside Dia.:</label>
                      <input
                        type="text"
                        name="outsideDia"
                        value={editData.outsideDia}
                        onChange={handleInputChange}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handleUpdate(item.id)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-gray-300 text-black px-4 py-2 rounded"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
