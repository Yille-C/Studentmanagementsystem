"""
Main Flask Application
Entry point for the Student Management System Backend
"""

from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from database import db, init_db
from routes import api
import os


def create_app(config_name='development'):
    """Create and configure Flask application"""
    
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize database
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    # Create tables
    with app.app_context():
        db.create_all()
        print("✓ Database tables created successfully!")
    
    # Root route
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Academic Analytics & Student Insights System API',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'students': '/api/students',
                'grades': '/api/grades',
                'attendance': '/api/attendance',
                'analytics': '/api/analytics',
                'predictions': '/api/predictions',
                'charts': '/api/charts',
                'data': '/api/data',
                'health': '/api/health'
            },
            'documentation': 'See README.md for full API documentation'
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'Endpoint not found',
            'message': str(error)
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'message': str(error)
        }), 500
    
    print("\n" + "="*60)
    print("🎓 STUDENT MANAGEMENT SYSTEM API")
    print("="*60)
    print(f"📍 Environment: {config_name}")
    print(f"🗄️  Database: {app.config['SQLALCHEMY_DATABASE_URI'].split('@')[1]}")
    print(f"🔗 CORS: Enabled for all origins")
    print("="*60 + "\n")
    
    return app


if __name__ == '__main__':
    # Get configuration from environment
    env = os.getenv('FLASK_ENV', 'development')
    
    # Create app
    app = create_app(env)
    
    # Run app
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=(env == 'development'))
