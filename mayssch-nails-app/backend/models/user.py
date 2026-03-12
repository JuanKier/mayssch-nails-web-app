from extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="staff")

    appointments = db.relationship("Appointment", backref="user", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "contact": self.contact,
            "role": self.role
        }