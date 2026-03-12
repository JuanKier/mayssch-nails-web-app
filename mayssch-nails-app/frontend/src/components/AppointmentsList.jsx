export default function AppointmentsList({ appointments, onUpdateStatus, onDelete }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-purple-700">Todas las citas</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No hay citas registradas.</p>
      ) : (
        <ul className="space-y-2">
          {appointments.map((appt) => (
            <li
              key={appt.id}
              className="p-3 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <strong>{appt.client_name}</strong> ({appt.client_contact})  
                — {appt.procedure_type} — {new Date(appt.date_time).toLocaleString()}
              </div>
              <div className="flex space-x-2">
                <select
                  value={appt.status}
                  onChange={(e) => onUpdateStatus(appt.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="postponed">Pospuesta</option>
                </select>
                <button
                  onClick={() => onDelete(appt.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}