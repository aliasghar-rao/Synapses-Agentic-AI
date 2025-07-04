import React from 'react';
import { SavedPrompt } from '../types';

interface SavedPromptCardProps {
  prompt: SavedPrompt;
  onSelect: () => void;
  onDelete: () => void;
}

const SavedPromptCard: React.FC<SavedPromptCardProps> = ({ prompt, onSelect, onDelete }) => {
  return (
    <div className="cyber-card mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold mb-2 neon-text-cyan">{prompt.name}</h3>
          <p className="text-gray-400 text-xs mb-2">
            Created: {new Date(prompt.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onSelect}
            className="cyber-button-secondary text-xs py-1 px-2"
          >
            View
          </button>
          <button 
            onClick={onDelete}
            className="bg-transparent text-red-500 border border-red-500 text-xs py-1 px-2 hover:bg-red-900 hover:bg-opacity-30 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-4 bg-gray-900 p-3 rounded-md">
        <pre className="whitespace-pre-wrap text-gray-300 font-mono text-xs line-clamp-3">
          {prompt.prompt.substring(0, 150)}
          {prompt.prompt.length > 150 ? '...' : ''}
        </pre>
      </div>
    </div>
  );
};

export default SavedPromptCard;
