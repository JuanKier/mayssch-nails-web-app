import { useState, useEffect } from "react";
import { formatGuaranies } from "../utils/currency";

export default function AppointmentForm({ date, appointment, onSubmit, appointments, clients = [], procedures = [], onCreateClient, defaultTime }) {
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [status, setStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [time, setTime] = useState("");
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);
  const [selectedProcedureId, setSelectedProcedureId] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const predefinedTimes = ["08:00", "10:00", "13:00", "15:00", "17:00"];

  // Load appointment data when editing
  useEffect(() => {
    if (appointment) {
      setClientName(appointment.client_name || "");
      setClientContact(appointment.client_contact || "");
      
      // Load services with proper structure
      if (appointment.services && appointment.services.length > 0) {
        setSelectedServices(appointment.services.map(s => ({
          id: s.procedure_id || s.id,
          procedure_id: s.procedure_id || s.id,
          procedure_name: s.procedure_name || s.name,
          procedure_price: s.procedure_price || s.price,
          name: s.procedure_name || s.name,
          price: s.procedure_price || s.price,
          quantity: s.quantity || 1
        })));
      }
      
      setStatus(appointment.status || "pending");
      setPaymentMethod(appointment.payment_method || "efectivo");
      const [, timePart] = (appointment.date_time || "").split(' ');
      setTime(timePart ? timePart.substring(0, 5) : "");
    }
  }, [appointment]);

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
    setShowClientDropdown(true);

    const existing = clients.find((c) => c.name === name);
    if (existing) {
      setClientContact(existing.contact);
      setIsNewClient(false);
    } else {
      setClientContact("");
      setIsNewClient(true);
    }
  };

  const selectClient = (client) => {
    setClientName(client.name);
    setClientContact(client.contact);
    setIsNewClient(false);
    setShowClientDropdown(false);
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

    // Validación: si es finalizada, debe tener método de pago
    if (status === 'completed' && !paymentMethod) {
      alert("Debes seleccionar un método de pago (Efectivo/Banco)");
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${time}:00`;

    // Verificar si ya hay una cita a esta hora (excluyendo la cita actual si es edición)
    const conflictingAppointment = appointments.find((appt) => {
      if (appointment && appt.id === appointment.id) return false; // Ignorar la cita actual al editar
      if (!appt.date_time) return false;
      return appt.date_time === dateTimeString;
    });

    if (conflictingAppointment) {
      alert(`Ya existe una cita a las ${time}. Puedes editar la cita de ${conflictingAppointment.client_name}.`);
      return;
    }

    if (isNewClient && clientName && clientContact) {
      onCreateClient({ name: clientName, contact: clientContact });
    }

    onSubmit({
      ...(appointment ? { id: appointment.id } : {}),
      client_name: clientName,
      client_contact: clientContact,
      status,
      payment_method: paymentMethod,
      date_time: dateTimeString,
      services: selectedServices.map((s) => ({
        procedure_id: s.procedure_id || s.id,
        procedure_name: s.procedure_name || s.name,
        procedure_price: s.procedure_price || s.price,
        quantity: s.quantity,
      })),
    });

    setClientName("");
    setClientContact("");
    setSelectedServices([]);
    setStatus("pending");
    setPaymentMethod("efectivo");
    setTime("");
    setIsNewClient(false);
    setShowClientDropdown(false);
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
        <h2 className="text-2xl font-semibold text-gray-900">{appointment ? 'Editar cita' : 'Nueva cita'}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {date.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
          <input
            type="text"
            value={clientName}
            onChange={handleClientChange}
            onFocus={() => setShowClientDropdown(true)}
            placeholder="Nombre de la clienta"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100/50 transition bg-white"
            required
          />
          
          {/* Dropdown de clientes */}
          {showClientDropdown && clientName.length < 3 && clients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {clients
                .filter((c) => c.name.toLowerCase().includes(clientName.toLowerCase()))
                .map((c) => (
                  <div
                    key={c.id}
                    onClick={() => selectClient(c)}
                    className="px-4 py-3 hover:bg-pink-50 cursor-pointer transition border-b border-gray-100 last:border-0"
                  >
                    <div className="font-medium text-gray-900">{c.name}</div>
                    <div className="text-sm text-gray-500">{c.contact}</div>
                  </div>
                ))}
            </div>
          )}
          
          {isNewClient && (
            <input
              type="tel"
              value={clientContact}
              onChange={(e) => setClientContact(formatPhone(e.target.value))}
              onBlur={(e) => setClientContact(formatPhone(e.target.value))}
              placeholder="0981 234 567"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100/50 transition mt-3 bg-white"
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
              className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 hover:scale-105 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
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
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-pink-500">{formatGuaranies(totalPrice)}</span>
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
                    className={`py-3 rounded-xl font-medium transition-all duration-200 ${
                      time === t
                        ? "bg-pink-500 text-white shadow-lg shadow-pink-300/50 hover:scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
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
          </select>
        </div>

        {/* Método de pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Método de pago</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("efectivo")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                paymentMethod === "efectivo"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              💵 Efectivo
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("banco")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                paymentMethod === "banco"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🏦 Banco
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-pink-300/50 transition-all duration-300 hover:scale-[1.02]"
        >
          {appointment ? 'Actualizar cita' : 'Guardar cita'}
        </button>
      </form>

      {/* Citas del día */}
      {!appointment && appointmentsForDate.length > 0 && (
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
