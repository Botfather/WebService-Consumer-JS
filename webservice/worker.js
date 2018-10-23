import { NetInfo } from 'react-native';

const webServiceWatcher = (function() {
  const memoryEl = {};
  memoryEl.isServiceAvailable = true;
  memoryEl.networkType = '';
  NetInfo.addEventListener('connectionChange', networkType => {
    memoryEl.isServiceAvailable = networkType !== 'none';
    memoryEl.networkType = networkType;
    console.table(memoryEl); //temp
  });
  return memoryEl;
})();

const requestBuilder = (header, method = 'GET', body) => {
  var options = {};
  options['method'] = method.toUpperCase();

  if (method !== 'GET') {
    options['body'] = JSON.stringify(body);
  }
  options['headers'] = header;

  return options;
};

const handleTimeOut = (timeOut, promise) => {
  return new Promise(function(resolve, reject) {
    if (!webServiceWatcher.isServiceAvailable) {
      reject({ name: '503', message: 'No Internet connection' });
    } else {
      setTimeout(() => {
        //this gets called even if the request thing has been successful.. but since the success would have been already,
        //context of the requesting object will go out of scope... :)
        reject({ name: '503', message: 'Request timed out' });
      }, timeOut);
      promise.then(resolve, reject);
    }
  });
};

const processResponse = (response, isError) => {
  return new Promise(function(resolve, reject) {
    if (!isError) {
      const resp = response.json();
      if (!response.ok) {
        return reject({
          name: response.status,
          message: 'HTTP Request Failed',
          value: resp
        });
      } else {
        resolve(resp);
      }
    } else {
      reject(response);
    }
  });
};

const send = (URI, header, method, body, timeOut) => {
  const request = requestBuilder(header, method, body);
  describeRequest(request, URI);

  return handleTimeOut(timeOut, fetch(URI, request))
    .then(response => {
      return processResponse(response, false);
    })
    .catch(error => {
      return processResponse(error, true);
    });
};

export default send;

//this is temporary
const describeRequest = (requestObject, resourceName) => {
  console.group('WEBSERVICE: REQUEST');
  console.log('URI: ' + resourceName);
  console.log('METHOD: ' + requestObject.method);

  console.groupCollapsed('HEADERS');
  console.log(requestObject.headers);
  console.groupEnd();

  if (requestObject.body) {
    console.group('BODY');
    console.log(requestObject.body);
    console.groupEnd();
  }

  console.groupEnd();
};
