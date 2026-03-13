// Base de datos local usando localStorage (más confiable en Android WebView)
const DB_PREFIX = 'mayssch_nails_';

const STORES = {
  CLIENTS: 'clients',
  PROCEDURES: 'procedures',
  APPOINTMENTS: 'appointments',
  INVENTORY: 'inventory',
  EXPENSES: 'expenses',
};

// Helper para guardar datos
function saveStore(storeName, data) {
  try {
    const key = DB_PREFIX + storeName;
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    console.log(`💾 Saved ${data.length} items to ${storeName}`);
    return true;
  } catch (e) {
    console.error('❌ Error saving to localStorage:', e);
    return false;
  }
}

// Helper para cargar datos
function loadStore(storeName) {
  try {
    const key = DB_PREFIX + storeName;
    const data = localStorage.getItem(key);
    const parsed = data ? JSON.parse(data) : [];
    console.log(`📖 Loaded ${parsed.length} items from ${storeName}`);
    return parsed;
  } catch (e) {
    console.error('❌ Error loading from localStorage:', e);
    return [];
  }
}

// Inicializar base de datos (solo crea estructura si no existe)
export async function initDB() {
  console.log('Database initialized with localStorage');
  return true;
}

// CRUD para Clients
export async function getAllClients() {
  return loadStore(STORES.CLIENTS);
}

export async function addClient(data) {
  const clients = loadStore(STORES.CLIENTS);
  const newClient = { ...data, id: Date.now() };
  clients.push(newClient);
  saveStore(STORES.CLIENTS, clients);
  return newClient.id;
}

export async function updateClient(id, data) {
  const clients = loadStore(STORES.CLIENTS);
  const index = clients.findIndex(c => c.id === id);
  if (index !== -1) {
    clients[index] = { ...data, id };
    saveStore(STORES.CLIENTS, clients);
    return clients[index].id;
  }
  return null;
}

export async function deleteClient(id) {
  const clients = loadStore(STORES.CLIENTS);
  const filtered = clients.filter(c => c.id !== id);
  saveStore(STORES.CLIENTS, filtered);
}

// CRUD para Procedures
export async function getAllProcedures() {
  return loadStore(STORES.PROCEDURES);
}

export async function addProcedure(data) {
  const procedures = loadStore(STORES.PROCEDURES);
  const newProc = { ...data, id: Date.now() };
  procedures.push(newProc);
  saveStore(STORES.PROCEDURES, procedures);
  return newProc.id;
}

export async function updateProcedure(id, data) {
  const procedures = loadStore(STORES.PROCEDURES);
  const index = procedures.findIndex(p => p.id === id);
  if (index !== -1) {
    procedures[index] = { ...data, id };
    saveStore(STORES.PROCEDURES, procedures);
    return procedures[index].id;
  }
  return null;
}

export async function deleteProcedure(id) {
  const procedures = loadStore(STORES.PROCEDURES);
  const filtered = procedures.filter(p => p.id !== id);
  saveStore(STORES.PROCEDURES, filtered);
}

// CRUD para Appointments
export async function getAllAppointments() {
  return loadStore(STORES.APPOINTMENTS);
}

export async function addAppointment(data) {
  const appointments = loadStore(STORES.APPOINTMENTS);
  const newAppt = { ...data, id: Date.now() };
  appointments.push(newAppt);
  saveStore(STORES.APPOINTMENTS, appointments);
  return newAppt.id;
}

export async function updateAppointment(id, data) {
  const appointments = loadStore(STORES.APPOINTMENTS);
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index] = { ...data, id };
    saveStore(STORES.APPOINTMENTS, appointments);
    return appointments[index].id;
  }
  return null;
}

export async function deleteAppointment(id) {
  const appointments = loadStore(STORES.APPOINTMENTS);
  const filtered = appointments.filter(a => a.id !== id);
  saveStore(STORES.APPOINTMENTS, filtered);
}

// CRUD para Inventory
export async function getAllInventory() {
  return loadStore(STORES.INVENTORY);
}

export async function addInventory(data) {
  const inventory = loadStore(STORES.INVENTORY);
  const newItem = { ...data, id: Date.now() };
  inventory.push(newItem);
  saveStore(STORES.INVENTORY, inventory);
  return newItem.id;
}

