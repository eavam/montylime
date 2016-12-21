import './style.sss';
import './photoSwiperInit.js';


window.onload = () => {
  slideTitle();
  // window.addEventListener('wheel', activeMenu);

  crossAddEventWheel();

  const pagination = document.querySelector('.pagination');

  for( let i = 0; i < pagination.children.length; i++ ){
    let ChildrenElement = pagination.children[i];
    ChildrenElement.addEventListener('click', dotClick);

  }

  document.querySelector('.color-lemon').addEventListener('click', addNewColor);
};


window.onsubmit = (e) => {

  e.preventDefault();

  var formData = new FormData(e.target);

  fetch('message.php', {
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if(data.good) e.target.innerHTML = `<span class="success-message">${data.good}</span>`;
  });
};

function slideTitle() {

  var words = document.querySelectorAll('.main__word');
      words = [...words];
  var wordsSize = words.length;
  var indexNow = 0;
  var dir = 1;
  var nowSlide = 0;

  setInterval(() => {

    if(indexNow === 0) dir *= -1;

    if(dir === -1){
      nowSlide = nowSlide - 100;
    } else {
      nowSlide = nowSlide + 100;
    }

    words.map(el => { el.style.transform = `translateY(${nowSlide}%)`; });

    indexNow += dir === -1 ? 1 : -1;

    if( Math.abs(nowSlide / 100) >=  wordsSize - 1) dir *= -1;

  }, 1500);
}

function getRandomColor() {
  return '#'+((1<<24)*Math.random()|0).toString(16);
}

function addNewColor() {
  var wrapper = document.querySelector('.form');
  var oldDiv = document.querySelector('.form__bg');
  var newDiv = document.createElement('div');
  var newColor = getRandomColor();
  newDiv.style.backgroundColor = newColor;
  newDiv.classList.add('form__bg_s');

  wrapper.appendChild(newDiv);

  setTimeout(() => { newDiv.style.transform = 'scale(5)'; }, 100);

  setTimeout(() => {
    oldDiv.style.backgroundColor = newColor;
    newDiv.remove();
  }, 1600);

}

function activeMenu(e) {

  const active = document.querySelector('.active') ? document.querySelector('.active') : document.querySelector('.place');
  const dir = wheel(e);

  console.log(dir);

  if(dir == 'Down' && active.nextElementSibling) upSection(active);
  if(dir == 'Up' && active.previousElementSibling) downSection(active);


}

function upSection(activeElement) {
  crossRemoveEventWheel();
  activeElement.classList.add('old');
  dotSlide('Up');
  setTimeout(function(){
    activeElement.classList.remove('active');
    activeElement.nextElementSibling.classList.add('active');
    crossAddEventWheel();
  }, 700);
}

function downSection(activeElement) {
  crossRemoveEventWheel();
  activeElement.previousElementSibling.classList.contains('old') ? activeElement.previousElementSibling.classList.remove('old') : '';
  activeElement.classList.contains('old') ? activeElement.classList.remove('old') : '';
  dotSlide('Down');
  setTimeout(function(){
    activeElement.classList.remove('active');
    activeElement.previousElementSibling.classList.add('active');
    crossAddEventWheel();
  }, 700);
}

function dotSlide(dir) {

  const dotActive = document.querySelector('.pagination__dot_active');

  if( dir === 'Down' && dotActive.previousElementSibling ) {
    dotActive.previousElementSibling.classList.add('pagination__dot_active');
    dotActive.classList.remove('pagination__dot_active');
  }

  if( dir === 'Up' && dotActive.nextElementSibling ) {
    dotActive.nextElementSibling.classList.add('pagination__dot_active');
    dotActive.classList.remove('pagination__dot_active');
  }

}

function dotClick(e) {
  const el = e.target;
  const dotActive = document.querySelector('.pagination__dot_active');
  const parent = document.querySelector('.pagination');
  let newActiveIndex;

  dotActive.classList.remove('pagination__dot_active');
  el.classList.add('pagination__dot_active');

  for(let i = 0; i < parent.children.length; i++) {
    let child = parent.children[i];

    if( child.classList.contains('pagination__dot_active') ) {
      newActiveIndex = i;
    }
  }

  const main = document.querySelector('main');
  // const sections = document.querySelectorAll('.place');
  let activeFinding = false;

  setTimeout(() => document.querySelector('.active').classList.remove('active'), 700);

  for(let i = 0; i < main.children.length; i++ ) {
    if( activeFinding ) {
      main.children[i].classList.remove('old');
    } else {

      if( i === newActiveIndex ) {
          main.children[i].classList.remove('old');
          setTimeout(() => main.children[i].classList.add('active'), 700);
          activeFinding = true;
      } else {
          main.children[i].classList.add('old');
      }

    }
  }

}

function wheel(event){
    let delta = 0,
        dir;
    // if (!event) event = window.event; // Событие IE.
    // // Установим кроссбраузерную delta
    // if (event.wheelDelta) {
    //     // IE, Opera, safari, chrome - кратность дельта равна 120
    //     delta = event.wheelDelta/120;
    // } else if (event.detail) {
    //     // Mozilla, кратность дельта равна 3
    //     delta = -event.detail/3;
    // }
    // if (delta) {
    //     // Отменим текущее событие - событие поумолчанию (скролинг окна).
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.returnValue = false; // для IE
        event = event || window.event;
        delta = event.deltaY || event.detail || event.wheelDelta;
        // если дельта больше 0, то колесо крутят вверх, иначе вниз
        dir = delta < 0 ? 'Up' : 'Down';
    // }
  return dir;
}

function crossAddEventWheel() {
  if (window.addEventListener) {
    if ('onwheel' in document) {
      // IE9+, FF17+, Ch31+
      window.addEventListener('wheel', activeMenu);
    } else if ('onmousewheel' in document) {
      // устаревший вариант события
      window.addEventListener('mousewheel', activeMenu);
    } else {
      // Firefox < 17
      window.addEventListener('MozMousePixelScroll', activeMenu);
    }
  } else { // IE8-
    window.attachEvent('onmousewheel', activeMenu);
  }
}

function crossRemoveEventWheel() {
  if (window.removeEventListener) {
    if ('onwheel' in document) {
      // IE9+, FF17+, Ch31+
      window.removeEventListener('wheel', activeMenu);
    } else if ('onmousewheel' in document) {
      // устаревший вариант события
      window.removeEventListener('mousewheel', activeMenu);
    } else {
      // Firefox < 17
      window.removeEventListener('MozMousePixelScroll', activeMenu);
    }
  } else { // IE8-
    window.attachEvent('onmousewheel', activeMenu);
  }
}
