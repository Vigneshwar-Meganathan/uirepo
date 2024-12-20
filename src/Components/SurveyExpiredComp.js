import React from 'react';

const SurveyExpiredComp = () => {
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
                </div>
            </header>

            {/* Welcome Section */}
            <section className="main-content">
                <div className="welcome-thanks d-flex justify-content-center align-items-center w-50 m-auto">
                    <div className="card border-0 text-center w-100 rounded-0">
                        <div className="card-body">
                            <img className="align-content-center" src="/images/Alert.png" style={{ width: '100px' }} alt="Alert" />
                            <h5 className="card-title fw-bold fs-2 mb-lg-3 mt-sm-5">Survey Expired</h5>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SurveyExpiredComp;
