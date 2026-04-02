const labels = {
    en: {
        off: "OFF",
        exportSuccess: "CSV Generated"
    }
};

let employees = [];

document.getElementById('addEmployee').addEventListener('click', () => {
    const employee = {
        name: `${document.getElementById('firstName').value} ${document.getElementById('lastInitial').value}.`.trim(),
        reqOff: document.getElementById('requiredOff').value,
        target: document.getElementById('targetValue').value,
        hours: `${document.getElementById('shiftStart').value} - ${document.getElementById('shiftEnd').value}`
    };

    employees.push(employee);
    updateTable();
});

function updateTable() {
    const tbody = document.querySelector('#scheduleTable tbody');
    tbody.innerHTML = '';

    employees.forEach(emp => {
        const row = document.createElement('tr');
        // Simple logic: If there's a required off date, set a specific day to OFF
        // In a full app, this would map to the specific calendar days.
        row.innerHTML = `
            <td>${emp.name}</td>
            <td>${emp.hours}</td>
            <td>${emp.hours}</td>
            <td>${emp.hours}</td>
            <td>${emp.hours}</td>
            <td>${emp.hours}</td>
            <td>${labels.en.off}</td>
            <td>${labels.en.off}</td>
        `;
        tbody.appendChild(row);
    });
}
