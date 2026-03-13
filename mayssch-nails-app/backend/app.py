from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

from extensions import db

app = Flask(__name__)
CORS(app)

# Configuración SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy
db.init_app(app)

# Importar modelos
from models.appointment import Appointment
from models.appointment_service import AppointmentService
from models.client import Client
from models.procedure import Procedure
from models.user import User
from models.inventory import Inventory
from models.expense import Expense

# Crear tablas si no existen
with app.app_context():
    db.create_all()

# -------------------------------
# CRUD CITAS
# -------------------------------
@app.route("/appointments", methods=["GET"])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([a.to_dict() for a in appointments])

@app.route("/appointments", methods=["POST"])
def create_appointment():
    data = request.get_json()
    print("Datos recibidos:", data)  # Debug
    
    if not data.get("client_name") or not data.get("client_contact"):
        return jsonify({"error": "Nombre y contacto son obligatorios"}), 400
    
    if not data.get("services") or len(data.get("services", [])) == 0:
        return jsonify({"error": "Debe agregar al menos un servicio"}), 400

    try:
        appointment = Appointment(
            date_time=datetime.fromisoformat(data["date_time"]),
            client_name=data["client_name"],
            client_contact=data["client_contact"],
            status="pending",  # Siempre inicia como pendiente
            created_by=data.get("created_by", None)
        )
        db.session.add(appointment)
        db.session.flush()  # Para obtener el ID antes de commit

        # Agregar servicios
        for service in data["services"]:
            print(f"Agregando servicio: {service}")  # Debug
            appt_service = AppointmentService(
                appointment_id=appointment.id,
                procedure_id=service["procedure_id"],
                quantity=service.get("quantity", 1)
            )
            db.session.add(appt_service)

        db.session.commit()
        print("Cita creada exitosamente:", appointment.to_dict())  # Debug
        return jsonify(appointment.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error al crear cita: {str(e)}")  # Debug
        return jsonify({"error": f"Error al crear cita: {str(e)}"}), 500

@app.route("/appointments/<int:id>", methods=["PUT"])
def update_appointment(id):
    data = request.get_json()
    appointment = Appointment.query.get_or_404(id)
    appointment.status = data.get("status", appointment.status)
    db.session.commit()
    return jsonify(appointment.to_dict())

@app.route("/appointments/<int:id>", methods=["DELETE"])
def delete_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({"message": "Cita eliminada correctamente"}), 200

# -------------------------------
# CRUD CLIENTAS
# -------------------------------
@app.route("/clients", methods=["GET"])
def get_clients():
    clients = Client.query.all()
    return jsonify([c.to_dict() for c in clients])

@app.route("/clients/<int:id>", methods=["GET"])
def get_client(id):
    client = Client.query.get_or_404(id)
    return jsonify(client.to_dict())

@app.route("/clients", methods=["POST"])
def create_client():
    data = request.get_json()
    if not data.get("name") or not data.get("contact"):
        return jsonify({"error": "Nombre y contacto son obligatorios"}), 400

    client = Client(name=data["name"], contact=data["contact"])
    db.session.add(client)
    db.session.commit()
    return jsonify(client.to_dict()), 201

@app.route("/clients/<int:id>", methods=["PUT"])
def update_client(id):
    data = request.get_json()
    client = Client.query.get_or_404(id)
    client.name = data.get("name", client.name)
    client.contact = data.get("contact", client.contact)
    db.session.commit()
    return jsonify(client.to_dict())

@app.route("/clients/<int:id>", methods=["DELETE"])
def delete_client(id):
    client = Client.query.get_or_404(id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Clienta eliminada correctamente"}), 200

# -------------------------------
# CRUD PROCEDIMIENTOS
# -------------------------------
@app.route("/procedures", methods=["GET"])
def get_procedures():
    procedures = Procedure.query.all()
    return jsonify([p.to_dict() for p in procedures])

@app.route("/procedures/<int:id>", methods=["GET"])
def get_procedure(id):
    procedure = Procedure.query.get_or_404(id)
    return jsonify(procedure.to_dict())

@app.route("/procedures", methods=["POST"])
def create_procedure():
    data = request.get_json()
    if not data.get("name") or not data.get("price"):
        return jsonify({"error": "Nombre y precio son obligatorios"}), 400

    procedure = Procedure(name=data["name"], price=data["price"])
    db.session.add(procedure)
    db.session.commit()
    return jsonify(procedure.to_dict()), 201

@app.route("/procedures/<int:id>", methods=["PUT"])
def update_procedure(id):
    data = request.get_json()
    procedure = Procedure.query.get_or_404(id)
    procedure.name = data.get("name", procedure.name)
    procedure.price = data.get("price", procedure.price)
    db.session.commit()
    return jsonify(procedure.to_dict())

@app.route("/procedures/<int:id>", methods=["DELETE"])
def delete_procedure(id):
    procedure = Procedure.query.get_or_404(id)
    db.session.delete(procedure)
    db.session.commit()
    return jsonify({"message": "Procedimiento eliminado correctamente"}), 200

# -------------------------------
# CRUD INVENTARIO
# -------------------------------
@app.route("/inventory", methods=["GET"])
def get_inventory():
    inventory = Inventory.query.all()
    return jsonify([i.to_dict() for i in inventory])

@app.route("/inventory", methods=["POST"])
def create_inventory():
    data = request.get_json()
    if not data.get("product_name") or not data.get("category"):
        return jsonify({"error": "Nombre y categoría son obligatorios"}), 400

    inventory = Inventory(
        product_name=data["product_name"],
        category=data["category"],
        quantity=data.get("quantity", 0),
        min_stock=data.get("min_stock", 5),
        unit_price=data.get("unit_price", 0)
    )
    db.session.add(inventory)
    db.session.commit()
    return jsonify(inventory.to_dict()), 201

@app.route("/inventory/<int:id>", methods=["PUT"])
def update_inventory(id):
    data = request.get_json()
    inventory = Inventory.query.get_or_404(id)
    inventory.product_name = data.get("product_name", inventory.product_name)
    inventory.category = data.get("category", inventory.category)
    inventory.quantity = data.get("quantity", inventory.quantity)
    inventory.min_stock = data.get("min_stock", inventory.min_stock)
    inventory.unit_price = data.get("unit_price", inventory.unit_price)
    db.session.commit()
    return jsonify(inventory.to_dict())

@app.route("/inventory/<int:id>", methods=["DELETE"])
def delete_inventory(id):
    inventory = Inventory.query.get_or_404(id)
    db.session.delete(inventory)
    db.session.commit()
    return jsonify({"message": "Inventario eliminado correctamente"}), 200

# -------------------------------
# CRUD GASTOS
# -------------------------------
@app.route("/expenses", methods=["GET"])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([e.to_dict() for e in expenses])

@app.route("/expenses", methods=["POST"])
def create_expense():
    data = request.get_json()
    if not data.get("description") or not data.get("amount"):
        return jsonify({"error": "Descripción y monto son obligatorios"}), 400

    expense = Expense(
        description=data["description"],
        amount=data["amount"],
        category=data.get("category", "otros")
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify(expense.to_dict()), 201

@app.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    expense = Expense.query.get_or_404(id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Gasto eliminado correctamente"}), 200

# -------------------------------
# REPORTES Y CONTABILIDAD
# -------------------------------
@app.route("/reports/client/<string:client_name>", methods=["GET"])
def get_client_report(client_name):
    appointments = Appointment.query.filter_by(client_name=client_name).all()
    return jsonify([a.to_dict() for a in appointments])

@app.route("/reports/financial", methods=["GET"])
def get_financial_report():
    # Solo contar citas completadas para ingresos
    appointments = Appointment.query.filter_by(status='completed').all()
    
    income_by_procedure = {}
    total_income = 0
    
    for appt in appointments:
        for service in appt.services:
            proc_name = service.procedure.name if service.procedure else 'Desconocido'
            if proc_name not in income_by_procedure:
                income_by_procedure[proc_name] = {'count': 0, 'revenue': 0}
            income_by_procedure[proc_name]['count'] += service.quantity
            income_by_procedure[proc_name]['revenue'] += service.quantity * (service.procedure.price if service.procedure else 0)
            total_income += service.quantity * (service.procedure.price if service.procedure else 0)
    
    expenses = Expense.query.all()
    total_expenses = sum(e.amount for e in expenses)
    
    inventory = Inventory.query.all()
    inventory_value = sum(i.quantity * i.unit_price for i in inventory)
    
    return jsonify({
        "total_income": total_income,
        "income_by_procedure": income_by_procedure,
        "total_expenses": total_expenses,
        "net_profit": total_income - total_expenses,
        "inventory_value": inventory_value
    })

# -------------------------------
# MAIN
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
