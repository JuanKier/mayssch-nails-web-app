from datetime import datetime
from app import app, db
from models.user import User
from models.appointment import Appointment
from models.appointment_service import AppointmentService
from models.client import Client
from models.procedure import Procedure
from models.inventory import Inventory

def seed_data():
    with app.app_context():
        # Borrar datos previos
        db.drop_all()
        db.create_all()

        # Crear usuario admin
        admin = User(full_name="Administrador", contact="admin@mayssch.com", role="admin")
        db.session.add(admin)
        db.session.commit()

        # Crear procedimientos predefinidos
        procedures = [
            Procedure(name="Pedicura", price=70000.0),
            Procedure(name="Capping en gel", price=110000.0),
            Procedure(name="Softgel", price=120000.0),
            Procedure(name="Semipermanente", price=60000.0),
            Procedure(name="Diseño elaborado", price=20000.0),
            Procedure(name="Diseño simple", price=10000.0),
        ]
        db.session.add_all(procedures)
        db.session.commit()

        # Crear clientes de prueba
        clients = [
            Client(name="Juana Pérez", contact="0991-123456"),
            Client(name="María López", contact="0982-654321"),
            Client(name="Carolina Gómez", contact="0975-111222"),
        ]
        db.session.add_all(clients)
        db.session.commit()

        # Crear inventario de prueba
        inventory_items = [
            Inventory(product_name="Esmalte Rojo Pasión", category="esmaltes", quantity=15, min_stock=5, unit_price=25000),
            Inventory(product_name="Esmalte Rosa Claro", category="esmaltes", quantity=12, min_stock=5, unit_price=25000),
            Inventory(product_name="Esmalte Negro Mate", category="esmaltes", quantity=8, min_stock=5, unit_price=28000),
            Inventory(product_name="Gel Constructor", category="geles", quantity=6, min_stock=3, unit_price=85000),
            Inventory(product_name="Top Coat Brillante", category="geles", quantity=10, min_stock=4, unit_price=45000),
            Inventory(product_name="Base Coat", category="geles", quantity=9, min_stock=4, unit_price=40000),
            Inventory(product_name="Limas 100/180", category="insumos", quantity=50, min_stock=20, unit_price=2000),
            Inventory(product_name="Algodón", category="insumos", quantity=3, min_stock=5, unit_price=15000),
            Inventory(product_name="Acetona Pura", category="insumos", quantity=2, min_stock=3, unit_price=35000),
            Inventory(product_name="Removedor de Cutícula", category="insumos", quantity=4, min_stock=2, unit_price=22000),
            Inventory(product_name="Tips Naturales", category="insumos", quantity=100, min_stock=50, unit_price=500),
            Inventory(product_name="Lámpara UV Repuesto", category="equipos", quantity=2, min_stock=1, unit_price=120000),
        ]
        db.session.add_all(inventory_items)
        db.session.commit()

        # Crear citas de prueba con servicios
        appt1 = Appointment(
            date_time=datetime(2026, 3, 7, 8, 0),
            client_name="Juana Pérez",
            client_contact="0991-123456",
            status="pending",
            created_by=admin.id
        )
        db.session.add(appt1)
        db.session.flush()
        db.session.add(AppointmentService(appointment_id=appt1.id, procedure_id=1, quantity=1))

        appt2 = Appointment(
            date_time=datetime(2026, 3, 7, 10, 0),
            client_name="María López",
            client_contact="0982-654321",
            status="confirmed",
            created_by=admin.id
        )
        db.session.add(appt2)
        db.session.flush()
        db.session.add(AppointmentService(appointment_id=appt2.id, procedure_id=3, quantity=1))
        db.session.add(AppointmentService(appointment_id=appt2.id, procedure_id=5, quantity=1))

        appt3 = Appointment(
            date_time=datetime(2026, 3, 8, 15, 0),
            client_name="Carolina Gómez",
            client_contact="0975-111222",
            status="completed",
            created_by=admin.id
        )
        db.session.add(appt3)
        db.session.flush()
        db.session.add(AppointmentService(appointment_id=appt3.id, procedure_id=2, quantity=1))

        db.session.commit()
        print("✅ Base de datos inicializada con usuario admin, procedimientos, clientes y citas de prueba.")

if __name__ == "__main__":
    seed_data()
