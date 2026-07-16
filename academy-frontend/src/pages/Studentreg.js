import React, { useEffect, useState } from "react";
import "../components/Studentreg.css";
import { Link, useNavigate } from "react-router-dom";

const Studentreg = () => {
  const [StudPass, setStudPass] = useState("");
  const [Studconfirm, setStudconfirm] = useState("");
  const [Email, setEmail] = useState("");
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [Course, setCourse] = useState("");
  const [Timing, setTiming] = useState("");
  const [Phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // const courses = JSON.parse(localStorage.getItem("courses_detail")) || [];

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.log(error));
  }, []);

 const hanleSubmit = async (e) => {
   e.preventDefault();

   if (isSubmitting) return;

   if (
     !Fname ||
     !Email ||
     !StudPass ||
     !Studconfirm ||
     !Course ||
     !Timing ||
     !Phone
   ) {
     alert("fill all fields");
     return;
   }

   if (StudPass !== Studconfirm) {
     alert("password do not match");
     return;
   }

   setIsSubmitting(true);

   const studentData = {
     firstName: Fname,
     lastName: Lname,
     email: Email,
     password: StudPass,
     phone: Phone,
     course: Course,
     timing: Timing,
   };

   try {
     const response = await fetch(
       "http://localhost:8080/api/students/register",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(studentData),
       },
     );

     if (!response.ok) {
       const errorMessage = await response.text();
       alert(errorMessage);
       return;
     }

     alert("registered successfully");
     navigate("/studentlogin");
   } catch (error) {
     console.log(error);
     alert("Backend not connected");
   } finally {
     setIsSubmitting(false);
   }
 };

  return (
    <div className="form_container">
      <h2 className="stud_head">student registeration</h2>
      <h5>
        Join NexAcademy Today 🚀 Start your journey toward a successful tech
        career
      </h5>
      <div className="formfill">
        <form onSubmit={hanleSubmit}>
          <div className="row1">
            <div className="from-grp">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                id="fname"
                placeholder="enter fname"
                value={Fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>

            <div className="from-grp">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                id="lname"
                placeholder="enter lname"
                value={Lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
          </div>

          <div className="from-grp">
            <label>Degree name</label>
            <select>
              <option value="a" disabled>
                - - - - - - Select Degree name - - - - - -
              </option>
              <option value="b">Bsc</option>
              <option value="c">BE</option>
              <option value="d">Msc</option>
              <option value="e">BA</option>
              <option value="f">B.Com</option>
              <option value="g">M.Com</option>
              <option value="h">BBA</option>
              <option value="i">MBA</option>
            </select>
          </div>

          <div className="row1">
            <div className="from-grp">
              <label htmlFor="university">University name</label>
              <input type="text" id="university" />
            </div>

            <div className="from-grp">
              <label>Passout year</label>
              <input type="text" id="passout" />
            </div>
          </div>

          <div className="from-grp">
            <label>Address</label>
            <input type="text" id="address" />
          </div>

          <div className="row1">
            <div className="from-grp">
              <label>Phone number</label>
              <div className="row3">
                <select>
                  <option>+91</option>
                  <option>+1</option>
                  <option>+44</option>
                </select>

                <input
                  type="text"
                  id="studphone"
                  name="studphone"
                  pattern="[0-9]{10}"
                  value={Phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="from-grp">
              <label>email address</label>
              <input
                type="email"
                id="email"
                placeholder="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="row1">
            <div className="from-grp">
              <label>Password</label>
              <input
                type="password"
                value={StudPass}
                id="Stud_pass"
                placeholder="Password"
                onChange={(e) => {
                  setStudPass(e.target.value);
                }}
              />
            </div>
            <div className="from-grp">
              <label>Confirm Password</label>
              <input
                type="password"
                value={Studconfirm}
                id="Stud_confirm"
                placeholder="enter confirm password"
                onChange={(e) => {
                  setStudconfirm(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="from-grp">
            <label>birth date</label>
            <input type="date" id="date" />
          </div>

          <div className="from-grp">
            <label>Gender</label>
            <div className="radio">
              <label className="r-label">
                <input type="radio" name="gender" value="male" />
                Male
              </label>

              <label className="r-label">
                <input type="radio" name="gender" value="female" />
                Female
              </label>

              <label className="r-label">
                <input type="radio" name="gender" value="others" />
                Others
              </label>
            </div>
          </div>

          {/* <div className="from-grp">
            <label>degree name</label>
            <select>
              <option value="" disabled selected>
                -- Select degree--
              </option>
              <option value="aa">a</option>
              <option value="bb">b</option>
              <option value="cc">c</option>
              <option value="dd">d</option>
              <option value="ee">e</option>
            </select>
          </div> */}

          <div className="from-grp">
            <label>Course</label>
            <select value={Course} onChange={(e) => setCourse(e.target.value)}>
              <option value="" disabled>
                -- Select Course--
              </option>
              {courses.length === 0 ? (
                <option disabled>No courses available yet</option>
              ) : (
                courses.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* <div className="from-grp">
            <label>Trainer </label>
            <select
              value={Trainer}
              onChange={(e) => setTrainer(e.target.value)}
            >
              <option value="" disabled>
                -- Select Trainer--
              </option>
              <option value="ramu">Ramu</option>
              <option value="santhosh">Santhosh</option>
              <option value="shakthi">Shakthi</option>
              <option value="karthik">Karthik</option>
              <option value="harshini">Harshini</option>
              <option value="vini">Vini</option>
            </select>
          </div> */}

          <div className="from-grp">
            <label>Timing </label>
            <select value={Timing} onChange={(e) => setTiming(e.target.value)}>
              <option value="" disabled>
                -- Select Timing--
              </option>
              <option value="9 AM - 11 AM">9 AM - 11 AM</option>
              <option value="11 AM - 1 PM">11 AM - 1 PM</option>
              <option value="2 AM - 4 PM">2 AM - 4 PM</option>
              <option value="6 PM - 8 PM">6 PM - 8 PM</option>
            </select>
          </div>

          <div className="check-grp">
            <input type="checkbox" id="agree" />
            <label>i agree to the terms and condtions</label>
          </div>

          <div className="btn2">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "submit"}
            </button>
            <button type="reset">reset</button>
          </div>
          <p className="login-tex">
            Already registered?<Link to="/studentLogin">Login Here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Studentreg;
