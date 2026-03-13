from flask import Blueprint, jsonify, request
from datetime import datetime
from extensions import db
from models.appointment import Appointment
from models.appointment_service import AppointmentService
from models.procedure import Procedure

bp = Blueprint('appointments', __name__)

@bp.route("/appointments", methods=["GET"])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify([a.to_dict() for a in appointments])

@bp.route("/appointments", methods=["POST"])
def create_appointment():
    data = request.get_json()
    if not data.get("client_name") or not data.get("client_contact"):
        return jsonify({"error": "Nombre y contacto son obligatorios"}), 400

    appointment = Appointment(
        date_time=datetime.fromisoformat(data["date_time"]),
        client_name=data["client_name"],
        client_contact=data["client_contact"],
        status=data.get("status", "pending"),
        created_by=data.get("created_by", None)
    )
    db.session.add(appointment)
    db.session.commit()

    # Agregar servicios
    if data.get("services"):
        for service in data["services"]:
            appt_service = AppointmentService(
                appointment_id=appointment.id,
                procedure_id=service["procedure_id"],
                quantity=service.get("quantity", 1)
            )
            db.session.add(appt_service)

    db.session.commit()
    return jsonify(appointment.to_dict()), 201

@bp.route("/appointments/<int:id>", methods=["PUT"])
def update_appointment(id):
    data = request.get_json()
    appointment = Appointment.query.get_or_404(id)
    appointment.status = data.get("status", appointment.status)
    db.session.commit()
    return jsonify(appointment.to_dict())

@bp.route("/appointments/<int:id>", methods=["DELETE"])
def delete_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({"message": "Cita eliminada correctamente"}), 200
