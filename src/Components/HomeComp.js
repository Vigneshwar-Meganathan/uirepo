import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiService from '../Services/APIservice';

const HomeComp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [surveyData, setSurveyData] = useState(null);
    const [surveyParticipantResponseId, setSurveyParticipantResponseId] = useState('');
    const [token, setToken] = useState('');
    const [errorDetail, setErrorDetail] = useState(null);
    const [isTokenInvalid, setIsTokenInvalid] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        setToken(token);

        if (!token) {
            setIsTokenInvalid(true);
            return;
        }

        const fetchSurveyData = async () => {
            try {
                const data = await ApiService.retrieveSurveyByToken(token);
                const surveyResponse = data?.survey_response?.survey_response;

                if (surveyResponse) {
                    setSurveyData({
                        surveyName: surveyResponse.survey_name,
                        participantName: surveyResponse.participant_name,
                        organizationName: surveyResponse.organization_name,
                        total_questions: surveyResponse.Total_questions,
                    });
                    setSurveyParticipantResponseId(surveyResponse.survey_participant_response_id);
                }
            } catch (error) {
                const statusCode = error.response?.status;
                console.log(error);

                if (statusCode === 410) {
                    navigate('/Home/SurveySubmitted');
                } else if (statusCode === 409) {
                    const detail = error.response?.data?.detail;
                    setErrorDetail(detail);
                } else if (statusCode === 403) {
                    navigate('/Home/SurveyExpired');
                }
                else if (statusCode === 451) {
                    navigate('/Home/SurveyClosed');
                } else {
                    setIsTokenInvalid(true);
                }
            }
        };

        fetchSurveyData();
    }, [location.search, navigate]);

    const handleInitiateClick = async () => {
        try {
            const data = await ApiService.retrieveSurveyByToken(token);
            const surveyResponse = data?.survey_response?.survey_response;

            if (surveyResponse) {
                const surveyParticipantResponseId = surveyResponse.survey_participant_response_id;
                await ApiService.updateResponseStatus(surveyParticipantResponseId, 1);
                navigate(`/Home/Survey?token=${token}`);
            }
        } catch (error) {
            const statusCode = error.response?.status;

            if (statusCode === 409) {
                navigate(`/Home/SubmitSurvey?token=${token}`);
            } else {
                console.error('Error initiating survey:', error);
            }
        }
    };

    
    if (!token || isTokenInvalid) {
        return (
            <section className="main-content">
                <div className="welcome-thanks d-flex justify-content-center align-items-center w-50 m-auto">
                    <div className="card border-0 text-center w-100 rounded-0">
                        <div className="card-body">
                            <img
                                className="align-content-center"
                                src="/images/Alert.png"
                                style={{ width: '100px' }}
                                alt="Alert"
                            />
                            <h5 className="card-title fw-bold fs-2 mb-lg-3 mt-sm-5">Invalid Survey</h5>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Header Section */}
            <header>
                <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center py-3 shadow-sm bg-white position-relative">
                    <a
                        href="#"
                        className="d-flex align-items-center mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none"
                    >
                        <span className="fs-4">
                            <img
                                src="/images/changepond-blue-logo.svg"
                                className="img-fluid"
                                alt="logo"
                            />
                        </span>
                    </a>
                    <div className="dropdown text-end">
                        <a
                            href="#"
                            className="d-block link-dark text-decoration-none fw-bold"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="text-white rounded-circle me-2 p-2">
                                {surveyData?.participantName?.slice(0, 2).toUpperCase() ||
                                    errorDetail?.data?.participant_name?.slice(0, 2).toUpperCase()}
                            </span>{' '}
                            {surveyData?.participantName || errorDetail?.data?.participant_name}
                        </a>
                    </div>
                </div>
            </header>

            {/* Welcome Section */}
            <section className="main-content">
                <div className="welcome-thanks d-flex justify-content-center align-items-center w-50 m-auto">
                    <div className="card border-0 text-center w-100 rounded-0">
                        <div className="card-body">
                            <h5 className="card-title fw-bold fs-3 mt-sm-5">
                                Welcome to the Survey!
                            </h5>
                            <h5 className="card-title fw-bold fs-2 mb-lg-3">
                                {surveyData?.surveyName || errorDetail?.data?.survey_name}
                            </h5>
                            <p className="card-text fs-6 mb-lg-4">
                                Hi {surveyData?.participantName || errorDetail?.data?.participant_name},
                                Please fill out and submit this form.
                                <br />
                                {surveyData?.surveyName
                                    ? `“${surveyData?.total_questions} Question(s)”`
                                    : `“${errorDetail?.data?.Total_Questions} Question(s)”`}
                            </p>
                            <button
                                onClick={handleInitiateClick}
                                id="btnInitiate"
                                className="btn btn-start mb-sm-5"
                            >
                                Start
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeComp;
