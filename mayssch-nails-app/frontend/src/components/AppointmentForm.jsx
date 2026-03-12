import { useState } from "react";

export default function AppointmentForm({ date, onSubmit, appointments, clients = [], procedures = [], onCreateClient }) {
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [procedureId, setProcedureId] = useState("");
  const [status, setStatus] = useState("pending");
  const [time, setTime] = useState("");
  const [isNewClient, setIsNewClient] = useState(false);

  if (!(date instanceof Date)) {
    return (
      <div className="text-gray-500 text-center">
        Selecciona una fecha en el calendario para ver o agregar citas.
      </div>
    );
  }

  const handleClientChange = (e) => {
    const name = e.target.value;
    setClientName(name);

    const existing = clients.find((c) => c.name === name);
    if (existing) {
      setClientContact(existing.contact); // 👈 autocompleta contacto
      setIsNewClient(false);
    } else {
      setClientContact("");
      setIsNewClient(true); // 👈 pide contacto si es nuevo
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const [hours, minutes] = time.split(":");
    const fullDate = new Date(date);
    fullDate.setHours(hours);
    fullDate.setMinutes(minutes);

    const localISO = new Date(fullDate.getTime() - fullDate.getTimezoneOffset() * 60000).toISOString();

    const procedure = procedures.find((p) => p.id === parseInt(procedureId));

    // Si es cliente nuevo, lo guardamos primero en la DB
    if (isNewClient && clientName && clientContact) {
      onCreateClient({ name: clientName, contact: clientContact });
    }

    onSubmit({
      client_name: clientName,
      client_contact: clientContact,
      procedure_type: procedure?.name || "",
      status,
      date_time: localISO,
    });

    setClientName("");
    setClientContact("");
    setProcedureId("");
    setStatus("pending");
    setTime("");
    setIsNewClient(false);
  };

  const appointmentsForDate = appointments.filter(
    (appt) =>
      appt.date_time &&
      new Date(appt.date_time).toDateString() === date.toDateString()
  );

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
      >
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-700">
          Nueva cita para {date.toLocaleDateString()}
        </h2>

        {/* Cliente con autocomplete */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente</label>
          <input
            type="text"
            value={clientName}
            onChange={handleClientChange}
            list="clients-list"
            placeholder="Escribe nombre de clienta..."
            className="mt-1 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition"
            required
          />
          <datalist id="clients-list">
            {clients.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>

          {/* Solo pide contacto si es cliente nuevo */}
          {isNewClient && (
            <input
              type="text"
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              placeholder="Contacto"
              className="mt-2 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition"
              required
            />
          )}
        </div>

        {/* Procedimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Procedimiento</label>
          <select
            value={procedureId}
            onChange={(e) => setProcedureId(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="">Selecciona un procedimiento</option>
            {procedures.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ${p.price}
              </option>
            ))}
          </select>
        </div>

        {/* Hora */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Hora</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition"
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="postponed">Pospuesta</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg shadow-lg hover:scale-105 transform transition font-semibold"
        >
          Guardar cita
        </button>
      </form>

      {/* Lista de citas */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold text-purple-700 mb-4">
          Citas para {date.toLocaleDateString()}
        </h3>
        {appointmentsForDate.length === 0 ? (
          <p className="text-sm text-gray-500">No hay citas registradas.</p>
        ) : (
          <ul className="space-y-3">
            {appointmentsForDate.map((appt) => (
              <li
                key={appt.id}
                className="p-3 bg-white rounded-lg shadow hover:bg-purple-100 transition"
              >
                <span className="font-semibold text-purple-700">{appt.client_name}</span> ({appt.client_contact}) —{" "}
                <span className="text-pink-600">{appt.procedure_type}</span> —{" "}
                {new Date(appt.date_time).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })} — <span className="italic">{appt.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}