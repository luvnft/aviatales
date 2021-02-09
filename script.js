'use strict';

// Form Inputs
const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = document.querySelector('.input__cities-from'),
  dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
  inputCitiesTo = document.querySelector('.input__cities-to'),
  inputDateDepart = document.querySelector('.input__date-depart');

// Dropdowns
const city = [
  'Moscow',
  'Saint-Petersburg',
  'Samara',
  'Minsk',
  'Yekaterinburg',
  'Novosibirsk',
  'Kaliningrad',
  'Kazan',
  'Sochi',
  'Rostov-on-Don',
];

// Input events
inputCitiesFrom.addEventListener('input', () => {
  dropdownCitiesFrom.textContent = '';

  if (inputCitiesFrom.value !== '') {
    const filterCity = city.filter(item => {
      const fixItem = item.toLowerCase();
      return fixItem.includes(inputCitiesFrom.value.toLowerCase());
    });
    filterCity.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item;
      dropdownCitiesFrom.append(li);
      console.log(li);
    });
  }
});
