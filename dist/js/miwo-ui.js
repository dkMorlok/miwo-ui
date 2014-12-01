(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var BehaviorManager, CheckSelector, DialogFactory, FormRendererFactory, HorizontalRenderer, InlineRenderer, MiwoUiExtension, Notificator, PickerManager, PopoverBehavior, PopoverManager, RowSelector, SelectorFactory, TabsBehavior, TooltipBehavior, TooltipManager, WindowManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DialogFactory = require('./window/DialogFactory');

WindowManager = require('./window/WindowManager');

FormRendererFactory = require('./form/render/FormRendererFactory');

HorizontalRenderer = require('./form/render/HorizontalRenderer');

InlineRenderer = require('./form/render/InlineRenderer');

TooltipManager = require('./tip/TooltipManager');

PopoverManager = require('./tip/PopoverManager');

BehaviorManager = require('./behaviors/BehaviorManager');

TooltipBehavior = require('./behaviors/Tooltip');

PopoverBehavior = require('./behaviors/Popover');

TabsBehavior = require('./behaviors/Tabs');

SelectorFactory = require('./selection/SelectorFactory');

CheckSelector = require('./selection/CheckSelector');

RowSelector = require('./selection/RowSelector');

Notificator = require('./notify/Notificator');

PickerManager = require('./picker/Manager');

MiwoUiExtension = (function(_super) {
  __extends(MiwoUiExtension, _super);

  function MiwoUiExtension() {
    return MiwoUiExtension.__super__.constructor.apply(this, arguments);
  }

  MiwoUiExtension.prototype.init = function() {
    this.setConfig({
      behaviors: {
        tooltip: TooltipBehavior,
        popover: PopoverBehavior,
        tabs: TabsBehavior
      },
      selectors: {
        row: RowSelector,
        check: CheckSelector
      }
    });
  };

  MiwoUiExtension.prototype.build = function(injector) {
    injector.define('dialogFactory', DialogFactory).setGlobal('dialog');
    injector.define('windowMgr', WindowManager).setGlobal();
    injector.define('formRendererFactory', FormRendererFactory, (function(_this) {
      return function(service) {
        service.register('horizontal', HorizontalRenderer);
        service.register('inline', InlineRenderer);
      };
    })(this));
    injector.define('tooltip', TooltipManager).setGlobal();
    injector.define('popover', PopoverManager).setGlobal();
    injector.define('behavior', BehaviorManager).setGlobal().setup((function(_this) {
      return function(service) {
        var name, value, _ref;
        _ref = _this.config.behaviors;
        for (name in _ref) {
          value = _ref[name];
          if (Type.isFunction(value)) {
            service.install(name, injector.createInstance(value));
          } else {
            throw new Error("Behavior must be function (constructor).");
          }
        }
      };
    })(this));
    injector.define('selectorFactory', SelectorFactory, (function(_this) {
      return function(service) {
        var klass, name, _ref;
        _ref = _this.config.selectors;
        for (name in _ref) {
          klass = _ref[name];
          service.register(name, klass);
        }
      };
    })(this));
    injector.define('notificator', Notificator).setGlobal();
    injector.define('pickers', PickerManager).setGlobal();
  };

  MiwoUiExtension.prototype.update = function(injector) {
    injector.update('componentMgr').setup((function(_this) {
      return function(service) {
        var behavior;
        behavior = injector.get('behavior');
        service.on('afterrender', function(component) {
          behavior.apply(component.el);
        });
      };
    })(this));
    injector.update('translator').setup((function(_this) {
      return function(service) {
        service.setTranslates('en', 'miwo', require('./translates'));
      };
    })(this));
  };

  return MiwoUiExtension;

})(Miwo.InjectorExtension);

module.exports = MiwoUiExtension;


},{"./behaviors/BehaviorManager":2,"./behaviors/Popover":3,"./behaviors/Tabs":4,"./behaviors/Tooltip":5,"./form/render/FormRendererFactory":38,"./form/render/HorizontalRenderer":39,"./form/render/InlineRenderer":40,"./notify/Notificator":71,"./picker/Manager":75,"./selection/CheckSelector":80,"./selection/RowSelector":81,"./selection/SelectorFactory":83,"./tip/PopoverManager":91,"./tip/TooltipManager":93,"./translates":95,"./window/DialogFactory":102,"./window/WindowManager":105}],2:[function(require,module,exports){
var BehaviorManager;

BehaviorManager = (function() {
  BehaviorManager.prototype.behaviors = null;

  function BehaviorManager() {
    this.behaviors = {};
  }

  BehaviorManager.prototype.install = function(name, plugin) {
    this.behaviors[name] = plugin;
    this[name] = plugin;
    miwo.ready((function(_this) {
      return function() {
        return plugin.init(miwo.body);
      };
    })(this));
  };

  BehaviorManager.prototype.get = function(name) {
    return this.behaviors[name];
  };

  BehaviorManager.prototype.apply = function(element) {};

  return BehaviorManager;

})();

module.exports = BehaviorManager;


},{}],3:[function(require,module,exports){
var Popover,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Popover = (function(_super) {
  __extends(Popover, _super);

  function Popover() {
    return Popover.__super__.constructor.apply(this, arguments);
  }

  Popover.prototype.selector = '[data-toggle="popover"]';

  Popover.prototype.popover = Popover.inject('popover');

  Popover.prototype.init = function(body) {
    body.on("mouseenter:relay(" + this.selector + ")", (function(_this) {
      return function(e, target) {
        _this.popover.show(target);
      };
    })(this));
  };

  Popover.prototype.apply = function(element) {};

  return Popover;

})(Miwo.Object);

module.exports = Popover;


},{}],4:[function(require,module,exports){
var Tabs,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tabs = (function(_super) {
  __extends(Tabs, _super);

  function Tabs() {
    return Tabs.__super__.constructor.apply(this, arguments);
  }

  Tabs.prototype.selector = '[data-toggle="tab"]';

  Tabs.prototype.init = function(body) {};

  Tabs.prototype.apply = function(element) {};

  return Tabs;

})(Miwo.Object);

module.exports = Tabs;


},{}],5:[function(require,module,exports){
var Tooltip,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tooltip = (function(_super) {
  __extends(Tooltip, _super);

  function Tooltip() {
    return Tooltip.__super__.constructor.apply(this, arguments);
  }

  Tooltip.prototype.selector = '[data-toggle="tooltip"]';

  Tooltip.prototype.tooltip = Tooltip.inject('tooltip');

  Tooltip.prototype.init = function(body) {
    body.on("mouseenter:relay(" + this.selector + ")", (function(_this) {
      return function(e, target) {
        _this.tooltip.show(target);
      };
    })(this));
  };

  Tooltip.prototype.apply = function(element) {};

  return Tooltip;

})(Miwo.Object);

module.exports = Tooltip;


},{}],6:[function(require,module,exports){
var Button,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = (function(_super) {
  __extends(Button, _super);

  Button.defaultIconClsPrefix = 'glyphicon-';

  Button.defaultIconClsBase = 'glyphicon';

  Button.prototype.isButton = true;

  Button.prototype.xtype = "button";

  Button.prototype.handler = null;

  Button.prototype.text = "";

  Button.prototype.size = "";

  Button.prototype.type = "default";

  Button.prototype.disabled = false;

  Button.prototype.active = false;

  Button.prototype.toggled = false;

  Button.prototype.toggleHandler = null;

  Button.prototype.tooltip = null;

  Button.prototype.icon = null;

  Button.prototype.textEl = null;

  Button.prototype.iconEl = null;

  function Button(config) {
    this.el = "button";
    this.baseCls = "btn";
    Button.__super__.constructor.call(this, config);
  }

  Button.prototype.setDisabled = function(disabled, silent) {
    this.el.toggleClass('disabled', disabled);
    this.disabled = disabled;
    if (!silent) {
      if (disabled) {
        this.emit('disabled', this);
      } else {
        this.emit('enabled', this);
      }
    }
  };

  Button.prototype.setText = function(text) {
    this.text = text;
    if (this.textEl) {
      this.textEl.set("html", " " + this.renderText() + " ");
    }
  };

  Button.prototype.setIcon = function(cls, silent) {
    if (this.iconEl) {
      if (this.icon) {
        this.iconEl.removeClass(Button.defaultIconClsPrefix + this.icon);
      }
    }
    this.icon = cls;
    if (this.iconEl) {
      if (cls) {
        this.iconEl.addClass(Button.defaultIconClsPrefix + cls);
        this.iconEl.show("inline-block");
      } else {
        this.iconEl.hide();
      }
    }
  };

  Button.prototype.setSize = function(size) {
    if (this.size) {
      this.el.removeClass(this.getBaseCls(this.size));
    }
    if (size) {
      this.el.addClass(this.getBaseCls(size));
    }
    this.size = size;
  };

  Button.prototype.setActive = function(active, silent) {
    this.el.toggleClass('active', active);
    this.active = active;
    if (!silent && active) {
      this.emit('active', this, active);
    }
  };

  Button.prototype.isActive = function() {
    return this.active && !this.disabled;
  };

  Button.prototype.setToggled = function(toggled) {
    this.toggled = toggled;
  };

  Button.prototype.toggle = function(silent) {
    this.setActive(!this.active);
    if (!silent) {
      this.emit('toggle', this, this.active);
      if (this.toggleHandler) {
        this.toggleHandler(this, this.active);
      }
    }
  };

  Button.prototype.click = function(e) {
    if (Type.isFunction(this.handler)) {
      this.handler(this, e);
    } else if (Type.isString(this.handler)) {
      if (this.handler.indexOf('#') === 0) {
        document.location.hash = this.handler;
      } else {
        document.location = this.handler;
      }
    }
  };

  Button.prototype.renderText = function() {
    if (this.icon) {
      return ' ' + this.text;
    } else {
      return this.text;
    }
  };

  Button.prototype.doRender = function() {
    if (this.type) {
      this.el.addClass(this.getBaseCls(this.type));
    }
    if (this.size) {
      this.el.addClass(this.getBaseCls(this.size));
    }
    if (this.active) {
      this.el.addClass('active');
    }
    if (this.disabled) {
      this.el.addClass('disabled');
    }
    if (this.tooltip) {
      this.el.set("title", this.tooltip);
    }
    this.el.on("click", this.bound("onClick"));
    this.iconEl = new Element("i", {
      parent: this.el,
      cls: Button.defaultIconClsBase
    });
    this.textEl = new Element("span", {
      parent: this.el,
      html: this.renderText()
    });
    this.iconEl.addClass(Button.defaultIconClsPrefix + this.icon);
    if (!this.icon) {
      this.iconEl.hide();
    }
  };

  Button.prototype.onClick = function(e) {
    e.stop();
    if (this.disabled) {
      return;
    }
    this.preventClick = false;
    this.emit('beforeclick', this, e);
    if (this.preventClick) {
      return;
    }
    if (this.toggled) {
      this.toggle();
    }
    this.emit('click', this, e);
    this.click(e);
  };

  return Button;

})(Miwo.Component);

module.exports = Button;


},{}],7:[function(require,module,exports){
var Button, ButtonGroup, DropdownButton,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./Button');

DropdownButton = require('./DropdownButton');

ButtonGroup = (function(_super) {
  __extends(ButtonGroup, _super);

  function ButtonGroup() {
    return ButtonGroup.__super__.constructor.apply(this, arguments);
  }

  ButtonGroup.prototype.xtype = "buttongroup";

  ButtonGroup.prototype.toggle = null;

  ButtonGroup.prototype.size = null;

  ButtonGroup.prototype.label = null;

  ButtonGroup.prototype.beforeInit = function() {
    ButtonGroup.__super__.beforeInit.call(this);
    this.layout = "auto";
    this.baseCls = "btn-group";
  };

  ButtonGroup.prototype.validateChildComponent = function(component) {
    if (!component.isButton) {
      throw new Error("Child component must by instance of Miwo.button.Button");
    }
  };

  ButtonGroup.prototype.addedComponent = function(component) {
    component.setToggled(!!this.toggle);
    this.mon(component, "active", "onButtonActive");
  };

  ButtonGroup.prototype.removedComponent = function(component) {
    this.mun(component);
  };

  ButtonGroup.prototype.onButtonActive = function(btn) {
    if (this.toggle === "radio") {
      this.getActiveButtons().each(function(pbtn) {
        if (pbtn !== btn) {
          pbtn.setActive(false, true);
        }
      });
    }
    this.emit('active', this, btn);
  };

  ButtonGroup.prototype.setDisabled = function(disabled, silent) {
    this.getComponents().each(function(component) {
      component.setDisabled(disabled, silent);
    });
  };

  ButtonGroup.prototype.setActive = function(name, active, silent) {
    this.get(name).setActive(active, silent);
  };

  ButtonGroup.prototype.setActiveAll = function(active) {
    this.getComponents().each(function(component) {
      component.setActive(active, true);
    });
  };

  ButtonGroup.prototype.getActiveButtons = function() {
    var active;
    active = [];
    this.getComponents().each(function(component) {
      if (component.isActive()) {
        active.push(component);
      }
    });
    return active;
  };

  ButtonGroup.prototype.getActiveButton = function() {
    var active;
    active = null;
    this.getComponents().each(function(component) {
      if (component.isActive()) {
        active = component;
        return false;
      }
    });
    return active;
  };

  ButtonGroup.prototype.addButton = function(name, config) {
    return this.add(name, new Button(config));
  };

  ButtonGroup.prototype.addDropdownButton = function(name, config) {
    return this.add(name, new DropdownButton(config));
  };

  ButtonGroup.prototype.afterRender = function() {
    ButtonGroup.__super__.afterRender.apply(this, arguments);
    this.el.set('role', 'group');
    if (this.label) {
      this.el.set('aria-label', this.label);
    }
    if (this.size) {
      this.el.addClass('btn-group-' + this.size);
    }
  };

  return ButtonGroup;

})(Miwo.Container);

module.exports = ButtonGroup;


},{"./Button":6,"./DropdownButton":8}],8:[function(require,module,exports){
var Button, DropdownButton, DropdownList,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./Button');

DropdownList = require('../dropdown/List');

DropdownButton = (function(_super) {
  __extends(DropdownButton, _super);

  function DropdownButton() {
    return DropdownButton.__super__.constructor.apply(this, arguments);
  }

  DropdownButton.prototype.dropdown = null;

  DropdownButton.prototype.afterInit = function() {
    DropdownButton.__super__.afterInit.apply(this, arguments);
    document.on('click', this.bound('onBodyClick'));
  };

  DropdownButton.prototype.afterRender = function() {
    DropdownButton.__super__.afterRender.apply(this, arguments);
    this.el.set('aria-haspopup', true);
    this.el.set('aria-expanded', false);
  };

  DropdownButton.prototype.getDropdown = function() {
    if (!this.dropdown) {
      this.dropdown = new DropdownList({
        target: this.el
      });
      this.dropdown.el.set('aria-labelledby', this.id);
      this.dropdown.on('show', (function(_this) {
        return function(dropdown) {
          return DropdownButton.dropdown = dropdown;
        };
      })(this));
      this.dropdown.on('hide', (function(_this) {
        return function(dropdown) {
          return DropdownButton.dropdown = null;
        };
      })(this));
    }
    return this.dropdown;
  };

  DropdownButton.prototype.addItem = function(name, text, handler) {
    return this.getDropdown().addItem(name, {
      text: text,
      handler: handler
    });
  };

  DropdownButton.prototype.addDivider = function() {
    return this.getDropdown().addDivider();
  };

  DropdownButton.prototype.renderText = function() {
    var text;
    text = DropdownButton.__super__.renderText.call(this);
    if (text) {
      text += ' ';
    }
    text += '<span class="caret"></span>';
    return text;
  };

  DropdownButton.prototype.click = function(e) {
    if (DropdownButton.dropdown && DropdownButton.dropdown !== this.dropdown) {
      DropdownButton.dropdown.hide();
    }
    this.getDropdown().toggle();
  };

  DropdownButton.prototype.onBodyClick = function(e) {
    var dropdown;
    if (this.dropdown) {
      dropdown = e.target.getParent('#' + this.dropdown.id);
      if (!dropdown) {
        this.dropdown.hide();
      }
    }
  };

  DropdownButton.prototype.doDestroy = function() {
    if (this.dropdown) {
      this.dropdown.destroy();
    }
    document.un('click', this.bound('onBodyClick'));
    return DropdownButton.__super__.doDestroy.call(this);
  };

  return DropdownButton;

})(Button);

module.exports = DropdownButton;


},{"../dropdown/List":13,"./Button":6}],9:[function(require,module,exports){
var Button, ToolButton,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('./Button');

ToolButton = (function(_super) {
  __extends(ToolButton, _super);

  function ToolButton() {
    return ToolButton.__super__.constructor.apply(this, arguments);
  }

  ToolButton.prototype.isTool = true;

  ToolButton.prototype.xtype = "toolbutton";

  ToolButton.prototype.handler = null;

  ToolButton.prototype.icon = null;

  ToolButton.prototype.text = "";

  ToolButton.prototype.tooltip = null;

  ToolButton.prototype.el = 'button';

  ToolButton.prototype.textEl = null;

  ToolButton.prototype.iconEl = null;

  ToolButton.prototype.setDisabled = function(disabled, silent) {
    this.el.toggleClass('disabled', disabled);
    this.disabled = disabled;
    if (!silent) {
      if (disabled) {
        this.emit('disabled', this);
      } else {
        this.emit('enabled', this);
      }
    }
  };

  ToolButton.prototype.setText = function(text) {
    this.text = text;
    if (this.textEl) {
      this.textEl.set("html", text);
    }
  };

  ToolButton.prototype.setIcon = function(cls, silent) {
    if (this.iconEl) {
      if (this.icon) {
        this.iconEl.removeClass(Button.defaultIconClsPrefix + this.icon);
      }
    }
    this.icon = cls;
    if (this.iconEl) {
      if (cls) {
        this.iconEl.addClass(Button.defaultIconClsPrefix + cls);
        this.iconEl.show("inline-block");
      } else {
        this.iconEl.hide();
      }
    }
  };

  ToolButton.prototype.click = function(e) {
    if (this.handler) {
      this.handler(this, e);
    }
  };

  ToolButton.prototype.doRender = function() {
    this.el.addClass('btn-tool');
    if (this.disabled) {
      this.el.addClass('disabled');
    }
    if (this.tooltip) {
      this.el.set("title", this.tooltip);
    }
    this.el.on("click", this.bound("onClick"));
    this.iconEl = new Element("i", {
      parent: this.el,
      cls: Button.defaultIconClsBase + ' ' + Button.defaultIconClsPrefix + this.icon
    });
    this.textEl = new Element("span", {
      parent: this.el,
      cls: 'sr-only',
      html: this.text
    });
  };

  ToolButton.prototype.onClick = function(e) {
    e.stop();
    if (this.disabled) {
      return;
    }
    this.preventClick = false;
    this.emit('beforeclick', this, e);
    if (this.preventClick) {
      return;
    }
    this.emit('click', this, e);
    this.click(e);
  };

  return ToolButton;

})(Miwo.Component);

module.exports = ToolButton;


},{"./Button":6}],10:[function(require,module,exports){
module.exports = {
  ButtonGroup: require('./ButtonGroup'),
  Button: require('./Button'),
  ToolButton: require('./ToolButton'),
  DropdownButton: require('./DropdownButton')
};


},{"./Button":6,"./ButtonGroup":7,"./DropdownButton":8,"./ToolButton":9}],11:[function(require,module,exports){
var DropdownDivider,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DropdownDivider = (function(_super) {
  __extends(DropdownDivider, _super);

  function DropdownDivider() {
    return DropdownDivider.__super__.constructor.apply(this, arguments);
  }

  DropdownDivider.prototype.xtype = "dropdowndivider";

  DropdownDivider.prototype.el = 'li';

  DropdownDivider.prototype.baseCls = 'dropdown-divider';

  DropdownDivider.prototype.componentCls = 'divider';

  return DropdownDivider;

})(Miwo.Component);

module.exports = DropdownDivider;


},{}],12:[function(require,module,exports){
var DropdownItem,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DropdownItem = (function(_super) {
  __extends(DropdownItem, _super);

  function DropdownItem() {
    return DropdownItem.__super__.constructor.apply(this, arguments);
  }

  DropdownItem.prototype.xtype = "dropdownitem";

  DropdownItem.prototype.el = 'li';

  DropdownItem.prototype.baseCls = 'dropdown-menuitem';

  DropdownItem.prototype.text = "";

  DropdownItem.prototype.disabled = false;

  DropdownItem.prototype.handler = null;

  DropdownItem.prototype.linkEl = null;

  DropdownItem.prototype.setText = function(text) {
    this.text = text;
    if (this.linkEl) {
      this.linkEl.set("html", text);
    }
  };

  DropdownItem.prototype.setHandler = function(handler) {
    this.handler = handler;
  };

  DropdownItem.prototype.doRender = function() {
    this.el.set('role', 'presentation');
    this.linkEl = new Element("a", {
      href: '#click',
      role: 'menuitem',
      html: this.text,
      parent: this.el
    });
    this.mon(this.linkEl, 'click', 'onClick');
  };

  DropdownItem.prototype.onClick = function(e) {
    e.stop();
    if (this.disabled) {
      return;
    }
    this.container.hide();
    this.emit('click', this, e);
    this.click(e);
  };

  DropdownItem.prototype.click = function(e) {
    if (Type.isFunction(this.handler)) {
      this.handler(this, e);
    } else if (Type.isString(this.handler)) {
      if (this.handler.indexOf('#') === 0) {
        document.location.hash = this.handler;
      } else {
        document.location = this.handler;
      }
    }
  };

  return DropdownItem;

})(Miwo.Component);

module.exports = DropdownItem;


},{}],13:[function(require,module,exports){
var Divider, DropdownList, Item,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Item = require('./Item');

Divider = require('./Divider');

DropdownList = (function(_super) {
  __extends(DropdownList, _super);

  function DropdownList() {
    return DropdownList.__super__.constructor.apply(this, arguments);
  }

  DropdownList.prototype.xtype = "dropdownlist";

  DropdownList.prototype.el = "ul";

  DropdownList.prototype.baseCls = "dropdown-menu";

  DropdownList.prototype.target = null;

  DropdownList.prototype.visible = false;

  DropdownList.prototype.afterInit = function() {
    DropdownList.__super__.afterInit.apply(this, arguments);
    this.renderTo = miwo.body;
  };

  DropdownList.prototype.addItem = function(name, config) {
    return this.add(name, new Item(config));
  };

  DropdownList.prototype.addDivider = function() {
    return this.add(new Divider());
  };

  DropdownList.prototype.show = function() {
    var pos;
    DropdownList.__super__.show.call(this);
    pos = this.target.getPosition();
    pos.y += this.target.getSize().y - 3;
    this.setPosition(pos);
  };

  DropdownList.prototype.toggle = function() {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  };

  DropdownList.prototype.doHide = function() {
    DropdownList.__super__.doHide.call(this);
    this.resetRendered(true);
  };

  DropdownList.prototype.afterRender = function() {
    DropdownList.__super__.afterRender.apply(this, arguments);
    this.el.set('role', 'menu');
  };

  return DropdownList;

})(Miwo.Container);

module.exports = DropdownList;


},{"./Divider":11,"./Item":12}],14:[function(require,module,exports){
module.exports = {
  Divider: require('./Divider'),
  Item: require('./Item'),
  List: require('./List')
};


},{"./Divider":11,"./Item":12,"./List":13}],15:[function(require,module,exports){
var Condition, Rule, Rules, Validators,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Validators = require('./Validators');

Rule = (function() {
  Rule.prototype.isRule = true;

  Rule.prototype.rules = null;

  Rule.prototype.control = null;

  Rule.prototype.name = null;

  Rule.prototype.operation = null;

  Rule.prototype.isNegative = false;

  Rule.prototype.param = null;

  Rule.prototype.message = null;

  function Rule(rules, config) {
    var n, v;
    this.rules = rules;
    if (config == null) {
      config = {};
    }
    this.control = this.rules.control;
    for (n in config) {
      v = config[n];
      this[n] = v;
    }
    if (!this.message) {
      if (Type.isString(this.operation)) {
        this.message = miwo.tr("miwo.rules." + this.operation) || "Error";
      } else {
        this.message = "";
      }
    }
    if (Type.isString(this.operation)) {
      if (this.operation[0] === "!") {
        this.isNegative = true;
        this.operation = this.operation.replace("!", "");
      }
      this.name = this.operation;
      if (!Validators[this.operation]) {
        throw new Error("Undefined validator '" + this.operation + "' for control '" + this.control.name + "'");
      }
      this.operation = (function(_this) {
        return function(control, param) {
          return Validators[_this.name](control, param);
        };
      })(this);
    } else {
      this.name = "callback";
    }
    if (!Type.isFucntion(this.operation)) {
      throw new Error("Unknown operation '" + this.operation + "' for control '" + this.control.name + "'");
    }
    return;
  }

  Rule.prototype.validate = function() {
    var result;
    if (!this.control.required && !this.control.isFilled()) {
      return true;
    }
    result = this.operation(this.control, this.param);
    return (this.isNegative ? !result : result);
  };

  Rule.prototype.getControl = function() {
    return this.control;
  };

  return Rule;

})();

Condition = (function(_super) {
  __extends(Condition, _super);

  Condition.prototype.isCondition = true;

  Condition.prototype.subRules = null;

  function Condition(rules, config) {
    Condition.__super__.constructor.call(this, rules, config);
    this.subRules = new Rules(this.control, rules);
    return;
  }

  return Condition;

})(Rule);

Rules = (function() {
  Rules.formatMessage = function(rule) {
    var message;
    message = rule.message;
    message = message.replace("%name", rule.control.getName());
    message = message.replace("%label", rule.control.label);
    message = message.replace("%value", rule.control.getValue());
    return message;
  };

  Rules.prototype.parent = null;

  Rules.prototype.control = null;

  Rules.prototype.rules = null;

  Rules.prototype.condition = null;

  function Rules(control, parent) {
    this.parent = parent;
    this.control = control;
    this.rules = [];
  }

  Rules.prototype.setRules = function(rules) {
    this.rules = [];
    this.addRules(rules);
  };

  Rules.prototype.addRules = function(rules) {
    var elseRules, rule, subRules, _i, _len;
    for (_i = 0, _len = rules.length; _i < _len; _i++) {
      rule = rules[_i];
      if (rule.type === "condition") {
        subRules = this.addConditionOn(rule.conditionOn || this, rule.operation, rule.param);
        if (rule.rules) {
          subRules.setRules(rule.rules);
        }
        if (rule.elseRules) {
          elseRules = this.elseCondition();
          elseRules.setRules(rule.elseRules);
        }
      } else {
        this.addRule(rule.operation, rule.message, rule.param);
      }
    }
  };

  Rules.prototype.addRule = function(operation, message, param) {
    var rule;
    rule = new Rule(this, {
      operation: operation,
      message: message,
      param: param
    });
    this.rules.push(rule);
    return this;
  };

  Rules.prototype.hasRule = function(name) {
    return !!this.rules.some(function(rule) {
      return rule.name === name;
    });
  };

  Rules.prototype.addCondition = function(operation, param) {
    return this.addConditionOn(this.control, operation, param);
  };

  Rules.prototype.addConditionOn = function(control, operation, param) {
    var rule;
    rule = new Condition(this, {
      operation: operation,
      param: param
    });
    this.condition = rule;
    this.rules.push(rule);
    return rule.subRules;
  };

  Rules.prototype.elseCondition = function() {
    var rule;
    rule = new Condition(this, {
      operation: this.condition.operation,
      isNegative: !this.condition.isNegative,
      param: this.condition.param
    });
    this.rules.push(rule);
    return rule.subRules;
  };

  Rules.prototype.endCondition = function() {
    return this.parent;
  };

  Rules.prototype.validate = function(onlyCheck) {
    var rule, success, _i, _len, _ref;
    _ref = this.rules;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rule = _ref[_i];
      if (rule.getControl().isDisabled()) {
        continue;
      }
      success = rule.validate();
      if (rule.isCondition && success) {
        if (!rule.subRules.validate(onlyCheck)) {
          return false;
        }
      } else if (rule.isRule && !success) {
        if (!onlyCheck) {
          return rule.getControl().addError(Rules.formatMessage(rule));
        }
        return false;
      }
    }
    return true;
  };

  return Rules;

})();

module.exports = Rules;


},{"./Validators":16}],16:[function(require,module,exports){
var Validators;

Validators = {
  mailRe: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  urlRe: /^(ftp|http|https)?:\/\/[A-Za-z0-9\.-]{1,}\.[A-Za-z]{2}/,
  intRe: /^\d+$/,
  colorRe: /^\#[a-z0-9A-Z]{6}/,
  dateRe: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
  numberRe: /^-{0,1}\d*\.{0,1}\d+$/,
  registerValidator: function(name, validator) {
    this[name] = validator;
  },
  equal: function(control, arg) {
    if (Type.isString(arg)) {
      arg = control.getForm().getField(arg);
    }
    return control.getStringValue() === arg.getStringValue();
  },
  filled: function(control) {
    return control.isFilled();
  },
  valid: function(control) {
    return control.rules.validate(true);
  },
  minLength: function(control, length) {
    return reutrn(control.getStringValue().length >= length);
  },
  maxLength: function(control, length) {
    return control.getStringValue().length <= length;
  },
  length: function(control, range) {
    var len;
    if (!Type.isArray(range)) {
      range = [range, range];
    }
    len = control.getStringValue().length;
    return len >= range[0] && len <= range[1];
  },
  date: function(control) {
    return this.dateRe.test(control.getStringValue());
  },
  email: function(control) {
    return this.mailRe.test(control.getStringValue());
  },
  url: function(control) {
    return this.urlRe.test(control.getStringValue());
  },
  pattern: function(control, pattern) {
    return pattern.test(control.getStringValue());
  },
  number: function(control) {
    return this.numberRe.test(control.getStringValue());
  },
  integer: function(control) {
    return this.intRe.test(control.getStringValue());
  },
  float: function(control) {
    return this.numberRe.test(control.getStringValue());
  },
  range: function(control, range) {
    if (!Type.isArray(range)) {
      range = [range, range];
    }
    return control.getValue() >= range[0] && control.getValue() <= range[1];
  },
  min: function(control, length) {
    return control.getValue() >= length;
  },
  max: function(control, length) {
    return control.getValue() <= length;
  },
  color: function(control) {
    return this.colorRe.test(control.getStringValue());
  }
};

module.exports = Validators;


},{}],17:[function(require,module,exports){
var BaseContainer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseContainer = (function(_super) {
  __extends(BaseContainer, _super);

  function BaseContainer() {
    return BaseContainer.__super__.constructor.apply(this, arguments);
  }

  BaseContainer.prototype.form = null;

  BaseContainer.prototype.autoShowErrorTip = true;

  BaseContainer.prototype.isFormContainer = true;

  BaseContainer.prototype.disabled = false;

  BaseContainer.prototype.wasDirty = false;

  BaseContainer.prototype.wasValid = true;

  BaseContainer.prototype.controls = null;

  BaseContainer.registerControl = function(controlName, fn) {
    var addMethod;
    if (!fn) {
      throw new Error("Error in registry control " + controlName + ", constructor is undefined");
    }
    addMethod = 'add' + controlName.capitalize();
    this.prototype[addMethod] = function(name, config) {
      if (config == null) {
        config = {};
      }
      return this.add(name, new fn(config));
    };
  };

  BaseContainer.prototype.beforeInit = function() {
    BaseContainer.__super__.beforeInit.apply(this, arguments);
    this.layout = 'form';
  };

  BaseContainer.prototype.afterInit = function() {
    BaseContainer.__super__.afterInit.apply(this, arguments);
    this.controls = [];
    this.updateValidationBoundItems(this.isValid(true));
  };

  BaseContainer.prototype.addedComponent = function(component) {
    BaseContainer.__super__.addedComponent.call(this, component);
    if (component.isFormControl) {
      component.form = this.form;
      this.controls.push(component);
      this.mon(component, 'validitychange', 'checkValidity');
      this.mon(component, 'dirtychange', 'checkDirty');
      this.mon(component, 'focus', 'onInputFieldFocus');
    } else if (component.isFormContainer) {
      component.form = this.form;
      this.mon(component, 'inputfocus', 'onInputFieldFocus');
    }
    if (this.disabled) {
      component.setDisabled(this.disabled);
    }
  };

  BaseContainer.prototype.removedComponent = function(component) {
    BaseContainer.__super__.removedComponent.call(this, component);
    if (component.isFormControl) {
      component.form = null;
      this.controls.erase(component);
      this.mun(component);
    } else if (component.isFormContainer) {
      component.form = null;
      this.mun(component);
    }
  };

  BaseContainer.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    this.getComponents().each(function(component) {
      component.setDisabled(disabled);
    });
  };

  BaseContainer.prototype.getControls = function() {
    return this.controls;
  };

  BaseContainer.prototype.getControl = function(name) {
    var control, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (control.getName() === name) {
        return control;
      }
    }
    throw new Error("Control " + name + " not found");
  };

  BaseContainer.prototype.getFocusControl = function() {
    var control, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (!control.disabled) {
        return control;
      }
    }
    return null;
  };

  BaseContainer.prototype.onInputFieldFocus = function(form, input) {
    this.emit("inputfocus", this, input || form);
  };

  BaseContainer.prototype.getValidationBoundItems = function() {
    return this.findComponents(true, {
      validationBind: true
    });
  };

  BaseContainer.prototype.getValues = function(dirtyOnly, submitable) {
    var control, values, _i, _len, _ref;
    values = {};
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if ((!submitable || control.submitValue) && !control.disabled) {
        if (!dirtyOnly || control.isDirty()) {
          values[control.getName()] = control.getValue();
        }
      }
    }
    return values;
  };

  BaseContainer.prototype.getRawValues = function(dirtyOnly, submitable) {
    var control, values, _i, _len, _ref;
    values = {};
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if ((!submitable || control.submitValue) && !control.disabled) {
        if (!dirtyOnly || control.isDirty()) {
          values[control.getName()] = control.getRawValue();
        }
      }
    }
    return values;
  };

  BaseContainer.prototype.getErrors = function() {
    var control, error, errors, _i, _j, _len, _len1, _ref, _ref1;
    errors = [];
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _ref1 = control.getErrors();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        error = _ref1[_j];
        errors.include(error);
      }
    }
    return errors;
  };

  BaseContainer.prototype.setValues = function(values, erase, setOriginals) {
    var control, name, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      name = control.getName();
      if (values.hasOwnProperty(name)) {
        control.setValue(values[name]);
        if (setOriginals) {
          control.setOriginalValue(values[name]);
        }
      } else if (erase) {
        control.setValue(null);
        if (setOriginals) {
          control.setOriginalValue(null);
        }
      }
    }
  };

  BaseContainer.prototype.setOriginals = function(values, erase) {
    var control, name, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      name = control.getName();
      if (values.hasOwnProperty(name)) {
        control.setOriginalValue(values[name]);
      } else if (erase) {
        control.setOriginalValue(null);
      }
    }
  };

  BaseContainer.prototype.resetOriginals = function() {
    var control, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      control.resetOriginalValue();
    }
  };

  BaseContainer.prototype.setDefaults = function(values, onlyset) {
    var control, name, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      name = control.getName();
      if (values) {
        if (values.hasOwnProperty(name)) {
          control.setDefaultValue(values[name]);
        } else if (!onlyset) {
          control.setDefaultValue();
        }
      } else {
        control.setDefaultValue();
      }
    }
  };

  BaseContainer.prototype.reset = function(resetOriginalValues) {
    var control, _i, _len, _ref;
    if (resetOriginalValues) {
      this.setOriginals({}, true);
    }
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      control.reset();
    }
  };

  BaseContainer.prototype.isValid = function(onlyCheck) {
    var control, invalid, valid, _i, _len, _ref;
    valid = true;
    invalid = void 0;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (!onlyCheck) {
        control.notifyErrors = true;
      }
      if (!control.validate()) {
        valid = false;
        if (!invalid) {
          invalid = control;
        }
        if (onlyCheck && !valid) {
          break;
        }
      }
    }
    if (this.autoShowErrorTip && !onlyCheck && invalid) {
      if (invalid.errorTip) {
        invalid.errorTip.show();
      }
    }
    return valid;
  };

  BaseContainer.prototype.validate = function() {
    return this.isValid();
  };

  BaseContainer.prototype.checkValidity = function() {
    var valid;
    valid = this.isValid(true);
    if (valid !== this.wasValid) {
      this.updateValidationBoundItems(valid);
      this.emit("validitychange", this, valid);
      this.wasValid = valid;
    }
  };

  BaseContainer.prototype.updateValidationBoundItems = function(valid) {
    var control, _i, _len, _ref;
    _ref = this.getValidationBoundItems();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (control.disabled === valid) {
        control.setDisabled(!valid);
      }
    }
  };

  BaseContainer.prototype.checkDirty = function() {
    var dirty;
    dirty = this.isDirty();
    if (dirty !== this.wasDirty) {
      this.emit("dirtychange", this, dirty);
      this.wasDirty = dirty;
    }
  };


  /**
  	  Returns `true` if any controls in this form have changed from their original values.
  	  @return {Boolean}
   */

  BaseContainer.prototype.isDirty = function() {
    var control, _i, _len, _ref;
    _ref = this.controls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      if (control.isDirty()) {
        return true;
      }
    }
    return false;
  };

  return BaseContainer;

})(Miwo.Container);

