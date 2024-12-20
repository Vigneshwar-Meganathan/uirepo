
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; 

const ApiService = {
     /**
     * Retrieves survey details using a token.
     * @param {string} token - The encrypted token.
     * @param {boolean} [isSubmitted=false] - Optional flag to indicate if the survey is being submitted.
     * @returns {Promise<Object>} - Returns a promise that resolves with the response data.
     */
     retrieveSurveyByToken: async (token, isSubmitted = false) => {
        try {
           
            const params = { token };
            if (isSubmitted) {
                params.is_submitted = true;
            }

           
            const response = await axios.get(`${API_BASE_URL}/retrieve_survey_by_token/`, { params });
            return response.data;
        } catch (error) {
            console.error('Error retrieving survey by token:', error);
            throw error; 
        }
    },


    /**
     * 
     * @param {Object} data 
     * @returns {Promise<Object>} 
     */
    updateResponse: async (data) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/update_survey_response/`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating response:', error.message);
            throw new Error('Failed to update survey response. Please try again.');
        }
    },

    /**
     * Updates the response status for a given response ID.
     * @param {string} responseId - The ID of the response to update.
     * @param {number} status - The new status to set.
     * @returns {Promise<Object>} - Returns a promise that resolves with the updated response data.
     */
    updateResponseStatus: async (responseId, status) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/update-response-status/${responseId}/`, {
                response_status: status,
            });
            return response.data;
        } catch (error) {
            console.error('Error updating response status:', error.message);
            throw new Error('Failed to update response status. Please try again.');
        }
    },
};

export default ApiService;
