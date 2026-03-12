from flask import Blueprint, request, jsonify
from extensions import db
from models.procedure import Procedure

procedures_bp = Blueprint("procedures", __name__)

# Obtener todos los procedimientos
@procedures_bp.route("/procedures", methods=["GET"])
def get_procedures():
    procedures = Procedure.query.all()
    return jsonify([p.to_dict() for p in procedures])

# Obtener un procedimiento por ID
@procedures_bp.route("/procedures/<int:id>", methods=["GET"])
def get_procedure(id):
    procedure = Procedure.query.get_or_404(id)
    return jsonify(procedure.to_dict())

# Crear un nuevo procedimiento
@procedures_bp.route("/procedures", methods=["POST"])
def create_procedure():
    data = request.json
    if not data.get("name") or not data.get("price"):
        return jsonify({"error": "Nombre y precio son obligatorios"}), 400

    procedure = Procedure(name=data["name"], price=data["price"])
    db.session.add(procedure)
    db.session.commit()
    return jsonify(procedure.to_dict()), 201

# Actualizar un procedimiento existente
@procedures_bp.route("/procedures/<int:id>", methods=["PUT"])
def update_procedure(id):
    procedure = Procedure.query.get_or_404(id)
    data = request.json

    if "name" in data:
        procedure.name = data["name"]
    if "price" in data:
        procedure.price = data["price"]

    db.session.commit()
    return jsonify(procedure.to_dict())

# Eliminar un procedimiento
@procedures_bp.route("/procedures/<int:id>", methods=["DELETE"])
def delete_procedure(id):
    procedure = Procedure.query.get_or_404(id)
    db.session.delete(procedure)
    db.session.commit()
    return jsonify({"message": "Procedimiento eliminado correctamente"})