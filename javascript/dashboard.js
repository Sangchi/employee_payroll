document.addEventListener('DOMContentLoaded', (event) => {
    displayEmployeeData();
});


function displayEmployeeData() {
    const employeeTableBody = document.querySelector('#display tbody'); 
    const empDataList = JSON.parse(localStorage.getItem('empDataList')) || [];

    employeeTableBody.innerHTML = '';

    if (empDataList.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="6">No Employee Data Found</td>';
        employeeTableBody.appendChild(emptyRow);
        return;
    }

    empDataList.forEach((employee, index) => {
        
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${employee.profile}" style="width: 50px; height: 50px; border-radius: 50%;"> </td>
            <td>${employee.name}</td>
            <td>${employee.gender}</td>
            <td>${employee.departments.join(', ')}</td>
            <td>${employee.salary}</td>
            <td>${employee.startDate}</td>
            <td>
                <button onclick="deleteEmployee(${index})" class="delete"><img src="../assets/delete_icon.png" alt="Delete" /></button>
                <button onclick="editEmployee(${index})" class="edit"><img src="../assets/edit_icon.png" alt="Edit" /></button>
            </td>
        `;
        
        employeeTableBody.appendChild(row);
    });
}

function deleteEmployee(index) {
    let empDataList = JSON.parse(localStorage.getItem('empDataList')) || [];
    empDataList.splice(index, 1);
    localStorage.setItem('empDataList', JSON.stringify(empDataList));
    displayEmployeeData();
}

function editEmployee(index) {
    localStorage.setItem('editEmpIndex', index); 
    window.location.href = 'employee_register.html';
}


document.getElementById('search-button').addEventListener('click', function () {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const tableRows = document.querySelectorAll('#display tbody tr'); 

    tableRows.forEach(row => {
        const nameCell = row.getElementsByTagName('td')[0]; 
        const genderCell = row.getElementsByTagName('td')[1]; 
        const departmentCell = row.getElementsByTagName('td')[2];

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
