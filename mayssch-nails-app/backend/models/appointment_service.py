from extensions import db

class AppointmentService(db.Model):
    __tablename__ = 'appointment_service'
    
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.id'), nullable=False)
    procedure_id = db.Column(db.Integer, db.ForeignKey('procedure.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    
    # Relaciones (sin backref porque ya está definido en Appointment)
    procedure = db.relationship('Procedure')
    
    def to_dict(self):
        return {
            'id': self.id,
            'appointment_id': self.appointment_id,
            'procedure_id': self.procedure_id,
            'procedure_name': self.procedure.name if self.procedure else '',
            'procedure_price': self.procedure.price if self.procedure else 0,
            'quantity': self.quantity,
        }
