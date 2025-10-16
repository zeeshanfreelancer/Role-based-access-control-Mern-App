import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/Products.css";

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add new product (Admin only)
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return alert("All fields required");
    await api.post("/products", newProduct);
    setNewProduct({ name: "", price: "" });
    fetchProducts();
  };

  // Update product (Admin or Manager)
  const handleUpdate = async (id) => {
    await api.put(`/products/${id}`, { name: editingProduct.name, price: editingProduct.price });
    setEditingProduct(null);
    fetchProducts();
  };

  // Delete product (Admin only)
  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <>
      <Navbar />
      <div className="products-page">
        <h2>Products</h2>

        {user?.role === "admin" && (
          <form className="add-form" onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <button type="submit">Add Product</button>
          </form>
        )}

        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price ($)</th>
              {user?.role !== "manager" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {editingProduct?._id === p._id ? (
                    <input
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td>
                  {editingProduct?._id === p._id ? (
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: e.target.value })
                      }
                    />
                  ) : (
                    p.price
                  )}
                </td>
                <td>
                  {editingProduct?._id === p._id ? (
                    <>
                      <button onClick={() => handleUpdate(p._id)}>Save</button>
                      <button onClick={() => setEditingProduct(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditingProduct(p)}>Edit</button>
                      {user?.role === "admin" && (
                        <button onClick={() => handleDelete(p._id)}>Delete</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
