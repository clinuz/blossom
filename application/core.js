// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var SC = global.SC || {} ;

/**
  If set to NO, then pressing backspace will NOT navigate to the previous 
  page in the browser history, which is the default behavior in most browsers.
  
  Usually it is best to leave this property set to NO in order to prever the
  user from inadvertantly losing data by pressing the backspace key.
  
  @property {Boolean}
*/
SC.allowsBackspaceToPreviousPage = NO;

// ==========================================================================
// SC Statechart - Buildfile
// copyright (c) 2009 - Evin Grano, and contributors
// ==========================================================================

// ..........................................................
// State Constants
// 

SC.DEFAULT_TREE = 'default';

// ==========================================================================
// Project:   SproutCore Plugin Architecture
// Copyright: ©2012 xTuple. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/* @namespace

  Plugins are loaded on-demand. For more information on Plugins, see the 
  'Creating Loadable Plugins' tutorial and documentation.

  @extends XT.Object
*/
SC.mixin(SC,
  /** @scope SC */ {
    
  NAMESPACE: "Plugin",
  VERSION: "0.1.0",

  /** @property
    SC.Plugins each have at least 1 page (@see SC.PluginPage)
    that houses their default views. Due to the way they are loaded
    these pages are not stored directly in the namespace of the Plugin
    but instead in this object.

    ```SC.pages.dev = SC.PluginPage.create(...)```
  */
  pages: {},

  views: {}

});

// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

// Note:  We won't use SC.T_* here because those constants might not yet be
//        defined.
SC._mapDisplayNamesUseHashForSeenTypes = ['object', 'number', 'boolean', 'array', 'string', 'function', 'class', 'undefined', 'error'];  // 'hash' causes problems


SC.mapDisplayNames = function(obj, level, path, seenHash, seenArray) {
  if (!SC.browser.safari) return ;

  // Lazily instantiate the hash of types we'll use a hash for the "have we
  // seen this before?" structure.  (Some types are not safe to put in a hash
  // in this manner, so we'll use the hash for its algorithmic advantage when
  // possible, but fall back to an array using indexOf() when necessary.)
  if (!SC._mapDisplayNamesUseHashForSeenTypesHash) {
    var types = SC._mapDisplayNamesUseHashForSeenTypes ;
    var typesHash = {} ;
    var len = types.length ;
    for (var i = 0;  i < len;  ++i) {
      var type = types[i] ;
      typesHash[type] = true ;
    }
    SC._mapDisplayNamesUseHashForSeenTypesHash = typesHash ;
  }


  if (obj === undefined) obj = window ;
  if (level === undefined) level = 0 ;
  if (path === undefined) path = [] ;
  if (seenHash === undefined) seenHash = {} ;
  if (seenArray === undefined) seenArray = [] ;

  if (level > 5) return ;

  var useHash = !!SC._mapDisplayNamesUseHashForSeenTypesHash[SC.typeOf(obj)] ;

  var hash;
  var arrayToCheck;
  if (useHash) {
    hash = SC.hashFor(obj) ;
    arrayToCheck = seenHash[hash];
  }
  else {
    arrayToCheck = seenArray;
  }
  
  if (arrayToCheck  &&  arrayToCheck.indexOf(obj) !== -1) return ;
  
  if (arrayToCheck) {
    arrayToCheck.push(obj) ;
  }
  else if (useHash) {
    seenHash[hash] = [obj] ;
  }

  var loc = path.length, str, val, t;
  path[loc] = '';

  for(var key in obj) {
    if (obj.hasOwnProperty && !obj.hasOwnProperty(key)) continue ;
    if (!isNaN(Number(key))) continue ; // skip array indexes
    if (key === "constructor") continue ;
    if (key === "superclass") continue ;
    if (key === "document") continue ;

    // Avoid TypeError's in WebKit based browsers
    if (obj.type && obj.type === 'file') {
      if (key === 'selectionStart' || key === 'selectionEnd') continue;
    }

    try{
      val = obj[key];
    }catch(e){
      //This object might be special this get called when an app
     // using webView adds an static C object to JS.
      continue;
    }
    if (key === "SproutCore") key = "SC";
    t   = SC.typeOf(val);
    if (t === SC.T_FUNCTION) {
      if (!val.displayName) { // only name the first time it is encountered
        path[loc] = key ;
        str = path.join('.').replace('.prototype.', '#');
        val.displayName = str;
      }

      // handle constructor-style
      if (val.prototype) {
        path.push("prototype");
        SC.mapDisplayNames(val.prototype, level+1, path, seenHash, seenArray);
        path.pop();
      }

    } else if (t === SC.T_CLASS) {
      path[loc] = key ;
      SC.mapDisplayNames(val, level+1, path, seenHash, seenArray);

    } else if ((key.indexOf('_')!==0) && (t===SC.T_OBJECT || t===SC.T_HASH)) {
      path[loc] = key ;
      SC.mapDisplayNames(val, level+1, path, seenHash, seenArray);
    }
  }

  path.pop();
};

