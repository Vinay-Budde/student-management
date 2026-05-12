import {
  useEffect,
  useState
} from "react";

import api from "../api/axios";

import toast from "react-hot-toast";

import {
  useNavigate
} from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  Moon,
  Sun,
  Users,
  BookOpen,
  Search,
  Trash2,
  Pencil
} from "lucide-react";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import { motion } from "framer-motion";

function Dashboard() {

  const navigate = useNavigate();

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem("darkMode")
      === "true"
    );

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [course, setCourse] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    localStorage.setItem(
      "darkMode",
      darkMode
    );

  }, [darkMode]);

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const response =
        await api.get(
          `${import.meta.env.VITE_API_URL}/students`
        );

      setStudents(response.data);

    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to fetch students"
      );

    } finally {

      setLoading(false);
    }
  };

  const addStudent = async () => {

    try {

      if (
        !name ||
        !email ||
        !course
      ) {

        toast.error(
          "Please fill all fields"
        );

        return;
      }

      if (editingId) {

        await api.put(
          `${import.meta.env.VITE_API_URL}/students/${editingId}`,
          {
            name,
            email,
            course
          }
        );

        toast.success(
          "Student Updated"
        );

        setEditingId(null);

      } else {

        await api.post(
          `${import.meta.env.VITE_API_URL}/students`,
          {
            name,
            email,
            course
          }
        );

        toast.success(
          "Student Added"
        );
      }

      setName("");
      setEmail("");
      setCourse("");

      fetchStudents();

    } catch (error) {
      console.error(error);
      toast.error(
        "Something went wrong"
      );
    }
  };

  const deleteStudent =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete?"
        );

      if (!confirmDelete) return;

      try {

        await api.delete(
          `${import.meta.env.VITE_API_URL}/students/${id}`
        );

        toast.success(
          "Student Deleted"
        );

        fetchStudents();

      } catch (error) {
        console.error(error);
        toast.error(
          "Delete Failed"
        );
      }
    };

  const editStudent =
    (student) => {

      setName(student.name);

      setEmail(student.email);

      setCourse(student.course);

      setEditingId(student.id);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

  const logout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );

    toast.success(
      "Logged Out"
    );

    navigate("/");
  };

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(
        filteredStudents
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: "xlsx",
          type: "array"
        }
      );

    const data = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    );

    saveAs(
      data,
      "students.xlsx"
    );

    toast.success(
      "Excel Exported"
    );
  };

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "Students Report",
      14,
      15
    );

    autoTable(doc, {

      head: [[
        "ID",
        "Name",
        "Email",
        "Course"
      ]],

      body:
        filteredStudents.map(
          (student) => [

            student.id,
            student.name,
            student.email,
            student.course
          ]
        )
    });

    doc.save(
      "students.pdf"
    );

    toast.success(
      "PDF Exported"
    );
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();

  }, []);

  const filteredStudents =
    students.filter((student) =>

      student.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      student.email
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      student.course
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const courseData = [

    ...new Set(
      students.map(
        s => s.course
      )
    )

  ].map((course) => ({

    course,

    count:
      students.filter(
        s => s.course === course
      ).length

  }));

  return (

    <div
      className={`
        min-h-screen
        transition-all
        duration-300
        ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-black"
        }
      `}
    >

      {/* NAVBAR */}

      <div
        className="
        bg-blue-600
        text-white
        p-5
        flex
        justify-between
        items-center
        shadow-lg
      "
      >

        <h1
          className="
          text-2xl
          font-bold
        "
        >
          Student Dashboard
        </h1>

        <div className="flex items-center">

          <button
            onClick={() =>
              setDarkMode(!darkMode)}
            className="
              mr-4
              bg-gray-800
              p-2
              rounded-lg
            "
          >

            {
              darkMode
                ? <Sun size={20} />
                : <Moon size={20} />
            }

          </button>

          <button
            onClick={logout}
            className="
              bg-red-500
              px-5
              py-2
              rounded-lg
              hover:bg-red-600
            "
          >
            Logout
          </button>

        </div>

      </div>

      <motion.div

        initial={{
          opacity: 0,
          y: 20
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        transition={{
          duration: 0.5
        }}

        className="
        max-w-7xl
        mx-auto
        p-8
      "
      >

        {/* STATS */}

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          mb-10
        "
        >

          <div
            className={`
              p-6
              rounded-2xl
              shadow-md
              ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }
            `}
          >

            <div className="flex items-center gap-2">

              <Users size={20} />

              <span>
                Total Students
              </span>

            </div>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              {students.length}
            </p>

          </div>

          <div
            className={`
              p-6
              rounded-2xl
              shadow-md
              ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }
            `}
          >

            <div className="flex items-center gap-2">

              <BookOpen size={20} />

              <span>
                Courses
              </span>

            </div>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              {
                new Set(
                  students.map(
                    s => s.course
                  )
                ).size
              }
            </p>

          </div>

          <div
            className={`
              p-6
              rounded-2xl
              shadow-md
              ${
                darkMode
                  ? "bg-gray-800"
                  : "bg-white"
              }
            `}
          >

            <div className="flex items-center gap-2">

              <Search size={20} />

              <span>
                Search Results
              </span>

            </div>

            <p
              className="
              text-4xl
              font-bold
              mt-2
            "
            >
              {filteredStudents.length}
            </p>

          </div>

        </div>

        {/* FORM */}

        <div
          className={`
            p-6
            rounded-2xl
            shadow-md
            mb-10
            ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }
          `}
        >

          <h2
            className="
            text-2xl
            font-bold
            mb-6
          "
          >
            {
              editingId
                ? "Update Student"
                : "Add Student"
            }
          </h2>

          <div
            className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
          >

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)}
              className="
                border
                p-3
                rounded-lg
                text-black
              "
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)}
              className="
                border
                p-3
                rounded-lg
                text-black
              "
            />

            <input
              type="text"
              placeholder="Course"
              value={course}
              onChange={(e) =>
                setCourse(e.target.value)}
              className="
                border
                p-3
                rounded-lg
                text-black
              "
            />

          </div>

          <button
            onClick={addStudent}
            className="
              mt-5
              bg-blue-600
              text-white
              px-6
              py-3
              rounded-lg
              hover:bg-blue-700
            "
          >
            {
              editingId
                ? "Update Student"
                : "Add Student"
            }
          </button>

        </div>

        {/* CHART */}

        <div
          className={`
            p-6
            rounded-2xl
            shadow-md
            mb-10
            ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }
          `}
        >

          <div className="flex justify-between items-center mb-6">

            <h2
              className="
              text-2xl
              font-bold
            "
            >
              Course Analytics
            </h2>

            <div className="flex gap-4">

              <button
                onClick={exportExcel}
                className="
                  bg-green-600
                  text-white
                  px-5
                  py-2
                  rounded-lg
                  hover:bg-green-700
                "
              >
                Export Excel
              </button>

              <button
                onClick={exportPDF}
                className="
                  bg-purple-600
                  text-white
                  px-5
                  py-2
                  rounded-lg
                  hover:bg-purple-700
                "
              >
                Export PDF
              </button>

            </div>

          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart data={courseData}>

              <XAxis dataKey="course" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="count" />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* TABLE */}

        <div
          className={`
            p-6
            rounded-2xl
            shadow-md
            ${
              darkMode
                ? "bg-gray-800"
                : "bg-white"
            }
          `}
        >

          <h2
            className="
            text-2xl
            font-bold
            mb-6
          "
          >
            Students List
          </h2>

          <input
            type="text"
            placeholder="Search by name, email, course..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)}
            className="
              border
              p-3
              rounded-lg
              mb-6
              w-full
              text-black
            "
          />

          {
            loading ? (

              <p>
                Loading students...
              </p>

            ) : filteredStudents.length === 0 ? (

              <p>
                No students found
              </p>

            ) : (

              <div
                className="
                overflow-x-auto
              "
              >

                <table
                  className="
                  w-full
                  border-collapse
                "
                >

                  <thead>

                    <tr
                      className="
                      bg-gray-200
                      text-black
                    "
                    >

                      <th className="p-4 text-left">
                        ID
                      </th>

                      <th className="p-4 text-left">
                        Name
                      </th>

                      <th className="p-4 text-left">
                        Email
                      </th>

                      <th className="p-4 text-left">
                        Course
                      </th>

                      <th className="p-4 text-left">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {
                      filteredStudents.map(
                        (student) => (

                          <tr
                            key={student.id}
                            className="
                            border-b
                            hover:bg-gray-700
                          "
                          >

                            <td className="p-4">
                              {student.id}
                            </td>

                            <td className="p-4">
                              {student.name}
                            </td>

                            <td className="p-4">
                              {student.email}
                            </td>

                            <td className="p-4">
                              {student.course}
                            </td>

                            <td className="p-4">

                              <button
                                onClick={() =>
                                  editStudent(student)}
                                className="
                                  bg-yellow-500
                                  text-white
                                  px-4
                                  py-2
                                  rounded-lg
                                  hover:bg-yellow-600
                                  mr-3
                                "
                              >

                                <div className="flex items-center gap-2">

                                  <Pencil size={16} />

                                  Edit

                                </div>

                              </button>

                              <button
                                onClick={() =>
                                  deleteStudent(
                                    student.id
                                  )
                                }
                                className="
                                  bg-red-500
                                  text-white
                                  px-4
                                  py-2
                                  rounded-lg
                                  hover:bg-red-600
                                "
                              >

                                <div className="flex items-center gap-2">

                                  <Trash2 size={16} />

                                  Delete

                                </div>

                              </button>

                            </td>

                          </tr>
                        ))
                    }

                  </tbody>

                </table>

              </div>
            )
          }

        </div>

      </motion.div>

    </div>
  );
}

export default Dashboard;