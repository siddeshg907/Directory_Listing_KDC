import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/Slices/productsSlice';

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
          title: product.title,
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
      const response = await fetch(`https://directory-api.onrender.com/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });
      if (response.ok) {
        dispatch(fetchProducts());
        setExpandedRow(null);
      } else {
        console.error('Failed to update product:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    setExpandedRow(null);
  };

  return (
    <div className="overflow-x-auto">
      {products.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-3xl font-bold">No products available</div>
      ) : (
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
                      <div className="flex items-center">
                      <select
                        name="currency"
                        className="border rounded-l-full px-4 py-2 bg-white border-gray-300 "
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                      <input
                        type="text"
                        name="price"
                        value={editData.price}
                        onChange={handleInputChange}
                        className="border-t border-b border-gray-300 rounded-none px-1 py-2 flex-1 w-10"
                      />
                      <select
                        name="unit"
                        className="border rounded-r-full px-4 py-2 bg-slate-400 text-white font-bold"
                      >
                        <option value="KG">KG</option>
                        <option value="MTR">MTR</option>
                      </select>
                    </div>
                    ) : (
                      `${item.price}/KG`
                    )}
                  </td>
                </tr>
                {expandedRow === item.id && (
                  <tr>
                    <td colSpan="4" className="py-2 px-4 border-b bg-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <label className="block mb-1 w-1/3">Material:</label>
                          <input
                            type="text"
                            name="material"
                            value={editData.material}
                            onChange={handleInputChange}
                            className="border p-2 rounded-full w-2/3"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="block mb-1 w-1/3">Shape:</label>
                          <input
                            type="text"
                            name="shape"
                            value={editData.shape}
                            onChange={handleInputChange}
                            className="border p-2 rounded-full w-2/3"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="block mb-1 w-1/3">Length:</label>
                          <input
                            type="text"
                            name="length"
                            value={editData.length}
                            onChange={handleInputChange}
                            className="border p-2 rounded-full w-2/3"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="block mb-1 w-1/3">Thickness:</label>
                          <input
                            type="text"
                            name="thickness"
                            value={editData.thickness}
                            onChange={handleInputChange}
                            className="border p-2 rounded-full w-2/3"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="block mb-1 w-1/3">Surface Finish:</label>
                          <input
                            type="text"
                            name="surfaceFinish"
                            value={editData.surfaceFinish}
                            onChange={handleInputChange}
                            className="border p-2 rounded-full w-2/3"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="block mb-1 w-1/3">Outside Dia.:</label>
                          <input
                            type="text"
                            name="outsideDia"
                            value={editData.outsideDia}
                            onChange={handleInputChange}
                            className="border p-2 rounded-full w-2/3"
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
      )}
    </div>
  );
};

export default ProductTable;
