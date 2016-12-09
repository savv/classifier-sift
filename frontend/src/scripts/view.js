/**
 * Classifier Sift Sift. Frontend view entry point.
 */
import { SiftView, registerSiftView } from '@redsift/sift-sdk-web';

export default class MyView extends SiftView {
  constructor() {
    // You have to call the super() method to initialize the base class.
    super();

    // Listens for 'count' events from the Controller
    this.controller.subscribe('counts', this.onCounts.bind(this));
  }

  // for more info: http://docs.redsift.com/docs/client-code-siftview
  presentView(value) {
    console.log('classifier-sift: presentView: ', value);
    this.onCounts(value.data);
  };

  willPresentView(value) {
    console.log('classifier-sift: willPresentView: ', value);
  };

  onCounts(data) {
    console.log('classifier-sift: onCounts: ', data);
    Object.keys(data).forEach((k) => {
      document.getElementById(k).textContent = data[k];
    });
  }
}

registerSiftView(new MyView(window));
