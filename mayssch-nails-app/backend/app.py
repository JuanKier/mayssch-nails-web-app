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
from models.client import Client
from models.procedure import Procedure
from models.user import User

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
    if not data.get("client_name") or not data.get("client_contact"):
        return jsonify({"error": "Nombre y contacto son obligatorios"}), 400

    appointment = Appointment(
        date_time=datetime.fromisoformat(data["date_time"]),
        procedure_type=data.get("procedure_type", "Manicura"),
        client_name=data["client_name"],
        client_contact=data["client_contact"],
        status=data.get("status", "pending"),
        created_by=data.get("created_by", None)
    )
    db.session.add(appointment)
    db.session.commit()
    return jsonify(appointment.to_dict()), 201

@app.route("/appointments/<int:id>", methods=["PUT"])
def update_appointment(id):
    data = request.get_json()
    appointment = Appointment.query.get_or_404(id)
    appointment.status = data.get("status", appointment.status)
    appointment.procedure_type = data.get("procedure_type", appointment.procedure_type)
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
# MAIN
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)