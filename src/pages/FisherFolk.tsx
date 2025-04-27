import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import FisherfolksTable from "../components/tables/BasicTables/FisherfolksTable";

export default function Fisherfolk() {
  return (
    <>
      <PageMeta
        title="Aquashield | Live GPS & Marine Zone Monitoring Dashboard"
        description="Aquashield provides a real-time dashboard for GPS tracking, marine zone monitoring, and fisherfolk device management using React and Firebase."
      />
      <PageBreadcrumb pageTitle="Fisher Folks" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Fisher Folks List
        </h3>
        <div className="space-y-6">
            <FisherfolksTable />
        </div>
      </div>
    </>
  );
}
