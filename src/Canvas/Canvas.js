// src/components/Canvas.js

import React, { useRef, useEffect } from "react";
import test_data from "./test_data.json";
import { drawLine, drawRect } from "./help";
import { nextLineEndpoint, calculatePercentage } from "./help";
import DoubleTop from './Pattern/DoubleTop'
import RisingWedge from './Pattern/RisingWedge'

var lineWidth = 100;
var data_boost = 10
const cval = (_) => window.innerHeight - _ * data_boost;

// https://www.babypips.com/learn/forex/how-to-trade-chart-patterns


const Draw = (ctx) => {
  var cdata = test_data.map((_) => cval(_));
  // const hasPattern = DoubleTop(ctx, test_data);
  const hasPattern = RisingWedge(ctx, test_data, 8);

  if (hasPattern) {
    console.log("YEEEEEEEEEEEEES");
  } else {
    console.log("Nooooooooooooo");
  }

  // draw
  cdata.forEach((val, idx) => {
    if (idx < 1) return;
    let x1 = idx * lineWidth;
    let y1 = cdata[idx - 1];
    let x2 = idx * lineWidth + lineWidth;
    let y2 = cdata[idx];
    return drawLine(ctx, x1, y1, x2, y2, "blue", 1);
  });
};

const Canvas = () => {
  const canvasRef = useRef(null);
  let ctx = null;

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    Draw(ctx);

    return ()=>{
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth} // Set your desired canvas width
      height={window.innerHeight} // Set your desired canvas height
    />
  );
};

export default Canvas;
