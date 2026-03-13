import { formatGuaranies } from "../utils/currency";

export default function AppointmentsList({ appointments, onUpdateStatus, onDelete }) {
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
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      postponed: "bg-orange-50 text-orange-700 border-orange-200",
      completed: "bg-green-50 text-green-700 border-green-200",
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Pendiente",
      confirmed: "Confirmada",
      postponed: "Pospuesta",
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
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Citas de hoy</h2>
        <p className="text-sm text-gray-500 mt-1">
          {today.toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {todayAppointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-400">No hay citas para hoy</p>
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
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
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
                        <span className="text-lg font-bold text-pink-600">{formatGuaranies(totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  {appt.status !== "completed" && (
                    <>
                      <select
                        value={appt.status}
                        onChange={(e) => onUpdateStatus(appt.id, e.target.value)}
                        className="flex-1 min-w-[150px] px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="postponed">Pospuesta</option>
                      </select>
                      <button
                        onClick={() => onUpdateStatus(appt.id, "completed")}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm"
                      >
                        ✓ Finalizar
                      </button>
                    </>
                  )}
                  {appt.status === "completed" && (
                    <div className="flex-1 text-center py-2 text-green-600 font-medium text-sm">
                      Cita finalizada
                    </div>
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
