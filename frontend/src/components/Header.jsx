import React from "react";

const Header = ({ role, tenantPlan, onUpgrade, onLogout }) => {
    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                borderBottom: "1px solid #ccc",
                marginBottom: "20px",
            }}
        >
            <h2>Multi-Tenant Notes App</h2>

            <div>
                <span style={{ marginRight: "15px" }}>
                    Role: <strong>{role}</strong>
                </span>
                <span style={{ marginRight: "15px" }}>
                    Plan: <strong>{tenantPlan}</strong>
                </span>

                {/* Show upgrade button only for Admin + free plan */}
                {role === "Admin" && tenantPlan === "free" && (
                    <button onClick={onUpgrade} style={{ marginRight: "10px" }}>
                        Upgrade to Pro
                    </button>
                )}

                <button onClick={onLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Header;