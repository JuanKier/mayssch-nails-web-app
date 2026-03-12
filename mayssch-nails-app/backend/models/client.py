from extensions import db

class Client(db.Model):
    __tablename__ = "client"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)        # Nombre de la clienta
    contact = db.Column(db.String(100), nullable=False)     # Teléfono, email u otro contacto

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "contact": self.contact
        }