module.exports = BaseContainer;


},{}],18:[function(require,module,exports){
var BaseContainer, Fieldset,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseContainer = require('./BaseContainer');

Fieldset = (function(_super) {
  __extends(Fieldset, _super);

  function Fieldset() {
    return Fieldset.__super__.constructor.apply(this, arguments);
  }

  Fieldset.prototype.legend = '';

  Fieldset.prototype.beforeInit = function() {
    Fieldset.__super__.beforeInit.apply(this, arguments);
    this.xtype = 'fieldset';
    this.element = 'fieldset';
  };

  Fieldset.prototype.beforeRender = function() {
    Fieldset.__super__.beforeRender.apply(this, arguments);
    this.legendEl = new Element('legend', {
      parent: this.el,
      html: this.legend
    });
    this.contentEl = new Element('div', {
      parent: this.el,
      cls: 'fieldset-content'
    });
  };

  return Fieldset;

})(BaseContainer);

BaseContainer.registerControl('fieldset', Fieldset);

module.exports = Fieldset;


},{"./BaseContainer":17}],19:[function(require,module,exports){
var BaseContainer, Form,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseContainer = require('./BaseContainer');

Form = (function(_super) {
  __extends(Form, _super);

  function Form() {
    return Form.__super__.constructor.apply(this, arguments);
  }

  Form.prototype.xtype = 'form';

  Form.prototype.buttonsEl = null;

  Form.prototype.record = null;

  Form.prototype.submitBtn = null;

  Form.prototype.renderer = null;

  Form.prototype.rendererType = 'horizontal';

  Form.prototype.rendererOptions = null;

  Form.prototype.beforeInit = function() {
    Form.__super__.beforeInit.apply(this, arguments);
    this.form = this;
    this.el = 'form';
  };

  Form.prototype.afterInit = function() {
    Form.__super__.afterInit.apply(this, arguments);
    this.keyListener = new Miwo.utils.KeyListener(this.el, 'keydown');
    this.keyListener.on('enter', (function(_this) {
      return function() {
        _this.submit();
        return true;
      };
    })(this));
  };

  Form.prototype.addedComponentDeep = function(component) {
    Form.__super__.addedComponentDeep.call(this, component);
    if (component.isFormControl || component.isFormContainer) {
      component.form = this.form;
    }
    if (component.isSubmitButton) {
      this.mon(component, 'click', 'onSubmitButtonClick');
    } else if (component.isResetButton) {
      this.mon(component, 'click', 'onResetButtonClick');
    }
  };

  Form.prototype.removedComponentDeep = function(component) {
    Form.__super__.removedComponentDeep.call(this, component);
    if (component.isFormControl || component.isFormContainer) {
      component.form = null;
    }
    if (component.isSubmitButton) {
      this.mun(component);
    } else if (component.isResetButton) {
      this.mun(component);
    }
  };

  Form.prototype.onSubmitButtonClick = function(btn) {
    this.submit(btn);
  };

  Form.prototype.onResetButtonClick = function(btn) {
    this.reset();
    this.emit('reset', this, btn);
  };

  Form.prototype.loadRecord = function(record) {
    var values;
    this.record = record;
    values = record.getValues();
    this.setOriginals(values);
    this.setValues(values);
    this.reset();
  };

  Form.prototype.unloadRecord = function() {
    this.record = null;
    this.setOriginals({}, true);
    this.setValues({});
    this.reset();
  };

  Form.prototype.updateRecord = function(record) {
    var name, values;
    record = record || this.record;
    if (!record) {
      throw new Error("Undefined record. First you must call 'loadRecord' or pass record in this method");
    }
    values = this.getValues(true, true);
    for (name in record.fields) {
      if (values.hasOwnProperty(name)) {
        record.set(name, values[name]);
      }
    }
    return record;
  };

  Form.prototype.editRecord = function(record) {
    record = record || this.record;
    if (!record) {
      throw new Error("Undefined record. First you must call 'loadRecord' or pass record in this method");
    }
    record.beginEdit();
    this.updateRecord(record);
    record.endEdit();
    return record;
  };

  Form.prototype.submit = function(btn) {
    var isValid;
    this.submitBtn = btn;
    isValid = this.validate();
    this.emit('submit', this, isValid);
    this.onSubmit();
    if (isValid) {
      this.emit('success', this);
      this.onSuccess();
    } else {
      this.emit('failure', this);
      this.onFailure();
    }
  };

  Form.prototype.onSuccess = function() {};

  Form.prototype.onFailure = function() {};

  Form.prototype.onSubmit = function() {};

  Form.prototype.renderContainer = function() {
    var buttons, contentEl, control, controls, el, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4;
    Form.__super__.renderContainer.apply(this, arguments);
    contentEl = this.getContentEl();
    this.getRenderer().renderForm(this);
    _ref = this.getElements("[miwo-label]");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      control = this.get(el.getAttribute("miwo-label"), true);
      control.labelEl = el;
      control.labelRendered = true;
    }
    _ref1 = this.getElements("[miwo-group]");
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      el = _ref1[_j];
      control = this.get(el.getAttribute("miwo-group"), true);
      control.groupEl = el;
      control.el = el;
      control.parentEl = contentEl;
    }
    _ref2 = this.getElements("[miwo-controls]");
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      el = _ref2[_k];
      control = this.get(el.getAttribute("miwo-controls"), true);
      control.controlsEl = el;
      control.labelRendered = true;
      this.detectControlGroupEl(control, el, contentEl);
    }
    _ref3 = this.getElements("[miwo-control]");
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      el = _ref3[_l];
      control = this.get(el.getAttribute("miwo-control"), true);
      control.controlEl = el;
      control.controlsRendered = true;
      this.detectControlGroupEl(control, el, contentEl);
    }
    _ref4 = this.getElements("[miwo-input]");
    for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
      el = _ref4[_m];
      control = this.get(el.getAttribute("miwo-input"), true);
      control.inputEl = el;
      control.controlsRendered = true;
      control.controlRendered = true;
      this.detectControlGroupEl(control, el, contentEl);
    }
    controls = this.findComponents(false, {
      isFormControl: true,
      isFormContainer: true
    });
    for (_n = 0, _len5 = controls.length; _n < _len5; _n++) {
      control = controls[_n];
      if (control.isFormControl) {
        this.getRenderer().renderGroup(control, contentEl);
        control.groupEl.set('miwo-name', control.name);
        control.afterRender();
        control.rendered = true;
      } else {
        control.render(contentEl);
      }
    }
    buttons = this.findComponents(false, {
      isButton: true
    });
    if (buttons.length > 0) {
      this.getRenderer().renderButtons(buttons, this.getButtonsEl());
    }
  };

  Form.prototype.detectControlGroupEl = function(control, el, contentEl) {
    var controlEl;
    if ((controlEl = el.getParent('.form-group'))) {
      control.el = controlEl;
      control.parentEl = contentEl;
      if (!control.groupEl) {
        control.groupEl = controlEl;
      }
    }
  };

  Form.prototype.getButtonsEl = function() {
    var ct;
    if (!this.buttonsEl) {
      ct = new Element('div', {
        parent: this.getContentEl(),
        cls: 'form-group'
      });
      this.buttonsEl = new Element('div', {
        parent: ct
      });
      this.buttonsEl.generated = true;
    }
    return this.buttonsEl;
  };

  Form.prototype.getRenderer = function() {
    if (!this.renderer) {
      this.renderer = miwo.service('formRendererFactory').create(this.rendererType, this.rendererOptions);
    }
    return this.renderer;
  };

  Form.prototype.doDestroy = function() {
    this.keyListener.destroy();
    return Form.__super__.doDestroy.apply(this, arguments);
  };

  return Form;

})(BaseContainer);

module.exports = Form;


},{"./BaseContainer":17}],20:[function(require,module,exports){
var BaseControl, Button, Rules,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('../../buttons/Button');

Rules = require('../Rules');

BaseControl = (function(_super) {
  __extends(BaseControl, _super);

  function BaseControl() {
    return BaseControl.__super__.constructor.apply(this, arguments);
  }

  BaseControl.prototype.isFormControl = true;

  BaseControl.prototype.label = null;

  BaseControl.prototype.value = null;

  BaseControl.prototype.defaultValue = void 0;

  BaseControl.prototype.required = false;

  BaseControl.prototype.prepend = null;

  BaseControl.prototype.append = null;

  BaseControl.prototype.tip = null;

  BaseControl.prototype.help = null;

  BaseControl.prototype.desc = null;

  BaseControl.prototype.inputTag = "input";

  BaseControl.prototype.inputName = null;

  BaseControl.prototype.inputCls = null;

  BaseControl.prototype.inputWidth = null;

  BaseControl.prototype.attributes = null;

  BaseControl.prototype.disabled = false;

  BaseControl.prototype.omitted = false;

  BaseControl.prototype.validateOnChange = true;

  BaseControl.prototype.buttons = null;

  BaseControl.prototype.rules = null;

  BaseControl.prototype.form = null;

  BaseControl.prototype.labelEl = null;

  BaseControl.prototype.labeltextEl = null;

  BaseControl.prototype.input = null;

  BaseControl.prototype.controlsEl = null;

  BaseControl.prototype.descEl = null;

  BaseControl.prototype.tipEl = null;

  BaseControl.prototype.helpEl = null;

  BaseControl.prototype.preventRenderControl = false;

  BaseControl.prototype.suspendCheckChange = true;

  BaseControl.prototype.originalValue = void 0;

  BaseControl.prototype.lastValue = void 0;

  BaseControl.prototype.errors = void 0;

  BaseControl.prototype.wasDirty = false;

  BaseControl.prototype.wasValid = true;

  BaseControl.prototype.notifyErrors = false;

  BaseControl.prototype.preventUpdateErrors = false;

  BaseControl.prototype.submitValue = true;

  BaseControl.prototype.beforeInit = function() {
    BaseControl.__super__.beforeInit.apply(this, arguments);
    this.xtype = 'control';
  };

  BaseControl.prototype.afterInit = function() {
    var rules;
    BaseControl.__super__.afterInit.apply(this, arguments);
    this.errors = [];
    this.defaultValue = this.originalValue = this.lastValue = this.value;
    if (!Type.isInstance(this.rules)) {
      rules = Array.from(this.rules);
      this.rules = new Rules(this);
      this.initRules();
      this.rules.addRules(rules);
    }
    if (this.width) {
      this.inputWidth = this.width;
      this.width = null;
    }
  };

  BaseControl.prototype.initRules = function() {
    if (this.required) {
      this.rules.addRule("filled");
    }
  };

  BaseControl.prototype.getValue = function() {
    return this.value;
  };

  BaseControl.prototype.getRawValue = function() {
    return (this.input ? this.input.getValue() : void 0);
  };

  BaseControl.prototype.getStringValue = function() {
    var val;
    val = this.getValue();
    return (val !== null && val !== undefined ? val.toString() : "");
  };

  BaseControl.prototype.getLabel = function() {
    return this.label;
  };

  BaseControl.prototype.setValue = function(value) {
    this.value = value;
    this.checkChange();
  };

  BaseControl.prototype.setOriginalValue = function(value) {
    this.originalValue = value;
    this.checkDirty();
  };

  BaseControl.prototype.setDefaultValue = function(value) {
    if (value) {
      this.defaultValue = value;
    }
    this.setValue(this.defaultValue);
  };

  BaseControl.prototype.setFocus = function() {
    BaseControl.__super__.setFocus.call(this);
    this.emit("focus", this);
  };

  BaseControl.prototype.isDisabled = function() {
    return this.disabled;
  };

  BaseControl.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    this.input.setDisabled(disabled);
  };

  BaseControl.prototype.isFilled = function() {
    return this.getStringValue() !== "";
  };

  BaseControl.prototype.isEqual = function(value1, value2) {
    return value1 === value2;
  };


  /**
  	  Returns the parameter(s) that would be included in a standard form submit for this field. Typically this will be
  	  an object with a single name-value pair, the name being this field's {@link #getName name} and the value being
  	  its current stringified value. More advanced field implementations may return more than one name-value pair.
  
  	  Note that the values returned from this method are not guaranteed to have been successfully {@link #validate
  	  validated}.
  
  	  @param {Boolean} submitable Only submitable values
  	  @return {Object} A mapping of submit parameter names to values; each value should be a string, or an array of
  	  strings if that particular name has multiple values. It can also return null if there are no parameters to be
  	  submitted.
   */

  BaseControl.prototype.getData = function(submitable) {
    var data;
    data = null;
    if (!this.disabled && (!submitable || !this.omitted) && !this.isFileUpload) {
      data = {};
      data[this.getName()] = "" + this.getValue();
    }
    return data;
  };

  BaseControl.prototype.reset = function() {
    this.beforeReset();
    this.setValue(this.originalValue);
    this.clearInvalid();
  };

  BaseControl.prototype.beforeReset = function() {};

  BaseControl.prototype.clearInvalid = function() {
    delete this.wasValid;
    this.notifyErrors = false;
    this.wasInputFocused = false;
    this.cleanErrors();
  };

  BaseControl.prototype.resetOriginalValue = function() {
    this.originalValue = this.getValue();
    this.checkDirty();
  };

  BaseControl.prototype.checkChange = function() {
    var newVal, oldVal;
    if (this.suspendCheckChange) {
      return;
    }
    newVal = this.getValue();
    oldVal = this.lastValue;
    if (!this.isEqual(newVal, oldVal) && !this.isDestroyed) {
      this.lastValue = newVal;
      this.emit("change", this, newVal, oldVal);
      this.onChange(newVal, oldVal);
    }
  };

  BaseControl.prototype.onChange = function(newVal, oldVal) {
    if (this.validateOnChange) {
      this.validate();
    }
    this.checkDirty();
  };

  BaseControl.prototype.isDirty = function() {
    return !this.disabled && !this.isEqual(this.getValue(), this.originalValue);
  };

  BaseControl.prototype.checkDirty = function() {
    var isDirty;
    isDirty = this.isDirty();
    if (isDirty !== this.wasDirty) {
      this.emit("dirtychange", this, isDirty);
      this.onDirtyChange(isDirty);
      this.wasDirty = isDirty;
    }
  };

  BaseControl.prototype.onDirtyChange = function(isDirty) {};

  BaseControl.prototype.getRules = function() {
    return this.rules;
  };

  BaseControl.prototype.getErrors = function() {
    return this.errors;
  };

  BaseControl.prototype.hasErrors = function() {
    return this.errors.length > 0;
  };

  BaseControl.prototype.addError = function(error) {
    this.errors.include(error);
    this.updateErrors();
  };

  BaseControl.prototype.addErrors = function(errors) {
    var error, _i, _len;
    for (_i = 0, _len = errors.length; _i < _len; _i++) {
      error = errors[_i];
      this.errors.include(error);
    }
    this.updateErrors();
  };

  BaseControl.prototype.cleanErrors = function() {
    this.errors.empty();
    this.updateErrors();
  };

  BaseControl.prototype.updateErrors = function() {
    if (this.preventUpdateErrors) {
      return;
    }
    this.emit("errorsupdate", this);
    if (this.input) {
      this.input.el.removeClass('has-error');
      if (this.hasErrors()) {
        this.input.el.addClass('has-error');
      }
    }
    if (this.el.hasClass('form-group')) {
      this.el.removeClass('has-error');
      if (this.hasErrors()) {
        this.el.addClass('has-error');
      }

      /*
      			if @hasErrors() and @notifyErrors
      				if !@errorTip
      					@errorTip = new Element('div', {cls:'help-block has-error'})
      					@errorTip.inject(@inputEl.getParent('.form-controls'))
      				@errorTip.set('text', @errors[0])
      			else
      				if @errorTip
      					@errorTip.destroy()
      					@errorTip = null
       */
    }
  };

  BaseControl.prototype.isValid = function(onlyCheck) {
    if (this.disabled) {
      return true;
    }
    if (this.wasValid === null || !onlyCheck) {
      this.cleanErrors();
      this.doValidate();
    }
    return !this.hasErrors();
  };

  BaseControl.prototype.doValidate = function() {
    this.preventUpdateErrors = true;
    this.getRules().validate();
    this.preventUpdateErrors = false;
    this.updateErrors();
  };


  /**
  	  Returns whether or not the field value is currently valid by {@link #getErrors validating} the field's current
  	  value, and fires the {@link #validitychange} event if the field's validity has changed since the last validation.
  	  Note**: {@link #disabled} fields are always treated as valid.
  
  	  Custom implementations of this method are allowed to have side-effects such as triggering error message display.
  	  To validate without side-effects, use {@link #isValid}.
  
  	  @param {Boolean} notifyErrors Notifikovat uzivatela o chybach
  	  @return {Boolean} True if the value is valid, else false
   */

  BaseControl.prototype.validate = function(notifyErrors) {
    var isValid;
    if (notifyErrors) {
      this.notifyErrors = notifyErrors;
    }
    isValid = this.isValid();
    if (isValid !== this.wasValid) {
      this.wasValid = isValid;
      this.emit("validitychange", this, isValid);
    }
    return isValid;
  };

  BaseControl.prototype.isRequired = function() {
    return this.rules.hasRule("filled");
  };

  BaseControl.prototype.initializeControl = function() {
    if (this.value !== null) {
      this.setValue(this.value);
    }
    this.suspendCheckChange = false;
  };

  BaseControl.prototype.getForm = function() {
    if (!this.form) {
      throw new Error("Component is not attached to Form");
    }
    return this.form;
  };

  BaseControl.prototype.setLabel = function(label) {
    this.label = label;
    if (this.labeltextEl) {
      this.labeltextEl.set('text', label);
    }
  };

  BaseControl.prototype.getLabel = function() {
    return this.label;
  };

  BaseControl.prototype.getLabelEl = function() {
    if (!this.labelEl) {
      this.labelEl = new Element('label');
    }
    return this.labelEl;
  };

  BaseControl.prototype.getInput = function() {
    if (!this.input) {
      this.input = this.createInput();
      if (!this.input) {
        throw new Error("Input was not created in createInput() in class " + this);
      }
    }
    return this.input;
  };

  BaseControl.prototype.createInput = function() {};

  BaseControl.prototype.doRender = function() {
    this.renderControl(this.el);
  };

  BaseControl.prototype.renderLabel = function(ct) {
    var labelEl, requiredEl;
    labelEl = this.getLabelEl();
    labelEl.inject(ct);
    this.labeltextEl = new Element('span', {
      cls: 'control-label-text',
      html: this.label
    });
    this.labeltextEl.inject(labelEl);
    if (this.isRequired()) {
      requiredEl = new Element('span', {
        cls: 'control-label-required',
        html: '*',
        'data-toggle': 'tooltip',
        'data-title': 'Required field'
      });
      requiredEl.inject(labelEl);
    }
    return labelEl;
  };

  BaseControl.prototype.renderControl = function(ct) {
    var button, buttonsCt, input, span, _i, _len, _ref;
    input = this.getInput();
    if (input.rendered) {
      return input;
    }
    if (this.inputWidth) {
      this.el.addClass('input-fill');
      ct.setStyle('width', this.inputWidth);
    }
    if (this.prepend || this.append || this.buttons) {
      ct.addClass('input-group');
    } else {
      ct.addClass('input-control');
    }
    if (this.prepend) {
      span = new Element('span', {
        cls: 'input-group-addon',
        html: this.prepend
      });
      span.inject(ct);
    }
    input.render(ct);
    input.setDisabled(this.disabled);
    if (this.append) {
      span = new Element('span', {
        cls: 'input-group-addon',
        html: this.append
      });
      span.inject(ct);
    }
    if (this.buttons) {
      buttonsCt = new Element('div', {
        cls: 'input-group-btn'
      });
      buttonsCt.inject(ct);
      _ref = this.buttons;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        button = _ref[_i];
        button = new Button(button);
        button.getControl = (function(_this) {
          return function() {
            return _this;
          };
        })(this);
        button.render(buttonsCt);
      }
    }
    return input;
  };

  BaseControl.prototype.afterRender = function() {
    BaseControl.__super__.afterRender.apply(this, arguments);
    this.afterRenderLabel();
    this.afterRenderControl();
    this.initializeControl();
  };

  BaseControl.prototype.afterRenderLabel = function() {
    if (this.labelEl && this.input.getInputId) {
      this.labelEl.set('for', this.input.getInputId());
    }
  };

  BaseControl.prototype.afterRenderControl = function() {};

  BaseControl.prototype.doDestroy = function() {
    if (this.input) {
      this.input.destroy();
    }
    BaseControl.__super__.doDestroy.apply(this, arguments);
  };

  return BaseControl;

})(Miwo.Component);

