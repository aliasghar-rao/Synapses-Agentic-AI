"""
Enhanced LLM service with simplified response generation for the chatbot backend.
"""

import os
import requests
import json
import logging
from typing import Dict, List, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class LLMService:
    """
    Service for interacting with language models.
    """
    
    def __init__(self, api_url: str = None, api_key: str = None):
        """
        Initialize the LLM service.
        
        Args:
            api_url: URL of the LLM API server
            api_key: API key for authentication
        """
        self.api_url = api_url or os.environ.get("LLM_API_URL", "http://localhost:3001/api")
        self.api_key = api_key or os.environ.get("LLM_API_KEY", "test-api-key")
    
    def generate_response(
        self,
        system_instruction: str,
        message: str,
        model: str = "vicuna-13b",
        temperature: float = 0.7,
        max_tokens: int = 1024
    ) -> str:
        """
        Generate a response to a user message.
        
        Args:
            system_instruction: System instruction for the AI
            message: User message
            model: Model to use for generation
            temperature: Temperature for generation
            max_tokens: Maximum number of tokens to generate
            
        Returns:
            Generated response
        """
        try:
            # Prepare messages for the chat completion
            messages = [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": message}
            ]
            
            # Call the chat completion API
            response = self.chat_completion(
                messages=messages,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens
            )
            
            # Extract the assistant's message
            assistant_message = self.extract_assistant_message(response)
            
            if assistant_message:
                return assistant_message
            else:
                logger.error(f"Failed to extract response from LLM: {response}")
                return "I apologize, but I'm having trouble generating a response right now. Please try again."
        
        except Exception as e:
            logger.exception("Error generating response")
            return "I apologize, but I encountered an error while processing your request. Please try again."
    
    def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: str = "vicuna-13b",
        temperature: float = 0.7,
        max_tokens: int = 1024,
        force_cloud: bool = False
    ) -> Dict[str, Any]:
        """
        Generate a chat completion.
        
        Args:
            messages: List of messages in the conversation
            model: Model to use for generation
            temperature: Temperature for generation
            max_tokens: Maximum number of tokens to generate
            force_cloud: Whether to force using the cloud model
            
        Returns:
            Response from the LLM API
        """
        try:
            headers = {
                "Content-Type": "application/json",
                "X-API-Key": self.api_key
            }
            
            data = {
                "messages": messages,
                "options": {
                    "model": model,
                    "temperature": temperature,
                    "maxTokens": max_tokens,
                    "forceCloud": force_cloud
                }
            }
            
            response = requests.post(
                f"{self.api_url}/chat",
                headers=headers,
                json=data,
                timeout=30  # Add timeout
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error from LLM API: {response.status_code} - {response.text}")
                # Return a mock response for development/testing
                return self._mock_response(messages[-1]["content"])
        
        except requests.exceptions.RequestException as e:
            logger.warning(f"LLM API not available, using mock response: {e}")
            # Return a mock response when the API is not available
            return self._mock_response(messages[-1]["content"])
        
        except Exception as e:
            logger.exception("Error calling LLM API")
            return self._mock_response(messages[-1]["content"])
    
    def _mock_response(self, user_message: str) -> Dict[str, Any]:
        """
        Generate a mock response for development/testing.
        
        Args:
            user_message: The user's message
            
        Returns:
            Mock API response
        """
        mock_responses = [
            "Thank you for your message. I understand you're asking about: {message}. This is a mock response for development purposes.",
            "I appreciate your question regarding: {message}. I'm here to help with that topic.",
            "That's an interesting point about: {message}. Let me provide some assistance with that.",
            "I see you're interested in: {message}. I'd be happy to help you with that."
        ]
        
        import random
        response_template = random.choice(mock_responses)
        response_content = response_template.format(message=user_message[:100])
        
        return {
            "choices": [
                {
                    "message": {
                        "content": response_content
                    }
                }
            ]
        }
    
    def get_available_models(self) -> List[Dict[str, Any]]:
        """
        Get a list of available models.
        
        Returns:
            List of available models
        """
        try:
            headers = {
                "X-API-Key": self.api_key
            }
            
            response = requests.get(
                f"{self.api_url}/models",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json().get("data", [])
            else:
                logger.error(f"Error getting models: {response.status_code} - {response.text}")
                return []
        
        except Exception as e:
            logger.exception("Error getting models")
            return []
    
    def extract_assistant_message(self, response: Dict[str, Any]) -> Optional[str]:
        """
        Extract the assistant's message from an LLM API response.
        
        Args:
            response: Response from the LLM API
            
        Returns:
            Assistant's message or None if not found
        """
        try:
            if "error" in response:
                return f"Error: {response['error']}"
            
            if "choices" in response and len(response["choices"]) > 0:
                return response["choices"][0]["message"]["content"]
            
            return None
        
        except Exception as e:
            logger.exception("Error extracting assistant message")
            return None

