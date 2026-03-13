import { useState } from "react";
import { formatGuaranies } from "../utils/currency";

export default function AppointmentForm({ date, onSubmit, appointments, clients = [], procedures = [], onCreateClient }) {
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [status, setStatus] = useState("pending");
  const [time, setTime] = useState("");
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);
  const [selectedProcedureId, setSelectedProcedureId] = useState("");

  const predefinedTimes = ["08:00", "10:00", "13:00", "15:00", "17:00"];

  if (!(date instanceof Date)) {
    return (
      <div className="text-gray-400 text-center py-8">
        Selecciona una fecha en el calendario
      </div>
    );
  }

  const handleClientChange = (e) => {
    const name = e.target.value;
    setClientName(name);

    const existing = clients.find((c) => c.name === name);
    if (existing) {
      setClientContact(existing.contact);
      setIsNewClient(false);
    } else {
      setClientContact("");
      setIsNewClient(true);
    }
  };

  const addService = () => {
    if (selectedProcedureId) {
      const procedure = procedures.find((p) => p.id === parseInt(selectedProcedureId));
      if (procedure) {
        const exists = selectedServices.find((s) => s.id === procedure.id);
        if (exists) {
          setSelectedServices(
            selectedServices.map((s) =>
              s.id === procedure.id ? { ...s, quantity: s.quantity + 1 } : s
            )
          );
        } else {
          setSelectedServices([...selectedServices, { ...procedure, quantity: 1 }]);
        }
        setSelectedProcedureId("");
      }
    }
  };

  const removeService = (id) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setSelectedServices(
      selectedServices.map((s) =>
        s.id === id ? { ...s, quantity: parseInt(quantity) || 1 } : s
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      alert("Debes agregar al menos un servicio");
      return;
    }

    if (!time) {
      alert("Debes seleccionar una hora");
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${time}:00`;

    if (isNewClient && clientName && clientContact) {
      onCreateClient({ name: clientName, contact: clientContact });
    }

    onSubmit({
      client_name: clientName,
      client_contact: clientContact,
      status,
      date_time: dateTimeString,
      services: selectedServices.map((s) => ({
        procedure_id: s.id,
        procedure_name: s.name,
        procedure_price: s.price,
        quantity: s.quantity,
      })),
    });

    setClientName("");
    setClientContact("");
    setSelectedServices([]);
    setStatus("pending");
    setTime("");
    setIsNewClient(false);
  };

  const appointmentsForDate = appointments.filter((appt) => {
    if (!appt.date_time) return false;
    const [datePart] = appt.date_time.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const apptDate = new Date(year, month - 1, day);
    return apptDate.toDateString() === date.toDateString();
  });

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price * s.quantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Nueva cita</h2>
        <p className="text-sm text-gray-500 mt-1">
          {date.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
          <input
            type="text"
            value={clientName}
            onChange={handleClientChange}
            list="clients-list"
            placeholder="Nombre de la clienta"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition"
            required
          />
          <datalist id="clients-list">
            {clients.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>

          {isNewClient && (
            <input
              type="text"
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              placeholder="Teléfono de contacto"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition mt-3"
              required
            />
          )}
        </div>

        {/* Servicios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Servicios</label>
          
          <div className="flex gap-2 mb-4">
            <select
              value={selectedProcedureId}
              onChange={(e) => setSelectedProcedureId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition"
            >
              <option value="">Selecciona un servicio</option>
              {procedures.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatGuaranies(p.price)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addService}
              className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition font-medium"
            >
              Agregar
            </button>
          </div>

          {selectedServices.length > 0 ? (
            <div className="space-y-2">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{formatGuaranies(service.price)}</div>
                  </div>
                  <input
                    type="number"
                    value={service.quantity}
                    onChange={(e) => updateQuantity(service.id, e.target.value)}
                    min="1"
                    className="w-16 px-3 py-2 rounded-lg border border-gray-200 text-center"
                  />
                  <div className="font-semibold text-gray-900 min-w-[100px] text-right">
                    {formatGuaranies(service.price * service.quantity)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeService(service.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-pink-600">{formatGuaranies(totalPrice)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
              No hay servicios seleccionados
            </div>
          )}
        </div>

        {/* Hora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
          
          {!useCustomTime ? (
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2">
                {predefinedTimes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`py-3 rounded-xl font-medium transition ${
                      time === t
                        ? "bg-pink-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setUseCustomTime(true)}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                Usar hora personalizada
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition"
              />
              <button
                type="button"
                onClick={() => {
                  setUseCustomTime(false);
                  setTime("");
                }}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                ← Volver a horas predefinidas
              </button>
            </div>
          )}
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition"
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="postponed">Pospuesta</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
        >
          Guardar cita
        </button>
      </form>

      {/* Citas del día */}
      {appointmentsForDate.length > 0 && (
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Citas de este día ({appointmentsForDate.length})
          </h3>
          <div className="space-y-2">
            {appointmentsForDate.map((appt) => {
              const [, timePart] = appt.date_time.split(' ');
              const timeStr = timePart ? timePart.substring(0, 5) : '';
              
              return (
                <div key={appt.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{appt.client_name}</div>
                      <div className="text-sm text-gray-500">
                        {appt.services?.map(s => s.procedure_name).join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{timeStr}</div>
                      <div className="text-xs text-gray-500">{appt.status}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
