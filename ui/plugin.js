/**
 * @license
 * Copyright (C) 2020 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RULES } from "./rules.js";

export class StartBlockEl extends Polymer.Element {
  static get is() {
    return "start-block";
  }

  static get template() {
    return Polymer.html`
        <style include="shared-styles">
          a.info {
            float: right;
          }
          .condition-editor,
          .condition-previewer {
            margin: var(--spacing-s) 0;
            padding: var(--spacing-s);
            border: 1px dashed var(--border-color);
          }
          iron-icon {
            cursor: pointer;
          }
        </style>
        <div class="conditions-wrapper">
          <span>
          Startblock:
          </span>
          <gr-dropdown-list
            id="ruleSelector"
            value="[[selectedRule.id]]"
            on-value-change="_handleSelectedRuleChange"
            items="[[rules]]"
            text="Add new conditions"
          >
          </gr-dropdown-list>
          <template is="dom-if" if="[[!autoSubmitEnabled]]">
            <gr-button link on-click="setUpAutoSubmit">Autosubmit</gr-button>
          </template>
          <a
            href=""
            target="_blank"
            class="info"
          >
            <iron-icon
              icon="gr-icons:help-outline"
              title="read documentation"
            ></iron-icon>
          </a>
        </div>
        <template is="dom-if" if="[[selectedRule.inputs]]">
          <div class="condition-editor">
            <template is="dom-repeat" items="[[selectedRule.inputs]]" as="input" index-as="inputIdx">
              <template is="dom-if" if="[[_isTextType(input)]]">
                <iron-input bind-value="{{input.value}}">
                  <input placeholder="[[input.placeholder]]" />
                </iron-input>
              </template>
              <template is="dom-if" if="[[_isDropdownType(input)]]">
                <gr-dropdown-list
                  data-idx$="[[inputIdx]]"
                  on-value-change="_handleInputOnDropdown"
                  items="[[_formatInputItems(input.items)]]"
                  text="[[input.placeholder]]"
                >
                </gr-dropdown-list>
              </template>
            </template>
            <gr-button link on-click="_addSelectedRule">Add</gr-button>
          </div>
        </template>
        <template is="dom-if" if="[[_computeShowPreview(configuredRules.length)]]">
          <div class="condition-previewer">
            <p>Added conditions:</p>
            <template is="dom-repeat" items="[[configuredRules]]" as="rule" index-as="idx">
              <p>
                <span>[[rule]]</span>
                <iron-icon
                  icon="gr-icons:close"
                  title="remove the rule"
                  data-idx$="[[idx]]"
                  on-click="removeRule"
                ></iron-icon>
              </p>
            </template>
            <gr-button link on-click="_confirmRules">Set up</gr-button>
          </div>
        </template>
      `;
  }

  static get properties() {
    return {
      change: Object,
      selectedRule: {
        type: Object,
        value() {
          // empty rule
          return {};
        }
      },
      autoSubmitEnabled: {
        type: Boolean,
        value: false,
      },
      rules: {
        type: Array,
        computed: "_computeRules(change)",
      },
      // This will be retrieved from change message if exist already
      configuredRules: {
        type: Array,
        value() {
          return [];
        }
      }
    };
  }

  _isTextType(input) {
    return input.type === "text";
  }

  _isDropdownType(input) {
    return input.type === "dropdown";
  }

  _formatInputItems(items) {
    return items.map(item => ({text: item, value: item}));
  }

  _addSelectedRule() {
    this.push('configuredRules', this.selectedRule.toString());
    this.selectedRule = null;
    this.$.ruleSelector.text = "Add new condition";
  }

  _handleSelectedRuleChange(e) {
    this.selectedRule = RULES.get(e.detail.value);
    if (!this.selectedRule) {
      // Should not happen
      throw new Error("Invalid rule selected!");
    }

    // if rule doesn't have inputs, consider it as select to add
    if (!this.selectedRule.inputs) {
      this._addSelectedRule();
    }
  }

  _handleInputOnDropdown(e) {
    const inputIdx = e.target.dataset.idx;
    const inputValue = e.detail.value;
    this.selectedRule.inputs[inputIdx].value = inputValue;
  }

  _computeRules(change) {
    console.log(change);
    return [...RULES.entries()].map(([ruleId, rule]) => {
      return {
        text: rule.description,
        value: ruleId,
      }
    });
  }

  _computeShowPreview(length) {
    return length !== 0;
  }

  removeRule(e) {
    const idx = e.target.dataset.idx;
    if (this.configuredRules[idx] === "AutoSubmit") {
      this.autoSubmitEnabled = false;
    }
    this.splice('configuredRules', idx, 1);
  }

  setUpAutoSubmit() {
    console.log(this.content);
    this.autoSubmitEnabled = true;
    this.push('configuredRules', 'AutoSubmit');
  }

  _confirmRules() {
    const ruleStr = this.configuredRules.join("\n  ");
    this.content.text = this.content.text + "\nStartblock:\n  " + ruleStr;
  }
}

customElements.define(StartBlockEl.is, StartBlockEl);

window.Gerrit.install(plugin => {
  plugin.registerCustomComponent("reply-text", StartBlockEl.is);
});
