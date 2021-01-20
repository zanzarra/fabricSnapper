(function () {
  "use strict";

  class fabricSnapper {

    /**
     * Constructor for the fabricSnapper class.
     * Prepares an instance of fabricSnapper class.
     * 
     * @param {fabric.Canvas} canvas 
     *   FabricJS canvas object.
     * 
     * @param {obj} settings 
     *   Simple object representing fabric.Line settings.
     */
    constructor(canvas, settings = {}) {
      let defaultSettings = {
        fill: 'red',
        stroke: 'red',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center',
      };
      this.XAxis = null;
      this.YAxis = null;
      this.canvas = canvas;
      this.axisSettings = Object.assign(defaultSettings, settings);

      this.attachHandlers();
    }

    /**
     * Initiates axis object on FabricJS canvas.
     */
    initAxis() {
      if (this.XAxis) {
        return;
      }

      this.XAxis = new fabric.Line([0, -1000, 0, 1000], this.axisSettings);
      this.YAxis = new fabric.Line([-1000, 0, 1000, 0], this.axisSettings);
      this.canvas.add(this.XAxis);
      this.canvas.add(this.YAxis);
      this.canvas.requestRenderAll();
    }

    /**
     * Attaches event listeners to the FabricJS canvas.
     */
    attachHandlers() {
      let self = this;

      self.canvas.on('object:moving', function (options) {
        self.initAxis();

        let snappingPoint = 20;
        let objects = canvas.getObjects();

        let objHorCenter = self.getObjectCenter(options.target, 'horizontal');
        let objVerCenter = self.getObjectCenter(options.target, 'vertical');

        let activeVer = false;
        let activeHor = false;
        for (var i = 0; i < objects.length; i++) {
          if (objects[i] == options.target || objects[i] == self.XAxis || objects[i] == self.YAxis) {
            continue;
          }

          let horCenter = self.getObjectCenter(objects[i], 'horizontal');
          let verCenter = self.getObjectCenter(objects[i], 'vertical');

          if (Math.abs(objHorCenter - horCenter) < snappingPoint) {
            options.target.set({
              left: self.calculateObjectCenter(options.target, 'horizontal', horCenter),
            }).setCoords();
            activeHor = horCenter
          }

          if (Math.abs(objVerCenter - verCenter) < snappingPoint) {
            options.target.set({
              top: self.calculateObjectCenter(options.target, 'vertical', verCenter),
            }).setCoords();
            activeVer = verCenter;
          }
        }

        if (activeVer !== false) {
          self.showYAxis(activeVer);
        }
        else {
          self.hideYAxis();
        }

        if (activeHor !== false) {
          self.showXAxis(activeHor);
        }
        else {
          self.hideXAxis();
        }
      });

      // We need to remove both axis when the dragndrop is complete.
      this.canvas.on('object:moved', function (e) {
        self.canvas.remove(self.XAxis);
        self.canvas.remove(self.YAxis);
        self.XAxis = self.YAxis = null;
      });
    }

    /**
     * This method helps to determine the object center depending on object's origin.
     * It is very helpful if you have objcts with different origin points.
     * 
     * @param {Fabric.object} obj 
     * @param {string} axis 
     *  'horizontal' or 'vertical'
     */
    getObjectCenter(obj, axis) {
      let position = 'left';
      let dimension = 'width';
      let origin = 'X';

      if (axis == 'vertical') {
        position = 'top';
        dimension = 'height';
        origin = 'Y';
      }

      if (obj['origin' + origin] == 'center') {
        return obj[position];
      }
      // origin top or left.
      if (obj['origin' + origin] == position) {
        return obj[position] + (obj[dimension] * obj['scale' + origin] / 2);
      }

      // origin bottom or right.
      return obj[position] - (obj[dimension] * obj['scale' + origin] / 2);
    }

    /**
     * This method helps to calculate the future object center depending on object's origin.
     * It is very helpful if you have objcts with different origin points.
     * 
     * @param {Fabric.object} obj 
     * @param {string} axis 
     *  'horizontal' or 'vertical'
     * @param {number} desiredValue
     *  Desired value for the center. 
     */
    calculateObjectCenter(obj, axis, desiredValue) {
      let position = 'left';
      let dimension = 'width';
      let origin = 'X';

      if (axis == 'vertical') {
        position = 'top';
        dimension = 'height';
        origin = 'Y';
      }

      if (obj['origin' + origin] == 'center') {
        return desiredValue;
      }

      // origin top or left.
      if (obj['origin' + origin] == position) {
        return desiredValue - (obj[dimension] * obj['scale' + origin] / 2);
      }

      // origin bottom or right.
      return desiredValue + (obj[dimension] * obj['scale' + origin] / 2);
    }

    /**
     * Shows X axis on the canvas
     * 
     * @param {number} pos 
     *   X coordinate of an X axis.
     */
    showXAxis(pos) {
      if (pos != this.XAxis.x1) {
        this.XAxis.set('x1', pos);
        this.XAxis.set('x2', pos);
        this.XAxis.set('fill', 'green');
        this.XAxis.set('stroke', 'green');
      }
      this.XAxis.set('visible', true);
    }

    /**
     * Hides X axis on the canvas
     */
    hideXAxis() {
      this.XAxis.set('visible', false);
    }

    /**
     * Shows Y axis on the canvas
     * 
     * @param {number} pos 
     *   Y coordinate of an Y axis.
     */
    showYAxis(pos) {
      if (pos != this.YAxis.y1) {
        this.YAxis.set('y1', pos);
        this.YAxis.set('y2', pos);
        this.YAxis.set('fill', 'green');
        this.YAxis.set('stroke', 'green');
      }
      this.YAxis.set('visible', true);
    }

    /**
     * Hides Y axis on the canvas
     */
    hideYAxis() {
      this.YAxis.set('visible', false);
    }
  }

  module.exports = fabricSnapper;
})();