module.exports = BaseControl;


},{"../../buttons/Button":6,"../Rules":15}],21:[function(require,module,exports){
var BaseControl, BaseSelectControl, Helpers,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

Helpers = require('./Helpers');

BaseSelectControl = (function(_super) {
  __extends(BaseSelectControl, _super);

  function BaseSelectControl() {
    return BaseSelectControl.__super__.constructor.apply(this, arguments);
  }

  BaseSelectControl.prototype.items = null;

  BaseSelectControl.prototype.store = null;

  BaseSelectControl.prototype.keyProperty = null;

  BaseSelectControl.prototype.textProperty = null;

  BaseSelectControl.prototype.rowBuilder = null;

  BaseSelectControl.prototype.prompt = false;

  BaseSelectControl.prototype.input = null;

  BaseSelectControl.prototype.setValue = function(value) {
    BaseSelectControl.__super__.setValue.call(this, value);
    this.setSelected(value);
  };

  BaseSelectControl.prototype.setSelected = function(value) {
    if (value || this.prompt) {
      if (this.input) {
        this.input.setValue(value);
      }
      this.emit('selected', this, value);
    }
  };

  BaseSelectControl.prototype.getItems = function() {
    return Helpers.createSelectItems(this);
  };

  BaseSelectControl.prototype.setItems = function(items) {
    Helpers.setSelectItems(this, items);
    if (!this.prompt && this.value !== null) {
      this.input.setValue(this.getValue());
    }
  };

  BaseSelectControl.prototype.buildRowContent = function(row) {
    if (this.rowBuilder) {
      return this.rowBuilder(row);
    } else {
      return null;
    }
  };

  BaseSelectControl.prototype.afterRenderControl = function() {
    var inputEl;
    inputEl = this.input.getInputEl();
    inputEl.on('change', (function(_this) {
      return function() {
        if (!_this.disabled) {
          return _this.setValue(_this.input.getValue());
        }
      };
    })(this));
    inputEl.on('focus', (function(_this) {
      return function() {
        if (!_this.disabled) {
          return _this.setFocus();
        }
      };
    })(this));
    inputEl.on('blur', (function(_this) {
      return function() {
        if (!_this.disabled) {
          return _this.validate();
        }
      };
    })(this));
    this.setItems(this.getItems());
    this.focusEl = inputEl;
  };

  return BaseSelectControl;

})(BaseControl);

module.exports = BaseSelectControl;


},{"./BaseControl":20,"./Helpers":30}],22:[function(require,module,exports){
var BaseControl, BaseTextControl, Text,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

Text = require('../../input/Text');

BaseTextControl = (function(_super) {
  __extends(BaseTextControl, _super);

  function BaseTextControl() {
    return BaseTextControl.__super__.constructor.apply(this, arguments);
  }

  BaseTextControl.prototype.placeholder = null;

  BaseTextControl.prototype.minLength = null;

  BaseTextControl.prototype.maxLength = null;

  BaseTextControl.prototype.length = null;

  BaseTextControl.prototype.autocomplete = null;

  BaseTextControl.prototype.pattern = null;

  BaseTextControl.prototype.readonly = null;

  BaseTextControl.prototype.notifyInputChange = false;

  BaseTextControl.prototype.setValueInputChange = true;

  BaseTextControl.prototype.validateOnKeyUp = false;

  BaseTextControl.prototype.value = '';

  BaseTextControl.prototype.type = null;

  BaseTextControl.prototype.initRules = function() {
    BaseTextControl.__super__.initRules.apply(this, arguments);
    if (this.minLength) {
      this.rules.addRule("minLength", null, this.minLength);
    }
    if (this.maxLength) {
      this.rules.addRule("maxLength", null, this.maxLength);
    }
    if (this.length) {
      this.rules.addRule("length", null, this.length);
    }
  };

  BaseTextControl.prototype.createInput = function() {
    return new Text({
      id: this.id + '-input',
      type: this.type || 'text',
      autocomplete: this.autocomplete,
      placeholder: this.placeholder,
      readonly: this.readonly,
      disabled: this.disabled
    });
  };

  BaseTextControl.prototype.setValue = function(value, ignoreInputChange) {
    BaseTextControl.__super__.setValue.call(this, value);
    if (this.input && !ignoreInputChange) {
      this.input.setValue(value);
    }
  };

  BaseTextControl.prototype.setDisabled = function(disabled) {
    BaseTextControl.__super__.setDisabled.call(this, disabled);
    if (this.input) {
      this.input.setDisabled(disabled);
    }
  };

  BaseTextControl.prototype.afterRenderControl = function() {
    var inputEl;
    BaseTextControl.__super__.afterRenderControl.apply(this, arguments);
    inputEl = this.input.getInputEl();
    if (this.minLength !== null) {
      inputEl.set("minlength", this.minLength);
    }
    if (this.maxLength !== null) {
      inputEl.set("maxlength", this.maxLength);
    }
    if (this.isRequired()) {
      inputEl.set("required", true);
    }
    this.mon(inputEl, 'keydown', 'onInputKeydown');
    this.mon(inputEl, 'keyup', 'onInputKeyup');
    this.mon(inputEl, 'change', 'onInputChange');
    this.mon(inputEl, 'focus', 'onInputFocus');
    this.mon(inputEl, 'blur', 'onInputBlur');
    this.focusEl = inputEl;
  };

  BaseTextControl.prototype.onInputChange = function() {
    if (this.setValueInputChange) {
      this.setValue(this.getRawValue(), true);
    }
    if (this.notifyInputChange) {
      this.emit("inputchange", this, this.getRawValue());
    }
  };

  BaseTextControl.prototype.onInputKeydown = function(e) {
    if (e.key.length === 1) {
      this.onKeydown(this, e.key, e);
      this.emit("keydown", this, e.key, e);
      if (this.pattern && !this.pattern.test(e.key)) {
        e.stop();
      }
    } else {
      this.onSpecialkey(this, e.key, e);
      this.emit("specialkey", this, e.key, e);
    }
  };

  BaseTextControl.prototype.onInputKeyup = function(e) {
    this.notifyErrors = true;
    this.emit("inputchange", this, this.getRawValue());
    if (e.key.length === 1) {
      this.onKeyup(this, e.key, e);
      this.emit("keyup", this, e.key, e);
      e.stop();
    } else {
      this.onSpecialkeyup(this, e.key, e);
      this.emit("specialkeyup", this, e.key, e);
    }
    if (this.hasErrors()) {
      this.validateOnKeyUp = true;
      this.setValue(this.getRawValue(), true);
    }
    if (this.validateOnKeyUp) {
      this.setValue(this.getRawValue(), true);
      this.validate();
    }
  };

  BaseTextControl.prototype.onSpecialkey = function(control, key, e) {};

  BaseTextControl.prototype.onKeydown = function(control, key, e) {};

  BaseTextControl.prototype.onSpecialkeyup = function(control, key, e) {};

  BaseTextControl.prototype.onKeyup = function(control, key, e) {};

  BaseTextControl.prototype.onInputFocus = function(e) {
    this.setFocus();
  };

  BaseTextControl.prototype.onInputBlur = function(e) {
    this.validate();
  };

  return BaseTextControl;

})(BaseControl);

module.exports = BaseTextControl;


},{"../../input/Text":65,"./BaseControl":20}],23:[function(require,module,exports){
var BaseControl, ButtonGroup, ButtonGroupControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

ButtonGroup = require('../../buttons/ButtonGroup');

ButtonGroupControl = (function(_super) {
  __extends(ButtonGroupControl, _super);

  function ButtonGroupControl() {
    return ButtonGroupControl.__super__.constructor.apply(this, arguments);
  }

  ButtonGroupControl.prototype.xtype = "buttongroupfield";

  ButtonGroupControl.prototype.items = null;

  ButtonGroupControl.prototype.toggle = 'radio';

  ButtonGroupControl.prototype.setValue = function(value) {
    var v, _i, _len;
    ButtonGroupControl.__super__.setValue.call(this, value);
    if (this.input.toggle === 'radio') {
      this.input.setActive(value, true, true);
    } else {
      this.input.setActiveAll(false, true);
      if (Type.isArray(value)) {
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          v = value[_i];
          this.input.setActive(v, true, true);
        }
      } else {
        this.input.setActive(value, true, true);
      }
    }
  };

  ButtonGroupControl.prototype.createInput = function() {
    return new ButtonGroup({
      toggle: this.toggle
    });
  };

  ButtonGroupControl.prototype.setItems = function(items) {
    var name, text;
    this.input.removeAllComponents();
    for (name in items) {
      text = items[name];
      this.input.addButton(name, {
        text: text
      });
    }
  };

  ButtonGroupControl.prototype.afterRenderControl = function() {
    this.setItems(this.items);
    this.input.on('active', (function(_this) {
      return function() {
        var value;
        value = [];
        _this.input.getActiveButtons().each(function(btn) {
          return value.push(btn.name);
        });
        return _this.setValue(value);
      };
    })(this));
  };

  return ButtonGroupControl;

})(BaseControl);

module.exports = ButtonGroupControl;


},{"../../buttons/ButtonGroup":7,"./BaseControl":20}],24:[function(require,module,exports){
var Button, ButtonControl, ResetButton, SubmitButton,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('../../buttons/Button');

ButtonControl = (function(_super) {
  __extends(ButtonControl, _super);

  function ButtonControl(config) {
    if (config == null) {
      config = {};
    }
    if (config.label) {
      config.text = config.label;
    }
    ButtonControl.__super__.constructor.call(this, config);
  }

  return ButtonControl;

})(Button);

SubmitButton = (function(_super) {
  __extends(SubmitButton, _super);

  function SubmitButton() {
    return SubmitButton.__super__.constructor.apply(this, arguments);
  }

  SubmitButton.prototype.isSubmitButton = true;

  SubmitButton.prototype.xtype = 'submitbutton';

  SubmitButton.prototype.type = 'primary';

  return SubmitButton;

})(ButtonControl);

ResetButton = (function(_super) {
  __extends(ResetButton, _super);

  function ResetButton() {
    return ResetButton.__super__.constructor.apply(this, arguments);
  }

  ResetButton.prototype.isResetButton = true;

  ResetButton.prototype.xtype = 'submitbutton';

  return ResetButton;

})(ButtonControl);

module.exports = {
  ButtonControl: ButtonControl,
  SubmitButton: SubmitButton,
  ResetButton: ResetButton
};


},{"../../buttons/Button":6}],25:[function(require,module,exports){
var BaseControl, Checkbox, CheckboxControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

Checkbox = require('../../input/Checkbox');

CheckboxControl = (function(_super) {
  __extends(CheckboxControl, _super);

  function CheckboxControl() {
    return CheckboxControl.__super__.constructor.apply(this, arguments);
  }

  CheckboxControl.prototype.xtype = "checkbox";

  CheckboxControl.prototype.value = false;

  CheckboxControl.prototype.isBoxControl = true;

  CheckboxControl.prototype.createInput = function() {
    return new Checkbox({
      id: this.id,
      label: this.label
    });
  };

  CheckboxControl.prototype.setValue = function(value) {
    CheckboxControl.__super__.setValue.call(this, value);
    this.input.setChecked(!!value);
  };

  CheckboxControl.prototype.isChecked = function() {
    return this.value === true;
  };

  CheckboxControl.prototype.isFilled = function() {
    return this.isChecked();
  };

  CheckboxControl.prototype.setDisabled = function(disabled) {
    CheckboxControl.__super__.setDisabled.call(this, disabled);
    this.input.setDisabled(disabled);
  };

  CheckboxControl.prototype.renderLabel = function(ct) {};

  CheckboxControl.prototype.renderControl = function(ct) {
    var input;
    ct.addClass('input-control');
    input = this.getInput();
    input.render(ct);
    input.setChecked(this.isChecked());
    input.setDisabled(this.disabled);
    input.on('change', (function(_this) {
      return function() {
        return _this.setValue(!_this.getValue());
      };
    })(this));
    input.on('focus', (function(_this) {
      return function() {
        return _this.setFocus();
      };
    })(this));
  };

  return CheckboxControl;

})(BaseControl);

module.exports = CheckboxControl;


},{"../../input/Checkbox":56,"./BaseControl":20}],26:[function(require,module,exports){
var BaseControl, CheckboxList, CheckboxListControl, Helpers,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

CheckboxList = require('../../input/CheckboxList');

Helpers = require('./Helpers');

CheckboxListControl = (function(_super) {
  __extends(CheckboxListControl, _super);

  function CheckboxListControl() {
    return CheckboxListControl.__super__.constructor.apply(this, arguments);
  }

  CheckboxListControl.prototype.xtype = "checkboxlist";

  CheckboxListControl.prototype.items = null;

  CheckboxListControl.prototype.inline = false;

  CheckboxListControl.prototype.isBoxControl = true;

  CheckboxListControl.prototype.createInput = function() {
    return new CheckboxList({
      id: this.id,
      inline: this.inline
    });
  };

  CheckboxListControl.prototype.getItems = function() {
    return Helpers.createInputItems(this);
  };

  CheckboxListControl.prototype.setItems = function(items) {
    Helpers.setInputItems(this, items);
  };

  CheckboxListControl.prototype.setValue = function(value) {
    this.input.setValue(value);
    CheckboxListControl.__super__.setValue.call(this, value);
  };

  CheckboxListControl.prototype.setDisabled = function(disabled) {
    this.input.setDisabled(disabled);
    CheckboxListControl.__super__.setDisabled.call(this, disabled);
  };

  CheckboxListControl.prototype.setDisabledItem = function(name, disabled) {
    this.input.setDisabled(name, disabled);
  };

  CheckboxListControl.prototype.renderControl = function(ct) {
    this.getInput().render(ct);
  };

  CheckboxListControl.prototype.afterRenderControl = function() {
    this.setItems(this.getItems());
    this.input.setValue(this.value);
    this.input.setDisabled(this.disabled);
    this.input.on('change', (function(_this) {
      return function() {
        return _this.setValue(_this.input.getValue());
      };
    })(this));
    this.input.on('focus', (function(_this) {
      return function() {
        return _this.setFocus();
      };
    })(this));
    this.input.on('blur', (function(_this) {
      return function() {
        return _this.validate();
      };
    })(this));
  };

  return CheckboxListControl;

})(BaseControl);

module.exports = CheckboxListControl;


},{"../../input/CheckboxList":57,"./BaseControl":20,"./Helpers":30}],27:[function(require,module,exports){
var BaseControl, Color, ColorControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

Color = require('../../input/Color');

ColorControl = (function(_super) {
  __extends(ColorControl, _super);

  function ColorControl() {
    return ColorControl.__super__.constructor.apply(this, arguments);
  }

  ColorControl.prototype.xtype = 'colorfield';

  ColorControl.prototype.createInput = function() {
    var picker;
    picker = new Color({
      id: this.id,
      disabled: this.disabled,
      resetable: false
    });
    picker.on('changed', (function(_this) {
      return function(picker, hex) {
        _this.setValue('#' + hex);
      };
    })(this));
    picker.on('reset', (function(_this) {
      return function() {
        _this.reset();
      };
    })(this));
    return picker;
  };

  ColorControl.prototype.setValue = function(value) {
    ColorControl.__super__.setValue.call(this, value);
    this.input.setValue(value);
  };

  ColorControl.prototype.onDirtyChange = function(isDirty) {
    this.input.setResetable(isDirty);
  };

  ColorControl.prototype.initRules = function() {
    ColorControl.__super__.initRules.call(this);
    this.rules.addRule("color");
  };

  return ColorControl;

})(BaseControl);

module.exports = ColorControl;


},{"../../input/Color":58,"./BaseControl":20}],28:[function(require,module,exports){
var BaseSelectControl, Combo, ComboControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseSelectControl = require('./BaseSelectControl');

Combo = require('../../input/Combo');

ComboControl = (function(_super) {
  __extends(ComboControl, _super);

  function ComboControl() {
    return ComboControl.__super__.constructor.apply(this, arguments);
  }

  ComboControl.prototype.xtype = 'combobox';

  ComboControl.prototype.hideSelected = true;

  ComboControl.prototype.multiple = false;

  ComboControl.prototype.height = null;

  ComboControl.prototype.placeholder = '';

  ComboControl.prototype.prompt = false;

  ComboControl.prototype.createInput = function() {
    return new Combo({
      id: this.id,
      hideSelected: this.hideSelected,
      multiple: this.multiple,
      height: this.height,
      placeholder: this.placeholder,
      prompt: this.prompt
    });
  };

  return ComboControl;

})(BaseSelectControl);

module.exports = ComboControl;


},{"../../input/Combo":59,"./BaseSelectControl":21}],29:[function(require,module,exports){
var DateControl, TextControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextControl = require('./Text');

DateControl = (function(_super) {
  __extends(DateControl, _super);

  function DateControl() {
    return DateControl.__super__.constructor.apply(this, arguments);
  }

  DateControl.prototype.xtype = "datefield";

  DateControl.prototype.type = 'date';

  DateControl.prototype.validateOnChange = false;

  DateControl.prototype.placeholder = "yyyy-mm-dd";

  DateControl.prototype.initRules = function() {
    DateControl.__super__.initRules.apply(this, arguments);
    this.rules.addRule("date");
  };

  return DateControl;

})(TextControl);

module.exports = DateControl;


},{"./Text":35}],30:[function(require,module,exports){
var Helpers;

Helpers = (function() {
  function Helpers() {}

  Helpers.createSelectItems = function(control) {
    var items;
    if (control.items) {
      return control.items;
    } else if (control.store) {
      control.store = miwo.store(control.store);
      if (!control.keyProperty) {
        control.keyProperty = 'id';
      }
      if (!control.textProperty) {
        throw new Error("Undefined text property");
      }
      items = {};
      control.store.each((function(_this) {
        return function(row) {
          return items[row.get(control.keyProperty)] = {
            text: row.get(control.textProperty),
            content: control.buildRowContent(row)
          };
        };
      })(this));
      return items;
    } else {
      return {};
    }
  };

  Helpers.setSelectItems = function(control, items) {
    var group, iname, input, ivalue, name, value, _i, _len, _ref;
    if (!control.input) {
      return;
    }
    input = control.input;
    input.clear();
    if (control.prompt && control.requirePromptItem) {
      input.addOption("", control.prompt);
    }
    if (Type.isArray(items)) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        value = items[_i];
        input.addOption(value, value);
      }
    } else {
      for (name in items) {
        value = items[name];
        if (Type.isObject(value)) {
          if (value.items) {
            group = input.addGroup(value.title);
            _ref = value.items;
            for (iname in _ref) {
              ivalue = _ref[iname];
              if (Type.isObject(ivalue)) {
                group.addOption(iname, ivalue.text, ivalue.content);
              } else {
                group.addOption(iname, ivalue);
              }
            }
          } else {
            input.addOption(name, value.text, value.content);
          }
        } else {
          input.addOption(name, value);
        }
      }
    }
  };

  Helpers.createInputItems = function(control) {
    var items;
    if (control.items) {
      return control.items;
    } else if (control.store) {
      control.store = miwo.store(control.store);
      if (!control.keyProperty) {
        control.keyProperty = 'id';
      }
      if (!control.textProperty) {
        throw new Error("Undefined text property");
      }
      items = {};
      control.store.each((function(_this) {
        return function(row) {
          return items[row.get(control.keyProperty)] = {
            text: row.get(control.textProperty),
            content: control.buildRowContent(row)
          };
        };
      })(this));
      return items;
    } else {
      return {};
    }
  };

  Helpers.setInputItems = function(control, items) {
    var input, name, value, _i, _len;
    if (!control.input) {
      return;
    }
    input = control.input;
    input.clear();
    if (Type.isArray(items)) {
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        value = items[_i];
        input.addItem(value, value);
      }
    } else {
      for (name in items) {
        value = items[name];
        input.addItem(name, value);
      }
    }
  };

  return Helpers;

})();

