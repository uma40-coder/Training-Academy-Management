import React, { useEffect, useState } from "react";
import "../components/AdDashboard.css";

const AdSyllabus = () => {
  const [courses, setCourses] = useState([]);
  const [syllabusItems, setSyllabusItems] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleName, setModuleName] = useState("");

  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [selectedModuleName, setSelectedModuleName] = useState("");

  const [expandedModule, setExpandedModule] = useState(null);

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/courses");
      const data = await response.json();

      setCourses(data);

      if (data.length > 0 && !selectedCourse) {
        setSelectedCourse(data[0].name);
      }
    } catch (error) {
      console.log(error);
      alert("Courses load aagala. Backend check pannunga.");
    }
  };

  const fetchSyllabus = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/syllabus");
      const data = await response.json();
      setSyllabusItems(data);
    } catch (error) {
      console.log(error);
      alert("Syllabus load aagala. Backend check pannunga.");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSyllabus();
  }, []);

  const courseItems = syllabusItems.filter(
    (item) => item.courseName === selectedCourse,
  );

  const modules = [...new Set(courseItems.map((item) => item.moduleName))];

  const getTopicsByModule = (moduleName) =>
    courseItems.filter((item) => item.moduleName === moduleName);

  const addModule = async () => {
    if (!moduleName.trim()) {
      alert("Module name required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/syllabus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName: selectedCourse,
          moduleName: moduleName.trim(),
          topicName: "Overview",
        }),
      });

      if (!response.ok) {
        alert("Module add failed");
        return;
      }

      await fetchSyllabus();
      setModuleName("");
      setShowModuleModal(false);
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
    }
  };

  const addTopic = async () => {
    if (!topicName.trim()) {
      alert("Topic name required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/syllabus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName: selectedCourse,
          moduleName: selectedModuleName,
          topicName: topicName.trim(),
        }),
      });

      if (!response.ok) {
        alert("Topic add failed");
        return;
      }

      await fetchSyllabus();
      setTopicName("");
      setShowTopicModal(false);
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
    }
  };

  const deleteTopic = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/syllabus/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Delete failed");
        return;
      }

      await fetchSyllabus();
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
    }
  };

  const deleteModule = async (moduleName) => {
    if (!window.confirm("Delete this module and all topics?")) {
      return;
    }

    const moduleTopics = getTopicsByModule(moduleName);

    try {
      for (const topic of moduleTopics) {
        await fetch(`http://localhost:8080/api/syllabus/${topic.id}`, {
          method: "DELETE",
        });
      }

      await fetchSyllabus();
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
    }
  };

  return (
    <div className="dashboard-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <h2 className="page-title">Syllabus</h2>
        <button
          className="admin-btn-primary"
          onClick={() => setShowModuleModal(true)}
        >
          + Add Module
        </button>
      </div>

      <p className="page-sub">Manage course modules and topics</p>

      {courses.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "var(--muted)",
            padding: "48px",
          }}
        >
          No courses added yet - go to Courses page first!
        </div>
      ) : (
        <>
          <select
            className="admin-select"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setExpandedModule(null);
            }}
            style={{ marginBottom: 20 }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {modules.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "var(--muted)",
                padding: "48px",
              }}
            >
              No modules yet - click Add Module!
            </div>
          ) : (
            modules.map((moduleName, i) => {
              const topics = getTopicsByModule(moduleName);

              return (
                <div className="syllabus-module-card" key={moduleName}>
                  <div
                    className="syllabus-module-header"
                    onClick={() =>
                      setExpandedModule(
                        expandedModule === moduleName ? null : moduleName,
                      )
                    }
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div className="syllabus-module-num">{i + 1}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>
                          {moduleName}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>
                          {topics.length} topics
                        </div>
                      </div>
                    </div>

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <button
                        className="admin-btn-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModuleName(moduleName);
                          setTopicName("");
                          setShowTopicModal(true);
                        }}
                      >
                        + Topic
                      </button>

                      <button
                        className="admin-btn-reject"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteModule(moduleName);
                        }}
                      >
                        Delete
                      </button>

                      <span style={{ color: "var(--muted)" }}>
                        {expandedModule === moduleName ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>

                  {expandedModule === moduleName && (
                    <div className="syllabus-topics">
                      {topics.map((topic) => (
                        <div className="syllabus-topic-item" key={topic.id}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              className="topic-dot"
                              style={{ background: "var(--accent)" }}
                            />
                            {topic.topicName}
                          </div>

                          <button
                            className="admin-btn-reject"
                            style={{ padding: "2px 8px", fontSize: 11 }}
                            onClick={() => deleteTopic(topic.id)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </>
      )}

      {showModuleModal && (
        <>
          <div
            className="admin-overlay"
            onClick={() => setShowModuleModal(false)}
          />
          <div className="admin-modal">
            <h3 className="admin-modal-title">Add Module</h3>

            <div className="admin-form-group">
              <label>Module Name</label>
              <input
                className="admin-input"
                placeholder="e.g. HTML & CSS"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <button
                className="admin-btn-cancel"
                onClick={() => setShowModuleModal(false)}
              >
                Cancel
              </button>

              <button className="admin-btn-primary" onClick={addModule}>
                Add
              </button>
            </div>
          </div>
        </>
      )}

      {showTopicModal && (
        <>
          <div
            className="admin-overlay"
            onClick={() => setShowTopicModal(false)}
          />
          <div className="admin-modal">
            <h3 className="admin-modal-title">Add Topic</h3>

            <div className="admin-form-group">
              <label>Topic Name</label>
              <input
                className="admin-input"
                placeholder="e.g. Flexbox & Grid"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <button
                className="admin-btn-cancel"
                onClick={() => setShowTopicModal(false)}
              >
                Cancel
              </button>

              <button className="admin-btn-primary" onClick={addTopic}>
                Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdSyllabus;
