(function ($) {
  $(document).ready(function () {


    var spreadsheetID = "1DxHj11SmhzbByeXdkaYl9MA5bzAy3cGwq-cjrDiJ8AY";
    var urlpictures = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/1/public/values?alt=json";
    var urlgroups = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/2/public/values?alt=json";

    $.getJSON(urlgroups, function (data) {
      var groupdata = data.feed.entry.map(function (item) {
        var result = {};
        for (var key in item) {
          if (key.substr(0, 4) === 'gsx$') {
            result[key.substr(4)] = item[key].$t;
          }
        }
        return result;
      });

      var groupmapping = {};
      groupdata.map(function (row, key) {
        groupmapping[row.group] = key;
        row.images = [];
      });

      $.getJSON(urlpictures, function (data) {
        jsondata = data.feed.entry.map(function (item) {
          var result = {};
          for (var key in item) {
            if (key.substr(0, 4) === 'gsx$') {
              result[key.substr(4)] = item[key].$t;
            }
          }
          ;
          return result;
        });

        jsondata.filter(function (row) {
          return row.published === 'yes';
        }).map(function (row) {
          row.full = row.full.replace(/dl=0$/, 'dl=1');
          row.big = row.big.replace(/dl=0$/, 'dl=1');
          row.thumb = row.thumb.replace(/dl=0$/, 'dl=1');

          if (row.group === '') return;
          groupdata[groupmapping[row.group]].images.push(row);
        });

        window.photoGallery = new Vue({
          el: '#photoGallery',
          data: {
            groups: groupdata,
            selectedGroup: null
          },
          methods: {
            vote: function (id) {
              $.getJSON('//freegeoip.net/json/?callback=?', function (location) {
                $.ajax(
                  'https://script.google.com/macros/s/AKfycbz47PGo75twC8Guzsg18MetQd3jlKje1LSFJTz1v2QEZWS3H_I/exec',
                  {
                    data: {
                      id: id,
                      ip: location.ip,
                      country: location.country_name,
                      city: location.city
                    }
                  }
                );
                alert('Vote registered successfully!');
              });
            }
          }
        });

        var groups = {};
        $('.galleryItem').each(function () {
          var id = parseInt($(this).attr('data-group'), 10);
          if (!groups[id]) {
            groups[id] = [];
          }
          groups[id].push(this);
        });

        $.each(groups, function () {
          $(this).magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            closeBtnInside: false,
            gallery: {enabled: true},
            image: {
              titleSrc: function (item) {
                var ret = '<' + 'div><' + 'em>' + item.el.attr('data-caption') + '<' + '/em><' + '/div>';
                ret += '<' + 'a href="javascript:photoGallery.vote(' + item.el.attr('data-id') + ');">Vote for this photo!<' + '/a>';
                ret += '<' + 'small>';
                if (item.el.attr('data-author')) ret += '<' + 'span>Author: ' + item.el.attr('data-author') + '<' + '/span> ';
                if (item.el.attr('data-location')) ret += '&middot; <' + 'span>Location: ' + item.el.attr('data-location') + '<' + '/span> ';
                if (item.el.attr('data-context')) ret += '&middot; <' + 'span>Context: ' + item.el.attr('data-context') + '<' + '/span> ';
                if (item.el.attr('data-date')) ret += '&middot; <' + 'span>Date: ' + item.el.attr('data-date') + '<' + '/span> ';
                ret += ' &middot; <' + 'a href="' + item.el.attr('data-full') + '" target="_blank">original<' + '/a><' + '/small>';
                return ret;
              }
            },
            mainClass: 'mfp-with-zoom',
            zoom: {
              enabled: true,
              duration: 300,
              easing: 'ease-in-out',
              opener: function (openerElement) {
                return openerElement.is('img') ? openerElement : openerElement.find('img');
              }
            }
          });
        });

      });
    });

  });
})(jQuery);
