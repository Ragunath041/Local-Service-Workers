from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
from datetime import datetime
import os
from dotenv import load_dotenv
from bson import ObjectId
import jwt

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['workhub_db']

# Collections
users = db['users']
workers = db['workers']
services = db['services']  # New collection for services
messages = db['messages']  # New collection for messages

# Admin credentials (hardcoded as requested)
ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "Admin@123"

@app.route('/api/register/user', methods=['POST'])
def register_user():
    data = request.get_json()
    
    # Check if email already exists
    if users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already registered'}), 400
    
    # Hash password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), salt)
    
    # Create user document
    user = {
        'email': data['email'],
        'password': hashed_password,
        'name': data['name'],
        'role': 'user',
        'created_at': datetime.utcnow()
    }
    
    result = users.insert_one(user)
    user['_id'] = str(result.inserted_id)
    return jsonify({'message': 'User registered successfully', 'user': user}), 201

@app.route('/api/register/worker', methods=['POST'])
def register_worker():
    try:
        data = request.json
        # Check if worker already exists
        if workers.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already registered'}), 400

        # Hash the password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        worker = {
            'email': data['email'],
            'password': hashed_password,
            'name': data['name'],
            'phoneNumber': data['phoneNumber'],
            'role': 'worker',
            'createdAt': datetime.utcnow()
        }
        
        result = workers.insert_one(worker)
        worker['_id'] = str(result.inserted_id)
        del worker['password']  # Don't send password back
        
        return jsonify(worker), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    # Check for admin login
    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        return jsonify({
            'message': 'Login successful',
            'role': 'admin',
            'email': email
        }), 200
    
    # Check user collection
    user = users.find_one({'email': email})
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({
            'message': 'Login successful',
            'role': 'user',
            'email': email,
            'name': user['name'],
            '_id': str(user['_id'])
        }), 200
    
    # Check worker collection
    worker = workers.find_one({'email': email})
    if worker and bcrypt.checkpw(password.encode('utf-8'), worker['password']):
        return jsonify({
            'message': 'Login successful',
            'role': 'worker',
            'email': email,
            'name': worker['name'],
            '_id': str(worker['_id'])
        }), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

# Service Routes
@app.route('/api/services', methods=['POST'])
def create_service():
    try:
        data = request.json
        worker_id = data['workerId']
        
        # Get worker details
        worker = workers.find_one({'_id': ObjectId(worker_id)})
        if not worker:
            return jsonify({'error': 'Worker not found'}), 404

        service = {
            'title': data['title'],
            'description': data['description'],
            'category': data['category'],
            'price': data['price'],
            'location': data['location'],
            'workerId': worker_id,
            'status': 'pending',
            'createdAt': datetime.utcnow(),
            'providerName': worker['name'],
            'providerEmail': worker['email'],
            'providerPhone': worker['phoneNumber']
        }
        
        result = services.insert_one(service)
        service['_id'] = str(result.inserted_id)
        return jsonify(service), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/services/approved', methods=['GET'])
def get_approved_services():
    try:
        # Get all approved services
        approved_services = list(services.find({'status': 'approved'}))
        
        # Add worker details to each service
        for service in approved_services:
            service['_id'] = str(service['_id'])
            worker = workers.find_one({'_id': ObjectId(service['workerId'])})
            if worker:
                service['workerName'] = worker['name']
                service['workerEmail'] = worker['email']
            else:
                service['workerName'] = 'Unknown Provider'
                service['workerEmail'] = ''
        
        return jsonify(approved_services)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/services/categories', methods=['GET'])
def get_service_categories():
    try:
        # Get unique categories from approved services
        categories = services.distinct('category', {'status': 'approved'})
        return jsonify(categories)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/services/category/<category>', methods=['GET'])
def get_services_by_category(category):
    try:
        # Get services by category
        category_services = list(services.find({
            'status': 'approved',
            'category': category
        }))
        
        # Add worker details to each service
        for service in category_services:
            service['_id'] = str(service['_id'])
            worker = workers.find_one({'_id': ObjectId(service['workerId'])})
            if worker:
                service['workerName'] = worker['name']
                service['workerEmail'] = worker['email']
            else:
                service['workerName'] = 'Unknown Provider'
                service['workerEmail'] = ''
        
        return jsonify(category_services)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/services/<service_id>', methods=['GET'])
