import { useState } from "react";

export default function Procedures({ procedures, onCreate, onDelete }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, price: parseFloat(price) });
    setName("");
    setPrice("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-purple-700">Procedimientos</h2>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border rounded px-2 py-1"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
          Añadir
        </button>
      </form>

      <ul className="space-y-2">
        {procedures.map((p) => (
          <li key={p.id} className="p-3 bg-white rounded shadow flex justify-between">
            <div>{p.name} — ${p.price}</div>
            <button
              onClick={() => onDelete(p.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}