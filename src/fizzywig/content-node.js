function fizzy_contentNode(node, content) {
  var content_node = {}
  ,   object_tree  = {}
  ,   object_attr
  ;
  
  object_attr = node.getAttribute('data-content-editable') || 'data';
  object_reach(object_tree, object_attr, node.innerHTML);
  
  content_node.enable = function() {
    node.setAttribute('contentEditable', true);
    return content_node;
  };
  
  content_node.disable = function() {
    node.removeAttribute('contentEditable');
    return content_node;
  };
  
  content_node.json = function() {
    return object_tree;
  };
  
  element_addEventListener(node, 'focus', emit('focus'));
  element_addEventListener(node, 'blur', emit('blur'));
  element_addEventListener(node, 'keyup', emit('keyup'));
  
  function emit(event_type) {
    return function(e) {
      fizzywig.emitter.emit(event_type);
    }
  }
  
  return content_node.enable();
}

