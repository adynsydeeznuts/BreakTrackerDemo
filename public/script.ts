const fetchBreaks = async () => {
    const response = await fetch('/api/breaks');
    const breaks = await response.json();
    console.log(breaks);
};

document.addEventListener('DOMContentLoaded', fetchBreaks);