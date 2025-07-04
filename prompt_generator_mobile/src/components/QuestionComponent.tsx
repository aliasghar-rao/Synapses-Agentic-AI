import React from 'react';
import { Question } from '../types';

interface QuestionComponentProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({ question, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [...(Array.isArray(value) ? value : [])];
    if (e.target.checked) {
      newValue.push(e.target.value);
    } else {
      const index = newValue.indexOf(e.target.value);
      if (index !== -1) {
        newValue.splice(index, 1);
      }
    }
    onChange(newValue);
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            id={question.id}
            value={value || ''}
            onChange={handleChange}
            placeholder={question.placeholder}
            className="cyber-input w-full"
            required={question.required}
          />
        );
      case 'textarea':
        return (
          <textarea
            id={question.id}
            value={value || ''}
            onChange={handleChange}
            placeholder={question.placeholder}
            className="cyber-input w-full h-32"
            required={question.required}
          />
        );
      case 'select':
        return (
          <select
            id={question.id}
            value={value || ''}
            onChange={handleChange}
            className="cyber-input w-full"
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${question.id}-${option.value}`}
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  className="mr-2"
                  required={question.required}
                />
                <label htmlFor={`${question.id}-${option.value}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        if (question.options) {
          // Multiple checkboxes
          return (
            <div className="space-y-2">
              {question.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${question.id}-${option.value}`}
                    name={question.id}
                    value={option.value}
                    checked={Array.isArray(value) && value.includes(option.value)}
                    onChange={handleMultiSelectChange}
                    className="mr-2"
                  />
                  <label htmlFor={`${question.id}-${option.value}`} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={question.id}
                checked={value || false}
                onChange={handleCheckboxChange}
                className="mr-2"
                required={question.required}
              />
              <label htmlFor={question.id} className="text-sm">
                {question.label}
              </label>
            </div>
          );
        }
      case 'slider':
        return (
          <div>
            <input
              type="range"
              id={question.id}
              min={question.min || 0}
              max={question.max || 100}
              step={question.step || 1}
              value={value || question.min || 0}
              onChange={handleChange}
              className="w-full"
              required={question.required}
            />
            <div className="flex justify-between text-xs mt-1">
              <span>{question.min || 0}</span>
              <span>{value || question.min || 0}</span>
              <span>{question.max || 100}</span>
            </div>
          </div>
        );
      case 'color':
        return (
          <input
            type="color"
            id={question.id}
            value={value || '#000000'}
            onChange={handleChange}
            className="w-full h-10"
            required={question.required}
          />
        );
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="mb-4">
      {question.type !== 'checkbox' && (
        <label htmlFor={question.id} className="block mb-2 font-medium neon-text">
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {question.description && (
        <p className="text-sm text-gray-400 mb-2">{question.description}</p>
      )}
      {renderQuestion()}
    </div>
  );
};

export default QuestionComponent;
