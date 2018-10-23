# WebService-Consumer-JS

Basic utility written in Javascript that helps in consuming web service end points. 

Usage
---
```javascript
//set path to 'webservice' directory or the directory that has files inside 'webservice' directory
//import the 'request' function
import { request } from './../services/webservice';
```
The `request` function accepts two parameters.
1. first is the 'key' path seperated by '-', starting from parent to child. For example, if we have endpoint config object as 

```javascript
export default {
  user: {
    getProfileImage: {
      endPoint: '/profileImage',
      method: 'GET', // GET,POST, PUT, DELETE or anything that's a valid method
      isEnabled: true //if false, it will throw an error...
    },
    setPassword: {
      endPoint: '/password',
      method: 'PUT',
      isEnabled: false
    }
  },
};
```
and we want to send a request to the end point described by ```setPassword```, we pass the string ```user-setPassword``` as the first argument. This is a fairly simple config object but there is absolutely no limitation on the level of nesting of the configurations. So we can have the configurations nested deeper.

```javascript
user:  {
  accountActions: {
    setPassword: {
      endPoint: '/password',
      method: 'PUT',
      isEnabled: false
    }
  },
  profileActions: {
    ...
  }
},
```
In the above case, we will have to pass ```user-accountActions-setPassword``` as the first argument.

2. The second argument is the data that we require to build and send a request to the web service and is optional. This takes an object that expects a set of defined key-value pairs (_mentioned in the table below_) to exist and generates the request accordingly.

key | description | type of value
--- | --- | ---
options | the object must have keys matching the template URI components that are to be replaced by values in the request URI. if we want `/:username` to be replaced by a dynamic value, pass an object having `username` as a key and the value that the template must be replaced by | `Object`
query | whatever key-value pairs exist inside this object, will be added as a query string to our request | `Object`
headers | pass the required key-value pairs that need to be added to the request | `Object`
body | pass JS object that has body data which needs to be sent over | `Object`


```javascript
    request('user-profile', {
      options: {
        username: 'testUser123'
      },
      query: {
        this: 'will',
        be: 'added',
        as: 'queryParams'
      },
      headers: {
        metaDescription: 'this is a test request!'
      },
      body: {
        payload: 'I'll be attached to the request!'
      }
    })
      .then(obj => {
      //because everything went well... proceed!
      })
      .catch(error => {
       //oh-no! something went wrong, lets console.log(error)
      });
```

Config Description
---
Following is a dummy apiConfig. Paste the contents and make changes as required!

```javascript
const serviceConstants = {
  baseURL: {
    dev: 'dev.test.com/api/',
    prod: 'prod.test.com/api/'
  },
  serviceKeys: {
    dev: '',
    prod: ''
  },
  isProdEnabled: false, //true: if we need to enable the production env requests
  timeOut: 30000, //default time out for all the request, can be individually overriden for every config as well
  commonHeaders: {
    accept: 'application/json' //add all the common headers here that need to be a part of all the requests that we make
  }
};

user:  {
  accountActions: {
    setPassword: {
      endPoint: '/password',
      method: 'PUT',
      isEnabled: false
    }
  },
  profileActions: {
    ...
  }
},

export { serviceConstants };

```

ToDo:
---
[ ] Add global logging
[ ] Add mechanism to include service keys with the request
[ ] A safer way to set `isProdEnabled` 
[ ] Flexible placement of apiConfig
[ ] Document code
