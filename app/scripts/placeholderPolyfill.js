// a copy of PlaceholderPolyfil.js wraped as a function
// so tha we can call it after the <input> are created dynamically
define(['jquery'], function($) {
    return function() {
        $('input[placeholder]').each(function() {
            var $this = $(this);
            var ph = $this.attr('placeholder');
            if (ph != '' && $this.val() == '') {
                $this.val(ph);
                $this.addClass('placeholder');
                $this.focus(function() {
                    if ($(this).val() == ph) {
                        $(this).val('');
                        $(this).removeClass('placeholder');
                    }
                });
                $this.blur(function() {
                    if ($(this).val() == '') {
                        $(this).val(ph);
                        $(this).addClass('placeholder');
                    }
                });
            }
        });
        // Clear out placeholder values before submission
        $('form:has(input[placeholder])').submit(function() {
            $('input[placeholder]', this).each(function() {
                var $this = $(this);
                var ph = $this.attr('placeholder');
                if (ph != '' && $this.val() == ph)
                    $this.val('');
            });
        });
    }
});
