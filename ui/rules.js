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

/**
 * A set of rules supported for start block.
 */
export const RULES = new Map();

class Rule {
  constructor(id, details = {}) {
    this.id = id;
    this.details = details;

    this.checkIfValid();
  }

  checkIfValid() {
    if (!this.id) {
      throw new Error("ID is required when define a rule.")
    }

    if (!this.description) {
      throw new Error("Description is required when define a rule.")
    }

    if (this.inputs && (!this.format || typeof this.format !== "function")) {
      throw new Error("Format function is required when your rule has inputs.")
    }

    if (this.inputs && this.inputs.some(input => !["text", "dropdown"].includes(input.type))) {
      throw new Error("Only support text or dropdown type");
    }
  }

  get description() {
    return this.details.description;
  }

  get inputs() {
    return this.details.inputs;
  }

  get format() {
    return this.details.format;
  }

  toString(inputs) {
    // TODO: maybe consider restrict the rule a bit more so that we can parse
    // description to construct the format function
    if (!inputs && this.inputs) {
      inputs = this.inputs.map(input => input.value);
    }
    return this.format(inputs || []);
  }
}

const dateTimeRule = new Rule('datetime-timezone', {
  description: "after <datetime> [in <timezone>]",
  inputs: [
    {type: 'text', placeholder: "YYYY-MM-DD HH:MM"},
    {type: 'text', placeholder: "timezone, optional(PST)"},
  ],
  format(inputs) {
    return `after ${inputs[0]}` + (inputs[1] ? ` in ${inputs[1]}` : '');
  }
});
RULES.set(dateTimeRule.id, dateTimeRule);

const gerritChangeStatusRule = new Rule('gerrit-change-status', {
  description: "after change/<change-id> <approved/submitted>",
  inputs: [
    {type: 'text', placeholder: "change id, e.g 276353"},
    {type: 'dropdown', placeholder: "status of the change", items: ["approved", "submitted"]},
  ],
  format(inputs) {
    return `after change/${inputs[0]} ${inputs[1]}`;
  }
});

RULES.set(gerritChangeStatusRule.id, gerritChangeStatusRule);