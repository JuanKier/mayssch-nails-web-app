import {
  getAllClients, addClient, updateClient as dbUpdateClient, deleteClient as dbDeleteClient,
  getAllProcedures, addProcedure, updateProcedure as dbUpdateProcedure, deleteProcedure as dbDeleteProcedure,
  getAllAppointments, addAppointment, updateAppointment as dbUpdateAppointment, deleteAppointment as dbDeleteAppointment,
  getAllInventory, addInventory, updateInventory as dbUpdateInventory, deleteInventory as dbDeleteInventory,
  getAllExpenses, addExpense, deleteExpense as dbDeleteExpense,
  seedData
} from '../db/database';

// Inicializar base de datos
export async function initLocalDB() {
  await seedData();
}

// Clientas
export async function getClients() {
  return await getAllClients();
}

export async function createClient(data) {
  const client = await addClient(data);
  return { ...data, id: client };
}

export async function updateClient(id, data) {
  await dbUpdateClient(id, data);
  const clients = await getClients();
  return clients.find(c => Number(c.id) === Number(id));
}

export async function deleteClient(id) {
  await dbDeleteClient(id);
  return { message: 'Clienta eliminada correctamente' };
}

// Procedimientos
export async function getProcedures() {
  return await getAllProcedures();
}

export async function createProcedure(data) {
  const procedure = await addProcedure(data);
  return { ...data, id: procedure };
}

export async function updateProcedure(id, data) {
  await dbUpdateProcedure(id, data);
  const procedures = await getProcedures();
  return procedures.find(p => Number(p.id) === Number(id));
}

export async function deleteProcedure(id) {
  await dbDeleteProcedure(id);
  return { message: 'Procedimiento eliminado correctamente' };
}

// Citas
export async function getAppointments() {
  return await getAllAppointments();
}

export async function createAppointment(data) {
  console.log('💾 Creating appointment with data:', data);
  const appointmentId = await addAppointment(data);
  const savedAppointment = { ...data, id: appointmentId };
  console.log('✅ Appointment saved:', savedAppointment);
  return savedAppointment;
}

export async function updateAppointment(id, data) {
  console.log('📝 Updating appointment:', id, data);
  await dbUpdateAppointment(id, data);
  // Obtener la cita actualizada con todos sus datos
  const appointments = await getAllAppointments();
  const updatedAppointment = appointments.find(a => Number(a.id) === Number(id));
  console.log('✅ Appointment updated:', updatedAppointment);
  return updatedAppointment;
}

export async function deleteAppointment(id) {
  await dbDeleteAppointment(id);
  return { message: 'Cita eliminada correctamente' };
}

// Inventario
export async function getInventory() {
  return await getAllInventory();
}

export async function createInventory(data) {
  const item = await addInventory(data);
  return { ...data, id: item };
}

export async function updateInventory(id, data) {
  await dbUpdateInventory(id, data);
  const inventory = await getInventory();
  return inventory.find(i => Number(i.id) === Number(id));
}

export async function deleteInventory(id) {
  await dbDeleteInventory(id);
  return { message: 'Inventario eliminado correctamente' };
}

// Gastos
export async function getExpenses() {
  return await getAllExpenses();
}

export async function createExpense(data) {
  const expense = await addExpense(data);
  return { ...data, id: expense };
}

export async function deleteExpense(id) {
  await dbDeleteExpense(id);
  return { message: 'Gasto eliminado correctamente' };
}
