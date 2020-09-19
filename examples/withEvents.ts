// import { scheduler } from '../src/lib/Scheduler';
// import { Component } from '../src/lib/Components/Component';
// import { render } from '../src/lib/Renderer/render';
// import { createElement } from '../src/lib/Renderer/createElement';
// import { TComponentData } from '../src/lib/types';
// import { EvTarget, getEvents, KEY_EVEN_TARGET } from '../src/lib/BaseClasses/EvTarget';
// import { HitBox, hitBoxService } from '../src/lib/BaseClasses/HitBox';
// import { getWorkerScope } from '../src/lib/Worker/getWorkerScope';

// const workerScope = await getWorkerScope();

// const colors = [
//   'red', 'purple', 'green', 'grey', 'blue'
// ];
// const MIN_SIZE = 100;

// class Coube extends Component {
//   public props: { x: number, y: number, s: number, d: number};

//   private events: EvTarget = new EvTarget(this);
//   private hitBox: HitBox = new HitBox(this);

//   private color = colors[Math.floor(Math.random() * 5)];

//   constructor (a, b) {
//     super(a, b);

//     this.attachToLayer(this.layers.map['1']);

//     this.events.addEventListener('click', this.onClick);
//   }

//   protected render (): void {
//     this.layer!.ctx.fillStyle = this.color;
//     this.layer!.ctx.fillRect(this.props.x, this.props.y, this.props.s, this.props.s);
//   }

//   protected updateChildren (): TComponentData[] {
//     if (MIN_SIZE > this.props.s) {
//       return [];
//     }

//     return [
//       createElement(Coube, {
//         ...this.props,
//         s: this.props.s / this.props.d | 0
//       })
//     ];
//   }

//   private onClick = (): void => {
//     this.color = colors[Math.floor(Math.random() * 5)];
//     this.performRender();
//   };
// }

// class Root extends Component {
//   private center = {
//     x: this.layers.list[0].canvas.width / 2,
//     y: this.layers.list[0].canvas.height / 2
//   };

//   constructor (a, b) {
//     super(a, b);

//     workerScope.addEventListener('message', ({ data }) => {
//       if (data?.event?.type === 'click') {
//         const comps: Coube[] = hitBoxService.testPoint(
//           (data.event as MouseEvent).screenX,
//           (data.event as MouseEvent).screenY
//         ) as Coube[];

//         getEvents(comps[0])!.dispatchEvent(data.event);
//       }
//     });
//   }

//   protected render (): void {
//     this.layers.list.forEach(l => {
//       if (l.isDirty) {
//         l.ctx.fillStyle = 'black';
//         l.ctx.clearRect(0, 0, l.canvas.width, l.canvas.height);
//       }
//     });
//   }

//   protected shouldUpdateChildren (): boolean {
//     return this.firstUpdateChildren;
//   }

//   protected updateChildren (): TComponentData[] {
//     return [
//       createElement(
//         Coube, {
//           x: this.center.x - 500,
//           y: this.center.y - 500,
//           s: 400,
//           d: 2
//         }
//       ),
//       createElement(
//         Coube, {
//           x: this.center.x + 1000,
//           y: this.center.y - 1000,
//           s: 900,
//           d: 3
//         }
//       ),
//       createElement(
//         Coube, {
//           x: this.center.x - 600,
//           y: this.center.y + 600,
//           s: 500,
//           d: 3
//         }
//       ),
//       createElement(
//         Coube, {
//           x: this.center.x + 800,
//           y: this.center.y + 800,
//           s: 700,
//           d: 4
//         }
//       )
//     ];
//   }
// }

// (function tick () {
//   scheduler.run();
//   requestAnimationFrame(tick);
// })();

// render(
//   workerScope,
//   createElement(Root)
// );