module.exports = Helpers;


},{}],31:[function(require,module,exports){
var NumberControl, TextControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextControl = require('./Text');

NumberControl = (function(_super) {
  __extends(NumberControl, _super);

  function NumberControl() {
    return NumberControl.__super__.constructor.apply(this, arguments);
  }

  NumberControl.prototype.xtype = "numberfield";

  NumberControl.prototype.type = 'number';

  NumberControl.prototype.min = null;

  NumberControl.prototype.max = null;

  NumberControl.prototype.pattern = /[\d\.\-]/;

  NumberControl.prototype.setValue = function(value) {
    if (this.min !== null && value < this.min) {
      value = this.min;
    }
    if (this.max !== null && value > this.max) {
      value = this.max;
    }
    NumberControl.__super__.setValue.call(this, value);
  };

  NumberControl.prototype.initRules = function() {
    NumberControl.__super__.initRules.call(this);
    this.rules.addRule("number");
    if (this.min !== null) {
      this.rules.addRule("min", null, this.min);
    }
    if (this.max !== null) {
      this.rules.addRule("max", null, this.max);
    }
  };

  NumberControl.prototype.createInput = function() {
    var input;
    input = NumberControl.__super__.createInput.call(this);
    input.el.addClass("number");
    if (this.min !== null) {
      input.el.set("min", this.min);
    }
    if (this.max !== null) {
      input.el.set("max", this.max);
    }
    return input;
  };

  return NumberControl;

})(TextControl);

module.exports = NumberControl;


},{"./Text":35}],32:[function(require,module,exports){
var BaseControl, Helpers, RadioList, RadioListControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

RadioList = require('../../input/RadioList');

Helpers = require('./Helpers');

RadioListControl = (function(_super) {
  __extends(RadioListControl, _super);

  function RadioListControl() {
    return RadioListControl.__super__.constructor.apply(this, arguments);
  }

  RadioListControl.prototype.xtype = "radiolist";

  RadioListControl.prototype.items = null;

  RadioListControl.prototype.inline = false;

  RadioListControl.prototype.isBoxControl = true;

  RadioListControl.prototype.createInput = function() {
    return new RadioList({
      id: this.id,
      inline: this.inline,
      radioName: this.name
    });
  };

  RadioListControl.prototype.getItems = function() {
    return Helpers.createInputItems(this);
  };

  RadioListControl.prototype.setItems = function(items) {
    Helpers.setInputItems(this, items);
  };

  RadioListControl.prototype.setValue = function(value) {
    this.input.setValue(value);
    RadioListControl.__super__.setValue.call(this, value);
  };

  RadioListControl.prototype.setDisabled = function(disabled) {
    this.input.setDisabled(disabled);
    RadioListControl.__super__.setDisabled.call(this, disabled);
  };

  RadioListControl.prototype.setDisabledItem = function(name, disabled) {
    this.input.setDisabled(name, disabled);
  };

  RadioListControl.prototype.renderControl = function(ct) {
    this.getInput().render(ct);
  };

  RadioListControl.prototype.afterRenderControl = function() {
    this.setItems(this.getItems());
    this.input.setValue(this.value);
    this.input.setDisabled(this.disabled);
    this.input.on('change', (function(_this) {
      return function() {
        return _this.setValue(_this.input.getValue());
      };
    })(this));
    this.input.on('focus', (function(_this) {
      return function() {
        return _this.setFocus();
      };
    })(this));
    this.input.on('blur', (function(_this) {
      return function() {
        return _this.validate();
      };
    })(this));
  };

  return RadioListControl;

})(BaseControl);

module.exports = RadioListControl;


},{"../../input/RadioList":62,"./BaseControl":20,"./Helpers":30}],33:[function(require,module,exports){
var BaseSelectControl, Select, SelectControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseSelectControl = require('./BaseSelectControl');

Select = require('../../input/Select');

SelectControl = (function(_super) {
  __extends(SelectControl, _super);

  function SelectControl() {
    return SelectControl.__super__.constructor.apply(this, arguments);
  }

  SelectControl.prototype.xtype = 'selectbox';

  SelectControl.prototype.requirePromptItem = true;

  SelectControl.prototype.createInput = function() {
    return new Select({
      id: this.id
    });
  };

  return SelectControl;

})(BaseSelectControl);

module.exports = SelectControl;


},{"../../input/Select":63,"./BaseSelectControl":21}],34:[function(require,module,exports){
var BaseControl, Slider, SliderControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseControl = require('./BaseControl');

Slider = require('../../input/Slider');

SliderControl = (function(_super) {
  __extends(SliderControl, _super);

  function SliderControl() {
    return SliderControl.__super__.constructor.apply(this, arguments);
  }

  SliderControl.prototype.xtype = "slider";

  SliderControl.prototype.min = 0;

  SliderControl.prototype.max = 100;

  SliderControl.prototype.step = 1;

  SliderControl.prototype.value = 0;

  SliderControl.prototype.setValue = function(value) {
    this.input.setValue(value);
    SliderControl.__super__.setValue.call(this, this.input.getValue());
  };

  SliderControl.prototype.createInput = function() {
    var input;
    input = new Slider({
      step: this.step,
      min: this.min,
      max: this.max
    });
    input.on('change', (function(_this) {
      return function(slider, value) {
        _this.setValue(value);
      };
    })(this));
    return input;
  };

  return SliderControl;

})(BaseControl);

module.exports = SliderControl;


},{"../../input/Slider":64,"./BaseControl":20}],35:[function(require,module,exports){
var BaseTextControl, TextControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTextControl = require('./BaseTextControl');

TextControl = (function(_super) {
  __extends(TextControl, _super);

  function TextControl() {
    return TextControl.__super__.constructor.apply(this, arguments);
  }

  TextControl.prototype.isTextField = true;

  TextControl.prototype.xtype = 'textfield';

  TextControl.prototype.initRules = function() {
    TextControl.__super__.initRules.apply(this, arguments);
    switch (this.type) {
      case 'email':
        this.rules.addRule('email');
        break;
      case 'url':
        this.rules.addRule('url');
    }
  };

  TextControl.prototype.onSpecialkey = function(control, key, e) {
    if (key === 'enter') {
      this.setValue(this.getRawValue(), true);
    }
  };

  return TextControl;

})(BaseTextControl);

module.exports = TextControl;


},{"./BaseTextControl":22}],36:[function(require,module,exports){
var BaseTextControl, TextArea, TextAreaControl,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTextControl = require('./BaseTextControl');

TextArea = require('../../input/TextArea');

TextAreaControl = (function(_super) {
  __extends(TextAreaControl, _super);

  function TextAreaControl() {
    return TextAreaControl.__super__.constructor.apply(this, arguments);
  }

  TextAreaControl.prototype.isTextAreaField = true;

  TextAreaControl.prototype.xtype = "textarea";

  TextAreaControl.prototype.height = null;

  TextAreaControl.prototype.resize = "vertical";

  TextAreaControl.prototype.createInput = function() {
    return new TextArea({
      id: this.id + '-input',
      height: this.height,
      readonly: this.readonly,
      disabled: this.disabled,
      resize: this.resize
    });
  };

  return TextAreaControl;

})(BaseTextControl);

module.exports = TextAreaControl;


},{"../../input/TextArea":66,"./BaseTextControl":22}],37:[function(require,module,exports){
var BaseContainer, exports;

exports = {
  container: {
    BaseContainer: require('./container/BaseContainer'),
    Fieldset: require('./container/Fieldset'),
    Form: require('./container/Form')
  },
  render: {
    FormRendererFactory: require('./render/FormRendererFactory'),
    HorizontalRenderer: require('./render/HorizontalRenderer'),
    InlineRenderer: require('./render/InlineRenderer')
  },
  control: {
    BaseControl: require('./control/BaseControl'),
    BaseTextControl: require('./control/BaseTextControl'),
    Checkbox: require('./control/Checkbox'),
    CheckboxList: require('./control/CheckboxList'),
    RadioList: require('./control/RadioList'),
    Select: require('./control/Select'),
    Combo: require('./control/Combo'),
    Color: require('./control/Color'),
    Date: require('./control/Date'),
    Number: require('./control/Number'),
    Slider: require('./control/Slider'),
    Text: require('./control/Text'),
    TextArea: require('./control/TextArea'),
    ButtonGroup: require('./control/ButtonGroup'),
    Button: require('./control/Buttons').ButtonControl,
    SubmitButton: require('./control/Buttons').SubmitButton,
    ResetButton: require('./control/Buttons').ResetButton
  }
};

BaseContainer = exports.container.BaseContainer;

BaseContainer.registerControl('date', exports.control.Date);

BaseContainer.registerControl('text', exports.control.Text);

BaseContainer.registerControl('textarea', exports.control.TextArea);

BaseContainer.registerControl('color', exports.control.Color);

BaseContainer.registerControl('number', exports.control.Number);

BaseContainer.registerControl('slider', exports.control.Slider);

BaseContainer.registerControl('combo', exports.control.Combo);

BaseContainer.registerControl('select', exports.control.Select);

BaseContainer.registerControl('checkbox', exports.control.Checkbox);

BaseContainer.registerControl('checkboxList', exports.control.CheckboxList);

BaseContainer.registerControl('radioList', exports.control.RadioList);

BaseContainer.registerControl('buttonGroup', exports.control.ButtonGroup);

BaseContainer.registerControl('button', exports.control.Button);

BaseContainer.registerControl('submit', exports.control.SubmitButton);

BaseContainer.registerControl('reset', exports.control.ResetButton);

module.exports = exports;


},{"./container/BaseContainer":17,"./container/Fieldset":18,"./container/Form":19,"./control/BaseControl":20,"./control/BaseTextControl":22,"./control/ButtonGroup":23,"./control/Buttons":24,"./control/Checkbox":25,"./control/CheckboxList":26,"./control/Color":27,"./control/Combo":28,"./control/Date":29,"./control/Number":31,"./control/RadioList":32,"./control/Select":33,"./control/Slider":34,"./control/Text":35,"./control/TextArea":36,"./render/FormRendererFactory":38,"./render/HorizontalRenderer":39,"./render/InlineRenderer":40}],38:[function(require,module,exports){
var FormRendererFactory;

FormRendererFactory = (function() {
  FormRendererFactory.prototype.defines = null;

  function FormRendererFactory() {
    this.defines = {};
  }

  FormRendererFactory.prototype.register = function(name, fn) {
    this.defines[name] = fn;
  };

  FormRendererFactory.prototype.create = function(type, options) {
    if (!this.defines[type]) {
      throw new Error("Required form renderer '" + type + "' is not registered in FormRendererFactory");
    }
    return new this.defines[type](options);
  };

  return FormRendererFactory;

})();

module.exports = FormRendererFactory;


},{}],39:[function(require,module,exports){
var HorizontalRenderer;

HorizontalRenderer = (function() {
  HorizontalRenderer.prototype.options = null;

  function HorizontalRenderer(options) {
    if (options == null) {
      options = {};
    }
    this.options = {
      baseColSize: options.baseColSize || 8
    };
  }

  HorizontalRenderer.prototype.renderForm = function(form) {
    form.el.addClass('form-horizontal');
  };

  HorizontalRenderer.prototype.renderButtons = function(buttons, ct) {
    var button, _i, _len;
    if (ct.generated) {
      ct.addClass("col-sm-offset-" + (12 - this.options.baseColSize));
      ct.addClass("col-sm-" + this.options.baseColSize);
    }
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      button = buttons[_i];
      button.render(ct);
    }
  };

  HorizontalRenderer.prototype.renderGroup = function(control, ct) {
    if (!control.groupEl) {
      control.groupEl = control.el;
      control.groupEl.inject(ct);
      control.groupEl.addClass('form-group');
    }
    control.el = control.groupEl;
    if (control.isBoxControl) {
      control.groupEl.addClass('margin-no');
    }
    if (!control.labelRendered) {
      this.renderLabel(control, control.groupEl);
    }
    if (!control.controlsRendered) {
      this.renderControls(control, control.groupEl);
    } else if (!control.controlRendered) {
      this.renderControl(control, control.controlsEl);
    } else if (!control.inputRendered) {
      control.getInput().replace(control.inputEl);
    }
  };

  HorizontalRenderer.prototype.renderLabel = function(control, ct) {
    var labelEl;
    labelEl = control.renderLabel(ct);
    if (labelEl) {
      labelEl.addClass('control-label');
      labelEl.addClass('col-sm-' + (12 - this.options.baseColSize));
    }
  };

  HorizontalRenderer.prototype.renderControls = function(control, ct) {
    var controlsEl, descEl, helpEl, tipEl;
    if (!control.controlsEl) {
      controlsEl = new Element('div');
      controlsEl.inject(ct);
      controlsEl.addClass('col-sm-' + this.options.baseColSize);
      controlsEl.addClass('form-controls');
      control.controlsEl = controlsEl;
    }
    controlsEl = control.controlsEl;
    if (!controlsEl.getPrevious('.control-label')) {
      controlsEl.addClass('col-sm-offset-' + (12 - this.options.baseColSize));
    }
    if (control.help) {
      helpEl = new Element("span", {
        parent: controlsEl,
        cls: "help-inline",
        html: control.help
      });
    }
    this.renderControl(control, controlsEl);
    if (control.tip) {
      tipEl = new Element("span", {
        parent: controlsEl,
        cls: "help-inline",
        html: '<i class="glyphicon glyphicon-question-sign" data-behavior="tooltip" data-placement="top" data-title="' + control.tip + '" />'
      });
    }
    if (control.desc) {
      descEl = new Element("div", {
        parent: controlsEl,
        cls: "help-block",
        html: control.desc
      });
    }
  };

  HorizontalRenderer.prototype.renderControl = function(control, ct) {
    var inputCt;
    if (!control.controlEl) {
      inputCt = new Element('div');
      inputCt.inject(ct);
      control.controlEl = inputCt;
    }
    control.renderControl(control.controlEl);
  };

  return HorizontalRenderer;

})();

module.exports = HorizontalRenderer;


},{}],40:[function(require,module,exports){
var InlineRenderer;

InlineRenderer = (function() {
  InlineRenderer.prototype.options = null;

  function InlineRenderer() {
    this.options = {};
  }

  InlineRenderer.prototype.renderForm = function(form) {
    form.el.addClass('form-inline');
  };

  InlineRenderer.prototype.renderButtons = function(buttons, ct) {
    var button, _i, _len;
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      button = buttons[_i];
      button.render(ct);
    }
  };

  InlineRenderer.prototype.renderGroup = function(control, ct) {
    if (!control.groupEl) {
      control.groupEl = control.el;
      control.groupEl.inject(ct);
      control.groupEl.addClass('form-group');
    }
    if (control.isBoxControl) {
      control.groupEl.addClass('margin-no');
    }
    if (!control.labelRendered) {
      this.renderLabel(control, control.groupEl);
    }
    if (!control.controlsRendered) {
      this.renderControls(control, control.groupEl);
    } else if (!control.controlRendered) {
      this.renderControl(control, control.controlsEl);
    } else if (!control.inputRendered) {
      control.getInput().replace(control.inputEl);
    }
  };

  InlineRenderer.prototype.renderLabel = function(control, ct) {
    var labelEl;
    labelEl = control.renderLabel(ct);
    if (labelEl) {
      labelEl.addClass('sr-only');
    }
  };

  InlineRenderer.prototype.renderControls = function(control, ct) {
    var controlsEl;
    if (!control.controlsEl) {
      controlsEl = new Element('div');
      controlsEl.inject(ct);
      controlsEl.addClass('form-controls');
      control.controlsEl = controlsEl;
    }
    this.renderControl(control, control.controlsEl);
  };

  InlineRenderer.prototype.renderControl = function(control, ct) {
    var inputCt;
    if (!control.controlEl) {
      inputCt = new Element('div');
      inputCt.inject(ct);
      control.controlEl = inputCt;
    }
    control.renderControl(control.controlEl);
  };

  return InlineRenderer;

})();

module.exports = InlineRenderer;


},{}],41:[function(require,module,exports){
var Action,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Action = (function(_super) {
  __extends(Action, _super);

  function Action() {
    return Action.__super__.constructor.apply(this, arguments);
  }

  Action.prototype.name = null;

  Action.prototype.text = null;

  Action.prototype.callback = null;

  Action.prototype.inline = false;

  Action.prototype.confirm = false;

  Action.prototype.confirmPlacement = null;

  Action.prototype.divider = false;

  return Action;

})(Miwo.Object);

module.exports = Action;


},{}],42:[function(require,module,exports){
var ActionColumn, CheckColumn, CheckerColumn, DateColumn, Grid, GridRenderer, LoadMask, NumberColumn, Operations, Paginator, SelectionModel, TextColumn,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SelectionModel = require('../selection/SelectionModel');

GridRenderer = require('./renderer/GridRenderer');

CheckerColumn = require('./column/CheckerColumn');

CheckColumn = require('./column/CheckColumn');

DateColumn = require('./column/DateColumn');

TextColumn = require('./column/TextColumn');

NumberColumn = require('./column/NumberColumn');

ActionColumn = require('./column/ActionColumn');

Operations = require('./Operations');

LoadMask = require('../utils/LoadMask');

Paginator = require('../nav/Paginator');

Grid = (function(_super) {
  __extends(Grid, _super);

  function Grid() {
    return Grid.__super__.constructor.apply(this, arguments);
  }

  Grid.prototype.isGrid = true;

  Grid.prototype.xtype = 'grid';

  Grid.prototype.stripe = false;

  Grid.prototype.nowrap = true;

  Grid.prototype.rowclickable = false;

  Grid.prototype.loadMask = false;

  Grid.prototype.store = null;

  Grid.prototype.renderer = null;

  Grid.prototype.selectable = false;

  Grid.prototype.selector = "auto";

  Grid.prototype.selection = "multi";

  Grid.prototype.groupBy = null;

  Grid.prototype.paginator = false;

  Grid.prototype.actionBtnSize = null;

  Grid.prototype.role = 'grid';

  Grid.prototype.layout = false;

  Grid.prototype.baseCls = "grid";

  Grid.prototype.contentEl = 'div';

  Grid.prototype.checker = null;

  Grid.prototype.operations = null;

  Grid.prototype.selectionModel = null;

  Grid.prototype.headerEl = null;

  Grid.prototype.bodyEl = null;

  Grid.prototype.footerEl = null;

  Grid.prototype.lastAddedColumn = null;

  Grid.prototype.actionColumnIndex = 0;

  Grid.prototype.afterInit = function() {
    Grid.__super__.afterInit.call(this);
    this.contentEl.addClass(this.getBaseCls('container'));
    if (this.loadMask) {
      this.setLoadMask(this.loadMask);
    }
    if (this.store) {
      this.setStore(miwo.store(this.store));
    }
    if (this.renderer) {
      this.rendererOptions = this.renderer;
      this.renderer = null;
    }
  };

  Grid.prototype.addedComponent = function(column) {
    this.lastAddedColumn = column;
  };

  Grid.prototype.addColumn = function(name, column) {
    if (!column.isColumn) {
      throw new Error("Object is not instance of column");
    }
    return this.add(name, column);
  };

  Grid.prototype.addCheckColumn = function(name, config) {
    return this.addColumn(name, new CheckColumn(config));
  };

  Grid.prototype.addCheckerColumn = function(name, config) {
    return this.addColumn(name, new CheckerColumn(config));
  };

  Grid.prototype.addDateColumn = function(name, config) {
    return this.addColumn(name, new DateColumn(config));
  };

  Grid.prototype.addNumberColumn = function(name, config) {
    return this.addColumn(name, new NumberColumn(config));
  };

  Grid.prototype.addTextColumn = function(name, config) {
    return this.addColumn(name, new TextColumn(config));
  };

  Grid.prototype.addActionColumn = function(name, config) {
    return this.addColumn(name, new ActionColumn(config));
  };

  Grid.prototype.addOperation = function(name, config) {
    return this.getOperations().addAction(name, config);
  };

  Grid.prototype.addAction = function(name, config) {
    return this.getActionColumn().addAction(name, config);
  };

  Grid.prototype.getActionColumn = function() {
    if (!this.lastAddedColumn.isActionColumn) {
      this.addActionColumn('actions' + this.actionColumnIndex);
      this.actionColumnIndex++;
    }
    return this.lastAddedColumn;
  };

  Grid.prototype.getOperations = function() {
    if (!this.operations) {
      this.operations = new Operations(this);
    }
    return this.operations;
  };

  Grid.prototype.getColumns = function() {
    return this.getComponents().toArray();
  };

  Grid.prototype.setSelectionModel = function(selectionModel) {
    this.selectionModel = selectionModel;
    if (!this.store) {
      throw new Error("Before set selection model, first set store");
    }
    this.selectionModel.setStore(this.store);
    this.mon(selectionModel, 'change', 'onSelectionModelChange');
  };

  Grid.prototype.getSelectionModel = function() {
    return this.selectionModel;
  };

  Grid.prototype.onSelectionModelChange = function(sm, selection) {
    this.emit('selectionchange', this, sm, selection);
  };

  Grid.prototype.setSelector = function(selector) {
    this.selector = selector;
    this.selector.setGrid(this);
    this.selector.setSelectionModel(this.getSelectionModel());
  };

  Grid.prototype.onOperationSubmit = function(action) {
    var records;
    records = this.getSelectionModel().getRecords();
    if (action.callback) {
      action.callback(records);
    }
    this.emit("action", this, action.name, records);
  };

  Grid.prototype.onActionSubmit = function(action, record) {
    if (action.callback) {
      action.callback(record);
    }
    this.emit("action", this, action.name, [record]);
  };

  Grid.prototype.setLoadMask = function(config) {
    if (config === true) {
      config = {};
    }
    config.target = this.el;
    this.loadMask = new LoadMask(config);
  };

  Grid.prototype.setStore = function(store) {
    this.munon(this.store, store, 'add', 'onStoreAdd');
    this.munon(this.store, store, 'remove', 'onStoreRemove');
    this.munon(this.store, store, 'refresh', 'onStoreRefresh');
    this.munon(this.store, store, 'update', 'onStoreUpdate');
    this.munon(this.store, store, 'beforeload', 'onStoreBeforeload');
    this.munon(this.store, store, 'load', 'onStoreLoad');
    this.munon(this.store, store, 'reload', 'onStoreReload');
    this.store = store;
  };

  Grid.prototype.getStore = function() {
    return this.store;
  };

  Grid.prototype.onStoreAdd = function(store, record) {
    var index;
    index = store.indexOf(record, true);
    if (this.rendered) {
      this.renderer.recordAdded(record, index);
    }
  };

  Grid.prototype.onStoreRemove = function(store, record) {
    if (this.rendered) {
      this.renderer.recordRemoved(record);
    }
  };

  Grid.prototype.onStoreUpdate = function(store, record) {
    var index;
    index = store.indexOf(record, true);
    if (this.rendered) {
      this.renderer.recordUpdated(record, index);
    }
  };

  Grid.prototype.onStoreRefresh = function(store) {
    this.refresh();
  };

  Grid.prototype.onStoreBeforeload = function(store) {
    if (this.loadMask) {
      this.loadMask.show();
    }
  };

  Grid.prototype.onStoreLoad = function(store) {
    this.refresh();
    if (this.loadMask) {
      this.loadMask.hide();
    }
  };

  Grid.prototype.onStoreReload = function(store) {
    this.refresh();
    if (this.loadMask) {
      this.loadMask.hide();
    }
  };

  Grid.prototype.refresh = function() {
    if (this.rendered) {
      this.renderer.refresh();
    }
  };

  Grid.prototype.getRecords = function() {
    return this.store.getRecords();
  };

  Grid.prototype.doRender = function() {
    var config, el, type;
    el = this.getContentEl();
    if (this.selectable || this.operations) {
      if (!this.selectionModel) {
        if (Type.isString(this.selection)) {
          config = {
            type: this.selection
          };
        } else {
          config = this.selection || {};
        }
        this.setSelectionModel(new SelectionModel(config));
      }
      if (!Type.isObject(this.selector) || !this.selector.isSelector) {
        if (Type.isString(this.selector)) {
          type = this.selector;
          config = null;
        } else {
          type = this.selector.type;
          config = this.selector;
        }
        if (type === 'auto') {
          type = this.operations ? 'check' : 'row';
        }
        this.setSelector(miwo.service('selectorFactory').create(type, config));
      }
      if (this.selector.checkerRequired) {
        this.checker = this.addCheckerColumn('checker');
      }
    }
    this.headerEl = new Element("div", {
      parent: el,
      cls: this.getBaseCls("header")
    });
    this.bodyEl = new Element("div", {
      parent: el,
      cls: this.getBaseCls("body")
    });
    this.footerEl = new Element("div", {
      parent: el,
      cls: this.getBaseCls("footer")
    });
    this.getRenderer().render();
  };

  Grid.prototype.afterRender = function() {
    Grid.__super__.afterRender.call(this);
    this.getRenderer().afterRender();
    if (this.store.loaded) {
      this.onRefresh();
    }
  };

  Grid.prototype.getRenderer = function() {
    if (!this.renderer) {
      this.renderer = this.createRenderer(this.rendererOptions);
    }
    return this.renderer;
  };

  Grid.prototype.createRenderer = function(options) {
    return new GridRenderer(this, options);
  };

  Grid.prototype.createComponentPaginator = function() {
    var config, paginator;
    config = this.paginator === true ? {} : this.paginator;
    paginator = new Paginator(config);
    if (this.store) {
      paginator.setStore(this.store);
    }
    return paginator;
  };

  Grid.prototype.onRefresh = function() {
    this.emit("refresh", this);
  };

  Grid.prototype.doDestroy = function() {
    if (this.renderer) {
      this.renderer.destroy();
    }
    if (this.selector) {
      this.selector.destroy();
    }
    if (this.selectionModel) {
      this.selectionModel.destroy();
    }
    this.selectionModel = null;
    this.renderer = null;
    this.selector = null;
    this.store = null;
    Grid.__super__.doDestroy.call(this);
  };

  return Grid;

})(Miwo.Container);

module.exports = Grid;


},{"../nav/Paginator":69,"../selection/SelectionModel":82,"../utils/LoadMask":97,"./Operations":43,"./column/ActionColumn":44,"./column/CheckColumn":45,"./column/CheckerColumn":46,"./column/DateColumn":48,"./column/NumberColumn":49,"./column/TextColumn":50,"./renderer/GridRenderer":52}],43:[function(require,module,exports){
var Action, Button, Operations, PopoverSubmit, Select,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Action = require('./Action');

Button = require('../buttons/Button');

Select = require('../input/Select');

PopoverSubmit = require('./utils/PopoverSubmit');

Operations = (function(_super) {
  __extends(Operations, _super);

  Operations.prototype.componentCls = 'grid-operations';

  Operations.prototype.actions = null;

  Operations.prototype.select = null;

  Operations.prototype.submit = null;

  function Operations(grid, config) {
    this.grid = grid;
    Operations.__super__.constructor.call(this, config);
    this.actions = {};
  }

  Operations.prototype.addAction = function(name, config) {
    var action;
    action = new Action(config);
    action.name = name;
    this.actions[name] = action;
    return action;
  };

  Operations.prototype.doRender = function() {
    var action, name, _ref;
    this.select = new Select({
      id: this.id + '-operation'
    });
    this.select.render(this.el);
    _ref = this.actions;
    for (name in _ref) {
      action = _ref[name];
      this.select.addOption(action.name, action.text);
    }
    this.submit = new Button({
      text: miwo.tr("miwo.grid.execute"),
      handler: (function(_this) {
        return function() {
          action = _this.actions[_this.select.getValue()];
          _this.onOperationSubmit(action);
        };
      })(this)
    });
    this.submit.render(this.el);
  };

  Operations.prototype.onOperationSubmit = function(action) {
    if (!action.confirm) {
      this.grid.onOperationSubmit(action);
    } else {
      this.popover = new PopoverSubmit({
        renderTo: miwo.body,
        target: this.submit.el,
        title: miwo.tr("miwo.grid.confirm"),
        placement: action.confirmPlacement || 'top',
        onSubmit: (function(_this) {
          return function() {
            return _this.grid.onOperationSubmit(action);
          };
        })(this)
      });
      this.popover.show();
    }
  };

  return Operations;

})(Miwo.Component);

module.exports = Operations;


},{"../buttons/Button":6,"../input/Select":63,"./Action":41,"./utils/PopoverSubmit":54}],44:[function(require,module,exports){
var Action, ActionColumn, Button, Column, DropdownButton, PopoverSubmit,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

Action = require('../Action');

Button = require('../../buttons/Button');

DropdownButton = require('../../buttons/DropdownButton');

PopoverSubmit = require('../utils/PopoverSubmit');

ActionColumn = (function(_super) {
  __extends(ActionColumn, _super);

  ActionColumn.prototype.xtype = 'actioncolumn';

  ActionColumn.prototype.actions = null;

  ActionColumn.prototype.align = 'right';

  ActionColumn.prototype.colClass = 'actions';

  ActionColumn.prototype.isActionColumn = true;

  ActionColumn.prototype.btnSize = 'sm';

  ActionColumn.prototype.preventUpdateCell = true;

  ActionColumn.prototype.popover = null;

  ActionColumn.prototype.popoverCell = null;

  function ActionColumn() {
    this.actions = {};
  }

  ActionColumn.prototype.attachedContainer = function(grid) {
    this.btnSize = grid.actionBtnSize || 'sm';
  };

  ActionColumn.prototype.addAction = function(name, config) {
    var action;
    action = new Action(config);
    action.name = name;
    this.actions[name] = action;
    return action;
  };

  ActionColumn.prototype.removeAction = function(name) {
    delete this.actions[name];
    return this;
  };

  ActionColumn.prototype.onRenderCell = function(td, value, record, rowIndex) {
    var action, btn, buttons, inline, list, name, _i, _j, _len, _len1, _ref;
    inline = [];
    list = [];
    buttons = [];
    _ref = this.actions;
    for (name in _ref) {
      action = _ref[name];
      if (action.inline) {
        inline.push(action);
      } else {
        list.push(action);
      }
    }
    for (_i = 0, _len = inline.length; _i < _len; _i++) {
      action = inline[_i];
      btn = new Button({
        size: this.btnSize,
        name: action.name,
        text: action.text,
        handler: (function(_this) {
          return function(btn) {
            _this.onActionClick(_this.actions[btn.name], record, td, btn);
          };
        })(this)
      });
      btn.render(td);
      buttons.push(btn);
    }
    if (list.length > 0) {
      btn = new DropdownButton({
        size: this.btnSize
      });
      for (_j = 0, _len1 = list.length; _j < _len1; _j++) {
        action = list[_j];
        if (action.divider) {
          btn.addDivider();
        }
        btn.addItem(action.name, action.text, (function(_this) {
          return function(item) {
            _this.onActionClick(_this.actions[item.name], record, td, btn);
          };
        })(this));
      }
      btn.render(td);
      buttons.push(btn);
    }
    td.store('buttons', buttons);
  };

  ActionColumn.prototype.onDestroyCell = function(td) {
    var button, buttons, _i, _len;
    buttons = td.retrieve('buttons');
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      button = buttons[_i];
      button.destroy();
    }
    td.eliminate('buttons');
    if (this.popoverCell && this.popoverCell === td) {
      this.closePopover();
    }
  };

  ActionColumn.prototype.onActionClick = function(action, record, td, btn) {
    if (!action.confirm) {
      this.getGrid().onActionSubmit(action, record);
    } else {
      this.closePopover();
      this.popover = new PopoverSubmit({
        renderTo: miwo.body,
        target: btn.el,
        title: miwo.tr("miwo.grid.confirm"),
        placement: action.confirmPlacement || 'left',
        onSubmit: (function(_this) {
          return function() {
            return _this.getGrid().onActionSubmit(action, record);
          };
        })(this),
        onCancel: (function(_this) {
          return function() {
            return _this.closePopover();
          };
        })(this)
      });
      this.popover.show();
      this.popoverCell = td;
    }
  };

  ActionColumn.prototype.closePopover = function() {
    if (!this.popover) {
      return;
    }
    this.popover.destroy();
    this.popover = null;
    this.popoverCell = null;
  };

  return ActionColumn;

})(Column);

module.exports = ActionColumn;


},{"../../buttons/Button":6,"../../buttons/DropdownButton":8,"../Action":41,"../utils/PopoverSubmit":54,"./Column":47}],45:[function(require,module,exports){
var CheckColumn, Column,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

CheckColumn = (function(_super) {
  __extends(CheckColumn, _super);

  function CheckColumn() {
    return CheckColumn.__super__.constructor.apply(this, arguments);
  }

  CheckColumn.prototype.xtype = "checkcolumn";

  CheckColumn.prototype.align = "center";

  CheckColumn.prototype.width = 50;

  CheckColumn.prototype.iconTrue = "glyphicon glyphicon-ok";

  CheckColumn.prototype.iconFalse = "";

  CheckColumn.prototype.formatValue = function(value) {
    if (value) {
      return (this.iconTrue ? "<i class=\"" + this.iconTrue + "\"></i>" : "");
    } else {
      return (this.iconFalse ? "<i class=\"" + this.iconFalse + "\"></i>" : "");
    }
  };

  return CheckColumn;

})(Column);

module.exports = CheckColumn;


},{"./Column":47}],46:[function(require,module,exports){
var Checkbox, CheckerColumn, Column,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

Checkbox = require('../../input/Checkbox');

CheckerColumn = (function(_super) {
  __extends(CheckerColumn, _super);

  CheckerColumn.prototype.xtype = "checkercolumn";

  CheckerColumn.prototype.align = "center";

  CheckerColumn.prototype.width = 50;

  CheckerColumn.prototype.colClass = 'checker';

  CheckerColumn.prototype.isCheckerColumn = true;

  CheckerColumn.prototype.preventUpdateCell = true;

  function CheckerColumn(config) {
    CheckerColumn.__super__.constructor.call(this, config);
  }

  CheckerColumn.prototype.onRenderCell = function(td, value, record) {
    var checkbox;
    checkbox = new Checkbox({
      id: this.getGrid().id.toString() + "-checker-" + record.getId().toString()
    });
    checkbox.render(td);
    checkbox.on('change', (function(_this) {
      return function(checker, value) {
        _this.emit("rowcheck", _this, td.getParent('tr'), value);
      };
    })(this));
    td.set("disableclick", true);
    td.store('checker', checkbox);
  };

  CheckerColumn.prototype.onDestroyCell = function(td) {
    var checkbox;
    checkbox = td.retrieve('checker');
    checkbox.destroy();
    td.eliminate('checker');
  };

  CheckerColumn.prototype.onRenderHeader = function(th) {
    var checkbox;
    checkbox = new Checkbox({
      id: this.getGrid().id.toString() + '-checker-all'
    });
    checkbox.render(th);
    checkbox.on('change', (function(_this) {
      return function(checker, value) {
        _this.emit("headercheck", _this, value);
      };
    })(this));
    th.store('checker', checkbox);
  };

  CheckerColumn.prototype.getRowChecker = function(record) {
    var tr, _i, _len, _ref;
    _ref = this.getGrid().tbodyEl.getChildren();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tr = _ref[_i];
      if (tr.retrieve('record') === record) {
        return tr.getElement('td.grid-col-checker').retrieve('checker');
      }
    }
    return null;
  };

  CheckerColumn.prototype.getHeadChecker = function() {
    return this.getGrid().headerEl.getElement('tr:first-child th.grid-col-checker').retrieve('checker');
  };

  CheckerColumn.prototype.setCheckedRow = function(record, checked) {
    this.getRowChecker(record).setChecked(checked);
  };

  CheckerColumn.prototype.setDisabledRow = function(record, disabled) {
    this.getRowChecker(record).setDisabled(disabled);
  };

  CheckerColumn.prototype.setCheckedHeader = function(checked) {
    this.getHeadChecker().setChecked(checked);
  };

  return CheckerColumn;

})(Column);

module.exports = CheckerColumn;


},{"../../input/Checkbox":56,"./Column":47}],47:[function(require,module,exports){
var Column,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = (function(_super) {
  __extends(Column, _super);

  function Column() {
    return Column.__super__.constructor.apply(this, arguments);
  }

  Column.prototype.isColumn = true;

  Column.prototype.text = '';

  Column.prototype.title = '';

  Column.prototype.visible = true;

  Column.prototype.sortable = false;

  Column.prototype.renderer = null;

  Column.prototype.align = 'left';

  Column.prototype.emptyText = '';

  Column.prototype.widthType = 'auto';

  Column.prototype.width = null;

  Column.prototype.fit = null;

  Column.prototype.dataIndex = '';

  Column.prototype.titleIndex = null;

  Column.prototype.afterInit = function() {
    Column.__super__.afterInit.call(this);
    if (this.fit) {
      this.widthType = 'fit';
      delete this.fit;
    }
  };

  Column.prototype.getGrid = function() {
    return this.container;
  };

  Column.prototype.getDataIndex = function() {
    return this.dataIndex || this.name;
  };

  Column.prototype.renderHeader = function(value, record) {
    return this.text;
  };

  Column.prototype.renderValue = function(value, record) {
    var html;
    if (this.renderer) {
      html = this.renderer(value, record);
    } else {
      if (value === '' || value === void 0 || value === null) {
        html = this.emptyText;
      } else {
        html = this.formatValue(value, record);
      }
    }
    return html;
  };

  Column.prototype.formatValue = function(value, record) {
    return value;
  };

  Column.prototype.afterRender = function(renderer, grid) {};

  return Column;

})(Miwo.Component);

module.exports = Column;


},{}],48:[function(require,module,exports){
var Column, DateColumn,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

DateColumn = (function(_super) {
  __extends(DateColumn, _super);

  function DateColumn() {
    return DateColumn.__super__.constructor.apply(this, arguments);
  }

  DateColumn.prototype.xtype = 'datecolumn';

  DateColumn.prototype.align = 'right';

  DateColumn.prototype.emptyText = 'N/A';

  DateColumn.prototype.format = '%c';

  DateColumn.prototype.formatValue = function(value, record) {
    if (Type.isDate(value)) {
      return value.format(this.format);
    } else {
      return value;
    }
  };

  return DateColumn;

})(Column);

module.exports = DateColumn;


},{"./Column":47}],49:[function(require,module,exports){
var Column, NumberColumn,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

NumberColumn = (function(_super) {
  __extends(NumberColumn, _super);

  function NumberColumn() {
    return NumberColumn.__super__.constructor.apply(this, arguments);
  }

  NumberColumn.prototype.xtype = 'numbercolumn';

  NumberColumn.prototype.align = 'right';

  return NumberColumn;

})(Column);

module.exports = NumberColumn;


},{"./Column":47}],50:[function(require,module,exports){
var Column, TextColumn,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Column = require('./Column');

TextColumn = (function(_super) {
  __extends(TextColumn, _super);

  function TextColumn() {
    return TextColumn.__super__.constructor.apply(this, arguments);
  }

  TextColumn.prototype.xtype = 'textcolumn';

  return TextColumn;

})(Column);

module.exports = TextColumn;


},{"./Column":47}],51:[function(require,module,exports){
module.exports = {
  Grid: require('./Grid'),
  Action: require('./Action'),
  Operations: require('./Operations'),
  column: {
    Column: require('./column/Column'),
    NumberColumn: require('./column/NumberColumn'),
    DateColumn: require('./column/DateColumn'),
    CheckColumn: require('./column/CheckColumn'),
    CheckerColumn: require('./column/CheckerColumn'),
    TextColumn: require('./column/TextColumn'),
    ActionColumn: require('./column/ActionColumn')
  },
  renderer: {
    GridRenderer: require('./renderer/GridRenderer'),
    WidthManager: require('./renderer/WidthManager')
  },
  utils: {
    PopoverSubmit: require('./utils/PopoverSubmit')
  }
};


},{"./Action":41,"./Grid":42,"./Operations":43,"./column/ActionColumn":44,"./column/CheckColumn":45,"./column/CheckerColumn":46,"./column/Column":47,"./column/DateColumn":48,"./column/NumberColumn":49,"./column/TextColumn":50,"./renderer/GridRenderer":52,"./renderer/WidthManager":53,"./utils/PopoverSubmit":54}],52:[function(require,module,exports){
var GridRenderer, WidthManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WidthManager = require('./WidthManager');

GridRenderer = (function(_super) {
  __extends(GridRenderer, _super);

  GridRenderer.prototype.dblclickdelay = 0;

  GridRenderer.prototype.grid = null;

  GridRenderer.prototype.columns = null;

  GridRenderer.prototype.thead = null;

  GridRenderer.prototype.tfoot = null;

  GridRenderer.prototype.tbody = null;

  GridRenderer.prototype.tfilters = null;

  GridRenderer.prototype.widthManager = null;

  GridRenderer.prototype.cellclickTimeoutId = null;

  function GridRenderer(grid, config) {
    this.grid = grid;
    GridRenderer.__super__.constructor.call(this, config);
    this.columns = [];
    this.widthManager = new WidthManager(this, this.widthManager);
    return;
  }

  GridRenderer.prototype.render = function() {
    var bodyEl, column, grid, tbodyTable, theadTable, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    grid = this.grid;
    grid.on("parentshown", this.bound('onGridParentShown'));
    grid.on("selectionchange", this.bound('onSelectionChanged'));
    _ref = grid.getColumns();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      if (column.isCheckerColumn) {
        this.columns.push(column);
      }
    }
    _ref1 = grid.getColumns();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      column = _ref1[_j];
      if (!column.isCheckerColumn) {
        this.columns.push(column);
      }
    }
    bodyEl = grid.bodyEl;
    if (grid.stripe) {
      bodyEl.addClass('grid-stripe');
    }
    if (grid.nowrap) {
      bodyEl.addClass('grid-nowrap');
    }
    if (grid.rowclickable) {
      bodyEl.addClass('grid-rowclickable');
    }
    theadTable = new Element("table");
    theadTable.inject(grid.headerEl);
    this.renderHeader(theadTable);
    this.renderFilters(theadTable);
    tbodyTable = new Element("table");
    tbodyTable.inject(grid.bodyEl);
    this.renderBody(tbodyTable);
    this.renderFooter(grid.footerEl);
    grid.emit("render", grid);
    _ref2 = this.columns;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      column = _ref2[_k];
      column.afterRender();
    }
  };

  GridRenderer.prototype.afterRender = function() {
    this.widthManager.actualize();
  };

  GridRenderer.prototype.refresh = function() {
    this.destroyRows(this.tbody);
    this.renderBody(this.tbody);
    this.widthManager.actualize();
    this.grid.onRefresh();
  };

  GridRenderer.prototype.recordAdded = function(record) {
    this.renderRow(this.tbody, record, this.tbody.getChildren().length);
    this.syncRows();
  };

  GridRenderer.prototype.recordRemoved = function(record) {
    var tr;
    tr = this.getRowById(record.getId());
    if (tr) {
      this.destroyRow(tr);
      this.syncRows();
    }
  };

  GridRenderer.prototype.recordUpdated = function(record) {
    var tr;
    tr = this.getRowById(record.getId());
    if (tr) {
      this.updateRow(tr, record);
      this.syncRows();
    } else {
      this.renderRow(this.tbody, record);
      this.syncRows();
    }
  };

  GridRenderer.prototype.renderHeader = function(theadTable) {
    var column, th, thead, tr, _i, _len, _ref;
    thead = new Element("thead", {
      cls: "grid-headers"
    });
    thead.inject(theadTable);
    this.thead = thead;
    tr = new Element("tr").inject(thead);
    _ref = this.columns;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      th = new Element("th").inject(tr);
      th.addClass('text-' + column.align);
      if (column.colClass) {
        th.addClass('grid-col-' + column.colClass);
      }
      th.set("column", column.name);
      th.set("html", column.renderHeader());
      if (column.title) {
        th.set("title", column.title);
      }
      if (!column.visible) {
        th.setVisible(false);
      }
      if (column.onRenderHeader) {
        column.onRenderHeader(th);
      }
      this.grid.emit("headerrender", this.grid, th, column);
    }
  };

  GridRenderer.prototype.renderFilters = function(theadTable) {};

  GridRenderer.prototype.renderBody = function(tbodyTable) {
    var groups, name, record, records, tbody, value, _i, _len;
    tbody = new Element("tbody", {
      cls: "grid-rows"
    });
    tbody.inject(tbodyTable);
    tbody.on("click:relay(td)", this.bound('onCellClick'));
    tbody.on("dblclick:relay(td)", this.bound('onCellDblClick'));
    this.tbody = tbody;
    this.grid.tbodyEl = tbody;
    records = this.grid.getRecords();
    if (this.grid.groupBy) {
      groups = {};
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        record = records[_i];
        value = record.get(this.grid.groupBy);
        if (!groups[value]) {
          groups[value] = [];
        }
        groups[value].push(record);
      }
      for (name in groups) {
        records = groups[name];
        this.renderGroup(tbody, name);
        this.renderRows(tbody, records);
      }
    } else {
      this.renderRows(tbody, records);
    }
    this.reindexRows();
  };

  GridRenderer.prototype.renderGroup = function(tbody, name) {
    var td, tr;
    tr = new Element("tr", {
      cls: "grid-row-group",
      parent: tbody,
      'data-group': name
    });
    tr.store("rowid", 'group-' + name);
    td = new Element("td", {
      html: name,
      colspan: this.columns.length,
      parent: tr
    });
    this.grid.emit("grouprender", this.grid, td, name);
  };

  GridRenderer.prototype.renderRows = function(tbody, records) {
    var index, record, _i, _len;
    for (index = _i = 0, _len = records.length; _i < _len; index = ++_i) {
      record = records[index];
      this.renderRow(tbody, record, index);
    }
  };

  GridRenderer.prototype.renderRow = function(tbody, record, index) {
    var column, tr, _i, _len, _ref;
    tr = new Element("tr", {
      cls: "grid-row-data"
    });
    tr.store("record", record);
    tr.store("rowid", record.getId());
    tr.set("data-row", record.getId());
    tr.inject(tbody);
    _ref = this.columns;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      this.renderCell(tr, record, column);
    }
    this.grid.emit("rowrender", this.grid, tr, record, index);
  };

  GridRenderer.prototype.updateRow = function(tr, record) {
    var cells, column, td, _i, _j, _len, _len1, _ref, _ref1;
    cells = {};
    _ref = tr.getElements('td');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      td = _ref[_i];
      cells[td.get('column')] = td;
    }
    _ref1 = this.columns;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      column = _ref1[_j];
      if (!column.preventUpdateCell) {
        this.updateCell(cells[column.name], record, column);
      }
    }
  };

  GridRenderer.prototype.renderCell = function(tr, record, column) {
    var td;
    td = new Element("td").inject(tr);
    if (column.colClass) {
      td.addClass('grid-col-' + column.colClass);
    }
    td.addClass("text-" + column.align);
    td.store("dataIndex", column.getDataIndex());
    td.set("column", column.name);
    if (column.titleIndex) {
      td.set("title", record.get(column.titleIndex));
    }
    if (!column.visible) {
      td.setVisible(false);
    }
    this.updateCell(td, record, column);
  };

  GridRenderer.prototype.updateCell = function(td, record, column) {
    var dataIndex, value;
    dataIndex = column.getDataIndex();
    value = record.get(dataIndex);
    td.set("html", column.renderValue(value, record));
    if (column.onRenderCell) {
      column.onRenderCell(td, value, record);
    }
    this.grid.emit("cellrender", this.grid, td, value, record);
  };

  GridRenderer.prototype.destroyRows = function(tbody) {
    var tr, _i, _len, _ref;
    _ref = tbody.getElements("tr");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tr = _ref[_i];
      this.destroyRow(tr);
    }
  };

  GridRenderer.prototype.destroyRow = function(tr) {
    var record, td, _i, _len, _ref;
    record = tr.retrieve("record");
    tr.eliminate("record");
    tr.eliminate("rowid");
    this.grid.emit("rowdestroy", this.grid, tr);
    _ref = tr.getElements("td");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      td = _ref[_i];
      this.destroyCell(td, record);
    }
    tr.destroy();
  };

  GridRenderer.prototype.destroyCell = function(td, record) {
    var column;
    column = this.grid.get(td.get("column"));
    if (column.onDestroyCell) {
      column.onDestroyCell(td, record);
    }
    this.grid.emit("celldestroy", this.grid, td);
    td.eliminate("dataIndex");
  };

  GridRenderer.prototype.syncRows = function() {
    var groupName, groupRow, groups, i, id, len, limit, name, positions, rec, record, records, row, rows, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _n, _ref, _ref1;
    records = this.grid.getRecords();
    if (!this.grid.groupBy) {
      positions = [];
      for (_i = 0, _len = records.length; _i < _len; _i++) {
        rec = records[_i];
        positions.push(rec.getId());
      }
    } else {
      groups = {};
      for (_j = 0, _len1 = records.length; _j < _len1; _j++) {
        record = records[_j];
        value = record.get(this.grid.groupBy);
        if (!groups[value]) {
          groups[value] = [];
        }
        groups[value].push(record);
      }
      for (name in groups) {
        records = groups[name];
        groupRow = this.tbody.getElement("tr.grid-row-group[data-group='" + name + "']");
        if (!groupRow) {
          this.renderGroup(this.tbody, name);
        }
      }
      _ref = this.tbody.getElements("tr.grid-row-group");
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        groupRow = _ref[_k];
        groupName = groupRow.get('data-group');
        if (!groups[groupName]) {
          groupRow.destroy();
        }
      }
      positions = [];
      for (name in groups) {
        records = groups[name];
        positions.push('group-' + name);
        for (_l = 0, _len3 = records.length; _l < _len3; _l++) {
          record = records[_l];
          positions.push(record.getId());
        }
      }
    }
    rows = {};
    _ref1 = this.tbody.getChildren();
    for (_m = 0, _len4 = _ref1.length; _m < _len4; _m++) {
      row = _ref1[_m];
      rows[row.retrieve('rowid')] = row;
    }
    len = positions.length;
    limit = Math.round(len / 2);
    for (i = _n = 0; _n <= limit; i = _n += +1) {
      id = positions.shift();
      row = rows[id];
      if (row) {
        this.syncRow(row, i);
      }
      id = positions.pop();
      row = rows[id];
      if (row) {
        this.syncRow(row, len - i - 1);
      }
    }
    this.reindexRows();
  };

  GridRenderer.prototype.syncRow = function(row, position) {
    var prevRow;
    if (row.getIndex() !== position) {
      if (position === 0) {
        row.inject(this.tbody, 'top');
      } else {
        prevRow = this.tbody.getElement('tr:nth-child("' + position + '")');
        row.inject(prevRow, 'after');
      }
    }
  };

  GridRenderer.prototype.reindexRows = function() {
    var index, row, _i, _len, _ref;
    index = 0;
    _ref = this.tbody.getChildren();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      if (row.hasClass('grid-row-data')) {
        row.set('row-index', index++);
      }
    }
  };

  GridRenderer.prototype.renderFooter = function(footerEl) {
    var hasSelection, paginator, showFooter;
    showFooter = false;
    if (this.grid.paginator) {
      paginator = this.grid.get('paginator');
      paginator.el.addClass('grid-paginator');
      paginator.render(footerEl);
    }
    if (this.grid.operations) {
      showFooter = true;
      hasSelection = this.grid.getSelectionModel().hasSelection();
      this.grid.operations.render(footerEl);
      this.grid.operations.setVisible(hasSelection);
    }
    if (!showFooter) {
      footerEl.hide();
      this.grid.el.addClass('grid-nofooter');
    }
  };

  GridRenderer.prototype.onSelectionChanged = function(grid, sm, selection) {
    var hasSelection;
    hasSelection = selection.length > 0;
    if (this.grid.operations) {
      this.grid.operations.setVisible(hasSelection);
    }
  };

  GridRenderer.prototype.onCellClick = function(e, td) {
    if (td.get("disableclick")) {
      return;
    }
    if (e.target.tagName === "A") {
      return;
    }
    clearTimeout(this.cellclickTimeoutId);
    this.cellclickTimeoutId = ((function(_this) {
      return function() {
        var info;
        info = _this.getCellInfo(td);
        _this.grid.emit("cellclick", _this.grid, td, info.record, info, e);
        if (_this.grid.rowclickable) {
          _this.grid.emit("rowclick", _this.grid, info.record, info, e);
        }
      };
    })(this)).delay(this.dblclickdelay);
  };

  GridRenderer.prototype.onCellDblClick = function(e, td) {
    var info;
    if (td.get("disableclick")) {
      return;
    }
    if (e.target.tagName === "A") {
      return;
    }
    clearTimeout(this.cellclickTimeoutId);
    info = this.getCellInfo(td);
    this.grid.emit("celldblclick", this.grid, td, info.record, info, e);
    if (this.grid.rowclickable) {
      this.grid.emit("rowdblclick", this.grid, info.record, info, e);
    }
  };

  GridRenderer.prototype.getCellInfo = function(td) {
    var dataIndex, record, tr;
    tr = td.getParent();
    dataIndex = td.retrieve("dataIndex");
    record = tr.retrieve("record");
    return {
      tr: tr,
      cellIndex: td.getIndex(),
      rowIndex: tr.getIndex(),
      record: record,
      value: record.get(dataIndex),
      dataIndex: dataIndex,
      column: td.get("column")
    };
  };

  GridRenderer.prototype.getRowById = function(id) {
    var tr, _i, _len, _ref;
    _ref = this.tbody.getElements("tr");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tr = _ref[_i];
      if (tr.retrieve('rowid') === id) {
        return tr;
      }
    }
    return null;
  };

  GridRenderer.prototype.onGridParentShown = function(component) {
    this.widthManager.actualize();
  };

  GridRenderer.prototype.doDestroy = function() {
    this.widthManager.destroy();
    this.grid.un("parentshown", this.bound('onGridParentShown'));
    this.grid.un("selectionchange", this.bound('onSelectionChanged'));
    this.destroyRows(this.tbody);
    this.grid = this.tbody = this.tfilters = this.thead = this.tfoot = null;
    GridRenderer.__super__.doDestroy.call(this);
  };

  return GridRenderer;

})(Miwo.Object);

