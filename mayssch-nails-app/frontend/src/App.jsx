import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentsList from "./components/AppointmentsList";
import Clients from "./components/Clients";
import Procedures from "./components/Procedures";
import Modal from "./components/Modal";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getProcedures,
  createProcedure,
  updateProcedure,
  deleteProcedure,
} from "./services/api";

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  // Navegación de meses
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    getAppointments().then(setAppointments).catch(console.error);
    getClients().then(setClients).catch(console.error);
    getProcedures().then(setProcedures).catch(console.error);
  }, []);

  // CRUD citas
  const handleAddAppointment = async (data) => {
    const newAppt = await createAppointment(data);
    setAppointments((prev) => [...prev, newAppt]);
    setShowModal(false);
  };
  const handleUpdateStatus = async (id, status) => {
    const updated = await updateAppointment(id, { status });
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };
  const handleDeleteAppointment = async (id) => {
    await deleteAppointment(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // CRUD clientas
  const handleCreateClient = async (data) => {
    const newClient = await createClient(data);
    setClients((prev) => [...prev, newClient]);
  };
  const handleUpdateClient = async (id, data) => {
    const updated = await updateClient(id, data);
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };
  const handleDeleteClient = async (id) => {
    await deleteClient(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // CRUD procedimientos
  const handleCreateProcedure = async (data) => {
    const newProc = await createProcedure(data);
    setProcedures((prev) => [...prev, newProc]);
  };
  const handleUpdateProcedure = async (id, data) => {
    const updated = await updateProcedure(id, data);
    setProcedures((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };
  const handleDeleteProcedure = async (id) => {
    await deleteProcedure(id);
    setProcedures((prev) => prev.filter((p) => p.id !== id));
  };

  // Selección de fecha abre modal
  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 space-y-10">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-700">
          Agenda Mayssch Nails
        </h1>

        {/* Menú de navegación */}
        <div className="flex justify-center space-x-4 mb-6">
          <button onClick={() => setView("home")} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:scale-105 transform transition">Inicio</button>
          <button onClick={() => setView("appointments")} className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow hover:scale-105 transform transition">Citas</button>
          <button onClick={() => setView("clients")} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow hover:scale-105 transform transition">Clientas</button>
          <button onClick={() => setView("procedures")} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold shadow hover:scale-105 transform transition">Procedimientos</button>
        </div>

        {/* Renderizado condicional */}
        {view === "home" && (
          <div className="space-y-8">
            {/* Barra de navegación de meses */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={prevMonth}
                className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow hover:scale-105 transform transition font-semibold"
              >
                ← Mes anterior
              </button>
              <h2 className="capitalize text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-700 font-poppins">
                {new Date(year, month).toLocaleString("es-ES", { month: "long", year: "numeric" })}
              </h2>
              <button
                onClick={nextMonth}
                className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow hover:scale-105 transform transition font-semibold"
              >
                Mes siguiente →
              </button>
            </div>

            {/* Calendario */}
            <Calendar
              appointments={appointments}
              onSelectDate={handleSelectDate}
              selectedDate={selectedDate}
              month={month}
              year={year}
            />
          </div>
        )}


        {view === "appointments" && (
          <AppointmentsList
            appointments={appointments}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteAppointment}
          />
        )}

        {view === "clients" && (
          <Clients
            clients={clients}
            appointments={appointments} // 👈 ahora pasamos las citas
            onCreate={handleCreateClient}
            onUpdate={handleUpdateClient}
            onDelete={handleDeleteClient}
          />
        )}

        {view === "procedures" && (
          <Procedures
            procedures={procedures}
            onCreate={handleCreateProcedure}
            onUpdate={handleUpdateProcedure}
            onDelete={handleDeleteProcedure}
          />
        )}
      </div>

      {/* Modal para citas */}
      {showModal && selectedDate && (
        <Modal onClose={() => setShowModal(false)}>
          <AppointmentForm
            date={selectedDate}
            appointments={appointments}
            onSubmit={handleAddAppointment}
            clients={clients}
            procedures={procedures}
            onCreateClient={handleCreateClient}
          />
        </Modal>
      )}
    </div>
  );
}