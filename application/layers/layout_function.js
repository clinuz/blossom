// ==========================================================================
// Project:   Blossom - Modern, Cross-Platform Application Framework
// Copyright: ©2012 Fohr Motion Picture Studios. All rights reserved.
// License:   Licensed under the GPLv3 license (see BLOSSOM-LICENSE).
// ==========================================================================
/*globals sc_assert */

SC.layoutFunctions = {};

SC.GetLayoutFunction = function(hmode, vmode, hmax, vmax, layoutMode) {
  var funcName = ['sc', hmode, vmode, hmax, vmax, layoutMode].join('_'),
      func = SC.layoutFunctions[funcName];

  console.log(funcName);
  if (!func) {
    func = SC.layoutFunctions[funcName] = function(layout, pbounds, position, bounds) {
      sc_assert(hmode >= 0 && hmode < 16);
      sc_assert(vmode >= 0 && vmode < 16);
      sc_assert(typeof hmax === "boolean");
      sc_assert(typeof vmax === "boolean");
      sc_assert(layoutMode >= 0 && layoutMode < 9);

      var pwidth = pbounds[2]/*width*/, pheight = pbounds[3]/*height*/,
          minLayoutWidth,  xAdjustment = 0,
          minLayoutHeight, yAdjustment = 0,
          maxLayoutWidth,
          maxLayoutHeight,
          x, y, width, height;

      // Clamp pwidth and pheight to min/max layout values. This is a requirement 
      // for the layout process below: pwidth and pheight are assumed to lie 
      // within the correct range.
      minLayoutWidth  = layout[4]/*minLayoutWidth*/;
      if (pwidth < minLayoutWidth) {
        xAdjustment = minLayoutWidth - pwidth; // a positive number
        pwidth = minLayoutWidth;

      } else if (hmax) {
        maxLayoutWidth  = layout[5]/*maxLayoutWidth*/;
        if (pwidth > maxLayoutWidth) {
          xAdjustment = maxLayoutWidth - pwidth; // a negative number
          pwidth = maxLayoutWidth;
        }
      }

      minLayoutHeight = layout[6]/*minLayoutHeight*/;
      if (pheight < minLayoutHeight) {
        yAdjustment = minLayoutHeight - pheight; // a positive number
        pheight = minLayoutHeight;

      } else if (vmax) {
        maxLayoutHeight = layout[7]/*maxLayoutHeight*/;
        if (pheight > maxLayoutHeight) {
          yAdjustment = maxLayoutHeight - pheight; // a negative number
          pheight = maxLayoutHeight;
        }
      }

      // Calculate x and width using layout and pwidth. Duplicate the switch 
      // statement, sorted by left value the first time (for x), right value the 
      // second time (for width). This keeps duplicate code at a minimum.
      switch (hmode) {
        case  0: // left, width
        case  2: // left, width percentage
        case 12: // left, right
        case 14: // left, right percentage
          x = layout[0]/*left*/;
          break;
        case  1: // left percentage, width
        case  3: // left percentage, width percentage
        case 13: // left percentage, right
        case 15: // left percentage, right percentage
          x = pwidth * layout[0]/*left percentage*/;
          break;
        case  4: // right, width
        case  6: // right, width percentage
          x = pwidth + layout[0]/*right*/;
          break;
        case  5: // right percentage, width
        case  7: // right percentage, width percentage
          x = pwidth + (pwidth * layout[0]/*right percentage*/);
          break;
        case  8: // centerX, width
        case 10: // centerX, width percentage
          x = (pwidth/2) + layout[0]/*centerX*/;
          break;
        case  9: // centerX percentage, width
        case 11: // centerX percentage, width percentage
          x = (pwidth/2) + (pwidth * layout[0]/*centerX percentage*/);
          break;
      }

      switch (hmode) {
        case  0:                                                    // left, width
        case  1:                                         // left percentage, width
        case  4:                                                   // right, width
        case  5:                                        // right percentage, width
        case  8:                                                 // centerX, width
        case  9:                                      // centerX percentage, width
          width = layout[1]/*width*/;
          break;
        case  2:                                         // left, width percentage
        case  3:                              // left percentage, width percentage
        case  6:                                        // right, width percentage
        case  7:                             // right percentage, width percentage
        case 10:                                      // centerX, width percentage
        case 11:                           // centerX percentage, width percentage
          width = pwidth * layout[1]/*width percentage*/;
          break;

        // Each of the following cases require both the first and second value.
        case 12: // left, right
          width = pwidth - layout[0]/*left*/ - layout[1]/*right*/;
          break;
        case 13: // left percentage, right
          width = pwidth - (pwidth * layout[0]/*left percentage*/) - layout[1]/*right*/;
          break;
        case 14: // left, right percentage
          width = pwidth - layout[0]/*left*/ - (pwidth * layout[1]/*right percentage*/);
          break;
        case 15: // left percentage, right percentage
          width = pwidth - (pwidth * layout[0]/*left percentage*/) - (pwidth * layout[1]/*right percentage*/);
          break;
      }

      // Calculate position.y, bounds.height using layout and pheight. 
      // Duplicate the switch statement, sorted by left value the first time 
      // (for position.y), right value the second time (for bounds.height). This 
      // keeps duplicate code at a minimum.
      switch (vmode) {
        case  0: // top, height
        case  2: // top, height percentage
        case 12: // top, bottom
        case 14: // top, bottom percentage
          y = layout[2]/*top*/;
          break;
        case  1: // top percentage, height
        case  3: // top percentage, height percentage
        case 13: // top percentage, bottom
        case 15: // top percentage, bottom percentage
          y = pheight * layout[2]/*top percentage*/;
          break;
        case  4: // bottom, height
        case  6: // bottom, height percentage
          y = pheight + layout[2]/*bottom*/;
          break;
        case  5: // bottom percentage, height
        case  7: // bottom percentage, height percentage
          y = pheight + (pheight * layout[2]/*bottom percentage*/);
          break;
        case  8: // centerY, height
        case 10: // centerY, height percentage
          y = (pheight/2) + layout[2]/*centerY*/;
          break;
        case  9: // centerY percentage, height
        case 11: // centerY percentage, height percentage
          y = (pheight/2) + (pheight * layout[2]/*centerY percentage*/);
          break;
      }

      switch (vmode) {
        case  0:                                                    // top, height
        case  1:                                         // top percentage, height
        case  4:                                                 // bottom, height
        case  5:                                       // bottom prcentage, height
        case  8:                                                // centerY, height
        case  9:                                     // centerY percentage, height
          height = layout[3]/*height*/;
          break;
        case  2:                                         // top, height percentage
        case  3:                              // top percentage, height percentage
        case  6:                                      // bottom, height percentage
        case  7:                           // bottom percentage, height percentage
        case 10:                                     // centerY, height percentage
        case 11:                          // centerY percentage, height percentage
          height = pheight * layout[3]/*height percentage*/;
          break;

        // Each of the following cases require both the first and second value.
        case 12: // top, bottom
          height = pheight - layout[2]/*top*/ - layout[3]/*bottom*/;
          break;
        case 13: // top percentage, bottom
          height = pheight - (pheight * layout[2]/*top percentage*/) - layout[3]/*bottom*/;
          break;
        case 14: // top, bottom percentage
          height = pheight - layout[2]/*top*/ - (pheight * layout[3]/*bottom percentage*/);
          break;
        case 15: // top percentage, bottom percentage
          height = pheight - (pheight * layout[2]/*top percentage*/) - (pheight * layout[3]/*bottom percentage*/);
          break;
      }

      // All adjustments only affect x and y (position.x and position.y). Bounds 
      // are left unchanged.
      if (xAdjustment !== 0 || yAdjustment !== 0) {
        switch (layoutMode) {
          case 0: // align center
            x += xAdjustment/2;
            y += yAdjustment/2;
            break;
          case 1: // align top
            x += xAdjustment/2;
            // y is already correct
            break;
          case 2: // align bottom
            x += xAdjustment/2;
            y += yAdjustment;
            break;
          case 3: // align left
            // x is already correct
            y += yAdjustment/2;
            break;
          case 4: // align right
            x += xAdjustment;
            y += yAdjustment/2;
            break;
          case 5: // align top left
            // x is already correct
            // y is already correct
            break;
          case 6: // align top right
            x += xAdjustment;
            // y is already correct
            break;
          case 7: // align bottom left
            // x is already correct
            y += yAdjustment;
            break;
          case 8: // align bottom right
            x += xAdjustment;
            y += yAdjustment;
            break;
        }
      }

      // Update the position and bounds structs with the newly-computed values.
      position.x    = x;
      position.y    = y;
      bounds.width  = width;
      bounds.height = height;
    };
  }

  return func;
};