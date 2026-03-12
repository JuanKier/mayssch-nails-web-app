import { useState } from "react";
import Modal from "./Modal"; // 👈 reutilizamos tu componente modal

export default function Clients({ clients, appointments, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [openHistory, setOpenHistory] = useState(null); // 👈 id de clienta cuyo historial está abierto

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, contact });
    setName("");
    setContact("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-purple-700">Clientas</h2>

      {/* Formulario para añadir nueva clienta */}
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
          type="text"
          placeholder="Contacto"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Añadir
        </button>
      </form>

      {/* Lista de clientas */}
      <ul className="space-y-4">
        {clients.map((c) => (
          <li
            key={c.id}
            className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
          >
            <div className="flex space-x-2 items-center">
              <input
                type="text"
                value={c.name}
                onChange={(e) => onUpdate(c.id, { name: e.target.value })}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                value={c.contact}
                onChange={(e) => onUpdate(c.id, { contact: e.target.value })}
                className="border rounded px-2 py-1"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onDelete(c.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
              <button
                onClick={() => setOpenHistory(c.id)}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
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
            <h3 className="text-lg font-bold text-purple-700">
              Historial de {clients.find((c) => c.id === openHistory)?.name}
            </h3>
            <ul className="space-y-2">
              {appointments
                .filter((a) => a.client_name === clients.find((c) => c.id === openHistory)?.name)
                .map((appt) => (
                  <li
                    key={appt.id}
                    className="p-2 bg-white rounded shadow text-sm"
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