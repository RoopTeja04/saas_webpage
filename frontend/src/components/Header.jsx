import React from "react";

const Header = ({ role, tenantPlan, onUpgrade, onLogout }) => {
    return (
        <header className="flex justify-between items-center p-4 bg-gray-100 rounded mb-6 shadow font-sans">
            <h2 className="text-xl font-bold text-gray-800">Multi-Tenant Notes App</h2>

            <div className="flex items-center space-x-4">
                <span>Role: <strong>{role}</strong></span>
                <span>Plan: <strong>{tenantPlan}</strong></span>

                {role === "Admin" && tenantPlan === "free" && (
                    <button
                        onClick={onUpgrade}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-all"
                    >
                        Upgrade to Pro
                    </button>
                )}

                <button
                    onClick={onLogout}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;