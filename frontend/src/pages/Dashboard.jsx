import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Moon, Sun, Users, Search, Trash2, Pencil, Briefcase, Filter, Download, DollarSign } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

function Dashboard() {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [role, setRole] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${import.meta.env.VITE_API_URL}/workers`);
      setWorkers(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch workers");
    } finally {
      setLoading(false);
    }
  };

  const addWorker = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !department || !salary || !role) {
        toast.error("Please fill all fields");
        return;
      }
      if (editingId) {
        await api.put(`${import.meta.env.VITE_API_URL}/workers/${editingId}`, {
          name, email, department, salary: Number(salary), role
        });
        toast.success("Worker Updated");
        setEditingId(null);
      } else {
        await api.post(`${import.meta.env.VITE_API_URL}/workers`, {
          name, email, department, salary: Number(salary), role
        });
        toast.success("Worker Added");
      }
      setName("");
      setEmail("");
      setDepartment("");
      setSalary("");
      setRole("");
      fetchWorkers();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const deleteWorker = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;
    try {
      await api.delete(`${import.meta.env.VITE_API_URL}/workers/${id}`);
      toast.success("Worker Deleted");
      fetchWorkers();
    } catch (error) {
      console.error(error);
      toast.error("Delete Failed");
    }
  };

  const editWorker = (worker) => {
    setName(worker.name);
    setEmail(worker.email);
    setDepartment(worker.department);
    setSalary(worker.salary);
    setRole(worker.role);
    setEditingId(worker.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged Out");
    navigate("/");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredWorkers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Workers");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "workers.xlsx");
    toast.success("Excel Exported");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Workers Report", 14, 15);
    autoTable(doc, {
      head: [["ID", "Name", "Email", "Department", "Salary", "Role"]],
      body: filteredWorkers.map((worker) => [
        worker.id, worker.name, worker.email, worker.department, worker.salary, worker.role
      ])
    });
    doc.save("workers.pdf");
    toast.success("PDF Exported");
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch = worker.name.toLowerCase().includes(search.toLowerCase()) ||
                          worker.email.toLowerCase().includes(search.toLowerCase()) ||
                          worker.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter ? worker.department === departmentFilter : true;
    return matchesSearch && matchesDept;
  });

  const departmentData = [...new Set(workers.map(w => w.department))].map((dept) => ({
    name: dept,
    value: workers.filter(w => w.department === dept).length
  }));

  const allDepartments = [...new Set(workers.map(w => w.department))];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b ${darkMode ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"} shadow-sm px-6 py-4 flex justify-between items-center transition-colors`}>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Briefcase size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Workers Management
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full transition-colors ${darkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={logout} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity shadow-md">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* STATS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Workers" value={workers.length} icon={Users} color="from-blue-500 to-blue-600" darkMode={darkMode} />
          <StatCard title="Departments" value={departmentData.length} icon={Briefcase} color="from-indigo-500 to-indigo-600" darkMode={darkMode} />
          <StatCard title="Total Salary" value={`$${workers.reduce((acc, curr) => acc + (curr.salary || 0), 0).toLocaleString()}`} icon={DollarSign} color="from-green-500 to-green-600" darkMode={darkMode} />
          <StatCard title="Search Results" value={filteredWorkers.length} icon={Search} color="from-purple-500 to-purple-600" darkMode={darkMode} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`lg:col-span-1 p-6 rounded-2xl shadow-xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? <Pencil size={20} className="text-blue-500" /> : <Users size={20} className="text-blue-500" />}
              {editingId ? "Update Worker Details" : "Add New Worker"}
            </h2>
            <form onSubmit={addWorker} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 opacity-70">Full Name</label>
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 opacity-70">Email Address</label>
                <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 opacity-70">Department</label>
                <input type="text" placeholder="e.g. IT, HR, Finance" value={department} onChange={(e) => setDepartment(e.target.value)} required className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 opacity-70">Salary ($)</label>
                <input type="number" placeholder="60000" value={salary} onChange={(e) => setSalary(e.target.value)} required min="0" className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 opacity-70">Role</label>
                <input type="text" placeholder="e.g. Developer, Manager" value={role} onChange={(e) => setRole(e.target.value)} required className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`} />
              </div>
              <button type="submit" disabled={loading} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2">
                {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : (editingId ? "Update Worker" : "Save Worker")}
              </button>
            </form>
          </motion.div>

          {/* CHART & LIST CONTROLS */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-2xl shadow-xl ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <PieChart size={20} className="text-indigo-500" />
                  Department Distribution
                </h2>
                <div className="flex gap-3">
                  <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm text-sm font-medium">
                    <Download size={16} /> Excel
                  </button>
                  <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm text-sm font-medium">
                    <Download size={16} /> PDF
                  </button>
                </div>
              </div>
              {departmentData.length > 0 ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '10px', backgroundColor: darkMode ? '#1f2937' : '#fff', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} itemStyle={{ color: darkMode ? '#fff' : '#000' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 w-full flex items-center justify-center opacity-50">
                  <p>No data available for chart</p>
                </div>
              )}
            </motion.div>

            {/* FILTERS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-4">
              <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <Search size={20} className="text-gray-400" />
                <input type="text" placeholder="Search workers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent outline-none" />
              </div>
              <div className={`md:w-64 flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <Filter size={20} className="text-gray-400" />
                <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="w-full bg-transparent outline-none appearance-none">
                  <option value="">All Departments</option>
                  {allDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* TABLE */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl shadow-xl overflow-hidden ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`${darkMode ? "bg-gray-900/50" : "bg-gray-50"} border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                      <th className="p-4 font-semibold opacity-80">Name</th>
                      <th className="p-4 font-semibold opacity-80">Contact</th>
                      <th className="p-4 font-semibold opacity-80">Role & Dept</th>
                      <th className="p-4 font-semibold opacity-80">Salary</th>
                      <th className="p-4 font-semibold opacity-80 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredWorkers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center opacity-50">
                            {loading ? "Loading workers..." : "No workers found."}
                          </td>
                        </tr>
                      ) : (
                        filteredWorkers.map((worker) => (
                          <motion.tr key={worker.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`border-b last:border-0 transition-colors ${darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-50 hover:bg-gray-50"}`}>
                            <td className="p-4 font-medium">{worker.name}</td>
                            <td className="p-4 opacity-80 text-sm">{worker.email}</td>
                            <td className="p-4">
                              <div><span className="font-medium text-sm">{worker.role}</span></div>
                              <div><span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{worker.department}</span></div>
                            </td>
                            <td className="p-4 font-medium text-green-500">${worker.salary?.toLocaleString()}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => editWorker(worker)} className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-600 text-blue-400" : "hover:bg-blue-50 text-blue-600"}`}>
                                  <Pencil size={18} />
                                </button>
                                <button onClick={() => deleteWorker(worker.id)} className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-600 text-red-400" : "hover:bg-red-50 text-red-600"}`}>
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, darkMode }) {
  return (
    <div className={`p-6 rounded-2xl shadow-lg border relative overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl`}></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-70 mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;