export async function updateInventory(id, data) {
  const inventory = loadStore(STORES.INVENTORY);
  const index = inventory.findIndex(i => i.id === id);
  if (index !== -1) {
    inventory[index] = { ...data, id };
    saveStore(STORES.INVENTORY, inventory);
    return inventory[index].id;
  }
  return null;
}

export async function deleteInventory(id) {
  const inventory = loadStore(STORES.INVENTORY);
  const filtered = inventory.filter(i => i.id !== id);
  saveStore(STORES.INVENTORY, filtered);
}

// CRUD para Expenses
export async function getAllExpenses() {
  return loadStore(STORES.EXPENSES);
}

export async function addExpense(data) {
  const expenses = loadStore(STORES.EXPENSES);
  const newExpense = { ...data, id: Date.now() };
  expenses.push(newExpense);
  saveStore(STORES.EXPENSES, expenses);
  return newExpense.id;
}

export async function deleteExpense(id) {
  const expenses = loadStore(STORES.EXPENSES);
  const filtered = expenses.filter(e => e.id !== id);
  saveStore(STORES.EXPENSES, filtered);
}

// Inicializar con datos de prueba si la base de datos está vacía
export async function seedData() {
  console.log('🔍 Checking if data needs to be seeded...');
  const clients = await getAllClients();
  console.log('📊 Current clients count:', clients.length);
  
  if (clients.length === 0) {
    console.log('🌱 Seeding initial data...');
    
    // Procedimientos por defecto
    const procedures = [
      { name: 'Pedicura', price: 70000 },
      { name: 'Capping en gel', price: 110000 },
      { name: 'Softgel', price: 120000 },
      { name: 'Semipermanente', price: 60000 },
      { name: 'Diseño elaborado', price: 20000 },
      { name: 'Diseño simple', price: 10000 },
    ];
    
    console.log('💅 Adding procedures...');
    for (const proc of procedures) {
      const id = await addProcedure(proc);
      console.log('✅ Added procedure:', proc.name, 'with ID:', id);
    }
    
    // Clientes de prueba
    const testClients = [
      { name: 'Juana Pérez', contact: '0991-123456' },
      { name: 'María López', contact: '0982-654321' },
      { name: 'Carolina Gómez', contact: '0975-111222' },
    ];
    
    console.log('👥 Adding clients...');
    for (const client of testClients) {
      const id = await addClient(client);
      console.log('✅ Added client:', client.name, 'with ID:', id);
    }
    
    // Inventario de prueba
    const inventory = [
      { product_name: 'Esmalte Rojo Pasión', category: 'esmaltes', quantity: 15, min_stock: 5, unit_price: 25000 },
      { product_name: 'Esmalte Rosa Claro', category: 'esmaltes', quantity: 12, min_stock: 5, unit_price: 25000 },
      { product_name: 'Softgel', category: 'geles', quantity: 6, min_stock: 3, unit_price: 85000 },
      { product_name: 'Top Coat Brillante', category: 'geles', quantity: 10, min_stock: 4, unit_price: 45000 },
      { product_name: 'Base Coat', category: 'geles', quantity: 9, min_stock: 4, unit_price: 40000 },
      { product_name: 'Limas 100/180', category: 'insumos', quantity: 50, min_stock: 20, unit_price: 2000 },
      { product_name: 'Algodón', category: 'insumos', quantity: 3, min_stock: 5, unit_price: 15000 },
      { product_name: 'Acetona Pura', category: 'insumos', quantity: 2, min_stock: 3, unit_price: 35000 },
      { product_name: 'Removedor de Cutícula', category: 'insumos', quantity: 4, min_stock: 2, unit_price: 22000 },
      { product_name: 'Tips Naturales', category: 'insumos', quantity: 100, min_stock: 50, unit_price: 500 },
    ];
    
    console.log('📦 Adding inventory...');
    for (const item of inventory) {
      const id = await addInventory(item);
      console.log('✅ Added inventory:', item.product_name, 'with ID:', id);
    }
    
    console.log('✨ Data seeded successfully!');
    console.log('📊 Final counts:');
    console.log('  - Procedures:', (await getAllProcedures()).length);
    console.log('  - Clients:', (await getAllClients()).length);
    console.log('  - Inventory:', (await getAllInventory()).length);
  } else {
    console.log('✅ Data already exists, skipping seed');
  }
}
