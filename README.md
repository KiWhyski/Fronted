# StockSip | Front-End Application

## Summary

StockSip is a specialized inventory management solution designed specifically for liquor store owners and suppliers. Key features include:

-  Detailed product care guidelines (storage, handling, and preservation).
-  Smart stock tracking for wines, spirits, and beers.
-  Built-in purchasing system (order directly to suppliers)

## Features

The application includes the following documentation:

- CRUD operations.
- Simulated API with json-server.
- In-app navigation routing.
- Internationalization (i18n) support.
- Domain-Driven Design (DDD) approach.
- Reusable components.

### Documentation

The documentation is available in the `docs` folder. It includes:

- User Stories are available in the [docs/user-stories.md](docs/user-stories.md) folder.
- PlantUML Class diagram are available in the [docs/class-diagram.puml](docs/class-diagram.puml) folder.
- C4 Model Software Architecture are available in the [docs/software-architecture](docs/software-architecture.dsl) folder.

## Frameworks and Libraries

This project was generated using [Vue Framework](https://vuejs.org/) and the following dependencies:

- Axios (https://axios-http.com/)
- PrimeVue (https://primevue.org/)
- Vue Router (https://router.vuejs.org/)
- json-server (https://github.com/typicode/json-server/tree/v0)
- Vue I18n (https://vue-i18n.intlify.dev/)
- Prime flex (https://primeflex.org/)
- Chart.js (https://www.chartjs.org/)

## Fake API start

Run the following commands to start the fake API server:

For windows:
```
 cd server
 cmd start.cmd
 start.cmd
```

For MacOS/Linux:
```
 cd server
 sh start.sh
```

The API endpoints should be access at `http://localhost:3000/api/v1`. The current API resource endpoints are:

- `http://localhost:3000/api/v1/warehouses`