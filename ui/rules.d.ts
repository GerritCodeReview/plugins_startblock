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

// This file is to help understand the structure of the Rules and also
// can benefit us if we need to move to typescript some day

export enum RuleInputType {
  TEXT = "text",
  DROP_DOWN = "dropdown",
}

interface RuleInput {
  type: RuleInputType;
  placeholder: string; // description of the input
  items?: string[]; // required for dropdown type, list of candidates
  value?: string; // value field, if filled, use as default value
}

interface Rule {
  readonly id: string;
  readonly description: string;
  readonly inputs?: RuleInput[];
  toString(values?: string[]): string; // function to format the condition based on all inputs, , if not provided, will just use all values from the `inputs`
}

interface RuleDetail {
  description: string
  inputs?: RuleInput[];
  format(values: string[]): string; // if no inputs, values will be empty array
}