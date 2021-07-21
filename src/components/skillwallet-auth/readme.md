# skillwallet-auth



<!-- Auto Generated Below -->


## Events

| Event         | Description | Type                   |
| ------------- | ----------- | ---------------------- |
| `showNewUser` |             | `CustomEvent<Boolean>` |


## Dependencies

### Used by

 - [skillwallet-auth](.)

### Depends on

- [auth-image](.)
- [qr-modal](.)
- [new-user](.)
- [user-details](.)
- [user-role](.)

### Graph
```mermaid
graph TD;
  users-modal --> auth-image
  users-modal --> qr-modal
  users-modal --> new-user
  users-modal --> user-details
  users-modal --> user-role
  qr-modal --> qr-code
  new-user --> auth-image
  skillwallet-auth --> users-modal
  style users-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
