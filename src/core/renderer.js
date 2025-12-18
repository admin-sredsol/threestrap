import { WebGLRenderer, WebGL1Renderer } from "three";
import { Bootstrap } from "../bootstrap";

Bootstrap.registerPlugin("renderer", {
  defaults: {
    // Default to WebGLRenderer (WebGL2), but allow user to override
    klass: WebGLRenderer,
    parameters: {
      depth: true,
      stencil: true,
      preserveDrawingBuffer: true,
      antialias: true,
    },
  },

  listen: ["resize"],

  install: function (three) {
    // Allow user to specify klass as a string for convenience
    let RendererClass = this.options.klass;
    if (typeof RendererClass === "string") {
      if (RendererClass === "WebGL1Renderer") RendererClass = WebGL1Renderer;
      else RendererClass = WebGLRenderer;
    }

    // Instantiate Three renderer
    const renderer = (three.renderer = new RendererClass(
      this.options.parameters
    ));
    three.canvas = renderer.domElement;

    // Add to DOM
    three.element.appendChild(renderer.domElement);
  },

  uninstall: function (three) {
    // Remove from DOM
    three.element.removeChild(three.renderer.domElement);

    delete three.renderer;
    delete three.canvas;
  },

  resize: function (event, three) {
    const renderer = three.renderer;
    const el = renderer.domElement;

    // Resize renderer to render size if it's a canvas
    if (el && el.tagName == "CANVAS") {
      renderer.setSize(event.renderWidth, event.renderHeight, false);
    }
    // Or view size if it's just a DOM element or multi-renderer
    else {
      if (renderer.setRenderSize) {
        renderer.setRenderSize(event.renderWidth, event.renderHeight);
      }
      renderer.setSize(event.viewWidth, event.viewHeight, false);
    }
  },
});
