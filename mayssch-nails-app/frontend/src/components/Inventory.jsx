import { useState } from "react";
import { formatGuaranies } from "../utils/currency";

export default function Inventory({ inventory, onCreate, onUpdate, onDelete }) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("esmaltes");
  const [quantity, setQuantity] = useState("");
  const [minStock, setMinStock] = useState("5");
  const [unitPrice, setUnitPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editCategory, setEditCategory] = useState("esmaltes");
  const [editQuantity, setEditQuantity] = useState("");
  const [editMinStock, setEditMinStock] = useState("5");
  const [editUnitPrice, setEditUnitPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      product_name: productName,
      category,
      quantity: parseInt(quantity) || 0,
      min_stock: parseInt(minStock) || 5,
      unit_price: parseFloat(unitPrice) || 0,
    });
    setProductName("");
    setCategory("esmaltes");
    setQuantity("");
    setMinStock("5");
    setUnitPrice("");
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditProductName(item.product_name);
    setEditCategory(item.category);
    setEditQuantity(item.quantity.toString());
    setEditMinStock(item.min_stock.toString());
    setEditUnitPrice(item.unit_price.toString());
  };

  const handleSaveEdit = (id) => {
    onUpdate(id, {
      product_name: editProductName,
      category: editCategory,
      quantity: parseInt(editQuantity) || 0,
      min_stock: parseInt(editMinStock) || 5,
      unit_price: parseFloat(editUnitPrice) || 0,
    });
    setEditingId(null);
    setEditProductName("");
    setEditCategory("esmaltes");
    setEditQuantity("");
    setEditMinStock("5");
    setEditUnitPrice("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditProductName("");
    setEditCategory("esmaltes");
    setEditQuantity("");
    setEditMinStock("5");
    setEditUnitPrice("");
  };

  // Calcular valor total del inventario
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  // Contar productos en bajo stock
  const lowStockCount = inventory.filter((item) => item.quantity <= item.min_stock).length;

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-700">
        📦 Control de Stock
      </h2>

      {/* Resumen del inventario */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-4 rounded-xl shadow">
          <div className="text-2xl md:text-3xl font-bold text-teal-700">{inventory.length}</div>
          <div className="text-xs sm:text-sm text-teal-600">Total Productos</div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl shadow">
          <div className="text-2xl md:text-3xl font-bold text-blue-700">{formatGuaranies(totalValue)}</div>
          <div className="text-xs sm:text-sm text-blue-600">Valor Total</div>
        </div>
        <div className={`p-4 rounded-xl shadow ${lowStockCount > 0 ? "bg-orange-100" : "bg-green-100"}`}>
          <div className={`text-2xl md:text-3xl font-bold ${lowStockCount > 0 ? "text-orange-700" : "text-green-700"}`}>
            {lowStockCount}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Bajo Stock</div>
        </div>
      </div>

      {/* Formulario para añadir nuevo producto */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="border rounded-lg px-3 py-2 text-sm sm:text-base flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm sm:text-base"
        >
          <option value="esmaltes">Esmaltes</option>
          <option value="insumos">Insumos</option>
          <option value="herramientas">Herramientas</option>
          <option value="otros">Otros</option>
        </select>
        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          required
          className="border rounded-lg px-3 py-2 text-sm sm:text-base w-24"
        />
        <input
          type="number"
          placeholder="Precio Unit. (Gs)"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          min="0"
          step="1000"
          required
          className="border rounded-lg px-3 py-2 text-sm sm:text-base w-24"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 text-sm sm:text-base rounded hover:bg-teal-700 whitespace-nowrap"
        >
          Añadir
        </button>
      </form>

      {/* Lista de productos */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-teal-100">
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-center">Categoría</th>
              <th className="p-2 text-center">Cantidad</th>
              <th className="p-2 text-center">Mínimo</th>
              <th className="p-2 text-right">Precio Unit.</th>
              <th className="p-2 text-right">Valor Total</th>
              <th className="p-2 text-center">Estado</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const isLowStock = item.quantity <= item.min_stock;
              const totalValue = item.quantity * item.unit_price;
              return (
                <tr key={item.id} className={`border-b ${isLowStock ? "bg-orange-50" : ""}`}>
                  {editingId === item.id ? (
                    <>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editProductName}
                          onChange={(e) => setEditProductName(e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        >
                          <option value="esmaltes">Esmaltes</option>
                          <option value="insumos">Insumos</option>
                          <option value="herramientas">Herramientas</option>
                          <option value="otros">Otros</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          min="0"
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editMinStock}
                          onChange={(e) => setEditMinStock(e.target.value)}
                          min="0"
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editUnitPrice}
                          onChange={(e) => setEditUnitPrice(e.target.value)}
                          min="0"
                          step="1000"
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="p-2 text-right font-semibold">
                        {formatGuaranies(parseFloat(editQuantity) * parseFloat(editUnitPrice || 0))}
                      </td>
                      <td className="p-2 text-center">
                        {parseInt(editQuantity) <= parseInt(editMinStock) ? (
                          <span className="px-2 py-1 bg-orange-200 text-orange-700 rounded text-xs">Bajo Stock</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-200 text-green-700 rounded text-xs">Disponible</span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="bg-green-600 text-white px-2 py-1 text-xs rounded hover:bg-green-700"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-2 py-1 text-xs rounded hover:bg-gray-600"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2 font-medium">{item.product_name}</td>
                      <td className="p-2 text-center">{item.category}</td>
                      <td className={`p-2 text-center font-semibold ${isLowStock ? "text-orange-600" : "text-gray-700"}`}>
                        {item.quantity}
                      </td>
                      <td className="p-2 text-center">{item.min_stock}</td>
                      <td className="p-2 text-right">{formatGuaranies(item.unit_price)}</td>
                      <td className="p-2 text-right font-semibold">{formatGuaranies(totalValue)}</td>
                      <td className="p-2 text-center">
                        {isLowStock ? (
                          <span className="px-2 py-1 bg-orange-200 text-orange-700 rounded text-xs">Bajo Stock</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-200 text-green-700 rounded text-xs">Disponible</span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => onDelete(item.id)}
                            className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
