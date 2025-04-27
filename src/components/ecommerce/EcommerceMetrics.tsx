import { useEffect, useState } from "react";
import {
  collection,
  getDocs
} from "firebase/firestore";
import { db } from "../../firebase";

import {
  // ArrowDownIcon,
  // ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
// import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  const [fisherfolkCount, setFisherfolkCount] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [devicesCount, setDevicesCount] = useState(0);

  useEffect(() => {
    const fetchFisherfolks = async () => {
      try {
        const snapshot = await getDocs(collection(db, "fisherfolk"));
        console.log("Fetched docs:", snapshot.docs.map(doc => doc.id)); // 
        setFisherfolkCount(snapshot.size); // total count
      } catch (error) {
        console.error("Error fetching fisherfolks:", error);
      }
    };

    fetchFisherfolks();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(db, "employees"));
        console.log("Fetched docs:", snapshot.docs.map(doc => doc.id)); // 
        setEmployeesCount(snapshot.size); // total count
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "devices"));
        setDevicesCount(snapshot.size); // total count
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Metric: Fisherfolks */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Fisherfolks
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {fisherfolkCount.toLocaleString()}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>

      {/* Metric employees */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Employees
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {employeesCount.toLocaleString()}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge> */}
        </div>
      </div>

      {/* Metric: devices */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              GPS Devices
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {devicesCount.toLocaleString()}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>
    </div>
  );
}
