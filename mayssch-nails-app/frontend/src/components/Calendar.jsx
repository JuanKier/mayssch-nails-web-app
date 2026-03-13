import { getHolidayName, isHoliday, isSunday } from "../utils/holidays";

export default function Calendar({ appointments, onSelectDate, selectedDate, month, year }) {
  const slots = ["08:00", "10:00", "13:00", "15:00", "17:00"];
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

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide py-2"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {allDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateObj = new Date(year, month, day);
          const isSelected =
            selectedDate && dateObj.toDateString() === selectedDate.toDateString();

          const holidayName = getHolidayName(dateObj);
          const isSundayDay = isSunday(dateObj);
          const isHolidayDay = isHoliday(dateObj);
          const isSpecialDay = isHolidayDay || isSundayDay;

          const appointmentsForDay = getAppointmentsForDay(day);

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateObj)}
              className={`aspect-square rounded-xl p-2 transition-all hover:scale-105 ${
                isSpecialDay
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : isSelected
                  ? "bg-pink-100 border-2 border-pink-400 shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <div className="flex flex-col h-full">
                <div className={`text-sm font-semibold mb-1 ${isSpecialDay ? 'text-red-700' : 'text-gray-900'}`}>
                  {day}
                </div>

                {holidayName && (
                  <div className="text-[8px] text-red-600 leading-tight mb-1">
                    {holidayName}
                  </div>
                )}

                <div className="flex flex-wrap gap-0.5 justify-center mt-auto">
                  {slots.map((slot) => {
                    const taken = appointmentsForDay.some((appt) => {
                      const [, timePart] = appt.date_time.split(' ');
                      const timeStr = timePart ? timePart.substring(0, 5) : '';
                      return timeStr === slot;
                    });

                    return (
                      <div
                        key={slot}
                        className={`w-1.5 h-1.5 rounded-full ${
                          taken ? "bg-pink-400" : "bg-gray-300"
                        }`}
                        title={slot}
                      />
                    );
                  })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}