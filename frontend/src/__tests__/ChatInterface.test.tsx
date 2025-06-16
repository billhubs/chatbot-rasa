import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInterface } from '../ChatInterface';

const mockProps = {
  messages: [],
  onSendMessage: jest.fn(),
  setChatMessages: jest.fn(),
};

describe('ChatInterface', () => {
  test('renders chat input and send button', () => {
    render(<ChatInterface {...mockProps} />);
    const inputElement = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(inputElement).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  test('allows user to type and send a message', () => {
    render(<ChatInterface {...mockProps} />);
    const inputElement = screen.getByPlaceholderText(/type your message/i) as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(inputElement, { target: { value: 'Hello' } });
    expect(inputElement.value).toBe('Hello');

    fireEvent.click(sendButton);
    // Add assertions for message send behavior if applicable
  });
});
