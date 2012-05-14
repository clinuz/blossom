// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by the LGPL, which can be found in the
// LGPLv2.1 file.
//
// Parts Copyright (C) 2011, Alex Rusell (slightlyoff@chromium.org)

(function(scope){
"use strict";

// For Safari 5.x. Go-go-gadget ridiculously long release cycle!
try {
  (function(){}).bind(scope);
} catch (e) {
  Object.defineProperty(Function.prototype, "bind", {
    value: function(scope) {
      var f = this;
      return function() { return f.apply(scope, arguments); }
    },
    enumerable: false,
    configurable: true,
    writable: true,
  });
}

// Global
scope.c = {
  //
  // Configuration
  //
  debug: false,
  trace: false,
  verbose: false,
  traceAdded: false,
  GC: false,

  //
  // Constants
  //
  GEQ: 1,
  LEQ: 2,

  //
  // Utility methods
  //
  inherit: function(props) {
    var ctor = null;
    var parent = null

    if (props["extends"]) {
      parent = props["extends"];
      delete props["extends"];
    }

    if (props["initialize"]) {
      ctor = props["initialize"];
      delete props["initialize"];
    }

    var realCtor = ctor || function() {};

    /* 
    // NOTE: would happily do this except it's 2x slower. Boo!
    props.__proto__ = parent ? parent.prototype : Object.prototype;
    realCtor.prototype = props;
    */

    var rp = realCtor.prototype = Object.create(
      ((parent) ? parent.prototype : Object.prototype)
    );

    Object.getOwnPropertyNames(props).forEach(function(x) {
      var pd = Object.getOwnPropertyDescriptor(props, x);
      if ( (typeof pd["get"] == "function") ||
           (typeof pd["set"] == "function") ) {
        Object.defineProperty(rp, x, pd);
      } else if (typeof pd["value"] == "function") {
        pd.writable = true;
        pd.configurable = true;
        pd.enumerable = false;
        Object.defineProperty(rp, x, pd);
      } else {
        rp[x] = props[x];
      }
    });
    return realCtor;
  },

  debugprint: function(s /*String*/) {
    if (c.verbose) console.log(s);
  },

  traceprint: function(s /*String*/) {
    if (c.verbose) console.log(s);
  },

  fnenterprint: function(s /*String*/) { console.log("* " + s); },

  fnexitprint: function(s /*String*/) { console.log("- " + s); },

  Assert: function(f /*boolean*/, description /*String*/) {
    if (!f) {
      throw new c.InternalError("Assertion failed:" + description);
    }
  },

  Plus: function(e1, e2) {
    if (!(e1 instanceof c.LinearExpression)) {
      e1 = new c.LinearExpression(e1);
    }
    if (!(e2 instanceof c.LinearExpression)) {
      e2 = new c.LinearExpression(e2);
    }
    return e1.plus(e2);
  },
  
  Minus: function(e1, e2) {
    if (!(e1 instanceof c.LinearExpression)) {
      e1 = new c.LinearExpression(e1);
    }

    if (!(e2 instanceof c.LinearExpression)) {
      e2 = new c.LinearExpression(e2);
    }

    return e1.minus(e2);
  },

  Times: function(e1,e2) {
    // FIXME: re-order based on hotness
    if (e1 instanceof c.LinearExpression &&
        e2 instanceof c.LinearExpression) {
      return e1.times(e2);
    } else if (e1 instanceof c.LinearExpression &&
               e2 instanceof c.Variable) {
      return e1.times(new c.LinearExpression(e2));
    } else if (e1 instanceof c.Variable &&
               e2 instanceof c.LinearExpression) {
      return (new c.LinearExpression(e1)).times(e2);
    } else if (e1 instanceof c.LinearExpression &&
               typeof(e2) == 'number') {
      return e1.times(new c.LinearExpression(e2));
    } else if (typeof(e1) == 'number' &&
               e2 instanceof c.LinearExpression) {
      return (new c.LinearExpression(e1)).times(e2);
    } else if (typeof(e1) == 'number' &&
               e2 instanceof c.Variable) {
      return (new c.LinearExpression(e2, e1));
    } else if (e1 instanceof c.Variable &&
               typeof(e2) == 'number') {
      return (new c.LinearExpression(e1, e2));
    } else if (e1 instanceof c.Variable &&
               e2 instanceof c.LinearExpression) {
      return (new c.LinearExpression(e2, n));
    }
  },

  Divide: function(e1 /*c.LinearExpression*/, e2 /*c.LinearExpression*/) {
    return e1.divide(e2);
  },

  approx: function(a /*double*/, b /*double*/) {
    if (a instanceof c.Variable) {
      a = a.value();
    }
    if (b instanceof c.Variable) {
      b = b.value();
    }
    var epsilon = 1.0e-8;
    if (a == 0.0) {
      return (Math.abs(b) < epsilon);
    } else if (b == 0.0) {
      return (Math.abs(a) < epsilon);
    } else {
      return (Math.abs(a - b) < Math.abs(a) * epsilon);
    }
  },

  hashToString: function(h) {
    // FIXME: why isn't this implemented as a toString on c.HashTable?
    var answer = "";
    c.Assert(h instanceof c.HashTable);
    h.each( function(k,v) {
      answer += k + " => ";
      if (v instanceof c.HashTable) {
        answer += c.hashToString(v);
      } else if (v instanceof c.HashSet) {
        answer += c.setToString(v);
      } else {
        answer += v + "\n";
      }
    });
    return answer;
  },

  setToString: function(s) {
    // FIXME: why isn't this implemented as a toString on c.HashSet?
    if (!s) return;
    c.Assert(s instanceof c.HashSet);
    var answer = s.size() + " {";
    var first = true;
    s.each(function(e) {
      if (!first) {
        answer += ", ";
      } else {
        first = false;
      }
      answer += e;
    });
    answer += "}\n";
    return answer;
  }       
};

})(this);
