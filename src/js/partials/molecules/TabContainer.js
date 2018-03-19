"use strict";

import Controller from 'gp-module-base/Controller';
import DomModel from 'gp-module-base/DomModel';

import Template from '../../base/Template';
import tabTmpl from './tmpl/tabContainerTab.hbs';
import optionTmpl from './tmpl/tabContainerOption.hbs';


const CSS_CLASS_ACTIVE = 'js--active';

class Events_Model {
    static onRender() {
        render.bind(this)();
    }
    static onChangeIndex(model, index) {
        // Tab
        if (model.lastIndex > -1) {
            this.elements.tabs[model.lastIndex].classList.remove(CSS_CLASS_ACTIVE);
        }
        // Container
        if (model.lastIndex >= 0) {
            this.elements.containers[model.lastIndex].classList.remove(CSS_CLASS_ACTIVE);
        }
        if (index > -1) {
            this.elements.tabs[index].classList.add(CSS_CLASS_ACTIVE);
            this.elements.dropdown.selectedIndex = index;
            this.elements.containers[index].classList.add(CSS_CLASS_ACTIVE);
            model.lastIndex = index;
        }
    }
    static onHideTabs() {
        Array.from(this.elements.navigation.children).forEach((el, i) => {
            if (this.model.hiddenTabs.indexOf(this.model.names[i]) > -1) {
                el.style.display = 'none';
            } else {
                el.style.display = null;
            }
        });
    }
}
class Events_Dom {
    static onChange(e) {
        const index = e.target.selectedIndex;
        if (this.model.index === index) {
            this.model.index = -1;
        } else {
            this.model.index = index;
        }
    }
    static onClick(e) {
        const index = this.elements.tabs.indexOf(e.target);
        if (this.model.index === index) {
            this.model.index = -1;
        } else {
            this.model.index = index;
        }
    }
}


export default Controller.extend({

    tabTmpl: new Template(tabTmpl),
    optionTmpl: new Template(optionTmpl),

    modelConstructor: DomModel.extend({
        session: {
            hiddenTabs: {
                type: 'array',
                required: true
            },
            ready: {
                type: 'boolean',
                required: true
            },
            index: {
                type: 'number',
                required: true,
                default: -1
            },
            lastIndex: {
                type: 'number',
                required: true,
                default: -1
            },
            names: {
                type: 'array',
                required: true
            },
            autoOpen: {
                type: 'boolean',
                required: true,
                default: true
            }
        },
        openByName(name) {
            // console.log(name, this.names.indexOf(name));
            this.index = this.names.indexOf(name);
        },
        render() {
            this.trigger('TabContainer:render');
        },

        showTab(name) {
            if (this.hiddenTabs.indexOf(name) > -1) {
                this.hiddenTabs.splice(this.hiddenTabs.indexOf(name), 1);
                this.trigger('TabContainer:hideTabs');
            }
        },
        hideTab(name) {
            if (this.hiddenTabs.indexOf(name) === -1) {
                this.hiddenTabs.push(name);
                this.trigger('TabContainer:hideTabs');
            }
        }
    }),

    bindings: {
        'model.ready': {
            type: 'booleanClass',
            name: 'js--ready'
        }
    },

    events: {
        'change [data-hook="tabContainerNavigationDropDown"]': Events_Dom.onChange,
        'click [data-hook="tabContainerNavigation"] li': Events_Dom.onClick
    },


    initialize() {
        Controller.prototype.initialize.apply(this, arguments);
        this.model.on('change:index', Events_Model.onChangeIndex, this);
        this.model.on('TabContainer:render', Events_Model.onRender, this);
        this.model.on('TabContainer:hideTabs', Events_Model.onHideTabs, this);
        this.elements = {
            dropdown: this.queryByHook('tabContainerNavigationDropDown'),
            navigation: this.queryByHook('tabContainerNavigation'),
            wrapper: this.queryByHook('tabContainerTabs')
        };
        this.setup();
        this.targetSetup();
    },

    targetSetup() {
        if (this.targetModel) {
            this.targetModel.tabContainer = this.model;
        }
    },

    setup() {
        render.bind(this)();
        this.model.ready = true;

    }

});

function render() {
    this.elements.containers = Array.from(this.elements.wrapper.children);
    this.elements.dropdown.innerHTML = '';
    this.elements.navigation.innerHTML = '';
    this.elements.containers.forEach(container => {
        this.elements.dropdown.appendChild(this.optionTmpl.toFragment({
            title: container.dataset.title
        }));
        this.elements.navigation.appendChild(this.tabTmpl.toFragment({
            title: container.dataset.title
        }));
        this.model.names.push(container.dataset.name);
    });
    this.elements.tabs = Array.from(this.elements.navigation.children);
    if (this.model.autoOpen) {
        this.model.index = 0;
    }
}
