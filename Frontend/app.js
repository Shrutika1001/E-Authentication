const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const sign_up = document.querySelector("#sign-up");
const sign_in = document.querySelector("#sign-in");
const container = document.querySelector(".container");
const URL = "http://localhost:8000";

sign_in.addEventListener("click", () => {
  const email = document.querySelector('#lemail').value;
  const pass = document.querySelector('#lpass').value;

  if(email === '' || pass === '') {
    if(!(email+'').includes("@gmail.com")) {
      alert("Email entred is invalid");
    } else if((pass+'').length < 5) {
      alert("Password entred must have 5 characters or me");
    }
  } else {
    // fetch the api
    const data = {  
      "email": email,
      "password": pass
    }
    let options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(data)
    }
    fetch(URL+'/login', options).then(res => res).then(data => {
      data.json().then(a => {
        if(a.status === 200) {
          alert(a.msg);
          // Move to home page
        } else if(a.status === 500) {
          alert(a.msg)
          document.querySelector('#lpass').value = '';
        } else {
          alert(a.msg)
          container.classList.add("sign-up-mode");
        }
      });
    });
  }
});

sign_up.addEventListener("click", () => {
  const name = document.querySelector('#namebox').value;
  const email = document.querySelector('#emailbox').value;
  const pass = document.querySelector('#passbox').value;

  if(name === '' || email === '' || pass === '') {
    alert('Fill the Form first....');
    if(!(email+'').includes("@gmail.com")) {
      alert("Email entred is invalid");
    } else if((pass+'').length < 5) {
      alert("Password entred must have 5 characters or me");
    }
  } else {
    // fetch the api
    const data = { 
      "name": name, 
      "email": email,
      "password": pass
    }
    let options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(data)
    }
    fetch(URL+'/register', options).then(res => res).then(data => {
      data.json().then(a => {
        if(a.status === 200) {
          alert("Code Sent successfully to " + email);
          window.location.href = '/E--Authentication-project/Frontend/confirmation.html'
        } else if(a.status === 500) {
          alert(a.msg)
        }
      });
    });
  }
});


sign_in.addEventListener('click', () => {
  const email = document.querySelector('#emailBox').value;
  const password = document.querySelector('#passwordBox').value;

  if (email === '' || password === '') {
    alert('Please fill in both fields');
  } else {
    // fetch the API
    const data = { 
      "email": email,
      "password": password
    }
    const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }
    fetch('URL/login', options)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Logged in successfully!');
          // do something else after successful login
        } else {
          alert('Incorrect email or password. Please try again.');
        }
      })
      .catch(error => console.error(error));
  }
});
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");

});
sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
