import axios from "axios";

const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply?: string;
  Response?: string;
  error?: string;
}

export class ChatService {
  static async sendMessage(message: string): Promise<string> {
    try {
      let url: string;
      if (API_BASE_URL) {
        url = new URL("/api/Chat", API_BASE_URL).toString();
      } else {
        url = "/api/Chat";
      }

      const response = await axios.post<ChatResponse>(url, { message } as ChatRequest, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Handle both reply and Response field names
      const reply = response.data.reply || response.data.Response;

      if (!reply) {
        console.error("No reply in response:", response.data);
        throw new Error("No response from server");
      }

      return reply;
    } catch (error: any) {
      console.error("Error sending chat message:", error);

      // Provide more detailed error message
      if (error.response?.status === 500) {
        throw new Error("Server error: " + (error.response?.data?.error || "Unknown error"));
      }

      if (error.response?.status === 404) {
        throw new Error("Chat endpoint not found");
      }

      if (error.response?.status === 0 || error.message === "Network Error") {
        throw new Error("Network error: Cannot connect to server");
      }

      throw error;
    }
  }
}
