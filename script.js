const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
  inputCitiesTo = formSearch.querySelector('.input__cities-to'),
  dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
  dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
  inputDateDepart = formSearch.querySelector('.input__date-depart'),
  buttonSearch = formSearch.querySelector('.button__search');

let cities = [];

const citiesAPI = './database/cities.json';
const API_KEY = '407ff446faae19091d7227e3be1bd57a';
const calendar = 'http://api.travelpayouts.com/v1/prices/cheap';
const calendarFull = `http://api.travelpayouts.com/v1/prices/cheap?origin=MOW&destination=HKT&depart_date=2022-11&return_date=2022-12&token=407ff446faae19091d7227e3be1bd57a`;

const proxy = 'https://cors-anywhere.herokuapp.com/';

/* Getting cities data */

const getData = async function (url) {
  try {
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        const filteredCities = data.filter(item => item.name);
        cities = filteredCities;
      });
  } catch (error) {
    alert(`Произошла ошибка! Подробнее: ${error}`);
  }
};

const getCheapTickets = async function (url) {
  console.log(url);
  try {
    await fetch(url)
      .then(response => response.json())
      .then(data => console.log(data));
  } catch (error) {
    alert(`Произошла ошибка! Подробнее: ${error}`);
  }
};
getData(citiesAPI);
getCheapTickets(
  proxy +
    calendar +
    '?origin=MOW&destination=HKT&depart_date=2022-11&return_date=2022-12&token=' +
    API_KEY
);

/* Dropdown handling */

const showDropdown = (input, list) => {
  list.textContent = '';
  if (!input.value) return;

  const filteredCities = cities.filter(city => {
    return city.name.toLowerCase().includes(input.value.toLowerCase());
  });

  filteredCities.map(item => {
    const li = document.createElement('li');
    li.classList.add('dropdown__city');
    li.textContent = item.name;
    list.append(li);
  });
};

const chooseCity = (event, input, list) => {
  const target = event.target;

  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    list.textContent = '';
  }
};

inputCitiesFrom.addEventListener('input', () => {
  showDropdown(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
  showDropdown(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', event => {
  chooseCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', event => {
  chooseCity(event, inputCitiesTo, dropdownCitiesTo);
});
