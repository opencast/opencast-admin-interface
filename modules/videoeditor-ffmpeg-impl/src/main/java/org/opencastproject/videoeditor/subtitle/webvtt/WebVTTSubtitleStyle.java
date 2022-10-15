/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */
package org.opencastproject.videoeditor.subtitle.webvtt;

import java.util.ArrayList;
import java.util.List;

public class WebVTTSubtitleStyle {
  private List<String> lines;

  public WebVTTSubtitleStyle() {
    this.lines = new ArrayList<>();
  }

  public List<String> getLines() {
    return this.lines;
  }
  public void setLines(List<String> lines) {
    this.lines = lines;
  }
  public void addLine(String line) {
    this.lines.add(line);
  }
}