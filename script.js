window.addEventListener('DOMContentLoaded', (event) => {
    const locationElement = document.getElementById('location');
    const apiKey = '3f3791c21b904da9b10d6998a49946b0'; // OpenCage API Key
    // Description and temperature elements are already set in HTML,
    // but we could get references if needed:
    // const descriptionElement = document.getElementById('description');
    // const temperatureElement = document.getElementById('temperature');

    const options = {
        enableHighAccuracy: false, // Changed to false to potentially improve reliability
        timeout: 10000, // Increased timeout to 10 seconds
        maximumAge: 0
    };

    async function success(pos) {
        const { latitude, longitude } = pos.coords;
        console.log(`Geolocation success: Lat: ${latitude}, Lon: ${longitude}`);
        locationElement.textContent = 'Fetching city name...'; // Update status

        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=en&pretty=1`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`OpenCage API error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const components = data.results[0].components;
                // Try to get city, fallback to county, then state, then country
                const city = components.city || components.town || components.village || components.county || components.state || components.country || 'Your Location';
                console.log('Reverse geocoding successful:', city);
                locationElement.textContent = city;
            } else {
                console.warn('OpenCage API returned no results.');
                locationElement.textContent = 'Location Name Unavailable';
            }
        } catch (fetchError) {
            console.error('Error fetching or parsing reverse geocoding data:', fetchError);
            locationElement.textContent = 'Could Not Fetch Location Name';
        }
    }

    function error(err) {
        console.warn(`Geolocation ERROR(${err.code}): ${err.message}`);
        let errorMessage = 'Could not determine location.';
        if (err.code === 1) { // PERMISSION_DENIED
            errorMessage = 'Location access denied.';
        } else if (err.code === 2) { // POSITION_UNAVAILABLE
            errorMessage = 'Location information is unavailable.';
        } else if (err.code === 3) { // TIMEOUT
            errorMessage = 'Location request timed out.';
        }
        locationElement.textContent = errorMessage;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        locationElement.textContent = 'Geolocation is not supported by this browser.';
    }
});
