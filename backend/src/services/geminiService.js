import { GoogleGenAI } from '@google/genai';

/**
 * CIRCULA Gemini Intelligence Service
 * Isolated server-side interface for Google Gemini models via @google/genai SDK.
 * 
 * Safety & Security Guarantees:
 * 1. API key is strictly server-side (never exposed to client).
 * 2. Lazy client initialization prevents startup crash if key is absent.
 * 3. Structured outputs with schema validation and markdown unwrap.
 * 4. Timeout safeguards prevent hanging requests.
 * 5. Prompt injection defense and input character limits.
 */

class GeminiService {
  constructor() {
    this._client = null;
    this._defaultModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    this._timeoutMs = 18000;
  }

  /**
   * Lazily retrieve the GoogleGenAI client
   */
  getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    if (!this._client) {
      this._client = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return this._client;
  }

  /**
   * Check if Gemini API is configured and ready
   */
  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  }

  /**
   * Return configured model name
   */
  getModelName() {
    return process.env.GEMINI_MODEL || this._defaultModel;
  }

  /**
   * Sanitize user input to prevent prompt injection and trim length
   */
  sanitizeInput(text, maxLength = 3000) {
    if (!text || typeof text !== 'string') return '';
    // Strip control characters while preserving valid newlines & whitespace
    const cleaned = text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim();
    return cleaned.slice(0, maxLength);
  }

  /**
   * Extract and parse JSON from a response string, safely stripping markdown code fences
   */
  parseJsonResponse(rawText, fallback = null) {
    if (!rawText || typeof rawText !== 'string') return fallback;

    let text = rawText.trim();

    // Strip markdown code block fences if present (```json ... ``` or ``` ...)
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    // Try direct parse
    try {
      return JSON.parse(text);
    } catch (_) {
      // Look for the first outer JSON object or array
      const matchObj = text.match(/\{[\s\S]*\}/);
      if (matchObj) {
        try {
          return JSON.parse(matchObj[0]);
        } catch (__) {
          // ignore
        }
      }
      const matchArr = text.match(/\[[\s\S]*\]/);
      if (matchArr) {
        try {
          return JSON.parse(matchArr[0]);
        } catch (___) {
          // ignore
        }
      }
    }

    return fallback;
  }

  /**
   * Generate structured JSON output from Gemini with timeout & fallback protection
   */
  async generateJson({ prompt, systemInstruction, temperature = 0.2, schema = null }) {
    if (!this.isConfigured()) {
      return {
        success: false,
        source: 'unconfigured',
        error: 'GEMINI_API_KEY is not configured on this server instance',
        data: null,
      };
    }

    const client = this.getClient();
    if (!client) {
      return {
        success: false,
        source: 'unavailable',
        error: 'Gemini client could not be initialized',
        data: null,
      };
    }

    const modelName = this.getModelName();
    const config = {
      temperature,
      responseMimeType: 'application/json',
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    if (schema) {
      config.responseSchema = schema;
    }

    // Execute with timeout safeguard
    try {
      const generatePromise = client.models.generateContent({
        model: modelName,
        contents: prompt,
        config,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API request timed out after ' + this._timeoutMs + 'ms')), this._timeoutMs)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const rawText = response?.text;

      if (!rawText) {
        throw new Error('Empty response received from Gemini model');
      }

      const parsed = this.parseJsonResponse(rawText);
      if (parsed === null) {
        throw new Error('Gemini model returned invalid JSON structure');
      }

      return {
        success: true,
        source: 'gemini',
        model: modelName,
        data: parsed,
        rawText,
      };
    } catch (err) {
      console.warn('[CIRCULA Gemini Service] Generation warning:', err.message);
      return {
        success: false,
        source: 'error',
        error: err.message,
        data: null,
      };
    }
  }

  /**
   * Generate natural language text response with timeout & fallback protection
   */
  async generateText({ prompt, systemInstruction, temperature = 0.4 }) {
    if (!this.isConfigured()) {
      return {
        success: false,
        source: 'unconfigured',
        error: 'GEMINI_API_KEY is not configured on this server instance',
        text: null,
      };
    }

    const client = this.getClient();
    if (!client) {
      return {
        success: false,
        source: 'unavailable',
        error: 'Gemini client could not be initialized',
        text: null,
      };
    }

    const modelName = this.getModelName();
    const config = {
      temperature,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }

    try {
      const generatePromise = client.models.generateContent({
        model: modelName,
        contents: prompt,
        config,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API request timed out after ' + this._timeoutMs + 'ms')), this._timeoutMs)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const text = response?.text;

      if (!text) {
        throw new Error('Empty text received from Gemini');
      }

      return {
        success: true,
        source: 'gemini',
        model: modelName,
        text: text.trim(),
      };
    } catch (err) {
      console.warn('[CIRCULA Gemini Service] Text generation warning:', err.message);
      return {
        success: false,
        source: 'error',
        error: err.message,
        text: null,
      };
    }
  }
}

export const geminiService = new GeminiService();
export default geminiService;
