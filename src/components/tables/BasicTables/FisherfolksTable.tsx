import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../../../firebase"; // Adjust the path as needed

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import Badge from "../../ui/badge/Badge";

//Fisherfolk interface
interface Fisherfolk {
  id: string;
  registrationNumber?: string;
  rsbsaNumber?: string;
  registrationDate?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  appelation?: string;
  birthdate?: string;
  birthplace?: string;
  contactNumber?: string;
  gender?: string;
  region?: string;
  province?: string;
  municipality?: string;
  barangay?: string;
  assignedDevice?: {
    id: string;
    label: string;
    deviceId: string;
  };
}



export default function FisherfolksTable() {
  //state variable
  const [fisherfolks, setFisherfolks] = useState<Fisherfolk[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFisher, setEditingFisher] = useState<Fisherfolk | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fisherfolkDelete, setFisherfolkToDelete] = useState<Fisherfolk | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Fisherfolk>({
    id: "",
    registrationNumber: "",
    rsbsaNumber: "",
    registrationDate: "",
    firstName: "",
    middleName: "",
    lastName: "",
    appelation: "",
    birthdate: "",
    birthplace: "",
    contactNumber: "",
    gender: "",
    region: "",
    province: "",
    municipality: "",
    barangay: "",
    assignedDevice: { id: "", label: "", deviceId: "" },
  });
  
  

//device state
  type Device = {
    id: string;
    deviceId: string;
    label: string;
    assignedTo?: string;
  };
  
//fetch devices
  useEffect(() => {
    const fetchDevices = async () => {
      const snapshot = await getDocs(collection(db, "devices"));
      const deviceData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Device, "id">),
      }));
      setDevices(deviceData);
    };    
  
    fetchDevices();
  }, []);
  

  // 🔄 Fetch data from fisherfolk
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "fisherfolk"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Fisherfolk[];
        setFisherfolks(data);
      } catch (error) {
        console.error("Error fetching fisherfolk:", error);
      }
    };

    fetchData();
  }, []);

  //open delete modal function
  const openDeleteModal = (fisherfolks: Fisherfolk) => {
    setFisherfolkToDelete(fisherfolks);
      setIsDeleteModalOpen(true);
    };
    
    const handleDelete = async () => {
      if (!fisherfolkDelete) return;
    
      try {
        // 🧹 Clear device assignment if there is one
        const assignedDeviceId = fisherfolkDelete.assignedDevice?.id;
        if (assignedDeviceId) {
          await updateDoc(doc(db, "devices", assignedDeviceId), {
            assignedTo: "",
          });
        }
    
        // 🗑️ Delete the fisherfolk
        await deleteDoc(doc(db, "fisherfolk", fisherfolkDelete.id));
    
        // ✅ Update local state
        setFisherfolks((prev) => prev.filter((f) => f.id !== fisherfolkDelete.id));
        setIsDeleteModalOpen(false);
        setFisherfolkToDelete(null);
      } catch (error) {
        console.error("Error deleting fisherfolk:", error);
      }
    };
    
//handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      if (name === "assignedDevice") {
        const selectedDevice = devices.find((d) => d.id === value);
        setFormData((prev) => ({
          ...prev,
          assignedDevice: selectedDevice ? { id: selectedDevice.id, label: selectedDevice.label, deviceId: selectedDevice.deviceId } : { id: "", label: "",  deviceId: ""},        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: name === "age" ? parseInt(value) : value,
        }));
      }
    };
    
// add modal
const openAddModal = () => {
  setEditingFisher(null);
  setFormData({ 
    id: "",
    registrationNumber: "",
    rsbsaNumber: "",
    registrationDate: "",
    firstName: "",
    middleName: "",
    lastName: "",
    appelation: "",
    birthdate: "",
    birthplace: "",
    contactNumber: "",
    gender: "",
    region: "",
    province: "",
    municipality: "",
    barangay: "",
    assignedDevice: { id: "", label: "", deviceId: "" } // ✅ Fixed closing brace
  });
  setShowModal(true);
};


