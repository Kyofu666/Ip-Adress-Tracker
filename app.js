
const input = document.querySelector('input')
const getIpBtn = document.querySelector('button')
const displayIpAdress = document.querySelector('.__info__ipAdress p')
const displayLocation = document.querySelector('.__info__location p')
const displayTimezone = document.querySelector('.__info__timezone p')
const displayIPS = document.querySelector('.__info__ips p')

const map = L.map('map').setView([0, 0], 1);
const marker = L.marker([50.5, 30.5]).addTo(map);

// restriction to only enter number
input.addEventListener('keyup', (e) => {
    const check = e.key

    if (!/[^a-zA-Z]/.test(check)) {
        input.value = '';
        return;
    }
})


L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - Tiles courtesy of <a href="https://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>',
}).addTo(map);

function SetView(update_marker = [0, 0]) {
    map.setView(update_marker, 13)
}

// by defalt when page load your ip adress will popUp as a suggestion to use 
window.addEventListener('DOMContentLoaded', () => {

    try {
        async function getUserApi() {
            const userIpAdress = 'https://api.ipify.org?format=json'
            const resp = await fetch(userIpAdress)
            const data = await resp.json()
            return data
        }

        if (!input.value) {
            getUserApi().then((data) => {
                const { ip } = data
                input.value = ip
                return input.value
            })
        }

    } catch (err) {
        console.log('Error,something went wrong');
    }
})


getIpBtn.addEventListener('click', () => {
    const ip = input.value
    const url = ('https://geo.ipify.org/api/v2/country,city?apiKey=at_nJa7OAHieBCwfUYpL0hBKExYIyqsV&ipAddress=' + ip)
    try {
        async function getData() {
            const resp = await fetch(url)
            const data = await resp.json()
            return data

        }

        getData().then(data => {
            console.log(data);
            const { ip, isp, location: { country, region, timezone, lat, lng, postalCode } } = data
            L.marker([lat, lng]).addTo(map);

            displayIpAdress.textContent = ip
            displayLocation.innerHTML = `${region}, ${country}<br>${postalCode}`
            displayTimezone.textContent = ` UTC ${timezone}`
            displayIPS.innerHTML = isp.replace(' ', '<br>')
            SetView([lat, lng])
        })

    } catch (err) {
        console.log(err);
    }

})

