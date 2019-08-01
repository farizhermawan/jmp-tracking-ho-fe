export default class CallbackComponent {
    constructor() { }
    static Factory() {
        return {
            controller: CallbackComponent,
            templateUrl: 'views/components/callback.html'
        };
    }
}