module.exports = GridRenderer;


},{"./WidthManager":53}],53:[function(require,module,exports){
var WidthManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WidthManager = (function(_super) {
  __extends(WidthManager, _super);

  WidthManager.prototype.defaultFitWidth = 100;

  WidthManager.prototype.renderer = null;

  function WidthManager(renderer, config) {
    this.renderer = renderer;
    WidthManager.__super__.constructor.call(this, config);
    window.on("resize", this.bound("onWindowResize"));
    return;
  }

  WidthManager.prototype.actualize = function() {
    var column, columns, fitWidth, freeWidth, isFit, name, renderer, td, th, theadRow, totalFit, tr, width, widths, wildCount, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
    renderer = this.renderer;
    freeWidth = renderer.grid.bodyEl.getWidth();
    totalFit = 0;
    widths = {};
    isFit = false;
    columns = [];
    _ref = renderer.columns;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      if (column.isVisible()) {
        columns.push(column);
        if (column.widthType === "fit") {
          isFit = true;
        }
      }
    }
    wildCount = 0;
    for (_j = 0, _len1 = columns.length; _j < _len1; _j++) {
      column = columns[_j];
      name = column.name;
      if (column.widthType === "auto") {
        if (column.width) {
          widths[name] = column.width;
        } else if (isFit) {
          widths[name] = this.defaultFitWidth;
        } else {
          widths[name] = null;
          wildCount++;
        }
        if (widths[name]) {
          freeWidth -= widths[name];
        }
      }
      if (column.widthType === "fit") {
        widths[name] = null;
        totalFit += (column.width ? column.width : 1);
      }
    }
    for (_k = 0, _len2 = columns.length; _k < _len2; _k++) {
      column = columns[_k];
      if (column.widthType === "fit") {
        fitWidth = ((freeWidth * column.width) / totalFit).round();
        if (fitWidth < column.minWidth) {
          widths[column.name] = column.minWidth;
          freeWidth -= column.minWidth;
        } else {
          widths[column.name] = fitWidth;
        }
      } else if (column.widthType === "auto") {
        if (widths[column.name] === null) {
          widths[column.name] = (freeWidth / wildCount).round();
        }
      }
    }
    theadRow = renderer.thead;
    for (name in widths) {
      width = widths[name];
      if (width !== null) {
        th = theadRow.getElement("tr th[column=\"" + name + "\"]");
        th.setStyle("width", width);
        th.setStyle("max-width", width);
      }
    }
    _ref1 = renderer.tbody.getElements("tr.grid-row-data");
    for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
      tr = _ref1[_l];
      for (name in widths) {
        width = widths[name];
        if (width !== null) {
          td = tr.getElement("td[column=\"" + name + "\"]");
          td.setStyle("width", width);
          td.setStyle("max-width", width);
        }
      }
    }
  };

  WidthManager.prototype.onWindowResize = function() {
    this.actualize();
  };

  WidthManager.prototype.doDestroy = function() {
    window.un("resize", this.bound("onWindowResize"));
    this.renderer = null;
    WidthManager.__super__.doDestroy.call(this);
  };

  return WidthManager;

})(Miwo.Object);

module.exports = WidthManager;


},{}],54:[function(require,module,exports){
var Button, Popover, PopoverSubmit,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Popover = require('../../tip/Popover');

Button = require('../../buttons/Button');

PopoverSubmit = (function(_super) {
  __extends(PopoverSubmit, _super);

  function PopoverSubmit() {
    return PopoverSubmit.__super__.constructor.apply(this, arguments);
  }

  PopoverSubmit.prototype.onSubmit = null;

  PopoverSubmit.prototype.onCancel = null;

  PopoverSubmit.prototype.width = 140;

  PopoverSubmit.prototype.doInit = function() {
    var buttonNo, buttonYes;
    PopoverSubmit.__super__.doInit.call(this);
    this.el.addClass('grid-popover-submit');
    buttonYes = new Button({
      text: 'Yes',
      type: 'primary',
      handler: (function(_this) {
        return function() {
          if (_this.onSubmit) {
            _this.onSubmit();
          }
          _this.close();
        };
      })(this)
    });
    this.add('yes', buttonYes);
    buttonNo = new Button({
      text: 'No',
      type: 'default',
      handler: (function(_this) {
        return function() {
          if (_this.onCancel) {
            _this.onCancel();
          }
          _this.close();
        };
      })(this)
    });
    this.add('no', buttonNo);
  };

  return PopoverSubmit;

})(Popover);

module.exports = PopoverSubmit;


},{"../../buttons/Button":6,"../../tip/Popover":90}],55:[function(require,module,exports){
miwo.registerExtension('miwoui', require('./DiExtension'));

Miwo.ui = {};

Miwo.notify = require('./notify');

Miwo.buttons = require('./buttons');

Miwo.dropdown = require('./dropdown');

Miwo.input = require('./input');

Miwo.picker = require('./picker');

Miwo.nav = require('./nav');

Miwo.form = require('./form');

Miwo.Form = Miwo.form.container.Form;

Miwo.window = require('./window');

Miwo.Window = Miwo.window.Window;

Miwo.FormWindow = Miwo.window.FormWindow;

Miwo.tabs = require('./tabs');

Miwo.Tabs = Miwo.tabs.Tabs;

Miwo.selection = require('./selection');

Miwo.grid = require('./grid');

Miwo.Grid = Miwo.grid.Grid;

Miwo.tip = require('./tip');

Miwo.ui.DiExtension = require('./DiExtension');

Miwo.ui.utils = require('./utils');


},{"./DiExtension":1,"./buttons":10,"./dropdown":14,"./form":37,"./grid":51,"./input":67,"./nav":70,"./notify":72,"./picker":78,"./selection":84,"./tabs":87,"./tip":94,"./utils":100,"./window":106}],56:[function(require,module,exports){
var Checkbox,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Checkbox = (function(_super) {
  __extends(Checkbox, _super);

  function Checkbox() {
    return Checkbox.__super__.constructor.apply(this, arguments);
  }

  Checkbox.prototype.isInput = true;

  Checkbox.prototype.xtype = 'checkbox';

  Checkbox.prototype.label = '';

  Checkbox.prototype.disabled = false;

  Checkbox.prototype.checked = false;

  Checkbox.prototype.inputEl = null;

  Checkbox.prototype.iconEl = null;

  Checkbox.prototype.labelEl = null;

  Checkbox.prototype.textEl = null;

  Checkbox.prototype.doRender = function() {
    this.el.addClass('checkbox');
    this.el.set('html', '<label miwo-reference="labelEl" for="' + this.getInputId() + '">' + '<span class="checker">' + '<i miwo-reference="iconEl" class="fa"></i>' + '<input miwo-reference="inputEl" type="checkbox" id="' + this.getInputId() + '">' + '</span>' + '<span miwo-reference="textEl" class="label-text">' + this.label + '</span>' + '</label>');
  };

  Checkbox.prototype.afterRender = function() {
    Checkbox.__super__.afterRender.apply(this, arguments);
    this.inputEl.on('change', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setChecked(_this.getValue());
        _this.emit('change', _this, _this.getValue());
      };
    })(this));
    this.inputEl.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.el.addClass('focus');
        _this.emit('focus', _this);
      };
    })(this));
    this.inputEl.on('blur', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.el.removeClass('focus');
        _this.emit('blur', _this);
      };
    })(this));
    this.setChecked(this.checked);
  };

  Checkbox.prototype.setChecked = function(checked) {
    this.checked = checked;
    if (!this.rendered) {
      return;
    }
    this.el.toggleClass('checked', checked);
    this.inputEl.set('checked', checked);
    this.iconEl.removeClass('fa-check-square-o').removeClass('fa-square-o');
    this.iconEl.addClass(checked ? 'fa-check-square-o' : 'fa-square-o');
  };

  Checkbox.prototype.isChecked = function() {
    if (this.rendered) {
      return this.inputEl.get('checked');
    } else {
      return this.checked;
    }
  };

  Checkbox.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    if (!this.rendered) {
      return;
    }
    this.el.toggleClass('disabled', disabled);
    this.inputEl.set('disabled', disabled);
  };

  Checkbox.prototype.setLabel = function(label) {
    this.label = label;
    if (!this.rendered) {
      return;
    }
    this.textEl.set('text', label);
  };

  Checkbox.prototype.setValue = function(checked) {
    this.setChecked(checked);
  };

  Checkbox.prototype.getValue = function() {
    return this.isChecked();
  };

  Checkbox.prototype.getInputEl = function() {
    return this.inputEl;
  };

  Checkbox.prototype.getInputId = function() {
    return this.id + '-input';
  };

  return Checkbox;

})(Miwo.Component);

module.exports = Checkbox;


},{}],57:[function(require,module,exports){
var Checkbox, CheckboxList,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Checkbox = require('./Checkbox');

CheckboxList = (function(_super) {
  __extends(CheckboxList, _super);

  function CheckboxList() {
    return CheckboxList.__super__.constructor.apply(this, arguments);
  }

  CheckboxList.prototype.xtype = 'checkboxlist';

  CheckboxList.prototype.isInput = true;

  CheckboxList.prototype.inline = false;

  CheckboxList.prototype.componentCls = 'checkboxlist';

  CheckboxList.prototype.setChecked = function(name, checked) {
    this.get(name).setChecked(checked);
  };

  CheckboxList.prototype.setDisabled = function(name, disabled) {
    if (Type.isString(name)) {
      this.get(name).setDisabled(disabled);
    } else {
      disabled = name;
      this.components.each((function(_this) {
        return function(checkbox) {
          return checkbox.setDisabled(disabled);
        };
      })(this));
    }
  };

  CheckboxList.prototype.setValue = function(value) {
    this.components.each((function(_this) {
      return function(checkbox, name) {
        return checkbox.setChecked(value.indexOf(name) >= 0);
      };
    })(this));
  };

  CheckboxList.prototype.getValue = function() {
    var value;
    value = [];
    this.components.each((function(_this) {
      return function(checkbox, name) {
        if (checkbox.isChecked() && !checkbox.disabled) {
          return value.push(name);
        }
      };
    })(this));
    return value;
  };

  CheckboxList.prototype.addItem = function(name, label) {
    this.add(name, this.createCheckbox(name, label));
  };

  CheckboxList.prototype.createCheckbox = function(name, label) {
    var checkbox;
    checkbox = new Checkbox({
      id: this.id + '-' + name,
      label: label,
      cls: this.inline ? 'checkbox-inline' : null
    });
    checkbox.on('change', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.emit('change', _this);
      };
    })(this));
    checkbox.on('blur', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.emit('blur', _this);
      };
    })(this));
    checkbox.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.emit('focus', _this);
      };
    })(this));
    return checkbox;
  };

  CheckboxList.prototype.clear = function() {
    this.components.each((function(_this) {
      return function(component, name) {
        _this.removeComponent(name);
        component.destroy();
      };
    })(this));
  };

  return CheckboxList;

})(Miwo.Container);

module.exports = CheckboxList;


},{"./Checkbox":56}],58:[function(require,module,exports){
var Button, ColorInput,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('../buttons/Button');

ColorInput = (function(_super) {
  __extends(ColorInput, _super);

  function ColorInput() {
    return ColorInput.__super__.constructor.apply(this, arguments);
  }

  ColorInput.prototype.xtype = "colorinput";

  ColorInput.prototype.value = '#ffffff';

  ColorInput.prototype.resetable = true;

  ColorInput.prototype.resetBtn = null;

  ColorInput.prototype.popover = null;

  ColorInput.prototype.doRender = function() {
    this.el.addClass('colorfield');
    this.inputEl = new Element('input', {
      id: this.getInputId(),
      cls: 'form-control',
      type: 'color'
    });
    this.inputEl.inject(this.el);
    this.resetBtn = new Button({
      icon: 'remove',
      handler: (function(_this) {
        return function() {
          return _this.emit('reset', _this);
        };
      })(this)
    });
    this.resetBtn.render(this.el);
    this.inputEl.on('click', (function(_this) {
      return function(event) {
        event.stop();
        _this.openPicker();
      };
    })(this));
  };

  ColorInput.prototype.afterRender = function() {
    ColorInput.__super__.afterRender.call(this);
    if (this.disabled) {
      this.setDisabled(this.disabled);
    }
    if (this.resetable) {
      this.setResetable(this.resetable);
    }
  };

  ColorInput.prototype.setValue = function(value) {
    this.value = value;
    if (!this.rendered) {
      return;
    }
    this.inputEl.set("value", value);
  };

  ColorInput.prototype.getValue = function() {
    if (this.rendered) {
      return this.inputEl.get("value");
    } else {
      return this.value;
    }
  };

  ColorInput.prototype.setDisabled = function(disabled) {
    ColorInput.__super__.setDisabled.call(this, disabled);
    if (!this.rendered) {
      return;
    }
    this.inputEl.toggleClass('disabled', disabled);
    if (this.resetBtn) {
      this.resetBtn.setDisabled(disabled);
    }
  };

  ColorInput.prototype.setResetable = function(resetable) {
    this.resetable = resetable;
    if (!this.rendered) {
      return;
    }
    if (this.resetBtn) {
      this.resetBtn.setVisible(resetable);
    }
  };

  ColorInput.prototype.openPicker = function() {
    var picker;
    if (!this.popover) {
      this.popover = this.createPicker();
    }
    this.popover.target = this.inputEl;
    this.popover.show();
    picker = this.popover.get('picker');
    picker.setColor(this.getValue());
    this.mon(picker, 'colorchange', 'onPickerColorChange');
    this.mon(picker, 'selected', 'onPickerColorSelected');
  };

  ColorInput.prototype.hidePicker = function() {
    var picker;
    this.popover.hide();
    picker = this.popover.get('picker');
    this.mun(picker, 'colorchange', 'onPickerColorChange');
    this.mun(picker, 'selected', 'onPickerColorSelected');
  };

  ColorInput.prototype.createPicker = function() {
    return miwo.pickers.get('color');
  };

  ColorInput.prototype.onPickerColorChange = function(picker, hex) {
    this.emit("colorchange", this, hex);
    this.setValue("#" + hex);
  };

  ColorInput.prototype.onPickerColorSelected = function(picker, hex) {
    this.emit('changed', this, hex);
    this.setValue("#" + hex);
    this.hidePicker();
  };

  ColorInput.prototype.getInputEl = function() {
    return this.inputEl;
  };

  ColorInput.prototype.getInputId = function() {
    return this.id + '-input';
  };

  ColorInput.prototype.doDestroy = function() {
    this.popover = null;
    return ColorInput.__super__.doDestroy.apply(this, arguments);
  };

  return ColorInput;

})(Miwo.Component);

module.exports = ColorInput;


},{"../buttons/Button":6}],59:[function(require,module,exports){
var Combo, ScreenMask,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScreenMask = require('../utils/ScreenMask');

Combo = (function(_super) {
  __extends(Combo, _super);

  Combo.prototype.isInput = true;

  Combo.prototype.xtype = 'combo';

  Combo.prototype.role = 'combobox';

  Combo.prototype.hideSelected = true;

  Combo.prototype.multiple = false;

  Combo.prototype.height = null;

  Combo.prototype.placeholder = '';

  Combo.prototype.prompt = false;

  Combo.prototype.items = null;

  Combo.prototype.disabled = false;

  Combo.prototype.opened = false;

  Combo.prototype.inputEl = null;

  Combo.prototype.resetEl = null;

  Combo.prototype.dropdownEl = null;

  Combo.prototype.dropdownItemsEl = null;

  Combo.prototype.activeItemIndex = -1;

  Combo.prototype.activeValueIndex = -1;

  Combo.prototype.active = false;

  Combo.prototype.screenMask = null;

  function Combo(config) {
    Combo.__super__.constructor.call(this, config);
    this.items = [];
    return;
  }

  Combo.prototype.afterInit = function() {
    Combo.__super__.afterInit.call(this);
    this.el.set('html', '<div class="combo-input">' + '<span class="combo-input-text">' + this.placeholder + '</span>' + '<span class="combo-input-reset" style="display: none;"><i class="glyphicon glyphicon glyphicon-remove"></i></span>' + '<span class="combo-input-arrow"><i class="glyphicon glyphicon-chevron-down"></i></span>' + '</div>' + '<input class="screen-off" id="' + this.id + 'Input" type="text" role="button" aria-haspopup="true" aria-labelledby="' + this.id + 'Input" >');
    this.control = this.el.getElement('.combo-input');
    this.inputEl = this.el.getElement('input');
    this.textEl = this.el.getElement('.combo-input-text');
    this.resetEl = this.el.getElement('.combo-input-reset');
    this.screenMask = new ScreenMask((function(_this) {
      return function() {
        return _this.close();
      };
    })(this));
    this.dropdownEl = new Element('div', {
      cls: 'combo-dropdown'
    });
    this.dropdownItemsEl = new Element('div', {
      cls: 'combo-dropdown-items',
      parent: this.dropdownEl
    });
  };

  Combo.prototype.doRender = function() {
    this.el.addClass('form-control combo combo-empty');
    if (this.height) {
      this.el.setStyle('height', this.height);
    }
    if (this.disabled) {
      this.el.addClass('disabled');
    }
    this.el.on('click', (function(_this) {
      return function(event) {
        if (_this.disabled) {
          return;
        }
        _this.open();
      };
    })(this));
    this.dropdownEl.on('click:relay(.combo-dropdown-item)', (function(_this) {
      return function(event, target) {
        var val;
        event.stop();
        val = target.get('data-value');
        _this.setValue((_this.multiple ? _this.getValue().include(val) : val));
        _this.close();
      };
    })(this));
    this.dropdownEl.on('mouseenter:relay(.combo-dropdown-item)', (function(_this) {
      return function(event, target) {
        event.stop();
        _this.activateItem(target.get('data-index'));
      };
    })(this));
    this.textEl.on('click:relay(.combo-input-text li)', (function(_this) {
      return function(event, target) {
        var val;
        if (_this.disabled) {
          return;
        }
        event.stop();
        val = target.get('data-value');
        _this.setValue(_this.getValue().erase(val));
      };
    })(this));
    this.textEl.on('mouseenter:relay(li)', (function(_this) {
      return function(event, target) {
        if (_this.disabled) {
          return;
        }
        event.stop();
        _this.activateValue(parseInt(target.get('data-index')));
      };
    })(this));
    this.textEl.on('mouseleave:relay(li)', (function(_this) {
      return function(event, target) {
        if (_this.disabled) {
          return;
        }
        event.stop();
        _this.activateValue(-1);
      };
    })(this));
    this.resetEl.on('click', (function(_this) {
      return function(event) {
        if (_this.disabled) {
          return;
        }
        event.stop();
        _this.setValue();
      };
    })(this));
    this.inputEl.on('focus', (function(_this) {
      return function(event) {
        if (_this.disabled) {
          return;
        }
        _this.setFocus(true);
      };
    })(this));
    this.keyListener = new Miwo.utils.KeyListener(miwo.body, 'keydown');
    this.keyListener.on('esc', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.close();
        return true;
      };
    })(this));
    this.keyListener.on('up', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.open();
        _this.activatePrevItem();
        return true;
      };
    })(this));
    this.keyListener.on('down', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.open();
        _this.activateNextItem();
        return true;
      };
    })(this));
    this.keyListener.on('left', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        if (_this.multiple) {
          _this.activatePrevValue();
        }
        return true;
      };
    })(this));
    this.keyListener.on('right', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        if (_this.multiple) {
          _this.activateNextValue();
        }
        return true;
      };
    })(this));
    this.keyListener.on('backspace', (function(_this) {
      return function() {
        var item, val;
        if (_this.disabled) {
          return;
        }
        if (!_this.opened) {
          if ((item = _this.getActiveValue())) {
            val = item.get('data-value');
            _this.setValue(_this.getValue().erase(val));
          } else {
            _this.activeteLastValue();
            if ((item = _this.getActiveValue())) {
              val = item.get('data-value');
              _this.setValue(_this.getValue().erase(val));
            }
          }
        }
        return true;
      };
    })(this));
    this.keyListener.on('enter', (function(_this) {
      return function() {
        var item, val;
        if (_this.disabled) {
          return;
        }
        if (_this.opened) {
          if ((item = _this.getActiveItem())) {
            val = item.get('data-value');
            _this.setValue((_this.multiple ? _this.getValue().include(val) : val));
            _this.close();
          }
        } else if (!_this.opened) {
          if ((item = _this.getActiveValue())) {
            val = item.get('data-value');
            _this.setValue(_this.getValue().erase(val));
          } else {
            _this.open();
          }
        }
        return true;
      };
    })(this));
    this.keyListener.pause();
  };

  Combo.prototype.getInputEl = function() {
    return this.inputEl;
  };

  Combo.prototype.getInputId = function() {
    return this.id + 'Input';
  };

  Combo.prototype.setFocus = function(silent) {
    this.active = true;
    this.el.addClass('active');
    if (!silent) {
      this.el.setFocus();
    }
    this.keyListener.resume();
    miwo.body.on('click', this.bound('onBodyClick'));
  };

  Combo.prototype.blur = function(silent) {
    this.active = false;
    this.el.removeClass('active');
    if (!silent) {
      this.el.blur();
    }
    this.keyListener.pause();
    miwo.body.un('click', this.bound('onBodyClick'));
  };

  Combo.prototype.setValue = function(value) {
    var content, i, inputValue, item, selected, v, _i, _j, _len, _len1, _ref;
    if (value === void 0 || value === null) {
      value = '';
    }
    if (!Type.isArray(value)) {
      value = [value];
    }
    if (this.multiple) {
      content = '<ul>';
      for (i = _i = 0, _len = value.length; _i < _len; i = ++_i) {
        v = value[i];
        content += '<li class="combo-value" data-index="' + i + '" data-value="' + v + '" >' + this.getItemText(v) + '<i class="glyphicon glyphicon-remove"></i></li>';
      }
      content += '</ul>';
      inputValue = value.join(',');
    } else {
      content = this.getItemText(value[0]);
      inputValue = value[0];
    }
    this.el.toggleClass('combo-empty', !inputValue);
    this.textEl.set('html', inputValue ? content : this.placeholder);
    if (this.inputEl.get('value') !== inputValue) {
      this.inputEl.set('value', inputValue);
      this.inputEl.emit('change');
    }
    this.activeValueIndex = -1;
    if (this.hideSelected) {
      _ref = this.items;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        item = _ref[_j];
        selected = value.indexOf(item.get('data-value')) >= 0;
        item.setVisible(!selected);
        item.toggleClass('selected', selected);
      }
    }
    this.resetEl.setVisible(!this.disabled && this.prompt && value[0] !== void 0 && value[0] !== '');
  };

  Combo.prototype.getValue = function() {
    var value;
    value = this.inputEl.get('value');
    if (this.multiple) {
      if (value) {
        return value.split(',');
      } else {
        return [];
      }
    } else {
      return value;
    }
  };

  Combo.prototype.getItemText = function(value) {
    var el;
    el = this.dropdownEl.getElement('[data-value="' + value + '"]');
    if (el) {
      return el.comboText;
    } else {
      return '';
    }
  };

  Combo.prototype.addOption = function(value, text, content) {
    var item;
    item = new Element('div', {
      cls: 'combo-dropdown-item',
      'data-value': value,
      html: content || text,
      'data-index': this.items.length
    });
    item.comboText = text;
    item.inject(this.dropdownItemsEl);
    this.items.push(item);
    if (!this.prompt && this.getValue() === '') {
      this.setValue(value);
    }
  };

  Combo.prototype.addOptions = function(items) {
    var item, _i, _len;
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      this.addOption(item.value, item.text, item.content);
    }
  };

  Combo.prototype.setOptions = function(items) {
    this.clear();
    this.setOptions(items);
  };

  Combo.prototype.setPrompt = function(text) {
    this.prompt = text;
  };

  Combo.prototype.clear = function() {
    this.items.empty();
    this.dropdownItemsEl.empty();
  };

  Combo.prototype.setDisabled = function(disabled) {
    Combo.__super__.setDisabled.call(this, disabled);
    this.el.toggleClass('disabled', disabled);
  };

  Combo.prototype.open = function() {
    var pos, size;
    if (this.opened) {
      return;
    }
    this.opened = true;
    this.setFocus();
    this.el.addClass('combo-open');
    this.screenMask.show();
    this.dropdownEl.inject(miwo.body);
    this.dropdownEl.addClass('active');
    pos = this.el.getPosition();
    size = this.el.getSize();
    this.dropdownEl.setStyles({
      top: pos.y + size.y,
      left: pos.x,
      width: size.x
    });
    if (this.activeItemIndex < 0) {
      this.activateNextItem();
    }
  };

  Combo.prototype.close = function() {
    if (!this.opened) {
      return;
    }
    this.opened = false;
    this.el.removeClass('combo-open');
    this.dropdownEl.removeClass('active');
    this.dropdownEl.dispose();
    this.screenMask.hide();
  };

  Combo.prototype.getActiveItem = function() {
    return this.items[this.activeItemIndex] || null;
  };

  Combo.prototype.activateItem = function(index) {
    if (this.activeItemIndex >= 0) {
      this.items[this.activeItemIndex].removeClass('active');
      this.activeItemIndex = -1;
    }
    if (index >= 0 && index < this.items.length) {
      this.items[index].addClass('active');
      this.activeItemIndex = index;
    }
  };

  Combo.prototype.activatePrevItem = function() {
    var activateIndex, index, item, _i, _len, _ref;
    activateIndex = null;
    _ref = this.items;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      item = _ref[index];
      if (!item.hasClass('selected') && index < this.activeItemIndex) {
        activateIndex = index;
      }
    }
    if (activateIndex !== null) {
      this.activateItem(activateIndex);
    }
  };

  Combo.prototype.activateNextItem = function() {
    var activateIndex, index, item, _i, _len, _ref;
    activateIndex = null;
    _ref = this.items;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      item = _ref[index];
      if (!item.hasClass('selected') && index > this.activeItemIndex) {
        activateIndex = index;
        break;
      }
    }
    if (activateIndex !== null) {
      this.activateItem(activateIndex);
    }
  };

  Combo.prototype.getValueElAt = function(index) {
    return this.textEl.getElement('li:nth-child(' + (index + 1) + ')');
  };

  Combo.prototype.getActiveValue = function() {
    return this.getValueElAt(this.activeValueIndex) || null;
  };

  Combo.prototype.activateValue = function(index) {
    var activeItem, item;
    if (this.activeValueIndex >= 0) {
      activeItem = this.getValueElAt(this.activeValueIndex);
      activeItem.removeClass('active');
    }
    if (index >= 0 && index < this.getValue().length) {
      item = this.getValueElAt(index);
      item.addClass('active');
      this.activeValueIndex = index;
    }
  };

  Combo.prototype.activatePrevValue = function() {
    var index;
    if (this.activeValueIndex < 0) {
      index = this.getValue().length - 1;
    } else {
      index = this.activeValueIndex === 0 ? this.getValue().length - 1 : this.activeValueIndex - 1;
    }
    this.activateValue(index);
  };

  Combo.prototype.activateNextValue = function() {
    var index;
    if (this.activeValueIndex < 0) {
      index = 0;
    } else {
      index = this.getValue().length === this.activeValueIndex + 1 ? 0 : this.activeValueIndex + 1;
    }
    this.activateValue(index);
  };

  Combo.prototype.activeteLastValue = function() {
    this.activateValue(this.getValue().length - 1);
  };

  Combo.prototype.onBodyClick = function(event) {
    var parents;
    parents = event.target.getParents();
    if (parents.indexOf(this.el) < 0 && parents.indexOf(this.dropdownMaskEl) < 0) {
      this.blur();
    }
  };

  Combo.prototype.doDestroy = function() {
    this.screenMask.destroy();
    this.keyListener.destroy();
    miwo.body.un('click', this.bound('onBodyClick'));
    return Combo.__super__.doDestroy.apply(this, arguments);
  };

  return Combo;

})(Miwo.Component);

