import { useState, useMemo } from "react";
import { formatGuaranies } from "../utils/currency";

export default function Reports({ appointments, procedures, inventory }) {
  const [viewType, setViewType] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedClient, setSelectedClient] = useState("");

  const clients = useMemo(() => {
    const uniqueClients = [...new Set(appointments.map((a) => a.client_name))];
    return uniqueClients.sort();
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (viewType === "client" && selectedClient) {
      return appointments.filter((a) => a.client_name === selectedClient);
    }
    
    return appointments.filter((appt) => {
      if (!appt.date_time) return false;
      const [datePart] = appt.date_time.split(' ');
      const [year, month, day] = datePart.split('-').map(Number);
      
      if (viewType === "day") {
        const selected = new Date(selectedDate);
        return (
          day === selected.getDate() &&
          month === selected.getMonth() + 1 &&
          year === selected.getFullYear()
        );
      } else {
        return (
          month === selectedMonth + 1 &&
          year === selectedYear
        );
      }
    }).sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
  }, [appointments, viewType, selectedMonth, selectedYear, selectedDate, selectedClient]);

  const stats = useMemo(() => {
    const total = filteredAppointments.length;
    const pending = filteredAppointments.filter((a) => a.status === "pending").length;
    const completed = filteredAppointments.filter((a) => a.status === "completed").length;

    // Solo calcular ingresos de citas finalizadas
    let totalRevenue = 0;
    const completedAppointments = filteredAppointments.filter((a) => a.status === "completed");
    
    completedAppointments.forEach((appt) => {
      appt.services?.forEach((service) => {
        const price = service.procedure_price || 0;
        totalRevenue += price * service.quantity;
      });
    });

    const byProcedure = {};
    completedAppointments.forEach((appt) => {
      appt.services?.forEach((service) => {
        const procName = service.procedure_name || 'Desconocido';
        if (!byProcedure[procName]) {
          byProcedure[procName] = { count: 0, revenue: 0 };
        }
        byProcedure[procName].count += service.quantity;
        const price = service.procedure_price || 0;
        byProcedure[procName].revenue += price * service.quantity;
      });
    });

    const byClient = {};
    completedAppointments.forEach((appt) => {
      const clientName = appt.client_name;
      if (!byClient[clientName]) {
        byClient[clientName] = { count: 0, revenue: 0, contact: appt.client_contact };
      }
      appt.services?.forEach((service) => {
        byClient[clientName].count += service.quantity;
        const price = service.procedure_price || 0;
        byClient[clientName].revenue += price * service.quantity;
      });
    });

    return {
      total,
      pending,
      completed,
      totalRevenue,
      byProcedure,
      byClient,
    };
  }, [filteredAppointments]);

  const exportToExcel = () => {
    const header = ["Fecha", "Hora", "Cliente", "Contacto", "Procedimiento", "Cantidad", "Precio", "Estado"];
    const rows = filteredAppointments.map((appt) => {
      const [datePart, timePart] = appt.date_time.split(' ');
      const [year, month, day] = datePart.split('-');
      const displayDate = `${day}/${month}/${year}`;
      const displayTime = timePart ? timePart.substring(0, 5) : '';
      
      return appt.services?.map((service) => {
        const price = service.procedure_price || 0;
        return [
          displayDate,
          displayTime,
          appt.client_name,
          appt.client_contact,
          service.procedure_name || 'Desconocido',
          service.quantity,
          formatGuaranies(price),
          appt.status,
        ];
      });
    }).flat();

    rows.push([]);
    rows.push(["RESUMEN"]);
    rows.push(["Total de citas", stats.total]);
    rows.push(["Confirmadas", stats.confirmed]);
    rows.push(["Pendientes", stats.pending]);
    rows.push(["Pospuestas", stats.postponed]);
    rows.push(["Finalizadas", stats.completed]);
    rows.push(["Ingresos totales", formatGuaranies(stats.totalRevenue)]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_${viewType}_${viewType === "day" ? selectedDate : (viewType === "client" ? selectedClient : `${selectedYear}-${selectedMonth + 1}`)}.csv`);
    link.click();
  };

  const exportToPDF = () => {
    const title = viewType === "day" 
      ? `Reporte del ${new Date(selectedDate).toLocaleDateString("es-ES")}`
      : viewType === "client"
      ? `Reporte de ${selectedClient}`
      : `Reporte de ${new Date(selectedYear, selectedMonth).toLocaleString("es-ES", { month: "long", year: "numeric" })}`;

    const printWindow = window.open("", "_blank");
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #9333ea; text-align: center; }
          h2 { color: #ec4899; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #9333ea; color: white; }
          .summary { background-color: #f3e8ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .summary-item { display: flex; justify-content: space-between; margin: 5px 0; }
          .total { font-weight: bold; font-size: 1.2em; color: #9333ea; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h1>Mayssch Nails - ${title}</h1>
        <div class="summary">
          <h2>Resumen General</h2>
          <div class="summary-item"><span>Total de citas:</span><span>${stats.total}</span></div>
          <div class="summary-item"><span>Confirmadas:</span><span>${stats.confirmed}</span></div>
          <div class="summary-item"><span>Pendientes:</span><span>${stats.pending}</span></div>
          <div class="summary-item"><span>Pospuestas:</span><span>${stats.postponed}</span></div>
          <div class="summary-item"><span>Finalizadas:</span><span>${stats.completed}</span></div>
          <div class="summary-item total"><span>Ingresos totales:</span><span>${formatGuaranies(stats.totalRevenue)}</span></div>
        </div>
        <h2>Detalle de Citas</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Procedimiento</th>
              <th>Cant</th>
              <th>Precio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAppointments.map((appt) => {
              const [datePart, timePart] = appt.date_time.split(' ');
              const [year, month, day] = datePart.split('-');
              const displayDate = `${day}/${month}/${year}`;
              const displayTime = timePart ? timePart.substring(0, 5) : '';
              
              return appt.services?.map((service) => {
                const price = service.procedure_price || 0;
                return `
                  <tr>
                    <td>${displayDate}</td>
                    <td>${displayTime}</td>
                    <td>${appt.client_name}</td>
                    <td>${appt.client_contact}</td>
                    <td>${service.procedure_name || 'Desconocido'}</td>
                    <td>${service.quantity}</td>
                    <td>${formatGuaranies(price)}</td>
                    <td>${appt.status}</td>
                  </tr>
                `;
              }).join("");
            }).join("")}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4 md:space-y-6 relative">
      {/* Logo decorativo */}
      <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
        <img 
          src="/logo.png" 
          alt="Mayssch Nails" 
          className="w-40 h-40 rounded-full"
        />
      </div>

      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-700">
        📊 Reportes de Citas
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex gap-2">
          <button onClick={() => setViewType("day")} className={`px-4 py-2 rounded-lg font-semibold transition ${viewType === "day" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>Por Día</button>
          <button onClick={() => setViewType("month")} className={`px-4 py-2 rounded-lg font-semibold transition ${viewType === "month" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>Por Mes</button>
          <button onClick={() => setViewType("client")} className={`px-4 py-2 rounded-lg font-semibold transition ${viewType === "client" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>Por Cliente</button>
        </div>

        {viewType === "day" ? (
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border rounded-lg px-3 py-2 text-sm sm:text-base" />
        ) : viewType === "month" ? (
          <div className="flex gap-2">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="border rounded-lg px-3 py-2 text-sm sm:text-base">
              {Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{new Date(2000, i).toLocaleString("es-ES", { month: "long" })}</option>)}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="border rounded-lg px-3 py-2 text-sm sm:text-base">
              {Array.from({ length: 5 }, (_, i) => { const year = new Date().getFullYear() - 2 + i; return <option key={year} value={year}>{year}</option>; })}
            </select>
          </div>
        ) : (
          <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="border rounded-lg px-3 py-2 text-sm sm:text-base">
            <option value="">Selecciona un cliente</option>
            {clients.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl shadow"><div className="text-2xl md:text-3xl font-bold text-purple-700">{stats.total}</div><div className="text-xs sm:text-sm text-purple-600">Total Citas</div></div>
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl shadow"><div className="text-2xl md:text-3xl font-bold text-green-700">{stats.completed}</div><div className="text-xs sm:text-sm text-green-600">Finalizadas</div></div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl shadow"><div className="text-2xl md:text-3xl font-bold text-blue-700">{stats.confirmed}</div><div className="text-xs sm:text-sm text-blue-600">Confirmadas</div></div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 rounded-xl shadow"><div className="text-2xl md:text-3xl font-bold text-yellow-700">{stats.pending}</div><div className="text-xs sm:text-sm text-yellow-600">Pendientes</div></div>
        <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-xl shadow"><div className="text-2xl md:text-3xl font-bold text-pink-700">{formatGuaranies(stats.totalRevenue)}</div><div className="text-xs sm:text-sm text-pink-600">Ingresos</div></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={exportToPDF} className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-lg shadow-lg hover:scale-105 transform transition font-semibold">📄 Exportar a PDF</button>
        <button onClick={exportToExcel} className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-lg shadow-lg hover:scale-105 transform transition font-semibold">📊 Exportar a Excel</button>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <h3 className="text-base sm:text-lg font-bold text-purple-700 mb-4">Por Procedimiento</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead><tr className="bg-purple-100"><th className="p-2 text-left">Procedimiento</th><th className="p-2 text-center">Cantidad</th><th className="p-2 text-right">Ingresos</th></tr></thead>
            <tbody>
              {Object.entries(stats.byProcedure).map(([name, data]) => (
                <tr key={name} className="border-b hover:bg-purple-50"><td className="p-2">{name}</td><td className="p-2 text-center">{data.count}</td><td className="p-2 text-right font-semibold">{formatGuaranies(data.revenue)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <h3 className="text-base sm:text-lg font-bold text-pink-700 mb-4">Por Cliente</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead><tr className="bg-pink-100"><th className="p-2 text-left">Cliente</th><th className="p-2 text-left hidden sm:table-cell">Contacto</th><th className="p-2 text-center">Citas</th><th className="p-2 text-right">Total</th></tr></thead>
            <tbody>
              {Object.entries(stats.byClient).sort((a, b) => b[1].revenue - a[1].revenue).map(([name, data]) => (
                <tr key={name} className="border-b hover:bg-pink-50"><td className="p-2">{name}</td><td className="p-2 hidden sm:table-cell">{data.contact}</td><td className="p-2 text-center">{data.count}</td><td className="p-2 text-right font-semibold">{formatGuaranies(data.revenue)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <h3 className="text-base sm:text-lg font-bold text-indigo-700 mb-4">Detalle de Citas</h3>
        {filteredAppointments.length === 0 ? (
          <p className="text-sm text-gray-500">No hay citas en este período.</p>
        ) : (
          <div className="space-y-2">
            {filteredAppointments.map((appt) => {
              const [datePart, timePart] = appt.date_time.split(' ');
              const [year, month, day] = datePart.split('-');
              const displayDate = `${day}/${month}/${year}`;
              const displayTime = timePart ? timePart.substring(0, 5) : '';
              
              return (
                <div key={appt.id} className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <div><span className="font-semibold text-indigo-700">{appt.client_name}</span> <span className="text-gray-600">— {appt.services?.map(s => s.procedure_name).join(', ')}</span></div>
                    <div className="flex gap-2 sm:gap-4 text-gray-600">
                      <span>{displayDate}</span>
                      <span>{displayTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
