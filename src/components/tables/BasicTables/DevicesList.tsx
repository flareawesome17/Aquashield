import { useState, useEffect  } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc 
} from "firebase/firestore";
import Button from "../../ui/button/Button";
import { db } from "../../../firebase";

// Updated Device type
interface Device {
  deviceId: string;
  label: string;
  status: "active" | "inactive";
  assignedTo: "";
  registeredAt: string;
  simNumber: string;
  notes: string;
  id?: string; // Optional, for internal Firestore use
}

export default function DevicesList() {
  const [devices, setDevices] = useState<Device[]>();
  const [showModal, setShowModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  

  const [formData, setFormData] = useState<Device>({
    deviceId: "",
    label: "",
    status: "inactive",
    assignedTo: "",
    registeredAt: new Date().toISOString(),
    simNumber: "",
    notes: "",
  });
  
  

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "devices"), (snapshot) => {
      const devicesData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Firestore doc ID
      })) as Device[];
      setDevices(devicesData);
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "assignedTo" && value === "" ? null : value,
    }));
  };

  const openAddModal = () => {
    setEditingDevice(null);
    setFormData({
      deviceId: "",
      label: "",
      status: "inactive",
      assignedTo: "",
      registeredAt: new Date().toISOString(),
      simNumber: "",
      notes: "",
    });
    setShowModal(true);
  };

  const openEditModal = (device: Device) => {
    setEditingDevice(device);
    setFormData(device);
    setShowModal(true);
  };

  const openDeleteModal = (device: Device) => {
    setDeviceToDelete(device);
    setShowDeleteModal(true);
  };
  
    
  const handleDelete = async () => {
    if (!deviceToDelete?.id) return;
    try {
      await deleteDoc(doc(db, "devices", deviceToDelete.id));
      setShowDeleteModal(false);
      setDeviceToDelete(null);
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deviceData = {
      ...formData,
      assignedTo: formData.assignedTo || null,
      registeredAt: new Date(formData.registeredAt).toISOString(),
    };

    try {
      if (editingDevice?.id) {
        await updateDoc(doc(db, "devices", editingDevice.id), deviceData);
      } else {
        await addDoc(collection(db, "devices"), deviceData);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving device:", error);
    }
  };
  

  const closeModal = () => {
    setShowModal(false);
    setEditingDevice(null);
    setFormData({
      id: "", // <-- string, not number
      deviceId: "",
      label: "",
      status: "inactive",
      assignedTo: "",
      registeredAt: new Date().toISOString(),
      simNumber: "",
      notes: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <input
          type="text"
          placeholder="Search devices..."
          className="w-full sm:w-64 px-4 py-2 border rounded-md text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
        <Button onClick={openAddModal}>Add Device</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Device ID</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Label</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Assigned To</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">SIM Number</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Registered At</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Notes</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices && devices.length > 0 ? (
                devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{device.deviceId}</TableCell>
                    <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{device.label}</TableCell>
                    <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{device.status}</TableCell>
                    <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{device.assignedTo ?? "-"}</TableCell>
                    <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{device.simNumber}</TableCell>
                    <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{new Date(device.registeredAt).toLocaleString()}</TableCell>
                    <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{device.notes}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(device)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => openDeleteModal(device)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500">
                    No devices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {showDeleteModal && (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-sm p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Confirm Deletion
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete the device{" "}
            <span className="font-semibold">{deviceToDelete?.label}</span>?
          </p>

          <div className="flex justify-end gap-2 pt-6">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    )}


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {editingDevice ? "Edit Device" : "Add Device"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="deviceId"
                type="text"
                placeholder="Device ID"
                value={formData.deviceId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <input
                name="label"
                type="text"
                placeholder="Label"
                value={formData.label}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input
                name="assignedTo"
                type="text"
                placeholder="Assigned To"
                value={formData.assignedTo ?? ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <input
                name="simNumber"
                type="text"
                placeholder="SIM Number"
                value={formData.simNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <input
                name="notes"
                type="text"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
