import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentsList from "./components/AppointmentsList";
import AllAppointments from "./components/AllAppointments";
import Clients from "./components/Clients";
import Procedures from "./components/Procedures";
import Reports from "./components/Reports";
import Accounting from "./components/Accounting";
import Inventory from "./components/Inventory";
import Modal from "./components/Modal";
import {
  initLocalDB,
  getClients, createClient, updateClient, deleteClient,
  getProcedures, createProcedure, updateProcedure, deleteProcedure,
  getAppointments, createAppointment, updateAppointment, deleteAppointment,
  getInventory, createInventory, updateInventory, deleteInventory,
  getExpenses, createExpense, deleteExpense,
} from "./services/localApi";

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    initLocalDB().then(() => {
      getAppointments().then(setAppointments).catch(console.error);
      getClients().then(setClients).catch(console.error);
      getProcedures().then(setProcedures).catch(console.error);
      getInventory().then(setInventory).catch(console.error);
      getExpenses().then(setExpenses).catch(console.error);
    }).catch(console.error);
  }, []);

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

  const handleCreateInventory = async (data) => {
    const newInv = await createInventory(data);
    setInventory((prev) => [...prev, newInv]);
  };
  
  const handleUpdateInventory = async (id, data) => {
    const updated = await updateInventory(id, data);
    setInventory((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };
  
  const handleDeleteInventory = async (id) => {
    await deleteInventory(id);
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCreateExpense = async (data) => {
    const newExpense = await createExpense(data);
    setExpenses((prev) => [...prev, newExpense]);
  };
  
  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const menuItems = [
    { id: "home", label: "Inicio", icon: "🏠" },
    { id: "appointments", label: "Hoy", icon: "📅" },
    { id: "all-appointments", label: "Todas", icon: "📋" },
    { id: "reports", label: "Reportes", icon: "📊" },
    { id: "accounting", label: "Finanzas", icon: "💰" },
    { id: "inventory", label: "Stock", icon: "📦" },
    { id: "clients", label: "Clientas", icon: "👥" },
    { id: "procedures", label: "Servicios", icon: "💅" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-purple-50">
      {/* Header minimalista */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <img src="/logo.png" alt="Mayssch Nails" className="w-10 h-10 rounded-full" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Mayssch Nails</h1>
                <p className="text-xs text-gray-500">Gestión de citas</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    view === item.id
                      ? "bg-pink-100 text-pink-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl animate-slide-in">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <img src="/logo.png" alt="Mayssch Nails" className="w-12 h-12 rounded-full" />
                <div>
                  <h2 className="font-semibold text-gray-900">Mayssch Nails</h2>
                  <p className="text-xs text-gray-500">Menú</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                      view === item.id
                        ? "bg-pink-100 text-pink-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {view === "home" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Calendario</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(year, month).toLocaleString("es-ES", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <Calendar
                  appointments={appointments}
                  onSelectDate={handleSelectDate}
                  selectedDate={selectedDate}
                  month={month}
                  year={year}
                />
              </div>
            </div>
          )}

          {view === "appointments" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <AppointmentsList
                appointments={appointments}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteAppointment}
              />
            </div>
          )}

          {view === "all-appointments" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <AllAppointments
                appointments={appointments}
                procedures={procedures}
                clients={clients}
                onUpdate={handleUpdateStatus}
                onDelete={handleDeleteAppointment}
              />
            </div>
          )}

          {view === "reports" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Reports
                appointments={appointments}
                procedures={procedures}
                inventory={inventory}
              />
            </div>
          )}

          {view === "accounting" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Accounting
                expenses={expenses}
                appointments={appointments}
                procedures={procedures}
                onAddExpense={handleCreateExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            </div>
          )}

          {view === "inventory" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Inventory
                inventory={inventory}
                onCreate={handleCreateInventory}
                onUpdate={handleUpdateInventory}
                onDelete={handleDeleteInventory}
              />
            </div>
          )}

          {view === "clients" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Clients
                clients={clients}
                appointments={appointments}
                onCreate={handleCreateClient}
                onUpdate={handleUpdateClient}
                onDelete={handleDeleteClient}
              />
            </div>
          )}

          {view === "procedures" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <Procedures
                procedures={procedures}
                onCreate={handleCreateProcedure}
                onUpdate={handleUpdateProcedure}
                onDelete={handleDeleteProcedure}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
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
