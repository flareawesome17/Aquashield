import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../ui/table";
  import Badge from "../../ui/badge/Badge";
  
  // Define emergency types
  interface EmergencyNotification {
    id: number;
    type: "device" | "boundary" | "manual";
    message: string;
    severity: "Critical" | "Warning" | "Info";
    timestamp: string;
  }
  
  const emergencyData: EmergencyNotification[] = [
    {
      id: 1,
      type: "device",
      message: "Device ID #1234 has stopped updating.",
      severity: "Critical",
      timestamp: "2025-04-09 10:22 AM",
    },
    {
      id: 2,
      type: "boundary",
      message: "Juan Dela Cruz is outside the Municipal Sea boundaries.",
      severity: "Warning",
      timestamp: "2025-04-09 09:58 AM",
    },
    {
      id: 3,
      type: "manual",
      message: "Juan Dela Cruz pressed the NO GAS button.",
      severity: "Critical",
      timestamp: "2025-04-09 08:45 AM",
    },
  ];
  
  export default function EmergencyTable() {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Message
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Type
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Severity
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Timestamp
                </TableCell>
              </TableRow>
            </TableHeader>
  
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {emergencyData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90">
                    {item.message}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start capitalize text-gray-600 dark:text-gray-300">
                    {item.type}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Badge
                      size="sm"
                      color={
                        item.severity === "Critical"
                          ? "error"
                          : item.severity === "Warning"
                          ? "warning"
                          : "info"
                      }
                    >
                      {item.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                    {item.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  