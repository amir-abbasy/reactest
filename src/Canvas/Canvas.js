// src/components/Canvas.js

import React, { useRef, useEffect } from "react";
import test_data from "./test_data.json";
import { drawLine, drawRect } from "./help";
import { nextLineEndpoint, calculatePercentage } from "./help";

var lineWidth = 70;
var data_boost = 10
const cval = (_) => window.innerHeight - _ * data_boost;

// https://www.babypips.com/learn/forex/how-to-trade-chart-patterns

function DoubleTop(ctx, data_) {
  var data = [...data_].reverse();
  var len = data.length;
  var shapePivot = [-1, -1, -1, -1];
  if (len < shapePivot.length) return false;
  var patternData = data.slice(0, shapePivot.length);

  ////////// setp 1
  // Analyse shape 
  for (let i = 0; i < shapePivot.length; i++) {
      if (i%2 == 0 && data[i] < data[i+1]) {
        // should below of prev
        shapePivot[i] = 0;
      }else if(i%2 == 1 && data[i] > data[i+1]){
        // should above of prev
        shapePivot[i] = 0;
      }
  }

  var gotShape_1 = !shapePivot.some((_) => _ != 0)
  // console.log("gotShape_1", shapePivot);


  if(!gotShape_1)return false

    // N E C K  L I N E
    // neckline top
    var necklineTop = Math.max(...patternData)
    var necklineBottom = Math.min(...patternData)
    var offset =  len - shapePivot.length
    var avgNeckHeight = calculatePercentage(necklineTop - necklineBottom, 30/2)
    var cNeckHeight = avgNeckHeight*data_boost
    drawLine(ctx, offset*lineWidth, cval(necklineTop), len*lineWidth, cval(necklineTop), 'black', 1);
    drawRect(ctx, offset*lineWidth, cval(necklineTop)-(cNeckHeight),  (len*lineWidth-offset*lineWidth), cNeckHeight*2,  "green", 1);
    // neckline bottom
    drawLine(ctx, offset*lineWidth, cval(necklineBottom), len*lineWidth, cval(necklineBottom), 'black', 1);
    drawRect(ctx, offset*lineWidth, cval(necklineBottom)-(cNeckHeight),  (len*lineWidth-offset*lineWidth), cNeckHeight*2,  "green", 1);
    

  ////////// setp 2

  for (let i = 0; i < shapePivot.length; i++) {
    // neck top edge
    var topNeckTop = cval(necklineTop)-cNeckHeight
    var topNeckBotton = cval(necklineTop)+cNeckHeight
    // neck bottom edge
    var botNeckTop = cval(necklineBottom)-cNeckHeight
    var botNeckBotton = cval(necklineBottom)+cNeckHeight
    i == 3 && console.log(i, data[i], cval(data[i]) , topNeckTop ,'&&', cval(data[i]) , topNeckBotton);
    
    if (i%2 == 0 && cval(data[i]) > botNeckTop && cval(data[i]) < botNeckBotton) {
      // should below of prev
      shapePivot[i] = 1;
    }else if(i%2 == 1 && cval(data[i]) > topNeckTop && cval(data[i]) < topNeckBotton){
      // should above of prev
      shapePivot[i] = 1;
    }
    // drawLine(ctx, (len-i)*lineWidth, cval(data[i]), ((len-i)-1)*lineWidth, cval(data[i]), i % 2 == 0 ? "green" : "blue", 1);
    // drawRect(ctx, (len - i) * lineWidth, cval(data[i]), -lineWidth * 2, 30, i % 2 == 0 ? "green" : "blue", 1);
  }


  var gotShape_2 = !shapePivot.some((_) => _ == 0)
  // console.log("gotShape_2 =====>", shapePivot);

  // result
  return gotShape_2;
}

function findP(data) {
  if (data.length < 3) {
    // Not enough data points to form a pattern
    return false;
  }

  let isRising = false;
  let peakIndex = -1;

  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
      // Found a potential peak
      isRising = true;
      peakIndex = i;
    } else if (data[i] < data[i - 1] && data[i] < data[i + 1] && isRising) {
      // Found a potential lower peak after a rise
      isRising = false;
      if (peakIndex !== -1) {
        // Check if the difference between the two peaks is not too large
        const peakDifference = data[peakIndex] - data[i];
        if (peakDifference <= 50) {
          // You can adjust the threshold (10 in this example) as needed
          return true;
        }
      }
    }
  }

  return false;
}

const Draw = (ctx) => {
  var cdata = test_data.map((_) => cval(_));
  const hasPattern = DoubleTop(ctx, test_data);

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
    return drawLine(ctx, x1, y1, x2, y2, "tomato", 1);
  });
};

const Canvas = () => {
  const canvasRef = useRef(null);
  let ctx = null;

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    Draw(ctx);
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
