const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
  inputCitiesTo = formSearch.querySelector('.input__cities-to'),
  dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
  dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
  inputDateDepart = formSearch.querySelector('.input__date-depart'),
  inputDateReturn = formSearch.querySelector('.input__date-return'),
  buttonSearch = formSearch.querySelector('.button__search'),
  cheapestTicket = document.getElementById('cheapest-ticket'),
  otherCheapTickets = document.getElementById('other-cheap-tickets');
let cities = [];

const citiesAPI = '/api/data/en/cities.json';

//const calendar = 'http://api.travelpayouts.com/v1/prices/cheap';
const calendar = '/api/aviasales/v3/prices_for_dates';
/* const calendarFull = `http://api.travelpayouts.com/v1/prices/cheap?origin=MOW&destination=HKT&depart_date=2023-03&return_date=2023-04&token=${API_KEY}`; */

//const proxy = 'https://flights.w3w.travel';
const API_KEY = 'c527e8ecab5a458674466a96af27c420';

const formatCityName = iataCode => {
  const cityObj = cities.find(item => item.code === iataCode);
  return cityObj.name;
};

const formatDate = date => {
  return new Date(date).toLocaleString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getChanges = num => {
  console.log(num);
  if (num === 0) {
    return 'Non-stop';
  } else {
    return num === 1 ? 'One stop' : 'Two stops';
  }
};

const getLinkAviasales = data => {
  let link = `https://www.aviasales.com${data.link}`;
  console.log(link);
  return link;
};

const createCard = obj => {
  const ticket = document.createElement('div');
  ticket.classList.add('ticket');

  let html = '';

  if (obj) {
    html = `
  <div class="ticket__wrapper">
    <div class="left-side">
      <a href="${getLinkAviasales(obj)}" class="button button__buy">Buy for
        ${obj.price}₽</a>
    </div>
    <div class="right-side">
      <div class="block-left">
        <div class="city__from">Departure from
          <span class="city__name">${formatCityName(obj.origin)}</span>
        </div>
        <div class="date">${formatDate(obj.departure_at)}</div>
      </div>
  
      <div class="block-right">
        <div class="changes">${getChanges(obj.transfers)}</div>
        <div class="city__to">Destination city:
          <span class="city__name">${formatCityName(obj.destination)}</span>
        </div>
      </div>
    </div>
  </div>`;
  } else {
    html = '<h3>No tickets found for the selected date</h3>';
  }

  ticket.insertAdjacentHTML('beforeend', html);

  return ticket;
};

const renderCheapest = cheapTicket => {
  cheapestTicket.style.display = 'block';
  cheapestTicket.innerHTML = '<h3>Cheapest ticket for the selected dates</h3>';
  const ticket = createCard(cheapTicket);
  cheapestTicket.append(ticket);
};

const renderCheapArr = cheapTickets => {
  otherCheapTickets.style.display = 'block';
  otherCheapTickets.innerHTML =
    '<h3>Other cheap tickets for the selected dates</h3>';
  console.log(cheapTickets);
};

const renderCheap = data => {
  console.log(data);
  console.log(data[0]);

  const ticketsArr = data;
  const ticket = data[0];

  renderCheapest(ticket);
  renderCheapArr(ticketsArr);
};

/* Getting cities data */

const getData = async function (url) {
  try {
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const filteredCities = data.filter(item => item.name);
        cities = filteredCities.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
        console.log(cities);
      });
  } catch (error) {
    console.error(error);
    alert(`Error while fetching city data! Details: ${error}`);
  }
};

const getCheapTickets = async function (url) {
  console.log(url);
  try {
    const { data } = await fetch(url).then(response => response.json());
    console.log(data);
    renderCheap(data);
  } catch (error) {
    console.error(error);
    alert(`Error fetching tickets! Details: ${error}`);
  }
};

//getData(proxy + citiesAPI);
getData(citiesAPI);

/* Dropdown handlers */

const showDropdown = (input, list) => {
  list.textContent = '';
  if (!input.value) return;

  const filteredCities = cities.filter(city => {
    return city.name.toLowerCase().startsWith(input.value.toLowerCase());
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

// Form events handlers

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

formSearch.addEventListener('submit', event => {
  event.preventDefault();

  const from = cities.find(item => item.name === inputCitiesFrom.value);

  const to = cities.find(item => item.name === inputCitiesTo.value);

  const formInfo = {
    from,
    to,
    when: inputDateDepart.value,
    back: inputDateReturn.value,
  };

  if (formInfo.from && formInfo.to) {
    const requestData = `?origin=${formInfo.from.code}&destination=${formInfo.to.code}&departure_at=${formInfo.when}&return_at=${formInfo.back}&sorting=price&token=${API_KEY}`;

    console.log(requestData);
    //getCheapTickets(proxy + calendar + requestData);
    getCheapTickets(calendar + requestData);
    //getCheapTickets(proxy + newCalendar + newRequestData);
  } else {
    alert('Please enter a valid city name!');
  }
});
