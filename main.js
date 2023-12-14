document.addEventListener('DOMContentLoaded', function () {
    fetch('http://127.0.0.1:8000/api/clientes/')
        .then(response => response.json())
        .then(data => createTables(data));
});

function createTables(data) {
    const clientList = document.getElementById('clientList');
    clientList.innerHTML = ''; // Clear existing content

    const unprocessedClients = data.filter(client => !client.processed);
    const processedClients = data.filter(client => client.processed);

    const unprocessedTable = createTable(unprocessedClients, true);
    const processedTable = createTable(processedClients, false);

    clientList.appendChild(unprocessedTable);
    clientList.appendChild(processedTable);
}

function createTable(data, isUnprocessed) {
    const table = document.createElement('table');
    table.className = 'table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Name', 'Status', 'Priority'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.sort((a, b) => isUnprocessed ? b.priority - a.priority : 0);
    data.forEach(client => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.appendChild(document.createTextNode(client.nombre));
        row.appendChild(nameCell);

        const statusCell = document.createElement('td');
        statusCell.appendChild(document.createTextNode(client.status));
        row.appendChild(statusCell);

        const priorityCell = document.createElement('td');
        priorityCell.appendChild(document.createTextNode(client.priority));

        // Create and append the dot svg
        const dotSvg = createDotSvg(client.priority, isUnprocessed);
        priorityCell.appendChild(dotSvg);

        row.appendChild(priorityCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}

function createDotSvg(priority, isUnprocessed) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', '16');
    svg.setAttribute('width', '16');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '8');
    circle.setAttribute('cy', '8');
    circle.setAttribute('r', '6');

    // Set the color based on priority
    if (isUnprocessed) {
        if (priority <= 50) {
            circle.setAttribute('fill', 'green');
        } else if (priority <= 75) {
            circle.setAttribute('fill', 'yellow');
        } else {
            circle.setAttribute('fill', 'red');
        }
    } else {
        // For processed clients, always set the color to gray
        circle.setAttribute('fill', 'gray');
    }

    svg.appendChild(circle);
    return svg;
}
