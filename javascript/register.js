// References to form elements
const nameRef = document.getElementById("name");
const nameErrorRef = document.getElementById("nameError");
const profileRef = document.getElementsByName("profile");
const genderRef = document.getElementsByName("gender");
const departmentRefs = document.getElementsByClassName("checkbox");
const salaryRef = document.getElementById("salary");
const dayRef = document.getElementById("day");
const monthRef = document.getElementById("month");
const yearRef = document.getElementById("year");
const notesRef = document.getElementById("notes");
const submitBtnRef = document.getElementsByClassName("submit")[0];
const cancelBtnRef = document.getElementsByClassName("cancel")[0];
const resetBtnRef = document.getElementsByClassName("reset")[0];
const formRef = document.getElementById("emp-form");

// Name validation pattern
const namePattern = /^[a-zA-Z\s']{3,}$/;

// Validation function for name
function validateName(name) {
    if (!namePattern.test(name)) {
        nameErrorRef.style.display = "block";
        nameErrorRef.textContent = "Name must be at least 3 characters long and contain only letters, spaces";
        nameErrorRef.style.color = "red";
        return false;
    } else {
        nameErrorRef.style.display = "none";
        return true;
    }
}

// Validate other fields
function validateProfile() {
    for (let element of profileRef) {
        if (element.checked) {
            return true;
        }
    }
    alert("Please select a profile picture.");
    return false;
}

function validateGender() {
    for (let element of genderRef) {
        if (element.checked) {
            return true;
        }
    }
    alert("Please select a gender.");
    return false;
}

function validateDepartments() {
    for (let element of departmentRefs) {
        if (element.checked) {
            return true;
        }
    }
    alert("Please select at least one department.");
    return false;
}

function validateSalary() {
    if (salaryRef.value === "select") {
        alert("Please select a salary.");
        return false;
    }
    return true;
}

function validateDate() {
    if (dayRef.value === "Day" || monthRef.value === "Month" || yearRef.value === "Year") {
        alert("Please select a valid start date.");
        return false;
    }
    return true;
}

// Clear form
function clearForm() {
    formRef.reset();
    nameErrorRef.style.display = "none";
}


submitBtnRef.addEventListener("click", (e) => {
    e.preventDefault();

    const nameVal = nameRef.value.trim();
    const editEmpIndex = localStorage.getItem('editEmpIndex');

    if (!validateName(nameVal) || !validateProfile() || !validateGender() || !validateDepartments() || !validateSalary() || !validateDate()) {
        return;
    }

    let selectedProfile = "";
    for (let element of profileRef) {
        if (element.checked) {
            selectedProfile = element.value;
        }
    }

    let selectedGender = "";
    for (let element of genderRef) {
        if (element.checked) {
            selectedGender = element.value;
        }
    }

    let selectedDepartments = [];
    for (let element of departmentRefs) {
        if (element.checked) {
            selectedDepartments.push(element.value);
        }
    }

    const selectedSalary = salaryRef.value;
    const selectedStartDate = `${dayRef.value}-${monthRef.value}-${yearRef.value}`;
    const notesVal = notesRef.value;

    // Create employee object
    const empDataObj = {
        name: nameVal,
        profile: selectedProfile,
        gender: selectedGender,
        departments: selectedDepartments,
        salary: selectedSalary,
        startDate: selectedStartDate,
        notes: notesVal,
    };

    let empRecordList = JSON.parse(localStorage.getItem("empDataList")) || [];

    if (editEmpIndex !== null) {
        empRecordList[editEmpIndex] = empDataObj;
        localStorage.removeItem('editEmpIndex');
    } else {
        empRecordList.push(empDataObj);
    }

    localStorage.setItem('empDataList', JSON.stringify(empRecordList));

    

    clearForm();
    window.location.href = '../pages/employee_dashboard.html';  
});

cancelBtnRef.addEventListener("click", (e) => {
    e.preventDefault();
    clearForm();
    localStorage.removeItem('editEmpIndex');
    window.location.href = '../pages/employee_dashboard.html';
});

resetBtnRef.addEventListener("click", (e) => {
    e.preventDefault();
    clearForm();
});


document.addEventListener('DOMContentLoaded', (event) => {
    const editEmpIndex = localStorage.getItem('editEmpIndex');
    if (editEmpIndex !== null) {
        loadEmployeeDataForEdit(editEmpIndex);
    }
});

function loadEmployeeDataForEdit(index) {
    const empDataList = JSON.parse(localStorage.getItem('empDataList')) || [];
    const employee = empDataList[index];

    if (employee) {
        document.getElementById('name').value = employee.name;
        document.querySelector(`input[value="${employee.profile}"]`).checked = true;
        document.getElementById(employee.gender).checked = true;
        employee.departments.forEach(department => {
            document.getElementById(department).checked = true;
        });
        document.getElementById('salary').value = employee.salary;
        const [day, month, year] = employee.startDate.split('-');
        document.getElementById('day').value = day;
        document.getElementById('month').value = month;
        document.getElementById('year').value = year;

       
    }
}
