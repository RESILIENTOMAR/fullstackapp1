
var trash = document.getElementsByClassName("fa-trash");


Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    fetch('messages', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': name,
        'msg': msg
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});


//========================JAPAN======================================
function getCuisine(event) {
  console.log(event.target.dataset.cuisine)
  // const url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=95126682&app_key=0f2861679f02814dff4dbfb672f5b302&cuisineType=${event.target.dataset.cuisine}`;
  const url = `/recipies/${event.target.dataset.cuisine}`
console.log(url)
  fetch(url)
      .then(res => res.json())
      .then(data => {
          console.log(data)
          const randomNum = Math.floor(Math.random() * data.hits.length);
          console.log(data.hits[randomNum])
          document.querySelector('#foodImg').src = data.hits
          [randomNum].recipe.image
          document.querySelector('#list').innerText = data.hits[randomNum].recipe.ingredientLines
          document.querySelector('#dish').innerText = data.hits[randomNum].recipe.label
          

      })
      // .catch(err => {
      //     console.log(`error ${err}`)
      // });
}
document.querySelector('#FoodBtn').addEventListener('click', getCuisine)
const dropdown = document.getElementById("dropdown");
dropdown.addEventListener("change", function() {
  const url = dropdown.value;
  if (url !== "") {
    window.location.href = url;
  }
});

// =========================US===========================================

// document.querySelector('#foodBtn').addEventListener('click', getCuisine)

// function getUsFood() {
//   const url = "https://api.edamam.com/api/recipes/v2?type=public&app_id=95126682&app_key=0f2861679f02814dff4dbfb672f5b302&cuisineType=American";

//   fetch(url)
//       .then(res => res.json())
//       .then(data => {
//           console.log(data)
//           const randomNum = Math.floor(Math.random() * 20) + 1;
//           document.querySelector('#usingrList').innerText = data.hits[randomNum].recipe.ingredientLines
//           document.querySelector('#usfoodImg').src = data.hits[randomNum].recipe.image
//           document.querySelector('#usDish').innerText = data.hits[randomNum].recipe.label
          

//       })
//       .catch(err => {
//           console.log(`error ${err}`)
//       });
//     }

    //==================CUISINE=====================//
    