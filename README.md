# WhatsappInbox

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Change callback URL at 360dialog

curl --request POST  --url https://waba-v2.360dialog.io/v1/configs/webhook  --header 'Content-Type: application/json'  --header 'D360-Api-Key: NlCv8R4mnWaf2eHPqc28xGPhAK' --data '{"url": "https://eu2-api.eng.bloomreach.com/intg/webhook-handler/v1.0/136cabb7-0f5f-4e0a-86d8-2f3e3641565f/callback"}'


curl --request POST  --url https://waba-v2.360dialog.io/v1/configs/webhook  --header 'Content-Type: application/json'  --header 'D360-Api-Key: NlCv8R4mnWaf2eHPqc28xGPhAK' --data '{"url": "https://services.tochat.be/mvp/whatsapp/webhook"}'

