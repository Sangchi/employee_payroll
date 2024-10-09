document.addEventListener('DOMContentLoaded', (event) => {
    displayEmployeeData();
});

const apiUrl = 'http://localhost:3000/employees'; // Your JSON server endpoint

// Function to fetch and display employee data
function displayEmployeeData() {
    const employeeTableBody = document.querySelector('#display tbody'); 

    fetch(apiUrl)
        .then(response => response.json())
        .then(empDataList => {
            employeeTableBody.innerHTML = '';

            if (empDataList.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = '<td colspan="7">No Employee Data Found</td>';
                employeeTableBody.appendChild(emptyRow);
                return;
            }

            empDataList.forEach((employee, index) => { // Using index as ID
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${employee.profile}" style="width: 50px; height: 50px; border-radius: 50%;"></td>
                    <td>${employee.name}</td>
                    <td>${employee.gender}</td>
                    <td>${employee.departments.join(', ')}</td>
                    <td>${employee.salary}</td>
                    <td>${employee.startDate}</td>
                    <td>
                        <button onclick="deleteEmployee(${index}, this)" class="delete"><img src="../assets/delete_icon.png" alt="Delete" /></button>
                        <button onclick="editEmployee(${index})" class="edit"><img src="../assets/edit_icon.png" alt="Edit" /></button>
                    </td>
                `;
                
                employeeTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
            alert('Could not fetch employee data. Please try again later.');
        });
}

// Function to delete employee
function deleteEmployee(index, button) {
    if (confirm("Are you sure you want to delete this employee?")) {
        // Fetch the current employee list from the JSON server
        fetch(apiUrl)
            .then(response => response.json())
            .then(empDataList => {
                // Find the employee ID based on the index
                const employeeId = empDataList[index].id; // Assuming each employee object has an `id` property

                // Send DELETE request to the JSON server
                fetch(`${apiUrl}/${employeeId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        // Remove the employee row from the UI
                        const row = button.closest('tr');
                        row.remove(); // Remove the row from the UI

                        // Update localStorage by removing the employee from the local list
                        const updatedList = empDataList.filter((_, i) => i !== index);
                        localStorage.setItem('empDataList', JSON.stringify(updatedList));
                    } else {
                        console.error('Failed to delete employee:', response.status);
                        alert('Could not delete employee. Please try again later.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting employee from server:', error);
                    alert('Could not delete employee. Please try again later.');
                });
            })
            .catch(error => {
                console.error('Error fetching employee data for deletion:', error);
                alert('Could not fetch employee data for deletion. Please try again later.');
            });
    }
}


function editEmployee(index) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(empDataList => {
            const employeeId = empDataList[index].id;  // Get the unique id of the employee

            // Store the employee ID in the URL for the form page
            localStorage.setItem('editId', employeeId);

            // Redirect to the form page
            window.location.href = `employee_register.html?editId=${employeeId}`;
        });
}

// Search functionality
document.getElementById('search-button').addEventListener('click', function () {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#display tbody tr'); 

    tableRows.forEach(row => {
        const nameCell = row.getElementsByTagName('td')[1]; // Name column
        const genderCell = row.getElementsByTagName('td')[2]; // Gender column
        const departmentCell = row.getElementsByTagName('td')[3]; // Department column

        if (nameCell) {
            const nameText = nameCell.textContent.toLowerCase();
            const genderText = genderCell.textContent.toLowerCase();
            const departmentText = departmentCell.textContent.toLowerCase();

            if (nameText.includes(searchInput) || genderText.includes(searchInput) || departmentText.includes(searchInput)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
});
