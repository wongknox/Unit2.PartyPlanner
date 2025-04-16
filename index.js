const COHORT = "2502-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

const partiesList = document.querySelector("#parties");
const addPartyForm = document.querySelector("#newPartyForm");

addPartyForm.addEventListener("submit", addParty);

async function render() {
  await getParties();
  renderParties();
}
render();

async function getParties() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    state.parties = result.data;
  } catch (error) {
    console.error(error);
  }
}

async function addParty(event) {
  event.preventDefault();

  const name = addPartyForm.partyName.value;
  const dateTimeLocal = addPartyForm.partyDateTime.value;
  const location = addPartyForm.partyLocation.value;
  const description = addPartyForm.partyDescription.value;

  const date = `${dateTimeLocal}:00.000Z`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date, location, description }),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      console.error(errorResult);
      return;
    }

    const result = await response.json();
    console.log(result);

    await render();
    addPartyForm.reset();
  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  partiesList.innerHTML = "";

  state.parties.forEach((party) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <h3>${party.name}</h3>
      <p>Date: ${party.date}</p>
      <p>Time: ${party.date.substring(11, 16)}</p>
      <p>Location: ${party.location}</p>
      <p>Description: ${party.description}</p>
      <button class="delete-button" data-id="${party.id}">Delete</button>
    `;
    partiesList.appendChild(listItem);
  });

  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });
}

async function handleDelete(event) {
  const partyId = event.target.dataset.id;
  try {
    const response = await fetch(`${API_URL}/${partyId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      state.parties = state.parties.filter((party) => party.id !== partyId);
      render();
    } else {
      const result = await response.json();
      console.error(result);
    }
  } catch (error) {
    console.error(error);
  }
}
