# Postman Collection for Partners Website

## Introduction

The Partners website endpoints can be tested using a Postman collection.

This collection lists the requests made by the front and implements the logic before and after the execution (cookie setup, CSRF token retrieval).

It addresses two main objectives:
- it explains the usage of the Partners API
- it enables the development and testing of the Partners API in parallel with the development of the Partners front application

## Postman Setup

### Postman Installation

The installation of Postman is straightforward on Linux.
```
snap install postman
```

### Postman Collection and Environment setup

1. Import all the Postman Files from `/quality/partners/postman`
   
   (in File > Import > Files tab)
2. Select `Partners-FCP` or `Partners-FCA` in the environment dropdown list
   
   (top left of the screen)
3. Click on the Collections tab in the left menu
4. Expand the `Espace-Partenaires` collection
5. Check whether all the endpoints are listed
6. Disable SSL certificate verification in the Settings
   (in File > Settings > General tab)

## Test Partners API with Postman

The endpoints are sorted by chronological order in a typical usage of the partners website usage.

At the top, the endpoint `csrf` and `login` endpoints clear the cookies and change the current user.

A 403 error would be sent,
- if the current user doesn't have the required permissions or 
- if the session has expired.

The `me` endpoint can be used to check whether the user is still logged in.

## Links

- [Postman documentation](https://learning.postman.com/docs/getting-started/introduction/)
