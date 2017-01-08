(function (define) {
    "use strict";
    define('form_builder', function (require, exports) {
        var $ = require('$'),
        _ = require('_');
        var elements = [],
        forms = [],
        elements_boxes = [],
        mouse_event = 'release',
        dragging_el_btn = null,
        mouse_in_form = null,
        form_el_row = '<div class="form_el_row" name="form_el_row" ></div>',
        place_holder = null;
        function main(){
            /**
             * {
             *   'btn': '单行文本',
             *   'field': '<input />'
             * }
             */
        }

        function drag_reorder_form_elements(){
            $(forms.join(' ,')).find('div.form_el_row').each(function(i, row){
                var $row = $(row);
                $row.on('mouseover', function(event){
                    $(this).css({'background': '#ddd'});
                    event.stopPropagation();
                });
                $row.on('mouseout', function(event){
                    $(this).css({'background': '#fff'});
                    event.stopPropagation();
                });
                $row.on('keyup')
            });
        }

        var attrs = {
            insert_element: function(){
                var uid = dragging_el_btn.attr('uid');
                var element = _.filter(elements, function(element){
                    return element.uid === uid;
                });
                var $el = $(element[0].field);
                if(place_holder && place_holder.is(forms.join(' ,'))){
                    place_holder.append($el);
                }else{
                    $el.insertAfter(place_holder);
                }
                $el.wrap(form_el_row);
                drag_reorder_form_elements();
            },
            highlight_place_holder: function(el){
                var $el = $(el);
                $el.addClass('place_holder_after');
            },
            rm_highlight_place_holder: function(){
                $(forms.join(' ,')).find('div').removeClass('place_holder_after');
            },
            mouseover_element: function(event){
                var $target = $(event.target);
                var _forms = forms.join(' ,');
                if($target.is(forms.join(' ,'))){
                    if($target.children('div.form_el_row').length){
                        place_holder = $target.children('div.form_el_row').last();
                        this.highlight_place_holder(place_holder);
                    }else{
                        place_holder = $target;
                    }
                }else if($target.closest(forms.join(' ,')).length){
                    if($target.is('div[name="form_el_row"]')){
                        place_holder = $target;
                    }else{
                        place_holder = $target.closest('div[name="form_el_row"]');
                    }
                    this.highlight_place_holder(place_holder);
                }
                event.stopPropagation();
            },
            drag_add: function(){
                var _this = this;
                $(elements_boxes.join(' ,')).children().each(function(i, obj){
                    $(obj).on('mousedown', function(event){
                        mouse_event = 'dragging';
                        dragging_el_btn = $(this).clone();
                        $('body').append(dragging_el_btn);
                        event.stopPropagation();
                    });
                });
                
                $(document).on('mousemove', function(event){
                    if(mouse_event === 'dragging'){
                        dragging_el_btn.css({
                            'top': event.pageY + 12, 
                            'left': event.pageX + 12,
                            'position': 'absolute',
                            'z-index': 99999
                        });
                        _this.rm_highlight_place_holder();
                        _this.mouseover_element(event);
                    }
                });
                
                $(document).on('mouseup', function(){
                    mouse_event = 'release';
                    if(dragging_el_btn){
                        dragging_el_btn.remove();
                        _this.insert_element();
                        dragging_el_btn = null;
                        place_holder = null;
                        _this.rm_highlight_place_holder();
                    }
                });
            },
            init_els_box: function(){
                var _this = this;
                _.each(elements, function(el){
                    var $el = $(el.btn);
                    var uid = _.uniqueId(new Date().getTime());
                    el.uid = uid;
                    _.each(elements_boxes, function(el_box){
                        $(el_box).append($el);
                        $el.attr('uid', uid)
                    })
                });
            },
            bootstrap: function(){
                this.init_els_box();
                this.drag_add();
            },
            add_elements: function(els){
                elements = _.concat(elements, els);
            },
            add_forms: function(form){
                forms.push(form);
            },
            add_elements_box: function(el_box){
                elements_boxes.push(el_box);
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