import { useState } from "react";
import Modal from "./Modal";

export default function Clients({ clients, appointments, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [openHistory, setOpenHistory] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate({ name, contact });
    setName("");
    setContact("");
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setEditName(client.name);
    setEditContact(client.contact);
  };

  const handleSaveEdit = async (id) => {
    await onUpdate(id, { name: editName, contact: editContact });
    setEditingId(null);
    setEditName("");
    setEditContact("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditContact("");
  };

  const handleDelete = async (id) => {
    await onDelete(id);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-purple-700">Clientas</h2>

      {/* Formulario para añadir nueva clienta */}
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
          type="text"
          placeholder="Contacto"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          className="border rounded-lg px-3 py-2 text-sm sm:text-base flex-1"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 text-sm sm:text-base rounded hover:bg-green-700 whitespace-nowrap"
        >
          Añadir
        </button>
      </form>

      {/* Lista de clientas */}
      <ul className="space-y-3 md:space-y-4">
        {clients.map((c) => (
          <li
            key={c.id}
            className="p-3 sm:p-4 bg-white rounded-lg shadow flex flex-col sm:flex-row sm:justify-between gap-3"
          >
            {editingId === c.id ? (
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border rounded px-2 py-1 text-sm sm:text-base flex-1"
                />
                <input
                  type="text"
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  className="border rounded px-2 py-1 text-sm sm:text-base flex-1"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(c.id)}
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
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => onUpdate(c.id, { name: e.target.value })}
                  className="border rounded px-2 py-1 text-sm sm:text-base flex-1"
                />
                <input
                  type="text"
                  value={c.contact}
                  onChange={(e) => onUpdate(c.id, { contact: e.target.value })}
                  className="border rounded px-2 py-1 text-sm sm:text-base flex-1"
                />
              </div>
            )}
            <div className="flex gap-2">
              {editingId !== c.id && (
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-blue-600 text-white px-3 py-1 text-sm sm:text-base rounded hover:bg-blue-700 flex-1 sm:flex-none"
                >
                  Editar
                </button>
              )}
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-600 text-white px-3 py-1 text-sm sm:text-base rounded hover:bg-red-700 flex-1 sm:flex-none"
              >
                Eliminar
              </button>
              <button
                onClick={() => setOpenHistory(c.id)}
                className="bg-purple-600 text-white px-3 py-1 text-sm sm:text-base rounded hover:bg-purple-700 flex-1 sm:flex-none"
              >
                Historial
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de historial */}
      {openHistory && (
        <Modal onClose={() => setOpenHistory(null)}>
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-purple-700">
              Historial de {clients.find((c) => c.id === openHistory)?.name}
            </h3>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {appointments
                .filter((a) => a.client_name === clients.find((c) => c.id === openHistory)?.name)
                .map((appt) => (
                  <li
                    key={appt.id}
                    className="p-2 sm:p-3 bg-white rounded shadow text-xs sm:text-sm"
                  >
                    <span className="font-semibold text-purple-700">
                      {new Date(appt.date_time).toLocaleDateString("es-ES")}
                    </span>{" "}
                    — {new Date(appt.date_time).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    — {appt.procedure_type} —{" "}
                    <span className="italic">{appt.status}</span>
                  </li>
                ))}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}
