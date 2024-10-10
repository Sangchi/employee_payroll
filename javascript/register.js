$(document).ready(function () {
    const apiUrl = 'http://localhost:3000/employees'; // Your JSON server endpoint
    const form = $('#emp-form');
    
    // Initialize validation rules
    form.validate({
        rules: {
            name: {
                required: true,
                minlength: 3,
                lettersOnly: true
            },
            profile: "required",
            gender: "required",
            salary: "required",
            day: "required",
            month: "required",
            year: "required",
            'department[]': {
                required: true,
                minlength: 1
            }
        },
        messages: {
            name: {
                required: "Please enter a name",
                minlength: "Name must be at least 3 characters long",
                lettersOnly: "Name must contain only letters and spaces"
            },
            profile: "Please select a profile",
            gender: "Please select a gender",
            salary: "Please select a salary",
            day: "Please select a start day",
            month: "Please select a start month",
            year: "Please select a start year",
            'department[]': "Please select at least one department"
        },
        submitHandler: function (form) {
            handleSubmit();
        }
    });

    // Add custom validator for name to allow only letters and spaces
    $.validator.addMethod("lettersOnly", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    });

    // Function to handle form submission
    function handleSubmit() {
        const empData = {
            name: $('#name').val(),
            profile: $('input[name="profile"]:checked').val(),
            gender: $('input[name="gender"]:checked').val(),
            departments: $('input[name="department"]:checked').map(function() { return this.value; }).get(),
            salary: $('#salary').val(),
            startDate: `${$('#day').val()}-${$('#month').val()}-${$('#year').val()}`,
            notes: $('#notes').val()
        };

        const editId = localStorage.getItem('editId');  // Get edit ID from localStorage
        if (editId) {
            updateEmployee(editId, empData);
        } else {
            addNewEmployee(empData);
        }
    }

    // Function to add a new employee using AJAX
    function addNewEmployee(empData) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(empData),
            success: function () {
                alert('Employee added successfully');
                window.location.href = 'employee_dashboard.html'; // Redirect to dashboard
            },
            error: function () {
                alert('Error adding employee. Please try again.');
            }
        });
    }

    // Function to update existing employee
    function updateEmployee(id, empData) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(empData),
            success: function () {
                alert('Employee updated successfully');
                localStorage.removeItem('editId');
                window.location.href = 'employee_dashboard.html'; // Redirect to dashboard
            },
            error: function () {
                alert('Error updating employee. Please try again.');
            }
        });
    }

    // Function to reset the form
    $('.reset').on('click', function () {
        form[0].reset();
        form.validate().resetForm();
    });

    // Function to cancel and go back to the dashboard
    $('.cancel').on('click', function () {
        window.location.href = 'employee_dashboard.html'; // Redirect to dashboard
    });

    // Load employee data for editing
    const editId = new URLSearchParams(window.location.search).get('editId');
    if (editId) {
        loadEmployeeData(editId);
    }

    function loadEmployeeData(id) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'GET',
            success: function (employee) {
                $('#name').val(employee.name);
                $(`input[name="profile"][value="${employee.profile}"]`).prop('checked', true);
                $(`input[name="gender"][value="${employee.gender}"]`).prop('checked', true);
                employee.departments.forEach(department => {
                    $(`input[name="department"][value="${department}"]`).prop('checked', true);
                });
                $('#salary').val(employee.salary);
                const [day, month, year] = employee.startDate.split('-');
                $('#day').val(day);
                $('#month').val(month);
                $('#year').val(year);
                $('#notes').val(employee.notes);
            },
            error: function () {
                alert('Error loading employee data.');
            }
        });
    }
});
