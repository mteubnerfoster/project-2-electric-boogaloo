console.log("foodjs")


function foodBtnClick() {
    foodChoice = $(this).data('value')
    localStorage.setItem('food', foodChoice);

    navigator.geolocation.getCurrentPosition(function (position) {
        let storeLat = position.coords.latitude;
        let storeLong = position.coords.longitude;
        localStorage.setItem('lat', storeLat);
        localStorage.setItem('long', storeLong);
    })
}

async function submitBtn() {

    let lat = localStorage.getItem('lat');
    let long = localStorage.getItem('long');
    let foodChoice = localStorage.getItem('food');
    let plantChoice = localStorage.getItem('plant');

    if (lat && long) {
        if (foodChoice) {
            if (plantChoice) {
                let foodTruckChoices = []
                let userLat = localStorage.getItem('lat');
                let userLong = localStorage.getItem('long');
                let foodChoice = localStorage.getItem('food');
                let plantChoice = localStorage.getItem('plant');
                let url = `/api/yelp?lat=${userLat}&long=${userLong}&term=${foodChoice}&category=foodtrucks`
                await fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(element => {
                            let nearestDisp = nearestDispensary(element.coordinates.latitude, element.coordinates.longitude, plantChoice)
                            console.log(nearestDisp)
                            foodTruckChoices.push(element)
                        });
                    });

                await fetch('/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(foodTruckChoices)
                }).then(
                    document.location.replace(`/search`)
                );
            } else {
                alert('Please select a plant type.')
            }
        } else {
            alert('Please select a food type.')
        }
    } else {
        alert("An error occured, please enable location services")
    }
}

async function nearestDispensary(lat, long, plantChoice) {

    let url = `/api/yelp?lat=${lat}&long=${long}&term=${plantChoice}&category=cannabisdispensaries&limit=1`
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            return data[0]
        });
}


$('.foodbtn').click(foodBtnClick)
$('.submitbtn').click(submitBtn)