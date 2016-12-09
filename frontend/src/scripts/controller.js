/**
 * Classifier Sift Sift. Frontend controller entry point.
 */
import { SiftController, registerSiftController } from '@redsift/sift-sdk-web';

export default class MyController extends SiftController {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();
    this._suHandler = this.onStorageUpdate.bind(this);
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftcontroller
  loadView(state) {
    console.log('classifier-sift: loadView', state);
    // Register for storage update events on the "count" bucket so we can update the UI
    this.storage.subscribe(['count'], this._suHandler);
    switch (state.type) {
      case 'email-thread':
        let w = 0;
        try {
          w = state.params.detail.words;
        }catch(e){ }
        return { html: 'email-thread.html', data: { words: w } };
      case 'summary':
        return { html: 'summary.html', data: this.getCounts() };
      default:
        console.error('classifier-sift: unknown Sift type: ', state.type);
    }
  }

  // Event: storage update
  onStorageUpdate(value) {
    console.log('classifier-sift: onStorageUpdate: ', value);
    return this.getCounts().then((counts) => {
      // Publish 'counts' event to view
      this.publish('counts', counts);
    });
  }

  getCounts() {
    return this.storage.get({
      bucket: 'count',
      keys: ['MESSAGES', 'WORDS']
    }).then((values) => {
      return {
        messages: values[0].value || 0,
        words: values[1].value || 0,
        wpm: ((values[1].value || 0) / (values[0].value || 1)).toFixed(2)
      };
    });
  }
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerSiftController(new MyController());
