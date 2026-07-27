import React, { useEffect, useState } from "react";
import "../components/StudentDashboard.css";
import { authFetch } from "../utils/api";

const Syllabus = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [syllabusItems, setSyllabusItems] = useState([]);
  const [openModule, setOpenModule] = useState(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await authFetch("/api/syllabus");
        const data = await response.json();

        const courseItems = data.filter(
          (item) => item.courseName === currentUser.Course,
        );

        setSyllabusItems(courseItems);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSyllabus();
  }, [currentUser.Course]);

  const modules = [...new Set(syllabusItems.map((item) => item.moduleName))];

  const getTopicsByModule = (moduleName) =>
    syllabusItems.filter((item) => item.moduleName === moduleName);

  return (
    <div className="syllabus-container">
      <h2 className="syllabus-title">{currentUser.Course} Syllabus</h2>
      <p className="syllabus-count">{modules.length} Modules</p>

      {modules.length === 0 ? (
        <div
          className="module-card"
          style={{
            textAlign: "center",
            color: "var(--muted)",
            padding: "32px",
          }}
        >
          No syllabus added yet
        </div>
      ) : (
        modules.map((moduleName, i) => {
          const topics = getTopicsByModule(moduleName);

          return (
            <div key={moduleName} className="module-card">
              <div
                className="module-header"
                onClick={() =>
                  setOpenModule(openModule === moduleName ? null : moduleName)
                }
              >
                <div className="module-left">
                  <div className="module-number">{i + 1}</div>

                  <div className="module-info">
                    <div className="module-name">{moduleName}</div>
                    <div className="module-topic-count">
                      {topics.length} topics
                    </div>
                  </div>
                </div>

                <span
                  className={`module-arrow ${
                    openModule === moduleName ? "open" : ""
                  }`}
                >
                  ▶
                </span>
              </div>

              {openModule === moduleName && (
                <div className="module-topics">
                  {topics.map((topic) => (
                    <div className="topic-item" key={topic.id}>
                      <div className="topic-dot" />
                      {topic.topicName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Syllabus;
