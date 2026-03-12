from flask import Blueprint, request, jsonify
from extensions import db
from models.client import Client

clients_bp = Blueprint("clients", __name__)

# Obtener todas las clientas
@clients_bp.route("/clients", methods=["GET"])
def get_clients():
    clients = Client.query.all()
    return jsonify([c.to_dict() for c in clients])

# Obtener una clienta por ID
@clients_bp.route("/clients/<int:id>", methods=["GET"])
def get_client(id):
    client = Client.query.get_or_404(id)
    return jsonify(client.to_dict())

# Crear una nueva clienta
@clients_bp.route("/clients", methods=["POST"])
def create_client():
    data = request.json
    if not data.get("name") or not data.get("contact"):
        return jsonify({"error": "Nombre y contacto son obligatorios"}), 400

    client = Client(name=data["name"], contact=data["contact"])
    db.session.add(client)
    db.session.commit()
    return jsonify(client.to_dict()), 201

# Actualizar una clienta existente
@clients_bp.route("/clients/<int:id>", methods=["PUT"])
def update_client(id):
    client = Client.query.get_or_404(id)
    data = request.json

    if "name" in data:
        client.name = data["name"]
    if "contact" in data:
        client.contact = data["contact"]

    db.session.commit()
    return jsonify(client.to_dict())

# Eliminar una clienta
@clients_bp.route("/clients/<int:id>", methods=["DELETE"])
def delete_client(id):
    client = Client.query.get_or_404(id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Clienta eliminada correctamente"})