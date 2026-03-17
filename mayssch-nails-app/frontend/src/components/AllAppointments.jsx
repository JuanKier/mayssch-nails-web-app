import { useState } from "react";
import { formatGuaranies } from "../utils/currency";

export default function AllAppointments({ appointments, procedures, clients, onUpdate, onDelete, onEdit }) {
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getTotalPrice = (services) => {
    if (!services || services.length === 0) return 0;
    return services.reduce((sum, s) => sum + (s.procedure_price * s.quantity), 0);
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (!appt.date_time) return false;
    const datePart = appt.date_time.split(' ')[0];
    const matchesDate = !filterDate || datePart === filterDate;
    const matchesStatus = filterStatus === "all" || appt.status === filterStatus;
    return matchesDate && matchesStatus;
  }).sort((a, b) => {
    if (!a.date_time || !b.date_time) return 0;
    return new Date(a.date_time.replace(' ', 'T')) - new Date(b.date_time.replace(' ', 'T'));
  });

  const groupedByDate = filteredAppointments.reduce((acc, appt) => {
    const [datePart] = appt.date_time.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const date = dateObj.toLocaleDateString("es-ES", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(appt);
    return acc;
  }, {});

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Todas las citas</h2>
        <p className="text-sm text-gray-500 mt-1">Gestiona y filtra todas tus citas</p>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Finalizada</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterDate("");
                setFilterStatus("all");
              }}
              className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-900">{filteredAppointments.length}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-700">
            {filteredAppointments.filter(a => a.status === "completed").length}
          </div>
          <div className="text-sm text-green-600">Finalizadas</div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-700">
            {filteredAppointments.filter(a => a.status === "confirmed").length}
          </div>
          <div className="text-sm text-blue-600">Confirmadas</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-700">
            {filteredAppointments.filter(a => a.status === "pending").length}
          </div>
          <div className="text-sm text-yellow-600">Pendientes</div>
        </div>
      </div>

      {/* Lista de citas agrupadas */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-400">No se encontraron citas</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, appts]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{date}</h3>
              <div className="space-y-3">
                {appts.map((appt) => {
                  const [, timePart] = appt.date_time.split(' ');
                  const timeStr = timePart ? timePart.substring(0, 5) : '';
                  const totalPrice = getTotalPrice(appt.services);

                  return (
                    <div
                      key={appt.id}
                      className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{appt.client_name}</h4>
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
                                onUpdate(appt.id, "completed");
                              }}
                              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm"
                            >
                              ✓ Finalizar
                            </button>
                            <button
                              onClick={() => onEdit && onEdit(appt)}
                              className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition text-sm"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => onDelete(appt.id)}
                              className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition text-sm"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
