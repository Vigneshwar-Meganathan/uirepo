import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../Services/APIservice";

const HomeSurveyComp = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing survey token.");
      return;
    }

    const fetchSurveyData = async () => {
      try {
        const data = await ApiService.retrieveSurveyByToken(token);
        setSurveyData(data.survey_response.survey_response);
      } catch (error) {
        console.error("Error fetching survey data:", error);
        setError("Failed to load survey. Please try again later.");
      }
    };

    fetchSurveyData();
  }, [token]);

  const addAnswer = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const addComment = (questionId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [questionId]: value,
    }));
  };

  const handleNext = async () => {
    const sectionKeys = Object.keys(surveyData.sections);
    const currentSectionName = sectionKeys[currentSectionIndex];
    const currentSection = surveyData.sections[currentSectionName];

    // Validate all questions are answered
    const allAnswered = currentSection.every((question) => {
      const parsedComponent = JSON.parse(question.componentstr);
      const { Type } = parsedComponent;

      if (Type === 3 || Type === 6) {
        // Text Input or Star Rating
        return answers[question.question_id] != null && answers[question.question_id] !== "";
      }
      // Radio Buttons or Checkboxes
      return answers[question.question_id] != null;
    });

    if (!allAnswered) {
      setError("Please answer all questions before proceeding.");
      return;
    }

    const payload = {
      survey_participant_response_id: surveyData.survey_participant_response_id,
      data: currentSection.map((question) => {
        const parsedComponent = JSON.parse(question.componentstr);
        const { Component, Type } = parsedComponent;

        let answerValue = answers[question.question_id];

        if (Type === 4 || Type === 5) {
          answerValue = Component.reduce((indices, option, index) => {
            if (answers[question.question_id]?.includes(option)) {
              indices.push(index);
            }
            return indices;
          }, []);
        }

        // Handle text input or star rating (ensure we store as string inside an array)
        if (Type === 3 || Type === 6) {
          answerValue = Array.isArray(answerValue) ? answerValue : [answerValue];
        }

        return {
          question_id: question.question_id,
          answer_value: JSON.stringify(answerValue),
          is_answered: true,
          usercomment: comments[question.question_id] || "",
        };
      }),
    };

    try {
      await ApiService.updateResponse(payload);
      setError("");
      const nextSectionIndex = currentSectionIndex + 1;

      if (nextSectionIndex < sectionKeys.length) {
        setCurrentSectionIndex(nextSectionIndex);
        setAnswers({});
        setComments({});
      } else {
        // Update the response status to 3 (completed) and navigate
        await ApiService.updateResponseStatus(surveyData.survey_participant_response_id, 3);
        navigate(`/Home/SubmitSurvey?token=${token}`);
      }
    } catch (error) {
      console.error("Error updating responses:", error);
      setError("Failed to update responses. Please try again.");
    }
  };

  if (!surveyData) return <div>Loading survey...</div>;

  const sectionKeys = Object.keys(surveyData.sections);
  const currentSectionName = sectionKeys[currentSectionIndex];
  const currentQuestions = surveyData.sections[currentSectionName];

  const renderQuestion = (question) => {
    const parsedComponent = JSON.parse(question.componentstr);
    const { Type, Component } = parsedComponent;

    switch (Type) {
      case 1:
      case 2: 
      case 7:
        return (
          <div className="d-flex flex-wrap gap-3">
            {Component.map((label, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question_${question.question_id}`}
                  value={index}
                  checked={answers[question.question_id] === index} 
                  onChange={() => addAnswer(question.question_id, index)} // Update the selected index
                />
                <label className="form-check-label">{label}</label>
              </div>
            ))}
          </div>
        );
      case 4: // 3 Checks (Checkbox)
      case 5: // 5 Checks (Checkbox)
        return (
          <div className="d-flex flex-wrap gap-3">
            {Component.map((label, index) => (
              <div className="form-check" key={index}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={label}
                  checked={answers[question.question_id]?.includes(label)} // Check if this checkbox is selected
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAnswers((prevAnswers) => {
                      const currentAnswers = prevAnswers[question.question_id] || [];
                      return {
                        ...prevAnswers,
                        [question.question_id]: checked
                          ? [...currentAnswers, label] // Add label if checked
                          : currentAnswers.filter((val) => val !== label), // Remove label if unchecked
                      };
                    });
                  }}
                />
                <label className="form-check-label">{label}</label>
              </div>
            ))}
          </div>
        );
      case 3: // Text Input
        return (
          <div>
            <textarea
              className="form-control"
              placeholder="Add your answer"
              maxLength={4500}
              rows="2"
              onChange={(e) => addAnswer(question.question_id, e.target.value)}
            />
            <div className="text-end mt-2">
              <small>{(answers[question.question_id] || "").length} / 4500</small>
            </div>
          </div>
        );
      case 6: // Star Rating
        return (
          <div className="d-flex">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                style={{
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: answers[question.question_id] >= index ? "#FFD700" : "#ccc",
                  padding: "0 5px",
                }}
                onClick={() => addAnswer(question.question_id, index)}
                aria-label={`Rate ${index} star`}
              >
                ★
              </span>
            ))}
          </div>
        );
      default:
        return null;
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
              <span className="text-white rounded-circle me-2 p-2">{surveyData.participant_name.slice(0, 2).toUpperCase()}</span> {surveyData.participant_name}
            </a>
          </div>
        </div>
      </header>

      <section className="main-content">
        <div className="organisation-survey p-4">
          <div className="organisation-question bg-white p-4">
            <h1 className="fw-medium fs-2 text-center mb-lg-3">{surveyData.survey_name}</h1>
            <p className="text-left fw-bold pb-3 lorem w-75 m-auto">{currentSectionName}</p>

            {currentQuestions.map((question) => (
              <div className="w-75 m-auto pt-3 pt-sm-4" key={question.question_id}>
                <form>
                  <p className="fw-medium fs-6">{question.question_description}</p>
                  <p className="fw-small fs-10">{question.guidancetext}</p>
                  {renderQuestion(question)}
                  {question.enable_comment && (
                    <div>
                      <textarea
                        className="form-control"
                        placeholder="Add your comment"
                        maxLength={250}
                        rows="2"
                        onChange={(e) => addComment(question.question_id, e.target.value)}
                      />
                      <div className="text-end mt-2">
                        <small>{(comments[question.question_id] || "").length} / 250</small>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            ))}

            <div className="my-2 my-lg-4 text-end">
              {error && <span style={{ color: "red" }}>{error}</span>}
              <button className="btn-submit text-decoration-none d-inline-block" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSurveyComp;
