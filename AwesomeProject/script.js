let inputSlider=document.getElementById("inputSlider");
let sliderValue=document.getElementById("sliderValue");

sliderValue.textContent=inputSlider.value;

inputSlider.addEventListener('input',()=>{
    sliderValue.textContent=inputSlider.value;
})