def get_service(service_id):
    try:
        service = services.find_one({'_id': ObjectId(service_id)})
        if not service:
            return jsonify({'error': 'Service not found'}), 404
        service['_id'] = str(service['_id'])
        return jsonify(service)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/services/<service_id>', methods=['PUT'])
def update_service(service_id):
    try:
        data = request.get_json()
        
        # Fields that can be updated
        update_data = {
            'title': data.get('title'),
            'description': data.get('description'),
            'price': data.get('price'),
            'category': data.get('category'),
            'location': data.get('location')
        }
        
        # Remove None values
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        result = services.update_one(
            {'_id': ObjectId(service_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Service not found'}), 404
            
        # Get updated service
        updated_service = services.find_one({'_id': ObjectId(service_id)})
        updated_service['_id'] = str(updated_service['_id'])
        
        return jsonify({'message': 'Service updated successfully', 'service': updated_service})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/worker/<worker_id>/services', methods=['GET'])
def get_worker_services(worker_id):
    worker_services = list(services.find({'workerId': worker_id}))
    # Convert ObjectId to string for JSON serialization
    for service in worker_services:
        service['_id'] = str(service['_id'])
    return jsonify(worker_services)

@app.route('/api/services/pending', methods=['GET'])
def get_pending_services():
    pending = list(services.find({'status': 'pending'}))
    for service in pending:
        service['_id'] = str(service['_id'])
    return jsonify(pending)

@app.route('/api/services/<service_id>/approve', methods=['POST'])
def approve_service(service_id):
    services.update_one(
        {'_id': ObjectId(service_id)},
        {'$set': {'status': 'approved'}}
    )
    return jsonify({'message': 'Service approved successfully'})

@app.route('/api/services/<service_id>/reject', methods=['POST'])
def reject_service(service_id):
    services.update_one(
        {'_id': ObjectId(service_id)},
        {'$set': {'status': 'rejected'}}
    )
    return jsonify({'message': 'Service rejected successfully'})

# Message Routes
@app.route('/api/messages', methods=['POST'])
def create_message():
    try:
        data = request.json
        message = {
            'senderId': data['senderId'],
            'receiverId': data['receiverId'],
            'content': data['content'],
            'serviceId': data.get('serviceId'),
            'createdAt': datetime.utcnow(),
            'read': False
        }
        result = messages.insert_one(message)
        message['_id'] = str(result.inserted_id)
        return jsonify(message), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/messages/user/<user_id>', methods=['GET'])
def get_user_messages(user_id):
    try:
        user_messages = list(messages.find({
            '$or': [
                {'senderId': user_id},
                {'receiverId': user_id}
            ]
        }).sort('createdAt', -1))
        
        # Convert ObjectId to string and add other party names
        for message in user_messages:
            message['_id'] = str(message['_id'])
            other_id = message['receiverId'] if message['senderId'] == user_id else message['senderId']
            other_user = users.find_one({'_id': ObjectId(other_id)})
            if not other_user:
                other_user = workers.find_one({'_id': ObjectId(other_id)})
            message['otherPartyName'] = other_user['name'] if other_user else "Unknown"
            
        return jsonify(user_messages)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/messages/worker/<worker_id>', methods=['GET'])
def get_worker_messages(worker_id):
    try:
        worker_messages = list(messages.find({
            '$or': [
                {'senderId': worker_id},
                {'receiverId': worker_id}
            ]
        }).sort('createdAt', -1))
        
        # Convert ObjectId to string and add other party names
        for message in worker_messages:
            message['_id'] = str(message['_id'])
            other_id = message['receiverId'] if message['senderId'] == worker_id else message['senderId']
            other_user = users.find_one({'_id': ObjectId(other_id)})
            if not other_user:
                other_user = workers.find_one({'_id': ObjectId(other_id)})
            message['otherPartyName'] = other_user['name'] if other_user else "Unknown"
            
        return jsonify(worker_messages)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/messages/unread/<user_id>', methods=['GET'])
def get_unread_count(user_id):
    try:
        count = messages.count_documents({
            'receiverId': user_id,
            'read': False
        })
        return jsonify(count)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/messages/<message_id>/read', methods=['PUT'])
def mark_as_read(message_id):
    try:
        messages.update_one(
            {'_id': ObjectId(message_id)},
            {'$set': {'read': True}}
        )
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000) 