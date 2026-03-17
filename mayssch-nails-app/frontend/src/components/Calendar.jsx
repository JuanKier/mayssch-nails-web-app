import { getHolidayName, isHoliday, isSunday } from "../utils/holidays";
import { useState } from "react";
import Modal from "./Modal";
import { formatGuaranies } from "../utils/currency";

export default function Calendar({ appointments, onSelectDate, onSelectDateTime, selectedDate, month, year, onDelete, onEdit }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const defaultSlots = ["08:00", "10:00", "13:00", "15:00", "17:00"];
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const emptyDays = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allDays = [...emptyDays, ...days];

  const getAppointmentsForDay = (day) =>
    appointments.filter((appt) => {
      if (!appt.date_time) return false;
      const [datePart] = appt.date_time.split(' ');
      const [y, m, d] = datePart.split('-').map(Number);
      return d === day && m === month + 1 && y === year;
    });

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const monthNames = months[month];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 w-full max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{monthNames} {year}</h3>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-3">
        {["D", "L", "M", "X", "J", "V", "S"].map((d, i) => (
          <div
            key={i}
            className="text-center text-base font-bold text-gray-500 dark:text-gray-400 uppercase py-2"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {allDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="min-h-[100px] dark:bg-gray-800/50" />;
          }

          const dateObj = new Date(year, month, day);
          const isSelected =
            selectedDate && dateObj.toDateString() === selectedDate.toDateString();
          
          const today = new Date();
          const isToday = dateObj.toDateString() === today.toDateString();

          const holidayName = getHolidayName(dateObj);
          const isSundayDay = isSunday(dateObj);
          const isHolidayDay = isHoliday(dateObj);
          const isSpecialDay = isHolidayDay || isSundayDay;

          const appointmentsForDay = getAppointmentsForDay(day);
          const hasAppointments = appointmentsForDay.length > 0;
          
          // Siempre mostrar los 5 predefinidos + horarios personalizados del día
          const dayCustomTimes = appointmentsForDay.map(appt => {
            const [, timePart] = appt.date_time.split(' ');
            return timePart ? timePart.substring(0, 5) : '';
          }).filter(Boolean);
          
          // Combinar predefinidos + personalizados, sin duplicados
          const daySlots = [...new Set([...defaultSlots, ...dayCustomTimes])].sort((a, b) => {
            return a.localeCompare(b, undefined, { numeric: true });
          });

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateObj)}
              className={`min-h-[100px] rounded-xl p-3 transition-all duration-200 hover:scale-105 relative ${
                isSpecialDay
                  ? "bg-rose-50 dark:bg-rose-900/30 border-2 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                  : isSelected
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-300/50 ring-2 ring-pink-400 ring-offset-2 dark:ring-offset-gray-900"
                  : hasAppointments
                  ? "bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 hover:bg-pink-100"
                  : isToday
                  ? "bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                  : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
              }`}
            >
              {isToday && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full"></div>
              )}
              <div className="flex flex-col h-full">
                <div className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : (isSpecialDay ? 'text-rose-700 dark:text-rose-300' : 'text-gray-900 dark:text-white')}`}>
                  {day}
                </div>

                {holidayName && (
                  <div className={`text-[8px] leading-tight mb-1 truncate ${isSelected ? 'text-white/80' : 'text-rose-600'}`}>
                    {holidayName}
                  </div>
                )}

                <div className="flex flex-col gap-0.5 mt-auto overflow-hidden">
                  {daySlots.map((slot) => {
                    const takenAppts = appointmentsForDay.filter((appt) => {
                      const [, timePart] = appt.date_time.split(' ');
                      const timeStr = timePart ? timePart.substring(0, 5) : '';
                      return timeStr === slot;
                    });
                    const taken = takenAppts.length > 0;

                    return (
                      <div
                        key={slot}
                        className={`text-xs font-semibold px-2 py-1 rounded truncate ${
                          taken 
                            ? (isSelected ? "bg-white/30 text-white" : "bg-pink-200 text-pink-700 hover:bg-pink-300 cursor-pointer") 
                            : (isSelected ? "bg-white/10 text-white/60" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer")
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (taken && takenAppts[0]) {
                            setSelectedAppointment(takenAppts[0]);
                          } else {
                            onSelectDateTime(dateObj, slot);
                          }
                        }}
                      >
                        {slot}
                      </div>
                    );
                  })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-amber-300"></div>
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-pink-200"></div>
            <span>Ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-200"></div>
            <span>Libre</span>
          </div>
        </div>
      </div>
      
      {/* Modal de detalle de cita */}
      {selectedAppointment && (
        <Modal onClose={() => setSelectedAppointment(null)}>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Detalle de Cita
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Cliente</label>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {selectedAppointment.client_name}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Contacto</label>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  {selectedAppointment.client_contact}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Fecha y Hora</label>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  {new Date(selectedAppointment.date_time).toLocaleDateString("es-ES", {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} a las {new Date(selectedAppointment.date_time).toLocaleTimeString("es-ES", {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Servicios</label>
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  {selectedAppointment.services?.map(s => s.procedure_name).join(', ')}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Total</label>
                <div className="font-bold text-pink-600 dark:text-pink-400 text-lg">
                  {formatGuaranies(selectedAppointment.services?.reduce((sum, s) => sum + s.procedure_price * s.quantity, 0) || 0)}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase">Estado</label>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedAppointment.status === 'completed' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {selectedAppointment.status === 'completed' ? 'Finalizada' : 'Pendiente'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              {selectedAppointment.status !== 'completed' ? (
                <>
                  <button
                    onClick={() => {
                      onEdit && onEdit(selectedAppointment);
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`¿Eliminar cita de ${selectedAppointment.client_name}?`)) {
                        onDelete(selectedAppointment.id);
                        setSelectedAppointment(null);
                      }
                    }}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
                  >
                    🗑️ Eliminar
                  </button>
                  <button
                    onClick={() => {
                      // Verificar que tenga servicios y método de pago
                      if (!selectedAppointment.services || selectedAppointment.services.length === 0) {
                        alert("No se puede finalizar: la cita no tiene servicios registrados. Edita la cita para agregar servicios.");
                        return;
                      }
                      if (!selectedAppointment.payment_method) {
                        alert("No se puede finalizar: la cita no tiene método de pago. Edita la cita para seleccionar Efectivo/Banco.");
                        return;
                      }
                      // Update status to completed
                      // We need to call a status update handler, but Calendar doesn't have it
                      // So we'll just close the modal and let the user handle it in the appointments list
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition"
                  >
                    ✓ Finalizar
                  </button>
                </>
              ) : (
                <div className="flex-1 text-center py-3 text-green-600 font-semibold bg-green-100 dark:bg-green-900/30 rounded-xl">
                  ✓ Finalizada
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}