import React from 'react';
import { QuestionnaireTemplate } from '../types';
import { useAppContext } from '../context/AppContext';
import QuestionComponent from './QuestionComponent';

interface DynamicQuestionnaireProps {
  template: QuestionnaireTemplate;
  onComplete: () => void;
}

const DynamicQuestionnaire: React.FC<DynamicQuestionnaireProps> = ({ template, onComplete }) => {
  const { answers, updateAnswer } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="cyber-card grid-background p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 neon-text glitch" data-text={template.name}>
        {template.name}
      </h2>
      <p className="mb-6 text-gray-300">{template.description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {template.questions.map((question) => (
          <QuestionComponent
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => updateAnswer(question.id, value)}
          />
        ))}
        
        <div className="flex justify-end mt-8">
          <button type="submit" className="cyber-button">
            Generate Prompt
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicQuestionnaire;
