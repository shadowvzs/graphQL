# graphQL
GraphQL, Express, ReactJS basic project for fun


* Frontend: 
  * ReactJS
      * React Router v4
      * React Context
      * React Chart JS 2
      
* Backend: 
  * Express 
      * Mongoose ( for mongoDB )
      * GraphQL (inc. dataloader)
      * JWT (for auth)
      * other: bcrypt, body-parser
 
 ----------------------------------
      
#### Features *(with graphQL)*:
- auth user (login/registration/authed resolvers) with jwt/bcrypt
- modal/spinner on frontend
- create/cancel event
- book event/cancel book event

---------------------------------

## About GraphQL

#### Client side:

* **Note:**
  * method must be ***POST***
  * endpoint allways same ex. ***http://172.18.0.3:8000/graphql***
  * data is object with ***query***, ***variables*** keys
      * **query**: string wich describe what we send and what data we need from server (check backend ***schema***) 
          * in query string we have  type of query:
              * ***query***: *GET* like request where we need data from server
              * ***mutation***: *POST/PUT/DELETE* like requests when we want change something in database
              * ***subscription***: webocket like communication
      * **variables**: the point where we insert variables, if in query we used ***$email*** then we must ***email*** key in variables
  
  * **Example:**
    
>        let requestBody = {
>            query: `
>              query loginUser($email: String!, $password: String!) {
>                  login(email: $email, password: $password) {
>                      userId
>                      token
>                      tokenExpiration
>                  }
>            }`,
>            variables: {
>              email: email,
>              password: password
>            }
>        };
>
>        const headers = { 'Content-Type': 'application/json' };
>        fetch("http://172.18.0.3:8000/graphql", { 
>               method: 'POST', 
>               body: JSON.stringify(requestBody), 
>               headers 
>        });