//edit modal
const openEditModal = (fisher: Fisherfolk) => {
  setEditingFisher(fisher);
  setFormData({
    id: fisher.id || "",
    registrationNumber: fisher.registrationNumber || "",
    rsbsaNumber: fisher.rsbsaNumber || "",
    registrationDate: fisher.registrationDate || "",
    firstName: fisher.firstName || "",
    middleName: fisher.middleName || "",
    lastName: fisher.lastName || "",
    appelation: fisher.appelation || "",
    birthdate: fisher.birthdate || "",
    birthplace: fisher.birthplace || "",
    contactNumber: fisher.contactNumber || "",
    gender: fisher.gender || "",
    region: fisher.region || "",
    province: fisher.province || "",
    municipality: fisher.municipality || "",
    barangay: fisher.barangay || "",
    assignedDevice: fisher.assignedDevice || { id: "", label: "", deviceId: "" }
  });

  setShowModal(true);
};



//handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (editingFisher) {
        const prevDeviceId = editingFisher.assignedDevice?.id;
        const newDeviceId = formData.assignedDevice?.id;
  
        // 🔁 Update fisherfolk document
        await updateDoc(doc(db, "fisherfolk", formData.id), {
          registrationNumber: formData.registrationNumber,
          rsbsaNumber: formData.rsbsaNumber,
          registrationDate: formData.registrationDate,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          appelation: formData.appelation,
          birthdate: formData.birthdate,
          birthplace: formData.birthplace,
          contactNumber: formData.contactNumber,
          gender: formData.gender,
          region: formData.region,
          province: formData.province,
          municipality: formData.municipality,
          barangay: formData.barangay,
          assignedDevice: formData.assignedDevice,
        });
        
  
        // 🔄 Unassign previous device if changed
        if (prevDeviceId && prevDeviceId !== newDeviceId) {
          await updateDoc(doc(db, "devices", prevDeviceId), {
            assignedTo: "",
          });
        }
  
        // 🔗 Assign new device
        if (newDeviceId) {
          await updateDoc(doc(db, "devices", newDeviceId), {
            assignedTo: formData.firstName,
          });
        }
  
        setFisherfolks((prev) =>
          prev.map((f) => (f.id === formData.id ? formData : f))
        );
      } else {
        // ➕ Add new fisherfolk
        const docRef = await addDoc(collection(db, "fisherfolk"), {
          registrationNumber: formData.registrationNumber,
          rsbsaNumber: formData.rsbsaNumber,
          registrationDate: formData.registrationDate,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          appelation: formData.appelation,
          birthdate: formData.birthdate,
          birthplace: formData.birthplace,
          contactNumber: formData.contactNumber,
          gender: formData.gender,
          region: formData.region,
          province: formData.province,
          municipality: formData.municipality,
          barangay: formData.barangay,
          assignedDevice: formData.assignedDevice,
        });
  
        // 🔗 Assign device (if one is selected)
        if (formData.assignedDevice?.id) {
          await updateDoc(doc(db, "devices", formData.assignedDevice.id), {
            assignedTo: formData.firstName,
          });
        }
  
        setFisherfolks((prev) => [
          ...prev,
          { ...formData, id: docRef.id },
        ]);
      }
  
      closeModal();
    } catch (error) {
      console.error("Error saving fisherfolk:", error);
    }
  };
  
  
//close modal
const closeModal = () => {
  setShowModal(false);
  setEditingFisher(null);
  setFormData({
    id: "",
    registrationNumber: "",
    rsbsaNumber: "",
    registrationDate: "",
    firstName: "",
    middleName: "",
    lastName: "",
    appelation: "",
    birthdate: "",
    birthplace: "",
    contactNumber: "",
    gender: "",
    region: "",
    province: "",
    municipality: "",
    barangay: "",
    assignedDevice: { id: "", label: "", deviceId: "" },
  });
};

