import React from 'react';
import AuroraBackground from '../components/common/AuroraBackground';
import Particles from '../components/common/Particles';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ParticipantMonitorTable from '../components/admin/ParticipantMonitorTable';

export const AdminMonitoringPage = () => {
  return (
    <AuroraBackground>
      <Particles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ParticipantMonitorTable />
      </main>

      <Footer />
    </AuroraBackground>
  );
};

export default AdminMonitoringPage;
