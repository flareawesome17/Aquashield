import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import FisherfolksList from "../components/tables/BasicTables/FisherfolksList";
import LiveTracking from "../components/tables/BasicTables/LiveTracking";

interface FisherFolk {
  id: number;
  image: string;
  name: string;
  role: string;
  latitude: number;
  longitude: number;
}

export default function Map() {
  const [selectedFisher, setSelectedFisher] = useState<FisherFolk | null>(null);

  return (
    <>
      <PageMeta
        title="Aquashield | Live GPS & Marine Zone Monitoring Dashboard"
        description="Aquashield provides a real-time dashboard for GPS tracking, marine zone monitoring, and fisherfolk device management using React and Firebase."
      />
      <PageBreadcrumb pageTitle="Map Live Tracking" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Map
        </h3>
        <div className="space-y-6">
          <LiveTracking selectedFisher={selectedFisher} />
          <FisherfolksList onSelect={setSelectedFisher} />
        </div>
      </div>
    </>
  );
}
