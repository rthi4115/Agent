import json
import logging
from backend.config import GEMINI_API_KEY
import google.generativeai as genai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("BaseAgent")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini API successfully configured.")
else:
    logger.warning("GEMINI_API_KEY not found in environment variables. Running in mock fallback mode.")

class BaseAgent:
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name
        self.client_configured = bool(GEMINI_API_KEY)

    def _call_gemini_json(self, prompt: str, schema_class=None) -> dict:
        """
        Calls Gemini API requesting a JSON response. 
        Falls back to generating mock data if Gemini is not configured or fails.
        """
        if not self.client_configured:
            logger.warning("Gemini not configured. Generating mock response for prompt.")
            return self._generate_mock_response(prompt, schema_class)

        try:
            model = genai.GenerativeModel(self.model_name)
            generation_config = {"response_mime_type": "application/json"}
            
            if schema_class:
                # Generativeai supports passing pydantic class for structured output
                generation_config["response_schema"] = schema_class

            response = model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            # Parse the JSON response
            result = json.loads(response.text.strip())
            return result
        except Exception as e:
            logger.error(f"Error calling Gemini: {e}. Falling back to mock data.")
            return self._generate_mock_response(prompt, schema_class)

    def _call_gemini_text(self, prompt: str) -> str:
        """
        Calls Gemini API requesting text response.
        """
        if not self.client_configured:
            return "This is a mock response from CareerPilot AI Coach. To enable live AI support, please set your GEMINI_API_KEY in the backend .env file."

        try:
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error calling Gemini: {e}")
            return "Unable to contact CareerPilot AI Coach at this moment. Please check your network connection and API key configuration."

    def _generate_mock_response(self, prompt: str, schema_class) -> dict:
        """
        Fallback generator that returns structured mock data conforming to the schematic class or type.
        """
        # We can implement mock builders in subclass, or inspect schema_class
        # A simple fallback:
        if not schema_class:
            return {"status": "success", "message": "Mock response: API Key was missing."}
        
        # We inspect the schema class to generate mock dictionary fields matching it
        mock_obj = {}
        try:
            properties = schema_class.schema().get("properties", {})
            for field, prop_details in properties.items():
                field_type = prop_details.get("type", "string")
                if field_type == "integer":
                    # Generate a sensible mock int
                    if "score" in field.lower() or "percent" in field.lower():
                        mock_obj[field] = 78
                    else:
                        mock_obj[field] = 5
                elif field_type == "array":
                    items_type = prop_details.get("items", {}).get("type", "string")
                    if items_type == "object":
                        # Nested structures can be populated inside derived mock details
                        mock_obj[field] = []
                    else:
                        mock_obj[field] = [f"Sample Item 1 (Mock)", f"Sample Item 2 (Mock)"]
                elif field_type == "object":
                    mock_obj[field] = {}
                else:
                    # string
                    mock_obj[field] = f"Mock description/value for {field.replace('_', ' ')}"
            return mock_obj
        except Exception as e:
            logger.error(f"Error creating auto mock schema structure: {e}")
            return {}
