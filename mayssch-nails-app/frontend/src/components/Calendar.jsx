export default function Calendar({ appointments, onSelectDate, selectedDate, month, year }) {
  const slots = ["08:00", "10:00", "13:00", "15:00", "17:00"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Lista de feriados Paraguay 2026 (con traslados)
  const feriados = [
    new Date(2026, 0, 1),   // 1 enero
    new Date(2026, 2, 2),   // 2 marzo (traslado Día de los Héroes)
    new Date(2026, 3, 2),   // 2 abril Jueves Santo
    new Date(2026, 3, 3),   // 3 abril Viernes Santo
    new Date(2026, 4, 1),   // 1 mayo Día del Trabajador
    new Date(2026, 4, 14),  // 14 mayo Independencia
    new Date(2026, 4, 15),  // 15 mayo Independencia
    new Date(2026, 5, 12),  // 12 junio Paz del Chaco
    new Date(2026, 5, 22),  // 22 junio (traslado Jura Constitución)
    new Date(2026, 7, 15),  // 15 agosto Fundación de Asunción
    new Date(2026, 8, 28),  // 28 septiembre (traslado Batalla Boquerón)
    new Date(2026, 11, 8),  // 8 diciembre Virgen de Caacupé
    new Date(2026, 11, 25), // 25 diciembre Navidad
  ];

  const getAppointmentsForDay = (day) =>
    appointments.filter(
      (appt) =>
        new Date(appt.date_time).getDate() === day &&
        new Date(appt.date_time).getMonth() === month &&
        new Date(appt.date_time).getFullYear() === year
    );

  return (
    <div>
      <div className="grid grid-cols-7 gap-3 text-center">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div
            key={d}
            className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 tracking-wide"
          >
            {d}
          </div>
        ))}

        {days.map((day) => {
          const dateObj = new Date(year, month, day);
          const isSelected =
            selectedDate && dateObj.toDateString() === selectedDate.toDateString();

          const isHoliday = feriados.some(
            (f) => f.toDateString() === dateObj.toDateString()
          );

          const appointmentsForDay = getAppointmentsForDay(day);

          return (
            <div
              key={day}
              onClick={() => onSelectDate(dateObj)}
              className={`cursor-pointer rounded-xl border p-3 shadow-md transition transform hover:scale-105
                ${
                  isHoliday
                    ? "bg-red-100 border-red-400 text-red-700"
                    : isSelected
                    ? "bg-gradient-to-r from-pink-200 to-purple-200 border-purple-500"
                    : "bg-white hover:bg-pink-50 border-gray-200"
                }`}
            >
              {/* Número del día */}
              <div className="font-bold text-gray-700 text-lg tracking-wide">
                {day}
              </div>

              {/* Indicadores de horarios */}
              <div className="flex justify-center space-x-1 mt-2">
                {slots.map((slot) => {
                  const taken = appointmentsForDay.some((appt) => {
                    const apptTime = new Date(appt.date_time).toLocaleTimeString(
                      "es-ES",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      }
                    );
                    return apptTime === slot;
                  });

                  return (
                    <span
                      key={slot}
                      className={`w-3 h-3 rounded-full ${
                        taken ? "bg-pink-500" : "bg-green-400"
                      }`}
                      title={slot}
                    ></span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}