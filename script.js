const imgSlider = document.querySelector('.img-slider');
const items = document.querySelectorAll('.item');
const imgItems = document.querySelectorAll('.img-item');
const infoItems = document.querySelectorAll('.info-item');

let colors = ['#f5f5f7', '#fafafa', '#f0f2f5', '#f7f7f9', '#f6f5f0', '#eef1f6']
let indexSlider = 0;
let index = 0;

const slider = () => {
    imgSlider.style.transform = `rotate(${indexSlider * 60}deg)`;

    items.forEach(item => {
        item.style.transform = `rotate(${indexSlider * -60}deg)`;
    });

    document.querySelector('.img-item.active').classList.remove('active');
    imgItems[index].classList.add('active');

    document.querySelector('.info-item.active').classList.remove('active');
    infoItems[index].classList.add('active');

    document.body.style.background = colors[index]
}

// Auto-play the slideshow every 8.5 seconds with smooth transitions
setInterval(() => {
    indexSlider++;
    index++;
    if(index > imgItems.length - 1)
    {
        index = 0;
    }
    slider();
}, 8500);