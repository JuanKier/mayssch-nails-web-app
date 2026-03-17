import { formatGuaranies } from "../utils/currency";

export default function AppointmentsList({ appointments, onUpdateStatus, onDelete, onEdit }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAppointments = appointments.filter((appt) => {
    if (!appt.date_time) return false;
    const dateStr = appt.date_time.split(' ')[0];
    const [year, month, day] = dateStr.split('-').map(Number);
    const apptDate = new Date(year, month - 1, day);
    apptDate.setHours(0, 0, 0, 0);
    return apptDate.getTime() === today.getTime();
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pendiente",
      completed: "Finalizada",
    };
    return labels[status] || "Pendiente";
  };

  const getTotalPrice = (services) => {
    if (!services || services.length === 0) return 0;
    return services.reduce((sum, s) => sum + (s.procedure_price * s.quantity), 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">Citas de hoy</h2>
        <p className="text-white/80 mt-1">
          {today.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-3xl font-bold">{todayAppointments.length}</span>
          <span className="text-white/80">citas agendadas</span>
        </div>
      </div>

      {todayAppointments.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-pink-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-7xl mb-4">💅</div>
          <p className="text-gray-500 font-medium text-lg">No hay citas para hoy</p>
          <p className="text-gray-400 text-sm mt-2">Selecciona una fecha del calendario para agendar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayAppointments.map((appt) => {
            const totalPrice = getTotalPrice(appt.services);
            const [, timePart] = appt.date_time.split(' ');
            const timeStr = timePart ? timePart.substring(0, 5) : '';

            return (
              <div
                key={appt.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-pink-100/50 transition-all duration-300 hover:border-pink-200 animate-fade-in"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{appt.client_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appt.status)}`}>
                        {getStatusLabel(appt.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {timeStr}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {appt.client_contact}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Servicios */}
                {appt.services && appt.services.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Servicios</div>
                    <div className="space-y-2">
                      {appt.services.map((service, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            {service.procedure_name} {service.quantity > 1 && `× ${service.quantity}`}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatGuaranies(service.procedure_price * service.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-pink-500">{formatGuaranies(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  {appt.status === "completed" ? (
                    <div className="flex-1 text-center py-2 text-green-600 font-medium text-sm bg-green-100 dark:bg-green-900/30 rounded-lg">
                      ✓ Finalizada
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          // Verificar que tenga servicios y método de pago
                          if (!appt.services || appt.services.length === 0) {
                            alert("No se puede finalizar: la cita no tiene servicios registrados. Edita la cita para agregar servicios.");
                            return;
                          }
                          if (!appt.payment_method) {
                            alert("No se puede finalizar: la cita no tiene método de pago. Edita la cita para seleccionar Efectivo/Banco.");
                            return;
                          }
                          onUpdateStatus(appt.id, "completed");
                        }}
                        className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 hover:scale-105 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                      >
                        ✓ Finalizar
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(appt)}
                        className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition text-sm"
                      >
                        ✏️ Editar
                      </button>
                    </>
                  )}
                  {appt.payment_method && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appt.payment_method === 'efectivo' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {appt.payment_method === 'efectivo' ? '💵 Efectivo' : '🏦 Banco'}
                    </span>
                  )}
                  <button
                    onClick={() => onDelete(appt.id)}
                    className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
