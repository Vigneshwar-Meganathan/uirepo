import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import ApiService from '../Services/APIservice';

const SurveySubmitComp = () => {
    const [participantName, setParticipantName] = useState('');
    const [participantId, setParticipantId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const notyf = new Notyf();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    
    useEffect(() => {
        const fetchSurveyData = async () => {
            try {
                const data = await ApiService.retrieveSurveyByToken(token);
                setParticipantName(data.survey_response.survey_response.participant_name);
                setParticipantId(data.survey_response.survey_response.survey_participant_response_id);
            } catch (error) {
                if (error.response?.status === 409) {
                    const errorDetail = error.response?.data?.detail;
                    if (errorDetail?.message === 'All questions are answered.') {
                        const { participant_name, survey_participant_response_id } = errorDetail.data;
                        setParticipantName(participant_name);
                        setParticipantId(survey_participant_response_id);
                    }
                } else {
                    console.error('Error fetching survey data:', error);
                    notyf.error(error.response?.data?.detail?.message);
                }
            }
        };

        if (token) {
            fetchSurveyData();
        }
    }, [token]);

    
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            window.history.pushState(null, document.title, window.location.href);
        };

        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
         
            await ApiService.retrieveSurveyByToken(token, true);

        
            await ApiService.updateResponseStatus(participantId, 4);
            navigate('/Home/SurveySubmitted');
        } catch (error) {
            if (error.response?.status === 409) {
                
                if (participantId) {
                    await ApiService.updateResponseStatus(participantId, 4);
                }
            } else {
                console.error('Error submitting the survey:', error);
                notyf.error(error.response?.data?.detail?.message);
            }
        } finally {
            
            notyf.success('Survey submitted successfully!');
            navigate('/Home/SurveySubmitted');
        }
    };

    return (
        <>
            <header>
                <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center py-3 shadow-sm bg-white position-relative">
                    <a href="#" className="d-flex align-items-center mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
                        <span className="fs-4">
                            <img src="/images/changepond-blue-logo.svg" className="img-fluid" alt="logo" />
                        </span>
                    </a>
                    <div className="dropdown text-end">
                        <a href="#" className="d-block link-dark text-decoration-none fw-bold" data-bs-toggle="dropdown" aria-expanded="false">
                            <span className="text-white rounded-circle me-2 p-2">
                                {participantName.slice(0, 2).toUpperCase()}
                            </span>
                            {participantName}
                        </a>
                    </div>
                </div>
            </header>

            {/* Welcome Section */}
            <section className="main-content">
                <div className="welcome-thanks d-flex justify-content-center align-items-center w-50 m-auto">
                    <div className="card border-0 text-center w-100 rounded-0">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <h5 className="card-title fw-bold fs-2 mb-lg-3 mt-sm-5">Congratulations!</h5>
                                <p className="card-text fs-6 mb-lg-4">
                                    Hi {participantName}, please click "Submit" to submit your form.
                                </p>
                                <button type="submit" id="btnSubmit" className="btn btn-start mb-sm-5">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SurveySubmitComp;
