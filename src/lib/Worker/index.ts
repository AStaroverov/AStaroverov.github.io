import EventEmitter from 'eventemitter3';

export class PseudoWorker extends EventEmitter {
  onmessage: any;
  onerror: any;

  self: EventEmitter & {
    onmessage: any
    onerror: any
    terminate: any
    postMessage: any
    addEventListener: any

    location: any
    requestAnimationFrame: any
    cancelAnimationFrame: any
  };

  constructor (scriptFile: string) {
    super();

    let timer: number | null = null;

    this.self = new EventEmitter() as PseudoWorker['self'];
    this.self.location = globalThis.location;
    this.self.requestAnimationFrame = globalThis.requestAnimationFrame;
    this.self.cancelAnimationFrame = globalThis.cancelAnimationFrame;
    this.self.onmessage = null;
    this.self.onerror = null;

    // Method that starts the threading
    this.self.postMessage = function (data: any) {
      timer = globalThis.setTimeout(() => {
        this.emit('message', { data });
      });

      return true;
    };

    // Parent can call this method instead of assigning methods directly
    this.self.addEventListener = function (type, callback) {
      this.on(type, callback);
    };

    this.self.terminate = function () {
      if (typeof timer === 'number') {
        clearTimeout(timer);
        timer = null;
      }

      return true;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const importScripts = function importScripts (): void{
      // Turn arguments from pseudo-array in to array in order to iterate it
      const params = Array.prototype.slice.call(arguments);

      for (let i = 0, j = params.length; i < j; i++) {
        const script = document.createElement('script');
        script.src = params[i];
        script.setAttribute('type', 'text/javascript');
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    };

    const http = new XMLHttpRequest();
    http.open('GET', scriptFile, false);
    http.send(null);

    if (http.readyState === 4) {
      const strResponse = http.responseText;

      if (http.status !== 404 && http.status !== 500) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        globalThis.__workerContext__ = this.self;
        // eslint-disable-next-line no-eval
        eval(strResponse);
      }
    }
  }

  public postMessage (data: any): void {
    this.self.emit('message', { data });
  }

  public addEventListener (type: string, callback): void {
    this.self.on(type, callback);
  }

  public removeEventListener (type: string, callback?): void {
    this.self.off(type, callback);
  }
}