module.exports = Combo;


},{"../utils/ScreenMask":99}],60:[function(require,module,exports){
var Date,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Date = (function(_super) {
  __extends(Date, _super);

  function Date() {
    return Date.__super__.constructor.apply(this, arguments);
  }

  Date.prototype.type = 'date';

  return Date;

})(Miwo.Component);

module.exports = Date;


},{}],61:[function(require,module,exports){
var Radio,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Radio = (function(_super) {
  __extends(Radio, _super);

  function Radio() {
    return Radio.__super__.constructor.apply(this, arguments);
  }

  Radio.prototype.xtype = 'radioinput';

  Radio.prototype.isInput = true;

  Radio.prototype.checked = false;

  Radio.prototype.disabled = false;

  Radio.prototype.inputEl = null;

  Radio.prototype.iconEl = null;

  Radio.prototype.labelEl = null;

  Radio.prototype.radioName = null;

  Radio.prototype.doRender = function() {
    this.el.addClass('radio');
    this.el.set('html', '<label miwo-reference="labelEl" for="' + this.getInputId() + '">' + '<span class="checker">' + '<i miwo-reference="iconEl" class="fa"></i>' + '<input miwo-reference="inputEl" type="radio" id="' + this.getInputId() + '" name="' + this.radioName + '" value="' + this.name + '" >' + '</span>' + '<span miwo-reference="textEl" class="label-text">' + this.label + '</span>' + '</label>');
  };

  Radio.prototype.afterRender = function() {
    Radio.__super__.afterRender.apply(this, arguments);
    this.inputEl.on('change', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setChecked(_this.isChecked());
        _this.emit('change', _this, _this.name);
      };
    })(this));
    this.inputEl.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.el.addClass('focus');
        _this.emit('focus', _this);
      };
    })(this));
    this.inputEl.on('blur', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.el.removeClass('focus');
        _this.emit('blur', _this);
      };
    })(this));
    this.setDisabled(this.disabled);
    this.setChecked(this.checked);
  };

  Radio.prototype.setChecked = function(checked) {
    this.checked = checked;
    if (!this.rendered) {
      return;
    }
    this.el.toggleClass('checked', checked);
    this.inputEl.set('checked', checked);
    this.iconEl.removeClass('fa-dot-circle-o').removeClass('fa-circle-o');
    this.iconEl.addClass(checked ? 'fa-dot-circle-o' : 'fa-circle-o');
    return this;
  };

  Radio.prototype.isChecked = function() {
    if (this.rendered) {
      return this.inputEl.get('checked');
    } else {
      return this.checked;
    }
  };

  Radio.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    if (!this.rendered) {
      return;
    }
    this.el.toggleClass('disabled', disabled);
    this.inputEl.set('disabled', disabled);
  };

  Radio.prototype.setLabel = function(label) {
    this.label = label;
    if (!this.rendered) {
      return;
    }
    this.textEl.set('text', label);
  };

  Radio.prototype.setValue = function(checked) {
    this.setChecked(checked);
  };

  Radio.prototype.getValue = function() {
    return this.isChecked();
  };

  Radio.prototype.getInputEl = function() {
    return this.inputEl;
  };

  Radio.prototype.getInputId = function() {
    return this.id + '-input';
  };

  return Radio;

})(Miwo.Component);

module.exports = Radio;


},{}],62:[function(require,module,exports){
var Radio, RadioList,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Radio = require('./Radio');

RadioList = (function(_super) {
  __extends(RadioList, _super);

  function RadioList() {
    return RadioList.__super__.constructor.apply(this, arguments);
  }

  RadioList.prototype.xtype = 'radioboxlist';

  RadioList.prototype.isInput = true;

  RadioList.prototype.inline = false;

  RadioList.prototype.radioName = null;

  RadioList.prototype.componentCls = 'radiolist';

  RadioList.prototype.setChecked = function(name) {
    this.components.each((function(_this) {
      return function(radio) {
        radio.setChecked(radio.name === name);
      };
    })(this));
  };

  RadioList.prototype.setDisabled = function(name, disabled) {
    if (Type.isString(name)) {
      this.get(name).setDisabled(disabled);
    } else {
      disabled = name;
      this.components.each((function(_this) {
        return function(checkbox) {
          checkbox.setDisabled(disabled);
        };
      })(this));
    }
  };

  RadioList.prototype.setValue = function(value) {
    this.components.each((function(_this) {
      return function(checkbox, name) {
        checkbox.setChecked(value === name);
      };
    })(this));
  };

  RadioList.prototype.getValue = function() {
    var value;
    value = null;
    this.components.each((function(_this) {
      return function(radio, name) {
        if (radio.isChecked() && !radio.disabled) {
          value = name;
        }
      };
    })(this));
    return value;
  };

  RadioList.prototype.addItem = function(name, label) {
    this.add(name, this.createRadio(name, label));
  };

  RadioList.prototype.createRadio = function(name, label) {
    var radio;
    radio = new Radio({
      id: this.id + '-' + name,
      name: name,
      radioName: this.radioName,
      label: label,
      cls: this.inline ? 'radio-inline' : null
    });
    radio.on('change', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.setChecked(name);
        _this.emit('change');
      };
    })(this));
    radio.on('blur', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.emit('blur');
      };
    })(this));
    radio.on('focus', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.emit('focus');
      };
    })(this));
    return radio;
  };

  RadioList.prototype.clear = function() {
    this.components.each((function(_this) {
      return function(component, name) {
        _this.removeComponent(name);
        component.destroy();
      };
    })(this));
  };

  return RadioList;

})(Miwo.Container);

module.exports = RadioList;


},{"./Radio":61}],63:[function(require,module,exports){
var OptionGroup, Select,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

OptionGroup = (function(_super) {
  __extends(OptionGroup, _super);

  OptionGroup.prototype.select = null;

  OptionGroup.prototype.label = null;

  function OptionGroup(select, config) {
    this.select = select;
    OptionGroup.__super__.constructor.call(this, config);
    this.el = new Element('optgroup', {
      label: this.label
    });
    return;
  }

  OptionGroup.prototype.setLabel = function(label) {
    this.el.set('label', label);
    return this;
  };

  OptionGroup.prototype.addOption = function(value, text) {
    var option;
    option = new Element('option', {
      value: value,
      html: text
    });
    option.inject(this.el);
    return this;
  };

  return OptionGroup;

})(Miwo.Object);

Select = (function(_super) {
  __extends(Select, _super);

  function Select() {
    return Select.__super__.constructor.apply(this, arguments);
  }

  Select.prototype.isInput = true;

  Select.prototype.el = 'select';

  Select.prototype.componentCls = 'form-control';

  Select.prototype.addOption = function(value, text) {
    var option;
    option = new Element('option', {
      value: value,
      html: text
    });
    option.inject(this.el);
  };

  Select.prototype.addGroup = function(title) {
    return OptionGroup(this, {
      label: title
    });
  };

  Select.prototype.clear = function() {
    this.el.empty();
  };

  Select.prototype.setDisabled = function(disabled) {
    Select.__super__.setDisabled.call(this, disabled);
    this.el.toggleClass('disabled', disabled);
  };

  Select.prototype.setValue = function(value) {
    this.el.set('value', value);
    return this;
  };

  Select.prototype.getValue = function() {
    return this.el.get('value');
  };

  Select.prototype.getInputEl = function() {
    return this.el;
  };

  Select.prototype.getInputId = function() {
    return this.id;
  };

  return Select;

})(Miwo.Component);

module.exports = Select;


},{}],64:[function(require,module,exports){
var Slider, Tooltip,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Tooltip = require('../tip/Tooltip');

Slider = (function(_super) {
  __extends(Slider, _super);

  function Slider() {
    return Slider.__super__.constructor.apply(this, arguments);
  }

  Slider.prototype.xtype = 'sliderinput';

  Slider.prototype.isInput = true;

  Slider.prototype.value = 0;

  Slider.prototype.step = 1;

  Slider.prototype.min = 0;

  Slider.prototype.max = 100;

  Slider.prototype.disabled = false;

  Slider.prototype.inputEl = null;

  Slider.prototype.selectionEl = null;

  Slider.prototype.knobEl = null;

  Slider.prototype.trackEl = null;

  Slider.prototype.trackPos = null;

  Slider.prototype.trackSize = null;

  Slider.prototype.stepSize = null;

  Slider.prototype.tooltipKnob = null;

  Slider.prototype.tooltipSelection = null;

  Slider.prototype.afterInit = function() {
    Slider.__super__.afterInit.apply(this, arguments);
    if (this.min === null || this.max === null) {
      throw new Error("min or max properties are required");
    }
  };

  Slider.prototype.doRender = function() {
    this.el.addClass('slider');
    this.el.set('html', '<div miwo-reference="trackEl" class="slider-track">' + '<div miwo-reference="selectionEl" class="slider-selection"></div>' + '<div miwo-reference="knobEl" class="slider-knob"></div>' + '</div>' + '<input miwo-reference="inputEl" type="text" class="screen-off" id="' + this.getInputId() + '">');
  };

  Slider.prototype.afterRender = function() {
    Slider.__super__.afterRender.apply(this, arguments);
    this.tooltipKnob = new Tooltip({
      target: this.knobEl,
      placement: 'top',
      distance: 3
    });
    this.tooltipSelection = new Tooltip({
      target: this.selectionEl,
      placement: 'top',
      distance: 3
    });
    this.trackPos = this.trackEl.getPosition();
    this.trackSize = this.trackEl.getSize();
    this.stepSize = this.trackSize.x / (this.max - this.min);
    this.knobEl.on('mousedown', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        _this.active = true;
        _this.knobEl.addClass('active');
        _this.startDrag();
      };
    })(this));
    this.trackEl.on('click', (function(_this) {
      return function(event) {
        if (_this.disabled) {
          return;
        }
        _this.setValueByEvent(event);
        _this.tooltipSelection.setText(_this.getValue());
        _this.emit('change', _this, _this.getValue());
      };
    })(this));
    this.selectionEl.on('mouseenter', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        if (_this.active) {
          return;
        }
        _this.tooltipSelection.show();
        _this.tooltipSelection.setText(_this.getValue());
      };
    })(this));
    this.selectionEl.on('mouseleave', (function(_this) {
      return function() {
        if (_this.disabled) {
          return;
        }
        if (_this.active) {
          return;
        }
        _this.tooltipSelection.hide();
      };
    })(this));
    this.setValue(this.value);
    this.setDisabled(this.disabled);
  };

  Slider.prototype.startDrag = function() {
    this.tooltipKnob.show();
    this.tooltipKnob.setText(this.getValue());
    miwo.body.on('mousemove', this.bound('onMouseMove'));
    miwo.body.on('mouseup', this.bound('onMouseUp'));
  };

  Slider.prototype.stopDrag = function() {
    this.tooltipKnob.hide();
    miwo.body.un('mousemove', this.bound('onMouseMove'));
    miwo.body.on('mouseup', this.bound('onMouseUp'));
  };

  Slider.prototype.onMouseUp = function() {
    this.active = false;
    this.knobEl.removeClass('active');
    this.stopDrag();
    this.emit('change', this, this.getValue());
  };

  Slider.prototype.onMouseMove = function(event) {
    this.setValueByEvent(event);
    this.tooltipKnob.setText(this.getValue());
  };

  Slider.prototype.setValueByEvent = function(event) {
    var left, relativeValue, value;
    left = Math.max(0, Math.min(event.page.x - this.trackPos.x, this.trackSize.x));
    relativeValue = left / this.trackSize.x;
    value = this.min + Math.round(relativeValue * (this.max - this.min));
    this.setValue(value);
  };

  Slider.prototype.setValue = function(value) {
    value = Math.round(value);
    if (this.step > 1) {
      value = parseInt(value / this.step) * this.step;
    }
    value = Math.min(this.max, Math.max(this.min, value));
    this.value = value;
    if (!this.rendered) {
      return;
    }
    this.selectionEl.setStyle('width', (value - this.min) * this.stepSize);
    this.knobEl.setStyle('left', (value - this.min) * this.stepSize);
    this.inputEl.set('value', value);
  };

  Slider.prototype.getValue = function() {
    if (this.rendered) {
      return this.inputEl.get('value');
    } else {
      return this.value;
    }
  };

  Slider.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    if (!this.rendered) {
      return;
    }
    this.el.toggleClass("disabled", disabled);
  };

  Slider.prototype.getInputEl = function() {
    return this.inputEl;
  };

  Slider.prototype.getInputId = function() {
    return this.id + '-input';
  };

  Slider.prototype.doDestroy = function() {
    this.stopDrag();
    this.tooltipKnob.destroy();
    this.tooltipSelection.destroy();
    return Slider.__super__.doDestroy.apply(this, arguments);
  };

  return Slider;

})(Miwo.Component);

