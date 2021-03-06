// @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-v3-or-Later

(function() {
  var Search = function() {
    var self = this;

    this.subscribe("widget/ready", function(evt, searchForm) {
      $.extend(self, {
        searchForm: searchForm,
        searchFormAction: searchForm.attr("action"),
        searchInput: searchForm.find("input[type='search']"),
        searchInputName: searchForm.find("input[type='search']").attr("name"),
        searchInputHandle: searchForm.find("input[type='search']").attr("handle"),
        options: {
          cacheLength : 15,
          delay : 800,
          extraParams : {limit : 4},
          formatItem : self.formatItem,
          formatResult : self.formatResult,
          max : 5,
          minChars : 2,
          onSelect: self.selectItemCallback,
          parse : self.parse,
          scroll : false
        }
      });

      self.searchInput.autocomplete(self.searchFormAction + ".json", $.extend(self.options, {
        element: self.searchInput
      }));
    });

    this.formatItem = function(row) {
      if (typeof row.search !== "undefined") {
        return Diaspora.I18n.t("search_for", row);
      } else {
        var item = "";
        if (row.avatar) {
          item += "<img src='"+ row.avatar +"' class='avatar'/>";
        }
        item += row.name;
        if (row.handle) {
          item += "<div class='search_handle'>" + row.handle + "</div>";
        }
        return item;
      }
    };

    this.formatResult = function(row) {
      return Handlebars.Utils.escapeExpression(row.name);
    };

    this.parse = function(data) {
      var results =  data.map(function(person){
        person['name'] = Handlebars.Utils.escapeExpression(person['name']);
        return {data : person, value : person['name']}
      });

      results.push({
        data: {
          name: self.searchInput.val(),
          url: self.searchFormAction + "?" + self.searchInputName + "=" + self.searchInput.val(),
          search: true
        },
        value: self.searchInput.val()
      });

      return results;
    };

    this.selectItemCallback = function(evt, data, formatted) {
      if (data['search'] === true) { // The placeholder "search for" result
        window.location = self.searchFormAction + '?' + self.searchInputName + '=' + data['name'];
      } else { // The actual result
        self.options.element.val(formatted);
        window.location = data['url'] ? data['url'] : "/tags/" + data['name'].substring(1); // we don't want the #-character
      }
    };
  };

  Diaspora.Widgets.Search = Search;
})();
// @license-end

