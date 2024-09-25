import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, Link, Route, Routes } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AiFillCloseCircle } from "react-icons/ai";
import Modal from "react-modal";
import JobApplicationDetail from "./JobApplicationDetail";
import Papa from "papaparse";

// Setting the app element for accessibility
Modal.setAppElement("#root");

const Dashboard = () => {
  const yy = "https://backend1-96bk.onrender.com";
  const [jobApplications, setJobApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [filters, setFilters] = useState({
    cgpa: "",
    hsc: "",
    ssc: "",
    gap_year: "",
    branch: "",
  });

  // State variables for the email modal
  const [emailModalIsOpen, setEmailModalIsOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const { data } = await axios.get(
          `${yy}/api/v1/jobApplication/getall`,
          { withCredentials: true }
        );
        setJobApplications(data.jobApplications);
        setFilteredApplications(data.jobApplications);
        console.log()
      } catch (error) {
        setJobApplications([]);
        setFilteredApplications([]);
      }
    };
    fetchJobApplications();
  }, []);

  const handleUpdateStatus = async (jobApplicationId, field, value) => {
    try {
      const { data } = await axios.put(
        `${yy}/api/v1/jobApplication/update/${jobApplicationId}`,
        { [field]: value },
        { withCredentials: true }
      );
      setJobApplications((prevJobApplications) =>
        prevJobApplications.map((jobApplication) =>
          jobApplication._id === jobApplicationId
            ? { ...jobApplication, [field]: value }
            : jobApplication
        )
      );
      setFilteredApplications((prevFilteredApplications) =>
        prevFilteredApplications.map((jobApplication) =>
          jobApplication._id === jobApplicationId
            ? { ...jobApplication, [field]: value }
            : jobApplication
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (url) => {
    setProofUrl(url);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setProofUrl("");
  };

  const handleInputChange = (jobApplicationId, field, value) => {
    setJobApplications((prevJobApplications) =>
      prevJobApplications.map((jobApplication) =>
        jobApplication._id === jobApplicationId
          ? { ...jobApplication, [field]: value }
          : jobApplication
      )
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // useEffect(() => {
  //   const filtered = jobApplications.filter((application) => {
  //     return (
  //       (filters.cgpa === "" || application.cgpa >= parseFloat(filters.cgpa)) &&
  //       (filters.hsc === "" || application.hsc >= parseFloat(filters.hsc)) &&
  //       (filters.ssc === "" || application.ssc >= parseFloat(filters.ssc)) &&
  //       (filters.gap_year === "" ||
  //         (application.gap_year && application.gap_year <= parseInt(filters.gap_year))) &&
  //       (filters.branch === "" || application.branch === filters.branch)
  //     );
  //   });
  //   setFilteredApplications(filtered);
  // }, [filters, jobApplications]);

  const { isAuthenticated } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  const handleDownloadCSV = () => {
    const csvData = filteredApplications.map((application) => ({
      "Full Name": application.fullName,
      "Registration Number": application.reg,
      CGPA: application.cgpa,
      "HSC Marks": application.hsc,
      "SSC Marks": application.ssc,
      Department: application.branch,
      Status: application.status,
      Placed: application.placed,
      Package: application.amount,
      Email: application.email,
    }));

    const csv = Papa.unparse(csvData);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "job_applications.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmails = async () => {
    const emailAddresses = filteredApplications.map((application) => application.email);

    try {
      const { data } = await axios.post(
        `${yy}/api/v1/sendEmail`,
        { recipients: emailAddresses, subject: emailSubject, message: emailContent },
        { withCredentials: true }
      );
      toast.success(data.message);
      setEmailModalIsOpen(false);
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <section className="p-6 bg-gray-100 min-h-screen">
              <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-blue-500 text-white p-4">
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h5 className="text-xl font-semibold mb-4">Filter Student Applications</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      <input
                        type="number"
                        name="cgpa"
                        placeholder="Min CGPA"
                        value={filters.cgpa}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        name="hsc"
                        placeholder="Min HSC Marks"
                        value={filters.hsc}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        name="ssc"
                        placeholder="Min SSC Marks"
                        value={filters.ssc}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        type="number"
                        name="gap_year"
                        placeholder="Max Gap Year"
                        value={filters.gap_year}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2"
                      />
                      <input
                        name="branch"
                        placeholder="Branch"
                        value={filters.branch}
                        onChange={handleFilterChange}
                        className="border rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex justify-end mt-4 space-x-4">
                      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300" onClick={handleDownloadCSV}>
                        Download CSV
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300" onClick={() => setEmailModalIsOpen(true)}>
                        Send Emails
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                      <thead>
                        <tr className="w-full bg-gray-200">
                          <th className="py-2 px-4 text-left">Full Name</th>
                          <th className="py-2 px-4 text-left">Registration Number</th>
                          <th className="py-2 px-4 text-left">CGPA</th>
                          <th className="py-2 px-4 text-left">HSC Marks</th>
                          <th className="py-2 px-4 text-left">SSC Marks</th>
                          <th className="py-2 px-4 text-left">Department</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Placed</th>
                          <th className="py-2 px-4 text-left">Package</th>
                          <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.length > 0
                          ? filteredApplications.map((application) => (
                              <tr key={application._id} className="border-b">
                                <td className="py-2 px-4">{application.fullName}</td>
                                <td className="py-2 px-4">
                                  <Link to={`/job-application/${application.reg}`} className="text-blue-500 hover:underline">
                                    {application.reg}
                                  </Link>
                                </td>
                                <td className="py-2 px-4">{application.cgpa}</td>
                                <td className="py-2 px-4">{application.hsc}</td>
                                <td className="py-2 px-4">{application.ssc}</td>
                                <td className="py-2 px-4">{application.branch}</td>
                                <td className="py-2 px-4">
                                  <select
                                    className={`border rounded px-2 py-1 ${application.status === "Pending" ? "bg-yellow-100" : application.status === "Accepted" ? "bg-green-100" : "bg-red-100"}`}
                                    value={application.status}
                                    onChange={(e) =>
                                      handleUpdateStatus(application._id, "status", e.target.value)
                                    }
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="py-2 px-4">
                                  <select
                                    className="border rounded px-2 py-1"
                                    value={application.placed}
                                    onChange={(e) =>
                                      handleUpdateStatus(application._id, "placed", e.target.value)
                                    }
                                  >
                                    <option value="Placed">Placed</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="number"
                                    className="border rounded px-2 py-1"
                                    value={application.amount || ""}
                                    placeholder="Package"
                                    onChange={(e) =>
                                      handleUpdateStatus(application._id, "amount", e.target.value)
                                    }
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                                    onClick={() => openModal(application.proof.url)}
                                  >
                                    View Proof
                                  </button>
                                </td>
                              </tr>
                            ))
                          : (
                            <tr>
                              <td colSpan="10" className="text-center py-4 text-gray-500">
                                No job applications found.
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Proof Modal"
                className="modal"
                overlayClassName="modal-overlay"
              >
                <button className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300" onClick={closeModal}>
                  <AiFillCloseCircle />
                </button>
                {proofUrl && <img src={proofUrl} alt="Proof" className="w-full h-auto" />}
              </Modal>
              <Modal
                isOpen={emailModalIsOpen}
                onRequestClose={() => setEmailModalIsOpen(false)}
                contentLabel="Email Modal"
                className="modal"
                overlayClassName="modal-overlay"
              >
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                  onClick={() => setEmailModalIsOpen(false)}
                >
                  <AiFillCloseCircle />
                </button>
                <h2 className="text-xl font-semibold mb-4">Email Content</h2>
                <div className="mb-4">
                  <label className="block mb-2">Email Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Email Content</label>
                  <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    rows="5"
                    className="border rounded px-3 py-2 w-full"
                  ></textarea>
                </div>
                <button onClick={handleSendEmails} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Send Emails</button>
              </Modal>
            </section>
          }
        />
        <Route path="/job-application/:reg" element={<JobApplicationDetail />} />
      </Routes>
    </>
  );
};

export default Dashboard;
