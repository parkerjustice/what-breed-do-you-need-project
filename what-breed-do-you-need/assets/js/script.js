var searchedBreed = document.querySelector("#breed-name");
var modal = document.querySelector("#no-input");
var searchButton = document.querySelector(".search-button");
var dogInfoEl = document.querySelector(".dog-info");
var favoriteDogEl = document.querySelector(".favorite-dogs");
let addFaveContainerEl = document.querySelector(".add-fave");
var savedDogs = [];
var searchTerm = ""
var searchNum = 0
var wikiBox = document.querySelector("iframe");


var formSubmitHandler = function(event) {
    event.preventDefault();
    //get breed
    var breed = searchedBreed.value.trim();
    searchTerm = breed + " dog"
    //if there is an input
    if(breed) {
        loadDog(searchTerm);
        
        //clear old search
        searchedBreed.value = "";
        
        return breed;
        
    } else {
        // modal.style.display = "block";
    }
    return breed;
};

var loadDog = function(breed) {
    clearChildren(dogInfoEl);
    var breed = searchedBreed.value.trim();    
    //get random pic of breed
    getDogPic(breed);
    // get wiki article
    getWiki(breed);
    makeFaveButton(breed);
}

var reLoadDog = function(breed) {
    clearChildren(dogInfoEl);
    //get random pic of breed
    getDogPic(breed);
    // get wiki article
    getWiki(breed);
        
    makeFaveButton(breed);
}

var getWiki = function(breed) {
    var url = "https://en.wikipedia.org/w/api.php"; 
    console.log(searchTerm);
    searchTerm = breed;
    var params = {
        action: "opensearch",
        search: searchTerm,
        limit: "5",
        namespace: "0",
        format: "json",
        profile: "strict"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    fetch(url).then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
        .then(function(data) {
            //get array with wiki link
            console.log(data);
            var wiki = data[3];
            console.log(wiki);
            if (wiki != undefined) {
                if(wiki.length > 0) {
                    searchNum = 0;
                    //take link out of array
                    var wikiLink = wiki[0];
                    //break up the link
                var brokenWikiLink = wikiLink.split(".")
                //make it mobile link
                var mobileWikiLink = brokenWikiLink[0] + ".m." + brokenWikiLink[1] + "." + brokenWikiLink[2];
                //make an iframe
                var wikiBox = document.createElement("iframe");
                wikiBox.style.cssText = " height: 700px; box-shadow: 5px 10px orange; width: 850px; "
                //give the iframe the right source
                wikiBox.src = mobileWikiLink;
                //put the iframe on the page
                dogInfoEl.appendChild(wikiBox);
                }
                else {
                    console.log(searchNum);
                    if (searchNum === 0){
                        var breed = searchedBreed.value.trim();
                        searchTerm = breed
                        getWiki(breed);
                        searchNum++
                    }
                    
                }
                
            }
            else {
                console.log(searchNum);
                if (searchNum > 0 && searchNum < 2){
                    var breed = searchedBreed.value.trim();
                    console.log(breed)
                    searchTerm = breed
                    getWiki(breed);
                    searchNum++
                }
                
            }
            
    })
        .catch(function(error){console.log(error);});
};

const getDogPic = function(breed) {
    breed = breed.toLowerCase().split(' ').join('');
    const dogPicUrl = "https://dog.ceo/api/breed/" + breed + "/images/random";
    

    fetch(dogPicUrl) 
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    // create img element
                    const dogPicEl = document.createElement('img');
                    dogPicEl.style.cssText = "margin: 35px; box-shadow: 5px 10px gold; max-width: 650px; max-height: 700px " 
                    // set img src to data
                    dogPicEl.setAttribute('src', data.message);

                    // append to container div
                    dogInfoEl.appendChild(dogPicEl);
                });
            } else {
                console.log("Sorry, that breed was not found!");
            }
        })
        .catch(function(error) {
            console.log('Error encountered: ' + error);
        })

};

var makeFaveButton = function(breed) {
    // clear old button
    clearChildren(addFaveContainerEl);
    //make fave button
    var faveButton = document.createElement("button");
    // button says add to favorites
    faveButton.textContent = "Add to Favorites!";
    faveButton.setAttribute('id', 'fav-btn');
    faveButton.style.cssText = "border: 1px solid black; padding: 10px; background-color: orange;  "
    //button goes to the page
    addFaveContainerEl.appendChild(faveButton);
    //button does makeFave function
    faveButton.addEventListener("click", function(event) {makeFave(breed)});

};

