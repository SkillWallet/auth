![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# SkillWallet Auth

This is a custom HTML tag (Web Component) for your application to import a SkillWallet authorization flow for your users.

# Getting Started

## React:
In your project directory enter the following terminal command:
```bash
npm i @skill-wallet/auth
```

Copy this line into your index.js file's imports:
```bash
import { defineCustomElements } from "@skill-wallet/auth/loader";
```

Add this to the last line of your index.js:
```bash
defineCustomElements(window);
```

Add our custom HTML tag to any component you'd like...no imports! 
```bash
<skillwallet-auth partner-key="<your-key>"></skillwallet-auth>
```

## Next.JS:
Note that for a server-side rendered app, your custom element(s) cannot be defined until your browser window's been defined (after your app's been compiled and built):

In your project directory enter the following terminal command:
```bash
npm i @skill-wallet/auth
```

Copy this line into your index.js file (or wherever you're going to use our HTML tag) imports -- note that you cannot import & define custom elements in _app or _document files:
```bash
import { defineCustomElements } from "@skill-wallet/auth/loader";
```

In the same file, add this line inside a componentDidMount() or useEffect() hook - to wait and render our element AFTER creating the DOM:
```bash
defineCustomElements(window);
```

Add our custom HTML tag to any component you'd like...no imports!
```bash
<skillwallet-auth partner-key="<your-key>"></skillwallet-auth>
```

## Angular

## Vue.js


Need help? Join our team Discord [here](https://discord.com/invite/WR7PbswvTr).