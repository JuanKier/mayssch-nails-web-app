const API_URL = "http://localhost:5000";

// Citas
export async function getAppointments() {
  const res = await fetch(`${API_URL}/appointments`);
  if (!res.ok) throw new Error("Error obteniendo citas");
  return res.json();
}

export async function createAppointment(data) {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creando cita");
  return res.json();
}

export async function updateAppointment(id, data) {
  const res = await fetch(`${API_URL}/appointments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error actualizando cita");
  return res.json();
}

export async function deleteAppointment(id) {
  const res = await fetch(`${API_URL}/appointments/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error eliminando cita");
  return res.json();
}

// Clientas
export async function getClients() {
  const res = await fetch(`${API_URL}/clients`);
  if (!res.ok) throw new Error("Error obteniendo clientas");
  return res.json();
}

export async function createClient(data) {
  const res = await fetch(`${API_URL}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creando clienta");
  return res.json();
}

export async function updateClient(id, data) {
  const res = await fetch(`${API_URL}/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error actualizando clienta");
  return res.json();
}

export async function deleteClient(id) {
  const res = await fetch(`${API_URL}/clients/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error eliminando clienta");
  return res.json();
}

// Procedimientos
export async function getProcedures() {
  const res = await fetch(`${API_URL}/procedures`);
  if (!res.ok) throw new Error("Error obteniendo procedimientos");
  return res.json();
}

export async function createProcedure(data) {
  const res = await fetch(`${API_URL}/procedures`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creando procedimiento");
  return res.json();
}

export async function updateProcedure(id, data) {
  const res = await fetch(`${API_URL}/procedures/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error actualizando procedimiento");
  return res.json();
}

export async function deleteProcedure(id) {
  const res = await fetch(`${API_URL}/procedures/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error eliminando procedimiento");
  return res.json();
}

// Inventario
export async function getInventory() {
  const res = await fetch(`${API_URL}/inventory`);
  if (!res.ok) throw new Error("Error obteniendo inventario");
  return res.json();
}

export async function createInventory(data) {
  const res = await fetch(`${API_URL}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creando inventario");
  return res.json();
}

export async function updateInventory(id, data) {
  const res = await fetch(`${API_URL}/inventory/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error actualizando inventario");
  return res.json();
}

export async function deleteInventory(id) {
  const res = await fetch(`${API_URL}/inventory/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error eliminando inventario");
  return res.json();
}

// Gastos
export async function getExpenses() {
  const res = await fetch(`${API_URL}/expenses`);
  if (!res.ok) throw new Error("Error obteniendo gastos");
  return res.json();
}

export async function createExpense(data) {
  const res = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creando gasto");
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${API_URL}/expenses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error eliminando gasto");
  return res.json();
}
