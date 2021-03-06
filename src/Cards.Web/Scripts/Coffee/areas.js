﻿
(function(cards, window, $, ko) {
  cards.Class.AreasViewModel = function() {
    var self;
    self = this;
    self.rootUrl = $("meta[name=cards-baseurl]").attr("content");
    self.newArea = ko.observable("");
    self.areas = ko.observableArray([]);
    self.resize = function() {
      var areaCount, width, windowWidth;
      windowWidth = $(window).width();
      areaCount = $("#areas article").length;
      width = ($("#areas article").outerWidth() + 12) * areaCount;
      if (windowWidth < width) {
        $("body").width(width);
      } else {
        $("body").width(windowWidth);
      }
    };
    self.colorizeCard = function(card, aged) {
      var cardElement, staleAge;
      cardElement = $(card);
      staleAge = cardElement.data("stale");
      if (staleAge > aged) {
        cardElement.addClass('card-aged');
      }
    };
    self.colorizeLabel = function(label) {
      var color, labelElement;
      labelElement = $(label);
      color = labelElement.data("color");
      labelElement.css("background-color", color);
    };
    self.colorize = function() {
      var aged, card, label, labels, _i, _j, _len, _len1;
      labels = $("#labels span");
      for (_i = 0, _len = labels.length; _i < _len; _i++) {
        label = labels[_i];
        self.colorizeLabel(label);
      }
      aged = $("#cards").data('aged');
      cards = $("#cards li");
      for (_j = 0, _len1 = cards.length; _j < _len1; _j++) {
        card = cards[_j];
        self.colorizeCard(card, aged);
      }
    };
    self.initControls = function() {
      self.resize();
      $().dragScroll();
      $("#areas").on("dragover", "article", function(event) {
        event.preventDefault();
      }).on("drop", "article", function(event) {
        var areaElement, areaId, card, cardElement, cardId, sourceAreaId;
        event.preventDefault();
        sourceAreaId = parseInt(event.originalEvent.dataTransfer.getData("AreaID"));
        cardId = event.originalEvent.dataTransfer.getData("CardID");
        cardElement = $("*[data-cardid=" + cardId + "]");
        areaElement = $(event.target).closest("#areas article");
        areaId = $(areaElement).data("areaid");
        if (sourceAreaId !== areaId) {
          card = {};
          card.ID = cardId;
          card.AreaID = areaId;
          card.Name = $(cardElement).find("a").text();
          $.ajax({
            url: self.rootUrl + "api/cards/" + card.ID,
            type: "PUT",
            data: card
          }).done(function() {
            var target;
            target = areaElement.find("#cards");
            cardElement.removeClass('card-aged');
            target.append(cardElement);
          }).fail(function() {
            self.showError("Santa can't figured out what happened, can you try it again?");
          });
        }
      }).on("dragstart", "article", function(event) {
        var areaId, cardId;
        areaId = $(event.target).closest("#areas article").data("areaid");
        cardId = $(event.target).closest("li").data("cardid");
        event.originalEvent.dataTransfer.setData("AreaID", areaId);
        event.originalEvent.dataTransfer.setData("CardID", cardId);
      }).on("click", "article footer a", function(event) {
        var currentArea;
        event.preventDefault();
        currentArea = $(this).parent().find("div");
        if (!currentArea.is(":visible")) {
          currentArea.fadeToggle();
          currentArea.find("textarea").focus();
        }
      }).on("keypress", "textarea", function(event) {
        if (event.which === 13) {
          return false;
        }
        return true;
      }).on("keyup", "textarea", function(event) {
        if (event.which === 13) {
          event.preventDefault();
          $(this).closest("#areas article").find("button").click();
        }
      }).on("focusout", "textarea", function(event) {
        $(this).closest("article").find("div").fadeOut();
      });
      $("#new-area input[type=text]").on("keyup", function(event) {
        event.preventDefault();
        if (event.which === 13) {
          $("#new-area button").click();
        }
      });
      $(window).resize(function(event) {
        self.resize();
      });
      $("#error-modal").live("click", function(event) {
        $(this).fadeOut();
      });
      $("body").on({
        ajaxStart: function() {
          $("#error-modal").hide();
          $(this).addClass("loading");
        },
        ajaxStop: function() {
          $(this).removeClass("loading");
        }
      });
    };
    self.refresh = function() {
      $.getJSON(self.rootUrl + "api/areas").done(function(data) {
        self.areas(data);
        self.resize();
        self.colorize();
      }).fail(function() {
        self.showError("Santa can't figured out what happened, can you try it again?");
      });
    };
    self.showError = function(message) {
      $("#error-modal").show();
      $("#error-modal span").text(message);
    };
    self.addCard = function() {
      var areaId, card, name;
      areaId = this.ID;
      name = $("*[data-areaid=" + areaId + "]").find("textarea").val();
      card = {};
      card.AreaID = areaId;
      card.Name = name;
      $.post(self.rootUrl + "api/cards", card).done(function() {
        self.refresh();
      }).fail(function() {
        self.showError("Santa can't figured out what happened, can you try it again?");
      });
    };
    self.addArea = function() {
      var area;
      area = {};
      area.Name = self.newArea();
      $.post(self.rootUrl + "api/areas", area).done(function() {
        self.refresh();
      }).fail(function() {
        self.showError("Santa can't figured out what happened, can you try it again?");
      });
      $("#new-area").fadeToggle();
      self.newArea("");
    };
    self.showArea = function() {
      $("#new-area").fadeToggle();
      $("#new-area input[type=text]").focus();
    };
    self.onReady = function() {
      ko.applyBindings(self);
      self.initControls();
      self.refresh();
    };
    return self;
  };
  cards.createObject("AreasViewModel");
})(window.cards, window, jQuery, ko);
