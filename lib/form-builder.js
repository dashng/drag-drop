(function (define) {
    "use strict";
    define('form_builder', function (require, exports) {
        var $ = require('$'),
        _ = require('_');
        function main(){
            /**
             * {
             *   'btn': '单行文本',
             *   'field': '<input />'
             * }
             */
            this.elements = [];
            this.forms = [];
            this.elements_boxes = [];
            this.mouse_event = 'release';
            this.dragging_el_btn = null;
        
        }
        var attrs = {
            drag_add: function(){
                var _this = this;
                $(this.elements_boxes.join(' ,')).children().each(function(i, obj){
                    $(obj).on('mousedown', function(event){
                        _this.mouse_event = 'dragging';
                        _this.dragging_el_btn = $(this).clone();
                        $('body').append(_this.dragging_el_btn);
                        event.stopPropagation();
                    });
                });
                $(document).on('mousemove', function(event){
                    if(_this.mouse_event === 'dragging'){
                        _this.dragging_el_btn.css({
                            'top': event.pageY, 
                            'left': event.pageX,
                            'position': 'absolute',
                            'z-index': 99999
                        });
                    }
                });
                $(document).on('mouseup', function(){
                    _this.mouse_event = 'release';
                    _this.dragging_el_btn.remove();
                });
            },
            init_els_box: function(){
                var _this = this;
                _.each(_this.elements, function(el){
                    var $el = $(el.btn);
                    el.$el = $el;
                    _.each(_this.elements_boxes, function(el_box){
                        $(el_box).append($el);
                    })
                });
            },
            bootstrap: function(){
                this.init_els_box();
                this.drag_add();
            },
            add_elements: function(el){
                this.elements.push(el);
            },
            add_forms: function(form){
                this.forms.push(form);
            },
            add_elements_box: function(el_box){
                this.elements_boxes.push(el_box);
            }

        }
        
        _.extend(main.prototype, attrs);

        $.extend(exports, {
            create: main
        })
    });
}(typeof define === 'function' && define.amd ? define : function (id, factory) {
    if (typeof exports !== 'undefined') {
        factory(require, exports);
    } else {
        factory(function(value) {
            return window[value];
        }, (window[id] = {}));
    }
}));