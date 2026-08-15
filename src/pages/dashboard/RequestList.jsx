import React from "react";

const RequestList = ({
  request,
  requestsTab,
  handleAccept,
}) => {
  return (
    <>
      <section className="requests-page-body">
        <div className="requests-list">
          {request &&
            request.map((request) => {
              return (
                <div key={request.id} className="request-card">
                  <div className="request-user-info">
                    <div className="avatar">
                      {request.name
                        ? request.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div className="request-details">
                      <span className="request-name">{request.name}</span>
                      <span className="request-email">{request.email}</span>
                    </div>
                  </div>

                  {requestsTab === "received" &&
                    request.status === "pending" ? (
                    <div className="request-actions">
                      <button
                        className="request-accept-btn"
                        onClick={() => handleAccept(request)}
                      >
                        Accept
                      </button>
                      <button className="request-decline-btn">Decline</button>
                    </div>
                  ) : (
                    <span
                      className={`request-status request-status-${request.status}`}
                    >
                      {request.status}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </section>
    </>
  );
};

export default RequestList;