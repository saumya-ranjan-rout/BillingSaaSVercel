import React from "react";
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProfessionalRequestList from "@/components/professionalRequests/ProfessionalRequestList";
import ProfessionalRequestForm from "@/components/professionalRequests/ProfessionalRequestForm";

const ProfessionalRequestsPage = () => {
  return (
    <DashboardLayout>
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Professional Requests</h2>
      <ProfessionalRequestForm />
      <ProfessionalRequestList />
    </div>
    </DashboardLayout>
  );
};

export default ProfessionalRequestsPage;
