/**
 * Classifier Sift Sift. Email client controller entry point.
 */
import { EmailClientController, registerEmailClientController } from '@redsift/sift-sdk-web';

export default class MyEmailClientController extends EmailClientController {
  constructor() {
    super();
  }

  // for more info: http://docs.redsift.com/docs/client-code-redsiftclient
  // TODO: update to latest
  loadThreadListView (listInfo) {
    console.log('classifier-sift: loadThreadListView: ', listInfo);
    if (listInfo) {
      return {
        template: '001_list_common_txt',
        value: {
          color: '#ffffff',
          backgroundColor: '#e11010',
          subtitle: listInfo.words + ' words'
        }
      };
    }
  };
}

// Do not remove. The Sift is responsible for registering its views and controllers
registerEmailClientController(new MyEmailClientController());
