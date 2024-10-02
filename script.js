document.getElementById('base-color').addEventListener('input', function() {
    const color = this.value;
    document.getElementById('color-circle').style.backgroundColor = color;
});

document.getElementById('generate-palette').addEventListener('click', function() {
    const baseColor = document.getElementById('base-color').value;
    const roomType = document.getElementById('room-type').value;
    const rgbColor = hexToRgb(baseColor);

    // Change background image based on selected room
    const backgroundImages = {
        "kitchen": 'images/kitchen.jpg',
        "master-bedroom": 'images/master-bedroom.jpg',
        "pooja-room": 'images/pooja-room.jpg',
        "drawing-room": 'images/drawing-room.jpg',
        "childrens-bedroom": 'images/childrens-bedroom.jpg',
        "home-theatre": 'images/home-theatre.jpg',
        "balcony": 'images/balcony.jpg',
        "terrace": 'images/terrace.jpg',
        "bar-counter": 'images/bar-counter.jpg'
    };
    document.body.style.backgroundImage = `url('${backgroundImages[roomType] || 'images/default.jpg'}')`;

    fetch('http://colormind.io/api/', {
        method: 'POST',
        body: JSON.stringify({
            model: 'default',
            input: [[rgbColor.r, rgbColor.g, rgbColor.b], "N", "N", "N", "N"]
        })
    })
    .then(response => response.json())
    .then(data => {
        const palette = data.result;
        displayPalette(palette);
        suggestDecor(palette, roomType);
    })
    .catch(error => console.error('Error fetching the color palette:', error));
});

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function displayPalette(palette) {
    const paletteDiv = document.getElementById('color-palette');
    paletteDiv.innerHTML = '';
    palette.forEach(color => {
        const colorDiv = document.createElement('div');
        const colorCode = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        colorDiv.style.backgroundColor = colorCode;
        const colorText = document.createElement('span');
        colorText.innerText = colorCode;
        colorDiv.appendChild(colorText);
        colorDiv.addEventListener('click', () => {
            navigator.clipboard.writeText(colorCode);
            alert(`Copied ${colorCode} to clipboard!`);
        });
        paletteDiv.appendChild(colorDiv);
    });
}

function suggestDecor(palette, roomType) {
    const suggestionsDiv = document.getElementById('suggestions');
    const roomItems = {
        "kitchen": ['Cabinets', 'Countertop', 'Backsplash', 'Appliances', 'Flooring'],
        "master-bedroom": ['Walls', 'Bedding', 'Curtains', 'Rugs', 'Furniture'],
        "pooja-room": ['Walls', 'Mandir', 'Decorative Items', 'Lighting', 'Flooring'],
        "drawing-room": ['Sofa', 'Walls', 'Curtains', 'Carpet', 'Decorative Items'],
        "childrens-bedroom": ['Walls', 'Bedding', 'Curtains', 'Toys', 'Furniture'],
        "home-theatre": ['Walls', 'Seating', 'Lighting', 'Carpet', 'Screen'],
        "balcony": ['Walls', 'Flooring', 'Furniture', 'Plants', 'Lighting'],
        "terrace": ['Walls', 'Flooring', 'Furniture', 'Plants', 'Lighting'],
        "bar-counter": ['Walls', 'Seating', 'Lighting', 'Carpet']
    };

    const suggestionsHtml = (roomItems[roomType] || []).map((item, index) => {
        const color = palette[index];
        return `<tr><td>${item}</td><td style="color: rgb(${color[0]}, ${color[1]}, ${color[2]}); font-weight: bold;">rgb(${color[0]}, ${color[1]}, ${color[2]})</td></tr>`;
    }).join('');

    suggestionsDiv.innerHTML = `
        <table class="suggestions-table">
            <thead>
                <tr><th>Item</th><th>Suggested Color</th></tr>
            </thead>
            <tbody>${suggestionsHtml}</tbody>
        </table>
    `;
}
