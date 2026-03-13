import { formatGuaranies } from "../utils/currency";

export default function FinancialCharts({ monthlyFlow }) {
  if (!monthlyFlow || monthlyFlow.length === 0) {
    return <div className="text-center text-gray-500 p-8">No hay datos disponibles</div>;
  }

  const maxValue = Math.max(...monthlyFlow.map(m => Math.max(m.income, m.expenses)), 1);

  return (
    <div className="space-y-8">
      {/* Gráfico de barras verticales */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-6">📊 Comparativa Mensual</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-4 min-w-max">
            {monthlyFlow.map((month) => (
              <div key={month.month} className="flex flex-col items-center gap-2">
                {/* Barras */}
                <div className="flex items-end gap-2 h-64">
                  {/* Barra de ingresos */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg shadow-md transition hover:shadow-lg"
                      style={{ height: `${(month.income / maxValue) * 200}px` }}
                      title={formatGuaranies(month.income)}
                    />
                    <div className="text-xs text-green-600 font-semibold mt-2">Ingresos</div>
                  </div>

                  {/* Barra de gastos */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 bg-gradient-to-t from-red-400 to-red-300 rounded-t-lg shadow-md transition hover:shadow-lg"
                      style={{ height: `${(month.expenses / maxValue) * 200}px` }}
                      title={formatGuaranies(month.expenses)}
                    />
                    <div className="text-xs text-red-600 font-semibold mt-2">Gastos</div>
                  </div>
                </div>

                {/* Mes */}
                <div className="text-xs font-semibold text-gray-700 text-center w-24">
                  {month.monthName.split(' ')[0]}
                </div>

                {/* Balance */}
                <div className={`text-sm font-bold ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {month.balance >= 0 ? '+' : ''}{formatGuaranies(month.balance)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de línea (balance acumulado) */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-6">📈 Tendencia de Balance</h3>
        <div className="relative h-64 bg-gradient-to-b from-blue-50 to-white rounded-lg p-4">
          <svg className="w-full h-full" viewBox={`0 0 ${monthlyFlow.length * 100} 250`} preserveAspectRatio="none">
            {/* Línea de balance */}
            <polyline
              points={monthlyFlow
                .map((month, idx) => {
                  const x = idx * (100 / (monthlyFlow.length - 1 || 1));
                  const y = 200 - (month.balance / maxValue) * 200;
                  return `${x},${y}`;
                })
                .join(' ')}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Puntos */}
            {monthlyFlow.map((month, idx) => {
              const x = idx * (100 / (monthlyFlow.length - 1 || 1));
              const y = 200 - (month.balance / maxValue) * 200;
              const isPositive = month.balance >= 0;
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={isPositive ? '#10b981' : '#ef4444'}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {/* Etiquetas de meses */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-600">
            {monthlyFlow.map((month) => (
              <span key={month.month}>{month.monthName.split(' ')[0]}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla detallada */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Detalle Mensual</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
              <th className="p-3 text-left font-semibold text-gray-700">Mes</th>
              <th className="p-3 text-right font-semibold text-green-700">Ingresos</th>
              <th className="p-3 text-right font-semibold text-red-700">Gastos</th>
              <th className="p-3 text-right font-semibold text-blue-700">Balance</th>
              <th className="p-3 text-center font-semibold text-gray-700">Margen</th>
            </tr>
          </thead>
          <tbody>
            {monthlyFlow.map((month) => {
              const margin = month.income > 0 ? ((month.balance / month.income) * 100).toFixed(1) : 0;
              return (
                <tr key={month.month} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 font-medium text-gray-800">{month.monthName}</td>
                  <td className="p-3 text-right text-green-600 font-semibold">{formatGuaranies(month.income)}</td>
                  <td className="p-3 text-right text-red-600 font-semibold">{formatGuaranies(month.expenses)}</td>
                  <td className={`p-3 text-right font-bold ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatGuaranies(month.balance)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      margin >= 50 ? 'bg-green-100 text-green-700' :
                      margin >= 20 ? 'bg-yellow-100 text-yellow-700' :
                      margin >= 0 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {margin}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resumen estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl shadow">
          <div className="text-xs text-green-600 font-semibold mb-1">Ingresos Totales</div>
          <div className="text-2xl font-bold text-green-700">
            {formatGuaranies(monthlyFlow.reduce((sum, m) => sum + m.income, 0))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-xl shadow">
          <div className="text-xs text-red-600 font-semibold mb-1">Gastos Totales</div>
          <div className="text-2xl font-bold text-red-700">
            {formatGuaranies(monthlyFlow.reduce((sum, m) => sum + m.expenses, 0))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl shadow">
          <div className="text-xs text-blue-600 font-semibold mb-1">Balance Total</div>
          <div className="text-2xl font-bold text-blue-700">
            {formatGuaranies(monthlyFlow.reduce((sum, m) => sum + m.balance, 0))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl shadow">
          <div className="text-xs text-purple-600 font-semibold mb-1">Promedio Mensual</div>
          <div className="text-2xl font-bold text-purple-700">
            {formatGuaranies(monthlyFlow.reduce((sum, m) => sum + m.balance, 0) / monthlyFlow.length)}
          </div>
        </div>
      </div>
    </div>
  );
}
