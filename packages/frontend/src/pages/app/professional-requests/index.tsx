import React from "react";
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfessionalRequestList from "@/components/professionalRequests/ProfessionalRequestList";
import ProfessionalRequestForm from "@/components/professionalRequests/ProfessionalRequestForm";

const ProfessionalRequestsPage = () => {
  return (
    <DashboardLayout>
      <div className="prof-container w-full mx-auto px-6 py-6">

        {/* Page Title */}
        <h1 className="prof-page-title mb-6">Professional Requests</h1>

        {/* Form Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
      <ProfessionalRequestForm />
        </div>

        {/* List Card */}
        <div className="bg-white shadow rounded-lg p-6">
      <ProfessionalRequestList />
    </div>

      </div>
    </DashboardLayout>
  );
};

export default ProfessionalRequestsPage;
