document.addEventListener('DOMContentLoaded', function() {
    function wrap(el, wrapper) {
        if(typeof wrapper === 'undefined') {
            wrapper = document.createElement('div');

            wrapper.setAttribute('class', 'wrapper');
        }

        el.parentNode.insertBefore(wrapper, el);

        wrapper.appendChild(el);
    }

    var tables = document.querySelectorAll('table');

    if(tables.length) {
        for(var i = 0; i < tables.length; i++) {
            var tableWrapper = document.createElement('div');

            tableWrapper.setAttribute('class', 'table-container');

            wrap(tables[i], tableWrapper);
        }
    }
});