const filteredFisherfolks = fisherfolks.filter((fisher) =>
  [fisher.firstName, fisher.lastName, fisher.registrationNumber, fisher.rsbsaNumber, fisher.municipality, fisher.barangay, fisher.gender].some((field) =>
    field?.toLowerCase().includes(searchTerm.toLowerCase())
  )
);



  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <input
        type="text"
        placeholder="Search by name, registration, or RSBSA..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:max-w-sm px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />
        <Button onClick={openAddModal}>Add Fisherfolk</Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
        <Table>
  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
    <TableRow>
      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Registration No.</TableCell>
      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">RSBSA No.</TableCell>
      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Contact No.</TableCell>
      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Gender</TableCell>
      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Address</TableCell>
      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">GPS Device</TableCell>
      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
    {filteredFisherfolks.length > 0 ? (
      filteredFisherfolks.map((fisher) => (
        <TableRow key={fisher.id}>
          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
             {fisher.lastName}, {fisher.firstName}
          </TableCell>
          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {fisher.registrationNumber}
          </TableCell>
          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {fisher.rsbsaNumber}
          </TableCell>
          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {fisher.contactNumber}
          </TableCell>
          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {fisher.gender}
          </TableCell>
          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {fisher.barangay}, {fisher.municipality}
          </TableCell>
          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
            {fisher.assignedDevice?.label ? (
              <Badge
                variant="light"
                color="info"
                size="sm"
                onClick={() => navigate(`/devices/`)}
              >
                {fisher.assignedDevice.label}
              </Badge>
            ) : (
              "—"
            )}
          </TableCell>
          <TableCell className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openEditModal(fisher)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => openDeleteModal(fisher)}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-6 text-gray-500">
          No fisherfolk found.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && fisherfolkDelete && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Delete Employee</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <strong>{fisherfolkDelete.firstName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="outline" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}


      {showModal && (
        <div className="fixed inset-0 z-[10] flex items-center justify-center bg-black/40 backdrop-blur-sm mt-[100px]">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {editingFisher ? "Edit Fisherfolk" : "Add Fisherfolk"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="flex flex-col">
                <label htmlFor="registrationNumber" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Registration Number
                </label>
                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="rsbsaNumber" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  RSBSA Number
                </label>
                <input
                  id="rsbsaNumber"
                  name="rsbsaNumber"
                  type="text"
                  value={formData.rsbsaNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="registrationDate" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Registration Date
                </label>
                <input
                  id="registrationDate"
                  name="registrationDate"
                  type="date"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="firstName" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="middleName" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Middle Name
                </label>
                <input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="lastName" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="appelation" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Appelation
                </label>
                <input
                  id="appelation"
                  name="appelation"
                  type="text"
                  value={formData.appelation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="birthdate" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Birthdate
                </label>
                <input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="birthplace" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Birthplace
                </label>
                <input
                  id="birthplace"
                  name="birthplace"
                  type="text"
                  value={formData.birthplace}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="contactNumber" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="gender" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="region" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Region
                </label>
                <input
                  id="region"
                  name="region"
                  type="text"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="province" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Province
                </label>
                <input
                  id="province"
                  name="province"
                  type="text"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="cityMunicipality" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  City / Municipality
                </label>
                <input
                  id="municipality"
                  name="municipality"
                  type="text"
                  value={formData.municipality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="barangay" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Barangay
                </label>
                <input
                  id="barangay"
                  name="barangay"
                  type="text"
                  value={formData.barangay}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="assignedDevice" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assigned Device
                </label>
                <select
                  id="assignedDevice"
                  name="assignedDevice"
                  value={formData.assignedDevice?.id || ""}
                  onChange={handleInputChange}
                  disabled={!!editingFisher}
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="">Select Assigned Device</option>
                  {devices.filter(
                    (device) =>
                      !device.assignedTo || device.assignedTo === "" || device.id === formData.assignedDevice?.id
                  ).map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.label || device.deviceId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-4">
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
