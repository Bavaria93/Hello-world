from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)  # Configurando Flask-Migrate

# Modelos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    addresses_summary = db.Column(db.Text, nullable=True)  # Campo para armazenar dados de endereço consolidados

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    logradouro = db.Column(db.String(200), nullable=False)
    numero = db.Column(db.String(10), nullable=False)
    bairro = db.Column(db.String(100), nullable=False)
    cidade = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.String(50), nullable=False)
    cep = db.Column(db.String(20), nullable=False)
    user = db.relationship('User', backref=db.backref('addresses', lazy=True))

# Rotas
@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()

    # Validação dos campos obrigatórios
    if 'name' not in data or 'email' not in data or 'cpf' not in data or 'phone' not in data or 'age' not in data or 'addresses' not in data:
        return jsonify({'message': 'Todos os campos são obrigatórios'}), 400

    try:
        # Criar novo usuário
        new_user = User(
            name=data['name'],
            email=data['email'],
            cpf=data['cpf'],
            phone=data['phone'],
            age=data['age']
        )
        db.session.add(new_user)
        db.session.commit()

        addresses_summary = ""
        # Adicionar endereços
        for addr in data['addresses']:
            if not all(k in addr for k in ('cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado')):
                return jsonify({'message': 'Dados de endereço incompletos'}), 400

            new_address = Address(
                user_id=new_user.id,
                cep=addr['cep'],
                logradouro=addr['logradouro'],
                numero=addr['numero'],
                bairro=addr['bairro'],
                cidade=addr['cidade'],
                estado=addr['estado']
            )
            db.session.add(new_address)
            addresses_summary += f"{addr['logradouro']}, {addr['numero']} - {addr['bairro']}, {addr['cidade']}, {addr['estado']} (CEP: {addr['cep']}) | "

        # Armazenar addresses_summary
        addresses_summary = addresses_summary.strip(" | ")
        new_user.addresses_summary = addresses_summary
        db.session.commit()

        return jsonify({'message': 'Usuário e endereços adicionados com sucesso!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao salvar usuário: {e}'}), 500

@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        users_list = []
        for user in users:
            addresses = [
                {
                    'id': addr.id,
                    'cep': addr.cep,
                    'logradouro': addr.logradouro,
                    'numero': addr.numero,
                    'bairro': addr.bairro,
                    'cidade': addr.cidade,
                    'estado': addr.estado
                }
                for addr in user.addresses
            ]
            users_list.append({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'cpf': user.cpf,
                'phone': user.phone,
                'age': user.age,
                'addresses': addresses,
                'addresses_summary': user.addresses_summary  # Inclui addresses_summary na resposta
            })
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({'message': f'Erro ao buscar usuários: {e}'}), 500

@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    try:
        user = User.query.get(id)
        if not user:
            return jsonify({'message': 'Usuário não encontrado'}), 404

        # Atualizar dados do usuário
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.cpf = data.get('cpf', user.cpf)
        user.phone = data.get('phone', user.phone)
        user.age = data.get('age', user.age)
        db.session.commit()

        # Atualizar endereços
        Address.query.filter_by(user_id=id).delete()  # Remove endereços antigos
        addresses_summary = ""
        for addr in data['addresses']:
            if not all(k in addr for k in ('cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado')):
                return jsonify({'message': 'Dados de endereço incompletos'}), 400

            new_address = Address(
                user_id=id,
                cep=addr['cep'],
                logradouro=addr['logradouro'],
                numero=addr['numero'],
                bairro=addr['bairro'],
                cidade=addr['cidade'],
                estado=addr['estado']
            )
            db.session.add(new_address)
            addresses_summary += f"{addr['logradouro']}, {addr['numero']} - {addr['bairro']}, {addr['cidade']}, {addr['estado']} (CEP: {addr['cep']}) | "
        
        addresses_summary = addresses_summary.strip(" | ")
        user.addresses_summary = addresses_summary
        db.session.commit()

        return jsonify({'message': 'Usuário e endereços atualizados com sucesso!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao atualizar usuário: {e}'}), 500

@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify({'message': 'Usuário não encontrado'}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Usuário excluído com sucesso!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao excluir usuário: {e}'}), 500

# Gerenciamento do Banco de Dados
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
