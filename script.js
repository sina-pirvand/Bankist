"use strict";

//! Data
const account1 = {
  owner: "Ayda Asadi",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Babak Behtash",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Cin Cin",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Dara Davoudi",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//! Elements Selection
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//! DISPLAY MOVEMENTS
function displayMovements(movements) {
  //* empty inner html of the container before adding data
  containerMovements.innerHTML = "";

  //* add items
  movements.forEach((mov, i) => {
    //* check for deposit or withdrawal
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    }: ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>
    `;

    //* Add html to the container
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

//! COMPUTING USER NAMES
/*
 *the user name should be first letter of each full name and should be lower case.
 *Ex: Steven Thomas Williams => stw
 */

function createUsernames(accs) {
  //* this creates a username key for every account
  accs.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join(""))
  );
  console.log(accounts);
}
createUsernames(accounts);

//! FILTER DEPOSIT AND WITHDRAW
const movements = account1.movements;
const deposits = movements.filter((mov) => mov > 0);
const withdrawals = movements.filter((mov) => mov < 0);
console.log(deposits); //[200, 450, 3000, 70, 1300]
console.log(withdrawals); //[-400, -650, -130]

//! CALC ACCOUNT BALANCE
function calcBalance(movements) {
  const balance = movements.reduce((acc, el) => acc + el);
  labelBalance.textContent = `${balance}€`;
}

//! CALC ACCOUNT SUM
const calcAccSum = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  //* interest is set in acc data of each deposite and will only be paid if it's bigger than 1€
  //* ex: if you deposite 80€ and your rate is 1.2%, 1.2% * 80 = 0.96€ so it won't be paid
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//! EMPLEMENT USER LOGIN LOGIC
let currentAccount;

btnLogin.addEventListener("click", (e) => {
  // prevent form submit
  e.preventDefault();

  // set the account that username's matches as the current account
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // will throw error if we enter an unknown username (ex: ek,cxz,...) cuz currentAccount will be undefined
  // if (currentAccount.pin === Number(inputLoginPin.value)) {
  //   console.log("login success");
  // }

  // &&
  // if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
  //   console.log("login success");
  // }

  // ?.
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //* Display ui & welcome message
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 1;

    //* clear input fieldsvlaue and and lose focus after login
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //* Display movements
    displayMovements(currentAccount.movements);

    //* Display balance
    calcBalance(currentAccount.movements);

    //* Display Summary
    calcAccSum(currentAccount);
  }
});
