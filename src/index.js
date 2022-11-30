document.addEventListener('DOMContentLoaded', () => {

    let allDogs
    fetch("http://localhost:3000/pups")
        .then(resp => resp.json())
        .then(data => {
            allDogs = data
            renderDogs(allDogs)
        })


    document.getElementById("good-dog-filter").addEventListener('click', (e) => {
        let goodDogArr = allDogs.filter(dog => dog.isGoodDog)
        console.log(goodDogArr)
        console.log(e.target.textContent)
        if (e.target.textContent === "Filter good dogs: OFF") {
            renderDogs(goodDogArr)
            e.target.textContent = "Filter good dogs: ON"
        } else {
            renderDogs(allDogs)
            e.target.textContent = "Filter good dogs: OFF"
        }
    })

    function renderDogs(allDogs) {

        removeSpanNodes()

        allDogs.forEach(dog => {

            let dogSpan = document.createElement("span")
            dogSpan.textContent = dog.name

            document.getElementById("dog-bar").append(dogSpan)

            dogSpan.addEventListener('click', (e) => {

                e.preventDefault()

                fetch("http://localhost:3000/pups")
                    .then(resp => resp.json())
                    .then(data => {
                        removeChildNodes()
                        let clickedDog = data.filter(dog => dog.name === e.target.textContent)
                        renderDogInfo(clickedDog[0])
                    })

            })


            function renderDogInfo(dog) {

                let goodOrBad
                if (dog.isGoodDog) {
                    goodOrBad = "Good dog!"
                } else {
                    goodOrBad = "Bad dog!"
                }
                let dogInfo = document.createElement("div")
                dogInfo.class = "dog-info"
                dogInfo.innerHTML = `
                <img src="${dog.image}" height="400px"/ width="300px">
                <h2 id="currentDogName">${dog.name}</h2>
                <button id="dogBtn">${goodOrBad}</button>`

                document.getElementById("dog-summary-container").append(dogInfo)
                changeDogStatus(dog)

            }

            function changeDogStatus(dog) {

                let newDogSatus = !dog.isGoodDog

                let newDogObj = {
                    isGoodDog: newDogSatus
                }

                document.getElementById("dogBtn").addEventListener('click', () => {

                    fetch(`http://localhost:3000/pups/${dog.id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        method: 'PATCH',
                        body: JSON.stringify(newDogObj)
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            removeChildNodes()
                            renderDogInfo(data)
                            alert("Dog updated! Refresh window for updates to apply to Good Dog FIlter")
                        })
                })
            }
        })
    }
})

function removeSpanNodes() {
    let container = document.getElementById("dog-bar")

    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
}


function removeChildNodes() {

    let container = document.getElementById("dog-summary-container")

    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
}