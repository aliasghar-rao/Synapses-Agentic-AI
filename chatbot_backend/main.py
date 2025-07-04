"""
Enhanced main Flask application with prompt enhancement features.
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import logging
import sys
import json
from typing import Dict, Any, Optional

# Add the current directory to the path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Import our modules
from conversation import conversation_manager, Conversation
from prompt_manager import PromptManager
from llm_service import LLMService
from personas import get_persona_system_instruction

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("chatbot_backend.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize services
prompt_manager = PromptManager()
llm_service = LLMService()

# Request models
class ChatRequest:
    def __init__(self, data: Dict[str, Any]):
        self.message = data.get('message', '')
        self.personaId = data.get('personaId', 'default')
        self.promptMode = data.get('promptMode', False)
        self.conversationId = data.get('conversationId')

def get_current_user_id() -> str:
    """Get the current user ID (placeholder for authentication)."""
    return "anonymous"

@app.route('/api/chat', methods=['POST'])
def handle_chat():
    """
    Enhanced chat endpoint with prompt mode support.
    """
    try:
        # Parse request
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        chat_request = ChatRequest(data)
        user_id = get_current_user_id()
        
        logger.info(f"Chat request: user={user_id}, persona={chat_request.personaId}, promptMode={chat_request.promptMode}")
        
        # Get or create conversation
        conversation = conversation_manager.get_or_create_conversation(
            user_id=user_id,
            conversation_id=chat_request.conversationId
        )
        
        # Handle prompt mode initialization
        if chat_request.promptMode and not conversation.questionnaire:
            # Initialize questionnaire if not already in progress
            template_id = prompt_manager.select_template(chat_request.message)
            conversation.start_questionnaire(template_id, chat_request.message)
            
            logger.info(f"Started questionnaire with template: {template_id}")
            
            # Return first question
            first_question = prompt_manager.get_current_question(conversation)
            return jsonify({
                "message": first_question,
                "conversationId": conversation.id,
                "promptMode": True,
                "isQuestion": True,
                "templateId": template_id
            })
        
        # Handle questionnaire in progress
        if conversation.questionnaire and not conversation.questionnaire.get("complete", False):
            # Store answer to current question
            prompt_manager.store_answer(conversation, chat_request.message)
            
            logger.info(f"Stored answer for question {conversation.questionnaire.get('currentQuestionIndex', 0)}")
            
            # Check if more questions
            if prompt_manager.has_next_question(conversation):
                # Return next question
                next_question = prompt_manager.get_next_question(conversation)
                return jsonify({
                    "message": next_question,
                    "conversationId": conversation.id,
                    "promptMode": True,
                    "isQuestion": True
                })
            else:
                # Generate enhanced prompt
                enhanced_prompt = prompt_manager.generate_prompt(conversation)
                
                logger.info(f"Generated enhanced prompt: {enhanced_prompt[:100]}...")
                
                # Generate response using enhanced prompt
                system_instruction = get_persona_system_instruction(chat_request.personaId)
                response = llm_service.generate_response(
                    system_instruction=system_instruction,
                    message=enhanced_prompt
                )
                
                # Mark questionnaire as complete
                conversation.complete_questionnaire()
                
                # Add messages to conversation history
                conversation.add_message("user", conversation.original_message or chat_request.message)
                conversation.add_message("assistant", response)
                
                return jsonify({
                    "message": response,
                    "conversationId": conversation.id,
                    "promptMode": False,
                    "isQuestion": False,
                    "enhancedPrompt": enhanced_prompt  # Optional, for transparency
                })
        
        # Normal chat flow
        system_instruction = get_persona_system_instruction(chat_request.personaId)
        response = llm_service.generate_response(
            system_instruction=system_instruction,
            message=chat_request.message
        )
        
        # Add messages to conversation history
        conversation.add_message("user", chat_request.message)
        conversation.add_message("assistant", response)
        
        logger.info(f"Generated normal response for user: {user_id}")
        
        return jsonify({
            "message": response,
            "conversationId": conversation.id,
            "promptMode": False,
            "isQuestion": False
        })
        
    except Exception as e:
        logger.exception("Error in chat endpoint")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/templates', methods=['GET'])
def list_templates():
    """
    List available questionnaire templates.
    """
    try:
        templates = prompt_manager.list_templates()
        return jsonify({"templates": templates})
    except Exception as e:
        logger.exception("Error listing templates")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/conversations/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id: str):
    """
    Get conversation details.
    """
    try:
        conversation = conversation_manager.get_conversation(conversation_id)
        if not conversation:
            return jsonify({"error": "Conversation not found"}), 404
        
        return jsonify(conversation.to_dict())
    except Exception as e:
        logger.exception("Error getting conversation")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/conversations/<conversation_id>/reset', methods=['POST'])
def reset_conversation(conversation_id: str):
    """
    Reset conversation questionnaire state.
    """
    try:
        conversation = conversation_manager.get_conversation(conversation_id)
        if not conversation:
            return jsonify({"error": "Conversation not found"}), 404
        
        # Reset questionnaire state
        conversation.questionnaire = None
        conversation.original_message = None
        
        return jsonify({"message": "Conversation reset successfully"})
    except Exception as e:
        logger.exception("Error resetting conversation")
        return jsonify({"error": "Internal server error"}), 500

# Default route
@app.route('/')
def index():
    return jsonify({
        "message": "Chatbot Backend API",
        "version": "1.0.0",
        "endpoints": [
            "/api/chat",
            "/api/templates",
            "/api/conversations/<id>",
            "/api/conversations/<id>/reset"
        ]
    })

# Health check route
@app.route('/health')
def health():
    return jsonify({"status": "ok"})

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    # Get port from environment variable or default to 3000
    port = int(os.environ.get("PORT", 3000))
    
    print(f"Starting Chatbot Backend on port {port}")
    print("Available endpoints:")
    print("  POST /api/chat - Main chat endpoint with prompt mode support")
    print("  GET /api/templates - List available questionnaire templates")
    print("  GET /api/conversations/<id> - Get conversation details")
    print("  POST /api/conversations/<id>/reset - Reset conversation state")
    
    # Start server
    app.run(host='0.0.0.0', port=port, debug=True)

