import { useAI } from '../../hooks/useAI';

function ResponseGenerator({ message }) {
  const { generateResponse, isLoading, error } = useAI();

  const getResponse = async () => {
    try {
      const response = await generateResponse(message);
      return response;
    } catch (err) {
      console.error('Error generating response:', err);
      return 'I apologize, but I encountered an error while processing your request.';
    }
  };

  return { getResponse, isLoading, error };
}

export default ResponseGenerator;