export interface User {
  "_id": string,
  "email": string,
  "name": {
    "familyName": string,
    "givenName": string,
    "displayName": string,
    "displayNameLastFirst": string
  },
  "exp": number,
  "iat": number
}
