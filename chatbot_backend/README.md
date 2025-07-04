# Chatbot Backend - Enhanced with Prompt Mode

This is an enhanced chatbot backend that supports conversation mode toggling and prompt enhancement through questionnaires.

## Features

- **Normal Chat Mode**: Standard conversational AI responses
- **Prompt Mode**: Enhanced prompts through guided questionnaires
- **Multiple Templates**: Code generation, content creation, and general purpose
- **Conversation Management**: Persistent conversation state
- **Template Selection**: Automatic template selection based on user input
- **Mock LLM Service**: Development-friendly with fallback responses

## API Endpoints

### POST /api/chat
Main chat endpoint with prompt mode support.

**Request:**
```json
{
  "message": "I need help with Python code",
  "personaId": "code-assistant",
  "promptMode": true,
  "conversationId": "optional-conversation-id"
}
```

**Response (Normal Mode):**
```json
{
  "message": "AI response here",
  "conversationId": "conversation-id",
  "promptMode": false,
  "isQuestion": false
}
```

**Response (Prompt Mode - Question):**
```json
{
  "message": "What programming language are you working with?",
  "conversationId": "conversation-id",
  "promptMode": true,
  "isQuestion": true,
  "templateId": "code-generation"
}
```

**Response (Prompt Mode - Final):**
```json
{
  "message": "AI response based on enhanced prompt",
  "conversationId": "conversation-id",
  "promptMode": false,
  "isQuestion": false,
  "enhancedPrompt": "The generated enhanced prompt"
}
```

### GET /api/templates
List available questionnaire templates.

**Response:**
```json
{
  "templates": [
    {
      "id": "code-generation",
      "name": "Code Generation",
      "description": "Generate prompts for code generation, debugging, or refactoring tasks"
    }
  ]
}
```

### GET /api/conversations/{id}
Get conversation details.

### POST /api/conversations/{id}/reset
Reset conversation questionnaire state.

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py --port 3000
```

## Testing

Run the test script to validate functionality:
```bash
python test_backend.py
```

## Templates

The system includes three built-in templates:

1. **Code Generation**: For programming tasks, debugging, and code-related requests
2. **Content Creation**: For writing blog posts, articles, and marketing content
3. **General Purpose**: Fallback template for any other type of request

## Conversation Flow

1. **Normal Mode**: User sends message → AI responds directly
2. **Prompt Mode**: 
   - User sends message with `promptMode: true`
   - System selects appropriate template
   - System asks questionnaire questions one by one
   - User answers each question
   - System generates enhanced prompt
   - AI responds with enhanced context

## Development Notes

- The LLM service includes mock responses for development when the actual LLM API is not available
- Conversation state is managed in memory (suitable for development/testing)
- Templates are automatically saved to disk for persistence
- CORS is enabled for frontend integration

## File Structure

- `main.py`: Flask application with API endpoints
- `conversation.py`: Conversation and message management
- `prompt_manager.py`: Questionnaire templates and prompt generation
- `llm_service.py`: LLM API integration with mock fallback
- `personas.py`: System instructions for different AI personas
- `test_backend.py`: Comprehensive test suite

