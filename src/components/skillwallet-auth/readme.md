# skillwallet-auth



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type      | Default     |
| ------------ | ------------- | ----------- | --------- | ----------- |
| `isLoading`  | `is-loading`  |             | `boolean` | `undefined` |
| `isPartner`  | --            |             | `Boolean` | `undefined` |
| `partnerKey` | `partner-key` |             | `string`  | `undefined` |


## Events

| Event               | Description | Type                   |
| ------------------- | ----------- | ---------------------- |
| `closeModalOnLogin` |             | `CustomEvent<any>`     |
| `isLoadingEvent`    |             | `CustomEvent<Boolean>` |
| `showLoginMenu`     |             | `CustomEvent<any>`     |
| `showNewScreen`     |             | `CustomEvent<any>`     |


## Dependencies

### Used by

 - [skillwallet-auth](.)

### Depends on

- [auth-image](.)

### Graph
```mermaid
graph TD;
  users-modal --> auth-image
  skillwallet-auth --> users-modal
  style users-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
