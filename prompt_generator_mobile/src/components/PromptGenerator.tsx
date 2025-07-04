import React from 'react';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { useOfflineSupport } from '../hooks/useOfflineSupport';

interface PromptGeneratorProps {
  onSave: () => void;
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ onSave }) => {
  const { activeTemplate, answers, addSavedPrompt, initialText } = useAppContext();
  const [promptName, setPromptName] = React.useState('');
  const [generatedPrompt, setGeneratedPrompt] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const { isOnline, saveForOffline } = useOfflineSupport();

  React.useEffect(() => {
    if (activeTemplate) {
      generatePrompt();
    }
  }, [activeTemplate, answers]);

  const generatePrompt = () => {
    if (!activeTemplate) return;

    let prompt = '';

    // Start with initial text if provided
    if (initialText) {
      prompt += `${initialText}\n\n`;
    }

    // Add template-specific structure
    switch (activeTemplate.id) {
      case 'code-generation':
        prompt = generateCodePrompt();
        break;
      case 'content-creation':
        prompt = generateContentPrompt();
        break;
      case 'image-generation':
        prompt = generateImagePrompt();
        break;
      case 'text-to-video':
        prompt = generateVideoPrompt();
        break;
      default:
        prompt = generateGenericPrompt();
    }

    setGeneratedPrompt(prompt);
  };

  const generateCodePrompt = () => {
    let prompt = '# Code Generation Request\n\n';
    
    // Add language and framework info if available
    if (answers['programming-language']) {
      prompt += `Language: ${answers['programming-language']}\n`;
    }
    
    if (answers['framework']) {
      prompt += `Framework: ${answers['framework']}\n`;
    }
    
    // Add task description
    if (answers['task-description']) {
      prompt += `\n## Task Description\n${answers['task-description']}\n\n`;
    }
    
    // Add requirements
    if (answers['requirements']) {
      prompt += `## Requirements\n${answers['requirements']}\n\n`;
    }
    
    // Add expected input/output
    if (answers['input-output']) {
      prompt += `## Expected Input/Output\n${answers['input-output']}\n\n`;
    }
    
    // Add code style preferences
    if (answers['code-style']) {
      prompt += `## Code Style Preferences\n${answers['code-style']}\n\n`;
    }
    
    // Add any additional context
    if (answers['additional-context']) {
      prompt += `## Additional Context\n${answers['additional-context']}\n\n`;
    }
    
    // Add specific instructions
    prompt += `## Instructions\n`;
    prompt += `- Please provide well-documented code\n`;
    prompt += `- Include comments explaining complex logic\n`;
    prompt += `- Ensure the code is efficient and follows best practices\n`;
    
    if (answers['include-tests'] === true) {
      prompt += `- Include unit tests\n`;
    }
    
    if (answers['include-examples'] === true) {
      prompt += `- Include usage examples\n`;
    }
    
    return prompt;
  };
  
  const generateContentPrompt = () => {
    let prompt = '# Content Creation Request\n\n';
    
    // Add content type
    if (answers['content-type']) {
      prompt += `Content Type: ${answers['content-type']}\n`;
    }
    
    // Add target audience
    if (answers['target-audience']) {
      prompt += `Target Audience: ${answers['target-audience']}\n`;
    }
    
    // Add tone
    if (answers['tone']) {
      prompt += `Tone: ${answers['tone']}\n`;
    }
    
    // Add main topic
    if (answers['main-topic']) {
      prompt += `\n## Main Topic\n${answers['main-topic']}\n\n`;
    }
    
    // Add key points
    if (answers['key-points']) {
      prompt += `## Key Points to Include\n${answers['key-points']}\n\n`;
    }
    
    // Add desired length
    if (answers['content-length']) {
      prompt += `## Desired Length\n${answers['content-length']}\n\n`;
    }
    
    // Add SEO keywords
    if (answers['seo-keywords']) {
      prompt += `## SEO Keywords\n${answers['seo-keywords']}\n\n`;
    }
    
    // Add any additional instructions
    if (answers['additional-instructions']) {
      prompt += `## Additional Instructions\n${answers['additional-instructions']}\n\n`;
    }
    
    return prompt;
  };
  
  const generateImagePrompt = () => {
    let prompt = '# Image Generation Request\n\n';
    
    // Add subject
    if (answers['image-subject']) {
      prompt += `Subject: ${answers['image-subject']}\n`;
    }
    
    // Add style
    if (answers['image-style']) {
      prompt += `Style: ${answers['image-style']}\n`;
    }
    
    // Add mood
    if (answers['image-mood']) {
      prompt += `Mood: ${answers['image-mood']}\n`;
    }
    
    // Add color palette
    if (answers['color-palette']) {
      prompt += `Color Palette: ${answers['color-palette']}\n`;
    }
    
    // Add detailed description
    if (answers['detailed-description']) {
      prompt += `\n## Detailed Description\n${answers['detailed-description']}\n\n`;
    }
    
    // Add composition details
    if (answers['composition']) {
      prompt += `## Composition\n${answers['composition']}\n\n`;
    }
    
    // Add lighting
    if (answers['lighting']) {
      prompt += `## Lighting\n${answers['lighting']}\n\n`;
    }
    
    // Add elements to avoid
    if (answers['avoid-elements']) {
      prompt += `## Elements to Avoid\n${answers['avoid-elements']}\n\n`;
    }
    
    // Add reference images
    if (answers['reference-images']) {
      prompt += `## Reference Images\n${answers['reference-images']}\n\n`;
    }
    
    return prompt;
  };
  
  const generateVideoPrompt = () => {
    let prompt = '# Text-to-Video Generation Request\n\n';
    
    // Add video concept
    if (answers['video-concept']) {
      prompt += `Concept: ${answers['video-concept']}\n`;
    }
    
    // Add style
    if (answers['video-style']) {
      prompt += `Style: ${answers['video-style']}\n`;
    }
    
    // Add duration
    if (answers['video-duration']) {
      prompt += `Duration: ${answers['video-duration']}\n`;
    }
    
    // Add detailed scene description
    if (answers['scene-description']) {
      prompt += `\n## Scene Description\n${answers['scene-description']}\n\n`;
    }
    
    // Add characters
    if (answers['characters']) {
      prompt += `## Characters\n${answers['characters']}\n\n`;
    }
    
    // Add camera movements
    if (answers['camera-movements']) {
      prompt += `## Camera Movements\n${answers['camera-movements']}\n\n`;
    }
    
    // Add audio/music
    if (answers['audio-description']) {
      prompt += `## Audio/Music\n${answers['audio-description']}\n\n`;
    }
    
    // Add transitions
    if (answers['transitions']) {
      prompt += `## Transitions\n${answers['transitions']}\n\n`;
    }
    
    // Add special effects
    if (answers['special-effects']) {
      prompt += `## Special Effects\n${answers['special-effects']}\n\n`;
    }
    
    return prompt;
  };
  
  const generateGenericPrompt = () => {
    let prompt = '# AI Tool Prompt\n\n';
    
    // Loop through all answers and add them to the prompt
    Object.entries(answers).forEach(([key, value]) => {
      // Find the corresponding question to get the label
      const question = activeTemplate?.questions.find(q => q.id === key);
      if (question && value) {
        if (typeof value === 'boolean') {
          prompt += `${question.label}: ${value ? 'Yes' : 'No'}\n`;
        } else if (Array.isArray(value)) {
          prompt += `${question.label}: ${value.join(', ')}\n`;
        } else {
          prompt += `${question.label}: ${value}\n`;
        }
      }
    });
    
    return prompt;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePrompt = () => {
    if (!activeTemplate) return;
    
    const newPrompt = {
      id: uuidv4(),
      templateId: activeTemplate.id,
      name: promptName || `${activeTemplate.name} Prompt ${new Date().toLocaleString()}`,
      prompt: generatedPrompt,
      answers,
      createdAt: Date.now(),
    };
    
    addSavedPrompt(newPrompt);
    
    // Use offline support to ensure prompt is saved even when offline
    if (!isOnline) {
      saveForOffline(generatedPrompt);
    }
    
    onSave();
  };

  const handleSharePrompt = () => {
    if (navigator.share) {
      navigator.share({
        title: promptName || 'AI Prompt',
        text: generatedPrompt,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      handleCopyPrompt();
      alert('Prompt copied to clipboard!');
    }
  };

  if (!activeTemplate) {
    return null;
  }

  return (
    <div className="cyber-card grid-background p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 neon-text-cyan">Generated Prompt</h2>
      
      <div className="mb-4">
        <label htmlFor="prompt-name" className="block mb-2 font-medium neon-text">
          Prompt Name
        </label>
        <input
          type="text"
          id="prompt-name"
          value={promptName}
          onChange={(e) => setPromptName(e.target.value)}
          placeholder="Enter a name for this prompt"
          className="cyber-input w-full"
        />
      </div>
      
      <div className="bg-gray-900 p-4 rounded-md mb-6 relative">
        <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
          {generatedPrompt}
        </pre>
        <button
          onClick={handleCopyPrompt}
          className="absolute top-2 right-2 cyber-button-secondary text-xs py-1 px-2"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      <div className="flex flex-wrap justify-between gap-2">
        <button
          onClick={() => window.history.back()}
          className="cyber-button-secondary"
        >
          Back
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={handleSharePrompt}
            className="cyber-button-secondary"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </div>
          </button>
          
          <button
            onClick={handleSavePrompt}
            className="cyber-button"
          >
            Save Prompt
          </button>
        </div>
      </div>
      
      {!isOnline && (
        <div className="mt-4 bg-red-900 bg-opacity-20 border border-red-500 text-red-300 p-3 rounded text-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>You're currently offline. Your prompt will be saved locally and synced when you're back online.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptGenerator;
