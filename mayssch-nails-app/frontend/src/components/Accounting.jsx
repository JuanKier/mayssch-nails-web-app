import { useState, useMemo } from "react";
import { formatGuaranies } from "../utils/currency";
import FinancialCharts from "./FinancialCharts";

export default function Accounting({ expenses, appointments, procedures, onAddExpense, onDeleteExpense }) {
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("insumos");
  const [showCharts, setShowCharts] = useState(false);

  const financialStats = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Calcular ingresos solo de citas finalizadas
    let totalIncome = 0;
    const completedAppointments = appointments.filter((a) => a.status === "completed");
    
    completedAppointments.forEach((appt) => {
      appt.services?.forEach((service) => {
        totalIncome += service.procedure_price * service.quantity;
      });
    });

    const netProfit = totalIncome - totalExpenses;

    // Calcular flujo mensual (últimos 6 meses)
    const monthlyFlow = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthNum = monthDate.getMonth();
      const yearNum = monthDate.getFullYear();
      
      // Ingresos del mes
      let monthIncome = 0;
      completedAppointments
        .filter((a) => {
          const apptDate = new Date(a.date_time);
          return apptDate.getMonth() === monthNum && apptDate.getFullYear() === yearNum;
        })
        .forEach((appt) => {
          appt.services?.forEach((service) => {
            monthIncome += service.procedure_price * service.quantity;
          });
        });
      
      // Gastos del mes
      const monthExpenses = expenses
        .filter((e) => {
          const expDate = new Date(e.date);
          return expDate.getMonth() === monthNum && expDate.getFullYear() === yearNum;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      
      const balance = monthIncome - monthExpenses;
      const maxValue = Math.max(monthIncome, monthExpenses, 1);
      
      monthlyFlow.push({
        month: `${yearNum}-${monthNum + 1}`,
        monthName: monthDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }),
        income: monthIncome,
        expenses: monthExpenses,
        balance: balance,
        incomePercent: (monthIncome / maxValue) * 100,
        expensePercent: (monthExpenses / maxValue) * 100,
      });
    }

    return {
      totalExpenses,
      totalIncome,
      netProfit,
      monthlyFlow,
    };
  }, [expenses, appointments, procedures]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (expenseDesc && expenseAmount) {
      onAddExpense({
        description: expenseDesc,
        amount: parseFloat(expenseAmount),
        category: expenseCategory,
      });
      setExpenseDesc("");
      setExpenseAmount("");
    }
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

      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-700">
        📊 Contabilidad
      </h2>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl shadow">
          <div className="text-sm text-green-600">Ingresos Totales</div>
          <div className="text-2xl font-bold text-green-700">{formatGuaranies(financialStats.totalIncome)}</div>
          <div className="text-xs text-green-500">Solo citas finalizadas</div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-xl shadow">
          <div className="text-sm text-red-600">Gastos Totales</div>
          <div className="text-2xl font-bold text-red-700">{formatGuaranies(financialStats.totalExpenses)}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl shadow">
          <div className="text-sm text-blue-600">Ganancia Neta</div>
          <div className="text-2xl font-bold text-blue-700">{formatGuaranies(financialStats.netProfit)}</div>
          <div className="text-xs text-blue-500">Ingresos - Gastos</div>
        </div>
      </div>

      {/* Gráfico de flujo mensual */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-bold text-blue-700">📈 Análisis Financiero</h3>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              showCharts
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {showCharts ? "Ocultar Gráficos" : "Ver Gráficos"}
          </button>
        </div>
        
        {showCharts && (
          <div className="mt-6 pt-6 border-t">
            <FinancialCharts monthlyFlow={financialStats.monthlyFlow} />
          </div>
        )}
      </div>

      {/* Formulario para agregar gastos */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <h3 className="text-base sm:text-lg font-bold text-red-700 mb-4">➕ Agregar Gasto</h3>
        <form onSubmit={handleAddExpense} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Descripción del gasto"
            value={expenseDesc}
            onChange={(e) => setExpenseDesc(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 text-sm sm:text-base flex-1"
          />
          <input
            type="number"
            placeholder="Monto"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            min="0"
            step="0.01"
            required
            className="border rounded-lg px-3 py-2 text-sm sm:text-base w-24"
          />
          <select
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm sm:text-base"
          >
            <option value="insumos">Insumos</option>
            <option value="servicios">Servicios</option>
            <option value="alquiler">Alquiler</option>
            <option value="servicios_publicos">Servicios Públicos</option>
            <option value="otros">Otros</option>
          </select>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 text-sm sm:text-base rounded hover:bg-red-700 whitespace-nowrap"
          >
            Agregar Gasto
          </button>
        </form>

        {/* Lista de gastos */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-red-100">
                <th className="p-2 text-left">Descripción</th>
                <th className="p-2 text-center">Categoría</th>
                <th className="p-2 text-right">Monto</th>
                <th className="p-2 text-center">Fecha</th>
                <th className="p-2 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b hover:bg-red-50">
                  <td className="p-2">{e.description}</td>
                  <td className="p-2 text-center">{e.category}</td>
                  <td className="p-2 text-right font-semibold text-red-600">-{formatGuaranies(e.amount)}</td>
                  <td className="p-2 text-center">{new Date(e.date).toLocaleDateString("es-ES")}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => onDeleteExpense(e.id)}
                      className="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
