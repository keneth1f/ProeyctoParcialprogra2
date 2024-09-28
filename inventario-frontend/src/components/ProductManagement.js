import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [disponible, setDisponible] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // Obtener todos los productos al cargar el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos", error);
    }
  };

  // Manejar la creación o edición de un producto
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newProduct = { nombre, descripcion, precio, disponible };

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:8080/api/productos/${editingProduct.id}`, newProduct);
      } else {
        await axios.post("http://localhost:8080/api/productos", newProduct);
      }

      // Reiniciar el formulario
      setNombre("");
      setDescripcion("");
      setPrecio(0);
      setDisponible(true);
      setEditingProduct(null);
      fetchProductos(); // Refrescar la lista de productos
    } catch (error) {
      console.error("Error al guardar el producto", error);
    }
  };

  // Manejar la edición de un producto
  const handleEdit = (product) => {
    setEditingProduct(product);
    setNombre(product.nombre);
    setDescripcion(product.descripcion);
    setPrecio(product.precio);
    setDisponible(product.disponible);
  };

  // Manejar la eliminación de un producto
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/productos/${id}`);
      fetchProductos(); // Refrescar la lista de productos
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Precio</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Disponible</label>
          <input
            type="checkbox"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
          />
        </div>
        <button type="submit">{editingProduct ? "Actualizar" : "Agregar"}</button>
      </form>

      <h3>Lista de Productos</h3>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - {producto.descripcion} - ${producto.precio} -{" "}
            {producto.disponible ? "Disponible" : "No Disponible"}
            <button onClick={() => handleEdit(producto)}>Editar</button>
            <button onClick={() => handleDelete(producto.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagement;