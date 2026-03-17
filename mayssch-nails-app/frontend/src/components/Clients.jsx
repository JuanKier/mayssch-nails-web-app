import { useState } from "react";
import Modal from "./Modal";
import { formatGuaranies } from "../utils/currency";

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

  const formatPhone = (phone) => {
    // Remove all non-digits
    let digits = phone.replace(/\D/g, '');
    
    // If starts with 0 (Paraguay mobile), convert to +595 format
    // 09xxxxxxxx -> +5959xxxxxxxx
    if (digits.startsWith('09') && digits.length >= 10) {
      return '+595' + digits;
    }
    
    // If starts with 9 and has 9 digits total, add +595
    // 9xxxxxxxx -> +5959xxxxxxxx
    if (digits.startsWith('9') && digits.length >= 9) {
      return '+595' + digits;
    }
    
    // If starts with +595, validate and fix
    if (digits.startsWith('595')) {
      return '+' + digits;
    }
    
    // If starts with 595 without +, add it
    if (digits.startsWith('595')) {
      return '+' + digits;
    }
    
    // If input is already in format +5959xxxxxxxx, return as is
    if (phone.startsWith('+595') && phone.length === 14) {
      return phone;
    }
    
    // Return as is if doesn't match Paraguay format
    return phone;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-purple-600">Clientas</h2>

      {/* Formulario para añadir nueva clienta */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm sm:text-base flex-1 bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100/50 transition"
        />
        <input
          type="tel"
          placeholder="0981 234 567"
          value={contact}
          onChange={(e) => setContact(formatPhone(e.target.value))}
          onBlur={(e) => setContact(formatPhone(e.target.value))}
          required
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm sm:text-base flex-1 bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100/50 transition"
        />
        <button
          type="submit"
          className="bg-emerald-500 text-white px-4 py-2.5 text-sm sm:text-base rounded-xl hover:bg-emerald-600 hover:scale-105 transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md"
        >
          Añadir
        </button>
      </form>

      {/* Lista de clientas */}
      <ul className="space-y-3 md:space-y-4">
        {clients
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((c) => (
          <li
            key={c.id}
            className="p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-pink-200 dark:hover:border-pink-600"
          >
            {editingId === c.id ? (
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Nombre"
                />
                <input
                  type="tel"
                  value={editContact}
                  onChange={(e) => setEditContact(formatPhone(e.target.value))}
                  onBlur={(e) => setEditContact(formatPhone(e.target.value))}
                  className="border dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Teléfono"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(c.id)}
                    className="bg-emerald-500 text-white px-4 py-2 text-sm rounded-xl hover:bg-emerald-600 hover:scale-105 transition-all duration-200 shadow-sm"
                  >
                    ✓ Guardar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 text-sm rounded-xl hover:bg-gray-600 hover:scale-105 transition-all duration-200 shadow-sm"
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => onUpdate(c.id, { name: e.target.value })}
                      className="w-full border dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium"
                    />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="tel"
                      value={c.contact}
                      onChange={(e) => onUpdate(c.id, { contact: formatPhone(e.target.value) })}
                      onBlur={(e) => onUpdate(c.id, { contact: formatPhone(e.target.value) })}
                      className="flex-1 border dark:border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                    <a
                      href={`https://wa.me/${c.contact.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-sm"
                      title="Enviar WhatsApp"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="bg-blue-500 text-white px-4 py-2 text-sm rounded-xl hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-sm"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 text-white px-4 py-2 text-sm rounded-xl hover:bg-red-600 hover:scale-105 transition-all duration-200 shadow-sm"
                  >
                    🗑️ Eliminar
                  </button>
                  <button
                    onClick={() => setOpenHistory(c.id)}
                    className="bg-purple-500 text-white px-4 py-2 text-sm rounded-xl hover:bg-purple-600 hover:scale-105 transition-all duration-200 shadow-sm"
                  >
                    📅 Historial
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Modal de historial */}
      {openHistory && (
        <Modal onClose={() => setOpenHistory(null)}>
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-purple-700 dark:text-purple-300">
              Historial de {clients.find((c) => c.id === openHistory)?.name}
            </h3>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {appointments
                .filter((a) => a.client_name === clients.find((c) => c.id === openHistory)?.name)
                .sort((a, b) => new Date(a.date_time) - new Date(b.date_time))
                .map((appt) => {
                  const totalPrice = appt.services?.reduce((sum, s) => sum + (s.procedure_price * s.quantity), 0) || 0;
                  return (
                    <li
                      key={appt.id}
                      className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow text-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold text-purple-700 dark:text-purple-300">
                            {new Date(appt.date_time).toLocaleDateString("es-ES")}
                          </span>{" "}
                          <span className="text-gray-500 dark:text-gray-400">
                            {new Date(appt.date_time).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.status === 'completed' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {appt.status === 'completed' ? 'Finalizada' : 'Pendiente'}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {appt.services?.map(s => s.procedure_name).join(', ')}
                        {totalPrice > 0 && ` - ${formatGuaranies(totalPrice)}`}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}
