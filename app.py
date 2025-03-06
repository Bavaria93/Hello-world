from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    age = db.Column(db.Integer, nullable=False)

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    user = db.relationship('User', backref=db.backref('addresses', lazy=True))

@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    new_user = User(name=data['name'], email=data['email'], age=data['age'])
    db.session.add(new_user)
    db.session.commit()

    addresses = data.get('addresses', [])
    for addr in addresses:
        new_address = Address(user_id=new_user.id, address=addr)
        db.session.add(new_address)
    
    db.session.commit()
    return jsonify({'message': 'User and addresses added successfully!'})

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = []
    for user in users:
        addresses = [{'id': addr.id, 'address': addr.address} for addr in user.addresses]
        users_list.append({'id': user.id, 'name': user.name, 'email': user.email, 'age': user.age, 'addresses': addresses})
    return jsonify(users_list)

@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    user = User.query.get(id)
    if user:
        user.name = data['name']
        user.email = data['email']
        user.age = data['age']
        db.session.commit()

        # Atualizar endereços
        Address.query.filter_by(user_id=id).delete()
        addresses = data.get('addresses', [])
        for addr in addresses:
            new_address = Address(user_id=id, address=addr)
            db.session.add(new_address)

        db.session.commit()
        return jsonify({'message': 'User and addresses updated successfully!'})
    return jsonify({'message': 'User not found!'}), 404

@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully!'})
    return jsonify({'message': 'User not found!'}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
