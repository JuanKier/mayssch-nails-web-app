from extensions import db

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime, nullable=False)
    client_name = db.Column(db.String(100), nullable=False)
    client_contact = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="pending")
    created_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    
    # Relación con servicios
    services = db.relationship('AppointmentService', backref='appointment', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "date_time": self.date_time.isoformat(),
            "client_name": self.client_name,
            "client_contact": self.client_contact,
            "status": self.status,
            "created_by": self.created_by,
            "services": [s.to_dict() for s in self.services]
        }
