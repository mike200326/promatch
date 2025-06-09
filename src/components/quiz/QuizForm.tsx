'use client';

import React, { useState } from 'react';

interface Props {
  onSubmit: (topic: string) => void;
}

export const QuizForm: React.FC<Props> = ({ onSubmit }) => {
  const [topic, setTopic] = useState('JavaScript');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(topic);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <label>
        Tema:
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </label>
      <button type="submit" style={{ marginLeft: '10px' }}>
        Generar Quiz
      </button>
    </form>
  );
};
