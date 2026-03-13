import { useState } from "react";
import { formatGuaranies } from "../utils/currency";

export default function Procedures({ procedures, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, price: parseFloat(price) });
    setName("");
    setPrice("");
  };

  const handleEdit = (procedure) => {
    setEditingId(procedure.id);
    setEditName(procedure.name);
    setEditPrice(procedure.price.toString());
  };

  const handleSaveEdit = (id) => {
    onUpdate(id, { name: editName, price: parseFloat(editPrice) });
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-purple-700">Procedimientos</h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded-lg px-3 py-2 text-sm sm:text-base flex-1"
        />
        <input
          type="number"
          placeholder="Precio (Gs)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="1000"
          className="border rounded-lg px-3 py-2 text-sm sm:text-base flex-1"
        />
        <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 text-sm sm:text-base rounded hover:bg-green-700 whitespace-nowrap"
        >
          Añadir
        </button>
      </form>

      <ul className="space-y-3 md:space-y-4">
        {procedures.map((p) => (
          <li key={p.id} className="p-3 sm:p-4 bg-white rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            {editingId === p.id ? (
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border rounded px-2 py-1 text-sm sm:text-base flex-1"
                />
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  min="0"
                  step="1000"
                  className="border rounded px-2 py-1 text-sm sm:text-base w-24"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(p.id)}
                    className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-3 py-1 text-sm rounded hover:bg-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 flex-1 items-center">
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => onUpdate(p.id, { name: e.target.value })}
                  className="border rounded px-2 py-1 text-sm sm:text-base flex-1"
                />
                <div className="text-sm sm:text-base font-semibold text-gray-700">
                  {formatGuaranies(p.price)}
                </div>
              </div>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              {editingId !== p.id && (
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-600 text-white px-3 py-1 text-sm sm:text-base rounded hover:bg-blue-700 flex-1 sm:flex-none"
                >
                  Editar
                </button>
              )}
              <button
                onClick={() => onDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 text-sm sm:text-base rounded hover:bg-red-700 flex-1 sm:flex-none"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