module.exports = Slider;


},{"../tip/Tooltip":92}],65:[function(require,module,exports){
var Text,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Text = (function(_super) {
  __extends(Text, _super);

  function Text() {
    return Text.__super__.constructor.apply(this, arguments);
  }

  Text.prototype.xtype = 'textinput';

  Text.prototype.isInput = true;

  Text.prototype.el = 'input';

  Text.prototype.type = 'text';

  Text.prototype.disabled = false;

  Text.prototype.readonly = false;

  Text.prototype.autocomplete = null;

  Text.prototype.placeholder = null;

  Text.prototype.componentCls = 'form-control';

  Text.prototype.setValue = function(value) {
    this.el.set("value", value);
  };

  Text.prototype.getValue = function() {
    return this.el.get("value");
  };

  Text.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    this.el.set("disabled", disabled);
  };

  Text.prototype.getInputEl = function() {
    return this.el;
  };

  Text.prototype.getInputId = function() {
    return this.id;
  };

  Text.prototype.doRender = function() {
    this.el.set("type", this.type);
    if (this.autocomplete !== null) {
      this.el.set("autocomplete", this.autocomplete);
    }
    if (this.placeholder !== null) {
      this.el.set("placeholder", this.placeholder);
    }
    if (this.readonly) {
      this.el.set("readonly", this.readonly);
    }
    if (this.disabled) {
      this.el.set("disabled", this.disabled);
    }
  };

  return Text;

})(Miwo.Component);

module.exports = Text;


},{}],66:[function(require,module,exports){
var TextArea,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TextArea = (function(_super) {
  __extends(TextArea, _super);

  function TextArea() {
    return TextArea.__super__.constructor.apply(this, arguments);
  }

  TextArea.prototype.xtype = 'textareainput';

  TextArea.prototype.isInput = true;

  TextArea.prototype.el = 'textarea';

  TextArea.prototype.height = null;

  TextArea.prototype.disabled = false;

  TextArea.prototype.readonly = false;

  TextArea.prototype.resize = 'vertical';

  TextArea.prototype.setValue = function(value) {
    this.el.set("value", value);
  };

  TextArea.prototype.getValue = function() {
    return this.el.get("value");
  };

  TextArea.prototype.setDisabled = function(disabled) {
    this.disabled = disabled;
    this.el.set("disabled", disabled);
  };

  TextArea.prototype.getInputEl = function() {
    return this.el;
  };

  TextArea.prototype.doRender = function() {
    this.el.addClass('form-control');
    if (this.readonly) {
      this.el.set("readonly", this.readonly);
    }
    if (this.disabled) {
      this.el.set("disabled", this.disabled);
    }
    if (this.resize) {
      this.el.setStyle("resize", this.resize);
    }
    if (this.height) {
      this.el.setStyle("height", this.height);
    }
  };

  return TextArea;

})(Miwo.Component);

module.exports = TextArea;


},{}],67:[function(require,module,exports){
module.exports = {
  Checkbox: require('./Checkbox'),
  Radio: require('./Radio'),
  Select: require('./Select'),
  Combo: require('./Combo'),
  Date: require('./Date'),
  Text: require('./Text'),
  Slider: require('./Slider'),
  Color: require('./Color'),
  RadioList: require('./RadioList'),
  CheckboxList: require('./CheckboxList'),
  TextArea: require('./TextArea')
};


},{"./Checkbox":56,"./CheckboxList":57,"./Color":58,"./Combo":59,"./Date":60,"./Radio":61,"./RadioList":62,"./Select":63,"./Slider":64,"./Text":65,"./TextArea":66}],68:[function(require,module,exports){
var Pager, Paginator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Paginator = require('../utils/Paginator');

Pager = (function(_super) {
  __extends(Pager, _super);

  function Pager() {
    return Pager.__super__.constructor.apply(this, arguments);
  }

  Pager.prototype.el = 'nav';

  Pager.prototype.paginator = null;

  Pager.prototype.navigate = false;

  Pager.prototype.doInit = function() {
    Pager.__super__.doInit.apply(this, arguments);
    this.paginator = new Paginator();
    this.paginator.on('page', (function(_this) {
      return function() {
        if (!_this.rendered) {
          return;
        }
        _this.prevEl.toggleClass('disabled', _this.paginator.isFirst());
        _this.nextEl.toggleClass('disabled', _this.paginator.isLast());
      };
    })(this));
  };

  Pager.prototype.setStore = function(store) {
    this.store = store;
    this.mon(store, 'beforeload', (function(_this) {
      return function() {
        _this.setDisabled(true);
      };
    })(this));
    this.mon(store, 'load', (function(_this) {
      return function() {
        _this.setDisabled(false);
        _this.syncStore();
      };
    })(this));
    if (store.loading) {
      this.setDisabled(true);
    } else if (store.loaded) {
      this.syncStore();
    }
  };

  Pager.prototype.syncStore = function() {
    this.paginator.setItemsPerPage(this.store.pageSize);
    this.paginator.setItemCount(this.store.totalCount);
    this.paginator.setPage(this.store.page);
  };

  Pager.prototype.doRender = function() {
    var a, li, text, ul;
    ul = new Element('ul', {
      cls: 'pager'
    }).inject(this.el);
    text = '<span>' + miwo.tr('miwo.nav.prev') + '</span>';
    if (this.navigate) {
      text = '<span aria-hidden="true">&larr;</span> ' + text;
    }
    li = new Element('li').inject(ul);
    li.toggleClass('disabled', this.paginator.isFirst());
    if (this.navigate) {
      li.addClass('previous');
    }
    a = new Element('a', {
      html: text,
      href: '#',
      'data-page': 'prev',
      role: 'button'
    }).inject(li);
    this.prevEl = li;
    text = '<span>' + miwo.tr('miwo.nav.next') + '</span>';
    if (this.navigate) {
      text = text + ' <span aria-hidden="true">&rarr;</span>';
    }
    li = new Element('li').inject(ul);
    li.setStyle('padding-left', '10px');
    li.toggleClass('disabled', this.paginator.isLast());
    if (this.navigate) {
      li.addClass('next');
    }
    a = new Element('a', {
      html: text,
      href: '#',
      'data-page': 'next',
      role: 'button'
    }).inject(li);
    this.nextEl = li;
  };

  Pager.prototype.afterRender = function() {
    Pager.__super__.afterRender.apply(this, arguments);
    this.mon(this.el, 'click:relay(a)', 'onClick');
  };

  Pager.prototype.onClick = function(event, el) {
    var page;
    event.preventDefault();
    if (this.disabled) {
      return;
    }
    page = el.get('data-page');
    this.emit('page', this, page);
    if (this.store) {
      this.store.loadNestedPage(page);
    }
  };

  Pager.prototype.doDestroy = function() {
    this.paginator.destroy();
    return Pager.__super__.doDestroy.apply(this, arguments);
  };

  return Pager;

})(Miwo.Component);

module.exports = Pager;


},{"../utils/Paginator":98}],69:[function(require,module,exports){
var Paginator, UtilPaginator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

UtilPaginator = require('../utils/Paginator');

Paginator = (function(_super) {
  __extends(Paginator, _super);

  function Paginator() {
    return Paginator.__super__.constructor.apply(this, arguments);
  }

  Paginator.prototype.nestedCount = 2;

  Paginator.prototype.remoteCount = 2;

  Paginator.prototype.size = null;

  Paginator.prototype.el = 'nav';

  Paginator.prototype.paginator = null;

  Paginator.prototype.doInit = function() {
    Paginator.__super__.doInit.apply(this, arguments);
    this.paginator = new UtilPaginator();
    this.paginator.on('page', (function(_this) {
      return function() {
        if (!_this.rendered) {
          return;
        }
        _this.renderPages();
      };
    })(this));
  };

  Paginator.prototype.setStore = function(store) {
    this.store = store;
    this.mon(store, 'beforeload', (function(_this) {
      return function() {
        _this.setDisabled(true);
      };
    })(this));
    this.mon(store, 'load', (function(_this) {
      return function() {
        _this.setDisabled(false);
        _this.syncStore();
      };
    })(this));
    if (store.loading) {
      this.setDisabled(true);
    } else if (store.loaded) {
      this.syncStore();
    }
  };

  Paginator.prototype.syncStore = function() {
    this.paginator.setItemsPerPage(this.store.pageSize);
    this.paginator.setItemCount(this.store.totalCount);
    this.paginator.setPage(this.store.page);
  };

  Paginator.prototype.doRender = function() {
    this.renderPages();
  };

  Paginator.prototype.afterRender = function() {
    Paginator.__super__.afterRender.apply(this, arguments);
    this.mon(this.el, 'click:relay(a)', 'onClick');
  };

  Paginator.prototype.renderPages = function() {
    var a, i, li, max, min, quotient, step, steps, text, ul, _i, _j, _k, _len, _ref, _results;
    this.el.empty();
    if (this.paginator.itemCount === null) {
      return;
    }
    if (this.paginator.getPageCount() < 2) {
      return;
    }
    min = Math.max(this.paginator.getFirstPage(), this.page - this.nestedCount);
    max = Math.min(this.paginator.getLastPage(), this.page + this.nestedCount);
    steps = (function() {
      _results = [];
      for (var _i = min; min <= max ? _i <= max : _i >= max; min <= max ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this);
    quotient = (this.paginator.getPageCount() - 1) / this.remoteCount;
    for (i = _j = 0, _ref = this.remoteCount; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
      steps.include(Math.round(quotient * i) + this.paginator.getFirstPage());
    }
    steps.sort(function(a, b) {
      return a - b;
    });
    ul = new Element('ul', {
      cls: 'pagination'
    }).inject(this.el);
    if (this.size) {
      ul.addClass('pagination-' + this.size);
    }
    text = '<span class="sr-only">' + miwo.tr('miwo.nav.prev') + '</span><span aria-hidden="true">&laquo;</span>';
    li = new Element('li').inject(ul);
    a = new Element('a', {
      html: text,
      href: '#',
      'data-page': 1,
      role: 'button'
    }).inject(li);
    if (this.paginator.isFirst()) {
      li.addClass('disabled');
    }
    for (_k = 0, _len = steps.length; _k < _len; _k++) {
      step = steps[_k];
      li = new Element('li').inject(ul);
      if (step === this.page) {
        li.addClass('active');
      }
      text = '<span>' + step + '</span>';
      if (step === this.page) {
        text = step + '<span class="sr-only">(' + miwo.tr('miwo.nav.current') + ')</span>';
      }
      a = new Element('a', {
        html: text,
        href: '#',
        'data-page': step,
        role: 'button'
      }).inject(li);
    }
    text = '<span aria-hidden="true">&raquo;</span><span class="sr-only">' + miwo.tr('miwo.nav.next') + '</span>';
    li = new Element('li').inject(ul);
    a = new Element('a', {
      html: text,
      href: '#',
      'data-page': this.paginator.getLastPage(),
      role: 'button'
    }).inject(li);
    if (this.paginator.isLast()) {
      li.addClass('disabled');
    }
  };

  Paginator.prototype.onClick = function(event, el) {
    var page;
    event.preventDefault();
    if (this.disabled) {
      return;
    }
    page = parseInt(el.get('data-page'));
    this.emit('page', this, page);
    if (this.store) {
      this.store.loadPage(page);
    }
  };

  return Paginator;

})(Miwo.Component);

module.exports = Paginator;


},{"../utils/Paginator":98}],70:[function(require,module,exports){
module.exports = {
  Paginator: require('./Paginator'),
  Pager: require('./Pager')
};


},{"./Pager":68,"./Paginator":69}],71:[function(require,module,exports){
var Notification, Notificator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Notification = window.Notification;

Notificator = (function(_super) {
  __extends(Notificator, _super);

  function Notificator() {
    return Notificator.__super__.constructor.apply(this, arguments);
  }

  Notificator.prototype.notification = null;

  Notificator.prototype.initialize = function(config) {
    Notificator.__super__.initialize.call(this, config);
    window.on("beforeunload", (function(_this) {
      return function() {
        if (_this.notification) {
          _this.notification.close();
        }
      };
    })(this));
  };

  Notificator.prototype.requestPermission = function() {
    if (Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  Notificator.prototype.notify = function(config) {
    var notification;
    if (!Notification || Notification.permission !== "granted") {
      return null;
    }
    notification = new Notification(config.title, {
      body: config.message,
      icon: config.icon
    });
    notification.handler = config.callback;
    notification.onclick = (function(_this) {
      return function() {
        if (config.callback) {
          config.callback();
        }
        notification.close();
      };
    })(this);
    notification.onshow = (function(_this) {
      return function() {
        if (_this.notification === notification) {
          _this.notification.close();
        }
        _this.notification = notification;
      };
    })(this);
    notification.onclose = (function(_this) {
      return function() {
        if (_this.notification === notification) {
          delete _this.notification;
        }
      };
    })(this);
    if (config.timeout) {
      setTimeout((function(_this) {
        return function() {
          notification.close();
        };
      })(this), this.timeout);
    }
    this.notification = notification;
    return notification;
  };

  return Notificator;

})(Miwo.Object);

module.exports = Notificator;


},{}],72:[function(require,module,exports){
module.exports = {
  Notificator: require('./Notificator')
};


},{"./Notificator":71}],73:[function(require,module,exports){
var Color, ColorPicker,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Color = require('../utils/Color');

ColorPicker = (function(_super) {
  __extends(ColorPicker, _super);

  function ColorPicker() {
    return ColorPicker.__super__.constructor.apply(this, arguments);
  }

  ColorPicker.prototype.xtype = "colorpicker";

  ColorPicker.prototype.color = "FFFFFF";

  ColorPicker.prototype.mapColor = null;

  ColorPicker.prototype.colorRe = /^[0-9A-F]{6}$/;

  ColorPicker.prototype.baseCls = 'colorpicker';

  ColorPicker.prototype.beforeInit = function() {
    ColorPicker.__super__.beforeInit.call(this);
    this.template = '<div miwo-reference="map" class="{baseCls map}">' + '<div class="{baseCls panel}"></div>' + '<div miwo-reference="point" class="{baseCls point}"></div>' + '</div>' + '<div class="{baseCls bar}">' + '<div miwo-reference="bar" class="bar"></div>' + '</div>' + '<div class="{baseCls utils}">' + '<div miwo-reference="preview" class="{baseCls preview}"></div>' + '<input miwo-reference="hexinput" type="text" class="{baseCls hex} form-control" maxlength="7" value="FFFFFF"/>' + '<button miwo-events="click:onBtnClick" class="btn btn-default">Select</button>' + '</div>';
  };

  ColorPicker.prototype.afterInit = function() {
    ColorPicker.__super__.afterInit.call(this);
    this.color = Color.fromHex(this.color);
    this.mapColor = Color.fromHsv(this.color.hue, 100, 100);
  };

  ColorPicker.prototype.afterRender = function() {
    ColorPicker.__super__.afterRender.call(this);
    this.hexinput.on("keyup", (function(_this) {
      return function() {
        _this.setColor(_this.hexinput.get("value"));
      };
    })(this));
    this.map.on("mousedown", (function(_this) {
      return function(event) {
        event.stop();
        document.on("mousemove", _this.bound("onMapMouseMove"));
        document.on("mouseup", _this.bound("onMapMouseUp"));
      };
    })(this));
    this.map.on("click", (function(_this) {
      return function(event) {
        event.stop();
        _this.updateMapOnMouseEvent(event);
      };
    })(this));
    this.bar.on("mousedown", (function(_this) {
      return function(event) {
        event.stop();
        document.on("mousemove", _this.bound("onBarMouseMove"));
        document.on("mouseup", _this.bound("onBarMouseUp"));
      };
    })(this));
    this.bar.on("click", (function(_this) {
      return function(event) {
        event.stop();
        _this.updateBarOnMouseEvent(event);
      };
    })(this));
    this.setColor(this.color.hex, true);
  };

  ColorPicker.prototype.setColor = function(color, update) {
    color = color.toUpperCase();
    color = color.replace("#", "");
    if (this.isColorValid(color) && (this.color.hex !== color || update)) {
      this.color.setHex(color);
      this.mapColor = Color.fromHsv(this.color.hue, 100, 100);
      this.doSetHue(this.color.h);
      this.doSetSaturationAndValue(this.color.s, this.color.v);
      this.color.setHex(color);
      this.onColorChanged();
    }
  };

  ColorPicker.prototype.getColor = function() {
    return this.color.hex;
  };

  ColorPicker.prototype.isColorValid = function(hex) {
    return this.colorRe.test(hex);
  };

  ColorPicker.prototype.onBarMouseUp = function(event) {
    event.stop();
    document.un("mousemove", this.bound("onBarMouseMove"));
    document.un("mouseup", this.bound("onBarMouseUp"));
  };

  ColorPicker.prototype.onBarMouseMove = function(event) {
    event.stop();
    this.updateBarOnMouseEvent(event);
  };

  ColorPicker.prototype.updateBarOnMouseEvent = function(e) {
    var pos, yValue;
    pos = this.bar.getPosition();
    yValue = Math.min(Math.max(0, e.page.y - pos.y), 256);
    this.setHue(360 - Math.round((360 / 256) * yValue));
  };

  ColorPicker.prototype.setHue = function(hue) {
    if (this.color.hue !== hue) {
      this.doSetHue(hue);
      this.onColorChanged();
    }
  };

  ColorPicker.prototype.doSetHue = function(hue) {
    this.color.setHsv(hue, null, null);
    this.mapColor.setHsv(hue, 100, 100);
    this.map.setStyle("background-color", "#" + this.mapColor.hex);
  };

  ColorPicker.prototype.onMapMouseUp = function(event) {
    event.stop();
    document.un("mousemove", this.bound("onMapMouseMove"));
    document.un("mouseup", this.bound("onMapMouseUp"));
  };

  ColorPicker.prototype.onMapMouseMove = function(event) {
    event.stop();
    this.updateMapOnMouseEvent(event);
  };

  ColorPicker.prototype.updateMapOnMouseEvent = function(event) {
    var pos, s, v, xValue, yValue;
    pos = this.map.getPosition();
    xValue = Math.min(Math.max(0, event.page.x - pos.x), 256);
    yValue = Math.min(Math.max(0, event.page.y - pos.y), 256);
    s = Math.round((100 / 256) * xValue);
    v = 100 - Math.round((100 / 256) * yValue);
    this.setSaturationAndValue(s, v);
  };

  ColorPicker.prototype.setSaturationAndValue = function(s, v) {
    if (this.color.s !== s || this.color.v !== v) {
      this.doSetSaturationAndValue(s, v);
      this.onColorChanged();
    }
  };

  ColorPicker.prototype.doSetSaturationAndValue = function(s, v) {
    this.color.setHsv(null, s, v);
    this.point.setPosition({
      x: (s / 100) * 256 - 8,
      y: 256 - (v / 100) * 256 - 8
    });
  };

  ColorPicker.prototype.onColorChanged = function() {
    this.preview.setStyle("background-color", "#" + this.color.hex);
    this.hexinput.set("value", this.color.hex);
    this.emit("colorchange", this, this.color.hex);
  };

  ColorPicker.prototype.onBtnClick = function() {
    this.emit("selected", this, this.color.hex);
  };

  return ColorPicker;

})(Miwo.Component);

module.exports = ColorPicker;


},{"../utils/Color":96}],74:[function(require,module,exports){



},{}],75:[function(require,module,exports){
var ColorPicker, PickerManager, Popover;

Popover = require('../tip/Popover');

ColorPicker = require('./Color');

PickerManager = (function() {
  PickerManager.prototype.pickers = null;

  function PickerManager() {
    this.pickers = {};
  }

  PickerManager.prototype.get = function(type) {
    if (!this.pickers[type]) {
      this.pickers[type] = this.createPicker(type);
    }
    return this.pickers[type];
  };

  PickerManager.prototype.createPicker = function(type) {
    var factory;
    factory = 'create' + type.capitalize() + 'Picker';
    if (!this[factory]) {
      throw new Error("Undefined factory function for '" + type + "' picker");
    }
    return this[factory]();
  };

  PickerManager.prototype.createColorPicker = function() {
    var popover;
    popover = new Popover({
      title: 'Select color',
      styles: {
        maxWidth: 500
      },
      closeMode: 'hide'
    });
    popover.add('picker', new ColorPicker());
    return popover;
  };

  PickerManager.prototype.createDatePicker = function() {};

  return PickerManager;

})();

module.exports = PickerManager;


},{"../tip/Popover":90,"./Color":73}],76:[function(require,module,exports){



},{}],77:[function(require,module,exports){



},{}],78:[function(require,module,exports){
module.exports = {
  Manager: require('./Manager'),
  Color: require('./Color'),
  Date: require('./Date'),
  Month: require('./Month'),
  Time: require('./Time')
};


},{"./Color":73,"./Date":74,"./Manager":75,"./Month":76,"./Time":77}],79:[function(require,module,exports){
var BaseSelector,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseSelector = (function(_super) {
  __extends(BaseSelector, _super);

  function BaseSelector() {
    return BaseSelector.__super__.constructor.apply(this, arguments);
  }

  BaseSelector.prototype.isSelector = true;

  BaseSelector.prototype.checkerRequired = false;

  BaseSelector.prototype.grid = null;

  BaseSelector.prototype.selection = null;

  BaseSelector.prototype.setGrid = function(grid) {
    this.grid = grid;
    this.mon(grid, 'rendered', 'gridRendered');
    this.mon(grid, 'refresh', 'gridRefresh');
  };

  BaseSelector.prototype.setSelectionModel = function(selection) {
    this.selection = selection;
    this.mon(selection, 'select', 'modelSelect');
    this.mon(selection, 'deselect', 'modelDeselect');
    this.mon(selection, 'change', 'modelChange');
  };

  BaseSelector.prototype.gridRefresh = function(grid) {};

  BaseSelector.prototype.gridRendered = function(grid) {};

  BaseSelector.prototype.modelSelect = function(selection, record, rowIndex) {};

  BaseSelector.prototype.modelDeselect = function(selection, record, rowIndex) {};

  BaseSelector.prototype.modelChange = function(selection, rs) {};

  BaseSelector.prototype.doDestroy = function() {
    this.grid = null;
    this.selection = null;
    return BaseSelector.__super__.doDestroy.apply(this, arguments);
  };

  return BaseSelector;

})(Miwo.Object);

module.exports = BaseSelector;


},{}],80:[function(require,module,exports){
var CheckSelector, RowSelector,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

RowSelector = require('./RowSelector');

CheckSelector = (function(_super) {
  __extends(CheckSelector, _super);

  function CheckSelector() {
    return CheckSelector.__super__.constructor.apply(this, arguments);
  }

  CheckSelector.prototype.selectOnRowClick = false;

  CheckSelector.prototype.checkerRequired = true;

  CheckSelector.prototype.setCheckColumn = function(column) {
    this.column = column;
    this.mon(column, 'rowcheck', 'onRowCheck');
    this.mon(column, 'headercheck', 'onHeaderCheck');
  };

  CheckSelector.prototype.onRowCheck = function(column, row, checked) {
    var rec;
    rec = row.retrieve('record');
    this.selection.setSelected(rec, checked);
  };

  CheckSelector.prototype.onHeaderCheck = function(column, checked) {
    this.selection.setSelectedAll(checked);
  };

  CheckSelector.prototype.modelSelect = function(selection, record) {
    this.column.setCheckedRow(record, true);
  };

  CheckSelector.prototype.modelDeselect = function(selection, record) {
    this.column.setCheckedRow(record, false);
  };

  CheckSelector.prototype.modelChange = function(selection, rs) {
    var selectedAll;
    CheckSelector.__super__.modelChange.call(this, selection, rs);
    selectedAll = selection.getTotalSelectableCount() === selection.getCount();
    this.column.setCheckedHeader(selectedAll && selection.hasSelection());
  };

  CheckSelector.prototype.gridRendered = function(grid) {
    CheckSelector.__super__.gridRendered.call(this, grid);
    this.setCheckColumn(grid.checker);
  };

  CheckSelector.prototype.gridRefresh = function(grid) {
    var sm, store;
    store = grid.getStore();
    sm = grid.getSelectionModel();
    if (!this.column) {
      throw new Error("Check selector is not binded with column. You should call setCheckColumn(). Maybe grid is not rendered");
    }
    grid.getRecords().each((function(_this) {
      return function(rec) {
        if (!sm.isSelectable(rec)) {
          _this.column.setDisabledRow(rec, true);
        }
      };
    })(this));
    sm.getSelection().each((function(_this) {
      return function(rec) {
        _this.modelSelect(sm, rec);
      };
    })(this));
  };

  CheckSelector.prototype.doDestroy = function() {
    this.column = null;
    CheckSelector.__super__.doDestroy.call(this);
  };

  return CheckSelector;

})(RowSelector);

module.exports = CheckSelector;


},{"./RowSelector":81}],81:[function(require,module,exports){
var BaseSelector, RowSelector,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseSelector = require('./BaseSelector');

RowSelector = (function(_super) {
  __extends(RowSelector, _super);

  function RowSelector() {
    return RowSelector.__super__.constructor.apply(this, arguments);
  }

  RowSelector.prototype.selectOnRowClick = true;

  RowSelector.prototype.gridRendered = function(grid) {
    if (this.selectOnRowClick) {
      this.mon(grid.bodyEl, "click:relay(tr)", (function(_this) {
        return function(event, target) {
          var record;
          record = target.retrieve("record");
          _this.selection.deselectAll();
          _this.selection.select(record);
        };
      })(this));
    }
  };

  RowSelector.prototype.getRowByRecord = function(record) {
    var tr, _i, _len, _ref;
    _ref = this.grid.bodyEl.getChildren();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tr = _ref[_i];
      if (tr.retrieve('record') === record) {
        return tr;
      }
    }
    return null;
  };

  RowSelector.prototype.modelSelect = function(selection, record) {
    this.getRowByRecord(record).addClass("grid-selected");
  };

  RowSelector.prototype.modelDeselect = function(selection, record) {
    this.getRowByRecord(record).removeClass("grid-selected");
  };

  return RowSelector;

})(BaseSelector);

module.exports = RowSelector;


},{"./BaseSelector":79}],82:[function(require,module,exports){
var SelectionModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SelectionModel = (function(_super) {
  __extends(SelectionModel, _super);

  SelectionModel.prototype.type = "single";

  SelectionModel.prototype.pruneRemoved = true;

  SelectionModel.prototype.locked = false;

  SelectionModel.prototype.selected = [];

  SelectionModel.prototype.lastSelected = null;

  SelectionModel.prototype.store = null;

  SelectionModel.prototype.selectionChanged = false;

  SelectionModel.prototype.emitEvents = true;

  SelectionModel.prototype.selectableIndex = null;

  SelectionModel.prototype.selectableHandler = null;

  function SelectionModel(config) {
    SelectionModel.__super__.constructor.call(this, config);
    this.selected = [];
  }

  SelectionModel.prototype.setStore = function(store) {
    this.store = store;
    this.mon(store, 'datachanged', 'onStoreDataChanged');
    this.mon(store, 'clear', 'onStoreClear');
    this.mon(store, 'remove', 'onStoreRemove');
  };

  SelectionModel.prototype.getStore = function() {
    return this.store;
  };

  SelectionModel.prototype.onStoreDataChanged = function() {
    this.refresh();
  };

  SelectionModel.prototype.onStoreClear = function() {
    if (this.getCount() > 0) {
      this.clearSelections();
      this.selectionChanged = true;
      this.checkSelectionChanged();
    }
  };

  SelectionModel.prototype.onStoreRemove = function(store, rec, index) {
    if (this.lastSelected === rec) {
      this.lastSelected = null;
    }
    if (this.isSelected(rec)) {
      this.selected.erase(rec);
      this.selectionChanged = true;
      this.checkSelectionChanged();
    }
  };

  SelectionModel.prototype.clearSelections = function() {
    this.selected.empty();
    this.lastSelected = null;
  };

  SelectionModel.prototype.isLocked = function() {
    return this.locked;
  };

  SelectionModel.prototype.setLocked = function(locked) {
    this.locked = !!locked;
  };

  SelectionModel.prototype.isSelected = function(record) {
    record = (Type.isNumber(record) ? this.store.getAt(record) : record);
    return this.selected.indexOf(record) !== -1;
  };

  SelectionModel.prototype.isSelectable = function(record) {
    if (!this.selectableIndex && !this.selectableHandler) {
      return true;
    } else {
      record = (Type.isNumber(record) ? this.store.getAt(record) : record);
      if (this.selectableHandler) {
        return this.selectableHandler(record);
      } else {
        return !!record.get(this.selectableIndex);
      }
    }
  };

  SelectionModel.prototype.getSelection = function() {
    return this.selected;
  };

  SelectionModel.prototype.getRecords = function() {
    var rec, rs, _i, _len, _ref;
    rs = [];
    _ref = this.selected;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      rec = _ref[_i];
      rs.push(rec);
    }
    return rs;
  };

  SelectionModel.prototype.hasSelection = function() {
    return this.getCount() > 0;
  };

  SelectionModel.prototype.getFirstSelected = function() {
    return (this.hasSelection() ? this.records[0] : null);
  };

  SelectionModel.prototype.getLastSelected = function() {
    return (this.hasSelection() ? this.records.getLast() : null);
  };

  SelectionModel.prototype.getCount = function() {
    return this.selected.length;
  };

  SelectionModel.prototype.getTotalCount = function() {
    return this.getStore().getCount();
  };

  SelectionModel.prototype.getTotalSelectableCount = function() {
    var count;
    count = 0;
    this.getStore().each((function(_this) {
      return function(r) {
        if (_this.isSelectable(r)) {
          count++;
        }
      };
    })(this));
    return count;
  };

  SelectionModel.prototype.selectAll = function(silent) {
    var records;
    records = this.store.getRecords();
    this.doSelect(records, silent);
  };

  SelectionModel.prototype.deselectAll = function(silent) {
    var records;
    records = [];
    this.getSelection().each(function(record) {
      records.push(record);
    });
    this.doDeselect(records, silent);
  };

  SelectionModel.prototype.select = function(records, silent) {
    if (this.type === "single" && this.hasSelection()) {
      this.deselectAll();
    }
    this.doSelect(records, silent);
  };

  SelectionModel.prototype.deselect = function(records, silent) {
    this.doDeselect(records, silent);
  };

  SelectionModel.prototype.setSelected = function(records, select, silent) {
    this[(select ? "select" : "deselect")](records, silent);
  };

  SelectionModel.prototype.setSelectedAll = function(select, silent) {
    this[(select ? "selectAll" : "deselectAll")](silent);
  };

  SelectionModel.prototype.doSelect = function(records, silent) {
    if (this.locked || !this.store) {
      return;
    }
    if (typeof records === "number") {
      records = [this.store.getAt(records)];
    }
    this.selectionChanged = false;
    Array.from(records).each((function(_this) {
      return function(record) {
        if (_this.isSelectable(record)) {
          if (!_this.isSelected(record)) {
            _this.selectionChanged = true;
            _this.selected.include(record);
            if (_this.emitEvents) {
              _this.emit('select', _this, record, _this.store.indexOf(record));
            }
          }
          _this.lastSelected = record;
        }
      };
    })(this));
    if (!silent) {
      this.checkSelectionChanged();
    }
  };

  SelectionModel.prototype.doDeselect = function(records, silent) {
    if (this.locked || !this.store) {
      return;
    }
    if (typeof records === "number") {
      records = [this.store.getAt(records)];
    }
    this.selectionChanged = false;
    Array.from(records).each((function(_this) {
      return function(record) {
        if (_this.isSelectable(record)) {
          if (_this.isSelected(record)) {
            _this.selectionChanged = true;
            _this.selected.erase(record);
            if (_this.emitEvents) {
              _this.emit('deselect', _this, record, _this.store.indexOf(record));
            }
          }
        }
      };
    })(this));
    if (!silent) {
      this.checkSelectionChanged();
    }
  };

  SelectionModel.prototype.checkSelectionChanged = function() {
    if (this.emitEvents && this.selectionChanged) {
      this.emit('change', this, this.getSelection());
    }
  };

  SelectionModel.prototype.refresh = function() {
    var rec, selection, toBeReAdded, toBeSelected, _i, _len, _ref;
    rec = void 0;
    toBeSelected = [];
    toBeReAdded = [];
    if (!this.store) {
      return;
    }
    _ref = this.selected;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      selection = _ref[_i];
      if (this.store.indexOf(selection) !== -1) {
        rec = this.store.getById(selection.getId());
        if (rec) {
          toBeSelected.push(rec);
        }
      } else if (!this.pruneRemoved) {
        rec = this.store.getById(selection.getId());
        if (rec) {
          toBeSelected.push(rec);
        } else {
          toBeReAdded.push(selection);
        }
      }
    }
    this.emitEvents = false;
    this.clearSelections();
    if (toBeSelected.length) {
      this.doSelect(toBeSelected, true);
    }
    if (toBeReAdded.length) {
      this.selection.append(toBeReAdded);
      if (!this.lastSelected) {
        this.lastSelected = toBeReAdded[toBeReAdded.length - 1];
      }
    }
    this.emitEvents = true;
    this.checkSelectionChanged();
  };

  SelectionModel.prototype.doDestroy = function() {
    this.store = null;
    SelectionModel.__super__.doDestroy.call(this);
  };

  return SelectionModel;

})(Miwo.Object);

module.exports = SelectionModel;


},{}],83:[function(require,module,exports){
var SelectorFactory;

SelectorFactory = (function() {
  SelectorFactory.prototype.defines = null;

  function SelectorFactory() {
    this.defines = {};
  }

  SelectorFactory.prototype.register = function(name, klass) {
    this.defines[name] = klass;
  };

  SelectorFactory.prototype.create = function(name, config) {
    if (!this.defines[name]) {
      throw new Error("Selector with name " + name + " is not defined");
    }
    return new this.defines[name](config);
  };

  return SelectorFactory;

})();

module.exports = SelectorFactory;


},{}],84:[function(require,module,exports){
module.exports = {
  SelectorFactory: require('./SelectorFactory'),
  BaseSelector: require('./BaseSelector'),
  RowSelector: require('./RowSelector'),
  CheckSelector: require('./CheckSelector'),
  SelectionModel: require('./SelectionModel')
};


},{"./BaseSelector":79,"./CheckSelector":80,"./RowSelector":81,"./SelectionModel":82,"./SelectorFactory":83}],85:[function(require,module,exports){
var Panel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Panel = (function(_super) {
  __extends(Panel, _super);

  function Panel() {
    return Panel.__super__.constructor.apply(this, arguments);
  }

  Panel.prototype.tab = null;

  Panel.prototype.baseCls = 'tab-pane';

  Panel.prototype.visible = false;

  Panel.prototype.setTitle = function(title) {
    this.title = title;
    if (this.tab) {
      this.tab.set('html', title);
    }
  };

  Panel.prototype.markActive = function(active) {
    this.setVisible(active);
    this.el.toggleClass('active', active);
    this.tab.toggleClass('active', active);
  };

  Panel.prototype.setActive = function() {
    this.getParent().setActive(this.name);
  };

  Panel.prototype.afterRender = function() {
    Panel.__super__.afterRender.apply(this, arguments);
    this.el.set('role', 'tabpanel');
  };

  return Panel;

})(Miwo.Container);

module.exports = Panel;


},{}],86:[function(require,module,exports){
var Panel, Tabs,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Panel = require('./Panel');

Tabs = (function(_super) {
  __extends(Tabs, _super);

  function Tabs() {
    return Tabs.__super__.constructor.apply(this, arguments);
  }

  Tabs.prototype.xtype = 'tabs';

  Tabs.prototype.align = 'vertical';

  Tabs.prototype.active = null;

  Tabs.prototype.tabsEl = null;

  Tabs.prototype.doInit = function() {
    Tabs.__super__.doInit.apply(this, arguments);
    if (this.align === 'vertical') {
      this.html = '<ul miwo-reference="tabsEl" class="nav nav-tabs" role="tablist"></ul>' + '<div miwo-reference="contentEl" class="tab-content"></div>';
    } else if (this.align === 'horizontal') {
      this.html = '<div class="row">' + '<div class="col-sm-3">' + '<ul miwo-reference="tabsEl" class="nav nav-tabs" role="tablist"></ul>' + '</div>' + '<div class="col-sm-9">' + '<div miwo-reference="contentEl" class="tab-content"></div>' + '</div>' + '</div>';
    }
  };

  Tabs.prototype.setActive = function(name) {
    var next, previous;
    if (!name && this.firstChild()) {
      name = this.firstChild().name;
    }
    previous = Type.isString(this.active) ? null : this.active;
    next = name ? this.get(name) : null;
    if (previous !== next) {
      if (previous) {
        previous.markActive(false);
      }
      if (next) {
        next.markActive(true);
      }
      this.emit('active', this, next, previous);
      this.active = next;
    }
  };

  Tabs.prototype.getActive = function() {
    return this.active;
  };

  Tabs.prototype.addPanel = function(name, config) {
    return this.add(name, new Panel(config));
  };

  Tabs.prototype.doRender = function() {
    Tabs.__super__.doRender.apply(this, arguments);
    this.el.addClass('tabs-' + this.align);
  };

  Tabs.prototype.afterRender = function() {
    Tabs.__super__.afterRender.apply(this, arguments);
    this.setActive(this.active);
    this.mon(this.el, 'click:relay(.nav a)', 'onTabClick');
    this.tabsEl.set('role', 'tablist');
  };

  Tabs.prototype.renderComponent = function(component) {
    var link, tab;
    Tabs.__super__.renderComponent.call(this, component);
    tab = new Element('li', {
      role: 'presentation'
    });
    tab.inject(this.tabsEl);
    link = new Element('a', {
      'aria-controls': component.id,
      href: '#' + component.name,
      role: 'tab',
      html: component.title
    });
    link.inject(tab);
    component.tab = tab;
  };

  Tabs.prototype.removedComponent = function(component) {
    component.tab.destroy();
    if (this.active === component.name) {
      this.setActive();
    }
  };

  Tabs.prototype.onTabClick = function(event, target) {
    event.stop();
    this.setActive(target.get('href').replace('#', ''));
  };

  return Tabs;

})(Miwo.Container);

module.exports = Tabs;


},{"./Panel":85}],87:[function(require,module,exports){
module.exports = {
  Tabs: require('./Tabs'),
  Panel: require('./Panel')
};


},{"./Panel":85,"./Tabs":86}],88:[function(require,module,exports){
var BaseTip,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTip = (function(_super) {
  __extends(BaseTip, _super);

  function BaseTip() {
    return BaseTip.__super__.constructor.apply(this, arguments);
  }

  BaseTip.prototype.xtype = 'tip';

  BaseTip.prototype.placement = "top";

  BaseTip.prototype.distance = 0;

  BaseTip.prototype.target = null;

  BaseTip.prototype.type = 'default';

  BaseTip.prototype.container = null;

  BaseTip.prototype.delay = null;

  BaseTip.prototype.visible = false;

  BaseTip.prototype.afterInit = function() {
    BaseTip.__super__.afterInit.call(this);
    this.renderTo = this.renderTo ? $(this.renderTo) : miwo.body;
  };

  BaseTip.prototype.afterRender = function() {
    BaseTip.__super__.afterRender.call(this);
    this.el.on("mouseenter", (function(_this) {
      return function() {
        _this.el.addClass("hover");
        _this.emit('mouseenter', _this);
      };
    })(this));
    this.el.on("mouseleave", (function(_this) {
      return function() {
        _this.el.removeClass("hover");
        _this.emit('mouseleave', _this);
      };
    })(this));
  };

  BaseTip.prototype.show = function() {
    if (this.visible) {
      return;
    }
    this.visible = true;
    if (!this.rendered) {
      this.render();
    }
    if (this.delay) {
      this.el.show.delay(this.delay, this.el);
    } else {
      this.el.show();
    }
    this.updatePosition();
    this.emit('show', this);
  };

  BaseTip.prototype.hide = function() {
    if (!this.visible) {
      return;
    }
    this.visible = false;
    this.emit('hide', this);
    this.el.hide();
  };

  BaseTip.prototype.close = function() {
    if (!this.visible) {
      return;
    }
    this.hide();
    this.emit('close', this);
    this.destroy();
  };

  BaseTip.prototype.isHover = function() {
    return this.el.hasClass("hover");
  };

  BaseTip.prototype.isVisible = function() {
    return this.el.isVisible();
  };

  BaseTip.prototype.updatePosition = function() {
    var distance, pos, size, tsize;
    pos = this.target.getPosition();
    tsize = this.target.getSize();
    size = this.el.getSize();
    distance = this.distance;
    switch (this.placement) {
      case "top":
        this.el.setPosition({
          x: pos.x - size.x / 2 + tsize.x / 2,
          y: pos.y - size.y - distance
        });
        break;
      case "bottom":
        this.el.setPosition({
          x: pos.x - size.x / 2 + tsize.x / 2,
          y: pos.y + tsize.y + distance
        });
        break;
      case "left":
        this.el.setPosition({
          x: pos.x - size.x - distance,
          y: pos.y + tsize.y / 2 - size.y / 2
        });
        break;
      case "right":
        this.el.setPosition({
          x: pos.x + tsize.x + distance,
          y: pos.y + tsize.y / 2 - size.y / 2
        });
    }
  };

  return BaseTip;

})(Miwo.Container);

module.exports = BaseTip;


},{}],89:[function(require,module,exports){
var BaseTipManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTipManager = (function(_super) {
  __extends(BaseTipManager, _super);

  function BaseTipManager() {
    return BaseTipManager.__super__.constructor.apply(this, arguments);
  }

  BaseTipManager.prototype.placement = 'top';

  BaseTipManager.prototype.distance = 3;

  BaseTipManager.prototype.delay = 500;

  BaseTipManager.prototype.tip = null;

  BaseTipManager.prototype.target = null;

  BaseTipManager.prototype.show = function(target, config) {
    var tip;
    if (this.target === target) {
      return;
    }
    if (this.tip) {
      this.hide();
    }
    tip = this.create(target, config);
    if (!tip) {
      return;
    }
    this.target = target;
    this.tip = tip;
    this.tip.show();
    this.tip.on('mouseleave', (function(_this) {
      return function() {
        return _this.hide();
      };
    })(this));
    if (target.get("title")) {
      target.set("data-title", target.get("title"));
      target.set("title", null);
    }
    target.on("mouseleave", this.bound('onTargetLeave'));
    target.on("click", this.bound('onTargetClick'));
  };

  BaseTipManager.prototype.toggle = function(target) {
    if (this.tip) {
      this.hide();
    } else {
      this.show(target);
    }
  };

  BaseTipManager.prototype.hide = function() {
    if (!this.tip) {
      return;
    }
    this.tip.destroy();
    this.tip = null;
    this.target.un("mouseleave", this.bound('onTargetLeave'));
    this.target.un("click", this.bound('onTargetClick'));
    this.target = null;
  };

  BaseTipManager.prototype.onTargetLeave = function() {
    setTimeout(((function(_this) {
      return function() {
        if (_this.tip && !_this.tip.isHover()) {
          _this.hide();
        }
      };
    })(this)), 200);
    this.target.un("mouseleave", this.bound('onTargetLeave'));
  };

  BaseTipManager.prototype.onTargetClick = function() {
    this.toggle(this.target);
  };

  return BaseTipManager;

})(Miwo.Object);

module.exports = BaseTipManager;


},{}],90:[function(require,module,exports){
var BaseTip, Popover, ScreenMask,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTip = require('./BaseTip');

ScreenMask = require('../utils/ScreenMask');

Popover = (function(_super) {
  __extends(Popover, _super);

  function Popover() {
    return Popover.__super__.constructor.apply(this, arguments);
  }

  Popover.prototype.xtype = 'popover';

  Popover.prototype.title = '';

  Popover.prototype.content = '';

  Popover.prototype.baseCls = 'popover';

  Popover.prototype.screenMask = null;

  Popover.prototype.closeMode = 'close';

  Popover.prototype.afterInit = function() {
    Popover.__super__.afterInit.call(this);
    this.screenMask = new ScreenMask((function(_this) {
      return function() {
        if (_this.closeMode === 'hide') {
          return _this.hide();
        } else {
          return _this.close();
        }
      };
    })(this));
  };

  Popover.prototype.beforeRender = function() {
    Popover.__super__.beforeRender.apply(this, arguments);
    this.el.addClass("in " + this.placement + " popover-" + this.type);
    this.el.set('role', 'tooltip');
    this.el.set('html', '<div class="arrow"></div>' + '<h3 miwo-reference="titleEl" class="popover-title"></h3>' + '<div miwo-reference="contentEl" class="popover-content"></div>');
  };

  Popover.prototype.show = function() {
    this.screenMask.show();
    Popover.__super__.show.call(this);
  };

  Popover.prototype.hide = function() {
    this.screenMask.hide();
    Popover.__super__.hide.call(this);
  };

  Popover.prototype.afterRender = function() {
    Popover.__super__.afterRender.apply(this, arguments);
    if (this.title) {
      this.setTitle(this.title);
    }
    if (this.content) {
      this.setContent(this.content);
    }
  };

  Popover.prototype.setTitle = function(title) {
    this.title = title;
    if (this.rendered) {
      this.titleEl.set("html", title);
      this.updatePosition();
    }
  };

  Popover.prototype.setContent = function(content) {
    this.content = content;
    if (this.rendered) {
      this.contentEl.set("html", content);
      this.updatePosition();
    }
  };

  Popover.prototype.addedComponent = function(component) {
    if (this.rendered) {
      this.updatePosition();
    }
  };

  Popover.prototype.removedComponent = function(component) {
    if (this.rendered) {
      this.updatePosition();
    }
  };

  Popover.prototype.doDestroy = function() {
    this.screenMask.destroy();
    Popover.__super__.doDestroy.call(this);
  };

  return Popover;

})(BaseTip);

module.exports = Popover;


},{"../utils/ScreenMask":99,"./BaseTip":88}],91:[function(require,module,exports){
var BaseTipManager, Popover, PopoverManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTipManager = require('./BaseTipManager');

Popover = require('./Popover');

PopoverManager = (function(_super) {
  __extends(PopoverManager, _super);

  function PopoverManager() {
    return PopoverManager.__super__.constructor.apply(this, arguments);
  }

  PopoverManager.prototype.selector = '[data-toggle="popover"]';

  PopoverManager.prototype.create = function(target, config) {
    var container, content, delay, distance, placement, popover, title;
    if (config == null) {
      config = {};
    }
    if (!target) {
      throw new Error("Target is not defined");
    }
    title = config.title || target.get("data-title") || target.get("title");
    content = config.content || target.get("data-content") || '';
    container = config.container || target.get("data-container");
    placement = config.placement || target.get("data-placement") || this.placement;
    distance = config.distance || target.get("data-distance") || this.distance;
    delay = config.delay || target.get("data-delay") || this.delay;
    if (!title) {
      return;
    }
    popover = new Popover({
      target: target,
      title: title,
      content: content,
      container: container,
      placement: placement,
      distance: distance
    });
    return popover;
  };

  return PopoverManager;

})(BaseTipManager);

module.exports = PopoverManager;


},{"./BaseTipManager":89,"./Popover":90}],92:[function(require,module,exports){
var BaseTip, Tooltip,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTip = require('./BaseTip');

Tooltip = (function(_super) {
  __extends(Tooltip, _super);

  function Tooltip() {
    return Tooltip.__super__.constructor.apply(this, arguments);
  }

  Tooltip.prototype.text = null;

  Tooltip.prototype.baseCls = 'tooltip';

  Tooltip.prototype.setText = function(text) {
    this.text = text;
    if (!this.rendered) {
      return;
    }
    this.contentEl.set('html', text);
    this.updatePosition();
  };

  Tooltip.prototype.beforeRender = function() {
    Tooltip.__super__.beforeRender.apply(this, arguments);
    this.el.addClass("in " + this.placement + " tooltip-" + this.type);
    this.el.set('role', 'tooltip');
    this.el.set('html', '<div class="tooltip-arrow"></div><div miwo-reference="contentEl" class="tooltip-inner"></div>');
  };

  Tooltip.prototype.afterRender = function() {
    Tooltip.__super__.afterRender.apply(this, arguments);
    if (this.text) {
      this.setText(this.text);
    }
  };

  return Tooltip;

})(BaseTip);

module.exports = Tooltip;


},{"./BaseTip":88}],93:[function(require,module,exports){
var BaseTipManager, Tooltip, TooltipManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseTipManager = require('./BaseTipManager');

Tooltip = require('./Tooltip');

TooltipManager = (function(_super) {
  __extends(TooltipManager, _super);

  function TooltipManager() {
    return TooltipManager.__super__.constructor.apply(this, arguments);
  }

  TooltipManager.prototype.create = function(target, config) {
    var container, delay, distance, placement, title, tooltip;
    if (config == null) {
      config = {};
    }
    title = config.title || target.get("data-title") || target.get("title");
    container = config.container || target.get("data-container");
    placement = config.placement || target.get("data-placement") || this.placement;
    distance = config.distance || target.get("data-distance") || this.distance;
    delay = config.delay || target.get("data-delay") || this.delay;
    if (!title) {
      return;
    }
    tooltip = new Tooltip({
      target: target,
      text: title,
      placement: placement,
      distance: distance
    });
    return tooltip;
  };

  return TooltipManager;

})(BaseTipManager);

module.exports = TooltipManager;


},{"./BaseTipManager":89,"./Tooltip":92}],94:[function(require,module,exports){
module.exports = {
  BaseTip: require('./BaseTip'),
  Popover: require('./Popover'),
  Tooltip: require('./Tooltip')
};


},{"./BaseTip":88,"./Popover":90,"./Tooltip":92}],95:[function(require,module,exports){
module.exports = {
  nav: {
    prev: 'Previous',
    next: 'Next',
    current: 'Current'
  },
  grid: {
    execute: 'Do',
    confirm: 'Confirm'
  },
  dialog: {
    ok: 'Ok',
    cancel: 'Cancel'
  },
  window: {
    close: 'Close window',
    hide: 'Hide window'
  }
};


},{}],96:[function(require,module,exports){
var Color;

Color = (function() {
  function Color() {}

  Color.prototype.r = 0;

  Color.prototype.g = 0;

  Color.prototype.b = 0;

  Color.prototype.h = 0;

  Color.prototype.s = 0;

  Color.prototype.v = 0;

  Color.prototype.hex = "";

  Color.prototype.setRgb = function(r, g, b) {
    var hsv;
    if (r !== null) {
      this.r = r;
    }
    if (g !== null) {
      this.g = g;
    }
    if (b !== null) {
      this.b = b;
    }
    hsv = Color.rgbToHsv(this);
    this.h = hsv.h;
    this.s = hsv.s;
    this.v = hsv.v;
    this.hex = Color.rgbToHex(this);
  };

  Color.prototype.setHsv = function(h, s, v) {
    var rgb;
    if (h !== null) {
      this.h = h;
    }
    if (s !== null) {
      this.s = s;
    }
    if (v !== null) {
      this.v = v;
    }
    rgb = Color.hsvToRgb(this);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    this.hex = Color.rgbToHex(rgb);
  };

  Color.prototype.setHex = function(hex) {
    var hsv, rgb;
    this.hex = hex;
    rgb = Color.hexToRgb(this.hex);
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    hsv = Color.rgbToHsv(rgb);
    this.h = hsv.h;
    this.s = hsv.s;
    this.v = hsv.v;
  };

  return Color;

})();

Color.fromRgb = function(r, g, b) {
  var object;
  object = new Color();
  object.setRgb(r, g, b);
  return object;
};

Color.fromHsv = function(h, s, v) {
  var object;
  object = new Color();
  object.setHsv(h, s, v);
  return object;
};

Color.fromHex = function(hex) {
  var object;
  object = new Color();
  object.setHex(hex);
  return object;
};

Color.rgbToHex = function(rgb) {
  return this.intToHex(rgb.r) + this.intToHex(rgb.g) + this.intToHex(rgb.b);
};

Color.hexToRgb = function(hex) {
  var b, g, r;
  r = "00";
  g = "00";
  b = "00";
  if (hex.length === 6) {
    r = hex.substring(0, 2);
    g = hex.substring(2, 4);
    b = hex.substring(4, 6);
  } else {
    if (hex.length > 4) {
      r = hex.substring(4, hex.length);
      hex = hex.substring(0, 4);
    }
    if (hex.length > 2) {
      g = hex.substring(2, hex.length);
      hex = hex.substring(0, 2);
    }
    if (hex.length > 0) {
      b = hex.substring(0, hex.length);
    }
  }
  return {
    r: this.hexToInt(r),
    g: this.hexToInt(g),
    b: this.hexToInt(b)
  };
};

Color.hsvToRgb = function(hsv) {
  var f, h, i, p, q, rgb, s, t, v;
  rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  h = hsv.h;
  s = hsv.s;
  v = hsv.v;
  if (s === 0) {
    if (v === 0) {
      rgb.r = rgb.g = rgb.b = 0;
    } else {
      rgb.r = rgb.g = rgb.b = parseInt(v * 255 / 100, 10);
    }
  } else {
    if (h === 360) {
      h = 0;
    }
    h /= 60;
    s = s / 100;
    v = v / 100;
    i = parseInt(h, 10);
    f = h - i;
    p = v * (1 - s);
    q = v * (1 - (s * f));
    t = v * (1 - (s * (1 - f)));
    switch (i) {
      case 0:
        rgb.r = v;
        rgb.g = t;
        rgb.b = p;
        break;
      case 1:
        rgb.r = q;
        rgb.g = v;
        rgb.b = p;
        break;
      case 2:
        rgb.r = p;
        rgb.g = v;
        rgb.b = t;
        break;
      case 3:
        rgb.r = p;
        rgb.g = q;
        rgb.b = v;
        break;
      case 4:
        rgb.r = t;
        rgb.g = p;
        rgb.b = v;
        break;
      case 5:
        rgb.r = v;
        rgb.g = p;
        rgb.b = q;
    }
    rgb.r = parseInt(rgb.r * 255, 10);
    rgb.g = parseInt(rgb.g * 255, 10);
    rgb.b = parseInt(rgb.b * 255, 10);
  }
  return rgb;
};

Color.rgbToHsv = function(rgb) {
  var b, delta, g, hsv, max, min, r;
  r = rgb.r / 255;
  g = rgb.g / 255;
  b = rgb.b / 255;
  hsv = {
    h: 0,
    s: 0,
    v: 0
  };
  min = 0;
  max = 0;
  if (r >= g && r >= b) {
    max = r;
    min = (g > b ? b : g);
  } else if (g >= b && g >= r) {
    max = g;
    min = (r > b ? b : r);
  } else {
    max = b;
    min = (g > r ? r : g);
  }
  hsv.v = max;
  hsv.s = (max ? (max - min) / max : 0);
  if (!hsv.s) {
    hsv.h = 0;
  } else {
    delta = max - min;
    if (r === max) {
      hsv.h = (g - b) / delta;
    } else if (g === max) {
      hsv.h = 2 + (b - r) / delta;
    } else {
      hsv.h = 4 + (r - g) / delta;
    }
    hsv.h = parseInt(hsv.h * 60, 10);
    if (hsv.h < 0) {
      hsv.h += 360;
    }
  }
  hsv.s = parseInt(hsv.s * 100, 10);
  hsv.v = parseInt(hsv.v * 100, 10);
  return hsv;
};

Color.hexToInt = function(hex) {
  return parseInt(hex, 16);
};

Color.intToHex = function(dec) {
  var result;
  result = parseInt(dec, 10).toString(16);
  if (result.length === 1) {
    result = "0" + result;
  }
  return result.toUpperCase();
};

module.exports = Color;


},{}],97:[function(require,module,exports){
var LoadMask,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

LoadMask = (function(_super) {
  __extends(LoadMask, _super);

  function LoadMask() {
    return LoadMask.__super__.constructor.apply(this, arguments);
  }

  LoadMask.prototype.target = null;

  return LoadMask;

})(Miwo.Object);

module.exports = LoadMask;


},{}],98:[function(require,module,exports){
var Paginator,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Paginator = (function(_super) {
  __extends(Paginator, _super);

  function Paginator() {
    return Paginator.__super__.constructor.apply(this, arguments);
  }

  Paginator.prototype.base = 1;

  Paginator.prototype.itemsPerPage = 1;

  Paginator.prototype.page = null;

  Paginator.prototype.itemCount = null;

  Paginator.prototype.getFirstPage = function() {
    return this.base;
  };

  Paginator.prototype.getLastPage = function() {
    if (this.itemCount === null) {
      return null;
    } else {
      return this.base + Math.max(0, this.getPageCount() - 1);
    }
  };

  Paginator.prototype.isFirst = function() {
    return this.page === 1 || this.page === null;
  };

  Paginator.prototype.isLast = function() {
    if (this.itemCount === null) {
      return true;
    } else {
      return this.page === this.getLastPage();
    }
  };

  Paginator.prototype.getPageCount = function() {
    if (this.itemCount === null) {
      return null;
    } else {
      return Math.ceil(this.itemCount / this.itemsPerPage);
    }
  };

  Paginator.prototype.setItemsPerPage = function(itemsPerPage) {
    this.itemsPerPage = Math.max(1, parseInt(itemsPerPage));
    this.emit('itemsperpage', this, this.itemsPerPage);
    return this;
  };

  Paginator.prototype.setItemCount = function(itemCount) {
    this.itemCount = Math.max(0, parseInt(itemCount));
    this.emit('itemcount', this, this.itemCount);
    return this;
  };

  Paginator.prototype.setPage = function(page) {
    page = parseInt(page);
    if (page !== this.page) {
      this.page = page;
      this.emit('page', this, this.page);
    }
    return this;
  };

  return Paginator;

})(Miwo.Object);

module.exports = Paginator;


},{}],99:[function(require,module,exports){
var ScreenMask;

ScreenMask = (function() {
  function ScreenMask(handler) {
    this.el = new Element('div', {
      cls: 'screen-mask'
    });
    this.el.on('click', (function(_this) {
      return function(event) {
        event.stop();
        handler();
      };
    })(this));
    return;
  }

  ScreenMask.prototype.show = function() {
    this.el.inject(miwo.body);
  };

  ScreenMask.prototype.hide = function() {
    this.el.dispose();
  };

  ScreenMask.prototype.destroy = function() {
    this.hide();
    this.el.destroy();
  };

  return ScreenMask;

})();

module.exports = ScreenMask;


},{}],100:[function(require,module,exports){
module.exports = {
  LoadMask: require('./LoadMask'),
  ScreenMask: require('./ScreenMask'),
  Color: require('./Color')
};


},{"./Color":96,"./LoadMask":97,"./ScreenMask":99}],101:[function(require,module,exports){
var Dialog, Window,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Window = require('./Window');

Dialog = (function(_super) {
  __extends(Dialog, _super);

  function Dialog() {
    return Dialog.__super__.constructor.apply(this, arguments);
  }

  Dialog.prototype.xtype = 'dialog';

  Dialog.prototype.beforeInit = function() {
    Dialog.__super__.beforeInit.call(this);
    this.closeOnClickOut = true;
    this.closeMode = "close";
    this.componentCls = "miwo-dialog";
  };

  Dialog.prototype.afterRender = function() {
    Dialog.__super__.afterRender.call(this);
    this.el.set('role', 'dialog');
    this.keyListener.on('enter', (function(_this) {
      return function() {
        var button, _i, _len, _ref;
        _ref = _this.buttons;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          button = _ref[_i];
          if (button.type === 'primary') {
            button.click();
            break;
          }
        }
      };
    })(this));
  };

  return Dialog;

})(Window);

module.exports = Dialog;


},{"./Window":104}],102:[function(require,module,exports){
var Button, Dialog, DialogFactory;

Dialog = require('./Dialog');

Button = require('../buttons/Button');

DialogFactory = (function() {
  function DialogFactory() {}

  DialogFactory.prototype.createDialog = function(title, message, buttons) {
    var dialog;
    dialog = new Dialog();
    dialog.render(miwo.body);
    dialog.setTitle(title);
    dialog.setContent("<p>" + message + "</p>");
    dialog.setButtons(buttons);
    dialog.show();
    return dialog;
  };

  DialogFactory.prototype.alert = function(title, message, cb, btnText) {
    var dialog, okBtn;
    okBtn = new Button({
      name: 'ok',
      type: "primary",
      text: (btnText ? btnText : miwo.tr("miwo.dialog.ok")),
      handler: function() {
        if (cb) {
          cb(true);
        }
        dialog.close();
      }
    });
    dialog = this.createDialog(title, message, [okBtn]);
    return dialog;
  };

  DialogFactory.prototype.prompt = function(title, message, cb, okBtnText, noBtnText) {
    var cancelBtn, dialog, okBtn;
    okBtn = new Button({
      name: 'ok',
      type: "primary",
      text: (okBtnText ? okBtnText : miwo.tr("miwo.dialog.ok")),
      handler: function() {
        if (cb) {
          cb(true);
        }
        dialog.close();
      }
    });
    cancelBtn = new Button({
      name: 'cancel',
      type: 'default',
      text: (noBtnText ? noBtnText : miwo.tr("miwo.dialog.cancel")),
      handler: function() {
        if (cb) {
          cb(false);
        }
        dialog.close();
      }
    });
    dialog = this.createDialog(title, message, [okBtn, cancelBtn]);
    return dialog;
  };

  DialogFactory.prototype.promptIf = function(title, message, cb, okBtnText, noBtnText) {
    var dialog;
    dialog = this.prompt(title, message, (function(state) {
      if (cb && state) {
        cb();
      }
    }), okBtnText, noBtnText);
    return dialog;
  };

  return DialogFactory;

})();

module.exports = DialogFactory;


},{"../buttons/Button":6,"./Dialog":101}],103:[function(require,module,exports){
var Form, FormWindow, Window,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Window = require('./Window');

Form = require('../form/container/Form');

FormWindow = (function(_super) {
  __extends(FormWindow, _super);

  function FormWindow() {
    return FormWindow.__super__.constructor.apply(this, arguments);
  }

  FormWindow.getter('form', function() {
    return this.getForm();
  });

  FormWindow.prototype.doInit = function() {
    var form;
    FormWindow.__super__.doInit.apply(this, arguments);
    form = this.add('form', new Form);
    form.on('submit', (function(_this) {
      return function(form, isValid) {
        return _this.emit('submit', _this, form, isValid);
      };
    })(this));
    form.on('success', (function(_this) {
      return function(form) {
        return _this.emit('success', _this, form);
      };
    })(this));
    form.on('failure', (function(_this) {
      return function(form) {
        return _this.emit('failure', _this, form);
      };
    })(this));
  };

  FormWindow.prototype.getForm = function() {
    return this.get('form');
  };

  FormWindow.prototype.addSubmitButton = function(text) {
    return this.addButton('submit', {
      text: text,
      type: 'primary',
      handler: (function(_this) {
        return function() {
          return _this.getForm().submit();
        };
      })(this)
    });
  };

  FormWindow.prototype.setFocus = function() {
    FormWindow.__super__.setFocus.call(this);
    this.getForm().getFocusControl().setFocus();
  };

  return FormWindow;

})(Window);

module.exports = FormWindow;


},{"../form/container/Form":19,"./Window":104}],104:[function(require,module,exports){
var Button, ToolButton, Window,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Button = require('../buttons/Button');

ToolButton = require('../buttons/ToolButton');

Window = (function(_super) {
  __extends(Window, _super);

  function Window() {
    return Window.__super__.constructor.apply(this, arguments);
  }

  Window.prototype.isWindow = true;

  Window.prototype.xtype = 'window';

  Window.prototype.closeMode = 'hide';

  Window.prototype.closeOnClickOut = true;

  Window.prototype.closeOnEsc = true;

  Window.prototype.closeable = true;

  Window.prototype.minimizable = false;

  Window.prototype.title = '';

  Window.prototype.autoCenter = true;

  Window.prototype.preventAutoRender = true;

  Window.prototype.modal = true;

  Window.prototype.buttons = null;

  Window.prototype.titleEl = null;

  Window.prototype.contentEl = null;

  Window.prototype.footerEl = null;

  Window.prototype.toolsEl = null;

  Window.prototype.keyListener = null;

  Window.prototype.tools = null;

  Window.prototype.beforeInit = function() {
    Window.__super__.beforeInit.call(this);
    this.zIndexManage = true;
    this.contentEl = 'div';
    this.baseCls = 'window';
    this.visible = false;
    this.width = 600;
    this.top = 30;
    this.renderTo = miwo.body;
    this.buttons = new Miwo.utils.Collection();
    this.tools = new Miwo.utils.Collection();
  };

  Window.prototype.afterInit = function() {
    Window.__super__.afterInit.call(this);
    miwo.windowMgr.register(this);
  };

  Window.prototype.open = function() {
    this.show();
  };

  Window.prototype.close = function(destroy, silent) {
    if (destroy == null) {
      destroy = false;
    }
    if (!destroy && this.closeMode === 'hide') {
      this.doHide();
    } else {
      this.preventClose = false;
      if (!silent) {
        this.emit('beforeclose', this);
      }
      if (this.preventClose) {
        return;
      }
      this.doClose();
      this.emit('close', this);
      this.destroy();
    }
  };

  Window.prototype.setTitle = function(title) {
    this.title = title;
    if (this.titleEl) {
      this.titleEl.set("html", title);
    }
  };

  Window.prototype.doShow = function() {
    Window.__super__.doShow.call(this);
    this.toFront();
  };

  Window.prototype.doHide = function() {
    Window.__super__.doHide.call(this);
    this.toBack();
  };

  Window.prototype.doClose = function() {
    this.hide();
  };

  Window.prototype.beforeRender = function() {
    Window.__super__.beforeRender.call(this);
    this.el.addClass('modal-dialog');
    this.el.set('html', "<div class=\"miwo-window-content modal-content\">\n	<div miwo-reference=\"headerEl\" class=\"miwo-window-header modal-header\">\n		<div miwo-reference=\"toolsEl\" class='miwo-window-tools'></div>\n		<h4 miwo-reference=\"titleEl\" class='miwo-window-title modal-title'>" + this.title + "</h4>\n	</div>\n	<div miwo-reference=\"contentEl\" class=\"miwo-window-body modal-body\"></div>\n	<div miwo-reference=\"footerEl\" class=\"miwo-window-footer modal-footer\"></div>\n</div>");
  };

  Window.prototype.afterRender = function() {
    var button, name, _ref;
    Window.__super__.afterRender.call(this);
    this.keyListener = new Miwo.utils.KeyListener(this.el);
    this.keyListener.on('esc', (function(_this) {
      return function() {
        if (_this.closeOnEsc) {
          _this.close();
        }
      };
    })(this));
    this.el.set('aria-labelledby', this.id + 'Label');
    this.titleEl.set('id', this.id + 'Label');
    if (this.closeable) {
      this.addTool('close', {
        icon: 'remove',
        text: miwo.tr('miwo.window.close'),
        handler: (function(_this) {
          return function() {
            return _this.close();
          };
        })(this)
      });
    }
    if (this.minimizable) {
      this.addTool('hide', {
        icon: 'minus',
        text: miwo.tr('miwo.window.hide'),
        handler: (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this)
      });
    }
    if (!this.modal) {
      miwo.body.on('click', this.bound('onBodyClick'));
    }
    _ref = this.buttons.items;
    for (name in _ref) {
      button = _ref[name];
      if (!button.rendered) {
        button.render(this.footerEl);
      }
    }
  };

  Window.prototype.onBodyClick = function(e) {
    if (this.isVisible() && e.target === this.el) {
      return;
    }
    if (e.target.getParent('.miwo-window') === this.el) {
      return;
    }
    if (this.closeOnClickOut) {
      this.close();
    }
  };

  Window.prototype.onOverlayClick = function() {
    if (this.closeOnClickOut) {
      this.close();
    }
  };

  Window.prototype.setContent = function(string) {
    this.contentEl.set("html", string);
  };

  Window.prototype.setButtons = function(buttons) {
    var button, _i, _j, _len, _len1, _ref;
    _ref = this.buttons;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      button = _ref[_i];
      button.destroy();
    }
    this.buttons.empty();
    for (_j = 0, _len1 = buttons.length; _j < _len1; _j++) {
      button = buttons[_j];
      this.addButton(button.name, button);
    }
  };

  Window.prototype.addButton = function(name, button) {
    if (!Type.isInstance(button)) {
      button = new Button(button);
    }
    this.buttons.set(name, button);
    if (this.footerEl) {
      button.render(this.footerEl);
    }
    return button;
  };

  Window.prototype.addCloseButton = function(text) {
    return this.addButton('close', {
      text: text,
      handler: (function(_this) {
        return function() {
          return _this.close();
        };
      })(this)
    });
  };

  Window.prototype.getButton = function(name) {
    return this.buttons.get(name);
  };

  Window.prototype.addTool = function(name, button) {
    if (!Type.isInstance(button)) {
      button = new ToolButton(button);
    }
    this.tools.set(name, button);
    button.render(this.toolsEl);
    return button;
  };

  Window.prototype.getTool = function(name) {
    return this.tools.get(name);
  };

  Window.prototype.doDestroy = function() {
    miwo.windowMgr.unregister(this);
    miwo.body.un('click', this.bound('onBodyClick'));
    if (this.keyListener) {
      this.keyListener.destroy();
    }
    this.buttons.destroy();
    this.tools.destroy();
    Window.__super__.doDestroy.call(this);
  };

  return Window;

})(Miwo.Container);

module.exports = Window;


},{"../buttons/Button":6,"../buttons/ToolButton":9}],105:[function(require,module,exports){
var WindowManager;

WindowManager = (function() {
  WindowManager.prototype.list = null;

  function WindowManager() {
    this.list = new Miwo.utils.Collection();
    return;
  }

  WindowManager.prototype.register = function(comp) {
    if (comp.windowMgr) {
      comp.windowMgr.unregister(comp);
    }
    comp.windowMgr = this;
    this.list.set(comp.id, comp);
  };

  WindowManager.prototype.unregister = function(comp) {
    if (this.list.has(comp.id)) {
      this.list.remove(comp.id);
      delete comp.windowMgr;
    }
  };

  WindowManager.prototype.get = function(id) {
    return this.list.get(id);
  };

  WindowManager.prototype.getBy = function(name, value) {
    return this.list.getBy(name, value);
  };

  return WindowManager;

})();

module.exports = WindowManager;


},{}],106:[function(require,module,exports){
module.exports = {
  Window: require('./Window'),
  FormWindow: require('./FormWindow'),
  Dialog: require('./Dialog')
};


},{"./Dialog":101,"./FormWindow":103,"./Window":104}]},{},[55])