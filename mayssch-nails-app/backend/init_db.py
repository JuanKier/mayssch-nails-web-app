from datetime import datetime
from app import app, db
from models.user import User
from models.appointment import Appointment

def seed_data():
    with app.app_context():
        # Borrar datos previos
        db.drop_all()
        db.create_all()

        # Crear usuario admin
        admin = User(full_name="Administrador", contact="admin@mayssch.com", role="admin")
        db.session.add(admin)
        db.session.commit()

        # Crear citas de prueba
        citas = [
            Appointment(
                date_time=datetime(2026, 3, 7, 8, 0),
                procedure_type="Manicura",
                client_name="Juana Pérez",
                client_contact="0991-123456",
                status="pending",
                created_by=admin.id
            ),
            Appointment(
                date_time=datetime(2026, 3, 7, 10, 0),
                procedure_type="Pedicura",
                client_name="María López",
                client_contact="0982-654321",
                status="confirmed",
                created_by=admin.id
            ),
            Appointment(
                date_time=datetime(2026, 3, 8, 15, 0),
                procedure_type="Uñas Acrílicas",
                client_name="Carolina Gómez",
                client_contact="0975-111222",
                status="postponed",
                created_by=admin.id
            )
        ]

        db.session.add_all(citas)
        db.session.commit()
        print("✅ Base de datos inicializada con usuario admin y citas de prueba.")

if __name__ == "__main__":
    seed_data()
