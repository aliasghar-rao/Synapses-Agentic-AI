import React from 'react';
import { QuestionnaireTemplate } from '../types';

interface TemplateCardProps {
  template: QuestionnaireTemplate;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
  return (
    <div 
      className="cyber-card cursor-pointer hover:neon-border transition-all duration-300"
      onClick={onClick}
    >
      <h3 className="text-xl font-bold mb-2 neon-text">{template.name}</h3>
      <p className="text-gray-300 text-sm mb-4">{template.description}</p>
      <div className="flex justify-end">
        <button className="cyber-button text-sm">
          Select
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
