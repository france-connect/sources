# @fc/http-client

#### Usage

```
import * as HttpClient from '@fc/http-client';
// or import methods individually
// import { get, getCSRF, post } from '@fc/http-client';
```

#### HttpClienService.makeRequest Parameters

**URL/Endpoint**

- Relative leading slashed string to a single API entry point (eg: '/hello-world')
- If endpoint is an absolute URL, BaseURL will not be used.

**BaseURL**

- Absolute non-trailing slashed string pointing base API's url (eg: 'http://mock.com/hello-world')
- Accepts only http(s), ssh, ftp protocols
- Overrides: Request Options > Config > undefined > fallback to Request Endpoint

**HttpClientOptions**

- Excluding `url` & `method` & `data` from [AxiosRequestConfig](https://axios-http.com/docs/req_config)
