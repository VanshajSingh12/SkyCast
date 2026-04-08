const userTab= document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");

let currentTab=userTab;
const API_KEY="c6fead0b675fb335b682a708a403c16c";
currentTab.classList.add("current-tab");
getFromSessionStorage();//check initially

function switchTab(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        //active matlab jo dikhega
        //user to search
        if(!searchForm.classList.contains("active")){// if searchForm does not contain active class
            userInfoContainer.classList.remove("active");// baki dono ko invisible karo
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //search to user
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //tumhare location ka weather visible hoga ab
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});


function getFromSessionStorage(){//checks if coordinated are already present in session storage
    const localCoordinates=sessionStorage.getItem("user-coorcinates");
    if(!localCoordinates){//session storage se nahi mila local coordinate
        grantAccessContainer.classList.add("active");
    }
    else{//mil gaya
        const coordinates=JSON.parse(localCoordinates);//to convert json srting to json object
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grant acces container invisible and loader visible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //API call
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);//data me se values nikal ke ui me dikhaega
    }
    catch(e){
        loadingScreen.classList.remove("active");
        //hw error 404 ka image show kardo
    }
} 

function renderWeatherInfo(data){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windSpeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloud=document.querySelector("[data-clouds]");

    //read about optional chaning operator- The optional chaining operator (?.) in JavaScript is a feature that allows you to safely access deeply nested properties of an object 
    //without having to check each level for null or undefined.(read more in chatgpt)
    //see the format of API response(data) by pasting api url with city or latitude longitude and apikey on chrome
    cityName.innerText=data?.name;
    //countryIcon.src=`https://flagcdn.com/144x108${data?.sys?.counrty.toLowerCase()}.png`;//no country code in response, therefore not working
    desc.innerText=data?.weather?.[0]?.description;//data ke andar weather ke andar weather ke first element ke andar description
    weatherIcon.src=`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText=`${data?.main?.temp} °C`;
    windSpeed.innerText=`${data?.wind?.speed} m/s`;
    humidity.innerText=`${data?.main?.humidity}%`;
    cloud.innerText=`${data?.clouds?.all}%`;
}

//if we are on grant acces button, i.e., local coordinates not stored in session storage
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getlocation);

function getlocation(){//search geolocation api w3 schools
    if(navigator.geolocation){//geolocation support is availlable
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //hs show an alert for no geolocation support available
    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchInput =document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName==="") return;
    else 
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data)
    }
    catch(e){
        //hw
    }
}
//solve country icon flag problem