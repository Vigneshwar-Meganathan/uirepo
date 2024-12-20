import React, { useEffect } from 'react';

const SurveySubmittedComp = () => {
    useEffect(() => {
        
        const handlePopState = () => {
            window.history.pushState(null, document.title, window.location.href);
        };

        window.history.pushState(null, document.title, window.location.href);

   
        window.addEventListener('popstate', handlePopState);

      
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <>
            {/* Header Section */}
            <header>
                <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center py-3 shadow-sm bg-white position-relative">
                    <a href="#" className="d-flex align-items-center mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
                        <span className="fs-4">
                            <img src="/images/changepond-blue-logo.svg" className="img-fluid" alt="logo" />
                        </span>
                    </a>
                    <div className="dropdown text-end">
                        <a href="#" className="d-block link-dark text-decoration-none fw-bold" data-bs-toggle="dropdown" aria-expanded="false">
                            <span className="text-white rounded-circle me-2 p-2"></span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Thank You Section */}
            <section className="main-content d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="welcome-thanks d-flex justify-content-center align-items-center w-50 m-auto">
                    <div className="card border-0 text-center w-100 rounded-0 position-relative">
                        <div className="card-body">
                            <h5 className="card-title fw-bold fs-2 mb-lg-3 mt-sm-5">Thank you</h5>
                            <p className="card-text fs-6 mb-lg-4">
                                Your Form Has been Submitted Successfully
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SurveySubmittedComp;
