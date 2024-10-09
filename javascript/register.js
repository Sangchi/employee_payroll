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
const submitBtnRef = document.querySelector(".submit");
const cancelBtnRef = document.querySelector(".cancel");
const resetBtnRef = document.querySelector(".reset");
const formRef = document.getElementById("emp-form");

const apiUrl = 'http://localhost:3000/employees';

// Load employee data for editing
document.addEventListener('DOMContentLoaded', (event) => {
    const editId = new URLSearchParams(window.location.search).get('editId'); // Get the employee ID from URL

    if (editId !== null) {
        loadEmployeeDataForEdit(editId);
    }
});

function loadEmployeeDataForEdit(id) {
    fetch(`${apiUrl}/${id}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Employee not found.');
                }
                throw new Error('Failed to load employee data.');
            }
            return response.json();
        })
        .then(employee => {
            // Set the name value 
            nameRef.value = employee.name;

            // Set the profile radio button
            const profileElement = document.querySelector(`input[value="${employee.profile}"]`);
            if (profileElement) {
                profileElement.checked = true;
            } else {
                console.error(`Profile option for value "${employee.profile}" not found.`);
            }

            // Set the gender radio button
            const genderElement = document.getElementById(employee.gender);
            if (genderElement) {
                genderElement.checked = true;
            } else {
                console.error(`Gender option for value "${employee.gender}" not found.`);
            }

            employee.departments.forEach(department => {
                const departmentElement = document.getElementById(department);
                if (departmentElement) {
                    departmentElement.checked = true; // Check the checkbox if found
                } else {
                    console.error(`Department checkbox for "${department}" not found.`);
                }
            });
            

            // Set salary value
            salaryRef.value = employee.salary;

            // Set start date
            const [day, month, year] = employee.startDate.split('-');
            if (dayRef && monthRef && yearRef) {
                dayRef.value = day;
                monthRef.value = month;
                yearRef.value = year;
            } else {
                console.error('One or more date fields (day, month, year) are missing.');
            }

            // Set notes value
            notesRef.value = employee.notes;
        })
        .catch(error => {
            console.error('Error loading employee data:', error);
            alert(error.message);  // Show an alert with the error message
        });
}


// Validate form fields
function validateName(name) {
    const namePattern = /^[a-zA-Z\s']{3,}$/;
    if (!namePattern.test(name)) {
        nameErrorRef.style.display = "block";
        nameErrorRef.textContent = "Name must be at least 3 characters long and contain only letters and spaces.";
        return false;
    } else {
        nameErrorRef.style.display = "none";
        return true;
    }
}

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

// Submit button functionality
submitBtnRef.addEventListener("click", (e) => {
    e.preventDefault();

    const nameVal = nameRef.value.trim();
    const editId = new URLSearchParams(window.location.search).get('editId');

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

    const empDataObj = {
        name: nameVal,
        profile: selectedProfile,
        gender: selectedGender,
        departments: selectedDepartments,
        salary: selectedSalary,
        startDate: selectedStartDate,
        notes: notesVal,
    };

    if (editId !== null) {
        // Update existing employee
        fetch(`${apiUrl}/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empDataObj)
        })
        .then(() => {
            alert('Employee updated successfully');
            localStorage.removeItem('editId');
            window.location.href = 'employee_dashboard.html';
        })
        .catch(error => console.error('Error updating employee:', error));
    } else {
        // Add new employee
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empDataObj)
        })
        .then(() => {
            alert('Employee added successfully');
            window.location.href = 'employee_dashboard.html';
        })
        .catch(error => console.error('Error adding employee:', error));
    }

    clearForm();
});

// Cancel button functionality
cancelBtnRef.addEventListener("click", (e) => {
    e.preventDefault();
    clearForm();
    window.location.href = 'employee_dashboard.html'; // Redirect to dashboard
});

// Reset button functionality
resetBtnRef.addEventListener("click", (e) => {
    e.preventDefault();
    clearForm();
});
