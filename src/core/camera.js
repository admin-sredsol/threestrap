import { Camera, OrthographicCamera, PerspectiveCamera } from "three";
import { Bootstrap } from "../bootstrap";

Bootstrap.registerPlugin("camera", {
  defaults: {
    near: 0.01,
    far: 10000,

    type: "perspective",
    fov: 60,
    aspect: null,

    // type: 'orthographic',
    left: -1,
    right: 1,
    bottom: -1,
    top: 1,

    klass: null,
    parameters: null,
  },

  listen: ["resize", "this.change"],

  install: function (three) {
    three.Camera = this.api();
    three.camera = null;

    this.aspect = 1;
    this.change({}, three);
  },

  uninstall: function (three) {
    delete three.Camera;
    delete three.camera;
  },

  change: function (event, three) {
    const o = this.options;
    const old = three.camera;

    let klass =
      o.klass ||
      {
        perspective: PerspectiveCamera,
        orthographic: OrthographicCamera,
      }[o.type] ||
      Camera;

    // Only create a new camera if type or klass changed, or if camera doesn't exist
    if (!three.camera || event.changes.type || event.changes.klass) {
      if (o.parameters) {
        three.camera = new klass(o.parameters);
      } else if (klass === PerspectiveCamera) {
        three.camera = new PerspectiveCamera(
          o.fov,
          o.aspect || this.aspect,
          o.near,
          o.far
        );
      } else if (klass === OrthographicCamera) {
        three.camera = new OrthographicCamera(
          o.left,
          o.right,
          o.top,
          o.bottom,
          o.near,
          o.far
        );
      } else {
        three.camera = new klass();
      }
    }

    // Assign only known camera properties
    [
      "near",
      "far",
      "fov",
      "aspect",
      "left",
      "right",
      "top",
      "bottom",
      // add more if needed
    ].forEach((key) => {
      if (o[key] !== undefined && key in three.camera) {
        three.camera[key] = o[key];
      }
    });

    this.update(three);

    if (old !== three.camera) {
      three.trigger({
        type: "camera",
        camera: three.camera,
      });
    }
  },

  resize: function (event, three) {
    this.aspect = event.viewWidth / Math.max(1, event.viewHeight);

    this.update(three);
  },

  update: function (three) {
    three.camera.aspect = this.options.aspect || this.aspect;
    three.camera.updateProjectionMatrix();
  },
});
