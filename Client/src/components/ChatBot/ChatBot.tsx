import React, { useState, useRef, useEffect } from "react";
import { MessageOutlined, SendOutlined, CloseOutlined, MinusOutlined } from "@ant-design/icons";
import { Button, Input, Spin } from "antd";
import { ChatService, type ChatMessage } from "../../services";
import "./ChatBot.css";

const { TextArea } = Input;

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý ảo của JewelryStore. Tôi có thể giúp bạn tìm sản phẩm, kiểm tra tồn kho hoặc thêm vào giỏ hàng. Bạn cần tôi giúp gì?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputMessage.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await ChatService.sendMessage(userMessage.content);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      let errorText = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";

      if (error.message) {
        errorText = `Lỗi: ${error.message}`;
      }

      const errorMessage: ChatMessage = {
        role: "assistant",
        content: errorText
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const parseMessageContent = (content: string) => {
    // Parse URLs and convert to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  if (!isOpen) {
    return (
      <div className="chatbot-bubble" onClick={() => setIsOpen(true)}>
        <MessageOutlined className="chatbot-bubble-icon" />
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="chatbot-minimized" onClick={() => setIsMinimized(false)}>
        <MessageOutlined className="chatbot-minimized-icon" />
        <span className="chatbot-minimized-text">Trợ lý ảo</span>
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-title">
          <MessageOutlined className="chatbot-header-icon" />
          <span>Trợ lý ảo JewelryStore</span>
        </div>
        <div className="chatbot-header-actions">
          <Button
            type="text"
            icon={<MinusOutlined />}
            onClick={() => setIsMinimized(true)}
            className="chatbot-header-button"
          />
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setIsOpen(false)}
            className="chatbot-header-button"
          />
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chatbot-message ${
              message.role === "user" ? "chatbot-message-user" : "chatbot-message-assistant"
            }`}
          >
            <div className="chatbot-message-content">{parseMessageContent(message.content)}</div>
          </div>
        ))}
        {isLoading && (
          <div className="chatbot-message chatbot-message-assistant">
            <div className="chatbot-message-content">
              <Spin size="small" />
              <span className="ml-2">Đang xử lý...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-container">
        <TextArea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn của bạn..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          className="chatbot-input"
          disabled={isLoading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="chatbot-send-button"
        />
      </div>
    </div>
  );
};
