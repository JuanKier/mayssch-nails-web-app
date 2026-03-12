from flask import Blueprint, request, jsonify
from extensions import db
from models.appointment import Appointment
from datetime import datetime

appointments_bp = Blueprint("appointments", __name__)

@appointments_bp.route("/appointments", methods=["GET"])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([a.to_dict() for a in appointments])

@appointments_bp.route("/appointments", methods=["POST"])
def create_appointment():
    data = request.json
    if not data.get("client_name") or not data.get("client_contact"):
        return jsonify({"error": "Nombre y contacto son obligatorios"}), 400

    appointment = Appointment(
        date_time=datetime.fromisoformat(data["date_time"]),
        procedure_type=data["procedure_type"],
        client_name=data["client_name"],
        client_contact=data["client_contact"],
        status=data.get("status", "pending")
    )
    db.session.add(appointment)
    db.session.commit()
    return jsonify(appointment.to_dict()), 201

@appointments_bp.route("/appointments/<int:id>", methods=["PUT"])
def update_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    data = request.json
    if "status" in data:
        appointment.status = data["status"]
    if "procedure_type" in data:
        appointment.procedure_type = data["procedure_type"]
    db.session.commit()
    return jsonify(appointment.to_dict())