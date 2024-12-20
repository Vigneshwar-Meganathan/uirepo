import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomeComp from './Components/HomeComp';
import HomeSurveyComp from './Components/HomeSurveyComp';
import SurveySubmitComp from './Components/SurveySubmitComp';
import SurveySubmittedComp from './Components/SurveySubmittedComp';
import SurveyExpiredComp from './Components/SurveyExpiredComp';
import SurveyClosedComp from './Components/SurveyClosedComp';
function App() {
    return (
        <Router>
            <Routes>
                {/* Default route redirects to /Home/Index */}
                <Route path="/" element={<Navigate to="/Home/Index" />} />
                <Route path="/Home/Index" element={<HomeComp />} />
                <Route path="/Home/Survey" element={<HomeSurveyComp />} />
                <Route path="/Home/SubmitSurvey" element={<SurveySubmitComp />} />
                <Route path="/Home/SurveySubmitted" element={<SurveySubmittedComp />} />
                <Route path="/Home/SurveyExpired" element={<SurveyExpiredComp/>} />
                <Route path="/Home/SurveyClosed" element={<SurveyClosedComp/>} />
            </Routes>
        </Router>
    );
}

export default App;
