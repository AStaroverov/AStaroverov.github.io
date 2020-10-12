import { BaseComponent, PRIVATE_CONTEXT } from '../../BaseComponent';
import { CameraService } from './serviece';
import { isMetaKeyEvent } from '../../utils';
import { withdDrag } from '../../mixins/withdDrag';
import { scheduler, Task } from '../../lib/scheduler';
import { TRect } from '../../types';
import { CanvasEvent } from '../../worker/events/consts';

export enum MANIPULATION_TYPE {
  TOUCH = 'touch',
  MOUSE = 'mouse',
}

export class CameraComponent<Context extends object = object> extends withdDrag(BaseComponent)<Context> {
  public usableRect: TRect;
  public camera: CameraService;

  public manipulationType: MANIPULATION_TYPE = MANIPULATION_TYPE.MOUSE;

  private root: BaseComponent;

  private _cameraMoveStarted: boolean = false;
  private _cameraMoveCurrentData: number[] = [0, 0];
  private _cameraMoveStartData: number[] = [0, 0];
  private _cameraUpdateTask: Task;

  constructor ({ usableRect, manipulationType }: { usableRect?: TRect, manipulationType?: MANIPULATION_TYPE } = {}) {
    super();

    this.usableRect = usableRect || this.usableRect;
    this.manipulationType = manipulationType || this.manipulationType;
    this.camera = new CameraService({
      ...usableRect,
      scale: 0.5,
      scaleRatio: 2,
      scaleMin: 0.1,
      scaleMax: 2
    });
    this.camera.on('updated', this.onCameraUpdate);
  }

  private onCameraUpdate = (): void => {
    this.performRender();
  };

  private _lastDragEvent: MouseEvent | undefined = undefined;

  protected connected (): void {
    super.connected();

    this.root = this[PRIVATE_CONTEXT].root;
    this.root.addEventListener('click', this);
    this.root.addEventListener('mousedown', this);
    this.root.addEventListener('wheel', this);
    this.root.addEventListener('keydown', this);
    this.root.addEventListener('keyup', this);
  }

  protected disconnected (): void{
    super.disconnected();

    this.root.removeEventListener('click', this);
    this.root.removeEventListener('mousedown', this);
    this.root.removeEventListener('wheel', this);
    this.root.removeEventListener('keydown', this);
    this.root.removeEventListener('keyup', this);

    // @ts-expect-error-next
    this.root = undefined;
  }

  public handleEvent (e): void {
    if (e.button === 1 && e.type === 'mousedown') {
      return this._moveStartRelativePoint(e);
    }

    if (this.manipulationType === MANIPULATION_TYPE.MOUSE) {
      switch (e.type) {
        case 'wheel': return isMetaKeyEvent(e)
          ? this._move(e)
          : this._zoom(e);
        case 'mousedown': {
          this._onDragStart(e);
          this.listenDrag({
            onDragMove: (e) => this._onDragUpdate(e),
            onDragEnd: (e) => this._onDragEnd(e)
          });

          return;
        }
      }
    }

    if (this.manipulationType === MANIPULATION_TYPE.TOUCH) {
      switch (e.type) {
        case 'wheel': {
          // pinch-to-zoom works because e.ctrlKey is true during pinch.
          return isMetaKeyEvent(e)
            ? this._zoom(e)
            : this._move(e);
        }
        case 'mousedown': {
          this._onDragStart(e);
          this.listenDrag({
            onDragMove: (e) => this._onDragUpdate(e),
            onDragEnd: (e) => this._onDragEnd(e)
          });
        }
      }
    }
  }

  private _move (event): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === 'wheel') {
      this.camera.move(-event.deltaX, -event.deltaY);
    }

    if (event.type.indexOf('mouse') > -1) {
      this.camera.move(event.movementX, event.movementY);
    }
  }

  private _zoom (e): void {
    // To prevent back gesture
    e.preventDefault();
    e.stopPropagation();

    this.camera.zoom(e.x, e.y, e.deltaY);
  }

  private _onDragStart (e: MouseEvent): void {
    this._lastDragEvent = e;
  }

  private _onDragUpdate (e: MouseEvent): void {
    this._move(e);
    this._lastDragEvent = e;
  }

  private _onDragEnd (e): void {
    this._lastDragEvent = undefined;
  }

  private _moveStartRelativePoint (e): void {
    this._cameraMoveStarted = true;
    this._cameraMoveStartData = [e.x, e.y];
    this._cameraMoveCurrentData = [e.x, e.y];

    this.listenDrag({
      onDragMove: (e) => this._moveUpdateRelativePoint(e),
      onDragEnd: () => this._moveEndRelativePoint()
    });

    scheduler.add(this._cameraUpdateTask = new Task(() => {
      this.camera.move(
        (this._cameraMoveCurrentData[0] - this._cameraMoveStartData[0]) / 10,
        (this._cameraMoveCurrentData[1] - this._cameraMoveStartData[1]) / 10
      );
    }));
  }

  private _moveUpdateRelativePoint (event: CanvasEvent<MouseEvent>): void {
    this._cameraMoveCurrentData[0] += event.movementX;
    this._cameraMoveCurrentData[1] += event.movementY;
  }

  private _moveEndRelativePoint (): void {
    this._cameraMoveStarted = false;
    scheduler.remove(this._cameraUpdateTask);
  }
}
