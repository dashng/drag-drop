$(document).ready(function(){
    var fb = new form_builder.create();
    fb.add_elements([{
        'btn': '<button>下拉框</button>',
        'field': '<select></select>'
    },
    {
        'btn': '<button>input</button>',
        'field': '<input placeholder="inset something here..." />'
    }]);
    fb.add_forms('.form');
    fb.add_elements_box('.elements');
    fb.bootstrap();
});
