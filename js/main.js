const groups = ["ReactJS N58", "ReactJS N50", "ReactJS N62"];
const STUDENTS = "students";
const STUDENT_GROUP = "student_group";
const groupsFilter = document.querySelector(".groups-filter");
const groupsSelect = document.querySelector(".groups-select");
const addStudentBtn = document.querySelector(".add-student-btn");
const openModalBtn = document.querySelector(".open-modal-btn");
const studentForm = document.querySelector(".student-form");
const modal = document.querySelector("#modal");
const students_Info = document.querySelector(".students-info");
const modalTitle = document.querySelector("#modalLabel");
const searchStudent = document.querySelector(".search-student");
let students = JSON.parse(localStorage.getItem(STUDENTS)) || [];
let selected = null;
let group = localStorage.getItem(STUDENT_GROUP) || "all";
let search = "";
const getStudentRow = ({ firstName, lastName, group, doesWork }, i) => `
  <div class="student-row row mb-2">
    <div class="col-1">${i + 1}</div>
    <div class="col-2">${firstName}</div>
    <div class="col-2">${lastName}</div>
    <div class="col-2">${group}</div>
    <div class="col-2">${doesWork ? "True" : "False"}</div>
    <div class="col-3 text-end">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal" onclick="editStudent(${i})">Edit</button>
      <button class="btn btn-danger" onclick="deleteStudent(${i})">Delete</button>
    </div>
  </div>
`;
let getStudents = () => {
  let filteredStudents = students.filter(
    (student) =>
      (student.firstName.toLowerCase().includes(search) ||
        student.lastName.toLowerCase().includes(search)) &&
      (group === "all" || student.group === group)
  );
  students_Info.innerHTML = filteredStudents.map(getStudentRow).join("");
};
let updateGroups = () => {
  let groupOptions = groups
    .map(
      (gr) =>
        `<option value="${gr}" ${gr === group ? "selected" : ""}>${gr}</option>`
    )
    .join("");
  groupsFilter.innerHTML = `<option value="all">All</option>${groupOptions}`;
  groupsSelect.innerHTML = groupOptions;
};
studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (studentForm.checkValidity()) {
    let newStudent = {
      firstName: studentForm.firstName.value,
      lastName: studentForm.lastName.value,
      group: studentForm.group.value,
      doesWork: studentForm.doesWork.checked,
    };
    if (selected === null) {
      students.push(newStudent);
    } else {
      students[selected] = newStudent;
    }
    localStorage.setItem(STUDENTS, JSON.stringify(students));
    getStudents();
    bootstrap.Modal.getInstance(modal).hide();
  } else {
    studentForm.classList.add("was-validated");
  }
});
openModalBtn.addEventListener("click", () => {
  addStudentBtn.textContent = "Add";
  modalTitle.textContent = "Adding student";
  studentForm.reset();
  selected = null;
});
let editStudent = (i) => {
  selected = i;
  let { firstName, lastName, group, doesWork } = students[i];
  studentForm.firstName.value = firstName;
  studentForm.lastName.value = lastName;
  studentForm.group.value = group;
  studentForm.doesWork.checked = doesWork;
  addStudentBtn.textContent = "Save";
  modalTitle.textContent = "Editing student";
};
let deleteStudent = (i) => {
  if (confirm("Bu o'quvchini o'chirib tashlamoqchimisiz?")) {
    students.splice(i, 1);
    localStorage.setItem(STUDENTS, JSON.stringify(students));
    getStudents();
  }
};
groupsFilter.addEventListener("change", function () {
  group = this.value;
  localStorage.setItem(STUDENT_GROUP, group);
  getStudents();
});
searchStudent.addEventListener("keyup", () => {
  search = searchStudent.value.trim().toLowerCase();
  getStudents();
});
updateGroups();
getStudents();
