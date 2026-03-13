from flask import Blueprint, jsonify
from extensions import db
from models.appointment import Appointment
from models.appointment_service import AppointmentService
from models.procedure import Procedure
from models.expense import Expense

bp = Blueprint('accounting', __name__)

@bp.route("/accounting/summary", methods=["GET"])
def get_accounting_summary():
    # Obtener todas las citas
    appointments = Appointment.query.all()
    
    # Calcular ingresos por procedimiento
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
    
    # Obtener gastos
    expenses = Expense.query.all()
    total_expenses = sum(e.amount for e in expenses)
    
    # Obtener inventario
    inventory = db.session.query(db.func.sum(Inventory.quantity * Inventory.unit_price)).scalar() or 0
    
    return jsonify({
        "total_income": total_income,
        "income_by_procedure": income_by_procedure,
        "total_expenses": total_expenses,
        "net_profit": total_income - total_expenses,
        "inventory_value": inventory
    })

@bp.route("/accounting/expenses", methods=["GET"])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([e.to_dict() for e in expenses])

@bp.route("/accounting/expenses", methods=["POST"])
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

@bp.route("/accounting/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    expense = Expense.query.get_or_404(id)
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Gasto eliminado correctamente"}), 200
