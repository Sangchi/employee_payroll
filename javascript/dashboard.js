$(document).ready(function () {
    const apiUrl = 'http://localhost:3000/employees'; // Your JSON server endpoint

    // Function to load employee data
    function loadEmployeeData() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (empDataList) {
                const employeeTableBody = $('#display tbody');
                employeeTableBody.empty(); // Clear existing rows

                if (empDataList.length === 0) {
                    employeeTableBody.append('<tr><td colspan="7">No Employee Data Found</td></tr>');
                    return;
                }

                empDataList.forEach((employee, index) => {
                    const row = `
                        <tr>
                            <td><img src="${employee.profile}" style="width: 50px; height: 50px; border-radius: 50%;"></td>
                            <td>${employee.name}</td>
                            <td>${employee.gender}</td>
                            <td>${employee.departments.map(department => `<span class="department-label">${department}</span>`).join('')}</td>
                            <td>${employee.salary}</td>
                            <td>${employee.startDate}</td>
                            <td>
                                <button onclick="deleteEmployee(${index}, this)" class="delete">
                                    <img src="../assets/delete_icon.png" alt="Delete" />
                                </button>
                                <button onclick="editEmployee(${index})" class="edit">
                                    <img src="../assets/edit_icon.png" alt="Edit" />
                                </button>
                            </td>
                        </tr>
                    `;
                    employeeTableBody.append(row);
                });
            },
            error: function () {
                alert('Error loading employee data.');
            }
        });
    }

    // Function to delete an employee
    window.deleteEmployee = function (index, button) {
        if (confirm("Are you sure you want to delete this employee?")) {
            $.ajax({
                url: apiUrl,
                type: 'GET',
                success: function (empDataList) {
                    const employeeId = empDataList[index].id; // Get employee ID by index

                    $.ajax({
                        url: `${apiUrl}/${employeeId}`,
                        type: 'DELETE',
                        success: function () {
                            alert('Employee deleted successfully.');
                            loadEmployeeData(); // Reload the table after deletion
                        },
                        error: function () {
                            alert('Error deleting employee. Please try again.');
                        }
                    });
                },
                error: function () {
                    alert('Error fetching employee data for deletion.');
                }
            });
        }
    };

    // Function to edit an employee (redirect to the edit form)
    window.editEmployee = function (index) {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function (empDataList) {
                const employeeId = empDataList[index].id; // Get employee ID by index
                localStorage.setItem('editId', employeeId); // Store ID in localStorage
                window.location.href = `employee_register.html?editId=${employeeId}`; // Redirect to the edit form
            },
            error: function () {
                alert('Error fetching employee data for editing.');
            }
        });
    };

    // Search functionality
    $('#search-button').on('click', function () {
        const searchInput = $('#search-input').val().toLowerCase();
        const tableRows = $('#display tbody tr');

        tableRows.each(function () {
            const nameText = $(this).find('td:nth-child(2)').text().toLowerCase();  // Name column
            const genderText = $(this).find('td:nth-child(3)').text().toLowerCase(); // Gender column
            const departmentText = $(this).find('td:nth-child(4)').text().toLowerCase(); // Department column

            if (nameText.includes(searchInput) || genderText.includes(searchInput) || departmentText.includes(searchInput)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Load employee data when the page is ready
    loadEmployeeData();
});
