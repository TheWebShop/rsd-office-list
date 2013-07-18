require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
        listjs: '../bower_components/listjs/src/list'
        // PlaceholderPolyfil is included as a dependency, but not loaded here by the project
        // I've copied it's contents into placeholderPolyfill.js so that we can run it at will
    },
    shim: {
        'listjs': {
            exports: 'List'
        },
        'underscore': {
            exports: '_',
            init: function() {
                _.templateSettings = {
                     evaluate : /\{\[([\s\S]+?)\]\}/g,
                     interpolate : /\{\{([\s\S]+?)\}\}/g
                };
            }
        }
    }
});

require(['jquery', 'underscore', 'listjs', 'placeholderPolyfill'], function($, _, List, placeholderPolyfill) {
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
        if(!Modernizr.input.placeholder) placeholderPolyfill();

        function zebraTable(container){
            $(container).find('tr').each(function(i){
                var stripe = i%2? 'ms-rteTableOddRow-1': 'ms-rteTableEvenRow-1';
                $(this).removeClass('ms-rteTableOddRow-1 ms-rteTableOddRow-1').addClass(stripe);
            })
        }
    });
});
