const search = document.getElementById("search");
const form = document.getElementById("ip-input");

const ipAddress = document.getElementById("ip-address");
const local = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp-address");

let ipResult;
let newIpResult;
let data = "";
let mymap;

let icon = L.icon({
    iconUrl: "images/icon-location.svg"
});

search.addEventListener("input", (e) => {
    data = e.target.value;
});

form.addEventListener("submit", (e) => {
    e.preventDefault()
    ipSearch()
});

const fetchIp = async () => {
    const apiKey = "at_lTws9ppH6jOdcWxTUIDZl8f7f8eTy"

    ipResult = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${data}`)
        .then(res => res.json())
        .then(ipResult => {
            newIpResult = ipResult;
            if (newIpResult.code === 422) {
                alert("Not a valid IP address")
                ipAddress.innerHTML = "";
                local.innerHTML = "";
                timezone.innerHTML = "";
                isp.innerHTML = "";
                search.value = "";
            }
        })
        .catch(error => {
            alert("There was a problem retrieving data, please try again.")
            console.log(error)
        })
};

const mapFind = (newIpResult) => {
    if (mymap) {
        mymap.remove()
    };
    const lat = newIpResult.location.lat;
    const lng = newIpResult.location.lng;

    mymap = L.map("mapid", {
        center: [(lat - 0.02), lng],
        zoom: 10,
        zoomControl: false
    });
    L.marker([lat, lng], {
        iconUrl: icon
    }).addTo(mymap);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoidHJob21iZXJnIiwiYSI6ImNrZnljNGxsczI5eWsycW84NXQwYmw1MXYifQ.YX58jUYHo5YGtvgNFhVnDw'
    }).addTo(mymap);
}

const result = newIpResult => {
    ipAddress.innerHTML = newIpResult.ip;
    local.innerHTML = `${newIpResult.location.city}, ${newIpResult.location.region}`;
    timezone.innerHTML = `UTC: ${newIpResult.location.timezone}`;
    isp.innerHTML = newIpResult.isp;
}

const ipSearch = async () => {
    await fetchIp(data)
    result(newIpResult)
    mapFind(newIpResult)
}

const init = (() => {
    ipSearch()
});