document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('htmlGrid');

    // Directory URL containing HTML pages
    const directoryUrl = '../jp';

    // Number of HTML pages to display
    const numPages = 100; // Adjust this based on your actual number of pages

    // Generate HTML elements for each page
    for (let i = 1; i <= numPages; i++) {
        const pageNumber = i.toString().padStart(2, '0'); // Ensure two-digit format
        const pageUrl = `${directoryUrl}${pageNumber}.html`;

        // Create grid item element
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        // Create link element for each page
        const link = document.createElement('a');
        link.href = pageUrl;
        link.target = '_blank'; // Open link in new tab/window
        link.textContent = `Page ${pageNumber}`;

        // Append link to grid item
        gridItem.appendChild(link);

        // Append grid item to grid container
        gridContainer.appendChild(gridItem);
    }
});

