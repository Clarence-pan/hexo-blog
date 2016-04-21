$(function () {
    var $main = $('#site-main');
    var $headings = $main.find('.document').find('h2,h3,h4');
    var $content = $('<div id="content"><ul  class="nav nav-stacked"></ul></div>');
    var $contentList = $content.find('ul');
    var indexes = {
        h2: 0,
        h3: 0,
        h4: 0
    };
    $headings.each(function () {
        var $h = $(this);
        var tagName = this.tagName.toLowerCase();
        var hIndex = ++indexes[tagName];
        if (tagName == 'h2'){
            indexes.h3 = 0;
            indexes.h4 = 0;
        } else if (tagName == 'h3') {
            indexes.h4 = 0;
            hIndex = indexes.h2 + '-' + indexes.h3;
        } else if (tagName == 'h4') {
            hIndex = indexes.h2 + '-' + indexes.h3 + '-' + indexes.h4;
        }

        if (!$h.attr('id')) {
            $h.attr('id', "h-" + hIndex);
        }

        var $li = $('<li><a></a></li>').addClass(tagName);
        $li.find('a').text($h.text()).attr('title', $h.text()).attr('href', '#' + $h.attr('id'));
        $li.appendTo($contentList);
    });

    $content.prependTo('#site-main .content-container');
    var on_scroll_update_collapsing = function(){
        var $h2, $h3;
        var $activeContentItem = $content.find('li.active');

        $content.find('.h3, .h4').hide();

        if ($activeContentItem.is('.h2')) {
            $h2 = $activeContentItem;
            $h2.nextUntil('.h2').filter('.h3').show();
        } else if ($activeContentItem.is('.h3')){
            $h3 = $activeContentItem;
            $h2 = first_prev($h3, '.h2');
            $h2.nextUntil('.h2').filter('.h3').show();
            $h3.nextUntil('.h3').filter('.h4').show();
        } else if ($activeContentItem.is('.h4')){
            $h3 = first_prev($activeContentItem, '.h3');
            $h2 = first_prev($h3, '.h2');
            $h2.nextUntil('.h2').filter('.h3').show();
            $h3.nextUntil('.h3').filter('.h4').show();
        }

        function first_prev($el, selector){
            var $prev = $el.prev();
            while (!$prev.is(selector) && $prev.size() > 0){
                $prev = $prev.prev();
            }
            return $prev;
        }
    };

    $(window).scrollspy({target: '#content'}).on('activate.bs.scrollspy', on_scroll_update_collapsing);
    on_scroll_update_collapsing();

    // adjust content
    $(window).on('scroll', function () {
        var InitialTopPos = $('#site-header').height() + $('#tab').height() + 21;
        var winTop = window.scrollY;
        $content.css('top', Math.max(0, InitialTopPos - Math.min(InitialTopPos, window.scrollY))); // 90: the original offset to the top
    }).trigger('scroll');
});