var makeFave = function(breed) {
    loadFaves();
    
    breed = breed.toLowerCase();

    //if there are no instances of that breed in favorites
    if (savedDogs.indexOf(breed) === -1) {
        //put the breed in favorites
        savedDogs.push(breed);
        //make a button
        var dogButton = document.createElement("button");
        
        
        // button says breed selected
        dogButton.innerHTML = "<h2>" + breed + "</h2>"
        dogButton.style.cssText = "border: 1px solid black; padding: 10px; background-color: orange;  "
        //button does loadDog function with the text inside the button
        dogButton.addEventListener("click", function(event) {reLoadDog(event.target.textContent)});
        // add the button to fav list
        favoriteDogEl.appendChild(dogButton);
        //save new list of favorites to local storage
        localStorage.setItem("savedDogs", JSON.stringify(savedDogs));
    } 
};

var loadFaves = function() {
    //load old favorite dogs
    var faves = localStorage.getItem("savedDogs");
    //if there are no favorites, don't do anything
    if (!faves) {
        return false;
    }
    //if there are, load them as saved dogs array
    else {
        savedDogs = JSON.parse(faves);
    }
}

var loadFaveButtons = function() {
    //for each of the favorite dogs in the array
    for (let i = 0; i < savedDogs.length; i++) {
        //make a button
        var dogButton = document.createElement("button");
        dogButton.style.cssText = "border: 1px solid black; padding: 10px; background-color: orange; "
        //set the text as the breed name
        dogButton.innerHTML = "<h2>" + savedDogs[i] + "</h2>"
        // make the button to the loadDog function on a click
        dogButton.addEventListener("click", function(event) {reLoadDog(event.target.textContent)});
        //put the button in the favorite dog list
        favoriteDogEl.appendChild(dogButton);
    }
}

var clearChildren = function(parent) {
    // kill all the children 
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

// $( function() {
//     var availableTags = [
//         "affenpinscher",
//         //"african",
//         "airedale",
//         "akita",
//         "appenzeller",
//         //"australian",
//         "basenji",
//         "beagle",
//         "bluetick",
//         "borzoi",
//         "bouvier",
//         //"boxer",
//         "brabancon",
//         "briard",
//         //"buhund",
//         "bulldog",
//         "bullterrier",
//         "cattledog",
//         "chihuahua",
//         "chow",
//         "clumber",
//         "cockapoo",
//         "collie",
//         "coonhound",
//         "corgi",
//         "cotondetulear",
//         "dachshund",
//         "dalmatian",
//         "dane",
//         "deerhound",
//         "dhole",
//         "dingo",
//         "doberman",
//         "elkhound",
//         "entlebucher",
//         //"eskimo",
//         "finnish",
//         "frise",
//         "germanshepherd",
//         "greyhound",
//         "groenendael",
//         //"havanese",
//         "hound",
//         "husky",
//         "keeshond",
//         "kelpie",
//         "komondor",
//         "kuvasz",
//         "labradoodle",
//         "labrador",
//         "leonberg",
//         "lhasa",
//         "malamute",
//         "malinois",
//         "maltese",
//         "mastiff",
//         "mexicanhairless",
//         //"mix",
//         //"mountain",
//         "newfoundland",
//         "otterhound",
//         "ovcharka",
//         "papillon",
//         "pekinese",
//         "pembroke",
//         "pinscher",
//         "pitbull",
//         //"pointer",
//         "pomeranian",
//         "poodle",
//         "pug",
//         "puggle",
//         "pyrenees",
//         "redbone",
//         "retriever",
//         "ridgeback",
//         "rottweiler",
//         "saluki",
//         "samoyed",
//         "schipperke",
//         "schnauzer",
//         "setter",
//         "sheepdog",
//         "shiba",
//         "shihtzu",
//         "spaniel",
//         "springer",
//         //"stbernard",
//         "terrier",
//         "tervuren",
//         "vizsla",
//         "waterdog",
//         "weimaraner",
//         "whippet",
//         "wolfhound"
//     ];
//     $("#breed-name").autocomplete({
//       source: availableTags
//     });
// } );


loadFaves();
loadFaveButtons();
searchButton.addEventListener("click", formSubmitHandler);