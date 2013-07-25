require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
        listjs: '../bower_components/listjs/src/list',
        placeholder: '../bower_components/placeholder/js/placeholder'
    },
    shim: {
        'listjs': {
            exports: 'List'
        },
        'underscore': {
            exports: '_',
            init: function() {
                // the default underscore template tags <%= %> and <% %>
                // are interpretted as code blocks on .aspx pages
                // so we use {{}} and {[]} instead
                _.templateSettings = {
                     evaluate : /\{\[([\s\S]+?)\]\}/g,
                     interpolate : /\{\{([\s\S]+?)\}\}/g
                };
            }
        }
    }
});

require(['jquery', 'underscore', 'listjs', 'placeholder'], function($, _, List, Placeholder) {
    'use strict';

    $.getJSON('/rsd/_vti_bin/listdata.svc/Offices?$expand=Region&$orderby=Name', function(data) {
        var offices = _.map(data.d.results, function(el) {
            el.url = (el.Website || '').replace(/, .*/, '');
            return el;
        });
        var allTpl = _.template($('#offices-table').html(), {
            offices: offices
        });

        $('#loading-offices').remove();
        $('#offices-all').append(allTpl).find('.search').show();

        var list = new List('offices-all', {
            valueNames: [
                'Office',
                'Name',
                'City',
                'BusinessPhone'
            ]
        });

        zebraTable(list.list);
        list.on('updated', function() {
            zebraTable(list.list);
            // If empty show not found message and hide the table head.
            $('.table thead').toggle(list.matchingItems.length !== 0);
            $('#search-notfound').toggle(list.matchingItems.length === 0);
        });

        // now that the <input> is on the stage we can polyfil for IE8
        if(!Modernizr.input.placeholder) window.placeholder = new Placeholder();

        function zebraTable(container){
            $(container).find('tr').each(function(i){
                var stripe = i%2? 'ms-rteTableOddRow-1': 'ms-rteTableEvenRow-1';
                $(this).removeClass('ms-rteTableOddRow-1 ms-rteTableOddRow-1').addClass(stripe);
            })
        }
    });
});
