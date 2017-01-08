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
            this.mouse_in_form = null;
            this.form_el_row = '<div style="border:1px solid #ddd;" name="form_el_row" ></div>';
            this.place_holder = null;
        
        }
        var attrs = {
            insert_element: function(){
                if(this.place_holder.is(this.forms.join(' ,'))){
                    var uid = this.dragging_el_btn.attr('uid');
                    var element = _.filter(this.elements, function(element){
                        return element.uid === uid;
                    });
                    var $el = $(element[0].field);
                    this.place_holder.append($el);
                    $el.wrap(this.form_el_row );
                }else{
                    console.log(this.place_holder);
                }
            },
            mouseover_element: function(event){
                var $target = $(event.target);
                var forms = this.forms.join(' ,');
                if($target.is(this.forms.join(' ,'))){
                    if($target.children('div.form_el_row').length)
                        this.place_holder = $target.children('div.form_el_row').last();
                    else
                        this.place_holder = $target;
                }else if($target.closest(this.forms.join(' ,')).length){
                    if($target.is('div[name="form_el_row"]'))
                        this.place_holder = $target;
                    else
                        this.place_holder = $target.closest('div[name="form_el_row"]');
                }
                event.stopPropagation();
            },
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
                            'top': event.pageY + 12, 
                            'left': event.pageX + 12,
                            'position': 'absolute',
                            'z-index': 99999
                        });
                        _this.mouseover_element(event);
                    }
                });
                
                $(document).on('mouseup', function(){
                    _this.mouse_event = 'release';
                    if(_this.dragging_el_btn){
                        _this.dragging_el_btn.remove();
                        _this.insert_element();
                        _this.dragging_el_btn = null;
                    }
                });
            },
            init_els_box: function(){
                var _this = this;
                _.each(_this.elements, function(el){
                    var $el = $(el.btn);
                    var uid = _.uniqueId(new Date().getTime());
                    el.uid = uid;
                    _.each(_this.elements_boxes, function(el_box){
                        $(el_box).append($el);
                        $el.attr('uid', uid)
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