function fizzy_range(context) {
  var selection
  ,   range = {}
  ;
  
  if (window.getSelection) {
    selection = window.getSelection();
    
    if (selection.rangeCount) {
      selection = selection.getRangeAt(0);
    }

  } else if (document.selection) {
    selection = document.selection.createRange();
  }
  
  range.is = function(el) {
    return el.toLowerCase() === range.parentNode();
  };
  
  range.parentNode = function() {
    var container;
    
    if (selection) {
      if (window.getSelection) {
        container = selection.startContainer;
        
        if (container && container.nodeType === 3) {
          container = container.parentNode;
        }

        return container && container.nodeName.toLowerCase();
        
      } else {
        return selection.parentElement().nodeName.toLowerCase();
      }
    }
  };
  
  range.restore = function(with_parent) {
    if (window.getSelection) {
      var sel = window.getSelection();
      
      context.focus();
      
      if (selection.collapsed) {
        var shim = document.createTextNode('\00');
        selection.insertNode(shim);
        selection.selectNode(shim);
      }
      
      sel.removeAllRanges();
      sel.addRange(selection);

      if (with_parent) {
        var r = document.createRange();
        var a = range.commonAncestor();
        
        if (a !== context) {
          r.selectNode(a);
          
          sel.removeAllRanges();
          sel.addRange(r);
        }
      }
      
    } else if (document.selection && selection.select) {
      selection.select();
    }
  };
  
  range.commonAncestor = function() {
    var a;

    if (window.getSelection) {
      a = selection.commonAncestorContainer;
      
      if (a && a.nodeType === 3) {
        a = a.parentNode;
      }
    } else if (document.selection) {
      a = selection.parentElement();
    }
    
    return a;
  }
  
  range.selectNode = function(node) {
    var r = document.createRange();
    var sel = window.getSelection();
    
    sel.removeAllRanges();
    r.selectNode(node);
    sel.addRange(r);
  };
  
  range.moveToEnd = function(node) {
    var range, sel;
    
    if (document.createRange) {
      range = document.createRange();
      range.selectNodeContents(node);
      range.collapse(false);
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.selection) {
      range = document.createTextRange();
      range.moveToElementText(node);
      range.collapse(false);
      range.select();
    }
  };
  
  range.wrap = function(nodeName) {
    var node;
    
    try {
      node = document.createElement(nodeName);
      selection.surroundContents(node);
      range.selectNode(node);
    } catch(e) {}
  };
  
  range.insertHTML = function(str) {
    if (selection && selection.pasteHTML) {
      selection.pasteHTML(str);
      
    } else {
      var el   = document.createElement("div")
      ,   frag = document.createDocumentFragment()
      ,   node
      ,   lastNode
      ;
      
      el.innerHTML = str;

      while (node = el.firstChild) {
        lastNode = frag.appendChild(node);
      }
      
      selection.insertNode(frag);
    }
  };
  
  return range;
}

