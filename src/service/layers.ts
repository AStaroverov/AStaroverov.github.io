import { PIXEL_RATIO } from '../constants/layout';
import { scheduler } from '../scheduler/src';

export class Layers {
  private attached: boolean = false;
  private rootSize: { width: number; height: number } = { width: 0, height: 0 };
  protected $root: HTMLElement;
  public $canvas: HTMLCanvasElement;

  public handleEvent (e) {
    if (e.type === 'resize') {
      this.updateSize();
    }
  }

  public appendTo (root) {
    this.$root = root;

    this.detach();
    this.create();
    this.attach();
    this.setStyle();
    this.updateSize();

    window.addEventListener('resize', this);
    scheduler.addScheduler(this, 4);
  }

  public performUpdate (timeInFrame) {
    if (timeInFrame > 10) return;

    const size = this.getRootSize();

    if (this.rootSize.width !== size.width || this.rootSize.height !== size.height) {
      this.updateSize();
    }
  }

  public updateSize () {
    const { width, height } = this.rootSize = this.getRootSize();

    this.$overCanvas.width = width;
    this.$overCanvas.height = height;

    this.$belowCanvas.width = width;
    this.$belowCanvas.height = height;

    this.$canvas.width = width * PIXEL_RATIO;
    this.$canvas.height = height * PIXEL_RATIO;

    this.emit('update-size', this.rootSize);
  }

  public getRootSize (): { width: number, height: number } {
    return {
      width: this.$canvas.clientWidth,
      height: this.$canvas.clientHeight,
    };
  }

  private create () {
    this.$canvas = document.createElement('canvas');
    this.$overCanvas = document.createElement('canvas');
    this.$belowCanvas = document.createElement('canvas');
    this.$graphHtml = document.createElement('div');
    this.$toolsHtml = document.createElement('div');
    this.$wrapper = document.createElement('div');
  }

  private attach () {
    if (this.attached === true) return;

    this.$root.appendChild(this.$wrapper);
    this.$wrapper.appendChild(this.$belowCanvas);
    this.$wrapper.appendChild(this.$canvas);
    this.$wrapper.appendChild(this.$graphHtml);
    this.$wrapper.appendChild(this.$toolsHtml);
    this.$wrapper.appendChild(this.$overCanvas);

    this.attached = true;
  }

  private detach () {
    if (this.attached === false) return;

    this.$wrapper.removeChild(this.$belowCanvas);
    this.$wrapper.removeChild(this.$canvas);
    this.$wrapper.removeChild(this.$graphHtml);
    this.$wrapper.removeChild(this.$toolsHtml);
    this.$wrapper.removeChild(this.$overCanvas);
    this.$root.removeChild(this.$wrapper);

    this.attached = false;
  }

  public destroy () {
    this.detach();
    this.off();
    window.removeEventListener('resize', this);
    scheduler.removeScheduler(this, 4);
  }

  private setStyle () {
    this.$wrapper.style.position = 'relative';
    this.$wrapper.style.width = '100%';
    this.$wrapper.style.height = '100%';
    this.$wrapper.style.overflow = 'hidden';

    this.$belowCanvas.style.position = 'absolute';
    this.$belowCanvas.style.top = '0px';
    this.$belowCanvas.style.left = '0px';
    this.$belowCanvas.style.bottom = '0px';
    this.$belowCanvas.style.right = '0px';
    this.$belowCanvas.style.zIndex = '1';
    this.$belowCanvas.style.width = '100%';
    this.$belowCanvas.style.height = '100%';
    this.$belowCanvas.style.pointerEvents = 'none';

    this.$canvas.style.position = 'absolute';
    this.$canvas.style.top = '0px';
    this.$canvas.style.left = '0px';
    this.$canvas.style.bottom = '0px';
    this.$canvas.style.right = '0px';
    this.$canvas.style.zIndex = '2';
    this.$canvas.style.width = '100%';
    this.$canvas.style.height = '100%';

    this.$graphHtml.style.position = 'absolute';
    this.$graphHtml.style.top = '0px';
    this.$graphHtml.style.left = '0px';
    this.$graphHtml.style.bottom = '0px';
    this.$graphHtml.style.right = '0px';
    this.$graphHtml.style.zIndex = '3';
    this.$graphHtml.style.width = '0';
    this.$graphHtml.style.height = '0';
    this.$graphHtml.style.pointerEvents = 'none';

    this.$overCanvas.style.position = 'absolute';
    this.$overCanvas.style.top = '0px';
    this.$overCanvas.style.left = '0px';
    this.$overCanvas.style.bottom = '0px';
    this.$overCanvas.style.right = '0px';
    this.$overCanvas.style.zIndex = '4';
    this.$overCanvas.style.width = '100%';
    this.$overCanvas.style.height = '100%';
    this.$overCanvas.style.pointerEvents = 'none';

    this.$toolsHtml.style.position = 'absolute';
    this.$toolsHtml.style.top = '0px';
    this.$toolsHtml.style.left = '0px';
    this.$toolsHtml.style.bottom = '0px';
    this.$toolsHtml.style.right = '0px';
    this.$toolsHtml.style.zIndex = '5';
    this.$toolsHtml.style.width = '100%';
    this.$toolsHtml.style.height = '100%';
    this.$toolsHtml.style.overflow = 'hidden';
    this.$toolsHtml.style.pointerEvents = 'none';


    ['userSelect', 'msUserSelect', 'mozUserSelect', 'webkitUserSelect'].forEach(prop => {
      this.$graphHtml.style[prop] =
      this.$toolsHtml.style[prop] =
      this.$canvas.style[prop] =
      this.$overCanvas.style[prop] =
      this.$belowCanvas.style[prop] = 'none';
    });
  }
}

export const layers = new Layers();
