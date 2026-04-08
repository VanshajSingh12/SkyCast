const API_KEY="c6fead0b675fb335b682a708a403c16c";

async function showWeather(){
    try{
        let city="varanasi";

        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);

        const data= await response.json();//converting to json format
        console.log("Weather data ->", data);

        renderWeatherInfo(data); 
    }
    catch(e){
        console.log("error occured", e);
    }
}
function renderWeatherInfo(data){//showing in UI   
    let newPara=document.createElement('p');
    newPara.textContent=`${data?.main?.temp.toFixed(2)} ℃`;

    document.body.appendChild(newPara); 
}
// fetching using latitude and longitude and not city-
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}